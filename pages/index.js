// pages/index.js
import useSWR from "swr";
import { useState } from "react";
import { useRouter } from "next/router";
import Layout from "../components/Layout";
import LinkRow from "../components/LinkRow";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function Dashboard() {
  const { data, error, mutate } = useSWR("/api/links", fetcher);
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  if (error) return <Layout><div>Failed to load</div></Layout>;
  if (!data) return <Layout><div>Loading...</div></Layout>;

  async function handleCreate(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    const res = await fetch("/api/links", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ url, code: code || undefined }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      setMsg(err.error || "Failed to create link");
      setLoading(false);
      return;
    }

    const created = await res.json();
    setMsg(`Created: /${created.code}`);
    setUrl("");
    setCode("");
    mutate();
    setLoading(false);
  }

  async function handleDelete(codeToDelete) {
    if (!confirm(`Delete ${codeToDelete}?`)) return;
    await fetch(`/api/links/${codeToDelete}`, { method: "DELETE" });
    mutate();
  }

  function handleStats(code) {
    // navigate to stats page
    router.push(`/code/${code}`);
  }

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">URL Shortener</h2>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white shadow rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-indigo-600" />
          Create New Short Link
        </h3>

        <form onSubmit={handleCreate} className="space-y-4">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/your-long-url" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Custom code (optional, 6–8 chars)" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
          <button type="submit" disabled={loading} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">{loading ? "Creating..." : "Create Short Link"}</button>
          {msg && <p className="text-sm text-indigo-600">{msg}</p>}
        </form>
      </motion.div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full border">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Code</th>
              <th className="px-4 py-3 text-left text-sm font-medium">URL</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Clicks</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Last Clicked</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((link) => (
              <LinkRow key={link.code} link={link} onDelete={handleDelete} onStats={handleStats} />
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
