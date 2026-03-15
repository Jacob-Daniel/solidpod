"use client";
import { FC } from "react";

interface MessageModalProps {
  message: string;
  onClose: () => void;
}

const MessageModal: FC<MessageModalProps> = ({ message, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-black/50 items-start">
      <div className="bg-white rounded-2xl shadow-lg p-6 h-auto max-w-md w-full animate-slide-in-tb flex-shrink absolute top-[100px]">
        <p className="text-gray-800 text-base mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition cursor-pointer"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
