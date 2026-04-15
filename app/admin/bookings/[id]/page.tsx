"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import ManageVisitsModal from "../ManageVisitsModal";
import AddPartModal from "../AddPartModal";
import { openJobSheet } from "@/app/admin/utils/jobsheet";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";
const STATUSES = ["ALL", "PENDING", "CONFIRMED", "ASSIGNED", "IN_PROGRESS", "COMPLETED", "RESCHEDULED", "CANCELLED"];

export default function BookingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { token } = useAuth();
  
  const [booking, setBooking] = useState<any>(null);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  
  const [visitModalVisible, setVisitModalVisible] = useState(false);
  const [addPartModalVisible, setAddPartModalVisible] = useState(false);
  const [visits, setVisits] = useState<any[]>([]);
  const [jobDetails, setJobDetails] = useState({
    diagnosis: "",
    workDone: "",
    recommendations: "",
    warrantyPeriod: "60 Days"
  });

  useEffect(() => {
    if (token && id) {
      fetchBookingInfo();
      fetchTechnicians();
    }
  }, [token, id]);

  const fetchBookingInfo = async () => {
    try {
      const res = await fetch(`${API}/admin/bookings/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setBooking(data);
      if (data.visits) {
        setVisits(data.visits);
      }
      if (data.jobDetails) {
        setJobDetails({
          diagnosis: data.jobDetails.diagnosis || "",
          workDone: data.jobDetails.workDone || "",
          recommendations: data.jobDetails.recommendations || "",
          warrantyPeriod: data.jobDetails.warrantyPeriod || "60 Days"
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTechnicians = async () => {
    try {
      const res = await fetch(`${API}/admin/technicians`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (Array.isArray(data)) setTechnicians(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await fetch(`${API}/admin/bookings/${id}/status`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchBookingInfo();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignTechnician = async (technicianId: string) => {
    setUpdating(true);
    try {
      await fetch(`${API}/admin/bookings/${id}/assign`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ technicianId }),
      });
      fetchBookingInfo();
    } catch (err) {
      console.error(err);
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateJobDetails = async () => {
    setUpdating(true);
    try {
      await fetch(`${API}/admin/bookings/${id}/job-details`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: JSON.stringify(jobDetails),
      });
      fetchBookingInfo();
      alert("Job Sheet details saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to save details.");
    } finally {
      setUpdating(false);
    }
  };

  const handleFinalizeInvoice = async () => {
    if (!confirm("Are you sure you want to finalize this bill? This will lock the invoice and notify the customer.")) return;
    setUpdating(true);
    try {
      await fetch(`${API}/admin/bookings/${id}/finalize-invoice`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookingInfo();
      alert("Service Completed and Bill Sent to User.");
    } catch (err) {
      console.error(err);
      alert("Failed to finalize.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div style={{ padding: 40 }}>Loading booking details...</div>;
  if (!booking) return <div style={{ padding: 40 }}>Booking not found.</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, padding: "0 8px", maxWidth: 900 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => router.back()}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: -0.5 }}>Booking #{booking._id.slice(-8)}</h2>
            <p style={{ fontSize: 13, color: "var(--admin-text-dim)", marginTop: 4 }}>
              Created on {new Date(booking.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="admin-btn admin-btn-secondary" onClick={() => openJobSheet(booking)}>
            <span className="material-symbols-outlined">print</span> Job Sheet
          </button>
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setVisitModalVisible(true)}>
            <span className="material-symbols-outlined">calendar_month</span> Manage Visits
          </button>
          <button className="admin-btn admin-btn-primary" onClick={() => setAddPartModalVisible(true)}>
            <span className="material-symbols-outlined">build</span> Add Part
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Main Details */}
          <div className="admin-card">
            <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--admin-text-muted)", marginBottom: 16 }}>
              Service Information
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
              <div><strong style={{ color: "var(--admin-text-dim)" }}>Service:</strong> {booking.serviceId?.name} ({booking.serviceId?.title || ''})</div>
              <div><strong style={{ color: "var(--admin-text-dim)" }}>Description:</strong> {booking.description || "N/A"}</div>
              <div><strong style={{ color: "var(--admin-text-dim)" }}>Preferred Date:</strong> {new Date(booking.preferredDate).toLocaleDateString()} at {booking.preferredTime}</div>
            </div>
          </div>

          {/* Customer Details */}
          <div className="admin-card">
            <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--admin-text-muted)", marginBottom: 16 }}>
              Customer Details
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, fontSize: 13 }}>
              <div><strong style={{ color: "var(--admin-text-dim)" }}>Name:</strong> {booking.userId?.fullName || "—"}</div>
              <div><strong style={{ color: "var(--admin-text-dim)" }}>Phone:</strong> {booking.contactPhone || booking.userId?.phone}</div>
              {booking.addressData && (
                <div><strong style={{ color: "var(--admin-text-dim)" }}>Address:</strong> {booking.addressData.text} (Pincode: {booking.addressData.zip})</div>
              )}
            </div>
          </div>

            {/* Job Sheet Editor */}
            <div className="admin-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--admin-text-muted)" }}>
                  Job Sheet Entries
                </h3>
                <button 
                  className="admin-btn admin-btn-secondary admin-btn-sm" 
                  onClick={handleUpdateJobDetails}
                  disabled={updating || booking.isBilled}
                >
                  Save Entries
                </button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label className="admin-label">Diagnosis / Problem Found</label>
                  <textarea 
                    className="admin-input" 
                    placeholder="e.g. Compressor winding burnt, Gas leak in evaporator" 
                    style={{ minHeight: 80 }}
                    value={jobDetails.diagnosis}
                    onChange={e => setJobDetails({...jobDetails, diagnosis: e.target.value})}
                    disabled={booking.isBilled}
                  />
                </div>
                <div>
                  <label className="admin-label">Action Taken / Work Done</label>
                  <textarea 
                    className="admin-input" 
                    placeholder="e.g. Replaced compressor, Gas refilled, Tested OK" 
                    style={{ minHeight: 80 }}
                    value={jobDetails.workDone}
                    onChange={e => setJobDetails({...jobDetails, workDone: e.target.value})}
                    disabled={booking.isBilled}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <label className="admin-label">Technician Recommendations</label>
                    <input 
                      className="admin-input" 
                      placeholder="e.g. Clean filters weekly" 
                      value={jobDetails.recommendations}
                      onChange={e => setJobDetails({...jobDetails, recommendations: e.target.value})}
                      disabled={booking.isBilled}
                    />
                  </div>
                  <div>
                    <label className="admin-label">Warranty Period</label>
                    <input 
                      className="admin-input" 
                      placeholder="e.g. 60 Days" 
                      value={jobDetails.warrantyPeriod}
                      onChange={e => setJobDetails({...jobDetails, warrantyPeriod: e.target.value})}
                      disabled={booking.isBilled}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Visits History */}
            <div className="admin-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--admin-text-muted)" }}>
                  Visits History
                </h3>
                <button 
                  className="admin-btn admin-btn-ghost admin-btn-sm" 
                  onClick={() => setVisitModalVisible(true)}
                  disabled={booking.isBilled}
                >
                  + Manage Visits
                </button>
              </div>
            {visits.length === 0 ? (
              <div style={{ color: "var(--admin-text-dim)", fontSize: 13 }}>No visits recorded yet.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {visits.map((vis, i) => (
                  <div key={vis._id} style={{ border: "1px solid var(--admin-border)", borderRadius: 8, padding: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <strong style={{ fontSize: 13 }}>Visit #{vis.visitOrder} <span style={{ color: "var(--admin-text-dim)", fontWeight: "normal" }}>({vis.status})</span></strong>
                      <span style={{ fontSize: 12, color: "var(--admin-text-dim)" }}>{new Date(vis.scheduledDate).toLocaleDateString()}</span>
                    </div>
                    <div style={{ fontSize: 13, color: "var(--admin-text-dim)" }}>
                      <strong>Description:</strong> {vis.jobDescription || "—"}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Spare Parts Consumed */}
          <div className="admin-card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--admin-text-muted)" }}>
                Spare Parts Consumed
              </h3>
              <button 
                className="admin-btn admin-btn-ghost admin-btn-sm" 
                onClick={() => setAddPartModalVisible(true)}
              >
                + Add Part
              </button>
            </div>
            {(() => {
              const allParts = visits.flatMap(v => v.partsUsed || []);
              if (allParts.length === 0) {
                return <div style={{ color: "var(--admin-text-dim)", fontSize: 13 }}>No parts used.</div>;
              }
              return (
                <table style={{ width: "100%", fontSize: 13, borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--admin-border)", textAlign: "left" }}>
                      <th style={{ paddingBottom: 8, color: "var(--admin-text-muted)" }}>Part Name</th>
                      <th style={{ paddingBottom: 8, color: "var(--admin-text-muted)" }}>Type</th>
                      <th style={{ paddingBottom: 8, color: "var(--admin-text-muted)" }}>Qty</th>
                      <th style={{ paddingBottom: 8, textAlign: "right", color: "var(--admin-text-muted)" }}>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allParts.map((p: any, idx: number) => (
                      <tr key={idx} style={{ borderBottom: "1px solid var(--admin-border)" }}>
                        <td style={{ padding: "12px 0", fontWeight: 500 }}>
                          {p.isThirdParty ? p.partName : (p.sparePartId?.name || p.sparePartId)}
                        </td>
                        <td style={{ padding: "12px 0" }}>
                          {p.isThirdParty ? <span className="admin-badge admin-badge-warning" style={{ zoom: 0.8 }}>3rd Party</span> : <span className="admin-badge admin-badge-success" style={{ zoom: 0.8 }}>Inventory</span>}
                        </td>
                        <td style={{ padding: "12px 0" }}>{p.quantity}</td>
                        <td style={{ padding: "12px 0", textAlign: "right", fontWeight: 600 }}>₹{p.cost}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {/* Actions Panel */}
          <div className="admin-card" style={{ background: "var(--admin-surface-2)" }}>
            <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--admin-text-muted)", marginBottom: 16 }}>
              Management
            </h3>
            
            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">Status</label>
              <select 
                className="admin-input admin-select" 
                value={booking.status} 
                onChange={e => handleStatusChange(e.target.value)}
                disabled={updating}
              >
                {STATUSES.filter(s => s !== "ALL").map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="admin-label">Assigned Technician</label>
              <select 
                className="admin-input admin-select" 
                value={booking.technicianId?._id || booking.technicianId || ""} 
                onChange={e => handleAssignTechnician(e.target.value)}
                disabled={updating || booking.isBilled}
              >
                <option value="">Unassigned</option>
                {technicians.map(t => (
                  <option key={t._id} value={t._id}>{t.name}</option>
                ))}
              </select>
            </div>

            {!booking.isBilled && (
              <button 
                className="admin-btn admin-btn-primary w-full" 
                style={{ width: '100%', justifyContent: 'center', height: 48, fontSize: 14, fontWeight: 700 }}
                onClick={handleFinalizeInvoice}
                disabled={updating || !booking.technicianId}
              >
                Finalize Billing & Close
              </button>
            )}
            {booking.isBilled && (
              <div style={{ background: 'rgba(34, 197, 94, 0.1)', color: '#16a34a', padding: 12, borderRadius: 8, fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
                <span className="material-symbols-outlined" style={{ verticalAlign: 'middle', marginRight: 4, fontSize: 18 }}>verified</span>
                Service Billed & Completed
              </div>
            )}
          </div>

          {/* Invoice Summary */}
          {booking.invoiceData && (
            <div className="admin-card">
              <h3 style={{ fontSize: 14, textTransform: "uppercase", letterSpacing: 1, color: "var(--admin-text-muted)", marginBottom: 16 }}>
                Invoice Summary
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, fontSize: 13 }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Service Fee:</span>
                  <span>₹{booking.invoiceData.serviceTotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Parts Total:</span>
                  <span>₹{booking.invoiceData.partsTotal}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, borderTop: "1px solid var(--admin-border)", paddingTop: 8, marginTop: 4 }}>
                  <span>Grand Total:</span>
                  <span>₹{booking.invoiceData.totalAmount}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {visitModalVisible && (
        <ManageVisitsModal 
          bookingId={id as string} 
          technicianId={booking.technicianId?._id || booking.technicianId}
          token={token || ""} 
          onClose={() => {
            setVisitModalVisible(false);
            fetchBookingInfo();
          }} 
        />
      )}

      {addPartModalVisible && (
        <AddPartModal
          bookingId={id as string}
          technicianId={booking.technicianId?._id || booking.technicianId}
          token={token || ""}
          onAdded={() => fetchBookingInfo()}
          onClose={() => setAddPartModalVisible(false)}
        />
      )}
    </div>
  );
}
