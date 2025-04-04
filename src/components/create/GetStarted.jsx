import "./GetStarted.scss";
import { useState } from "react";
import ExpandedButton from "./ExpandedButton";
import { WalletConnect } from "../WalletConnect";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { RemainCountButton } from "../unit/RemainCountButton";
const GetStarted = ({ handler, createPossibleCount }) => {
  const { isRegistered, setIsLoggedIn, setWalletAddress } =
    useContext(AuthContext);

  const handleWalletConnect = (loggedIn, walletAddress) => {
    setIsLoggedIn(loggedIn);
    if (loggedIn && walletAddress) {
      setWalletAddress(walletAddress);
    }
  };
  return (
    <div className="create__get-started">
      <h1 className="create__get-started--title">
        Create Your Own Song With AI
      </h1>
      <h2 className="create__get-started--subtitle">
        Turn your ideas into beautiful lyrics and melodies with the power of AI
      </h2>
      <div className="create__get-started--features">
        <h3 className="create__get-started--features-title">Code Features</h3>
        <div className="create__get-started--features-items">
          {["Lyric Generation", "Melody Composition", "Style Adaptation"].map(
            (item, index) => (
              <div className="create__get-started--features-item" key={index}>
                {item}
              </div>
            )
          )}
        </div>
      </div>
      <div className="create__get-started--features sequence">
        <div>
          <h3 className="create__get-started--features-title">Cost</h3>
          <p className="create__get-started--features-item">-- MOB</p>
        </div>
        <div>
          <h3 className="create__get-started--features-title">Used</h3>
          <p className="create__get-started--features-item">--</p>
        </div>
        <div>
          <h3 className="create__get-started--features-title">Precision</h3>
          <p className="create__get-started--features-item ">--%</p>
        </div>
      </div>
      <RemainCountButton createPossibleCount={createPossibleCount} />

      {isRegistered ? (
        <ExpandedButton
          className="create__get-started--button"
          onClick={handler}
        >
          Create
        </ExpandedButton>
      ) : (
        <WalletConnect onConnect={handleWalletConnect} />
      )}
    </div>
  );
};

export default GetStarted;
