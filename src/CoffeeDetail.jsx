import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

export default function CoffeeDetail() {
  const { id } = useParams(); // 📢 Grab ID from URL
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoffeeShop() {
      try {
        const response = await fetch(
          `https://data.cityofnewyork.us/resource/43nn-pn8j.json?cuisine_description=Coffee%2FTea&dba=${encodeURIComponent(id)}`,
        );
        const data = await response.json();
        if (data.length > 0) {
          setShop(data[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching coffee shop:", error);
        setLoading(false);
      }
    }
    fetchCoffeeShop();
  }, [id]);

  function formatPhoneNumber(phone) {
    if (!phone) return "Not Available";
    const cleaned = ("" + phone).replace(/\D/g, "");
    if (cleaned.length === 10) {
      const areaCode = cleaned.slice(0, 3);
      const centralOfficeCode = cleaned.slice(3, 6);
      const lineNumber = cleaned.slice(6);
      return `(${areaCode}) ${centralOfficeCode}-${lineNumber}`;
    } else {
      return phone;
    }
  }

  if (loading) return <p>Loading coffee shop details...</p>;

  return (
    <div className="detail-view">
      <Link to="/" className="back-button">
        ← Back to List
      </Link>
      {shop ? (
        <>
          <h2>{shop.dba || "Unknown Name"}</h2>
          <p>
            <strong>Address:</strong> {shop.building} {shop.street}{" "}
            {shop.zipcode}
          </p>
          <p>
            <strong>Phone:</strong>{" "}
            {shop.phone ? formatPhoneNumber(shop.phone) : "Not Available"}
          </p>
          <p>
            <strong>Borough:</strong> {shop.borough || "Not Available"}
          </p>
          <p>
            <strong>Grade:</strong>{" "}
            {["A", "B", "C"].includes(shop.grade)
              ? shop.grade
              : "Not Available"}
          </p>
          <p>
            <strong>Inspection Date:</strong>{" "}
            {shop.inspection_date
              ? shop.inspection_date.split("T")[0]
              : "Not Available"}
          </p>
          <p>
            <strong>Violations:</strong>{" "}
            {shop.violation_description || "No major violations listed."}
          </p>
        </>
      ) : (
        <p>Shop not found.</p>
      )}
    </div>
  );
}
