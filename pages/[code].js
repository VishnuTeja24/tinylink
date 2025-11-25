export const dynamic = "force-dynamic";

export async function getServerSideProps({ params }) {
  const prisma = (await import("../lib/prisma")).default;

  const link = await prisma.link.findUnique({
    where: { code: params.code }
  });

  if (!link) {
    return { notFound: true };
  }

  // Update clicks safely
  await prisma.link.update({
    where: { code: params.code },
    data: {
      clicks: {
        increment: 1
      },
      lastClicked: new Date()
    }
  });

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
