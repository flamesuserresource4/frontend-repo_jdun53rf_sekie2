import { useEffect, useMemo, useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import SuggestionPanel from "./components/SuggestionPanel";

// Simple client-side spell suggestion mock for demo purposes.
// In a full implementation, these would come from backend APIs.
const DICT = [
  "accommodate","acknowledgment","occurrence","recommend","definitely","separate","receive","grammar","across","believe","necessary","their","there","they're","language","assistant","analysis","development","autocorrect","probability","suggestion"
];

function rankSuggestions(input) {
  const lower = input.toLowerCase();
  return DICT.map((w) => ({
    text: w,
    score: similarity(lower, w.toLowerCase()),
  }))
    .filter((s) => s.score > 0.2)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
}

function similarity(a, b) {
  // Jaccard on character bigrams (quick and stable for demo)
  const bigrams = (s) => new Set(Array.from({ length: Math.max(0, s.length - 1) }, (_, i) => s.slice(i, i + 2)));
  const A = bigrams(a);
  const B = bigrams(b);
  const inter = [...A].filter((x) => B.has(x)).length;
  const union = new Set([...A, ...B]).size || 1;
  return inter / union;
}

function App() {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en");
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSettings, setShowSettings] = useState(false);

  const lastWord = useMemo(() => {
    const parts = text.split(/\s+/).filter(Boolean);
    return parts[parts.length - 1] || "";
  }, [text]);

  const suggestions = useMemo(() => {
    if (!lastWord || lastWord.length < 2) return [];
    return rankSuggestions(lastWord);
  }, [lastWord]);

  useEffect(() => {
    setActiveIndex(0);
  }, [lastWord]);

  const handleSelect = (s) => {
    const parts = text.split(/(\s+)/); // keep spaces
    // replace last non-space token
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
            <p className="text-sm text-gray-600">This demo focuses on the UI. In a full version, connect to the backend APIs for hybrid rule + ML corrections, dictionaries, feedback, and multilingual support.</p>
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
