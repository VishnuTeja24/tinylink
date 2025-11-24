// components/LinkRow.js
import React from "react";
import { Trash2, BarChart3 } from "lucide-react";

export default function LinkRow({ link, onDelete, onStats }) {
  // Use relative URL so it always hits the app on the same origin.
  // Using a relative path ensures the request goes to your Next.js redirect page: /<code>
  const shortPath = `/${link.code}`;
  // Also provide the full url to show/copy if needed:
  const shortUrl = `${process.env.NEXT_PUBLIC_BASE_URL || ""}/${link.code}`;

  return (
    <tr className="border-b hover:bg-gray-50 transition">
      {/* Code (clickable short link) */}
      <td className="px-4 py-3 font-medium text-indigo-600">
        {/* use relative href to force navigation to your app's /[code] route */}
        <a
          href={shortPath}
          // open in same tab so server-side redirect increments reliably before leaving
          // (you may change to _blank if you prefer new tab)
          target="_self"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {link.code}
        </a>
      </td>

      {/* Original URL (open target in new tab) */}
      <td className="px-4 py-3 text-gray-700 truncate max-w-xs">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          {link.url}
        </a>
      </td>

      {/* Click count */}
      <td className="px-4 py-3 text-center">{link.clicks}</td>

      {/* Last clicked */}
      <td className="px-4 py-3 text-gray-600">
        {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "—"}
      </td>

      {/* Actions */}
      <td className="px-4 py-3 flex items-center gap-2">
        {/* Stats Button */}
        <button
          onClick={() => onStats?.(link.code)}
          className="flex items-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded-md text-sm transition"
        >
          <BarChart3 size={14} /> Stats
        </button>

        {/* Delete Button */}
        <button
          onClick={() => onDelete(link.code)}
          className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 px-3 py-1 rounded-md text-sm transition"
        >
          <Trash2 size={14} /> Delete
        </button>
      </td>
    </tr>
  );
}
