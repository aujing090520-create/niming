import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SARAH_PROFILE, GIFT_ITEMS, EMOS, SAMPLE_GREETINGS } from '../data';
import { AppState, GiftItem } from '../types';
import { ChevronLeft, Shield, Lock, Send, Smile, Image as ImageIcon, Mic, Gift, HelpCircle, Eye } from 'lucide-react';

interface PreChatPageProps {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
  onBack: () => void;
  onStartSession: (firstMessage: { content: string; type: 'text' | 'image' | 'voice' | 'gift' | 'greeting' }) => void;
  onErrorToast: (msg: string) => void;
}

export default function PreChatPage({
  state,
  onChange,
  onBack,
  onStartSession,
  onErrorToast
}: PreChatPageProps) {
  const [inputText, setInputText] = useState('');
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'emoji' | 'gift' | 'voice' | 'image'>('none');
  const [pendingGift, setPendingGift] = useState<GiftItem | null>(null);

  const handleSendText = () => {
    if (!inputText.trim()) return;
    tryToInitiate({ content: inputText, type: 'text' });
    setInputText('');
  };

  const tryToInitiate = (msg: { content: string; type: 'text' | 'image' | 'voice' | 'gift' | 'greeting' }, isGiftConfirmed = false) => {
    // Quota validation
    if (state.anonymousTodayLeft <= 0) {
      onErrorToast('今日匿名次数已用完，请明天再试');
      return;
    }
    if (state.anonymousMonthLeft <= 0) {
      onErrorToast('本月匿名次数已用完，请下月再试');
      return;
    }

    // Gift check for atomic payment simulation
    if (msg.type === 'gift' && !isGiftConfirmed) {
      const giftItem = GIFT_ITEMS.find(g => g.id === msg.content);
      if (giftItem) {
        setPendingGift(giftItem);
        return;
      }
    }

    // Call successful start
    onStartSession(msg);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden select-none">
      {/* iOS Top Nav Header */}
      <div className="bg-white border-b border-gray-100 px-3 py-3.5 flex items-center gap-2 text-gray-800 z-10 shadow-xs">
        <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-100 -ml-1 text-gray-600">
          <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <div className="flex items-center gap-2 flex-1">
          <div className="relative">
            <img
              src={SARAH_PROFILE.avatar}
              alt={SARAH_PROFILE.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-gray-900 leading-tight">{SARAH_PROFILE.name}</span>
              <span className="bg-indigo-100 text-indigo-800 text-[8px] font-extrabold px-1.5 py-0.5 rounded-sm scale-95 flex items-center gap-0.5">
                <Lock className="w-2 h-2" /> 匿名聊天
              </span>
            </div>
            <span className="text-[9px] text-gray-400">在线 (Online)</span>
          </div>
        </div>
      </div>

      {/* Warning Banners Area */}
      <div className="flex flex-col text-xs z-10">
        {/* Risk Banner */}
        <div className="bg-amber-50 text-amber-800 px-3.5 py-2.5 border-b border-amber-100/60 flex items-start gap-2 font-sans font-medium">
          <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="leading-normal text-[10.5px]">
            请在保持匿名的前提下友善交流，避免泄露个人隐私和财务信息
          </p>
        </div>

        {/* Anonymous status banner */}
        <div className="bg-indigo-50 text-indigo-800 px-3.5 py-2 border-b border-indigo-100 flex items-center gap-2 font-sans font-semibold text-[10.5px]">
          <Eye className="w-4 h-4 text-indigo-600 flex-shrink-0" />
          <span>你现在是匿名状态</span>
        </div>
      </div>

      {/* Conversation / Empty Chat state area */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center gap-6">
        <div className="bg-white/80 backdrop-blur-xs rounded-2xl p-6 border border-gray-200/50 shadow-xs max-w-[85%] text-center flex flex-col items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center">
            <Lock className="w-6 h-6 stroke-[2]" />
          </div>
          <h4 className="text-sm font-bold text-gray-800">开启新的一步</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            发送第一条消息前，对方无法知道你是谁。点击下方预设打招呼或者输入你想要说的话。
          </p>
        </div>

        {/* Floating Greeting Button */}
        <button
          onClick={() => tryToInitiate({ content: '👋 匿名打个招呼', type: 'greeting' })}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 px-6 rounded-full shadow-lg shadow-indigo-600/20 flex items-center gap-1.5 transition active:scale-95 duration-150"
        >
          <span>👋 匿名打个招呼</span>
        </button>

        {/* Suggestion greeting cards */}
        <div className="w-full max-w-xs flex flex-col gap-2 mt-2">
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider self-center mb-1">推荐问候语</span>
          {SAMPLE_GREETINGS.slice(0, 2).map((greet, idx) => (
            <button
              key={idx}
              onClick={() => tryToInitiate({ content: greet, type: 'greeting' })}
              className="text-left bg-white hover:bg-gray-50 border border-gray-200/60 p-2.5 rounded-xl text-xs text-gray-600 font-medium transition line-clamp-1 truncate"
            >
              {greet}
            </button>
          ))}
        </div>
      </div>

      {/* Limit Notice banner above input */}
      <div className="bg-amber-50/50 border-t border-amber-100 text-[10.5px] text-amber-800 py-1.5 px-3 flex items-center justify-center gap-1 font-semibold">
        <span>💡 发送第一条消息后将消耗 1 次匿名聊天次数</span>
        <span className="bg-indigo-100 text-indigo-800 text-[9px] px-1.5 rounded-full">
          剩 {state.anonymousTodayLeft} 次
        </span>
      </div>

      {/* Input Field and drawers */}
      <div className="bg-white border-t border-gray-150 flex flex-col z-10">
        <div className="flex items-center gap-2 px-3 py-2.5">
          {/* Audio voice toggle */}
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'voice' ? 'none' : 'voice')}
            className={`p-1.5 rounded-full hover:bg-gray-100 transition ${activeDrawer === 'voice' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}
          >
            <Mic className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <div className="flex-1 relative flex items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendText()}
              placeholder="Type a message"
              className="w-full bg-gray-100 border-0 rounded-full py-1.5 pl-4 pr-10 text-xs focus:ring-1 focus:ring-indigo-500 text-gray-800 placeholder-gray-400"
            />
            {/* Smile Emoji selector */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === 'emoji' ? 'none' : 'emoji')}
              className={`absolute right-2.5 p-1 rounded-full hover:bg-gray-200 transition ${activeDrawer === 'emoji' ? 'text-indigo-600' : 'text-gray-400'}`}
            >
              <Smile className="w-4 h-4" />
            </button>
          </div>

          {/* Image Select option */}
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'image' ? 'none' : 'image')}
            className={`p-1.5 rounded-full hover:bg-gray-100 transition ${activeDrawer === 'image' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Gift Panel option */}
          <button
            onClick={() => setActiveDrawer(activeDrawer === 'gift' ? 'none' : 'gift')}
            className={`p-1.5 rounded-full hover:bg-gray-100 transition ${activeDrawer === 'gift' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}
          >
            <Gift className="w-5 h-5" />
          </button>

          {/* Send text button */}
          <button
            onClick={handleSendText}
            disabled={!inputText.trim()}
            className="p-2 rounded-full bg-indigo-600 text-white disabled:bg-gray-200 disabled:text-gray-400 transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>

        {/* Drawer panel render */}
        <AnimatePresence>
          {activeDrawer !== 'none' && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: 160 }}
              exit={{ height: 0 }}
              className="bg-gray-50 border-t border-gray-100 overflow-y-auto"
            >
              {/* Emoji Drawer */}
              {activeDrawer === 'emoji' && (
                <div className="grid grid-cols-8 gap-2 p-3 text-lg justify-items-center">
                  {EMOS.slice(0, 32).map((emo, index) => (
                    <button
                      key={index}
                      onClick={() => setInputText(prev => prev + emo)}
                      className="hover:scale-125 transition p-1 cursor-pointer"
                    >
                      {emo}
                    </button>
                  ))}
                </div>
              )}

              {/* Gift Drawer */}
              {activeDrawer === 'gift' && (
                <div className="grid grid-cols-3 gap-2.5 p-3.5">
                  {GIFT_ITEMS.slice(0, 3).map((gift) => (
                    <button
                      key={gift.id}
                      onClick={() => tryToInitiate({ content: gift.id, type: 'gift' })}
                      className="flex flex-col items-center bg-white border border-gray-200/60 rounded-xl p-2 hover:border-indigo-500 transition shadow-xs"
                    >
                      <span className="text-xl mb-1">{gift.icon}</span>
                      <span className="text-[10px] font-bold text-gray-800">{gift.name}</span>
                      <span className="text-[9px] text-amber-500 font-medium">{gift.points} 积分</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Voice Drawer */}
              {activeDrawer === 'voice' && (
                <div className="flex flex-col gap-2 p-4 justify-center items-center h-full">
                  <p className="text-[10px] text-gray-400 font-medium mb-1">选择一条模拟语音消息发送</p>
                  <div className="flex gap-2">
                    {[
                      { label: '🎙️ 短语音 (4s)', val: '4' },
                      { label: '🎙️ 长语音 (12s)', val: '12' }
                    ].map((v, i) => (
                      <button
                        key={i}
                        onClick={() => tryToInitiate({ content: v.val, type: 'voice' })}
                        className="bg-white border border-gray-200 hover:border-indigo-500 text-xs text-gray-700 font-bold px-4 py-2.5 rounded-xl transition shadow-xs"
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Image Drawer */}
              {activeDrawer === 'image' && (
                <div className="flex flex-col gap-2 p-3 justify-center items-center h-full">
                  <p className="text-[10px] text-gray-400 font-medium">选择一张模拟照片发送</p>
                  <div className="flex gap-3">
                    {[
                      { icon: '🌇', label: '北京日落' },
                      { icon: '🍕', label: '美食照片' },
                      { icon: '🐾', label: '可爱宠物' }
                    ].map((img, i) => (
                      <button
                        key={i}
                        onClick={() => tryToInitiate({ content: img.label, type: 'image' })}
                        className="flex flex-col items-center bg-white border border-gray-200 hover:border-indigo-500 p-2 rounded-xl text-xs transition shadow-xs"
                      >
                        <span className="text-xl mb-1">{img.icon}</span>
                        <span className="text-[9px] text-gray-600 font-medium">{img.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Gift Simulation Dialog */}
      <AnimatePresence>
        {pendingGift && (
          <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-6 rounded-[40px]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-[270px] rounded-2xl p-5 text-center shadow-2xl border border-gray-100 flex flex-col gap-4"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto text-2xl">
                {pendingGift.icon}
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="font-sans font-bold text-sm text-gray-950">赠送 {pendingGift.name} 并发起会话</h3>
                <p className="text-[11px] text-gray-500 leading-normal">
                  礼物费用: <span className="text-amber-500 font-bold">{pendingGift.points} 积分</span>。发送后礼物支付、匿名次数扣除、匿名会话建立将作为一个原子整体执行。
                </p>
              </div>

              <div className="flex flex-col gap-2 mt-2">
                <button
                  onClick={() => {
                    const giftId = pendingGift.id;
                    setPendingGift(null);
                    tryToInitiate({ content: giftId, type: 'gift' }, true);
                  }}
                  className="w-full text-xs font-bold text-white py-2.5 px-3 rounded-xl bg-green-600 hover:bg-green-700 transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>✅ 模拟支付并发送成功</span>
                </button>
                <button
                  onClick={() => {
                    setPendingGift(null);
                    onErrorToast('礼物支付失败 (余额不足)，会话未创建，未扣减任何次数或积分。');
                  }}
                  className="w-full text-xs font-bold text-red-600 py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 transition active:scale-95 flex items-center justify-center gap-1.5"
                >
                  <span>❌ 模拟支付失败 (原子回滚)</span>
                </button>
                <button
                  onClick={() => setPendingGift(null)}
                  className="w-full text-xs font-semibold text-gray-400 py-2.5 px-3 rounded-xl hover:bg-gray-50 transition"
                >
                  取消
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
