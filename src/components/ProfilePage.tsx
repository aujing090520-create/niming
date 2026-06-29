import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SARAH_PROFILE } from '../data';
import { AppState } from '../types';
import { MessageCircle, ShieldAlert, Sparkles, MoreHorizontal, Globe, Heart, Compass, Star, ChevronRight, UserPlus, Flame } from 'lucide-react';

interface ProfilePageProps {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
  onAnonymousClick: () => void;
  onNormalChatClick: () => void;
  onOpenPaywall: () => void;
}

export default function ProfilePage({
  state,
  onChange,
  onAnonymousClick,
  onNormalChatClick,
  onOpenPaywall
}: ProfilePageProps) {
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const user = SARAH_PROFILE;

  return (
    <div className="flex flex-col h-full bg-gray-50 relative select-none">
      {/* iOS Top Nav header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between text-gray-800">
        <span className="text-xs font-bold font-mono tracking-tight text-gray-400">HELLOTALK PROFILE</span>
        <div className="flex items-center gap-2">
          {/* Plus Member status Badge */}
          {state.isPlus ? (
            <span className="flex items-center gap-0.5 bg-amber-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm">
              <Sparkles className="w-2.5 h-2.5" /> PLUS
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-400 text-[9px] font-bold px-2 py-0.5 rounded-full">
              免费用户
            </span>
          )}
          <button
            onClick={() => setShowMoreMenu(!showMoreMenu)}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-600 transition"
          >
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Dropdown Menu for "More" */}
      <AnimatePresence>
        {showMoreMenu && (
          <>
            <div className="absolute inset-0 z-20" onClick={() => setShowMoreMenu(false)} />
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute right-3 top-12 bg-white rounded-xl shadow-xl border border-gray-100 py-1.5 w-44 z-30 overflow-hidden"
            >
              {!state.isRevealed && (
                <button
                  onClick={() => {
                    setShowMoreMenu(false);
                    if (state.isPlus) {
                      onAnonymousClick();
                    } else {
                      onOpenPaywall();
                    }
                  }}
                  className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 font-medium transition flex items-center gap-2"
                >
                  <ShieldAlert className="w-4 h-4 text-indigo-600" />
                  <span>匿名聊天</span>
                  {!state.isPlus && (
                    <span className="ml-auto bg-amber-500 text-white text-[8px] font-bold px-1 rounded">VIP</span>
                  )}
                </button>
              )}

              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-full text-left px-4 py-2.5 text-xs text-gray-700 hover:bg-gray-50 transition flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4 text-gray-400" />
                <span>关注对方</span>
              </button>

              <button
                onClick={() => setShowMoreMenu(false)}
                className="w-full text-left px-4 py-2.5 text-xs text-red-600 hover:bg-red-50 transition flex items-center gap-2"
              >
                <span>举报或屏蔽</span>
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Profile Body */}
      <div className="flex-1 overflow-y-auto pb-6">
        {/* Profile Card Header Background */}
        <div className="relative h-28 bg-gradient-to-r from-indigo-500 to-violet-600 overflow-hidden">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white via-transparent to-black" />
          <div className="absolute bottom-2 left-4 text-[10px] text-white/70 font-mono tracking-widest">CONNECT & LEARN</div>
        </div>

        {/* Profile Info Card Container */}
        <div className="px-4 -mt-10 relative z-10 flex flex-col gap-4">
          {/* Avatar and Primary Identity */}
          <div className="flex items-end justify-between">
            <div className="relative">
              <img
                src={user.avatar}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-20 h-20 rounded-full border-4 border-white shadow-md object-cover"
              />
              {user.isOnline && (
                <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />
              )}
            </div>

            {/* Quick stats on the right */}
            <div className="flex gap-4 pb-2 text-center">
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-gray-800">4.9</span>
                <span className="text-[10px] text-gray-400">语伴评分</span>
              </div>
              <div className="w-[1px] h-8 bg-gray-200 mt-1" />
              <div className="flex flex-col">
                <span className="text-sm font-extrabold text-gray-800">1.2k</span>
                <span className="text-[10px] text-gray-400">关注者</span>
              </div>
            </div>
          </div>

          {/* Name & Basic details */}
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-sans font-bold text-lg text-gray-950 tracking-tight">{user.name}</h1>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${user.gender === 'female' ? 'bg-pink-100 text-pink-600' : 'bg-blue-100 text-blue-600'}`}>
                ♀ {user.age}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">位置: {user.region} • 家乡: {user.hometown}</p>
          </div>

          {/* Language Exchange Badges */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs">
              <Globe className="w-3.5 h-3.5 text-indigo-600" />
              <span className="font-bold text-gray-700">语言交换信息</span>
            </div>
            <div className="flex flex-col gap-1.5 mt-0.5">
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded text-[10px]">母语</span>
                <span className="text-gray-800 font-medium">{user.nativeLang}</span>
                <span className="text-gray-400">🇺🇸 ➔ 🇬🇧</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded text-[10px]">正在学</span>
                <span className="text-gray-800 font-medium">{user.learnLang}</span>
                <span className="text-gray-400">🇨🇳</span>
              </div>
            </div>
          </div>

          {/* Biography */}
          <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col gap-1.5">
            <h3 className="text-xs font-bold text-gray-800">个性签名</h3>
            <p className="text-xs text-gray-600 leading-relaxed font-sans">{user.intro}</p>
          </div>

          {/* HelloTalk Features grid */}
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between">
              <span className="font-medium">动态 (Moments)</span>
              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-100 flex items-center justify-between">
              <span className="font-medium">语言小考评分</span>
              <span className="text-indigo-600 font-bold">A1</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Bottom Call-to-actions */}
      <div className="bg-white border-t border-gray-100 p-4 pb-6 flex items-center gap-2.5 z-10">
        {/* Normal Chat Button */}
        <button
          onClick={onNormalChatClick}
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-full text-xs shadow-md shadow-indigo-600/15 flex items-center justify-center gap-1.5 transition active:scale-95 duration-150"
        >
          <MessageCircle className="w-4 h-4" />
          发消息
        </button>

        {/* Plus Only: "匿名" (Anonymous) Button */}
        {state.isPlus && !state.isRevealed ? (
          <button
            onClick={onAnonymousClick}
            className="bg-violet-50 hover:bg-violet-100 text-violet-800 border border-violet-200 font-bold py-3 px-5 rounded-full text-xs flex items-center justify-center gap-1.5 transition active:scale-95 duration-150 shadow-sm relative overflow-hidden"
          >
            <ShieldAlert className="w-4 h-4 text-violet-700" />
            <span>匿名</span>
          </button>
        ) : null}
      </div>
    </div>
  );
}
