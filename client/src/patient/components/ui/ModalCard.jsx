export default function ModalCard({ isOpen, title, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/45 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <button type="button" onClick={onClose} className="text-sm font-medium text-slate-500 hover:text-slate-700">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
