"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import StaffSlotModal, { StaffSlotBooking } from "@/app/admin/components/StaffSlotModal";
import {
  BOARD_HOURS,
  formatIstRange,
  isRunningJob,
  istDateKey,
  timelinePlacement,
} from "@/app/lib/admin-schedule";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

type BoardBooking = StaffSlotBooking & {
  status: string;
  scheduledStart: string;
  scheduledEnd: string;
  contactPhone?: string;
  description?: string;
  opsPartsWait?: boolean;
  overflow?: boolean;
  serviceId?: { name?: string } | null;
};

type BoardTechnician = {
  _id: string;
  name: string;
  phone?: string;
  availabilityStatus?: string;
  bookings: BoardBooking[];
};

type DaySchedule = {
  date: string;
  technicians: BoardTechnician[];
  unassigned: (StaffSlotBooking & { status: string; backlog?: boolean })[];
  needsTime: (StaffSlotBooking & { status: string; technicianId?: { _id: string; name?: string } })[];
  overflowCount: number;
};

type SelectedJob = { booking: BoardBooking; technicianName: string };

const STATUS_COLOR: Record<string, string> = {
  ASSIGNED: "rgba(200, 16, 46, 0.18)",
  EN_ROUTE: "rgba(212, 143, 14, 0.25)",
  IN_PROGRESS: "rgba(212, 143, 14, 0.35)",
  COMPLETED: "rgba(46, 160, 67, 0.22)",
  PAYMENT_COLLECTED: "rgba(46, 160, 67, 0.22)",
};

const STATUS_LABEL: Record<string, string> = {
  ASSIGNED: "Scheduled",
  EN_ROUTE: "On the way",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
  PAYMENT_COLLECTED: "Paid",
  RESCHEDULED: "Rescheduled",
};

function shiftDay(day: string, delta: number): string {
  const d = new Date(`${day}T12:00:00+05:30`);
  d.setUTCDate(d.getUTCDate() + delta);
  return istDateKey(d);
}

function errorText(data: any, fallback: string): string {
  return (
    (typeof data?.message === "string" && data.message) ||
    (Array.isArray(data?.message) ? data.message.join(", ") : "") ||
    fallback
  );
}

/**
 * Fixxer-staff day board — the admin's substitute for the technician app: plan slots,
 * start / extend / complete jobs, flag parts waits, and fix jobs that have no time yet.
 */
