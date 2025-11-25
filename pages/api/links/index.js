// pages/api/links/index.js
import prisma from "../../../lib/prisma";

/**
 * Simple URL validation using the WHATWG URL parser.
 * Returns a normalized URL string (including protocol).
 */
function normalizeUrl(input) {
  if (!input || typeof input !== "string") return null;

  // Trim whitespace
  let url = input.trim();

  // If user omitted protocol, default to https://
  if (!/^https?:\/\//i.test(url)) {
    url = "https://" + url;
  }

  try {
    // This will throw if not a valid URL
    const parsed = new URL(url);
    // Optionally: reject non-http(s) schemes
    if (!["http:", "https:"].includes(parsed.protocol)) return null;
    return parsed.toString();
  } catch (err) {
    return null;
  }
}

function genCode(len = 6) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    const links = await prisma.link.findMany({ orderBy: { createdAt: "desc" } });
    return res.status(200).json(links);
  }

  if (req.method === "POST") {
    const body = req.body || {};
    let { url, code } = body;

    // Normalize/validate URL
    const normalized = normalizeUrl(url);
    if (!normalized) {
      return res.status(400).json({ error: "Invalid URL" });
    }
    url = normalized;

    // Validate optional custom code
    if (code) {
      if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
        return res.status(400).json({ error: "Code must be 6–8 alphanumeric characters" });
      }
      const exists = await prisma.link.findUnique({ where: { code } });
      if (exists) {
        return res.status(409).json({ error: "Code already exists" });
      }
    } else {
      // generate unique code (try a few times)
      let tries = 0;
      let candidate = genCode(6);
      while (tries < 6) {
        const exists = await prisma.link.findUnique({ where: { code: candidate } });
        if (!exists) break;
        candidate = genCode(6 + Math.floor(Math.random() * 3));
        tries++;
      }
      code = candidate;
      // Final collision check
      const confirm = await prisma.link.findUnique({ where: { code } });
      if (confirm) {
        return res.status(500).json({ error: "Unable to generate unique code, try again" });
      }
    }

    const created = await prisma.link.create({
      data: { code, url }
    });

    // Return created link
    return res.status(201).json(created);
  }

  return res.setHeader("Allow", ["GET", "POST"]).status(405).end();
}
