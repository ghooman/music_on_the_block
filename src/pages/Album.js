import "../styles/Album.scss";
import React, { useEffect, useRef, useState } from "react";

// 이미지
import coverImg from '../assets/images/intro/intro-demo-img2.png';



import { Link } from "react-router-dom";



function Album({ setClickMenu }) {

  const [activeTab, setActiveTab] = useState('Activation');

  return (
    <>
      <div className="album">
        <section className="album__content-list">
          <p className="album__content-list__title">Total</p>
          <article className="album__content-list__list">
            <div className="album__content-list__list__item">
              <div className="album__content-list__list__item__left">
                <p className="album__content-list__list__item__left__img"
                  style={{ backgroundImage: `url(${coverImg})` }}
                ><span>4:12</span>
                </p>
              </div>
              <div className="album__content-list__list__item__right">
                
              </div>
            </div>
          </article>
        </section>
        <div className="album__tab">

        </div>
      </div>
    </>
  );
}

export default Album;
