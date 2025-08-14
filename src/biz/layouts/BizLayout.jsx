import { useLocation } from "react-router-dom";
import logoImg from "../assets/images/logo/logo-affiliate-02.svg";
import '../styles/biz.scss';

function BizLayout({ children }) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/biz/login";

  return (
    <div className="biz">
        {/* 로그인 페이지일 때 header 미 노출 */}
        {!isLoginPage && (
        <header className="biz-header">
            <div className="biz-header__inner">
                <h1 className="biz-header__inner__logo">
                    <img
                    // onClick={handleLogoClick}
                    src={logoImg}
                    alt="Music On The Block Business Logo"
                    />
                </h1>
                <div className="biz-header__actions">
                    <button className="biz-header__sign-out">
                        Sign Out
                    </button>
                </div>
            </div>
        </header>
        )}
        {children}
    </div>
  );
}

export default BizLayout;
