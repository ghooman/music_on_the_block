// pages/SignUp.js
import "../styles/SignUp.scss";
import React, { useState, useEffect, useContext } from "react";
import { useQueryClient } from "react-query"; //
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

const AIDetailedSettings = ({
  onNext,
  formData,
  setFormData,
  selectedImageFile,
  setSelectedImageFile,
}) => {
  const serverApi = process.env.REACT_APP_SERVER_API;
  const { walletAddress, token } = useContext(AuthContext);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);
  const [passName, setPassName] = useState(false);
  const [passEmail, setPassEmail] = useState(false);
  const [nameErrorMessage, setNameErrorMessage] = useState("");
  const [emailErrorMessage, setEmailErrorMessage] = useState("");

  const maxLength = 150;

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.size <= 3 * 1024 * 1024) {
      setSelectedImageFile(file); // 파일 객체를 상태에 저장합니다.
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImagePreview(e.target.result); // 미리보기용 data URL
      };
      reader.readAsDataURL(file);
    } else {
      alert("file size exceeds 3MB.");
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

  return (
    <div className="sing-up__setting">
      <p className="sing-up__setting__title">AI detailed settings</p>
      <div className="sing-up__setting__box">
        <div className="sing-up__setting__box__profile">
          <p className="sing-up__setting__box__title">Artist Profile</p>
          <div className="profile-image-container">
            <label htmlFor="profile-upload" className="profile-upload-label">
              <img
                src={selectedImagePreview || profileImg}
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
                setNameErrorMessage("");
                setPassName(false);
                const nameRegex = /^[a-zA-Z0-9가-힣\s]{1,10}$/;
                if (!nameRegex.test(formData.artistName)) {
                  setNameErrorMessage(
                    "Special characters are not allowed in the name, and it must be no more than 10 characters"
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
                  console.error("name error:", error);
                  setNameErrorMessage(
                    "This name is already in use. Please choose a different one."
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
                  setEmailErrorMessage("The email format is invalid.");
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
                  console.error("email error", error);
                  setEmailErrorMessage(
                    "This email is already registered. Please enter a different email address."
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
  const [selectedImageFile, setSelectedImageFile] = useState(null); // 이미지 파일 객체를 저장할 상태
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // queryClient 생성
  // 회원가입 완료된 사용자는 SignUp 페이지에 접근할 수 없도록 함
  useEffect(() => {
    if (!token) {
      console.log("토큰이 없습니다. 메인 페이지로 이동합니다.");
      navigate("/");
    } else if (isRegistered) {
      console.log(
        "이미 회원가입이 완료된 사용자입니다. 메인 페이지로 이동합니다."
      );
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
      if (selectedImageFile) {
        formDataToSend.append("file", selectedImageFile);
      }
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
      console.log("image", selectedImageFile);
      setShowModal(true);
      // 회원가입 성공 후, 사용자 정보 캐시를 갱신합니다.
      queryClient.invalidateQueries("userDetail");
    } catch (error) {
      console.log("image", selectedImageFile);
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
          selectedImageFile={selectedImageFile}
          setSelectedImageFile={setSelectedImageFile}
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
