import "./AccountSetting.scss";
// 이미지
import demoUser from "../assets/images/account/demo-user1.png";
import editIcon1 from "../assets/images/icon/picture1.svg";
import editIcon2 from "../assets/images/icon/picture2.svg";

const AccountSetting = () => {
  return (
    <div className="account-setting">
      <h1 className="account-setting--title">AccountSetting</h1>

      <section className="account-setting__info">
        <div className="account-setting__info-box">
          <p className="info-box__title">Profile Information</p>
          <div className="info-box__picture-box">
            <p className="picture-box__title">Artist Profile</p>
            <div className="picture-box__edit-box">
              <img src={demoUser} alt="profile-img" />
              <button className="picture-box__edit-btn">
                <img src={editIcon1} alt="edit" />
              </button>
            </div>
            <span className="picture-box__desc">40px X 40px, 3MB or less</span>
          </div>
        </div>
        <div className="account-setting__background-box">
          <p className="background-box__title">Background Image</p>
          <div className="background-box__edit-box">
            {/* <img src={demoBg} alt="profile-bg" /> */}
            <button className="background-box__edit-btn">
              <img src={editIcon2} alt="edit" /> <span>Update</span>
            </button>
          </div>
          <span className="background-box__desc">
            1920px X 400px, 30MB or less
          </span>
        </div>
        <div className="account-setting__user-info">
          <div className="user-info__item">
            <p className="user-info__title">Artist Name</p>
            <span className="user-info__desc">
              First change is free, subsequent changes cost 1 MOB each.
            </span>
            <div className="user-info__input-box">
              <input
                type="text"
                className="user-info__input"
                placeholder="User Name"
              />
              <button className="user-info__edit-btn">Change(1 MOB)</button>
            </div>
            <span className="user-info__error">
              This username is already taken. Please try another
            </span>
          </div>
          <div className="user-info__item">
            <p className="user-info__title">Nation</p>

            <div className="user-info__input-box">
              <input
                type="text"
                className="user-info__input"
                placeholder="Please Select Your Nation"
              />
              <button className="user-info__edit-btn">Change</button>
            </div>
            <span className="user-info__error">
              This username is already taken. Please try another
            </span>
          </div>
          <div className="user-info__item">
            <p className="user-info__title">Email</p>

            <div className="user-info__input-box">
              <input
                type="text"
                className="user-info__input"
                placeholder="Email"
              />
              <button className="user-info__edit-btn">Change</button>
            </div>
            <span className="user-info__error">
              This email is already registered. Please try another.
            </span>
          </div>
          <div className="user-info__item">
            <p className="user-info__title">Introduction </p>
            <div className="user-info__desc-box">
              <span className="user-info__desc">
                First change is free, subsequent changes cost 1 MOB each.
              </span>
              <span className="user-info__count">Characters: 120/150</span>
            </div>
            <div className="user-info__input-box">
              <input
                type="text"
                className="user-info__input"
                placeholder="Introduction"
              />
              <button className="user-info__edit-btn">Change</button>
            </div>
            <span className="user-info__error">
              Your bio must be 150 characters or less. Please shorten your text.
              <br />
              Invalid password. Please include uppercase, lowercase, and special
              characters.
            </span>
          </div>
        </div>
      </section>

      <section className="account-setting__details">
        <div className="details__header">
          <p className="details__title">Account Details</p>
        </div>

        <div className="details__item">
          <p className="details__item-title">Held Tokens (MOB)</p>
          <div className="details__input-box">
            <input
              type="text"
              className="details__input"
              placeholder="0"
              value="1,395 MOB"
            />
          </div>
        </div>
        <div className="details__item">
          <p className="details__item-title">Join Date</p>
          <div className="details__input-box">
            <input
              type="text"
              className="details__input"
              placeholder="0"
              value="Sat, 04 Nov 2023 14:40:00 UTC+0"
            />
          </div>
        </div>
        <div className="details__item">
          <p className="details__item-title">Level</p>
          <div className="details__input-box">
            <input
              type="text"
              className="details__input"
              placeholder="0"
              value="Level 10"
            />
          </div>
        </div>
        <div className="details__item">
          <p className="details__item-title">EXP</p>
          <div className="details__input-box">
            <input
              type="text"
              className="details__input"
              placeholder="0"
              value="52,104 EXP"
            />
          </div>
        </div>
        <div className="details__item">
          <p className="details__item-title">Date of Birth</p>
          <div className="details__input-box">
            <input
              type="text"
              className="details__input"
              placeholder="0"
              value="2020-01-01"
            />
          </div>
        </div>
        <div className="details__item">
          <p className="details__item-title">Wallet Address</p>
          <div className="details__input-box">
            <input
              type="text"
              className="details__input"
              placeholder="0"
              value="0xfDafD6440Be59051F6e9b0924FD1fec3256dfDd0"
            />
          </div>
        </div>
      </section>

      <section className="account-setting__social">
        <div className="social__header">
          <p className="social__title">Link Your Social Profiles</p>
        </div>
        <div className="social__item">
          <p className="social__item-title">Instagram</p>
          <div className="social__input-box">
            <input
              type="text"
              className="social__input"
              placeholder="Please enter the URL"
            />
            <button className="social__edit-btn">Change</button>
          </div>
          <span className="social__error">
            This username is already taken. Please try another
          </span>
        </div>
        <div className="social__item">
          <p className="social__item-title">Instagram</p>
          <div className="social__input-box">
            <input
              type="text"
              className="social__input"
              placeholder="Please enter the URL"
            />
            <button className="social__edit-btn">Change</button>
          </div>
          <span className="social__error">
            This username is already taken. Please try another
          </span>
        </div>
        <div className="social__item">
          <p className="social__item-title">Instagram</p>
          <div className="social__input-box">
            <input
              type="text"
              className="social__input"
              placeholder="Please enter the URL"
            />
            <button className="social__edit-btn">Change</button>
          </div>
          <span className="social__error">
            This username is already taken. Please try another
          </span>
        </div>
        <div className="social__item">
          <p className="social__item-title">Instagram</p>
          <div className="social__input-box">
            <input
              type="text"
              className="social__input"
              placeholder="Please enter the URL"
            />
            <button className="social__edit-btn">Change</button>
          </div>
          <span className="social__error">
            This username is already taken. Please try another
          </span>
        </div>
        <div className="social__item">
          <p className="social__item-title">Instagram</p>
          <div className="social__input-box">
            <input
              type="text"
              className="social__input"
              placeholder="Please enter the URL"
            />
            <button className="social__edit-btn">Change</button>
          </div>
          <span className="social__error">
            This username is already taken. Please try another
          </span>
        </div>
      </section>
    </div>
  );
};
export default AccountSetting;
