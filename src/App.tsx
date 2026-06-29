import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppState, Message } from './types';
import {
  ME_PROFILE,
  SARAH_PROFILE,
  INITIAL_REALNAME_MESSAGES,
  INITIAL_ANONYMOUS_MESSAGES,
  GIFT_ITEMS
} from './data';
import DebugPanel from './components/DebugPanel';
import ProfilePage from './components/ProfilePage';
import PreChatPage from './components/PreChatPage';
import ChatPage from './components/ChatPage';
import SettingsPage from './components/SettingsPage';
import ReportPage from './components/ReportPage';
import ConfirmModal from './components/ConfirmModal';
import PaywallModal from './components/PaywallModal';
import Toast from './components/Toast';
import { Sparkles, PhoneCall, HelpCircle, Lock, ShieldCheck, HelpCircle as HelpIcon, ArrowRight, BookOpen } from 'lucide-react';

export default function App() {
  // Shared Core States
  const [state, setState] = useState<AppState>({
    isPlus: true,
    anonymousTodayLeft: 3,
    anonymousMonthLeft: 30,
    hasConfirmedAnonymousWarning: false,
    sessionType: 'anonymous',
    isRevealed: false,
    activeView: 'profile',
    currentPerspective: 'sender',
    isBlockedByRecipient: false,
    isRealnameBlockedByRecipient: false,
    hasReported: false,
    hasRealnameSession: true,
    hasAnonymousSession: false,
  });

  // Message Lists
  const [anonymousMessages, setAnonymousMessages] = useState<Message[]>([
    ...INITIAL_ANONYMOUS_MESSAGES
  ]);
  const [realnameMessages, setRealnameMessages] = useState<Message[]>([
    ...INITIAL_REALNAME_MESSAGES
  ]);

  // Toast Alerts
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Modals Visibility
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPaywallModal, setShowPaywallModal] = useState(false);
  const [showDebugDrawer, setShowDebugDrawer] = useState(false);

  const showToastMsg = (msg: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message: msg, type });
  };

  const handleStateChange = (updates: Partial<AppState>) => {
    setState(prev => {
      const next = { ...prev, ...updates };
      // Sync sessions visibility
      if (updates.hasAnonymousSession === false) {
        // If developer manually deletes anonymous session, reset related attributes
        setAnonymousMessages([...INITIAL_ANONYMOUS_MESSAGES]);
      }
      return next;
    });
  };

  // Reset demo back to initial defaults
  const handleResetDemo = () => {
    setState({
      isPlus: true,
      anonymousTodayLeft: 3,
      anonymousMonthLeft: 30,
      hasConfirmedAnonymousWarning: false,
      sessionType: 'anonymous',
      isRevealed: false,
      activeView: 'profile',
      currentPerspective: 'sender',
      isBlockedByRecipient: false,
      isRealnameBlockedByRecipient: false,
      hasReported: false,
      hasRealnameSession: true,
      hasAnonymousSession: false,
    });
    setAnonymousMessages([...INITIAL_ANONYMOUS_MESSAGES]);
    setRealnameMessages([...INITIAL_REALNAME_MESSAGES]);
    showToastMsg('DEMO 状态重置成功', 'success');
  };

  // Flow Triggers
  const handleAnonymousClick = () => {
    // 1. Entrance Checks
    if (!state.isPlus) {
      setShowPaywallModal(true);
      return;
    }

    if (state.isRevealed) {
      showToastMsg('已解除匿名状态，无法再次发起匿名聊天', 'error');
      return;
    }

    if (state.isRealnameBlockedByRecipient) {
      showToastMsg('对方已将你加入黑名单，无法发起匿名聊天。', 'error');
      return;
    }

    if (state.anonymousMonthLeft <= 0) {
      showToastMsg('本月匿名次数已用完，请下月再试', 'error');
      return;
    }

    if (state.anonymousTodayLeft <= 0) {
      showToastMsg('今日匿名次数已用完，请明天再试', 'error');
      return;
    }

    // If we already have an active anonymous conversation, go straight into it
    if (state.hasAnonymousSession) {
      handleStateChange({
        sessionType: 'anonymous',
        activeView: 'chat'
      });
      return;
    }

    // Otherwise, first-time confirmation alert check
    if (state.hasConfirmedAnonymousWarning) {
      handleStateChange({ activeView: 'prechat' });
    } else {
      setShowConfirmModal(true);
    }
  };

  const handleConfirmModalResponse = (dontShowAgain: boolean) => {
    setShowConfirmModal(false);
    handleStateChange({
      hasConfirmedAnonymousWarning: dontShowAgain,
      activeView: 'prechat'
    });
  };

  const handleStartSession = (firstMsg: { content: string; type: 'text' | 'image' | 'voice' | 'gift' | 'greeting' }) => {
    // Deduct Credit
    const todayLeft = Math.max(0, state.anonymousTodayLeft - 1);
    const monthLeft = Math.max(0, state.anonymousMonthLeft - 1);

    // Create the message content
    let content = firstMsg.content;
    if (firstMsg.type === 'gift') {
      const giftItem = GIFT_ITEMS.find(g => g.id === firstMsg.content);
      content = `赠送了 [${giftItem?.name || '礼物'}]`;
    } else if (firstMsg.type === 'voice') {
      content = `${firstMsg.content}`;
    }

    const firstRealMsg: Message = {
      id: `msg_first_${Date.now()}`,
      senderId: ME_PROFILE.id,
      senderName: '匿名Plus用户',
      senderAvatar: '🛡️',
      senderIsAnonymous: true,
      content,
      type: firstMsg.type === 'greeting' ? 'text' : firstMsg.type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      duration: firstMsg.type === 'voice' ? Number(firstMsg.content) : undefined,
      gift: firstMsg.type === 'gift' ? GIFT_ITEMS.find(g => g.id === firstMsg.content) : undefined
    };

    setAnonymousMessages(prev => [...prev, firstRealMsg]);
    handleStateChange({
      anonymousTodayLeft: todayLeft,
      anonymousMonthLeft: monthLeft,
      hasAnonymousSession: true,
      sessionType: 'anonymous',
      activeView: 'chat'
    });

    showToastMsg('首条匿名消息发送成功，消耗 1 次匿名次数！', 'success');
  };

  const handleNormalChatClick = () => {
    handleStateChange({
      sessionType: 'realname',
      activeView: 'chat'
    });
  };

  const handleGoToSettings = () => {
    handleStateChange({ activeView: 'settings' });
  };

  const handleGoToReport = () => {
    handleStateChange({ activeView: 'report' });
  };

  const handleReportSubmit = (reasons: string[], alsoBlock: boolean, comment: string) => {
    handleStateChange({
      hasReported: true,
      isBlockedByRecipient: alsoBlock,
      activeView: 'chat'
    });
    showToastMsg('举报已提交' + (alsoBlock ? '且已拉黑对方' : ''), 'success');
  };

  const handleClearHistory = () => {
    if (state.sessionType === 'anonymous') {
      setAnonymousMessages([]);
    } else {
      setRealnameMessages([]);
    }
    showToastMsg('聊天记录已清空', 'info');
  };

  const handlePaywallSuccess = () => {
    handleStateChange({ isPlus: true });
    setShowPaywallModal(false);
    showToastMsg('恭喜！成功升级为 Plus 会员，匿名额度已充值', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center font-sans select-none antialiased relative py-8 px-4">
      {/* Floating Demo Control toggle button */}
      <button
        onClick={() => setShowDebugDrawer(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-4 rounded-full shadow-lg flex items-center gap-2 text-xs transition duration-150 active:scale-95 z-50 cursor-pointer"
      >
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span>Demo 控制</span>
      </button>

      {/* Main phone body enclosing frame with iOS Dynamic Island, Notch and subtle shadow */}
      <div className="relative w-[345px] h-[720px] bg-black rounded-[42px] p-3 shadow-2xl border-[5px] border-slate-800 flex flex-col overflow-hidden ring-4 ring-slate-900/10">
        {/* iOS Dynamic Island */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-between px-2.5">
          {/* Left camera point */}
          <div className="w-2.5 h-2.5 bg-slate-900 rounded-full" />
          {/* Right speaker line */}
          <div className="w-1.5 h-1.5 bg-slate-900/40 rounded-full" />
        </div>

        {/* iOS top clock and signal icons */}
        <div className="absolute top-1.5 left-0 right-0 h-8 flex items-center justify-between px-7 z-30 pointer-events-none text-[10px] font-black text-slate-800">
          <span className="font-sans">09:41</span>
          <div className="flex items-center gap-1.5">
            {/* Simulated cellular signals */}
            <span className="text-[8px]">5G</span>
            <div className="w-3.5 h-2 border border-slate-800 rounded-xs relative flex items-center p-[1px]">
              <div className="bg-slate-800 h-full w-[80%] rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Screen Content Wrapper */}
        <div className="w-full h-full bg-white rounded-[32px] overflow-hidden flex flex-col pt-6 relative border border-gray-100">
          {/* Toast Messages Overlay */}
          <AnimatePresence>
            {toast && (
              <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast(null)}
              />
            )}
          </AnimatePresence>

          {/* Confirm warn popup modal */}
          <AnimatePresence>
            {showConfirmModal && (
              <ConfirmModal
                isOpen={showConfirmModal}
                onCancel={() => setShowConfirmModal(false)}
                onConfirm={handleConfirmModalResponse}
              />
            )}
          </AnimatePresence>

          {/* Paywall sheet */}
          <AnimatePresence>
            {showPaywallModal && (
              <PaywallModal
                isOpen={showPaywallModal}
                onClose={() => setShowPaywallModal(false)}
                onSubscribeSuccess={handlePaywallSuccess}
              />
            )}
          </AnimatePresence>

          {/* Routing View renderer */}
          <div className="flex-1 overflow-hidden relative">
            {state.activeView === 'profile' && (
              <ProfilePage
                state={state}
                onChange={handleStateChange}
                onAnonymousClick={handleAnonymousClick}
                onNormalChatClick={handleNormalChatClick}
                onOpenPaywall={() => setShowPaywallModal(true)}
              />
            )}

            {state.activeView === 'prechat' && (
              <PreChatPage
                state={state}
                onChange={handleStateChange}
                onBack={() => handleStateChange({ activeView: 'profile' })}
                onStartSession={handleStartSession}
                onErrorToast={(msg) => showToastMsg(msg, 'error')}
              />
            )}

            {state.activeView === 'chat' && (
              <ChatPage
                state={state}
                onChange={handleStateChange}
                messages={state.sessionType === 'anonymous' ? anonymousMessages : realnameMessages}
                setMessages={state.sessionType === 'anonymous' ? setAnonymousMessages : setRealnameMessages}
                onBack={() => {
                  if (state.currentPerspective === 'sender') {
                    handleStateChange({ activeView: 'profile' });
                  } else {
                    showToastMsg('接收方视角下暂未配置全局会话列表，您可通过调试面板切换回发起方。', 'info');
                  }
                }}
                onGoToSettings={handleGoToSettings}
                onShowToast={showToastMsg}
              />
            )}

            {state.activeView === 'settings' && (
              <SettingsPage
                state={state}
                onChange={handleStateChange}
                onBack={() => handleStateChange({ activeView: 'chat' })}
                onClearHistory={handleClearHistory}
                onGoToReport={handleGoToReport}
              />
            )}

            {state.activeView === 'report' && (
              <ReportPage
                onBack={() => handleStateChange({ activeView: 'settings' })}
                onSubmit={handleReportSubmit}
              />
            )}
          </div>
        </div>
      </div>

      {/* Debug Drawer Slide Over */}
      <AnimatePresence>
        {showDebugDrawer && (
          <>
            {/* Dark overlay backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDebugDrawer(false)}
              className="fixed inset-0 bg-black z-50 cursor-pointer"
            />
            {/* Drawer Container */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-slate-900 shadow-2xl z-50 overflow-y-auto flex flex-col text-slate-100"
            >
              {/* Header inside drawer */}
              <div className="flex justify-between items-center p-4 border-b border-slate-800 bg-slate-950">
                <span className="text-sm font-extrabold text-white">⚙️ 开发者演示控制台</span>
                <button
                  onClick={() => setShowDebugDrawer(false)}
                  className="text-slate-400 hover:text-white text-xs font-bold py-1 px-3 rounded bg-slate-800 transition cursor-pointer"
                >
                  关闭
                </button>
              </div>
              {/* Embedded Debug Panel */}
              <div className="p-4 flex-1">
                <DebugPanel
                  state={state}
                  onChange={handleStateChange}
                  onReset={() => {
                    handleResetDemo();
                    setShowDebugDrawer(false);
                  }}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
