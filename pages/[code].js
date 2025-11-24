export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export const getServerSideProps = async ({ params }) => {
  const prisma = (await import('../lib/prisma')).default;
  const { code } = params;

  const link = await prisma.link.findUnique({ where: { code }});
  if (!link) return { notFound: true };

  await prisma.link.update({
    where: { code },
    data: { clicks: { increment: 1 }, lastClicked: new Date() }
  });

  return {
    redirect: {
      destination: link.url,
      permanent: false,
    }
  };
};

export default function RedirectPage() {
  return null;
}

export const config = {
  runtime: "nodejs",
};
