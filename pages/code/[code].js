// pages/code/[code].js
import Layout from "../../components/Layout";
import prisma from "../../lib/prisma";

export default function StatsPage({ link }) {
  if (!link) {
    return (
      <Layout>
        <div className="text-red-600">Not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Stats for {link.code}</h2>
      <div className="bg-white p-6 rounded shadow">
        <p className="mb-2"><strong>Short URL:</strong> <a href={`/${link.code}`} className="text-indigo-600 hover:underline">{link.code}</a></p>
        <p className="mb-2"><strong>Target URL:</strong> <a href={link.url} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline">{link.url}</a></p>
        <p className="mb-2"><strong>Total clicks:</strong> {link.clicks}</p>
        <p className="mb-2"><strong>Last clicked:</strong> {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : '—'}</p>
        <p className="mb-2"><strong>Created:</strong> {new Date(link.createdAt).toLocaleString()}</p>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { code } = ctx.params;
  const link = await prisma.link.findUnique({ where: { code }});
  if (!link) return { props: { link: null }, notFound: true };

  // Serialize dates for props
  const safe = {
    ...link,
    createdAt: link.createdAt?.toISOString(),
    lastClicked: link.lastClicked ? link.lastClicked.toISOString() : null,
  };

  return { props: { link: safe } };
}
