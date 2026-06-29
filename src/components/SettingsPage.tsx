import React from 'react';
import { ANONYMOUS_AVATAR, ANONYMOUS_ID_CODE } from '../data';
import { AppState } from '../types';
import { ChevronLeft, Shield, Bell, Trash2, Ban, AlertTriangle, ChevronRight } from 'lucide-react';

interface SettingsPageProps {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
  onBack: () => void;
  onClearHistory: () => void;
  onGoToReport: () => void;
}

export default function SettingsPage({
  state,
  onChange,
  onBack,
  onClearHistory,
  onGoToReport
}: SettingsPageProps) {
  return (
    <div className="flex flex-col h-full bg-gray-50 relative select-none">
      {/* Top Nav Header */}
      <div className="bg-white border-b border-gray-100 px-3 py-3.5 flex items-center gap-2 text-gray-800 z-10 shadow-xs">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-100 -ml-1 text-gray-600">
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <span className="text-xs font-extrabold text-gray-900 tracking-tight flex-1 text-center pr-7">
          聊天设置
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Profile Card Section (Anonymous only) */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col items-center text-center shadow-xs">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl border border-slate-200 mb-2.5">
            {ANONYMOUS_AVATAR}
          </div>
          <h3 className="font-sans font-extrabold text-sm text-gray-900">
            匿名Plus用户 {ANONYMOUS_ID_CODE}
          </h3>
          <p className="text-[10px] text-gray-400 mt-1 px-4 leading-relaxed">
            对方使用了 Plus 专属匿名聊天特权。解除匿名前，您无法查看其真实身份和主页。
          </p>
        </div>

        {/* Custom Actions List */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs">
          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4 border-b border-gray-50">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-gray-800">新消息通知</span>
            </div>
            <button
              onClick={() => {}}
              className="relative inline-flex h-5 w-9 items-center rounded-full bg-indigo-600"
            >
              <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white translate-x-4.5" />
            </button>
          </div>

          {/* Clear History */}
          <button
            onClick={onClearHistory}
            className="w-full flex items-center justify-between p-4 border-b border-gray-50 text-left hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gray-50 text-gray-500 flex items-center justify-center">
                <Trash2 className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-gray-800">清空聊天历史</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </button>

          {/* Block / Unblock */}
          <button
            onClick={() => onChange({ isBlockedByRecipient: !state.isBlockedByRecipient })}
            className="w-full flex items-center justify-between p-4 border-b border-gray-50 text-left hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                state.isBlockedByRecipient ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
              }`}>
                <Ban className="w-4 h-4" />
              </div>
              <span className={`text-xs font-bold ${state.isBlockedByRecipient ? 'text-red-600' : 'text-gray-800'}`}>
                {state.isBlockedByRecipient ? '解除拉黑' : '拉黑对方'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {state.isBlockedByRecipient && (
                <span className="text-[9px] bg-red-100 text-red-700 font-extrabold px-1.5 py-0.5 rounded mr-1">已拉黑</span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </button>

          {/* Report User */}
          <button
            onClick={onGoToReport}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-red-50 text-red-500 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-red-500">举报该匿名用户</span>
            </div>
            <div className="flex items-center gap-1">
              {state.hasReported && (
                <span className="text-[9px] bg-yellow-100 text-yellow-700 font-extrabold px-1.5 py-0.5 rounded mr-1">已举报</span>
              )}
              <ChevronRight className="w-4 h-4 text-gray-300" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
