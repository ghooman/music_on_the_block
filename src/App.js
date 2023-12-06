import "./App.css";
import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Login from "./pages/Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false); // 토큰이 없을때
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem("token", "추후 토큰 추가");
    setIsLoggedIn(true);
  };

  return (
    <div className="App">
      {isLoggedIn ? <Header setIsLoggedIn={setIsLoggedIn}/> : <Login onLogin={handleLogin} />}
    </div>
  );
}

export default App;
