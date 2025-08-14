
import logoImg from "../assets/images/logo/logo-affiliate-01.svg";

function BizLogin() {
  return (
    <div className='login'>
        <div className="login__box">
            <h1 className='login__logo'>
                <img src={logoImg} alt="Music On the Block Business Logo" />
                <span>Welcome to our affiliate service</span>
            </h1>
        </div>
    </div>
  )
}

export default BizLogin