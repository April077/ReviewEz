import React from "react";

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed w-full h-full inset-0 flex justify-center items-start z-50 overflow-y-auto p-4">
      <div className="fixed inset-0 bg-black bg-opacity-30" onClick={onClose} />
      <div className="bg-white max-w-lg w-full mx-auto rounded-xl shadow-lg relative z-10 p-8 my-12">
        {children}
      </div>
    </div>
  );
};

export default Modal;
