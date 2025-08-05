import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import { ThirdwebProvider } from 'thirdweb/react';

// ✅ 자동재생 방지: 새로고침 시 무조건 false로 초기화
sessionStorage.setItem('preventAutoPlay', 'false');

const root = ReactDOM.createRoot(document.getElementById('root'));

if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  // console.error = () => {};
}

root.render(
  <React.StrictMode>
    <ThirdwebProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThirdwebProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
