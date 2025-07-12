import React from "react";
import { Routes, Route } from "react-router-dom";
import TravelList from "./TravelList";
import TravelDetail from "./TravelDetail";

function MainTravel() {
  return (
    <Routes>
      <Route path="/" element={<TravelList />} />
      <Route path="/:slug/:id" element={<TravelDetail />} />
    </Routes>
  );
}

export default MainTravel;
