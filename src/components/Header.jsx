import { Rocket, Settings } from "lucide-react";

function Header({ onSettings }) {
  return (
    <header className="w-full py-6 px-6 md:px-10 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white grid place-items-center shadow-lg">
          <Rocket size={20} />
        </div>
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900">
            Autocorrect AI Studio
          </h1>
          <p className="text-sm text-gray-500">
            Real-time spelling, grammar, and style assistance
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={onSettings}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 shadow-sm"
      >
        <Settings size={18} />
        <span className="hidden sm:inline">Settings</span>
      </button>
    </header>
  );
}

export default Header;
