import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
    Navigation,
    Pagination,
    Autoplay,
} from "swiper/modules";
import coverImg from "../../assets/images/intro/intro-demo-img.png";
import coverImg2 from "../../assets/images/intro/intro-demo-img2.png";
import coverImg3 from "../../assets/images/intro/intro-demo-img3.png";
import coverImg4 from "../../assets/images/demo/album01.svg";
import coverImg5 from "../../assets/images/demo/album02.svg";
import coverImg6 from "../../assets/images/demo/album03.svg";
import coverImg7 from "../../assets/images/demo/album04.svg";
import coverImg8 from "../../assets/images/demo/album05.svg";
import coverImg9 from "../../assets/images/demo/album06.svg";
import './NftSlider.scss';

export const NftSlider = () => {
    const swiperOptions = {
        loop: true,
        slidesPerView: 5,
        spaceBetween: 16,
        initialSlide: 2,
        grabCursor: true,
        centeredSlides: true,
        pagination: {
            clickable: true,
        },
        navigation: true,
        modules: [Pagination, Navigation, Autoplay],
        breakpoints: {
            0: {
                slidesPerView: 1,
            },
            500: {
                slidesPerView: 3,
            },
            769: {
                slidesPerView: 5,
            },
        },
    };

    const tracks = [
        {
            id: 1,
            title: "POP",
            cover: coverImg,
            duration: null,
        },
        {
            id: 2,
            title: "CLASSICAL",
            cover: coverImg2,
            duration: null,
        },
        {
            id: 3,
            title: "GENRE",
            cover: coverImg3,
            duration: null,
        },
        {
            id: 4,
            title: "JAZZ",
            cover: coverImg4,
            duration: null,
        },
        {
            id: 5,
            title: "ROCK",
            cover: coverImg5,
            duration: null,
        },
        {
            id: 6,
            title: "DANCE",
            cover: coverImg6,
            duration: null,
        },
        {
            id: 7,
            title: "VOCAL",
            cover: coverImg7,
            duration: null,
        },
        {
            id: 8,
            title: "K-POP",
            cover: coverImg8,
            duration: null,
        },
        {
            id: 9,
            title: "Z-POP",
            cover: coverImg9,
            duration: null,
        }
    ];

    return (
        <div className="nft-slider__swiper">
            <Swiper {...swiperOptions} className="nft-slider">
                {tracks.map((track, index) => (
                    <SwiperSlide key={track.id}>
                        <button className="nft-slider__item">
                            <p className="nft-slider__item__title">{track.title}</p>
                            <img src={track.cover} alt="user" />
                        </button>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}; 