export default function AdminSchedulePage() {
  const { token } = useAuth();
  const [day, setDay] = useState(istDateKey());
  const [data, setData] = useState<DaySchedule | null>(null);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [slotModal, setSlotModal] = useState<{
    booking: StaffSlotBooking;
    mode: "assign" | "reschedule";
  } | null>(null);
  const [selected, setSelected] = useState<SelectedJob | null>(null);
  const [actionBusy, setActionBusy] = useState(false);
  const [actionError, setActionError] = useState("");
  const [completionCode, setCompletionCode] = useState("");

  const load = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    try {
      const [scheduleRes, techRes] = await Promise.all([
        fetch(`${API}/admin/schedule?date=${day}`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API}/admin/technicians`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (!scheduleRes.ok) throw new Error("Could not load the schedule");
      const next: DaySchedule = await scheduleRes.json();
      setData(next);
      if (techRes.ok) setTechnicians(await techRes.json());
      // Keep the open job panel in sync with fresh data.
      setSelected((prev) => {
        if (!prev) return prev;
        for (const t of next.technicians) {
          const b = t.bookings.find((x) => x._id === prev.booking._id);
          if (b) return { booking: b, technicianName: t.name };
        }
        return null;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the schedule");
    } finally {
      setLoading(false);
    }
  }, [token, day]);

  useEffect(() => {
    void load();
  }, [load]);

  const openJob = (booking: BoardBooking, technicianName: string) => {
    setSelected({ booking, technicianName });
    setActionError("");
    setCompletionCode("");
  };

  const setStatus = async (booking: BoardBooking, status: string, fixxerCode?: string) => {
    if (!token) return;
    setActionBusy(true);
    setActionError("");
    try {
      const res = await fetch(`${API}/admin/bookings/${booking._id}/status`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status, ...(fixxerCode ? { fixxerCode } : {}) }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(errorText(body, "Could not update the job"));
      setCompletionCode("");
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update the job");
    } finally {
      setActionBusy(false);
    }
  };

  const setPartsWait = async (booking: BoardBooking, partsWait: boolean) => {
    if (!token) return;
    setActionBusy(true);
    setActionError("");
    try {
      const res = await fetch(`${API}/admin/ops/bookings/${booking._id}/pending-work`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ partsWait }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(errorText(body, "Could not update parts wait"));
      await load();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update parts wait");
    } finally {
      setActionBusy(false);
    }
  };

  const isToday = day === istDateKey();
  const sel = selected?.booking;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, flex: 1 }}>Technician schedule</h2>
        <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setDay(shiftDay(day, -1))}>
          <span className="material-symbols-outlined">chevron_left</span>
        </button>
        <input
          type="date"
          className="admin-input"
          style={{ width: 160 }}
          value={day}
          onChange={(e) => e.target.value && setDay(e.target.value)}
        />
        <button className="admin-btn admin-btn-secondary admin-btn-sm" onClick={() => setDay(shiftDay(day, 1))}>
          <span className="material-symbols-outlined">chevron_right</span>
        </button>
        {!isToday && (
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDay(istDateKey())}>
            Today
          </button>
        )}
      </div>

      {error && (
        <div className="admin-card" style={{ padding: 16, marginBottom: 16, color: "#ffb4c0" }}>
          {error}
        </div>
      )}

      {!!data?.overflowCount && (
        <div
          role="alert"
          className="admin-card"
          style={{ padding: 12, marginBottom: 16, border: "1px solid rgba(200,16,46,0.5)", fontSize: 13 }}
        >
          <strong>{data.overflowCount} job{data.overflowCount > 1 ? "s" : ""}</strong> would run past 9 PM
          because an earlier job overran (red outline). Change the time or reassign.
        </div>
      )}

      {!!data?.needsTime.length && (
        <div className="admin-card" style={{ padding: 16, marginBottom: 16 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Needs a time ({data.needsTime.length})</h3>
          <p style={{ fontSize: 12, color: "var(--admin-text-dim)", marginBottom: 10 }}>
            Fixxer staff jobs with no slot — usually assigned before scheduling existed. They don&apos;t appear on the
            board or in clash checks until they get a time.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {data.needsTime.map((b) => (
              <div
                key={b._id}
                style={{
                  border: "1px solid rgba(127,127,127,0.25)",
                  borderRadius: 10,
                  padding: 10,
                  fontSize: 13,
                  minWidth: 220,
                  display: "grid",
                  gap: 4,
                }}
              >
                <div style={{ fontWeight: 600 }}>
                  {(typeof b.serviceId === "object" && b.serviceId?.name) || "Service"}
                </div>
                <div style={{ color: "var(--admin-text-dim)" }}>
                  {b.technicianId?.name || "Technician"} · {STATUS_LABEL[b.status] || b.status}
                </div>
                <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                  <button
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    onClick={() => setSlotModal({ booking: b, mode: "reschedule" })}
                  >
                    Set time
                  </button>
                  <Link href={`/admin/bookings/${b._id}`} className="admin-btn admin-btn-ghost admin-btn-sm">
                    Open
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) 300px", gap: 16, alignItems: "start" }}>
        <div className="admin-card" style={{ padding: 16, overflowX: "auto" }}>
          <div style={{ minWidth: 760 }}>
            {/* Hour header */}
            <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", marginBottom: 6 }}>
              <div />
              <div style={{ position: "relative", height: 18 }}>
                {BOARD_HOURS.map((h, i) => (
                  <span
                    key={h}
                    style={{
                      position: "absolute",
                      left: `${(i / (BOARD_HOURS.length - 1)) * 100}%`,
                      transform: "translateX(-50%)",
                      fontSize: 11,
                      color: "var(--admin-text-dim)",
                    }}
                  >
                    {h > 12 ? `${h - 12}p` : h === 12 ? "12p" : `${h}a`}
                  </span>
                ))}
              </div>
            </div>

            {loading && !data && <p style={{ padding: 24, textAlign: "center" }}>Loading…</p>}
            {data && data.technicians.length === 0 && (
              <p style={{ padding: 24, textAlign: "center", color: "var(--admin-text-dim)" }}>
                No active Fixxer staff technicians.
              </p>
            )}

            {data?.technicians.map((tech) => (
              <div
                key={tech._id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "150px 1fr",
                  alignItems: "center",
                  borderTop: "1px solid var(--admin-border, rgba(127,127,127,0.2))",
                  minHeight: 56,
                }}
              >
                <div style={{ paddingRight: 10 }}>
                  <Link href={`/admin/technicians/${tech._id}`} style={{ fontWeight: 600, fontSize: 13 }}>
                    {tech.name}
                  </Link>
                  {tech.availabilityStatus === "UNAVAILABLE" && (
                    <div className="admin-badge admin-badge-warning" style={{ zoom: 0.7 }}>
                      OFF DUTY
                    </div>
                  )}
                  {tech.availabilityStatus === "ON_JOB" && (
                    <div className="admin-badge admin-badge-pending" style={{ zoom: 0.7 }}>
                      ON JOB
                    </div>
                  )}
                </div>
                <div style={{ position: "relative", height: 44 }}>
                  {BOARD_HOURS.map((h, i) => (
                    <div
                      key={h}
                      style={{
                        position: "absolute",
                        left: `${(i / (BOARD_HOURS.length - 1)) * 100}%`,
                        top: 0,
                        bottom: 0,
                        borderLeft: "1px dashed rgba(127,127,127,0.15)",
                      }}
                    />
                  ))}
                  {tech.bookings.map((b) => {
                    const { leftPct, widthPct } = timelinePlacement(b.scheduledStart, b.scheduledEnd);
                    const active = sel?._id === b._id;
                    return (
                      <button
                        key={b._id}
                        type="button"
                        onClick={() => openJob(b, tech.name)}
                        title={`${b.serviceId?.name || "Job"} · ${formatIstRange(b.scheduledStart, b.scheduledEnd)} · ${STATUS_LABEL[b.status] || b.status}${b.opsPartsWait ? " · waiting for parts" : ""}${b.overflow ? " · runs past 9 PM" : ""}`}
                        style={{
                          position: "absolute",
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                          top: 4,
                          bottom: 4,
                          borderRadius: 8,
                          padding: "3px 6px",
                          overflow: "hidden",
                          fontSize: 11,
                          lineHeight: 1.25,
                          textAlign: "left",
                          cursor: "pointer",
                          background: STATUS_COLOR[b.status] || "rgba(127,127,127,0.2)",
                          border: `${b.overflow || active ? 2 : 1}px ${b.opsPartsWait ? "dashed" : "solid"} ${
                            b.overflow ? "#C8102E" : active ? "#D48F0E" : "rgba(127,127,127,0.25)"
                          }`,
                          color: "inherit",
                        }}
                      >
                        <div style={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                          {b.serviceId?.name || "Job"}
                        </div>
                        <div style={{ whiteSpace: "nowrap", opacity: 0.8 }}>
                          {formatIstRange(b.scheduledStart, b.scheduledEnd)}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "var(--admin-text-dim)", marginTop: 12 }}>
            8 AM – 9 PM IST. Click a job to start, extend or complete it. Red outline: an overrun would push it past
            9 PM. Dashed: waiting for parts (doesn&apos;t push later jobs).
          </p>
        </div>

        <div style={{ display: "grid", gap: 16 }}>
          {sel && selected && (
            <div className="admin-card" style={{ padding: 16, display: "grid", gap: 10, fontSize: 13 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", gap: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{sel.serviceId?.name || "Job"}</div>
                  <div style={{ color: "var(--admin-text-dim)" }}>
                    {selected.technicianName} · {formatIstRange(sel.scheduledStart, sel.scheduledEnd)}
                  </div>
                </div>
                <button
                  type="button"
                  className="admin-btn admin-btn-ghost admin-btn-sm"
                  onClick={() => setSelected(null)}
                  aria-label="Close job panel"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div>
                <span className="admin-badge admin-badge-pending">{STATUS_LABEL[sel.status] || sel.status}</span>
                {sel.opsPartsWait && (
                  <span className="admin-badge admin-badge-warning" style={{ marginLeft: 6 }}>
                    Waiting for parts
                  </span>
                )}
              </div>
              {sel.addressData?.text && <div>{sel.addressData.text}</div>}
              {sel.contactPhone && (
                <div>
                  <a href={`tel:${sel.contactPhone}`}>{sel.contactPhone}</a>
                </div>
              )}
              {sel.description && <div style={{ color: "var(--admin-text-dim)" }}>{sel.description}</div>}

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {sel.status === "ASSIGNED" && (
                  <>
                    <button
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      disabled={actionBusy}
                      onClick={() => setStatus(sel, "IN_PROGRESS")}
                    >
                      Start job
                    </button>
                    <button
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      disabled={actionBusy}
                      onClick={() => setSlotModal({ booking: sel, mode: "reschedule" })}
                    >
                      Change time
                    </button>
                  </>
                )}
                {isRunningJob(sel.status) && (
                  <>
                    <button
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      disabled={actionBusy}
                      onClick={() => setSlotModal({ booking: sel, mode: "reschedule" })}
                    >
                      Extend
                    </button>
                    <button
                      className="admin-btn admin-btn-ghost admin-btn-sm"
                      disabled={actionBusy}
                      onClick={() => setPartsWait(sel, !sel.opsPartsWait)}
                    >
                      {sel.opsPartsWait ? "Parts arrived" : "Waiting for parts"}
                    </button>
                  </>
                )}
                <Link href={`/admin/bookings/${sel._id}`} className="admin-btn admin-btn-ghost admin-btn-sm">
                  Open booking
                </Link>
              </div>

              {sel.status === "IN_PROGRESS" && (
                <div style={{ display: "grid", gap: 6 }}>
                  <label className="admin-label">Completion code (from the customer)</label>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      className="admin-input"
                      inputMode="numeric"
                      placeholder="6-digit code"
                      value={completionCode}
                      onChange={(e) => setCompletionCode(e.target.value.trim())}
                    />
                    <button
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      disabled={actionBusy || !completionCode}
                      onClick={() => setStatus(sel, "COMPLETED", completionCode)}
                    >
                      Complete
                    </button>
                  </div>
                </div>
              )}

              {actionError && (
                <p role="alert" style={{ color: "#ffb4c0", margin: 0 }}>
                  {actionError}
                </p>
              )}
            </div>
          )}

          <div className="admin-card" style={{ padding: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>Unassigned for {data?.date || day}</h3>
            <p style={{ fontSize: 12, color: "var(--admin-text-dim)", marginBottom: 12 }}>
              Bookings whose customer picked this day{isToday ? ", plus older or undated ones" : ""}.
            </p>
            {data && data.unassigned.length === 0 && (
              <p style={{ fontSize: 13, color: "var(--admin-text-dim)" }}>Nothing waiting.</p>
            )}
            <div style={{ display: "grid", gap: 10 }}>
              {data?.unassigned.map((b) => (
                <div
                  key={b._id}
                  style={{
                    border: "1px solid rgba(127,127,127,0.25)",
                    borderRadius: 10,
                    padding: 10,
                    fontSize: 13,
                    display: "grid",
                    gap: 4,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>
                    {(typeof b.serviceId === "object" && b.serviceId?.name) || "Service"}
                    {b.backlog && (
                      <span className="admin-badge admin-badge-warning" style={{ marginLeft: 6, zoom: 0.8 }}>
                        {b.preferredVisitDate ? `Wanted ${b.preferredVisitDate}` : "No date"}
                      </span>
                    )}
                  </div>
                  <div style={{ color: "var(--admin-text-dim)" }}>
                    {b.preferredVisitSlot ? b.preferredVisitSlot.toLowerCase() : "any time"}
                    {b.addressData?.zip ? ` · ${b.addressData.zip}` : ""}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                    <button
                      className="admin-btn admin-btn-primary admin-btn-sm"
                      onClick={() => setSlotModal({ booking: b, mode: "assign" })}
                    >
                      Schedule
                    </button>
                    <Link href={`/admin/bookings/${b._id}`} className="admin-btn admin-btn-ghost admin-btn-sm">
                      Open
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {slotModal && (
        <StaffSlotModal
          token={token}
          booking={slotModal.booking}
          technicians={technicians}
          mode={slotModal.mode}
          onClose={() => setSlotModal(null)}
          onDone={() => {
            setSlotModal(null);
            void load();
          }}
        />
      )}
    </div>
  );
}
