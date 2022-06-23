import React from "react";
import Container from "./components/Container";
import CharacterCard from "./components/CharacterCard";
import EditCard from "./components/EditCard";
import AddCharacter from "./components/AddCharacter";
import { Routes, Route, BrowserRouter } from "react-router-dom";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CharacterCard />} />
          <Route path="/edit/:ID" element={<EditCard />} />
          <Route path="/add" element={<AddCharacter />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
