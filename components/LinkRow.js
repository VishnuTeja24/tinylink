// components/LinkRow.js
import React from "react";
import Link from "next/link";
import { Trash2, BarChart3 } from "lucide-react";

export default function LinkRow({ link, onDelete, onStats }) {
  // The short path should be relative so it hits the app's /[code] route and increments server clicks
  const shortPath = `/${link.code}`;

  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-4 py-3 font-medium text-indigo-600">
        <a href={shortPath} target="_self" rel="noopener noreferrer" className="hover:underline">
          {link.code}
        </a>
      </td>

      <td className="px-4 py-3 text-gray-700 truncate max-w-xs">
        <a href={link.url} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {link.url}
        </a>
      </td>

      <td className="px-4 py-3 text-center">{link.clicks ?? 0}</td>

      <td className="px-4 py-3 text-gray-600">
        {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "—"}
      </td>

      <td className="px-4 py-3 flex items-center gap-2">
        <button
          onClick={() => onStats?.(link.code)}
          className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-md text-sm transition"
        >
          <BarChart3 size={14} /> Stats
        </button>

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
