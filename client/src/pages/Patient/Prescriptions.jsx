import React, { useState, useEffect } from 'react';
import { Pill, Calendar, Clock, ChevronDown, ChevronUp, FileText, Download, Loader2, Info } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import customFetch from '@/utils/customFetch';
import { usePatientAuth } from '@/patient/context/PatientAuthContext';

const PatientPrescriptions = () => {
  const { patientId } = usePatientAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      if (!patientId) return;
      try {
        setLoading(true);
        // Note: The proxy in vite maps /api/prescriptions to doctor-service which owns the schema
        const { data } = await customFetch.get(`/api/prescriptions/patient/${patientId}`);
        if (data.success || data.data) {
          setPrescriptions(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const activeCount = prescriptions.filter(p => p.status?.toLowerCase() === 'active').length;

  return (
    <div className="w-full bg-[#F8FAFB] min-h-[80vh] rounded-[32px] p-6 lg:p-8 animate-fade-in">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-[28px] font-bold text-[#0D1C2E] mb-2 tracking-tight">My Prescriptions</h1>
          <p className="text-slate-500 font-medium">
            You have <span className="font-bold text-[#055153]">{activeCount} active</span> prescriptions.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 size={40} className="animate-spin text-[#0D877B] mb-4" />
          <p className="text-slate-500 font-bold">Loading your medical records...</p>
        </div>
      ) : prescriptions.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-slate-50 flex items-center justify-center rounded-full mb-6">
            <FileText size={32} className="text-slate-300" />
          </div>
          <h3 className="text-[20px] font-bold text-[#0D1C2E] mb-2">No prescriptions found</h3>
          <p className="text-slate-500 text-[15px] max-w-md">
            You don't have any digital prescriptions issued to your account yet. When a doctor writes a script, it will appear securely here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5">
          {prescriptions.map((script) => (
            <div 
              key={script._id} 
              className={`bg-white rounded-[24px] border transition-all duration-300 shadow-sm overflow-hidden 
                ${expandedId === script._id ? 'border-[#055153] shadow-md' : 'border-slate-100 hover:border-slate-200'}`}
            >
              
              {/* Card Header (Clickable) */}
              <div 
                onClick={() => toggleExpand(script._id)}
                className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5 relative group"
              >
                <div className="flex items-start md:items-center gap-5">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors
                    ${script.status?.toLowerCase() === 'active' ? 'bg-[#ECFDF5] text-[#055153]' : 'bg-slate-100 text-slate-400'}`}>
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-[18px] font-bold text-[#0D1C2E] mb-1 group-hover:text-[#055153] transition-colors line-clamp-1">
                      {script.diagnosis || 'General Prescription'}
                    </h3>
                    <div className="flex items-center gap-3 text-[13px] font-semibold text-slate-500">
                      <span className="flex items-center gap-1.5"><Calendar size={14} className="opacity-70" /> {format(parseISO(script.date), 'MMM dd, yyyy')}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>{script.medicines?.length || 0} Medicines</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-14 md:ml-0 border-t border-slate-100 md:border-t-0 pt-4 md:pt-0 mt-2 md:mt-0">
                  <div className={`px-3 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg
                    ${script.status?.toLowerCase() === 'active' ? 'bg-[#A7F3D0] text-[#064E3B]' : 'bg-slate-100 text-slate-500'}`}>
                    {script.status || 'Active'}
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#055153] group-hover:text-white transition-colors">
                    {expandedId === script._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>
              </div>

              {/* Expanded Content (Medicines List) */}
              {expandedId === script._id && (
                <div className="bg-[#F8FAFB] p-6 md:p-8 border-t border-slate-100 animate-fade-in flex flex-col lg:flex-row gap-8">
                  
                  {/* Left Column: Medicine Breakdown */}
                  <div className="flex-1 space-y-4">
                    <h4 className="text-[14px] font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Pill size={16} /> Prescribed Medication
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {script.medicines?.map((med, idx) => (
                        <div key={idx} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 left-0 w-1 h-full bg-[#055153]"></div>
                          
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-bold text-[16px] text-[#0D1C2E] pr-4">{med.name}</h5>
                            <span className="bg-[#EEF2FF] text-[#3B82F6] px-2.5 py-1 rounded-md text-[11px] font-bold whitespace-nowrap">
                              {med.dosage}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-4 mb-3 pb-3 border-b border-slate-100">
                            <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                              <Clock size={14} className="text-slate-400" />
                              {med.frequency}
                            </div>
                            <div className="flex items-center gap-1.5 text-[13px] font-medium text-slate-600">
                              <Calendar size={14} className="text-slate-400" />
                              {med.duration}
                            </div>
                          </div>

                          {med.instructions && (
                            <div className="flex items-start gap-2 bg-amber-50 text-amber-800 p-2.5 rounded-xl text-[12.5px] font-medium">
                              <Info size={14} className="mt-0.5 shrink-0 opacity-70" />
                              <p>{med.instructions}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Doctor Notes & Actions */}
                  <div className="w-full lg:w-72 shrink-0">
                    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm h-full flex flex-col">
                      <h4 className="text-[13px] font-bold text-slate-500 uppercase tracking-widest mb-4">Physician Notes</h4>
                      
                      <div className="flex-1 mb-6 text-[14px] text-slate-600 font-medium leading-relaxed italic border-l-2 border-slate-200 pl-4 py-1">
                        "{script.notes || 'No specific notes provided for this prescription.'}"
                      </div>
                      
                      {script.followUpDate && (
                        <div className="mb-6 bg-[#F8FAFB] p-3 rounded-xl border border-slate-100">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Follow Up Required</p>
                          <p className="text-[14px] font-bold text-[#0D1C2E] flex items-center gap-2">
                             <Calendar size={14} className="text-[#055153]" /> 
                             {format(parseISO(script.followUpDate), 'MMMM dd, yyyy')}
                          </p>
                        </div>
                      )}

                      <button className="w-full flex items-center justify-center gap-2 px-5 py-3 text-[14px] font-bold bg-[#055153] hover:bg-[#044042] text-white rounded-xl transition-colors shadow-sm">
                        <Download size={16} /> Download PDF
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientPrescriptions;
