import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Crown, Check, X, ShieldAlert, Award, MessageCircleHeart } from 'lucide-react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribeSuccess: () => void;
}

export default function PaywallModal({ isOpen, onClose, onSubscribeSuccess }: PaywallModalProps) {
  if (!isOpen) return null;

  const benefits = [
    { title: '匿名聊天特权', desc: '每日 3 次、每月 30 次匿名发起机会，具体次数以当前配置为准' },
    { title: '尊贵 Plus 标识', desc: '专属金冠与尊贵尊享卡片样式' },
    { title: '多语种翻译无限次', desc: '畅享高级实时翻译与语音转文本服务' },
    { title: '专属推荐权重', desc: '主页曝光率提升 3 倍，结识更多语伴' }
  ];

  const handleSubscribe = () => {
    onSubscribeSuccess();
  };

  return (
    <div className="absolute inset-0 z-50 bg-black/60 flex items-end justify-center rounded-[40px] overflow-hidden">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="relative bg-white w-full rounded-t-[32px] p-6 max-h-[85%] overflow-y-auto z-10 shadow-2xl flex flex-col"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header decoration */}
        <div className="flex flex-col items-center text-center mt-3 mb-5">
          <div className="w-14 h-14 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/20 mb-3 animate-bounce">
            <Crown className="w-7 h-7 text-white" />
          </div>
          <h3 className="font-sans font-extrabold text-xl text-gray-900 tracking-tight flex items-center gap-1.5">
            开通 <span className="text-amber-500">HelloTalk Plus</span> 会员
          </h3>
          <p className="text-xs text-gray-500 mt-1">解锁匿名聊天特权，开启全新交流体验</p>
        </div>

        {/* Benefits List */}
        <div className="flex flex-col gap-3.5 mb-6">
          {benefits.map((b, index) => (
            <div key={index} className="flex gap-3 bg-amber-50/40 p-3 rounded-xl border border-amber-100/50">
              <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">{b.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Plans Selection */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="border-2 border-amber-500 bg-amber-50/20 p-4 rounded-2xl relative">
            <span className="absolute top-0 right-0 bg-amber-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-sm">
              最受欢迎
            </span>
            <div className="text-xs text-amber-800 font-bold">12个月订阅</div>
            <div className="text-2xl font-extrabold text-gray-900 mt-1">¥258<span className="text-xs font-normal text-gray-500">/年</span></div>
            <div className="text-[10px] text-gray-400 mt-1 line-through">原价 ¥388</div>
          </div>

          <div className="border border-gray-200 hover:border-amber-300 p-4 rounded-2xl cursor-pointer bg-white transition">
            <div className="text-xs text-gray-600 font-bold">1个月订阅</div>
            <div className="text-2xl font-extrabold text-gray-900 mt-1">¥30<span className="text-xs font-normal text-gray-500">/月</span></div>
            <div className="text-[10px] text-gray-400 mt-1">自动续费可随时取消</div>
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSubscribe}
          className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3.5 rounded-full font-bold text-sm shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 active:scale-95 duration-150"
        >
          <Sparkles className="w-4 h-4" />
          立即开通 • 享匿名对话
        </button>

        <p className="text-[10px] text-center text-gray-400 mt-3 leading-relaxed">
          购买即代表您同意《服务协议》与《隐私政策》。订阅会自动续期，可随时在 App Store 账户设置中取消。
        </p>
      </motion.div>
    </div>
  );
}
