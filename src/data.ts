import { UserProfile, GiftItem, Message } from './types';

export const ME_PROFILE: UserProfile = {
  id: 'me_andy',
  name: 'Andy (安迪)',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  gender: 'male',
  age: 24,
  nativeLang: '中文 (Chinese)',
  learnLang: '英语 (English)',
  intro: '想练习口语，喜欢音乐、摄影和徒步！让我们互相学习吧。✍️ Looking for language partners to improve my speaking!',
  isOnline: true,
  isPlus: true,
  region: '中国北京',
  hometown: '西安'
};

export const SARAH_PROFILE: UserProfile = {
  id: 'sarah_target',
  name: 'Sarah Becker',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
  gender: 'female',
  age: 22,
  nativeLang: '英语 (English)',
  learnLang: '中文 (Chinese)',
  intro: 'I love learning languages and traveling. Living in Seattle. Let\'s exchange English & Chinese! 🇨🇳🇺🇸',
  isOnline: true,
  isPlus: false,
  region: '美国西雅图',
  hometown: '旧金山'
};

export const ANONYMOUS_AVATAR = '🛡️'; // Or a specialized icon
export const ANONYMOUS_ID_CODE = 'A8K2P1';

export const GIFT_ITEMS: GiftItem[] = [
  { id: 'gift_rose', name: '红玫瑰', icon: '🌹', points: 5 },
  { id: 'gift_coffee', name: '暖心咖啡', icon: '☕', points: 15 },
  { id: 'gift_boba', name: '珍珠奶茶', icon: '🧋', points: 25 },
  { id: 'gift_bear', name: '泰迪熊', icon: '🧸', points: 99 },
  { id: 'gift_crown', name: '尊贵王冠', icon: '👑', points: 299 },
  { id: 'gift_fireworks', name: '梦幻烟花', icon: '🎆', points: 520 },
];

export const EMOS = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠', '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🤗', '🤔', '🫣', '🤭', '🤫', '🤥', '😶', '😐', '😑', '😬', '🫠', '🙄', '😯', '😦', '😧', '😮', '😲', '🥱', '😴', '🤤', '😪', '😵', '😵‍💫', '🤐', '🥴', '🤢', '🤮', '🤧', '😷', '🤒', '🤕', '🤑', '🤠'];

export const SAMPLE_GREETINGS = [
  '👋 Hello! Nice to meet you here.',
  '💬 Hey Sarah, I saw we share the same hobbies! Let\'s chat!',
  '🌍 Hello from Beijing! I would love to help you with your Chinese!',
  '📚 Hi! Your intro sounds great. Let\'s practice language exchange.'
];

export const INITIAL_REALNAME_MESSAGES: Message[] = [
  {
    id: 'rn_1',
    senderId: 'sarah_target',
    senderName: 'Sarah Becker',
    senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    senderIsAnonymous: false,
    content: 'Hi Andy! Thanks for following me. How is Beijing today?',
    type: 'text',
    timestamp: '昨天 14:32',
    originalContent: 'Hi Andy! Thanks for following me. How is Beijing today?',
    translatedContent: '嗨安迪！谢谢你关注我。今天北京怎么样？'
  },
  {
    id: 'rn_2',
    senderId: 'me_andy',
    senderName: 'Andy (安迪)',
    senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    senderIsAnonymous: false,
    content: 'Hi Sarah! Beijing is sunny today but a bit cold. How is the weather in Seattle?',
    type: 'text',
    timestamp: '昨天 14:35'
  }
];

export const INITIAL_ANONYMOUS_MESSAGES: Message[] = [
  {
    id: 'anon_sys_1',
    senderId: 'system',
    senderName: '系统提示',
    senderAvatar: '',
    senderIsAnonymous: false,
    content: '请在保持匿名的前提下友善交流，避免泄露个人隐私和财务信息。',
    type: 'system',
    timestamp: '10:20 AM'
  },
  {
    id: 'anon_sys_2',
    senderId: 'system',
    senderName: '系统提示',
    senderAvatar: '',
    senderIsAnonymous: false,
    content: '匿名会话创建成功。你现在是匿名状态，发送第一条消息成功，已扣减 1 次匿名聊天次数。',
    type: 'system',
    timestamp: '10:20 AM'
  }
];
