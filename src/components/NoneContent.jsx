import offImage from "../assets/images/none-icon.svg";
import loadingImg from "../assets/images/loading-img.gif";

import "./NoneContent.scss";

const NoneContent = ({
  height,
  image = offImage,
  message,
  style,
  loading = false,
}) => {
  if (loading) {
    image = loadingImg;
    message = "Loading";
  }

  return (
    <div className="profile__none-content" style={{ ...style, height: height }}>
      {image && <img className="profile__none-image" src={image} alt="icon" />}
      <p className="profile__none-text">{message}</p>
    </div>
  );
};

export default NoneContent;
