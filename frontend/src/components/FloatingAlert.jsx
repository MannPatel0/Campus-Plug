// components/FloatingAlert.jsx
import { useEffect } from "react";

const FloatingAlert = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg z-50 text-center">
      {message}
    </div>
  );
};
export default FloatingAlert;
