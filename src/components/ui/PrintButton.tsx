"use client";

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="print:hidden bg-admin-primary text-white font-bold py-2 px-6 rounded-lg text-sm hover:brightness-110 shadow-sm transition-all flex items-center gap-2"
    >
      <span className="material-symbols-outlined text-[18px]">print</span>
      Imprimer / Télécharger PDF
    </button>
  );
}
