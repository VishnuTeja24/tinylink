import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  const { code } = req.query;

  // Get stats for a specific link
  if (req.method === "GET") {
    const link = await prisma.link.findUnique({ where: { code } });
    if (!link) return res.status(404).json({ error: "Not found" });
    return res.status(200).json(link);
  }

  // Delete link
  if (req.method === "DELETE") {
    try {
      await prisma.link.delete({ where: { code } });
      return res.status(204).end();
    } catch {
      return res.status(404).json({ error: "Not found" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
