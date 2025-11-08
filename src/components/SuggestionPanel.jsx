import { Check, ChevronUp, ChevronDown } from "lucide-react";

function SuggestionPanel({ suggestions = [], activeIndex = 0, onSelect, onNavigate }) {
  if (!suggestions.length) {
    return (
      <div className="text-sm text-gray-500">No suggestions yet. Start typing to see options.</div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-gray-600">Suggestions (ranked)</p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onNavigate?.(-1)}
            className="p-1 rounded-md border border-gray-200 hover:bg-gray-50"
            aria-label="Previous suggestion"
          >
            <ChevronUp size={16} />
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.(1)}
            className="p-1 rounded-md border border-gray-200 hover:bg-gray-50"
            aria-label="Next suggestion"
          >
            <ChevronDown size={16} />
          </button>
        </div>
      </div>
      <ul className="space-y-2">
        {suggestions.map((s, idx) => (
          <li key={idx}>
            <button
              type="button"
              onClick={() => onSelect?.(s)}
              className={`w-full text-left px-3 py-2 rounded-lg border transition shadow-sm ${
                idx === activeIndex ? "bg-indigo-50 border-indigo-200" : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{s.text}</p>
                  <p className="text-xs text-gray-500">Probability {Math.round((s.score || 0) * 100)}%</p>
                </div>
                {idx === activeIndex && (
                  <span className="text-indigo-600"><Check size={18} /></span>
                )}
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SuggestionPanel;
