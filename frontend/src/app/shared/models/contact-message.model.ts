export type ContactMessageStatus = 'unread' | 'read' | 'archived';

export interface ContactMessage {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  receivedAt: string;
  readAt?: string | null;
}

export interface ContactMessageStats {
  total: number;
  unread: number;
  read: number;
  archived: number;
}