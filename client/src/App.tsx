import React from "react";
import Container from "./components/Container";
import CharacterCard from "./components/CharacterCard";
import EditCard from "./components/EditCard";
import AddCharacter from "./components/AddCharacter";
import { Routes, Route, BrowserRouter } from "react-router-dom";
function App() {
  return (
    <>
      <div className="navbar ml-5 mb-2">
        <a
          href="/"
          className="navbar-brand text-white ml-5 border border-secondary rounded p-2"
        >
          Home
        </a>
      </div>
      <hr className="border border-secondary" style={{ width: "100%" }} />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CharacterCard />} />
          <Route path="/edit/:ID" element={<EditCard />} />
          <Route
            path="/add"
            element={
              <div
                className="container d-flex justify-content-center align-items-center"
                style={{ height: "80vh" }}
              >
                <AddCharacter />
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
