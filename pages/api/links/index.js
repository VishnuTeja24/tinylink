import prisma from "../../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    // return list of all links
    const links = await prisma.link.findMany({
      orderBy: { createdAt: "desc" }
    });
    return res.status(200).json(links);
  }

  if (req.method === "POST") {
    let { url, code } = req.body;

    // Auto-add https:// if missing
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    // Ensure random code if empty
    if (!code) {
      code = Math.random().toString(36).substring(2, 8);
    }

    try {
      const newLink = await prisma.link.create({
        data: { url, code }
      });

      return res.status(201).json(newLink);
    } catch (err) {
      return res.status(400).json({ error: "Code already exists" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
