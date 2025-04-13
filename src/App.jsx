import { Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import CoffeeDetail from "./CoffeeDetail.jsx";

export default function App() {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/coffee/:id" element={<CoffeeDetail />} />
      </Routes>
    </main>
  );
}
