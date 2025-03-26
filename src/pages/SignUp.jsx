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


//   const [text, setText] = useState(""); // 입력된 텍스트 상태
//   const maxLength = 150; // 최대 글자 수

//   const handleChange = (e) => {
//     if (e.target.value.length <= maxLength) {
//       setText(e.target.value);
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
//                 Introduction <strong>Characters: {text.length}/{maxLength}</strong>
//               </p>
//               <div className="input-box__cover">
//                 <textarea
//                   placeholder="Introduction"
//                   value={text}
//                   onChange={handleChange}
//                 />
//               </div>
//               {/* <p className="err-txt">
//                 Your bio must be 150 characters or less. Please shorten your text.
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




import "../styles/SignUp.scss";
import React, { useState, useEffect } from 'react';
import profileImg from '../assets/images/progile-img.svg';
import popImg from '../assets/images/sing-up/POP-img.png';
import randbImg from '../assets/images/sing-up/R&B-img.png';
import rockImg from '../assets/images/sing-up/Rock-img.png';
import edmImg from '../assets/images/sing-up/EDM-img.png';
import balladImg from '../assets/images/sing-up/BALLAD-img.png';
import jazzImg from '../assets/images/sing-up/JAZZ-img.png';
import CustomDatePicker from "../components/CustomDatePicker";
import CreateCompleteModal from "../components/CreateCompleteModal";
import SingUpCompleteModal from "../components/SingUpCompleteModal";


const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const AIDetailedSettings = ({ onNext }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [date1, setDate1] = useState(null);
  const [text, setText] = useState("");
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
          title: 'Terms of Service ',
      },
      {
          title: 'Privacy Policy',
          desc: '(essential)',
      },
      {
          title: 'Refund Policy',
          desc: '(essential)',
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
      setText(e.target.value);
    }
  };

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
          <p className="input-box__title">Artist Name<span>*</span></p>
          <div className="input-box__cover">
            <input placeholder="Please enter your Artist Name here."/>
            <button className="btn">check</button>
          </div>
          <p className="err-txt">This username is already taken. Please try another.</p>
        </div>
        <div className="input-box">
          <p className="input-box__title two-content">
            Introduction <strong>Characters: {text.length}/{maxLength}</strong>
          </p>
          <div className="input-box__cover">
            <textarea
              placeholder="Introduction"
              value={text}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="input-box">
          <p className="input-box__title">Email<span>*</span></p>
          <div className="input-box__cover">
            <input placeholder="Enter the email"/>
          </div>
          <p className="err-txt">This email is already registered. Please try another.</p>
        </div>
        <div className="input-box">
          <p className="input-box__title">Wallet Address<span>*</span></p>
          <div className="input-box__cover">
            <input />
          </div>
          <p className="err-txt">This Wallet is already registered. Please try another.</p>
        </div>
        {/* <div className="input-box">
          <p className="input-box__title">Date of Birth<span>*</span></p>
          <div className="input-box__cover">
            <CustomDatePicker defaultDate={date1} onDateChange={setDate1} />
          </div>
          <p className="err-txt">Invalid date format. Please select a valid date.</p>
        </div> */}

        {/* <div className="input-box">
          <p className="input-box__title">Recommended User</p>
          <div className="input-box__cover">
            <input placeholder="User Name"/>
            <button className="btn">Add</button>
          </div>
          <p className="err-txt">This username is already taken. Please try another.</p>
        </div> */}

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
        <button className="sing-up__page-btn__next" onClick={() => { scrollToTop(); onNext(); }}>Next</button>
      </div>
    </div>
  );
};

const PreferredGenre = ({ onBack, onNext }) => {
  const [selectedGenre, setSelectedGenre] = useState(null); // 선택된 장르 상태

  // 장르별 이미지 매핑
  const genreImages = {
    "POP": popImg,
    "R&B": randbImg,
    "ROCK": rockImg,
    "EDM": edmImg,
    "BALLAD": balladImg,
    "JAZZ": jazzImg
  };
  
  const handleGenreClick = (genre) => {
    setSelectedGenre(genre); // 선택한 장르 업데이트
  };
  return (
    <div className="sing-up__setting">
      <dl className="sing-up__setting__banner">
        <dt>Preferred Genre</dt>
        <dd>
          We collect users’ music tastes to strengthen the personalized recommendation function. After signing up, we provide customized recommended songs & AI services.
        </dd>
      </dl>
      <div className="sing-up__setting__genre">
        {Object.keys(genreImages).map((genre) => (
          <button
            className={`sing-up__setting__genre__item ${selectedGenre === genre ? "active" : ""}`}
            key={genre}
            onClick={() => handleGenreClick(genre)}
          >
            <p className="sing-up__setting__genre__item__title">{genre}</p>
            <img src={genreImages[genre]} alt={genre} />
          </button>
        ))}
      </div>
      <div className="sing-up__page-btn">
        <button className="sing-up__page-btn__prev" onClick={() => { scrollToTop(); onBack(); }}>Back</button>
        <button className="sing-up__page-btn__next" onClick={() => { scrollToTop(); onNext(); }}>Completed</button>
      </div>
    </div>
  );
};

function SignUp() {
  const [step, setStep] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [singUpCompleteModal, setSingUpCompleteModal] = useState(false);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="sing-up">
      <p className="sing-up__title">Sign Up</p>
      {step === 1 ? (
        <AIDetailedSettings onNext={handleNext} />
      ) : (
        <PreferredGenre onBack={() => setStep(1)} onNext={handleNext} />
      )}
      {showModal && (
        <SingUpCompleteModal setSingUpCompleteModal={setSingUpCompleteModal}/>
      )}
    </div>
  );
}

export default SignUp;
