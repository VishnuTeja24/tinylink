import prisma from '../../../lib/prisma';
import isUrl from 'is-url-superb';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const links = await prisma.link.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return res.status(200).json(links);
  }

  if (req.method === 'POST') {
    const { url, code } = req.body || {};
    if (!url || typeof url !== 'string' || !isUrl(url)) {
      return res.status(400).json({ error: 'Invalid or missing URL' });
    }

    if (code) {
      if (!/^[A-Za-z0-9]{6,8}$/.test(code)) {
        return res
          .status(400)
          .json({ error: 'Code must match [A-Za-z0-9]{6,8}' });
      }
    }

    function genCode(len = 6) {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let s = '';
      for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
      return s;
    }

    let finalCode = code ?? genCode(6);

    let tries = 0;
    while (tries < 5) {
      const existing = await prisma.link.findUnique({ where: { code: finalCode }});
      if (!existing) break;
      finalCode = genCode(6 + Math.floor(Math.random() * 3));
      tries++;
    }

    const existing = await prisma.link.findUnique({ where: { code: finalCode }});
    if (existing) {
      return res.status(409).json({ error: 'Code already exists' });
    }

    const created = await prisma.link.create({
      data: { code: finalCode, url }
    });

    return res.status(201).json(created);
  }

  return res.setHeader('Allow', ['GET','POST']).status(405).end();
}
