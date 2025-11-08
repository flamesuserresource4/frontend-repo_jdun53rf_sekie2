import { useEffect, useRef } from "react";

function Editor({ value, onChange, onKeyNavigate }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
        e.preventDefault();
        onKeyNavigate?.(e.key === "ArrowUp" ? -1 : 1);
      }
    };
    el.addEventListener("keydown", handler);
    return () => el.removeEventListener("keydown", handler);
  }, [onKeyNavigate]);

  return (
    <div className="w-full">
      <label htmlFor="editor" className="sr-only">Text editor</label>
      <textarea
        id="editor"
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start typing here…"
        className="w-full h-64 md:h-72 p-4 rounded-xl border border-gray-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 outline-none bg-white/80 backdrop-blur text-gray-900 placeholder:text-gray-400 shadow-sm"
      />
      <p className="mt-2 text-xs text-gray-500">Tip: Use Cmd/Ctrl + Arrow Up/Down to cycle suggestions.</p>
    </div>
  );
}

export default Editor;
