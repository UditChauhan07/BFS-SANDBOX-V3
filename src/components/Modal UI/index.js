import React, { useEffect, useRef, useState } from "react";
import Styles from "./Styles.module.css";
const Modal = ({ isOpen, onClose, children,styles }) => {
  return (
    <>
      {isOpen && (
        <div className={Styles.modalOverlay} onClick={onClose}>
          <div 
            className={`${Styles.modal} `}
            style={{...styles}}
            onClick={(e) => {
              // do not close modal if anything inside modal content is clicked
              e.stopPropagation();
            }}
          >
            <div className={Styles.modalContent}>{children}</div>
          </div>
        </div>
      )}
    </>
  );
};
const ModalPage = ({ open, content, onClose,styles={} }) => {
  const [isOpen, setIsOpen] = useState(open);

  useEffect(() => {
    setIsOpen(open);
    if(isOpen){
      document.body.style.overflow = "hidden";
    }else{
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const onModalClose = () => {
    document.body.style.overflow = "auto";
    onClose?.();
    setIsOpen(false);
  };

  return isOpen ? (
    <Modal isOpen={isOpen} onClose={onModalClose} styles={styles}>
      <div id={"alertBox"}>
        <div className={Styles.ModalControl}>
          {content}
        </div>
      </div>
    </Modal>
  ) : null;
};

export default ModalPage;
