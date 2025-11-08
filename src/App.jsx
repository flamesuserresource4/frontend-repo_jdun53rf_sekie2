import { useEffect, useMemo, useRef, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import SuggestionPanel from "./components/SuggestionPanel";

const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const abortRef = useRef(null);

  const lastWord = useMemo(() => {
    const parts = text.split(/\s+/).filter(Boolean);
    return parts[parts.length - 1] || "";
  }, [text]);

  useEffect(() => {
    setActiveIndex(0);
  }, [lastWord]);

  useEffect(() => {
    // Fetch NLTK-based suggestions from backend for the current text
    const controller = new AbortController();
    if (abortRef.current) abortRef.current.abort();
    abortRef.current = controller;

    async function fetchSuggestions() {
      if (!lastWord || lastWord.length < 1) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`${BASE_URL}/api/suggest`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, language, limit: 5 }),
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setSuggestions(Array.isArray(data?.suggestions) ? data.suggestions : []);
      } catch (e) {
        if (e.name !== "AbortError") {
          setSuggestions([]);
        }
      }
    }

    // slight debounce to avoid firing on every keystroke
    const t = setTimeout(fetchSuggestions, 150);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [text, language, lastWord]);

  const handleSelect = (s) => {
    const parts = text.split(/(\s+)/); // keep spaces
    for (let i = parts.length - 1; i >= 0; i--) {
      if (!/^\s+$/.test(parts[i])) {
        parts[i] = s.text;
        break;
      }
    }
    setText(parts.join(""));
  };

  const handleNavigate = (delta) => {
    if (!suggestions.length) return;
    setActiveIndex((i) => (i + delta + suggestions.length) % suggestions.length);
  };

  const applyActive = () => {
    if (suggestions[activeIndex]) handleSelect(suggestions[activeIndex]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-fuchsia-50 text-gray-900">
      <Header onSettings={() => setShowSettings(true)} />

      <main className="px-6 md:px-10 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-6">
          <Sidebar
            language={language}
            onLanguageChange={setLanguage}
            onOpenDictionary={() => alert("Custom dictionary UI will open here.")}
          />

          <section className="bg-white/70 backdrop-blur rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold">Editor</h2>
              <div className="text-sm text-gray-500">Language: {language.toUpperCase()}</div>
            </div>

            <Editor value={text} onChange={setText} onKeyNavigate={handleNavigate} />

            <div className="h-px bg-gray-100 my-5" />

            <div className="grid md:grid-cols-2 gap-4 items-start">
              <SuggestionPanel
                suggestions={suggestions}
                activeIndex={activeIndex}
                onSelect={handleSelect}
                onNavigate={handleNavigate}
              />

              <div className="text-sm text-gray-600">
                <p className="mb-2 font-medium">How it works</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Suggestions update in real-time as you type.</li>
                  <li>Powered by a backend engine using NLTK distance metrics.</li>
                  <li>Use the arrows or Cmd/Ctrl + Arrow keys to cycle.</li>
                  <li>Click a suggestion to apply it to the last word.</li>
                </ul>
                <button
                  type="button"
                  onClick={applyActive}
                  className="mt-4 inline-flex items-center justify-center px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Apply top suggestion
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {showSettings && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 bg-black/30 backdrop-blur-sm grid place-items-center p-4"
          onClick={() => setShowSettings(false)}
        >
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2">Settings</h3>
            <p className="text-sm text-gray-600">This version connects the editor to a backend suggestion API built with NLTK for real-time word-level corrections. Extendable to grammar and style shortly.</p>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSettings(false)}
                className="px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
