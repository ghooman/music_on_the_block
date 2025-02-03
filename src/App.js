import "./App.css";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Intro from "./components/Intro";

function App() {

  return (
    <div className="App">
      <title>MUSIC ON THE BLOCK</title>
      <Intro/>
      {/* <Header/> */}
    </div>
  );
}

export default App;
