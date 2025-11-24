// 🔥 Force Vercel to run this page on the server
export const dynamic = "force-dynamic";

import prisma from "../lib/prisma";

export default function RedirectPage() {
  return null;
}

export async function getServerSideProps({ params }) {
  try {
    const link = await prisma.link.findUnique({
      where: { code: params.code },
    });

    if (!link) {
      return { notFound: true };
    }

    // Update clicks in database
    await prisma.link.update({
      where: { code: params.code },
      data: {
        clicks: link.clicks + 1,
        lastClicked: new Date(),
      },
    });

    return {
      redirect: {
        destination: link.url,
        permanent: false,
      },
    };
  } catch (error) {
    console.error("Redirect error:", error);
    return { notFound: true };
  }
}
