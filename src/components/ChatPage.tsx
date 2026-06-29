import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ME_PROFILE, SARAH_PROFILE, GIFT_ITEMS, EMOS, ANONYMOUS_AVATAR, ANONYMOUS_ID_CODE } from '../data';
import { AppState, Message, GiftItem, MessageType } from '../types';
import {
  ChevronLeft,
  Settings,
  Shield,
  Lock,
  Send,
  Smile,
  Image as ImageIcon,
  Mic,
  Gift,
  Plus,
  Phone,
  Video,
  AlertTriangle,
  User,
  ExternalLink,
  Star,
  Copy,
  Trash2,
  Undo2,
  Bookmark,
  Sparkles,
  HelpCircle,
  Play,
  Volume2
} from 'lucide-react';

interface ChatPageProps {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  onBack: () => void;
  onGoToSettings: () => void;
  onShowToast: (msg: string, type?: 'success' | 'error' | 'info') => void;
  onRevealIdentity?: () => void;
}

export default function ChatPage({
  state,
  onChange,
  messages,
  setMessages,
  onBack,
  onGoToSettings,
  onShowToast,
  onRevealIdentity
}: ChatPageProps) {
  const [inputText, setInputText] = useState('');
  const [activeDrawer, setActiveDrawer] = useState<'none' | 'emoji' | 'gift' | 'voice' | 'image' | 'plus'>('none');
  const [showRevealConfirm, setShowRevealConfirm] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<any>(null);
  const [selectedMessageIds, setSelectedMessageIds] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeDrawer]);

  const handleSendMessage = (text: string, type: MessageType = 'text', duration?: number, gift?: GiftItem) => {
    // If recipient tries to reply, it comes from Sarah
    const isSender = state.currentPerspective === 'sender';
    
    const newMsg: Message = {
      id: `msg_${Date.now()}`,
      senderId: isSender ? ME_PROFILE.id : SARAH_PROFILE.id,
      senderName: isSender 
        ? (state.sessionType === 'anonymous' ? `匿名Plus用户` : ME_PROFILE.name)
        : SARAH_PROFILE.name,
      senderAvatar: isSender
        ? (state.sessionType === 'anonymous' ? ANONYMOUS_AVATAR : ME_PROFILE.avatar)
        : SARAH_PROFILE.avatar,
      senderIsAnonymous: state.sessionType === 'anonymous' && isSender,
      content: text,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration,
      gift
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    setActiveDrawer('none');

    // Simulate reply from the other party after 2 seconds
    if (isSender && !state.isBlockedByRecipient) {
      setTimeout(() => {
        const replyMsg: Message = {
          id: `msg_reply_${Date.now()}`,
          senderId: SARAH_PROFILE.id,
          senderName: SARAH_PROFILE.name,
          senderAvatar: SARAH_PROFILE.avatar,
          senderIsAnonymous: false,
          content: getSarahReply(text, type, gift),
          type: 'text',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, replyMsg]);
      }, 1500);
    }
  };

  const getSarahReply = (sentText: string, type: MessageType, gift?: GiftItem): string => {
    if (type === 'gift' && gift) {
      return `Wow! Thank you so much for the beautiful ${gift.name}! 💖 This is so kind of you!`;
    }
    if (type === 'voice') {
      return `I can't play the voice right now, but your pronunciation sounds interesting! 🎙️ Let's practice!`;
    }
    if (type === 'image') {
      return `What a wonderful picture! Where did you take this? 🗺️✨`;
    }
    if (sentText.includes('👋') || sentText.includes('Hello') || sentText.includes('Hi')) {
      return `Hi there! Nice to meet you too! I'm learning Chinese, let's practice together! 🇨🇳🇺🇸`;
    }
    return `That sounds great! I'd love to discuss that more. By the way, what do you like to do on weekends?`;
  };

  // Reveal Anonymous Action
  const handleConfirmReveal = () => {
    setShowRevealConfirm(false);
    if (onRevealIdentity) {
      onRevealIdentity();
    } else {
      onChange({ isRevealed: true, hasRevealedAnonymousRelationWithThisUser: true });
    }
  };

  // Jump to Realname chat Session
  const handleJumpToRealname = () => {
    onChange({ sessionType: 'realname' });
    onShowToast('已进入实名会话', 'info');
  };

  // Message long press / action handlers
  const handleMessagePressStart = (msg: Message) => {
    const timer = setTimeout(() => {
      setSelectedMessage(msg);
    }, 600); // 600ms hold to trigger
    setLongPressTimer(timer);
  };

  const handleMessagePressEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
    }
  };

  const handleTranslateMessage = (msgId: string) => {
    setMessages(prev =>
      prev.map(m => {
        if (m.id === msgId) {
          // Mock Translate
          let translation = 'Translation pending...';
          if (m.content.includes('Hello') || m.content.includes('Hi')) {
            translation = '你好！很高兴能在这里认识你。';
          } else if (m.content.includes('sunny')) {
            translation = '嗨萨拉！今天北京阳光明媚，但有点冷。西雅图的天气怎么样？';
          } else if (m.content.includes('Beijing today')) {
            translation = '嗨安迪！谢谢你关注我。今天北京天气怎么样？';
          } else if (m.content.includes('practice')) {
            translation = '这听起来太棒了！我很想多讨论一下。顺便问一下，你周末喜欢做什么？';
          } else {
            translation = `[译]：对方发送了一条内容。让我们共同学习双语！`;
          }
          return { ...m, translatedContent: translation };
        }
        return m;
      })
    );
    setSelectedMessage(null);
    onShowToast('翻译成功 (Translated)', 'success');
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
    setSelectedMessage(null);
    onShowToast('已复制到剪贴板', 'success');
  };

  const handleCollectMessage = (msgId: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === msgId ? { ...m, isCollected: !m.isCollected } : m))
    );
    setSelectedMessage(null);
    onShowToast('已添加至收藏', 'success');
  };

  const handleDeleteMessage = (msgId: string) => {
    setMessages(prev => prev.filter(m => m.id !== msgId));
    setSelectedMessage(null);
    onShowToast('消息已删除', 'info');
  };

  const handleRecallMessage = (msgId: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === msgId
          ? {
              ...m,
              type: 'system',
              content: state.currentPerspective === 'sender' ? '你撤回了一条消息' : '对方撤回了一条消息'
            }
          : m
      )
    );
    setSelectedMessage(null);
    onShowToast('消息已撤回', 'info');
  };

  const handleTriggerCall = (callType: 'voice' | 'video') => {
    if (state.currentPerspective === 'recipient') return; // disabled
    onShowToast(`正在向 ${SARAH_PROFILE.name} 发起${callType === 'voice' ? '语音' : '视频'}通话模拟...`, 'info');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative overflow-hidden select-none">
      {/* 1. iOS Top Nav Header */}
      <div className="bg-white border-b border-gray-100 px-3 py-3.5 flex items-center justify-between text-gray-800 z-20 shadow-xs">
        <div className="flex items-center gap-1.5">
          <button onClick={onBack} className="p-1 rounded-full hover:bg-gray-100 -ml-1 text-gray-600">
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Perspective-based Target Info */}
          {state.currentPerspective === 'sender' ? (
            /* Sender views Sarah (real name, real face) */
            <div className="flex items-center gap-2">
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
                  <span className="text-xs font-bold text-gray-900">{SARAH_PROFILE.name}</span>
                  {state.sessionType === 'anonymous' && (
                    !(state.isRevealed || state.hasRevealedAnonymousRelationWithThisUser) ? (
                      <span className="bg-indigo-100 text-indigo-800 text-[8px] font-black px-1.5 py-0.2 rounded-full">
                        匿名中
                      </span>
                    ) : (
                      <span className="bg-slate-100 text-slate-505 text-[8px] font-black px-1.5 py-0.2 rounded-full border border-slate-200">
                        已解除匿名
                      </span>
                    )
                  )}
                </div>
                <span className="text-[9px] text-gray-400">在线 (Online)</span>
              </div>
            </div>
          ) : (
            (state.isRevealed || state.hasRevealedAnonymousRelationWithThisUser) ? (
              /* Recipient views Andy (Revealed/De-anonymized) */
              <div className="flex items-center gap-2">
                <img
                  src={ME_PROFILE.avatar}
                  alt={ME_PROFILE.name}
                  className="w-8 h-8 rounded-full object-cover border border-gray-100"
                />
                <div className="flex flex-col">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-gray-900">{ME_PROFILE.name}</span>
                    <span className="bg-amber-100 text-amber-850 text-[8px] font-extrabold px-1 rounded-sm">
                      PLUS
                    </span>
                  </div>
                  <span className="text-[9px] text-blue-650 font-semibold">对方已解除匿名</span>
                </div>
              </div>
            ) : (
              /* Recipient views Anonymous User (restricted) */
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">
                  {ANONYMOUS_AVATAR}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-gray-900">匿名Plus用户 {ANONYMOUS_ID_CODE}</span>
                  <span className="text-[9px] text-gray-400">无法查看其主页</span>
                </div>
              </div>
            )
          )}
        </div>

        {/* Right Header Options */}
        <div className="flex items-center gap-1">
          {/* Audio / Video buttons (only for Sender perspective, and if not revealed & not recipient) */}
          {state.currentPerspective === 'sender' && state.sessionType === 'anonymous' && !state.isRevealed && (
            <>
              <button
                onClick={() => handleTriggerCall('voice')}
                className="p-1.5 rounded-full hover:bg-gray-150 text-gray-600 transition"
                title="语音通话"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleTriggerCall('video')}
                className="p-1.5 rounded-full hover:bg-gray-150 text-gray-600 transition"
                title="视频通话"
              >
                <Video className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Right settings icon (Recipient perspective only or active) */}
          {state.currentPerspective === 'recipient' && (
            <button
              onClick={onGoToSettings}
              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition"
            >
              <Settings className="w-4.5 h-4.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Banners Display */}
      <div className="flex flex-col z-10 text-[10.5px]">
        {/* Revealed Status Banner (Recipient perspective only, and if revealed) */}
        {state.sessionType === 'anonymous' && state.currentPerspective === 'recipient' && (state.isRevealed || state.hasRevealedAnonymousRelationWithThisUser) && (
          <div className="bg-amber-50 text-amber-800 px-3.5 py-2.5 border-b border-amber-100 flex flex-col gap-1 text-[11px]">
            <div className="flex items-center gap-1.5 font-bold">
              <Shield className="w-3.5 h-3.5 text-amber-600" />
              <span>对方已解除匿名身份 (The other party has de-anonymized)</span>
            </div>
            <p className="text-gray-500 font-medium leading-relaxed text-[10px]">
              此会话为匿名期间历史会话。继续聊天请点击底部“跳转聊天”进入实名会话。
            </p>
          </div>
        )}

        {/* Risk Banner */}
        {state.sessionType === 'anonymous' ? (
          state.currentPerspective === 'sender' ? (
            <div className="bg-amber-50 text-amber-850 px-3.5 py-2 border-b border-amber-100 flex items-start gap-2 font-medium">
              <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>请在保持匿名的前提下友善交流，避免泄露个人隐私和财务信息</p>
            </div>
          ) : (
            <div className="bg-amber-50 text-amber-850 px-3.5 py-2 border-b border-amber-100 flex items-start gap-2 font-medium">
              <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p>与匿名用户聊天时，注意避免泄露个人隐私和财务信息</p>
            </div>
          )
        ) : null}

        {/* Locked Status Banner (Sender perspective only, and if not revealed) */}
        {state.sessionType === 'anonymous' && state.currentPerspective === 'sender' && !(state.isRevealed || state.hasRevealedAnonymousRelationWithThisUser) && (
          <div className="bg-indigo-50 text-indigo-850 px-3.5 py-1.5 border-b border-indigo-100 flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
            <span>你现在是匿名状态 (Your identity is protected)</span>
          </div>
        )}

        {/* Locked Status Banner (Recipient perspective only, and if not revealed) */}
        {state.sessionType === 'anonymous' && state.currentPerspective === 'recipient' && !(state.isRevealed || state.hasRevealedAnonymousRelationWithThisUser) && (
          <div className="bg-slate-100 text-slate-600 px-3.5 py-1.5 border-b border-slate-200 flex items-center gap-1.5 font-bold">
            <Lock className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span>对方处于匿名状态，你无法查看其真实主页</span>
          </div>
        )}
      </div>

      {/* 3. Messages Stream Body */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3.5">
        {/* Realname Session Information Card (only if in realname session, and had no realname session before reveal) */}
        {state.sessionType === 'realname' && state.hadRealnameSessionBeforeReveal === false && (
          <div className="bg-amber-50/70 border border-amber-100 rounded-2xl p-4 flex flex-col items-center gap-3 my-1.5 shadow-2xs">
            <div className="flex items-center gap-5">
              {/* Sender profile */}
              <div className="flex flex-col items-center gap-1">
                <img
                  src={ME_PROFILE.avatar}
                  alt={ME_PROFILE.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <span className="text-[10px] text-gray-800 font-extrabold max-w-[80px] truncate text-center">
                  {ME_PROFILE.name}
                </span>
              </div>

              {/* Linking indicator */}
              <div className="flex flex-col items-center text-amber-500">
                <div className="text-xl leading-none">🤝</div>
                <span className="text-[8px] font-black uppercase bg-amber-100/90 px-1.5 py-0.5 rounded-full text-amber-800 tracking-wider mt-1">
                  已解除匿名
                </span>
              </div>

              {/* Recipient profile */}
              <div className="flex flex-col items-center gap-1">
                <img
                  src={SARAH_PROFILE.avatar}
                  alt={SARAH_PROFILE.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-xs"
                />
                <span className="text-[10px] text-gray-800 font-extrabold max-w-[80px] truncate text-center">
                  {SARAH_PROFILE.name}
                </span>
              </div>
            </div>

            <p className="text-[10.5px] text-amber-900 font-bold text-center leading-relaxed max-w-[240px]">
              你们已解除匿名身份，现在可以用真实身份继续聊天
            </p>
          </div>
        )}

        {messages.map((msg, index) => {
          const isMe = state.currentPerspective === 'sender'
            ? msg.senderId === ME_PROFILE.id
            : msg.senderId === SARAH_PROFILE.id;
          const isSystem = msg.type === 'system' || msg.senderId === 'system';

          if (isSystem) {
            let displayContent = msg.content;
            if (msg.id === 'anon_sys_2' && state.currentPerspective === 'recipient') {
              displayContent = '对方已向你发起匿名会话。对方是匿名状态，你是实名状态，不会消耗你的匿名聊天次数。';
            } else if (msg.id === 'anon_sys_1' && state.currentPerspective === 'recipient') {
              displayContent = '与匿名用户交流时，请保持友善，避免泄露个人隐私和财务信息。';
            }
            return (
              <div key={msg.id || index} className="flex justify-center my-1.5">
                <span className="bg-gray-200/75 text-gray-500 text-[10px] px-3 py-1 rounded-full font-bold max-w-[85%] text-center">
                  {displayContent}
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id || index}
              className={`flex gap-2.5 max-w-[85%] relative ${isMe ? 'self-end flex-row-reverse' : 'self-start'}`}
            >
              {/* Profile Avatar bubble */}
              <div className="flex-shrink-0">
                {state.sessionType === 'anonymous' && !isMe && state.currentPerspective === 'recipient' ? (
                  /* Recipient views Sender */
                  (state.isRevealed || state.hasRevealedAnonymousRelationWithThisUser) ? (
                    /* Revealed Andy Avatar */
                    <div className="relative">
                      <img
                        src={ME_PROFILE.avatar}
                        alt="me"
                        className="w-8 h-8 rounded-full object-cover border border-amber-400"
                      />
                      <span className="absolute -bottom-1 -right-1 bg-amber-500 text-[8px] text-white p-0.5 rounded-full border border-white">
                        解
                      </span>
                    </div>
                  ) : (
                    /* Not revealed anonymous avatar */
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">
                      {ANONYMOUS_AVATAR}
                    </div>
                  )
                ) : state.sessionType === 'anonymous' && isMe && state.currentPerspective === 'sender' ? (
                  /* Sender views Self in anonymous session: Andy real avatar (but marked anonymous) */
                  <div className="relative">
                    <img
                      src={ME_PROFILE.avatar}
                      alt="me"
                      className="w-8 h-8 rounded-full object-cover border border-gray-100"
                    />
                    <span className="absolute -bottom-1 -right-1 bg-indigo-600 text-[8px] text-white p-0.5 rounded-full border border-white">
                      匿
                    </span>
                  </div>
                ) : (
                  /* Standard avatar */
                  <img
                    src={msg.senderAvatar || (state.currentPerspective === 'sender'
                      ? (isMe ? ME_PROFILE.avatar : SARAH_PROFILE.avatar)
                      : (isMe ? SARAH_PROFILE.avatar : ME_PROFILE.avatar))}
                    alt="avatar"
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover border border-gray-100"
                  />
                )}
              </div>

              {/* Message Details (Bubble) */}
              <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                {/* Sender name label */}
                <span className="text-[10px] text-gray-400 mb-0.5 font-medium">
                  {state.sessionType === 'anonymous' && !isMe && state.currentPerspective === 'recipient'
                    ? ((state.isRevealed || state.hasRevealedAnonymousRelationWithThisUser) ? `${ME_PROFILE.name} (对方已解除匿名)` : `匿名Plus用户 ${ANONYMOUS_ID_CODE}`)
                    : state.sessionType === 'anonymous' && isMe && state.currentPerspective === 'sender'
                    ? `我 (匿名发送)`
                    : msg.senderName}
                </span>

                {/* Bubble box wrapper */}
                <div
                  onMouseDown={() => handleMessagePressStart(msg)}
                  onMouseUp={handleMessagePressEnd}
                  onTouchStart={() => handleMessagePressStart(msg)}
                  onTouchEnd={handleMessagePressEnd}
                  onClick={() => {
                    // Clicking emoji etc is safe
                  }}
                  className={`p-3 rounded-2xl text-xs leading-relaxed font-sans shadow-2xs border cursor-pointer select-none relative group transition-all duration-150 ${
                    isMe
                      ? 'bg-indigo-600 text-white border-indigo-700 rounded-tr-none'
                      : 'bg-white text-gray-800 border-gray-200 rounded-tl-none'
                  }`}
                >
                  {/* TEXT TYPE */}
                  {msg.type === 'text' || msg.type === 'greeting' ? (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  ) : null}

                  {/* GIFT TYPE */}
                  {msg.type === 'gift' && msg.gift ? (
                    <div className="flex items-center gap-2.5 py-1 px-1 text-xs">
                      <span className="text-3xl animate-bounce">{msg.gift.icon}</span>
                      <div className="flex flex-col">
                        <span className={`font-extrabold ${isMe ? 'text-indigo-100' : 'text-gray-900'}`}>
                          赠送了 {msg.gift.name}
                        </span>
                        <span className={`text-[10px] ${isMe ? 'text-indigo-200' : 'text-amber-500 font-bold'}`}>
                          💝 积分价值: {msg.gift.points} pt
                        </span>
                      </div>
                    </div>
                  ) : null}

                  {/* VOICE TYPE */}
                  {msg.type === 'voice' ? (
                    <div className="flex items-center gap-3.5 py-1 px-1.5 cursor-pointer">
                      <Volume2 className="w-4 h-4 animate-pulse text-indigo-450" />
                      <div className="h-4 w-16 flex items-center gap-0.5">
                        <span className="h-3 w-0.5 bg-current rounded-full" />
                        <span className="h-2 w-0.5 bg-current rounded-full" />
                        <span className="h-4 w-0.5 bg-current rounded-full" />
                        <span className="h-1 w-0.5 bg-current rounded-full" />
                        <span className="h-3 w-0.5 bg-current rounded-full" />
                        <span className="h-2 w-0.5 bg-current rounded-full" />
                      </div>
                      <span className="font-mono font-bold text-[10px]">{msg.content} 秒</span>
                    </div>
                  ) : null}

                  {/* IMAGE TYPE */}
                  {msg.type === 'image' ? (
                    <div className="flex flex-col items-center p-0.5">
                      <div className="w-32 h-24 bg-slate-100 rounded-lg flex items-center justify-center border text-2xl">
                        {msg.content === '北京日落' ? '🌇' : msg.content === '美食照片' ? '🍕' : '🐾'}
                      </div>
                      <span className="text-[9px] text-gray-400 mt-1.5 font-bold">📷 {msg.content}</span>
                    </div>
                  ) : null}

                  {/* Translated Content box */}
                  {msg.translatedContent && (
                    <div className={`mt-2 pt-2 border-t text-[11px] leading-relaxed italic ${isMe ? 'border-indigo-500 text-indigo-100' : 'border-gray-150 text-gray-500'}`}>
                      {msg.translatedContent}
                    </div>
                  )}

                  {/* Show star if collected */}
                  {msg.isCollected && (
                    <Star className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 text-amber-400 fill-amber-400 bg-white rounded-full p-0.5 shadow-sm border border-amber-200" />
                  )}

                  {/* Three dots prompt on hover for PC testing */}
                  <div className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition duration-150 flex gap-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] cursor-pointer"
                       style={{ left: isMe ? '-50px' : 'auto', right: isMe ? 'auto' : '-50px' }}
                       onClick={() => setSelectedMessage(msg)}>
                    操作
                  </div>
                </div>

                {/* Sub-label indicators */}
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[8px] text-gray-300 font-mono">{msg.timestamp}</span>
                  {/* Anonymous badge on message */}
                  {state.sessionType === 'anonymous' && isMe && msg.senderIsAnonymous && (
                    <span className="text-[8px] bg-indigo-100 text-indigo-800 px-1 rounded font-bold">
                      🛡️ 匿名发送
                    </span>
                  )}
                  {/* Revealed history indicator */}
                  {(state.isRevealed || state.hasRevealedAnonymousRelationWithThisUser) && msg.senderIsAnonymous && (
                    <span className="text-[8px] bg-slate-100 text-slate-500 px-1 rounded font-bold border border-slate-200">
                      匿名期间发送
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Revealed Read-only Overlay */}
      {state.sessionType === 'anonymous' && (state.isRevealed || state.hasRevealedAnonymousRelationWithThisUser) && (
        <div className="bg-gray-100 border-t border-gray-200 py-5 px-4 flex items-center justify-center text-xs text-gray-500 font-sans z-20 shadow-xs">
          <span className="flex items-center gap-1 font-medium">
            🛡️ 你们已经解除了匿名状态，
            <button
              onClick={handleJumpToRealname}
              className="text-blue-600 hover:text-blue-700 font-bold underline cursor-pointer hover:opacity-80 transition"
            >
              跳转聊天
            </button>
          </span>
        </div>
      )}

      {/* 5. Blocked / Reported overlay */}
      {state.isBlockedByRecipient && state.currentPerspective === 'sender' && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-6 z-30">
          <div className="bg-white rounded-2xl p-5 text-center shadow-2xl border border-gray-100 max-w-[260px] flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-gray-800">无法发送消息</h4>
            <p className="text-xs text-gray-400 leading-relaxed">
              因接收方拉黑了此匿名身份，当前无法发起会话或发送新消息。
            </p>
            <button
              onClick={onBack}
              className="mt-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs py-2 px-4 rounded-xl font-bold transition w-full"
            >
              返回主页
            </button>
          </div>
        </div>
      )}

      {/* 6. Active Input Box & Drawers (Normal chat state) */}
      {!(state.sessionType === 'anonymous' && (state.isRevealed || state.hasRevealedAnonymousRelationWithThisUser)) && (
        <div className="bg-white border-t border-gray-150 flex flex-col z-20 shadow-lg">
          <div className="flex items-center gap-2 px-3 py-2.5">
            {/* Audio Voice toggle */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === 'voice' ? 'none' : 'voice')}
              className={`p-1.5 rounded-full hover:bg-gray-100 transition ${activeDrawer === 'voice' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Input field */}
            <div className="flex-1 relative flex items-center">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && inputText.trim() && handleSendMessage(inputText, 'text')}
                placeholder="Type a message"
                className="w-full bg-gray-100 border-0 rounded-full py-1.5 pl-4 pr-10 text-xs focus:ring-1 focus:ring-indigo-500 text-gray-800"
              />
              {/* Smile Emoji */}
              <button
                onClick={() => setActiveDrawer(activeDrawer === 'emoji' ? 'none' : 'emoji')}
                className={`absolute right-2.5 p-1 rounded-full hover:bg-gray-200 transition ${activeDrawer === 'emoji' ? 'text-indigo-600' : 'text-gray-400'}`}
              >
                <Smile className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Image option */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === 'image' ? 'none' : 'image')}
              className={`p-1.5 rounded-full hover:bg-gray-100 transition ${activeDrawer === 'image' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}
            >
              <ImageIcon className="w-5 h-5" />
            </button>

            {/* Gift option */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === 'gift' ? 'none' : 'gift')}
              className={`p-1.5 rounded-full hover:bg-gray-100 transition ${activeDrawer === 'gift' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}
            >
              <Gift className="w-5 h-5" />
            </button>

            {/* "+" Option Toolkit drawer */}
            <button
              onClick={() => setActiveDrawer(activeDrawer === 'plus' ? 'none' : 'plus')}
              className={`p-1.5 rounded-full hover:bg-gray-100 transition ${activeDrawer === 'plus' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-500'}`}
            >
              <Plus className="w-5 h-5" />
            </button>

            {/* Send Text Button */}
            <button
              onClick={() => inputText.trim() && handleSendMessage(inputText, 'text')}
              disabled={!inputText.trim()}
              className="p-2 rounded-full bg-indigo-600 text-white disabled:bg-gray-150 disabled:text-gray-400 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

          {/* Drawer selection render */}
          <AnimatePresence>
            {activeDrawer !== 'none' && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 160 }}
                exit={{ height: 0 }}
                className="bg-gray-50 border-t border-gray-100 overflow-y-auto"
              >
                {/* 1. Emoji Grid */}
                {activeDrawer === 'emoji' && (
                  <div className="grid grid-cols-8 gap-2 p-3 text-lg justify-items-center">
                    {EMOS.slice(0, 32).map((emo, index) => (
                      <button
                        key={index}
                        onClick={() => setInputText(prev => prev + emo)}
                        className="hover:scale-125 transition p-1"
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                )}

                {/* 2. Gift Selection */}
                {activeDrawer === 'gift' && (
                  <div className="grid grid-cols-3 gap-2.5 p-3.5">
                    {GIFT_ITEMS.map((gift) => (
                      <button
                        key={gift.id}
                        onClick={() => handleSendMessage('', 'gift', undefined, gift)}
                        className="flex flex-col items-center bg-white border border-gray-200/60 rounded-xl p-2 hover:border-indigo-500 transition shadow-2xs"
                      >
                        <span className="text-xl mb-1">{gift.icon}</span>
                        <span className="text-[10px] font-bold text-gray-800">{gift.name}</span>
                        <span className="text-[9px] text-amber-500 font-medium">{gift.points} 积分</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 3. Voice Simulated Clips */}
                {activeDrawer === 'voice' && (
                  <div className="flex flex-col gap-2 p-4 justify-center items-center h-full">
                    <p className="text-[10px] text-gray-400 font-medium mb-1">选择要发送的模拟语音消息</p>
                    <div className="flex gap-2">
                      {[
                        { label: '🎙️ 语音 (3秒)', val: 3 },
                        { label: '🎙️ 语音 (7秒)', val: 7 },
                        { label: '🎙️ 语音 (24秒)', val: 24 }
                      ].map((v, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(`${v.val}`, 'voice', v.val)}
                          className="bg-white border border-gray-200 hover:border-indigo-500 text-xs text-gray-700 font-bold px-4 py-2.5 rounded-xl transition shadow-2xs"
                        >
                          {v.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Mock Photo Select */}
                {activeDrawer === 'image' && (
                  <div className="flex flex-col gap-2 p-3 justify-center items-center h-full">
                    <p className="text-[10px] text-gray-400 font-medium">从手机相册中选择模拟图片</p>
                    <div className="flex gap-3">
                      {[
                        { icon: '🌇', label: '北京日落' },
                        { icon: '🍕', label: '美食照片' },
                        { icon: '🐾', label: '可爱宠物' }
                      ].map((img, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(img.label, 'image')}
                          className="flex flex-col items-center bg-white border border-gray-200 hover:border-indigo-500 p-2 rounded-xl text-xs transition shadow-2xs"
                        >
                          <span className="text-xl mb-1">{img.icon}</span>
                          <span className="text-[9px] text-gray-600 font-medium">{img.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Tool Kit Panel (+) */}
                {activeDrawer === 'plus' && (
                  <div className="grid grid-cols-3 gap-3 p-4">
                    {/* De-anonymize Entry (MUST be first option, and sender perspective only) */}
                    {state.sessionType === 'anonymous' && state.currentPerspective === 'sender' ? (
                      <button
                        onClick={() => {
                          setActiveDrawer('none');
                          setShowRevealConfirm(true);
                        }}
                        className="flex flex-col items-center justify-center bg-violet-50 border border-violet-200 hover:bg-violet-100 rounded-2xl p-3 text-violet-800 transition shadow-2xs"
                      >
                        <Shield className="w-5 h-5 text-violet-600 mb-1 animate-bounce" />
                        <span className="text-[10px] font-extrabold text-violet-950">解除匿名</span>
                      </button>
                    ) : (
                      /* Recipient cannot de-anonymize, show general prompt or gray entry */
                      <div className="flex flex-col items-center justify-center bg-gray-100 rounded-2xl p-3 text-gray-400 border border-gray-150">
                        <Lock className="w-5 h-5 text-gray-300 mb-1" />
                        <span className="text-[10px] font-medium">无解除权限</span>
                      </div>
                    )}

                    {/* Voice Call */}
                    <button
                      onClick={() => handleTriggerCall('voice')}
                      disabled={state.currentPerspective === 'recipient'}
                      className="flex flex-col items-center justify-center bg-white border border-gray-200 hover:border-indigo-500 rounded-2xl p-3 text-gray-700 transition shadow-2xs disabled:opacity-40 disabled:hover:border-gray-200"
                    >
                      <Phone className="w-5 h-5 text-indigo-600 mb-1" />
                      <span className="text-[10px] font-bold">语音通话</span>
                    </button>

                    {/* Video Call */}
                    <button
                      onClick={() => handleTriggerCall('video')}
                      disabled={state.currentPerspective === 'recipient'}
                      className="flex flex-col items-center justify-center bg-white border border-gray-200 hover:border-indigo-500 rounded-2xl p-3 text-gray-700 transition shadow-2xs disabled:opacity-40 disabled:hover:border-gray-200"
                    >
                      <Video className="w-5 h-5 text-blue-600 mb-1" />
                      <span className="text-[10px] font-bold">视频通话</span>
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* 7. De-anonymize Dialog Confirmation modal (Sender) */}
      <AnimatePresence>
        {showRevealConfirm && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center p-6 z-40 rounded-[40px]">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-[270px] rounded-2xl p-5 text-center shadow-2xl border border-gray-100 flex flex-col gap-4"
            >
              <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600 mx-auto">
                <AlertTriangle className="w-6 h-6 stroke-[2]" />
              </div>

              <div className="flex flex-col gap-1.5">
                <h3 className="font-sans font-extrabold text-sm text-gray-950">是否解除你的匿名身份</h3>
                <p className="text-[11px] text-gray-500 leading-relaxed px-1">
                  解除匿名身份后，对方将看到你的真实昵称与主页。此操作无法撤销。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-3">
                <button
                  onClick={() => setShowRevealConfirm(false)}
                  className="text-xs font-semibold text-gray-500 hover:text-gray-700 py-2.5 px-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition active:scale-95"
                >
                  继续匿名
                </button>
                <button
                  onClick={handleConfirmReveal}
                  className="text-xs font-bold text-white py-2.5 px-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition active:scale-95"
                >
                  解除匿名
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. Long Press Action modal */}
      <AnimatePresence>
        {selectedMessage && (
          <div className="absolute inset-0 bg-black/55 z-40 flex items-center justify-center p-5 rounded-[40px]" onClick={() => setSelectedMessage(null)}>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-[250px] rounded-2xl p-4 shadow-2xl flex flex-col gap-2"
              onClick={(e) => e.stopPropagation()} // Stop propagation to not close immediately
            >
              <div className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider text-center border-b pb-2 mb-1 border-gray-100">
                消息高级选项
              </div>

              {/* Translate button */}
              {(selectedMessage.type === 'text' || selectedMessage.type === 'greeting') && !selectedMessage.translatedContent && (
                <button
                  onClick={() => handleTranslateMessage(selectedMessage.id)}
                  className="w-full flex items-center gap-3 py-2 px-3 hover:bg-gray-50 text-xs text-gray-700 font-semibold rounded-lg transition text-left"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>翻译 (Translate)</span>
                </button>
              )}

              {/* Copy */}
              {(selectedMessage.type === 'text' || selectedMessage.type === 'greeting') && (
                <button
                  onClick={() => handleCopyMessage(selectedMessage.content)}
                  className="w-full flex items-center gap-3 py-2 px-3 hover:bg-gray-50 text-xs text-gray-700 font-semibold rounded-lg transition text-left"
                >
                  <Copy className="w-4 h-4 text-blue-600" />
                  <span>复制文字 (Copy)</span>
                </button>
              )}

              {/* Favorites (Collect) */}
              <button
                onClick={() => handleCollectMessage(selectedMessage.id)}
                className="w-full flex items-center gap-3 py-2 px-3 hover:bg-gray-50 text-xs text-gray-700 font-semibold rounded-lg transition text-left"
              >
                <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>收藏记录 (Collect)</span>
              </button>

              {/* Recall (only for messages that are sent byAndy, i.e., Me) */}
              {selectedMessage.senderId === ME_PROFILE.id && !(state.isRevealed || state.hasRevealedAnonymousRelationWithThisUser) && (
                <button
                  onClick={() => handleRecallMessage(selectedMessage.id)}
                  className="w-full flex items-center gap-3 py-2 px-3 hover:bg-gray-50 text-xs text-gray-700 font-semibold rounded-lg transition text-left"
                >
                  <Undo2 className="w-4 h-4 text-gray-500" />
                  <span>撤回消息 (Recall)</span>
                </button>
              )}

              {/* Delete */}
              <button
                onClick={() => handleDeleteMessage(selectedMessage.id)}
                className="w-full flex items-center gap-3 py-2 px-3 hover:bg-red-50 text-xs text-red-600 font-semibold rounded-lg transition text-left"
              >
                <Trash2 className="w-4 h-4 text-red-500" />
                <span>删除消息 (Delete)</span>
              </button>

              <button
                onClick={() => setSelectedMessage(null)}
                className="mt-1 w-full bg-gray-50 text-gray-400 py-2.5 text-xs font-bold rounded-lg hover:bg-gray-100 transition"
              >
                关闭菜单
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
