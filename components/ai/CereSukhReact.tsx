import React, { useEffect, useMemo, useRef, useState } from "react";

export default function CereSukhReact() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([
    { sender: "ai", text: "Hello! I'm your AI Wellness Assistant. How are you feeling today? You can talk to me about anything on your mind." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState("en-US");
  const [listening, setListening] = useState(false);
  const logRef = useRef<HTMLDivElement | null>(null);
  const API_URL = useMemo(() => (import.meta as any).env?.VITE_API_URL || "http://127.0.0.1:5000", []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [messages, open]);

  async function sendMessage(text?: string) {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    setMessages((prev) => [...prev, { sender: "user", text: content }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content, language: lang }),
      });
      const data = await res.json();
      const aiResponse = data.reply || data.error || "I'm having trouble connecting right now.";
      setMessages((prev) => [...prev, { sender: "ai", text: aiResponse }]);
    } catch (e) {
      setMessages((prev) => [...prev, { sender: "ai", text: "I'm sorry, I'm having trouble connecting to the server." }]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!open) return;
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = lang;

    function start() { try { recognition.start(); } catch {} }
    function stop() { try { recognition.stop(); } catch {} }

    // @ts-ignore
    (window as any).__cere_start_listen = () => { setListening(true); start(); };
    // @ts-ignore
    (window as any).__cere_stop_listen = () => { setListening(false); stop(); };

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.onresult = (e: any) => {
      const transcript = e?.results?.[0]?.[0]?.transcript?.trim();
      if (transcript) sendMessage(transcript);
    };

    return () => {
      // @ts-ignore
      delete (window as any).__cere_start_listen;
      // @ts-ignore
      delete (window as any).__cere_stop_listen;
      stop();
    };
  }, [open, lang]);

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
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl flex flex-col" style={{ height: "80vh" }}>
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-3xl md:text-4xl font-bold mb-0 bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 bg-clip-text text-transparent">CereSukh</h3>
              <div className="flex items-center gap-2">
                <select value={lang} onChange={(e) => setLang(e.target.value)} className="text-sm rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500">
                  <option value="en-US">English</option>
                  <option value="hi-IN">हिन्दी (Hindi)</option>
                  <option value="bn-IN">বাংলা (Bengali)</option>
                  <option value="ur-IN">اردو (Urdu)</option>
                  <option value="ta-IN">தமிழ் (Tamil)</option>
                  <option value="te-IN">తెలుగు (Telugu)</option>
                  <option value="mr-IN">मराठी (Marathi)</option>
                  <option value="gu-IN">ગુજરાતી (Gujarati)</option>
                  <option value="kn-IN">ಕನ್ನಡ (Kannada)</option>
                  <option value="ml-IN">മലയാളം (Malayalam)</option>
                  <option value="pa-IN">ਪੰਜਾਬੀ (Punjabi)</option>
                  <option value="es-ES">Español</option>
                  <option value="fr-FR">Français</option>
                  <option value="de-DE">Deutsch</option>
                  <option value="zh-CN">中文 (Mandarin)</option>
                  <option value="ja-JP">日本語 (Japanese)</option>
                  <option value="ar-SA">العربية (Arabic)</option>
                  <option value="pt-PT">Português</option>
                  <option value="ru-RU">Русский (Russian)</option>
                </select>
                <button onClick={() => setOpen(false)} className="p-2 rounded-full hover:bg-gray-200" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div ref={logRef} className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.sender === "user" ? "justify-end" : ""}`}>
                  <div className={`p-3 rounded-lg max-w-xs md:max-w-md ${m.sender === "user" ? "bg-blue-500 text-white" : "bg-blue-100 text-gray-800"}`}
                    dangerouslySetInnerHTML={{ __html: m.text.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              ))}
              {loading && (
                <div className="flex">
                  <div className="p-3 bg-blue-100 text-gray-800 rounded-lg max-w-xs md:max-w-md italic">Typing...</div>
                </div>
              )}
            </div>

            <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="p-4 border-t flex gap-2">
              <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or press the mic to talk..." className="flex-1 p-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400" />
              <button type="button" onClick={() => {
                // @ts-ignore
                if ((window as any).__cere_start_listen && !listening) (window as any).__cere_start_listen();
                // @ts-ignore
                else if ((window as any).__cere_stop_listen && listening) (window as any).__cere_stop_listen();
              }} className={`p-3 w-12 h-12 rounded-full transition-colors ${listening ? "bg-red-200" : "hover:bg-gray-200"}`} aria-label="Mic">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </button>
              <button type="submit" disabled={loading} className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-600 transition-colors">Send</button>
            </form>
            <div className="p-4 bg-gray-50 rounded-b-xl text-center text-sm text-gray-600">
              If you're not satisfied or need further help: <a href="#support" className="text-blue-600 font-semibold hover:underline">Connect with a professional consultant →</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
