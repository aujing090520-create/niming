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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans select-none antialiased md:p-8">
      {/* Top Banner & Introduction */}
      <header className="max-w-7xl w-full mx-auto mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-indigo-600 text-white text-[10px] font-black tracking-wider uppercase px-2.5 py-0.5 rounded-md shadow-lg shadow-indigo-600/20">
              HELLOTALK CLONE
            </span>
            <span className="text-xs text-slate-400 font-mono">V1.0.4 PROTOTYPE</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1">
            Plus 用户 Profile 匿名聊天原型
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            此 DEMO 完整展示了 Plus 会员查看他人 Profile、匿名发起会话、次数自动扣除、解除匿名身份并归档、以及接收方查看匿名、拉黑/举报等核心业务链路。
          </p>
        </div>

        {/* Header Badges Grid */}
        <div className="flex flex-wrap gap-2 text-[11px] font-medium">
          <div className="bg-slate-900 border border-slate-800 rounded-lg py-1 px-3 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-amber-500 rounded-full" />
            <span className="text-slate-300">额度：每日3次 / 每月30次</span>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg py-1 px-3 flex items-center gap-1.5">
            <span className="w-2 h-2 bg-indigo-500 rounded-full" />
            <span className="text-slate-300">支持：解除匿名、长按翻译、礼物打招呼</span>
          </div>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="max-w-7xl w-full mx-auto flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 px-4 items-start">
        {/* Left Side: Debug and Help Description */}
        <section className="lg:col-span-5 flex flex-col gap-6 w-full">
          {/* Debug panel */}
          <DebugPanel
            state={state}
            onChange={handleStateChange}
            onReset={handleResetDemo}
          />

          {/* Interactive Tutorial Rules checklist */}
          <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 flex flex-col gap-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-500" />
              互动演示指南（点击调试面板测试）
            </h3>
            <div className="flex flex-col gap-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-[10px] mt-0.5">1</div>
                <p>
                  <strong>切换普通用户：</strong>在调试面板关闭 “Plus 会员身份”。返回手机点击右上的“更多” ➔ “匿名聊天”，将弹出高保真 <strong>Plus 购买弹窗</strong>。开通后可以再次点击匿名。
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-[10px] mt-0.5">2</div>
                <p>
                  <strong>次数不足阻断：</strong>把 “今日剩余次数” 设为 0。点击匿名进入拟聊天页，发送第一条消息时会弹出 <strong>“今日次数已用完”</strong> 的拦截提示。
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-[10px] mt-0.5">3</div>
                <p>
                  <strong>解除匿名归档：</strong>在对话页（发起方视角），点击输入框旁的 <strong>「+」</strong> 并点击第一个 <strong>「解除匿名」</strong>，确认后该匿名聊天归档禁用，并支持一键跳转到<strong>实名会话</strong>！
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="w-4 h-4 rounded bg-indigo-950 text-indigo-400 flex items-center justify-center font-bold text-[10px] mt-0.5">4</div>
                <p>
                  <strong>多端视角测试：</strong>切换到 <strong>“接收方视角”</strong>。你会瞬间以 Sarah 视角看到完全匿名化的对方，右上角设置菜单能触发<strong>拉黑、投诉</strong>流程。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Side: Phone frame simulator enclosing HelloTalk prototype */}
        <section className="lg:col-span-7 flex justify-center w-full relative">
          {/* Main phone body enclosing frame with iOS Dynamic Island, Notch and subtle shadow */}
          <div className="relative w-[345px] h-[720px] bg-black rounded-[42px] p-3 shadow-2xl border-[5px] border-slate-800 flex flex-col overflow-hidden ring-4 ring-slate-900/60">
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
        </section>
      </main>

      {/* Dynamic persistent footer */}
      <footer className="mt-12 mb-4 border-t border-slate-900 pt-6 text-center text-xs text-slate-500 max-w-7xl mx-auto w-full px-4">
        <p>HelloTalk Clone - High-fidelity User Profile Anonymous Invitation Interaction Prototype.</p>
        <p className="mt-1">Built with React, Vite, Tailwind CSS, Lucide Icons, and Motion animations.</p>
      </footer>
    </div>
  );
}
