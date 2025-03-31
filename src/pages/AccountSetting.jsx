// components/AccountSetting.jsx
import "../styles/AccountSetting.scss";
import { useState, useRef, useContext } from "react";
import axios from "axios";

import { useUserDetail } from "../hooks/useUserDetail";
// 이미지
import demoUser from "../assets/images/account/demo-user1.png";
import editIcon1 from "../assets/images/icon/picture1.svg";
import editIcon2 from "../assets/images/icon/picture2.svg";
import { AuthContext } from "../contexts/AuthContext";
const AccountSetting = () => {
  const { data: userData, refetch } = useUserDetail();
  const { token } = useContext(AuthContext);
  const serverApi = process.env.REACT_APP_SERVER_API;
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const [profileImg, setProfileImg] = useState(userData?.profile || demoUser);
  const [selectedFile, setSelectedFile] = useState(null);
  const [bgImg, setBgImg] = useState("");
  const [userName, setUserName] = useState(userData?.name);
  const [nation, setNation] = useState("");
  const [email, setEmail] = useState(userData?.email);
  const [intro, setIntro] = useState(userData?.introduce);
  const [heldTokens, setHeldTokens] = useState("");
  const [joinDate, setJoinDate] = useState("");
  const [level, setLevel] = useState("");
  const [exp, setExp] = useState("");
  const [dob, setDob] = useState("");
  const [socials, setSocials] = useState([]);

  const [isError, setIsError] = useState(false);
  const [errorMessages, setErrorMessages] = useState({
    userName: [],
    email: [],
    intro: [],
    socials: [],
  });

  // 파일 input 참조 (프로필 이미지 변경용)
  const fileInputRef = useRef(null);

  // 유효성 검사 함수
  const validate = () => {
    let errors = {
      userName: [],
      nation: [],
      email: [],
      intro: [],
      socials: [],
    };

    if (userName === "error") {
      errors.userName.push(
        "This username is already taken. Please try another"
      );
    }
    if (email === "error") {
      errors.email.push("This email is already registered. Please try another");
    }
    if (intro === "error") {
      errors.intro.push("Your bio must be 150 characters or less.");
      errors.intro.push(
        "Invalid password. Please include uppercase, lowercase, and special characters."
      );
    }
    if (socials.includes("error")) {
      errors.socials.push("This username is already taken. Please try another");
    }

    setErrorMessages(errors);
    setIsError(Object.values(errors).some((err) => err.length > 0));
  };

  // 프로필 이미지 선택 시 실행되는 함수
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 형식, 크기 등의 유효성 검사를 추가할 수 있습니다.
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // 유저 정보 및 프로필 사진 변경 함수
  const changeUserInfo = async () => {
    try {
      const formData = new FormData();
      const payload = {
        name: userName,
        email: email,
        introduce: intro,
        wallet_address: userData?.wallet_address,
      };

      formData.append("payload", JSON.stringify(payload));

      if (selectedFile) {
        formData.append("file", selectedFile);
      } else {
        formData.append("file", "");
      }

      console.log("보내는 데이터:", [...formData.entries()]);

      const res = await axios.post(`${serverApi}/api/user/`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("res:", res);
      refetch();
      scrollToTop();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="account-setting">
      <h1 className="account-setting--title">AccountSetting</h1>

      <section className="account-setting__info">
        <div className="account-setting__info-box">
          <p className="info-box__title">Profile Information</p>
          <div className="info-box__picture-box">
            <p className="picture-box__title">Artist Profile</p>
            <div className="picture-box__edit-box">
              <img src={profileImg} alt="profile-img" />
              <button
                className="picture-box__edit-btn"
                onClick={() => fileInputRef.current.click()}
              >
                <img src={editIcon1} alt="edit" />
              </button>
            </div>
            <span className="picture-box__desc">40px X 40px, 3MB or less</span>
          </div>
        </div>
        <div className="account-setting__background-box">
          <p className="background-box__title">Background Image</p>
          <div className="background-box__edit-box">
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
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
              <button className="user-info__edit-btn" onClick={validate}>
                Change(1 MOB)
              </button>
            </div>
            {errorMessages.userName.map((err, idx) => (
              <span key={idx} className="user-info__error">
                {err}
              </span>
            ))}
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
          </div>
          <div className="user-info__item">
            <p className="user-info__title">Email</p>
            <div className="user-info__input-box">
              <input
                type="text"
                className="user-info__input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="user-info__edit-btn">Change</button>
            </div>
            {errorMessages.email.map((err, idx) => (
              <span key={idx} className="user-info__error">
                {err}
              </span>
            ))}
          </div>
          <div className="user-info__item">
            <p className="user-info__title">Introduction </p>
            <div className="user-info__desc-box">
              <span className="user-info__desc">
                Write your Introduction in 150 characters or less.
              </span>
              <span className="user-info__count">
                Characters: {intro ? intro.length : 0}/150
              </span>
            </div>
            <div className="user-info__input-box">
              <input
                type="text"
                className="user-info__input"
                placeholder="Introduction"
                value={intro}
                onChange={(e) => setIntro(e.target.value)}
                maxLength={150}
              />
              <button className="user-info__edit-btn">Change</button>
            </div>
            {errorMessages.intro.map((err, idx) => (
              <span key={idx} className="user-info__error">
                {err}
              </span>
            ))}
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
              value="0 MOB"
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
              value="Level 1"
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
              value="0 EXP"
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
              value={userData?.wallet_address}
            />
          </div>
        </div>
      </section>
      <section className="account-setting__submit">
        <button className="submit-btn" onClick={changeUserInfo}>
          Update User Info
        </button>
      </section>
      {/* Hidden file input for profile image change */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handleImageSelect}
      />
      {/* <section className="account-setting__social">
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
          {errorMessages.socials.map((err, idx) => (
            <span key={idx} className="social__error">
              {err}
            </span>
          ))}
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
          {errorMessages.socials.map((err, idx) => (
            <span key={idx} className="social__error">
              {err}
            </span>
          ))}
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
          {errorMessages.socials.map((err, idx) => (
            <span key={idx} className="social__error">
              {err}
            </span>
          ))}
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
          {errorMessages.socials.map((err, idx) => (
            <span key={idx} className="social__error">
              {err}
            </span>
          ))}
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
          {errorMessages.socials.map((err, idx) => (
            <span key={idx} className="social__error">
              {err}
            </span>
          ))}
        </div>
      </section> */}
    </div>
  );
};

export default AccountSetting;
