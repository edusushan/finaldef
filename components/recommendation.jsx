import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import axios from "axios";
import RecommendCard from "./recommendProductCard";

export default function Recommendation({ addToCart, userData }) {
  const [details, setDetails] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (userData?.email) {
          const res = await axios.post("/api/algorithm/recommend", {
            email: userData?.email,
          });
          console.log("response", res.data.data);
          setDetails(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching recommendation:", error);
      }
    };

    fetchData();
  }, [userData]);
  return (
    userData &&
    userData?.email &&
    details && (
      <div className="py-8">
        <h2 className="px-3 mx-1 pb-6  text-xl font-bold text-violet-900 sm:text-3xl">
          Recommended Products
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3 ">
          {details &&
            details.map((d, i) => (
              <RecommendCard key={i} details={d} addToCart={addToCart} />
            ))}
        </div>
      </div>
    )
  );
}
