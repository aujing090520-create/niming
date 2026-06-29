export interface UserProfile {
  id: string;
  name: string;
  avatar: string; // URL or emoji-based visual
  gender: 'male' | 'female';
  age: number;
  nativeLang: string;
  learnLang: string;
  intro: string;
  isOnline: boolean;
  isPlus: boolean;
  region: string;
  hometown: string;
}

export type MessageType = 'text' | 'image' | 'voice' | 'gift' | 'system' | 'greeting';

export interface GiftItem {
  id: string;
  name: string;
  icon: string;
  points: number;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderIsAnonymous: boolean;
  content: string;
  type: MessageType;
  timestamp: string; // ISO string or short time e.g., "10:24 AM"
  originalContent?: string;
  translatedContent?: string;
  isCollected?: boolean;
  duration?: number; // for voice messages in seconds
  gift?: GiftItem;
}

export interface ChatSession {
  id: string; // e.g. "realname-sarah" or "anonymous-sarah"
  type: 'realname' | 'anonymous';
  targetUserId: string; // the target of this conversation (Sarah for Sender, or Sender for Sarah)
  isRevealed: boolean; // if anonymous state was removed
  messages: Message[];
  unreadCount: number;
  anonymousIdCode?: string; // e.g. "A8K2P1"
}

export interface AppState {
  isPlus: boolean; // Is current user Plus?
  anonymousTodayLeft: number; // Daily left (default 3)
  anonymousMonthLeft: number; // Monthly left (default 30)
  hasConfirmedAnonymousWarning: boolean; // Don't show modal again
  sessionType: 'realname' | 'anonymous'; // Active chat session tab/screen
  isRevealed: boolean; // Has sender revealed identity
  activeView: 'profile' | 'confirm' | 'prechat' | 'chat' | 'settings' | 'report' | 'sessions_list'; // Current phone screen
  currentPerspective: 'sender' | 'recipient'; // 'sender' (Plus user) or 'recipient' (Sarah)
  isBlockedByRecipient: boolean; // Has recipient blocked the anonymous user
  isRealnameBlockedByRecipient?: boolean; // Has recipient blocked the sender in real life
  hasReported: boolean; // Has recipient reported the anonymous user
  hasRealnameSession: boolean; // Whether realname chat session exists
  hasAnonymousSession: boolean; // Whether anonymous chat session exists
  hasRevealedAnonymousRelationWithThisUser?: boolean; // Whether sender has revealed identity to this specific recipient
}
