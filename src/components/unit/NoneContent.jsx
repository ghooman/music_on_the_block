import offImage from "../../assets/images/none-icon.svg";
import NoDataImage from "../../assets/images/mypage/albums-no-data.svg";
import loadingImg from "../../assets/images/loading-img.gif";

import "./NoneContent.scss";

const NoneContent = ({
  height,
  image = NoDataImage,
  message,
  message2,
  style,
  loading = false,
}) => {
  if (loading) {
    image = loadingImg;
    message = "Loading";
  }

  return (
    <div
      className="unit-component-none-content"
      style={{ ...style, height: height }}
    >
      {image && (
        <img
          className="unit-component-none-content__image"
          src={image}
          alt="icon"
        />
      )}
      <p className="unit-component-none-content--text">{message}</p>
      {message2 && (
        <p className="unit-component-none-content--text">{message2}</p>
      )}
    </div>
  );
};

export default NoneContent;
