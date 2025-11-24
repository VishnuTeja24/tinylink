export const dynamic = "force-dynamic";

export async function getServerSideProps({ params }) {
  const { code } = params;

  const prisma = (await import("../lib/prisma")).default;

  const link = await prisma.link.findUnique({
    where: { code }
  });

  if (!link) {
    return { notFound: true };
  }

  // Count the click
  await prisma.link.update({
    where: { code },
    data: {
      clicks: { increment: 1 },
      lastClicked: new Date(),
    },
  });

  // Redirect user to real URL
  return {
    redirect: {
      destination: link.url,
      permanent: false,
    },
  };
}

export default function Redirect() {
  return null;
}
