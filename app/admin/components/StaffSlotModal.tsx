"use client";

import { useEffect, useMemo, useState } from "react";
import {
  PREFERRED_SLOT_START,
  SlotConflict,
  formatIstRange,
  formatIstTime,
  isFixxerStaff,
  isOutsideWorkingHours,
  isRunningJob,
  istDateKey,
  istTimeValue,
  parseSlotConflict,
  slotFromInput,
  validateSlotInput,
} from "@/app/lib/admin-schedule";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

type Tech = {
  _id: string;
  name: string;
  employmentType?: string | null;
  isActive?: boolean;
  availabilityStatus?: string | null;
};

export type StaffSlotBooking = {
  _id: string;
  status?: string;
  preferredVisitDate?: string | null;
  preferredVisitSlot?: string | null;
  scheduledStart?: string | null;
  scheduledEnd?: string | null;
  technicianId?: string | { _id: string; name?: string } | null;
  serviceId?: { name?: string } | string | null;
  addressData?: { text?: string; zip?: string } | null;
};

type Props = {
  token: string | null;
  booking: StaffSlotBooking;
  technicians: Tech[];
  /** assign: pick technician + slot. reschedule: re-time (or extend, if running) the current staff job. */
  mode: "assign" | "reschedule";
  initialTechnicianId?: string;
  onClose: () => void;
  onDone: () => void;
};

function errorMessage(data: any, fallback: string): string {
  return (
    (typeof data?.message === "string" && data.message) ||
    (Array.isArray(data?.message) ? data.message.join(", ") : "") ||
    fallback
  );
}

/** Admin-facing text for a clash-check result (busy / off duty / outside hours). */
function describeCheck(data: {
  conflicts?: { start: string; end: string }[];
  technicianUnavailable?: boolean;
  outsideWorkingHours?: boolean;
  nextFreeStart?: string | null;
}): string {
  if (data.technicianUnavailable) return "Technician is marked off duty.";
  const parts: string[] = [];
  if (data.conflicts?.length) {
    parts.push(`Busy ${data.conflicts.map((c) => formatIstRange(c.start, c.end)).join(", ")}.`);
    if (data.nextFreeStart) parts.push(`Free from ${formatIstTime(data.nextFreeStart)}.`);
  }
  if (data.outsideWorkingHours) parts.push("Outside working hours (8 AM – 9 PM).");
  return parts.join(" ");
}

/**
 * Schedule a Fixxer-staff technician into a time slot. Clashes, off-duty and outside-hours
 * are warnings: the admin sees who is free / when this technician is next free, and may
 * still go ahead with a reason (saved in history).
 */
