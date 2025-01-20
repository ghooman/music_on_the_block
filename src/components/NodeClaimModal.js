import { useEffect, useState } from "react";
import closeIcon from "../assets/images/close.svg";
import Loading from "./Loading";
import "./NodeClaimModal.scss";
import ModalWrap from "./ModalWrap";
const NodeClaimModal = ({ setOpenModal,handleModalClaim }) => {

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  const [error, setError] = useState();
  const [isLoading, setLoading] = useState(false);

  return (
    <>
    <ModalWrap
      title="Node Reward"
      onClose={setOpenModal}
    >
      <div className="node-claim-modal">
        <div className="node-claim-modal__container">
          <dl className="node-claim-modal__xmpt-input">
            <dt>total Claim Reward<span>(100%)</span></dt>
            <dd>
              <input placeholder="00"/>
              <p>Node</p>
            </dd>
          </dl>
          <dl className="node-claim-modal__xmpt-input two">
            <dt>Early Claim Reward<span>(25%)</span></dt>
            <dd>
              <input placeholder="00"/>
              <p>Node</p>
            </dd>
            {error &&
              <dd className="error">It is not possible to send more than the total quantity</dd>
            }
          </dl>
          <div className="node-claim-modal__btn">
            <button className="btn-cancel"
              onClick={()=>setOpenModal(false)}
            >CANCEL</button>
            <button className="btn-ok"
              onClick={() => {
                handleModalClaim();
                setOpenModal(false);
              }}
            >
            {!isLoading && <>CLAIM</> }
            {isLoading && <Loading/> }
            </button>
          </div>
        </div>
      </div>
    </ModalWrap>
    </>
  );
};

export default NodeClaimModal;
