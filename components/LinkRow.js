import Link from "next/link";
import { BarChart2, Trash2 } from "lucide-react";

export default function LinkRow({ link, onDelete }) {
  return (
    <tr className="border-t hover:bg-gray-50">
      <td className="px-4 py-3 font-medium text-indigo-600">{link.code}</td>
      <td className="px-4 py-3 max-w-xs truncate text-gray-700">{link.url}</td>
      <td className="px-4 py-3">{link.clicks}</td>
      <td className="px-4 py-3 text-gray-500">
        {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : "—"}
      </td>

      <td className="px-4 py-3 flex gap-3">
        <Link
          href={`/code/${link.code}`}
          className="flex items-center gap-1 text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 transition"
        >
          <BarChart2 className="w-4 h-4" /> Stats
        </Link>

        <button
          onClick={() => onDelete(link.code)}
          className="flex items-center gap-1 text-sm px-3 py-1 rounded bg-red-100 hover:bg-red-200 text-red-700 transition"
        >
          <Trash2 className="w-4 h-4" /> Delete
        </button>
      </td>
    </tr>
  );
}
