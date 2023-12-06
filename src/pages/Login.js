import React, { useEffect, useState } from "react";
import "../styles/Login.scss";
import LogoHansung from "../assets/images/hansung-logo.png";
const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // 로컬 스토리지에서 로그인 확인해서 로그인 확인
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      onLogin();
    }
  }, [onLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (username === "admin" && password === "1234") {
      localStorage.setItem("isLoggedIn", "true");
      onLogin();
    } else {
      setError("아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };
  return (
    <div className="login">
      <div className="login__container">
        <img className="login__logo" src={LogoHansung} alt="logoHansung" />
        <form className="login__input-box" onSubmit={handleSubmit}>
          <div className="input-box__id">
            <input
              className="input-box__id-input"
              placeholder="아이디를 입력해주세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-box__pw">
            <input
              type="password"
              className="input-box__pw-input"
              placeholder="비밀번호를 입력해주세요."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <p className="login__error">{error}</p>}
          <button type="submit" className="input-box__submit">
            로그인
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
