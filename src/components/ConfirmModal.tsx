import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, CheckSquare, Square, AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: (dontShowAgain: boolean) => void;
}

export default function ConfirmModal({ isOpen, onCancel, onConfirm }: ConfirmModalProps) {
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 bg-black/50 flex items-center justify-center p-6 rounded-[40px] overflow-hidden">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white w-full max-w-[280px] rounded-2xl p-5 shadow-2xl border border-gray-100 flex flex-col gap-4 text-center"
      >
        <div className="mx-auto w-11 h-11 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
          <Shield className="w-6 h-6 stroke-[2]" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h3 className="font-sans font-bold text-base text-gray-950">匿名聊天</h3>
          <p className="text-xs text-gray-500 leading-relaxed px-1">
            你将以匿名身份与对方聊天。发送第一条消息成功后将消耗 <span className="text-indigo-600 font-bold">1</span> 次匿名聊天次数。
          </p>
        </div>

        {/* Checkbox "Don't show again" */}
        <button
          onClick={() => setDontShowAgain(!dontShowAgain)}
          className="flex items-center justify-center gap-2 py-1.5 text-xs text-gray-600 hover:text-gray-800 transition focus:outline-none"
        >
          {dontShowAgain ? (
            <CheckSquare className="w-4 h-4 text-indigo-600 stroke-[2.5]" />
          ) : (
            <Square className="w-4 h-4 text-gray-400" />
          )}
          <span className="font-medium">不再提示</span>
        </button>

        {/* Actions Buttons */}
        <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3.5">
          <button
            onClick={onCancel}
            className="text-xs font-semibold text-gray-400 hover:text-gray-600 py-2.5 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition active:scale-95"
          >
            取消
          </button>
          <button
            onClick={() => onConfirm(dontShowAgain)}
            className="text-xs font-bold text-white py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition shadow-sm shadow-indigo-600/10 active:scale-95"
          >
            确认发起
          </button>
        </div>
      </motion.div>
    </div>
  );
}
