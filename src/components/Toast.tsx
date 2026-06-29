import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface ToastProps {
  message: string;
  type?: 'error' | 'success' | 'info';
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const bgColors = {
    error: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const Icons = {
    error: <AlertCircle className="w-5 h-5 text-red-600" />,
    success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
  };

  return (
    <div className="absolute top-16 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm max-w-[90%] font-medium backdrop-blur-md pointer-events-auto ${bgColors[type]}`}
      >
        {Icons[type]}
        <span>{message}</span>
      </motion.div>
    </div>
  );
}
