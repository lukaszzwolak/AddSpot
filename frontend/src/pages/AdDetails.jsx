import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function AdDetails() {
  const { id } = useParams();
  const [ad, setAd] = useState(null);

  useEffect(() => {
    fetch(`/api/ads/${id}`)
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
      <Link to="/">Back</Link>
    </div>
  );
}
