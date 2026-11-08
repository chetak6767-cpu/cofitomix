// Buyurtmani Telegram botga yuboradi. Token kodda emas, Netlify'dagi muhit o'zgaruvchilarida saqlanadi.
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method not allowed" };

  let d;
  try { d = JSON.parse(event.body); } catch { return { statusCode: 400, body: "Bad request" }; }

  const clean = (v, n) => String(v || "").replace(/[<>&]/g, "").slice(0, n);
  const name = clean(d.name, 60), phone = clean(d.phone, 30), drink = clean(d.drink, 60);
  if (!name || !phone || !drink) return { statusCode: 400, body: "Missing fields" };

  const text = `☕ Yangi buyurtma\n\nIsm: ${name}\nTelefon: ${phone}\nIchimlik: ${drink}`;

  const res = await fetch(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: process.env.CHAT_ID, text })
  });

  return { statusCode: res.ok ? 200 : 502, body: res.ok ? "ok" : "telegram error" };
};