export default function StaffSlotModal({
  token,
  booking,
  technicians,
  mode,
  initialTechnicianId,
  onClose,
  onDone,
}: Props) {
  const running = mode === "reschedule" && isRunningJob(booking.status);
  // A running job keeps its start — unless it never had a slot (set one now).
  const lockStart = running && !!booking.scheduledStart;
  const staff = useMemo(
    () =>
      technicians.filter(
        (t) => isFixxerStaff(t) && t.isActive !== false && t.availabilityStatus !== "UNAVAILABLE",
      ),
    [technicians],
  );
  const currentTechId =
    typeof booking.technicianId === "object" && booking.technicianId
      ? booking.technicianId._id
      : (booking.technicianId as string) || "";

  const [technicianId, setTechnicianId] = useState(initialTechnicianId || currentTechId || "");
  const [date, setDate] = useState(
    booking.scheduledStart
      ? istDateKey(booking.scheduledStart)
      : booking.preferredVisitDate && booking.preferredVisitDate >= istDateKey()
        ? booking.preferredVisitDate
        : istDateKey(),
  );
  const [start, setStart] = useState(
    booking.scheduledStart
      ? istTimeValue(booking.scheduledStart)
      : (booking.preferredVisitSlot && PREFERRED_SLOT_START[booking.preferredVisitSlot]) || "",
  );
  const [duration, setDuration] = useState<string>(
    booking.scheduledStart && booking.scheduledEnd
      ? String(
          Math.round(
            (new Date(booking.scheduledEnd).getTime() - new Date(booking.scheduledStart).getTime()) /
              60_000,
          ),
        )
      : "",
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [conflict, setConflict] = useState<SlotConflict | null>(null);
  const [preview, setPreview] = useState<SlotConflict | "free" | null>(null);
  const [overrideOpen, setOverrideOpen] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");

  const inputError = validateSlotInput({ date, start, durationMinutes: duration }, { runningJob: running });
  const outsideHours = !inputError && isOutsideWorkingHours({ start, durationMinutes: duration });
  const techName = (id: string) => technicians.find((t) => t._id === id)?.name || "Technician";

  // Live clash preview while the admin edits (no write). A running job only extends,
  // so only the working-hours warning applies to it.
  useEffect(() => {
    setConflict(null);
    setOverrideOpen(false);
    if (!token || !technicianId || inputError) {
      setPreview(null);
      return;
    }
    if (running) {
      setPreview(
        outsideHours
          ? parseSlotConflict(409, {
              code: "SLOT_CONFLICT",
              message: describeCheck({ outsideWorkingHours: true }),
              outsideWorkingHours: true,
            })
          : null,
      );
      return;
    }
    const slot = slotFromInput({ date, start, durationMinutes: duration });
    const ctrl = new AbortController();
    const t = setTimeout(async () => {
      try {
        const qs = new URLSearchParams({
          technicianId,
          start: slot.scheduledStart,
          end: slot.scheduledEnd,
          excludeBookingId: booking._id,
        });
        const res = await fetch(`${API}/admin/schedule/check?${qs}`, {
          headers: { Authorization: `Bearer ${token}` },
          signal: ctrl.signal,
        });
        if (!res.ok) return setPreview(null);
        const data = await res.json();
        const clash =
          data.conflicts?.length > 0 || data.technicianUnavailable || data.outsideWorkingHours;
        setPreview(
          clash
            ? parseSlotConflict(409, { ...data, code: "SLOT_CONFLICT", message: describeCheck(data) })
            : "free",
        );
      } catch {
        /* aborted or offline — submit still checks */
      }
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [token, technicianId, date, start, duration, inputError, outsideHours, running, booking._id]);

  const submit = async (opts: { technicianId?: string; override?: boolean } = {}) => {
    if (!token) return;
    const techId = opts.technicianId || technicianId;
    if (!techId) return setError("Pick a technician");
    if (inputError) return setError(inputError);
    if (opts.override && !overrideReason.trim()) return setError("Give a reason to go ahead anyway");

    setSubmitting(true);
    setError("");
    try {
      const slot = slotFromInput({ date, start, durationMinutes: duration });
      const body = mode === "assign" ? { technicianId: techId, ...slot } : { ...slot };
      const res = await fetch(
        `${API}/admin/bookings/${booking._id}/${mode === "assign" ? "assign" : "slot"}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            ...body,
            ...(opts.override ? { override: true, reason: overrideReason.trim() } : {}),
          }),
        },
      );
      const data = await res.json().catch(() => ({}));
      const clash = parseSlotConflict(res.status, data);
      if (clash) {
        setTechnicianId(techId);
        setConflict({ ...clash, message: describeCheck(clash) || clash.message });
        return;
      }
      if (!res.ok) throw new Error(errorMessage(data, "Could not schedule the technician."));
      onDone();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not schedule the technician.");
    } finally {
      setSubmitting(false);
    }
  };

  const shown = conflict || (preview !== "free" ? preview : null);
  const onlyHours =
    !!shown && shown.outsideWorkingHours && !shown.conflicts.length && !shown.technicianUnavailable;
  const serviceName = typeof booking.serviceId === "object" ? booking.serviceId?.name : "";
  const title = mode === "assign" ? "Schedule Fixxer technician" : running ? "Extend running job" : "Change job time";

  return (
    <div className="admin-modal-overlay" onClick={() => !submitting && onClose()}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 520 }}>
        <div className="admin-modal-header">
          <h2>{title}</h2>
          <button
            type="button"
            className="admin-btn admin-btn-ghost admin-btn-sm"
            disabled={submitting}
            onClick={onClose}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="admin-modal-body" style={{ display: "grid", gap: 14 }}>
          <div style={{ fontSize: 13, color: "var(--admin-text-dim)", lineHeight: 1.5 }}>
            {serviceName && <div style={{ fontWeight: 600, color: "var(--admin-text)" }}>{serviceName}</div>}
            {booking.addressData?.text && <div>{booking.addressData.text}</div>}
            {booking.preferredVisitDate && (
              <div>
                Customer prefers {booking.preferredVisitDate}
                {booking.preferredVisitSlot ? ` · ${booking.preferredVisitSlot.toLowerCase()}` : ""}
              </div>
            )}
          </div>

          {mode === "assign" && (
            <div>
              <label className="admin-label">Technician</label>
              <select
                className="admin-input admin-select"
                value={technicianId}
                onChange={(e) => setTechnicianId(e.target.value)}
              >
                <option value="">Select a Fixxer technician</option>
                {staff.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr 1fr", gap: 10 }}>
            <div>
              <label className="admin-label">Date</label>
              <input
                type="date"
                className="admin-input"
                min={running ? undefined : istDateKey()}
                disabled={lockStart}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">Start</label>
              <input
                type="time"
                className="admin-input"
                step={900}
                disabled={lockStart}
                value={start}
                onChange={(e) => setStart(e.target.value)}
              />
            </div>
            <div>
              <label className="admin-label">{running ? "Total duration (min)" : "Duration (min)"}</label>
              <input
                type="number"
                className="admin-input"
                min={1}
                step={15}
                placeholder="e.g. 90"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>
          <p style={{ fontSize: 12, color: "var(--admin-text-dim)", margin: 0 }}>
            {running
              ? "The job keeps its start time. Later jobs of this technician that now overlap move forward by whole hours."
              : "Working hours 8:00 AM – 9:00 PM. If an earlier job overruns, later jobs move forward by an hour automatically."}
          </p>

          {preview === "free" && !conflict && technicianId && (
            <div className="admin-badge admin-badge-success" style={{ justifySelf: "start" }}>
              {techName(technicianId)} is free for this slot
            </div>
          )}

          {shown && technicianId && (
            <div
              role="alert"
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: "rgba(212, 143, 14, 0.12)",
                border: "1px solid rgba(212, 143, 14, 0.4)",
                display: "grid",
                gap: 10,
                fontSize: 13,
              }}
            >
              <div>
                <strong>{techName(technicianId)}</strong>: {shown.message}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {shown.nextFreeStart && !running && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-secondary admin-btn-sm"
                    disabled={submitting}
                    onClick={() => {
                      setDate(istDateKey(shown.nextFreeStart!));
                      setStart(istTimeValue(shown.nextFreeStart!));
                    }}
                  >
                    Use {formatIstTime(shown.nextFreeStart)} instead
                  </button>
                )}
                {mode === "assign" &&
                  shown.freeTechnicians.map((t) => (
                    <button
                      key={t._id}
                      type="button"
                      className="admin-btn admin-btn-secondary admin-btn-sm"
                      disabled={submitting}
                      onClick={() => (conflict ? submit({ technicianId: t._id }) : setTechnicianId(t._id))}
                    >
                      {conflict ? `Assign ${t.name} instead` : `${t.name} is free`}
                    </button>
                  ))}
                {!overrideOpen && (
                  <button
                    type="button"
                    className="admin-btn admin-btn-ghost admin-btn-sm"
                    disabled={submitting}
                    onClick={() => setOverrideOpen(true)}
                  >
                    {onlyHours
                      ? "Go ahead outside working hours"
                      : mode === "assign"
                        ? `Assign ${techName(technicianId)} anyway`
                        : "Keep this time anyway"}
                  </button>
                )}
              </div>
              {overrideOpen && (
                <div style={{ display: "grid", gap: 8 }}>
                  <textarea
                    className="admin-input"
                    rows={2}
                    placeholder="Reason (saved in history)"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                  />
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary admin-btn-sm"
                    style={{ justifySelf: "start" }}
                    disabled={submitting || !overrideReason.trim()}
                    onClick={() => submit({ override: true })}
                  >
                    Confirm anyway
                  </button>
                </div>
              )}
            </div>
          )}

          {(error || (inputError && start && duration)) && (
            <p role="alert" style={{ color: "#ffb4c0", fontSize: 13, margin: 0 }}>
              {error || inputError}
            </p>
          )}
        </div>

        <div className="admin-modal-footer">
          <button type="button" className="admin-btn admin-btn-secondary" disabled={submitting} onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-primary"
            disabled={submitting || !technicianId || !!inputError}
            onClick={() => submit()}
          >
            {submitting ? "Saving…" : mode === "assign" ? "Schedule" : running ? "Extend" : "Save time"}
          </button>
        </div>
      </div>
    </div>
  );
}
