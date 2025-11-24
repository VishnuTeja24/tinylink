import { LinkIcon } from "lucide-react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto flex items-center gap-2 p-4">
          <LinkIcon className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-semibold tracking-tight">TinyLink Dashboard</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">{children}</main>
    </div>
  );
}
