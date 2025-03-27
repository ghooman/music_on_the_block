// import "../styles/SingUp.scss";
// import React, { useState, useEffect, useRef } from 'react';
// import {
//   BrowserRouter,
//   Link,
//   Route,
//   Router,
//   Routes,
//   useLocation,
//   // useNavigate,
// } from 'react-router-dom';
// import MyAudioPlayer from '../components/MyAudioPlayer';
// import profileImg from '../assets/images/progile-img.svg';
// import popImg from '../assets/images/sing-up/POP-img.png';

// import track3 from "../assets/music/MusicOnTheBlock_v1.mp3";

// //스와이프
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { FreeMode, Navigation, Thumbs, Pagination, Autoplay } from 'swiper/modules';
// import DatePicker from "react-datepicker";
// import 'react-datepicker/dist/react-datepicker.css';
// import CustomDatePicker from "../components/CustomDatePicker";
// // import { en } from 'date-fns/locale';
// function SingUp() {

//   const [selectedImage, setSelectedImage] = useState(null);
//   const [date1, setDate1] = useState(null);

//   const handleImageUpload = (event) => {
//     const file = event.target.files[0];
//     if (file && file.size <= 3 * 1024 * 1024) { // 3MB 제한
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         setSelectedImage(e.target.result);
//       };
//       reader.readAsDataURL(file);
//     } else {
//       alert("파일 크기가 3MB를 초과했습니다.");
//     }
//   };

//   const [introduction, setIntroduction] = useState(""); // 입력된 텍스트 상태
//   const maxLength = 150; // 최대 글자 수

//   const handleChange = (e) => {
//     if (e.target.value.length <= maxLength) {
//       setIntroduction(e.target.value);
//     }
//   };

//   return (
//     <>
//       <div className="sing-up">
//         <p className="sing-up__title">Sing Up</p>
//         <div className="sing-up__setting">
//           <p className="sing-up__setting__title">AI detailed settings</p>
//           <div className="sing-up__setting__box">
//             {/* <div className="sing-up__setting__box__profile">
//               <p className="sing-up__setting__box__title">Artist Profile</p>
//               <p className="sing-up__setting__box__profile__txt">40px X 40px, 3MB or less</p>
//             </div> */}
//             <div className="sing-up__setting__box__profile">
//               <p className="sing-up__setting__box__title">Artist Profile</p>
//               <div className="profile-image-container">
//                 <label htmlFor="profile-upload" className="profile-upload-label">
//                   <img
//                     src={selectedImage || profileImg}
//                     alt="Profile"
//                     className="profile-image"
//                   />
//                   <input
//                     type="file"
//                     id="profile-upload"
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="profile-input"
//                   />
//                 </label>
//               </div>
//               <p className="sing-up__setting__box__profile__txt">40px X 40px, 3MB or less</p>
//             </div>

//             <div className="input-box">
//               <p className="input-box__title">Artist Name<span>*</span></p>
//               <div className="input-box__cover">
//                 <input placeholder="Please enter your Artist Name here."/>
//                 <button className="btn">check</button>
//               </div>
//               <p className="err-txt">
//                 This username is already taken. Please try another.
//               </p>
//             </div>

//             <div className="input-box">
//               <p className="input-box__title two-content">
//                 Introduction <strong>Characters: {introduction.length}/{maxLength}</strong>
//               </p>
//               <div className="input-box__cover">
//                 <textarea
//                   placeholder="Introduction"
//                   value={introduction}
//                   onChange={handleChange}
//                 />
//               </div>
//               {/* <p className="err-txt">
//                 Your bio must be 150 characters or less. Please shorten your introduction.
//               </p> */}
//             </div>

//             <div className="input-box">
//               <p className="input-box__title">Date of Birth<span>*</span></p>
//               <div className="input-box__cover">
//                 <CustomDatePicker defaultDate={date1} onDateChange={setDate1} />
//               </div>
//               <p className="err-txt">
//                 This username is already taken. Please try another.
//               </p>
//             </div>

//             <div className="input-box">
//               <p className="input-box__title">Email</p>
//               <div className="input-box__cover">
//                 <input placeholder="Enter the email"/>
//               </div>
//               <p className="err-txt">
//                 This email is already registered. Please try another.
//               </p>
//             </div>

//             <div className="input-box">
//               <p className="input-box__title">Recommended User</p>
//               <div className="input-box__cover">
//                 <input placeholder="User Name"/>
//                 <button className="btn">Add</button>
//               </div>
//               <p className="err-txt">
//                 This username is already taken. Please try another
//               </p>
//             </div>

//           </div>
//         </div>

