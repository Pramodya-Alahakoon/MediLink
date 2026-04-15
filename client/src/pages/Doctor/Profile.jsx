import React, { useState, useEffect } from 'react';
import { useDoctorContext } from '../../context/DoctorContext';
import { useAuth } from '../../context/AuthContext';
import customFetch from '../../utils/customFetch';
import { toast } from 'react-hot-toast';
import {
  Mail, Phone, Lock, ShieldCheck, Save, Loader2,
  Hospital, Clock, Eye, EyeOff, AlertTriangle, Trash2,
  CheckCircle2, XCircle, UserCog, Shield, Star, Globe,
  HeartPulse, GraduationCap
} from 'lucide-react';

/* ─── tiny helpers ──────────────────────────────────────────────────── */
const Field = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-3 p-3.5 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/50">
    <div className="w-9 h-9 rounded-xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-[#055153] dark:text-teal-400 shrink-0">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">{label}</p>
      <p className="text-[13.5px] font-bold text-[#0D1C2E] dark:text-white leading-snug mt-0.5">{value || '—'}</p>
    </div>
  </div>
);

const InputGroup = ({ label, icon: Icon, iconColor = '#055153', error, children }) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
      <Icon size={12} style={{ color: iconColor }} />
      {label}
    </label>
    {children}
    {error && (
      <p className="text-red-500 text-[11px] font-medium flex items-center gap-1">
        <XCircle size={11} /> {error}
      </p>
    )}
  </div>
);

