import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ModalWrap from "../../ModalWrap";
import "./AlbumsDetailsModal.scss";

import { deleteAlbumsList } from "../../../api/AlbumsListApi";

const AlbumsDetailsModal = ({
  setShowDetailModal,
  album,
  token,
  onAlbumCreated,
  onEditClick,
  isFromAlbumDetail: isFromAlbumDetailProp,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [isFromAlbumDetail, setIsFromAlbumDetail] = useState(
    isFromAlbumDetailProp || false
  );

  // 컴포넌트 마운트 시 현재 경로를 확인
  useEffect(() => {
    // 콘솔에 현재 경로 출력 (디버깅용)
    console.log("현재 경로:", location.pathname);
    // prop으로 전달받은 값이 있으면 우선 사용, 없으면 경로로 판단
    setIsFromAlbumDetail(
      isFromAlbumDetailProp || location.pathname.includes("/album/")
    );
    console.log(
      "isFromAlbumDetail 설정됨:",
      isFromAlbumDetailProp || location.pathname.includes("/album/")
    );
  }, [location, isFromAlbumDetailProp]);

  const handleDeleteAlbum = async () => {
    try {
      await deleteAlbumsList(album?.id, token);
      // 삭제 성공
      setDeleteSuccess(true);
      console.log("앨범 삭제 성공, isFromAlbumDetail:", isFromAlbumDetail);
    } catch (error) {
      console.error("앨범 삭제 실패:", error);
    }
  };

  const handleOkClick = () => {
    console.log("OK 버튼 클릭, isFromAlbumDetail:", isFromAlbumDetail);

    if (isFromAlbumDetail) {
      // AlbumDetail에서 호출된 경우 Albums 페이지로 이동
      console.log("페이지 이동 시도", isFromAlbumDetail);
      navigate("/my-page/music?category=Albums&page=1");
    } else {
      // Albums에서 호출된 경우 목록 새로고침
      if (onAlbumCreated) onAlbumCreated();
    }
    setShowDetailModal(false);
  };

  // 초기 상태: 앨범 상세 정보 표시
  if (!deleteConfirm && !deleteSuccess) {
    return (
      <ModalWrap onClose={setShowDetailModal} title="Album Details">
        <div className="albums-details-modal">
          <div className="albums-details-modal__info">
            <p className="albums-details-modal__info__title">
              [{album?.album_name}]
            </p>
            <p className="albums-details-modal__info__artist">{album?.name}</p>
            <p className="albums-details-modal__info__songs">
              {album?.song_cnt} Songs
            </p>
          </div>
          <div className="albums-details-modal__button-box">
            <div className="albums-details-modal__button-box__edit">
              <button
                className="albums-details-modal__button__edit"
                onClick={onEditClick}
              >
                Edit Details
              </button>
              <button
                className="albums-details-modal__button__edit-songs"
                onClick={() => {}}
              >
                Edit Songs
              </button>
            </div>
            <button
              className="albums-details-modal__button__delete"
              onClick={() => setDeleteConfirm(true)}
            >
              Delete Album
            </button>
          </div>
        </div>
      </ModalWrap>
    );
  }

  // 삭제 확인 상태
  if (deleteConfirm && !deleteSuccess) {
    return (
      <ModalWrap onClose={setShowDetailModal} title="Delete Album">
        <div className="albums-details-modal">
          <div className="albums-details-modal__delete-confirm">
            <p className="albums-details-modal__delete-confirm__text">
              This action cannot be undone.
            </p>
            <p className="albums-details-modal__delete-confirm__text">
              All tracks in this album will also be permanently deleted.
            </p>
            <p className="albums-details-modal__delete-confirm__question">
              Are you sure you want to delete <br />
              <span className="albums-details-modal__delete-confirm__album-name">
                "{album?.album_name}"
              </span>
              ?
            </p>
          </div>
          <div className="albums-details-modal__button-box">
            <button
              className="albums-details-modal__button__cancel"
              onClick={() => setDeleteConfirm(false)}
            >
              Cancel
            </button>
            <button
              className="albums-details-modal__button__delete-confirm"
              onClick={handleDeleteAlbum}
            >
              Delete Album
            </button>
          </div>
        </div>
      </ModalWrap>
    );
  }

  // 삭제 완료 상태
  if (deleteSuccess) {
    return (
      <ModalWrap onClose={setShowDetailModal} title="">
        <div className="albums-details-modal">
          <div className="albums-details-modal__success">
            <p className="albums-details-modal__success__text">
              Album deleted successfully.
            </p>
          </div>
          <div className="albums-details-modal__button-box">
            <button
              className="albums-details-modal__button__ok"
              onClick={handleOkClick}
            >
              Ok
            </button>
          </div>
        </div>
      </ModalWrap>
    );
  }
};

export default AlbumsDetailsModal;
