import React from "react";
import { Routes, Route } from "react-router-dom";
import CommunityProductsList from "./CommunityProductsList";
import CommunityProductsDetail from "./CommunityProductsDetail";

function MainCommunityProducts() {
  return (
    <Routes>
      <Route path="/" element={<CommunityProductsList />} />
      <Route path="/:slug/:id" element={<CommunityProductsDetail />} />
    </Routes>
  );
}

export default MainCommunityProducts;