const Profile = () => {
  const { doctorProfile, refreshDoctorProfile } = useDoctorContext();
  const { user } = useAuth();

  const [secForm, setSecForm] = useState({ email: '', phone: '', password: '', confirmPassword: '' });
  const [secErrors, setSecErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingAuth, setSavingAuth] = useState(false);

  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [deletionPending, setDeletionPending] = useState(false);
  const [submittingDelete, setSubmittingDelete] = useState(false);

  const [activeTab, setActiveTab] = useState('security');

  useEffect(() => {
    if (doctorProfile || user) {
      setSecForm(prev => ({
        ...prev,
        email: doctorProfile?.email || user?.email || '',
        phone: doctorProfile?.phone || user?.phoneNumber || '',
      }));
      setDeletionPending(doctorProfile?.status === 'pending_deletion');
    }
  }, [doctorProfile, user]);

  const validate = () => {
    const errs = {};
    const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!secForm.email.trim()) errs.email = 'Email is required';
    else if (!emailRx.test(secForm.email)) errs.email = 'Enter a valid email';
    if (!secForm.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(secForm.phone.trim())) errs.phone = 'Enter a valid 10-digit phone number';
    if (secForm.password) {
      if (secForm.password.length < 6) errs.password = 'Password must be at least 6 characters';
      if (secForm.password !== secForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    }
    setSecErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveSecurity = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      setSavingAuth(true);
      const payload = { email: secForm.email, phoneNumber: secForm.phone };
      if (secForm.password) payload.password = secForm.password;
      await customFetch.put('/api/auth/profile', payload);

      if (doctorProfile?._id || doctorProfile?.doctorId) {
        const docId = doctorProfile._id || doctorProfile.doctorId;
        await customFetch.put(`/api/doctors/${docId}`, { email: secForm.email, phone: secForm.phone });
        refreshDoctorProfile();
      }
      toast.success('Profile changes saved');
      setSecForm(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      toast.error(err?.response?.data?.msg || err?.response?.data?.message || 'Update failed. Please try again.');
    } finally {
      setSavingAuth(false);
    }
  };

  const handleRequestDeletion = async () => {
    if (!deleteReason.trim()) { toast.error('Please provide a reason for account deletion.'); return; }
    if (!doctorProfile?._id && !doctorProfile?.doctorId) { toast.error('Doctor profile not found.'); return; }
    try {
      setSubmittingDelete(true);
      const docId = doctorProfile._id || doctorProfile.doctorId;
      await customFetch.patch(`/api/doctors/${docId}/request-deletion`, { reason: deleteReason });
      toast.success('Deletion request submitted!');
      setDeletionPending(true);
      setShowDeleteDialog(false);
      setDeleteReason('');
      refreshDoctorProfile();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to submit deletion request.');
    } finally {
      setSubmittingDelete(false);
    }
  };

  const avatar = doctorProfile?.profileImage?.startsWith('http')
    ? doctorProfile.profileImage
    : 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=faces';

  const hasDeletion = deletionPending || doctorProfile?.status === 'pending_deletion';

  return (
    <>
      <div className="w-full min-h-full bg-[#F8FAFB] dark:bg-slate-950 p-4 lg:p-8 font-inter">
        {/* Header */}
        <div className="mb-7 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#055153]/10 dark:bg-teal-500/10 text-[#055153] dark:text-teal-400 rounded-lg text-[11px] font-extrabold uppercase tracking-widest mb-3">
              <UserCog size={13} /> Manage Profile
            </div>
            <h1 className="text-[26px] lg:text-[30px] font-black text-[#0D1C2E] dark:text-white tracking-tight font-manrope leading-tight">Account Settings</h1>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] font-medium mt-1">Update your credentials and manage security settings.</p>
          </div>
          {hasDeletion && (
            <div className="flex items-center gap-3 px-5 py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/50 rounded-2xl text-amber-800 dark:text-amber-300 text-[12px] font-bold max-w-xs">
              <AlertTriangle size={18} className="shrink-0 text-amber-500" />
              Account deletion is under admin review
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-6">
          {/* Identity Card */}
          <div className="flex flex-col gap-5">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm flex flex-col items-center text-center">
              <div className="relative mb-4">
                <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#055153]/10 dark:border-teal-500/20 shadow-lg">
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-white dark:border-slate-900 flex items-center justify-center">
                  <ShieldCheck size={13} className="text-white" />
                </div>
              </div>
              <h2 className="text-[17px] font-black text-[#0D1C2E] dark:text-white font-manrope">Dr. {doctorProfile?.name || user?.name || 'Doctor'}</h2>
              <span className="mt-1 inline-block px-3 py-0.5 bg-[#055153]/10 dark:bg-teal-500/10 text-[#055153] dark:text-teal-400 text-[11px] font-extrabold uppercase tracking-widest rounded-lg">
                {doctorProfile?.specialization || 'Specialist'}
              </span>
              {(doctorProfile?.rating?.average > 0) && (
                <div className="mt-3 flex items-center gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill={i < Math.round(doctorProfile.rating.average) ? 'currentColor' : 'none'} />
                  ))}
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 ml-1 font-bold">({doctorProfile.rating.count})</span>
                </div>
              )}
              <div className="w-full mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 space-y-3 text-left">
                <Field label="Hospital" value={doctorProfile?.hospital} icon={Hospital} />
                <Field label="Experience" value={doctorProfile?.experience ? `${doctorProfile.experience} years` : null} icon={Clock} />
                <Field label="Qualifications" value={doctorProfile?.qualifications} icon={GraduationCap} />
                {doctorProfile?.languages?.length > 0 && <Field label="Languages" value={doctorProfile.languages.join(', ')} icon={Globe} />}
                {doctorProfile?.consultationFee > 0 && <Field label="Consultation Fee" value={`LKR ${doctorProfile.consultationFee.toLocaleString()}`} icon={HeartPulse} />}
              </div>
              <div className="w-full mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-2xl flex gap-2 text-slate-500 dark:text-slate-400 text-[11px] font-medium text-left">
                <Shield size={14} className="shrink-0 mt-0.5 text-slate-400" />
                To update clinical profile (specialization, hospital, qualifications), contact the network administrator.
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#055153] to-[#033c3e] rounded-3xl p-5 text-white shadow-lg shadow-[#055153]/20">
              <p className="text-[10px] font-bold uppercase tracking-widest text-teal-100/70 mb-1">Doctor ID</p>
              <p className="text-[15px] font-black tracking-wider">{doctorProfile?.doctorId || '—'}</p>
              <div className="mt-4 flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${doctorProfile?.isVerified ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`} />
                <p className="text-[11px] font-bold text-white/80">{doctorProfile?.isVerified ? 'Verified Physician' : 'Verification Pending'}</p>
              </div>
            </div>
          </div>

          {/* Right Tabs */}
          <div className="flex flex-col gap-5">
            <div className="flex bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-1 shadow-sm w-fit">
              {[{ id: 'security', label: 'Security Settings' }, { id: 'danger', label: 'Danger Zone' }].map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                    activeTab === tab.id
                      ? tab.id === 'danger' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-[#055153] text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  {tab.id === 'danger' && <AlertTriangle size={12} className="inline mr-1.5 -mt-0.5" />}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 p-6 lg:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#055153]/4 dark:bg-teal-500/5 rounded-bl-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-[#055153]/10 dark:bg-teal-500/10 flex items-center justify-center">
                    <Lock size={18} className="text-[#055153] dark:text-teal-400" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-black text-[#0D1C2E] dark:text-white font-manrope">Security &amp; Contact</h2>
                    <p className="text-slate-400 dark:text-slate-500 text-[12px] font-medium">Update your email, phone or password</p>
                  </div>
                </div>
                <form onSubmit={handleSaveSecurity} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputGroup label="Email Address" icon={Mail} error={secErrors.email}>
                      <input type="email" value={secForm.email} onChange={e => setSecForm(p => ({ ...p, email: e.target.value }))} placeholder="doctor@hospital.com"
                        className={`w-full px-4 py-3.5 bg-[#F8FAFB] dark:bg-slate-800/60 border ${secErrors.email ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} rounded-2xl text-[13.5px] font-semibold text-[#0D1C2E] dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:border-[#055153] dark:focus:border-teal-500 focus:ring-4 focus:ring-[#055153]/10 transition-all`} />
                    </InputGroup>
                    <InputGroup label="Phone Number" icon={Phone} error={secErrors.phone}>
                      <input type="text" value={secForm.phone} onChange={e => setSecForm(p => ({ ...p, phone: e.target.value }))} placeholder="0771234567" maxLength={10}
                        className={`w-full px-4 py-3.5 bg-[#F8FAFB] dark:bg-slate-800/60 border ${secErrors.phone ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'} rounded-2xl text-[13.5px] font-semibold text-[#0D1C2E] dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:border-[#055153] dark:focus:border-teal-500 focus:ring-4 focus:ring-[#055153]/10 transition-all`} />
                    </InputGroup>
                  </div>
                  <div className="relative py-2">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-800" /></div>
                    <div className="relative flex justify-center"><span className="px-3 bg-white dark:bg-slate-900 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Change Password (optional)</span></div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <InputGroup label="New Password" icon={Lock} iconColor="#6366f1" error={secErrors.password}>
                      <div className="relative">
                        <input type={showPwd ? 'text' : 'password'} value={secForm.password} onChange={e => setSecForm(p => ({ ...p, password: e.target.value }))} placeholder="Leave blank to keep current"
                          className={`w-full pl-4 pr-11 py-3.5 bg-white dark:bg-slate-800/60 border-2 ${secErrors.password ? 'border-red-300' : 'border-slate-100 dark:border-slate-700'} rounded-2xl text-[13.5px] font-semibold text-[#0D1C2E] dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all`} />
                        <button type="button" onClick={() => setShowPwd(p => !p)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                          {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </InputGroup>
                    <InputGroup label="Confirm Password" icon={ShieldCheck} iconColor="#6366f1" error={secErrors.confirmPassword}>
                      <div className="relative">
                        <input type={showConfirm ? 'text' : 'password'} value={secForm.confirmPassword} onChange={e => setSecForm(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="Re-enter new password"
                          className={`w-full pl-4 pr-11 py-3.5 bg-white dark:bg-slate-800/60 border-2 ${secErrors.confirmPassword ? 'border-red-300' : 'border-slate-100 dark:border-slate-700'} rounded-2xl text-[13.5px] font-semibold text-[#0D1C2E] dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 transition-all`} />
                        <button type="button" onClick={() => setShowConfirm(p => !p)} className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors">
                          {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </InputGroup>
                  </div>
                  <p className="text-[11.5px] text-slate-400 font-medium">Leave password fields blank to keep your current password.</p>
                  <div className="pt-4 flex items-center justify-end border-t border-slate-100 dark:border-slate-800">
                    <button type="submit" disabled={savingAuth}
                      className="flex items-center gap-2.5 px-8 py-3.5 bg-[#055153] hover:bg-[#033c3e] disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white font-bold text-[14px] rounded-2xl shadow-lg shadow-[#055153]/25 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed">
                      {savingAuth ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Danger Zone Tab */}
            {activeTab === 'danger' && (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-red-100 dark:border-red-900/30 p-6 lg:p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                    <Trash2 size={18} className="text-red-500" />
                  </div>
                  <div>
                    <h2 className="text-[17px] font-black text-red-600 dark:text-red-400 font-manrope">Danger Zone</h2>
                    <p className="text-slate-400 dark:text-slate-500 text-[12px] font-medium">Irreversible and destructive actions</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-red-100 dark:border-red-900/40 overflow-hidden">
                  <div className="bg-red-50/50 dark:bg-red-900/10 px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <p className="text-[14px] font-bold text-[#0D1C2E] dark:text-white">Request Account Deletion</p>
                      <p className="text-[12px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed max-w-md">
                        Submitting this request will flag your profile for admin review. Your account will not be deleted immediately — an administrator must approve before permanent deletion.
                      </p>
                    </div>
                    <button onClick={() => setShowDeleteDialog(true)} disabled={hasDeletion}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all shrink-0 ${
                        hasDeletion
                          ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 cursor-not-allowed border border-amber-200 dark:border-amber-700/50'
                          : 'bg-red-500 hover:bg-red-600 text-white shadow-md shadow-red-500/25 hover:-translate-y-0.5 active:translate-y-0'
                      }`}
                    >
                      {hasDeletion ? <><AlertTriangle size={14} /> Request Pending</> : <><Trash2 size={14} /> Request Deletion</>}
                    </button>
                  </div>
                  {hasDeletion && (
                    <div className="px-5 py-3 bg-amber-50 dark:bg-amber-900/10 border-t border-amber-100 dark:border-amber-900/30 flex items-center gap-2 text-amber-700 dark:text-amber-400 text-[12px] font-medium">
                      <CheckCircle2 size={14} className="shrink-0" />
                      Your deletion request has been received. Pending admin review within 24–48 hrs.
                    </div>
                  )}
                </div>
                <div className="mt-5 p-4 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-slate-100 dark:border-slate-700/50 text-[12px] text-slate-500 dark:text-slate-400 font-medium leading-relaxed space-y-1.5">
                  <p className="font-bold text-slate-600 dark:text-slate-300 text-[13px]">What happens when deletion is approved?</p>
                  <ul className="list-disc list-inside space-y-1 ml-1">
                    <li>Your doctor profile will be permanently removed from the system.</li>
                    <li>Patient records and prescriptions linked to you will be anonymized.</li>
                    <li>Your login access will be revoked immediately.</li>
                    <li>This action cannot be undone once approved by admin.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Deletion Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowDeleteDialog(false)} />
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 w-full max-w-md p-7">
            <div className="w-14 h-14 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-5">
              <AlertTriangle size={28} className="text-red-500" />
            </div>
            <h3 className="text-[19px] font-black text-[#0D1C2E] dark:text-white font-manrope mb-1">Confirm Deletion Request</h3>
            <p className="text-slate-500 dark:text-slate-400 text-[13px] mb-5">
              This will submit a deletion request to admin. Your account will <strong>not</strong> be deleted immediately — an admin must approve it first.
            </p>
            <div className="space-y-2 mb-6">
              <label className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
                Reason for deletion <span className="text-red-500">*</span>
              </label>
              <textarea rows={4} value={deleteReason} onChange={e => setDeleteReason(e.target.value)} placeholder="Please describe your reason for requesting account deletion..."
                className="w-full px-4 py-3 bg-[#F8FAFB] dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-[13px] font-medium text-[#0D1C2E] dark:text-white placeholder-slate-300 dark:placeholder-slate-600 focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-500/10 resize-none transition-all" />
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowDeleteDialog(false)} className="flex-1 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[13px] font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                Cancel
              </button>
              <button onClick={handleRequestDeletion} disabled={submittingDelete || !deleteReason.trim()}
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 disabled:bg-red-300 dark:disabled:bg-red-900/40 text-white text-[13px] font-bold rounded-2xl shadow-md shadow-red-500/25 transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {submittingDelete ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;
