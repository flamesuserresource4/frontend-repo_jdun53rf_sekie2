import { Globe, BookMarked, History } from "lucide-react";

function Sidebar({ language, onLanguageChange, onOpenDictionary }) {
  const languages = [
    { code: "en", label: "English" },
    { code: "es", label: "Spanish" },
    { code: "fr", label: "French" },
    { code: "de", label: "German" },
  ];

  return (
    <aside className="w-full md:w-64 shrink-0 bg-white/70 backdrop-blur rounded-2xl border border-gray-100 p-4 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Globe size={18} className="text-indigo-600" />
        <h2 className="font-semibold text-gray-800">Language</h2>
      </div>
      <div className="space-y-2">
        {languages.map((l) => (
          <button
            key={l.code}
            type="button"
            onClick={() => onLanguageChange(l.code)}
            className={`w-full text-left px-3 py-2 rounded-lg border text-sm ${
              language === l.code ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >
            {l.label}
          </button>
        ))}
      </div>

      <div className="h-px bg-gray-100 my-4" />

      <button
        type="button"
        onClick={onOpenDictionary}
        className="w-full inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-sm"
      >
        <BookMarked size={16} /> Custom Dictionary
      </button>

      <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <History size={14} />
        Real-time correction with ranked suggestions
      </div>
    </aside>
  );
}

export default Sidebar;
