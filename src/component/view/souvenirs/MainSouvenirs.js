import React from "react";
import { Routes, Route } from "react-router-dom";
import SouvenirsList from "./SouvenirsList";
import SouvenirsDetail from "./SouvenirsDetail";

function MainSouvenirs() {
  return (
    <Routes>
      <Route path="/" element={<SouvenirsList />} />
      <Route path="/:slug/:id" element={<SouvenirsDetail />} />
    </Routes>
  );
}

export default MainSouvenirs;
