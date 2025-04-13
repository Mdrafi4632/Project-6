import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import "./App.css";

export default function Home() {
  const [allShops, setAllShops] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempSearchTerm, setTempSearchTerm] = useState("");
  const [gradeFilter, setGradeFilter] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoffeeShops() {
      try {
        const response = await fetch(
          "https://data.cityofnewyork.us/resource/43nn-pn8j.json?cuisine_description=Coffee%2FTea&$limit=1000",
        );
        const data = await response.json();
        setAllShops(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching coffee shops:", error);
        setLoading(false);
      }
    }
    fetchCoffeeShops();
  }, []);

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

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA336A"];

  const zipCodeCounts = allShops.reduce((acc, shop) => {
    if (shop.zipcode) {
      acc[shop.zipcode] = (acc[shop.zipcode] || 0) + 1;
    }
    return acc;
  }, {});

  const topZipData = Object.entries(zipCodeCounts)
    .map(([zipcode, count]) => ({ zipcode, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const totalCoffeeShops = allShops.length;
  const gradeACoffeeShops = allShops.filter(
    (shop) => shop.grade === "A",
  ).length;
  const averageHealthScore = (
    allShops
      .filter((shop) => shop.score)
      .reduce((sum, shop) => sum + Number(shop.score), 0) /
    allShops.filter((shop) => shop.score).length
  ).toFixed(2);

  const filteredShops = allShops.filter((shop) => {
    const matchesName =
      shop.dba && shop.dba.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGrade = gradeFilter ? shop.grade === gradeFilter : true;
    return matchesName && matchesGrade;
  });

  const top10Popular = allShops
    .filter((shop) => shop.grade === "A")
    .slice(0, 10);
  const shopsToShow = searchTerm || gradeFilter ? filteredShops : top10Popular;

  return (
    <>
      <h1>NYC COFFEE SHOPS ☕️</h1>

      {/* 🔎 Search Bar with DONE */}
      <div className="search-bar">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search coffee shops..."
            value={tempSearchTerm}
            onChange={(e) => setTempSearchTerm(e.target.value)}
          />
          <button
            className="done-button"
            onClick={() => setSearchTerm(tempSearchTerm)}
          >
            Done
          </button>
        </div>
      </div>

      {/* 🗂️ Grade Filter */}
      <div className="filter-bar">
        <label htmlFor="grade">
          <strong>Filter by Grade:</strong>
        </label>
        <select
          id="grade"
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
        >
          <option value="">All Grades</option>
          <option value="A">Grade A</option>
          <option value="B">Grade B</option>
          <option value="C">Grade C</option>
        </select>
      </div>

      {loading ? (
        <p>Loading coffee shops...</p>
      ) : (
        <>
          {/* 📈 Summary Statistics */}
          <div className="summary-stats">
            <h2>Summary Statistics</h2>
            <p>
              <strong>Total Coffee Shops in NYC:</strong> {totalCoffeeShops}
            </p>
            <p>
              <strong>Average Health Score:</strong> {averageHealthScore}
            </p>
          </div>

          {/* 📋 Health Score Guide */}
          <div className="score-table">
            <h2>Health Score Guide</h2>
            <table>
              <thead>
                <tr>
                  <th>Score Range</th>
                  <th>Grade</th>
                  <th>Meaning</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>0–13</td>
                  <td>A</td>
                  <td>Very good</td>
                </tr>
                <tr>
                  <td>14–27</td>
                  <td>B</td>
                  <td>Okay but some problems</td>
                </tr>
                <tr>
                  <td>28 or higher</td>
                  <td>C</td>
                  <td>Poor or have some issues</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Charts side by side */}
          <div className="charts-wrapper">
            {/* 📊 Coffee Shops by Grade */}
            <div className="chart-container">
              <h2>Number of Coffee Shops by Grade</h2>
              <BarChart
                width={400}
                height={300}
                data={[
                  { grade: "A", count: gradeACoffeeShops },
                  {
                    grade: "B",
                    count: allShops.filter((shop) => shop.grade === "B").length,
                  },
                  {
                    grade: "C",
                    count: allShops.filter((shop) => shop.grade === "C").length,
                  },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="grade" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </div>

            {/* 🥧 Top 5 Zip Codes */}
            <div className="chart-container">
              <h2>Top 5 Zip Codes with Most Coffee Shops</h2>
              <PieChart width={400} height={600}>
                <Pie
                  data={topZipData}
                  dataKey="count"
                  nameKey="zipcode"
                  cx="50%"
                  cy="45%" /* Center vertically better */
                  outerRadius={100}
                  fill="#82ca9d"
                >
                  {topZipData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend
                  verticalAlign="bottom"
                  layout="horizontal" /* 👈 Layout legend in horizontal row */
                  align="center" /* 👈 Center the legend */
                  wrapperStyle={{ marginTop: 10 }}
                />
              </PieChart>
            </div>
          </div>

          {/* ☕️ Coffee Shop List */}
          <ul>
            <p className="bold-line">
              <strong>
                Showing {shopsToShow.length}{" "}
                {searchTerm || gradeFilter
                  ? "filtered results"
                  : "popular coffee shops"}
              </strong>
            </p>
            <p className="small-note">
              Click on a coffee shop name for more details!
            </p>

            {shopsToShow.map((shop, index) => (
              <li key={index}>
                <Link to={`/coffee/${encodeURIComponent(shop.dba)}`}>
                  <strong>{shop.dba || "Unknown Name"}</strong>
                </Link>
                <div className="address">
                  Address: {shop.building} {shop.street} {shop.zipcode} <br />
                  Phone:{" "}
                  {shop.phone
                    ? formatPhoneNumber(shop.phone)
                    : "Not Available"}{" "}
                  <br />
                  Grade:{" "}
                  {"ABC".includes(shop.grade) ? shop.grade : "Not Available"}
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
}
