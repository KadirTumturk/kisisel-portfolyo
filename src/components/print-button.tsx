"use client";

export function PrintButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-md bg-clay px-4 py-2 text-sm font-medium text-white hover:bg-clay/90"
    >
      {label}
    </button>
  );
}
