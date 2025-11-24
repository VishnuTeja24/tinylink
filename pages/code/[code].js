import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';

export default function Stats({ link }) {
  if (!link) {
    return <Layout><div>Not found</div></Layout>;
  }

  return (
    <Layout>
      <h2 className="text-xl font-semibold mb-4">Stats for {link.code}</h2>
      <div className="bg-white p-4 rounded shadow">
        <p><strong>Target URL:</strong> <a href={link.url} className="text-blue-600">{link.url}</a></p>
        <p><strong>Total clicks:</strong> {link.clicks}</p>
        <p><strong>Last clicked:</strong> {link.lastClicked ? new Date(link.lastClicked).toLocaleString() : '—'}</p>
        <p><strong>Created:</strong> {new Date(link.createdAt).toLocaleString()}</p>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const { code } = ctx.params;
  const link = await prisma.link.findUnique({ where: { code }});
  if (!link) {
    return { props: { link: null }, notFound: true };
  }
  return { props: { link: JSON.parse(JSON.stringify(link)) } };
}
