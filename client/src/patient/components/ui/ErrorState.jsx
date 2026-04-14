export default function ErrorState({ message, onRetry }) {
  return (
    <div className="w-full rounded-2xl border border-red-100 bg-red-50 p-5">
      <p className="text-sm text-red-700">{message}</p>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Try Again
        </button>
      ) : null}
    </div>
  );
}
