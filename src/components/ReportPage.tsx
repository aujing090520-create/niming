import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ANONYMOUS_AVATAR, ANONYMOUS_ID_CODE } from '../data';
import { ChevronLeft, ShieldAlert, CheckSquare, Square, FileText, Send, Check } from 'lucide-react';

interface ReportPageProps {
  onBack: () => void;
  onSubmit: (reasons: string[], alsoBlock: boolean, comment: string) => void;
}

export default function ReportPage({ onBack, onSubmit }: ReportPageProps) {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [alsoBlock, setAlsoBlock] = useState(true);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const reasons = [
    '垃圾广告、商业营销',
    '语言骚扰、恶意辱骂',
    '欺诈骗局、金钱诱导',
    '散播色情低俗内容',
    '泄露他人隐私信息',
    '政治敏感、违法违规'
  ];

  const handleToggleReason = (reason: string) => {
    if (selectedReasons.includes(reason)) {
      setSelectedReasons(selectedReasons.filter(r => r !== reason));
    } else {
      setSelectedReasons([...selectedReasons, reason]);
    }
  };

  const handleSubmit = () => {
    if (selectedReasons.length === 0 && !comment.trim()) {
      alert('请选择举报原因或填写具体描述');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        onSubmit(selectedReasons, alsoBlock, comment);
      }, 1500);
    }, 1200);
  };

  if (success) {
    return (
      <div className="flex flex-col h-full bg-white items-center justify-center p-6 text-center select-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600 mb-4"
        >
          <Check className="w-8 h-8 stroke-[3]" />
        </motion.div>
        <h3 className="font-sans font-extrabold text-lg text-gray-950">举报提交成功</h3>
        <p className="text-xs text-gray-500 mt-2 leading-relaxed px-4">
          我们已收到您的举报。我们将在 24 小时内进行核实和处理。
          {alsoBlock && <span className="block text-red-500 font-bold mt-1">该匿名身份已被拉黑，将无法继续向你发送匿名消息。</span>}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden select-none">
      {/* Top Nav Header */}
      <div className="bg-white border-b border-gray-100 px-3 py-3.5 flex items-center gap-2 text-gray-800 z-10 shadow-xs">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-100 -ml-1 text-gray-600">
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <span className="text-xs font-extrabold text-gray-900 tracking-tight flex-1 text-center pr-7">
          举报用户
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* User Card */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center gap-3 shadow-xs">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-2xl border border-slate-200">
            {ANONYMOUS_AVATAR}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-extrabold text-gray-900">匿名Plus用户 {ANONYMOUS_ID_CODE}</span>
            <span className="text-[10px] text-gray-400 mt-0.5">身份类型：VIP 匿名发起者</span>
          </div>
        </div>

        {/* Reasons Selector */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col gap-3 shadow-xs">
          <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1">
            <ShieldAlert className="w-4 h-4 text-red-500" />
            选择举报原因 (多选)
          </h4>
          <div className="flex flex-col gap-2 mt-1">
            {reasons.map((r, i) => {
              const isSelected = selectedReasons.includes(r);
              return (
                <button
                  key={i}
                  onClick={() => handleToggleReason(r)}
                  className={`flex items-center justify-between p-3 rounded-xl border text-left text-xs transition ${
                    isSelected
                      ? 'bg-red-50 border-red-200 text-red-900 font-bold'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span>{r}</span>
                  <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                    isSelected ? 'bg-red-500 border-red-500 text-white' : 'border-gray-300 bg-white'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Comments */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex flex-col gap-2 shadow-xs">
          <h4 className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-gray-400" />
            具体描述
          </h4>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="请填写更详细的违规描述，可帮助我们更快核实（选填）"
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs focus:ring-1 focus:ring-indigo-500 text-gray-800 placeholder-gray-400 h-20 resize-none"
          />
        </div>

        {/* Block Switch checkbox */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-0.5">
            <span className="text-xs font-bold text-gray-800">同时拉黑对方</span>
            <span className="text-[10px] text-gray-400">拉黑后，该匿名身份将无法继续向你发送匿名消息。</span>
          </div>
          <button
            onClick={() => setAlsoBlock(!alsoBlock)}
            className="flex items-center gap-1 focus:outline-none"
          >
            {alsoBlock ? (
              <CheckSquare className="w-5 h-5 text-red-500 stroke-[2.5]" />
            ) : (
              <Square className="w-5 h-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Submit Button Bar */}
      <div className="bg-white border-t border-gray-100 p-4 pb-6">
        <button
          onClick={handleSubmit}
          disabled={selectedReasons.length === 0 && !comment.trim()}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-full font-bold text-xs shadow-md shadow-red-500/15 flex items-center justify-center gap-1.5 transition active:scale-95 disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none"
        >
          {isSubmitting ? '提交中...' : '提交举报'}
        </button>
      </div>
    </div>
  );
}
