import React, { useEffect, useState } from 'react';
import { Plus, Trash2, StickyNote, Edit3 } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { useDoctorContext } from '../../context/DoctorContext';
import customFetch from '../../utils/customFetch';
import { toast } from 'react-hot-toast';

const NOTE_COLORS = [
  'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-700/40',
  'bg-sky-50 border-sky-100 dark:bg-sky-900/20 dark:border-sky-700/40',
  'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-700/40',
  'bg-rose-50 border-rose-100 dark:bg-rose-900/20 dark:border-rose-700/40',
];

const Notes = () => {
  const { doctorId, doctorProfile } = useDoctorContext();
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const resolvedDoctorId = doctorId || doctorProfile?.doctorId || null;

  useEffect(() => {
    if (!resolvedDoctorId) return;

    const fetchNotes = async () => {
      try {
        setLoading(true);
        const { data } = await customFetch.get(`/api/doctors/${resolvedDoctorId}/notes`);
        if (data?.success && Array.isArray(data.data)) {
          setNotes(data.data);
        } else {
          setNotes([]);
        }
      } catch (e) {
        console.error('Failed to load clinical notes from server', e);
        toast.error('Failed to load clinical notes');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [resolvedDoctorId]);

  const handleAddNote = async () => {
    if (!resolvedDoctorId) {
      toast.error('Doctor profile not loaded yet. Please try again in a moment.');
      return;
    }

    try {
      setSaving(true);
      const { data } = await customFetch.post(`/api/doctors/${resolvedDoctorId}/notes`, {
        title: 'New clinical note',
        content: '',
      });

      if (data?.success && data.data) {
        const created = data.data;
        setNotes(prev => [created, ...prev]);
        setActiveId(created._id);
        toast.success('Note added');
      }
    } catch (e) {
      console.error('Failed to create clinical note', e);
      toast.error('Failed to create note');
    } finally {
      setSaving(false);
    }
  };

  const saveNoteField = async (id, updates) => {
    if (!resolvedDoctorId) return;
    try {
      await customFetch.put(`/api/doctors/${resolvedDoctorId}/notes/${id}`, updates);
    } catch (e) {
      console.error('Failed to update clinical note', e);
      toast.error('Failed to update note');
    }
  };

  const handleChange = (id, field, value) => {
    setNotes(prev =>
      prev.map(n =>
        n._id === id ? { ...n, [field]: value, updatedAt: new Date().toISOString() } : n
      )
    );
    saveNoteField(id, { [field]: value });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this clinical note? This action cannot be undone.'
    );
    if (!confirmed) return;

    if (!resolvedDoctorId) {
      toast.error('Doctor profile not loaded yet. Please try again in a moment.');
      return;
    }

    try {
      setSaving(true);
      await customFetch.delete(`/api/doctors/${resolvedDoctorId}/notes/${id}`);
      setNotes(prev => prev.filter(n => n._id !== id));
      if (activeId === id) setActiveId(null);
      toast.success('Note deleted');
    } catch (e) {
      console.error('Failed to delete clinical note', e);
      toast.error('Failed to delete note');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (iso) => {
    try {
      if (!iso) return '';
      const d = typeof iso === 'string' ? parseISO(iso) : iso;
      return format(d, 'dd MMM yyyy, HH:mm');
    } catch {
      return '';
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#F8FAFB] dark:bg-slate-950 flex flex-col p-6 lg:p-8 transition-colors duration-300 font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-[26px] xl:text-[30px] font-bold text-[#0D1C2E] dark:text-white mb-1 tracking-tight flex items-center gap-2">
            <StickyNote className="text-[#055153] dark:text-teal-400" size={26} />
            Clinical Notes
          </h1>
          <p className="text-[#64748B] dark:text-slate-400 text-[14px] md:text-[15px] max-w-xl">
            Lightweight sticky notes for your own clinical reminders. Notes are stored per doctor in the MediLink database so they stay with you across sessions and devices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleAddNote}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#055153] hover:bg-[#044143] dark:bg-teal-600 dark:hover:bg-teal-500 text-white text-[14px] font-bold shadow-sm shadow-[#055153]/30 dark:shadow-black/30 transition-colors"
            disabled={saving || !resolvedDoctorId}
          >
            <Plus size={18} />
            Add Note
          </button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading && (
          <div className="col-span-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex items-center justify-center text-sm text-slate-600 dark:text-slate-300">
            Loading clinical notes...
          </div>
        )}

        {!loading && notes.length === 0 && (
          <div className="col-span-full max-w-lg bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 flex flex-col items-start gap-2">
            <p className="text-[14px] font-medium text-slate-600 dark:text-slate-300">
              You have no clinical sticky notes yet.
            </p>
            <p className="text-[13px] text-slate-500 dark:text-slate-400">
              Use <span className="font-semibold text-[#055153] dark:text-teal-400">Add Note</span> to capture quick follow-ups, protocol reminders, or patient-specific cues.
            </p>
          </div>
        )}

        {notes.map((note, idx) => {
          const colorClass = NOTE_COLORS[idx % NOTE_COLORS.length];
          const isActive = activeId === note._id;
          return (
            <div
              key={note._id}
              className={`relative rounded-2xl p-4 shadow-sm border ${colorClass} flex flex-col gap-3 transition-shadow hover:shadow-md`}
            >
              <div className="flex items-center gap-2 mb-1">
                <input
                  value={note.title || ''}
                  onChange={(e) => handleChange(note._id, 'title', e.target.value)}
                  placeholder="Note title"
                  className="flex-1 bg-transparent border-none text-[14px] font-semibold text-slate-800 dark:text-slate-50 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
                />
                <button
                  type="button"
                  onClick={() => setActiveId(isActive ? null : note._id)}
                  className={`p-1.5 rounded-full text-slate-500 hover:text-[#055153] dark:text-slate-400 dark:hover:text-teal-400 hover:bg-white/70 dark:hover:bg-slate-700/60 transition-colors`}
                  title={isActive ? 'Collapse' : 'Expand'}
                >
                  <Edit3 size={16} />
                </button>
              </div>

              <textarea
                rows={isActive ? 5 : 3}
                value={note.content || ''}
                onChange={(e) => handleChange(note._id, 'content', e.target.value)}
                placeholder="Type your clinical note here..."
                className="w-full bg-transparent border-none resize-none text-[13px] text-slate-700 dark:text-slate-200 outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />

              <div className="flex items-center justify-between mt-2 text-[11px] text-slate-500 dark:text-slate-400">
                <span>
                  {note.updatedAt
                    ? `Updated ${formatDate(note.updatedAt)}`
                    : note.createdAt
                    ? `Created ${formatDate(note.createdAt)}`
                    : ''}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Notes;
