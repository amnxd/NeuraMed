import React, { useState } from "react";

export default function CereSukhIframe() {
  const [open, setOpen] = useState(false);
  const SRC = "http://127.0.0.1:5500/mi.html"; // served by python -m http.server in services folder

  return (
    <div className="mt-10">
      <div className="rounded-3xl p-6 md:p-8 bg-white/90 border border-pink-100 shadow-2xl flex items-start gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-pink-500 flex items-center justify-center shadow-lg text-white text-2xl">✧</div>
        <div className="flex-1">
          <h3 className="text-3xl font-bold text-slate-800">CereSukh</h3>
          <p className="text-sm text-slate-500 -mt-1">Your AI Companion</p>
          <p className="text-slate-600 mt-3">Chat privately, get support, and practice mindful reflection.</p>
        </div>
        <button onClick={() => setOpen(true)} className="px-4 py-2 rounded-full text-white font-semibold bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 shadow">Open Companion</button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-3 border-b">
              <h4 className="text-xl font-semibold">CereSukh • Embedded</h4>
              <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-gray-200" aria-label="Close">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <iframe title="CereSukh" src={SRC} className="w-full h-full border-0" />
          </div>
        </div>
      )}
    </div>
  );
}
