export default function Health() {
  return new Response(JSON.stringify({ ok: true, version: "1.0" }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
