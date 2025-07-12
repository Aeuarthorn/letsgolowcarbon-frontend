import React from "react";
import { Routes, Route } from "react-router-dom";
import HomeStaysList from "./HomeStaysList";
import HomeStaysDetail from "./HomeStaysDetail";

function MainHomeStays() {
  return (
    <Routes>
      <Route path="/" element={<HomeStaysList />} />
      <Route path="/:slug/:id" element={<HomeStaysDetail />} />
    </Routes>
  );
}

export default MainHomeStays;
