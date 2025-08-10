import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({ title: "", price: "", desc: "" });

  useEffect(() => {
    fetch("/api/ads")
      .then((r) => r.json())
      .then(setAds);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch("/api/ads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, price: Number(form.price) }),
    });
    if (res.ok) {
      const created = await res.json();
      setAds((a) => [created, ...a]);
      setForm({ title: "", price: "", desc: "" });
    }
  };

  return (
    <div
      style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}
    >
      <h1>AdSpot</h1>
      <form
        onSubmit={submit}
        style={{ display: "grid", gap: 8, marginBottom: 24 }}
      >
        <input
          placeholder="title"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
        />
        <input
          placeholder="price"
          type="number"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
        />
        <textarea
          placeholder="description"
          value={form.desc}
          onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))}
        />
        <button type="submit">Add</button>
      </form>
      <ul style={{ display: "grid", gap: 12, padding: 0 }}>
        {ads.map((ad) => (
          <li
            key={ad._id}
            style={{
              listStyle: "none",
              padding: 12,
              border: "1px solid #ddd",
              borderRadius: 12,
            }}
          >
            <Link to={`/ads/${ad._id}`}>
              <strong>{ad.title}</strong>
            </Link>
            <div>{ad.price} zł</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
