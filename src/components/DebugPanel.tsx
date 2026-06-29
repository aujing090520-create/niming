import React from 'react';
import { AppState } from '../types';
import { Shield, Sparkles, User, UserCheck, RefreshCw, AlertTriangle, MessageSquare, Flame } from 'lucide-react';

interface DebugPanelProps {
  state: AppState;
  onChange: (updates: Partial<AppState>) => void;
  onReset: () => void;
}

export default function DebugPanel({ state, onChange, onReset }: DebugPanelProps) {
  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-2xl w-full max-w-md shadow-2xl border border-slate-800 flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-indigo-500 animate-pulse" />
          <h2 className="font-sans font-bold text-lg tracking-tight text-white">HelloTalk 匿名聊天调试面板</h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 py-1.5 px-3 rounded-lg border border-slate-700 transition"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          重置 DEMO
        </button>
      </div>

      {/* View Perspective Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">切换当前视角</label>
        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-850">
          <button
            onClick={() => {
              onChange({
                currentPerspective: 'sender',
                activeView: state.activeView === 'settings' ? 'profile' : state.activeView,
              });
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition ${
              state.currentPerspective === 'sender'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <User className="w-4 h-4" />
            发起方 (Plus用户)
          </button>
          <button
            onClick={() => {
              onChange({
                currentPerspective: 'recipient',
                activeView: 'chat', // Recipient receives messages, goes to active chat
              });
            }}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition ${
              state.currentPerspective === 'recipient'
                ? 'bg-violet-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            接收方 (Sarah)
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          {state.currentPerspective === 'sender'
            ? '💡 发起方视角：可以查看他人的 Profile 并发起匿名聊天（实名或匿名），支持解除匿名。'
            : '💡 接收方视角：只能收到匿名会话（对方昵称为“匿名Plus用户 A8K2P1”），不能反向发起，不能音视频。'}
        </p>
      </div>

      <div className="h-[1px] bg-slate-800 my-1" />

      {/* Premium & Quota Adjustments */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Plus 状态 & 次数控制</h3>
        
        {/* Is Plus Toggle */}
        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-850">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <div>
              <div className="text-sm font-semibold text-white">Plus 会员身份</div>
              <div className="text-[11px] text-slate-400">非Plus用户点击匿名会触发Paywall</div>
            </div>
          </div>
          <button
            onClick={() => onChange({ isPlus: !state.isPlus })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
              state.isPlus ? 'bg-amber-500' : 'bg-slate-750'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                state.isPlus ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {/* Daily Quota Slider / Button list */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">今日匿名聊天剩余次数:</span>
            <span className="font-mono font-bold text-indigo-400">{state.anonymousTodayLeft} / 3 次</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mt-1">
            {[0, 1, 3].map((val) => (
              <button
                key={val}
                onClick={() => onChange({ anonymousTodayLeft: val })}
                className={`text-xs py-1.5 px-2 rounded-lg font-mono transition border ${
                  state.anonymousTodayLeft === val
                    ? 'bg-slate-800 text-white border-indigo-500'
                    : 'bg-slate-900 text-slate-400 border-transparent hover:bg-slate-800'
                }`}
              >
                {val} 次
              </button>
            ))}
          </div>
        </div>

        {/* Monthly Quota */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 flex flex-col gap-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-300">本月匿名聊天剩余次数:</span>
            <span className="font-mono font-bold text-amber-400">{state.anonymousMonthLeft} / 30 次</span>
          </div>
          <div className="grid grid-cols-3 gap-1.5 mt-1">
            {[0, 10, 30].map((val) => (
              <button
                key={val}
                onClick={() => onChange({ anonymousMonthLeft: val })}
                className={`text-xs py-1.5 px-2 rounded-lg font-mono transition border ${
                  state.anonymousMonthLeft === val
                    ? 'bg-slate-800 text-white border-amber-500'
                    : 'bg-slate-900 text-slate-400 border-transparent hover:bg-slate-800'
                }`}
              >
                {val} 次
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-slate-800 my-1" />

      {/* Session State Debug */}
      <div className="flex flex-col gap-3">
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">会话与状态控制</h3>

        {/* Session Status Checkboxes */}
        <div className="flex flex-col gap-2.5 bg-slate-950 p-3.5 rounded-xl border border-slate-850">
          
          {/* Exist Realname Session */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">存在已有的实名会话</span>
            <input
              type="checkbox"
              checked={state.hasRealnameSession}
              onChange={(e) => onChange({ hasRealnameSession: e.target.checked })}
              className="w-4 h-4 text-indigo-600 bg-slate-800 border-slate-700 rounded focus:ring-indigo-500"
            />
          </div>

          {/* Exist Anonymous Session */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">同方向已开启匿名会话</span>
            <input
              type="checkbox"
              checked={state.hasAnonymousSession}
              onChange={(e) => {
                const checked = e.target.checked;
                onChange({ 
                  hasAnonymousSession: checked,
                  // If enabling, also keep revealed in sync
                  isRevealed: checked ? state.isRevealed : false
                });
              }}
              className="w-4 h-4 text-indigo-600 bg-slate-800 border-slate-700 rounded focus:ring-indigo-500"
            />
          </div>

          {/* Is Revealed (De-anonymized) */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">已触发“解除匿名”</span>
            <input
              type="checkbox"
              checked={state.isRevealed}
              disabled={!state.hasAnonymousSession}
              onChange={(e) => onChange({ isRevealed: e.target.checked })}
              className="w-4 h-4 text-indigo-600 bg-slate-800 border-slate-700 rounded focus:ring-indigo-500 disabled:opacity-40"
            />
          </div>

          {/* Recipient Block State */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">接收方拉黑此匿名用户</span>
            <input
              type="checkbox"
              checked={state.isBlockedByRecipient}
              onChange={(e) => onChange({ isBlockedByRecipient: e.target.checked })}
              className="w-4 h-4 text-red-600 bg-slate-800 border-slate-700 rounded focus:ring-red-500"
            />
          </div>

          {/* Recipient Report State */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">接收方举报此匿名用户</span>
            <input
              type="checkbox"
              checked={state.hasReported}
              onChange={(e) => onChange({ hasReported: e.target.checked })}
              className="w-4 h-4 text-yellow-600 bg-slate-800 border-slate-700 rounded focus:ring-yellow-500"
            />
          </div>

          {/* Recipient Realname Block Sender */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">接收方实名拉黑了发起方</span>
            <input
              type="checkbox"
              checked={state.isRealnameBlockedByRecipient || false}
              onChange={(e) => onChange({ isRealnameBlockedByRecipient: e.target.checked })}
              className="w-4 h-4 text-red-650 bg-slate-800 border-slate-700 rounded focus:ring-red-500"
            />
          </div>

          {/* Confirmation Warning Popup Skip */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-300">勾选过“不再提示首次确认”</span>
            <input
              type="checkbox"
              checked={state.hasConfirmedAnonymousWarning}
              onChange={(e) => onChange({ hasConfirmedAnonymousWarning: e.target.checked })}
              className="w-4 h-4 text-indigo-600 bg-slate-800 border-slate-700 rounded focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Manual Actions triggers */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            if (!state.hasAnonymousSession) {
              onChange({ hasAnonymousSession: true, isRevealed: false });
            }
            onChange({ activeView: 'chat', isRevealed: true });
          }}
          disabled={!state.hasAnonymousSession || state.isRevealed}
          className="flex items-center justify-center gap-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-yellow-400 py-2.5 px-3 rounded-xl border border-slate-750 transition font-medium disabled:opacity-40"
        >
          <Shield className="w-3.5 h-3.5" />
          解密身份
        </button>
        <button
          onClick={() => onChange({ activeView: 'report' })}
          className="flex items-center justify-center gap-1.5 text-xs bg-red-950/40 hover:bg-red-950/60 text-red-400 py-2.5 px-3 rounded-xl border border-red-900/40 transition font-medium"
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          触发举报页
        </button>
      </div>
    </div>
  );
}