//         <div className="sing-up__setting">
//           <dl className="sing-up__setting__banner">
//             <dt>Preferred Genre</dt>
//             <dd>
//               We collect users’ music tastes to strengthen the personalized recommendation function. After signing up, we provide customized recommended songs & AI services.
//             </dd>
//           </dl>
//           <div className="sing-up__setting__genre">
//             <button className="sing-up__setting__genre__item">
//               <p className="sing-up__setting__genre__item__title">
//                 POP
//               </p>
//               <img src={popImg}/>
//             </button>
//             <button className="sing-up__setting__genre__item">
//               <p className="sing-up__setting__genre__item__title">
//                 R&B
//               </p>
//               <img src={popImg}/>
//             </button>
//             <button className="sing-up__setting__genre__item">
//               <p className="sing-up__setting__genre__item__title">
//                 ROCK
//               </p>
//               <img src={popImg}/>
//             </button>
//             <button className="sing-up__setting__genre__item">
//               <p className="sing-up__setting__genre__item__title">
//                 EDM
//               </p>
//               <img src={popImg}/>
//             </button>
//             <button className="sing-up__setting__genre__item">
//               <p className="sing-up__setting__genre__item__title">
//                 BALLAD
//               </p>
//               <img src={popImg}/>
//             </button>
//             <button className="sing-up__setting__genre__item">
//               <p className="sing-up__setting__genre__item__title">
//                 JAZZ
//               </p>
//               <img src={popImg}/>
//             </button>
//           </div>
//         </div>

//         <div className="sing-up__page-btn">
//           <button className="sing-up__page-btn__prev">
//             Back
//           </button>
//           <button className="sing-up__page-btn__next">
//             Next
//           </button>
//         </div>
//       </div>
//     </>
//   );
// }

// export default SingUp;

