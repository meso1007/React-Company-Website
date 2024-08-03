import React from "react";

function Modal(props) {
  return (
    <div
      className={`modal ${props.isShow ? "show" : ""}`}
      onClick={handleClose}
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={handleClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
