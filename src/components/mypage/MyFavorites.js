import { useState, useEffect } from "react";

import "./MyFavorites.scss";
// 이미지
import viewAllBackground from "../../assets/images/mypage/view-all-button.png";
// 컴포넌트
import Filter from "../unit/Filter";
import AlbumsTable from "../unit/AlbumsTable";

const MyFavorites = () => {
  return (
    <div className="my-favorites">
      <div className="my-favorites__header">
        <h1 className="my-favorites__title">My Favorites</h1>
        <button className="my-favorites__view-all">
          <img src={viewAllBackground} alt="view all" />
        </button>
      </div>
      <input
        className="my-favorites__search"
        placeholder="Search by Artist name or song title..."
      />
      <div className="my-favorites__filter">
        <Filter list={["All", "Lyric", "Latest"]} />
      </div>
      <div className="my-favorites__table">
        <AlbumsTable />
      </div>
    </div>
  );
};

export default MyFavorites;
