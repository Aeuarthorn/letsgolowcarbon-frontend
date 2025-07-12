import React from "react";
import { Routes, Route } from "react-router-dom";
import RestaurantsList from "./RestaurantsList";
import RestaurantsDetail from "./RestaurantsDetail";

function MainRestaurants() {
  return (
    <Routes>
      <Route path="/" element={<RestaurantsList />} />
      <Route path="/:slug/:id" element={<RestaurantsDetail />} />
    </Routes>
  );
}

export default MainRestaurants;
