// pages/[code].js
import prisma from '../lib/prisma';

export async function getServerSideProps({ params }) {
  const { code } = params;
  const link = await prisma.link.findUnique({ where: { code }});
  if (!link) {
    return { notFound: true };
  }

  // increment clicks and update lastClicked
  await prisma.link.update({
    where: { code },
    data: { clicks: { increment: 1 }, lastClicked: new Date() }
  });

  // 302 redirect to the target url
  return {
    redirect: {
      destination: link.url,
      permanent: false
    }
  };
}

export default function RedirectPage() {
  return null;
}
