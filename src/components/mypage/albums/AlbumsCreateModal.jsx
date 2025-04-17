import ModalWrap from "../../ModalWrap";
import { useState, useRef, useContext } from "react";
import "./AlbumsCreateModal.scss";
import { createAlbumsList } from "../../../api/AlbumsListApi";

import UploadButtonImage from "../../../assets/images/icon/picture1.svg";
import defaultAlbumsImage from "../../../assets/images/mypage/albums-upload-logo.png";
import { AuthContext } from "../../../contexts/AuthContext";

const AlbumsCreateModal = ({ setShowCreateModal, status }) => {
  const { token } = useContext(AuthContext);
  const [albumsImage, setAlbumsImage] = useState(null);
  const [albumsName, setAlbumsName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // 파일 크기 체크 (4MB)
      if (file.size > 4 * 1024 * 1024) {
        alert("이미지 크기는 4MB 이하여야 합니다.");
        return;
      }

      // 파일 형식 체크
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        alert("jpg 또는 png 형식의 이미지만 업로드 가능합니다.");
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        setAlbumsImage({
          file,
          preview: reader.result,
        });
        console.log(
          "이미지가 선택되었습니다:",
          file.name,
          file.type,
          file.size
        );
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateAlbum = async () => {
    if (!albumsName.trim()) {
      alert("앨범 이름을 입력해주세요.");
      return;
    }

    setIsLoading(true);

    try {
      // FormData 객체 생성
      const formDataToSend = new FormData();

      // 회원가입 코드와 유사하게 payload 구조 사용
      const payload = {
        album_name: albumsName,
      };

      // 페이로드를 JSON 문자열로 변환하여 추가
      formDataToSend.append("payload", JSON.stringify(payload));

      // 이미지 파일이 있으면 추가 (파일명은 'file'로 지정)
      if (albumsImage?.file) {
        formDataToSend.append("file", albumsImage.file);
        console.log(
          "업로드할 이미지:",
          albumsImage.file.name,
          albumsImage.file.type,
          albumsImage.file.size
        );
      } else {
        console.log("선택된 이미지가 없습니다.");
      }

      console.log("앨범 이름:", albumsName);

      // FormData 내용 확인
      console.log("=== FormData 내용 확인 ===");
      for (let [key, value] of formDataToSend.entries()) {
        console.log(
          `${key}: ${
            value instanceof File
              ? `파일(${value.name}, ${value.type}, ${value.size}바이트)`
              : value
          }`
        );
      }

      // API 호출
      const response = await createAlbumsList(formDataToSend, token);

      console.log("API 응답:", response);

      if (response.status === 200 || response.status === 201) {
        alert("앨범이 성공적으로 생성되었습니다.");
        setShowCreateModal(false);
      }
    } catch (error) {
      console.error("앨범 생성 중 오류 발생:", error);

      // 에러 응답의 세부 내용 확인
      if (error.response) {
        console.error("에러 상태:", error.response.status);
        console.error("에러 데이터:", error.response.data);

        // 서버에서 구체적인 오류 메시지를 제공하는 경우 표시
        if (error.response.data && error.response.data.message) {
          alert(`앨범 생성 실패: ${error.response.data.message}`);
        } else {
          alert("앨범 생성에 실패했습니다. 다시 시도해주세요.");
        }
      } else {
        alert("앨범 생성에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ModalWrap onClose={setShowCreateModal} title={"Create Album"}>
      <div className="albums-create-modal">
        <p className="albums-create-modal__title">Album Cover Image</p>
        <span className="albums-create-modal__size-info">
          (jpg, png, under 4MB)
        </span>
        <div className="albums-create-modal__image-box">
          <img
            className="albums-create-modal__image"
            src={albumsImage?.preview || defaultAlbumsImage}
            alt="albums_cover_image"
          />
          <input
            type="file"
            accept="image/jpeg, image/png"
            onChange={handleImageUpload}
            ref={fileInputRef}
            style={{ display: "none" }}
          />
          <button onClick={() => fileInputRef.current.click()}>
            <img
              className="albums-create-modal__button-image"
              src={UploadButtonImage}
              alt="button_icon"
            />
          </button>
        </div>
        <p className="albums-create-modal__name">Album Name</p>
        <div className="albums-create-modal__name-box">
          <input
            className="albums-create-modal__name-box__input"
            placeholder="Please enter the album name"
            value={albumsName}
            onChange={(e) => setAlbumsName(e.target.value)}
            maxLength={40}
          />
          <span className="albums-create-modal__name-box__input__length">
            {albumsName?.length || 0}/40
          </span>
        </div>
        <div className="albums-create-modal__button-box">
          <button
            className="albums-create-modal__button__cancel"
            onClick={() => setShowCreateModal(false)}
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            className="albums-create-modal__button__create"
            onClick={handleCreateAlbum}
            disabled={isLoading}
          >
            {isLoading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </ModalWrap>
  );
};
export default AlbumsCreateModal;
