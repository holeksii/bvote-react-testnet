import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

const Overlay = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  const overlayRef = useRef(null as HTMLDivElement | null);

  useEffect(() => {
    const handleOutsideClick = (event: any) => {
      if (!overlayRef.current!.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed z-64 inset-0 flex items-center justify-center w-screen bg-black bg-opacity-50 ">
      <div
        className="bg-slate-950 p-4 rounded-lg overflow-y-scroll max-h-full"
        ref={overlayRef}
        style={{ width: "100%", maxWidth: "400px" }}
      >
        {children}
      </div>
    </div>
  );
};

export default Overlay;
