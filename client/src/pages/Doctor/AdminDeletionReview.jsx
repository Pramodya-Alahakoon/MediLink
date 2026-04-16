import React, { useState, useEffect, useCallback } from 'react';
import customFetch from '../../utils/customFetch';
import { toast } from 'react-hot-toast';
import {
  Trash2, ShieldCheck, XCircle, AlertTriangle, Loader2,
  RefreshCw, Calendar, User, Mail, Phone, Hospital,
  Clock, FileText, CheckCircle2, ShieldAlert, Search,
  ChevronDown, ChevronUp
} from 'lucide-react';

/* ─── Status badge ────────────────────────────────────────────────── */
const StatusBadge = ({ status }) => {
  const map = {
    active: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    pending: 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    pending_deletion: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[11px] font-extrabold uppercase tracking-widest border ${map[status] || map.inactive}`}>
      {status?.replace('_', ' ')}
    </span>
  );
};

/* ─── Confirm Dialog ─────────────────────────────────────────────── */
const ConfirmDialog = ({ open, title, message, confirmLabel, confirmClass, onConfirm, onCancel, loading }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-sm p-7">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 ${confirmClass?.includes('red') ? 'bg-red-50 dark:bg-red-900/20' : 'bg-amber-50 dark:bg-amber-900/20'}`}>
          <AlertTriangle size={26} className={confirmClass?.includes('red') ? 'text-red-500' : 'text-amber-500'} />
        </div>
        <h3 className="text-[18px] font-black text-[#0D1C2E] dark:text-white font-manrope mb-2">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-[13px] leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[13px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading} className={`flex-1 py-3 rounded-2xl text-white text-[13px] font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-60 ${confirmClass}`}>
            {loading ? <Loader2 size={15} className="animate-spin" /> : null}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
const AdminDeletionReview = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const [expanded, setExpanded] = useState(null);

  /* confirm dialog state */
  const [dialog, setDialog] = useState({ open: false, type: null, doctor: null });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchPendingDeletions = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await customFetch.get('/api/doctors?status=pending_deletion');
      setDoctors(data.data || []);
    } catch (err) {
      toast.error('Failed to load deletion requests');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchPendingDeletions(); }, [fetchPendingDeletions]);

  /* ── Approve (permanent delete) ──────────────────────────────── */
  const handleApprove = async () => {
    const { doctor } = dialog;
    try {
      setActionLoading(true);
      const id = doctor._id || doctor.doctorId;
      await customFetch.delete(`/api/doctors/${id}`);
      toast.success(`Success! Dr. ${doctor.name}'s account has been permanently deleted from the system.`, { icon: '🗑️' });
      setDoctors(prev => prev.filter(d => d._id !== doctor._id));
      setDialog({ open: false, type: null, doctor: null });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to delete doctor');
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Reject (restore account) ────────────────────────────────── */
  const handleReject = async () => {
    const { doctor } = dialog;
    try {
      setActionLoading(true);
      const id = doctor._id || doctor.doctorId;
      await customFetch.patch(`/api/doctors/${id}/reject-deletion`, { adminNote: 'Request rejected by admin' });
      toast.success(`Deletion rejected. Dr. ${doctor.name}'s account has been fully restored to active status.`, { icon: '✅' });
      setDoctors(prev => prev.filter(d => d._id !== doctor._id));
      setDialog({ open: false, type: null, doctor: null });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to reject deletion request');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = doctors.filter(d =>
    d.name?.toLowerCase().includes(searchQ.toLowerCase()) ||
    d.email?.toLowerCase().includes(searchQ.toLowerCase()) ||
    d.specialization?.toLowerCase().includes(searchQ.toLowerCase())
  );

  const fmt = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="w-full min-h-full bg-[#F8FAFB] dark:bg-slate-950 p-4 lg:p-8 font-inter">

        {/* ── Page Header ──────────────────────────────────────────── */}
        <div className="mb-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 rounded-lg text-[11px] font-extrabold uppercase tracking-widest mb-3 border border-red-100 dark:border-red-900/30">
            <ShieldAlert size={13} /> Admin Review
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-[26px] lg:text-[30px] font-black text-[#0D1C2E] dark:text-white tracking-tight font-manrope leading-tight">
                Deletion Requests
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium mt-1">
                Review and action pending doctor account deletion requests.
              </p>
            </div>
            <div className="flex items-center gap-3">
              {/* Count badge */}
              <div className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-[13px] font-bold text-[#0D1C2E] dark:text-white">
                  {loading ? '…' : doctors.length} Pending
                </span>
              </div>
              <button
                onClick={fetchPendingDeletions}
                className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm text-[13px] font-bold text-slate-600 dark:text-slate-300 hover:text-[#055153] dark:hover:text-teal-400 transition-colors"
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ── Search Bar ───────────────────────────────────────────── */}
        <div className="relative mb-6 max-w-md">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQ}
            onChange={e => setSearchQ(e.target.value)}
            placeholder="Search by name, email or specialization…"
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-[13px] font-medium text-[#0D1C2E] dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:border-[#055153] dark:focus:border-teal-500 focus:ring-4 focus:ring-[#055153]/10 shadow-sm transition-all"
          />
        </div>

        {/* ── Loading State ─────────────────────────────────────────── */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={36} className="animate-spin text-[#055153] dark:text-teal-400" />
          </div>
        )}

        {/* ── Empty State ───────────────────────────────────────────── */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-3xl flex items-center justify-center mb-5">
              <CheckCircle2 size={36} className="text-emerald-500" />
            </div>
            <h3 className="text-[18px] font-black text-[#0D1C2E] dark:text-white font-manrope mb-2">
              {searchQ ? 'No results found' : 'No Pending Requests'}
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-[13px] max-w-xs">
              {searchQ ? 'Try adjusting your search.' : 'All doctor accounts are in good standing. No deletion requests are awaiting review.'}
            </p>
          </div>
        )}

        {/* ── Requests List ─────────────────────────────────────────── */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-4">
            {filtered.map(doctor => {
              const isExpanded = expanded === doctor._id;
              const requestedDaysAgo = doctor.deletionRequestedAt
                ? Math.floor((Date.now() - new Date(doctor.deletionRequestedAt)) / 86400000)
                : null;

              return (
                <div key={doctor._id} className="bg-white dark:bg-slate-900 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-sm overflow-hidden transition-all">
                  {/* Card Header */}
                  <div className="p-5 lg:p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Doctor Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-red-100 dark:border-red-900/30">
                        <img
                          src={doctor.profileImage?.startsWith('http') ? doctor.profileImage : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&crop=faces'}
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center">
                        <Trash2 size={9} className="text-white" />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-[16px] font-black text-[#0D1C2E] dark:text-white font-manrope">
                          Dr. {doctor.name}
                        </h3>
                        <StatusBadge status={doctor.status} />
                        {requestedDaysAgo !== null && (
                          <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500">
                            {requestedDaysAgo === 0 ? 'today' : `${requestedDaysAgo}d ago`}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1"><Mail size={11} /> {doctor.email}</span>
                        <span className="flex items-center gap-1"><Phone size={11} /> {doctor.phone || '—'}</span>
                        <span className="flex items-center gap-1"><Hospital size={11} /> {doctor.specialization}</span>
                        {doctor.hospital && <span className="flex items-center gap-1"><FileText size={11} /> {doctor.hospital}</span>}
                      </div>

                      {/* Deletion reason preview */}
                      {doctor.deletionReason && (
                        <div className="mt-2 flex items-start gap-1.5 text-[12px] text-red-600 dark:text-red-400 font-medium">
                          <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                          <span className="line-clamp-1">"{doctor.deletionReason}"</span>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      {/* Expand/collapse details */}
                      <button
                        onClick={() => setExpanded(isExpanded ? null : doctor._id)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-[12px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
                      >
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                        {isExpanded ? 'Less' : 'Details'}
                      </button>
                      {/* Reject */}
                      <button
                        onClick={() => setDialog({ open: true, type: 'reject', doctor })}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800 text-[12px] font-bold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-all"
                      >
                        <XCircle size={14} /> Reject
                      </button>
                      {/* Approve (permanent delete) */}
                      <button
                        onClick={() => setDialog({ open: true, type: 'approve', doctor })}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[12px] font-bold shadow-md shadow-red-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0"
                      >
                        <Trash2 size={14} /> Approve & Delete
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details Panel */}
                  {isExpanded && (
                    <div className="border-t border-red-50 dark:border-red-900/20 bg-red-50/30 dark:bg-red-900/5 px-6 py-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Doctor ID</p>
                          <p className="text-[13px] font-bold text-[#0D1C2E] dark:text-white">{doctor.doctorId}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Requested At</p>
                          <p className="text-[13px] font-bold text-[#0D1C2E] dark:text-white">{fmt(doctor.deletionRequestedAt)}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Experience</p>
                          <p className="text-[13px] font-bold text-[#0D1C2E] dark:text-white">{doctor.experience ? `${doctor.experience} years` : '—'}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Verified</p>
                          <p className="text-[13px] font-bold">{doctor.isVerified ? <span className="text-emerald-500">✓ Yes</span> : <span className="text-amber-500">✗ No</span>}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Sessions</p>
                          <p className="text-[13px] font-bold text-[#0D1C2E] dark:text-white">{doctor.sessionCount ?? 0}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Rating</p>
                          <p className="text-[13px] font-bold text-[#0D1C2E] dark:text-white">{doctor.rating?.average > 0 ? `${doctor.rating.average}/5 (${doctor.rating.count})` : '—'}</p>
                        </div>
                      </div>

                      {/* Full reason */}
                      {doctor.deletionReason && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl">
                          <p className="text-[10px] font-extrabold text-red-500 dark:text-red-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                            <AlertTriangle size={11} /> Doctor's Stated Reason
                          </p>
                          <p className="text-[13px] text-red-800 dark:text-red-300 font-medium leading-relaxed">
                            "{doctor.deletionReason}"
                          </p>
                        </div>
                      )}

                      {/* Warning */}
                      <div className="mt-4 flex items-start gap-2 text-[12px] text-slate-500 dark:text-slate-400">
                        <ShieldAlert size={14} className="shrink-0 mt-0.5 text-red-400" />
                        <span>Approving deletion is <strong>permanent and irreversible</strong>. All associated appointments and records will be anonymized. Consider rejecting if the request is not justified.</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Approve Confirm Dialog ────────────────────────────────── */}
      <ConfirmDialog
        open={dialog.open && dialog.type === 'approve'}
        title="Permanently Delete Account?"
        message={`You are about to permanently delete Dr. ${dialog.doctor?.name}'s account. This action is irreversible. All their data will be removed from the system.`}
        confirmLabel="Yes, Delete Permanently"
        confirmClass="bg-red-500 hover:bg-red-600 shadow-md shadow-red-500/25"
        loading={actionLoading}
        onConfirm={handleApprove}
        onCancel={() => setDialog({ open: false, type: null, doctor: null })}
      />

      {/* ── Reject Confirm Dialog ─────────────────────────────────── */}
      <ConfirmDialog
        open={dialog.open && dialog.type === 'reject'}
        title="Reject Deletion Request?"
        message={`Dr. ${dialog.doctor?.name}'s account will be restored to active status. The deletion request will be cleared.`}
        confirmLabel="Reject & Restore Account"
        confirmClass="bg-amber-500 hover:bg-amber-600 shadow-md shadow-amber-500/25"
        loading={actionLoading}
        onConfirm={handleReject}
        onCancel={() => setDialog({ open: false, type: null, doctor: null })}
      />
    </>
  );
};

export default AdminDeletionReview;
