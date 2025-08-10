import { useEffect, useState } from "react";
import { Link, Routes, Route, useParams } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

function Home() {
  const [ads, setAds] = useState([]);
  const [form, setForm] = useState({ title: "", price: "", desc: "" });

  useEffect(() => {
    fetch(`${API}/api/ads`, { credentials: "include" })
      .then((r) => r.json())
      .then(setAds);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API}/api/ads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
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

function AdPage() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);
  useEffect(() => {
    fetch(`${API}/api/ads/${id}`, { credentials: "include" })
      .then((r) => r.json())
      .then(setAd);
  }, [id]);
  if (!ad) return <div>Loading…</div>;
  return (
    <div
      style={{ maxWidth: 720, margin: "40px auto", fontFamily: "system-ui" }}
    >
      <h1>{ad.title}</h1>
      <p>
        <b>Price:</b> {ad.price} zł
      </p>
      <p>{ad.desc}</p>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/ads/:id" element={<AdPage />} />
    </Routes>
  );
}