// pages/SignUp.js
import "../styles/SignUp.scss";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import profileImg from "../assets/images/progile-img.svg";
import popImg from "../assets/images/sing-up/POP-img.png";
import randbImg from "../assets/images/sing-up/R&B-img.png";
import rockImg from "../assets/images/sing-up/Rock-img.png";
import edmImg from "../assets/images/sing-up/EDM-img.png";
import balladImg from "../assets/images/sing-up/BALLAD-img.png";
import jazzImg from "../assets/images/sing-up/JAZZ-img.png";
import SingUpCompleteModal from "../components/SingUpCompleteModal";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const AIDetailedSettings = ({ onNext, formData, setFormData }) => {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { walletAddress, token } = useContext(AuthContext);
  const [selectedImage, setSelectedImage] = useState(null);
  const [artistName, setArtistName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [email, setEmail] = useState("");
  const [passName, setPassName] = useState(false);
  const [passEmail, setPassEmail] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const maxLength = 150;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 3 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert("파일 크기가 3MB를 초과했습니다.");
    }
  };

  const [checks, setChecks] = useState([false, false, false, false]);
  const [checkList, setCheckList] = useState();

  const chekkkk = [
    {
      title: "Terms of Service ",
    },
    {
      title: "Privacy Policy",
      desc: "(essential)",
    },
    {
      title: "Refund Policy",
      desc: "(essential)",
    },
  ];

  const allChecked = checks.every(Boolean);

  // 전체 체크박스 클릭 이벤트
  const handleAllCheck = () => {
    setChecks((prev) => prev.map(() => !allChecked));
  };

  useEffect(() => {
    setCheckList(checks.every((item) => item));
  }, [checks, setCheckList]);

  const handleChange = (e) => {
    if (e.target.value.length <= maxLength) {
      setIntroduction(e.target.value);
    }
  };

  // 닉네임 중복체크 전 양식 검사 (특수문자 미허용, 최대 10글자)
  const handleCheckName = async () => {
    setNameErrorMessage("");
    setPassName(false);
    // 이름 포맷 검사: 영문, 숫자, 한글, 공백만 허용하며 1~10글자
    const nameRegex = /^[a-zA-Z0-9가-힣\s]{1,10}$/;
    if (!nameRegex.test(artistName)) {
      setNameErrorMessage(
        "이름은 특수문자를 사용할 수 없으며 최대 10글자까지 입력 가능합니다."
      );
      return;
    }
    // 중복체크 API 호출
    try {
      const response = await axios.get(
        `${serverApi}/api/user/name/check?name=${artistName}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setPassName(true);
    } catch (error) {
      console.error("닉네임 중복체크 에러:", error);
      setNameErrorMessage(
        "이미 사용 중인 이름입니다. 다른 이름을 입력해주세요."
      );
    }
  };

  // 이메일 형식 검사 함수
  const validateEmailFormat = (email) => {
    return /^[A-Za-z0-9_.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+$/.test(email);
  };

  // 이메일 입력 핸들러
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setEmailErrorMessage("");
    setPassEmail(false);
  };

  // 체크 버튼 클릭 핸들러 (이메일 양식 검사 후 중복체크)
  const handleCheckEmail = async () => {
    setEmailErrorMessage("");
    setPassEmail(false);
    // 이메일 형식 검사
    if (!validateEmailFormat(email)) {
      setEmailErrorMessage("이메일 형식이 올바르지 않습니다.");
      return;
    }
    // 중복체크 API 호출
    try {
      const response = await axios.get(
        `${serverApi}/api/user/email/check?email=${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response);
      setPassEmail(true);
    } catch (error) {
      console.error("이메일 중복체크 에러:", error);
      setEmailErrorMessage(
        "이미 등록된 이메일입니다. 다른 이메일을 입력해주세요."
      );
    }
  };

  // Next 버튼 활성화 조건: 이름, 이메일 중복체크 통과 및 모든 체크박스 선택
  const isNextEnabled = passName && passEmail && allChecked;

  return (
    <div className="sing-up__setting">
      <p className="sing-up__setting__title">AI detailed settings</p>
      <div className="sing-up__setting__box">
        <div className="sing-up__setting__box__profile">
          <p className="sing-up__setting__box__title">Artist Profile</p>
          <div className="profile-image-container">
            <label htmlFor="profile-upload" className="profile-upload-label">
              <img
                src={selectedImage || profileImg}
                alt="Profile"
                className="profile-image"
              />
              <input
                type="file"
                id="profile-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="profile-input"
              />
            </label>
          </div>
        </div>
        <div className="input-box">
          <p className="input-box__title">
            Artist Name <span>*</span>
          </p>
          <div className="input-box__cover">
            <input
              placeholder="Please enter your Artist Name here."
              value={formData.artistName}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  artistName: e.target.value,
                });
                setNameErrorMessage("");
                setPassName(false);
              }}
            />
            <button
              className="btn"
              onClick={async () => {
                // handleCheckName 함수 내에서 formData.artistName 사용
                setNameErrorMessage("");
                setPassName(false);
                const nameRegex = /^[a-zA-Z0-9가-힣\s]{1,10}$/;
                if (!nameRegex.test(formData.artistName)) {
                  setNameErrorMessage(
                    "이름은 특수문자를 사용할 수 없으며 최대 10글자까지 입력 가능합니다."
                  );
                  return;
                }
                try {
                  const response = await axios.get(
                    `${serverApi}/api/user/name/check?name=${formData.artistName}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  console.log(response);
                  setPassName(true);
                } catch (error) {
                  console.error("닉네임 중복체크 에러:", error);
                  setNameErrorMessage(
                    "이미 사용 중인 이름입니다. 다른 이름을 입력해주세요."
                  );
                }
              }}
            >
              check
            </button>
          </div>
          {passName && <p className="pass-txt">This username is available.</p>}
          {nameErrorMessage && <p className="err-txt">{nameErrorMessage}</p>}
        </div>
        <div className="input-box">
          <p className="input-box__title two-content">
            Introduction{" "}
            <strong>
              Characters: {formData.introduction.length}/{maxLength}
            </strong>
          </p>
          <div className="input-box__cover">
            <textarea
              placeholder="Introduction"
              value={formData.introduction}
              onChange={(e) => {
                if (e.target.value.length <= maxLength) {
                  setFormData({
                    ...formData,
                    introduction: e.target.value,
                  });
                }
              }}
            />
          </div>
        </div>
        <div className="input-box">
          <p className="input-box__title">
            Email <span>*</span>
          </p>
          <div className="input-box__cover">
            <input
              placeholder="Enter the email"
              value={formData.email}
              onChange={(e) => {
                setFormData({
                  ...formData,
                  email: e.target.value,
                });
                setEmailErrorMessage("");
                setPassEmail(false);
              }}
            />
            <button
              className="btn"
              onClick={async () => {
                setEmailErrorMessage("");
                setPassEmail(false);
                const validateEmailFormat = (email) => {
                  return /^[A-Za-z0-9_.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+$/.test(
                    email
                  );
                };
                if (!validateEmailFormat(formData.email)) {
                  setEmailErrorMessage("이메일 형식이 올바르지 않습니다.");
                  return;
                }
                try {
                  const response = await axios.get(
                    `${serverApi}/api/user/email/check?email=${formData.email}`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },
                    }
                  );
                  console.log(response);
                  setPassEmail(true);
                } catch (error) {
                  console.error("이메일 중복체크 에러:", error);
                  setEmailErrorMessage(
                    "이미 등록된 이메일입니다. 다른 이메일을 입력해주세요."
                  );
                }
              }}
            >
              check
            </button>
          </div>
          {passEmail && <p className="pass-txt">This email is available.</p>}
          {emailErrorMessage && <p className="err-txt">{emailErrorMessage}</p>}
        </div>
        <div className="input-box">
          <p className="input-box__title">
            Wallet Address <span>*</span>
          </p>
          <div className="input-box__cover">
            <input value={walletAddress?.address} readOnly />
          </div>
        </div>
      </div>

      <div className="check-list">
        <p className="check-list__title">Terms and Conditions</p>
        <label className="check-list__items all">
          <input
            checked={allChecked}
            onChange={handleAllCheck}
            type="checkbox"
          />
          <span className="check"></span>
          <div className="check-list__items__cover">
            <p className="check-list__items--title">All Agree</p>
          </div>
        </label>
        {chekkkk.map((item, index) => (
          <label className="check-list__items" key={`check-list-index${index}`}>
            <input
              checked={checks[index]}
              onChange={() =>
                setChecks((prev) => {
                  let copy = [...prev];
                  copy[index] = !copy[index];
                  return copy;
                })
              }
              type="checkbox"
            ></input>
            <span className="check"></span>
            <div className="check-list__items__cover">
              <p className="check-list__items--title">{item.title}</p>
              <span className="check-list__items--desc">{item.desc}</span>
            </div>
          </label>
        ))}
      </div>

      <div className="sing-up__page-btn">
        <button
          className={`sing-up__page-btn__next ${
            !(passName && passEmail && checks.every(Boolean)) ? "disabled" : ""
          }`}
          onClick={() => {
            if (!(passName && passEmail && checks.every(Boolean))) return;
            scrollToTop();
            onNext();
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const PreferredGenre = ({ onBack, onNext }) => {
  const [selectedGenre, setSelectedGenre] = useState(null); // 선택된 장르 상태

  // 장르별 이미지 매핑
  const genreImages = {
    POP: popImg,
    "R&B": randbImg,
    ROCK: rockImg,
    EDM: edmImg,
    BALLAD: balladImg,
    JAZZ: jazzImg,
  };

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre); // 선택한 장르 업데이트
  };
  return (
    <div className="sing-up__setting">
      <dl className="sing-up__setting__banner">
        <dt>Preferred Genre</dt>
        <dd>
          We collect users’ music tastes to strengthen the personalized
          recommendation function. After signing up, we provide customized
          recommended songs & AI services.
        </dd>
      </dl>
      <div className="sing-up__setting__genre">
        {Object.keys(genreImages).map((genre) => (
          <button
            className={`sing-up__setting__genre__item ${
              selectedGenre === genre ? "active" : ""
            }`}
            key={genre}
            onClick={() => handleGenreClick(genre)}
          >
            <p className="sing-up__setting__genre__item__title">{genre}</p>
            <img src={genreImages[genre]} alt={genre} />
          </button>
        ))}
      </div>
      <div className="sing-up__page-btn">
        <button
          className="sing-up__page-btn__prev"
          onClick={() => {
            scrollToTop();
            onBack();
          }}
        >
          Back
        </button>
        <button
          className="sing-up__page-btn__next"
          onClick={() => {
            scrollToTop();
            onNext();
          }}
        >
          Completed
        </button>
      </div>
    </div>
  );
};

function SignUp() {
  const { token, walletAddress, isRegistered } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    artistName: "",
    email: "",
    introduction: "",
  });
  const navigate = useNavigate();

  // 회원가입 완료된 사용자는 SignUp 페이지에 접근할 수 없도록 함
  useEffect(() => {
    if (!token || isRegistered) {
      navigate("/");
    }
  }, [token, isRegistered, navigate]);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      handleSignUp();
    }
  };

  const handleSignUp = async () => {
    const walletAddrString =
      walletAddress && walletAddress.address
        ? String(walletAddress.address)
        : "";
    console.log("walletAddrString:", walletAddrString);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("file", "");
      const payload = {
        name: formData.artistName,
        email: formData.email,
        introduce: formData.introduction,
        wallet_address: walletAddrString,
      };
      console.log("payload:", JSON.stringify(payload));
      formDataToSend.append("payload", JSON.stringify(payload));

      const response = await axios.post(
        `${process.env.REACT_APP_SERVER_API}/api/user/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("handleSignUp", response);
      console.log("보내는 데이터", formData, walletAddrString, token);
      setShowModal(true);
    } catch (error) {
      console.error("회원가입 에러:", error);
      console.log("보내는 데이터", formData, walletAddress?.address, token);
    }
  };

  return (
    <div className="sing-up">
      {step === 1 ? (
        <AIDetailedSettings
          formData={formData}
          setFormData={setFormData}
          onNext={handleNext}
        />
      ) : (
        <PreferredGenre
          formData={formData}
          setFormData={setFormData}
          onBack={() => setStep(1)}
          onNext={handleNext}
        />
      )}
      {showModal && (
        <SingUpCompleteModal setSingUpCompleteModal={setShowModal} />
      )}
    </div>
  );
}

export default SignUp;
