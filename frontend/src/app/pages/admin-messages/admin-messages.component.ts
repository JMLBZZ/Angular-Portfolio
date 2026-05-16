import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  ArchiveIcon,
  CheckCheckIcon,
  InboxIcon,
  MailIcon,
  MailOpenIcon,
  MessageSquareTextIcon,
  SendIcon,
  UserRoundIcon,
  LucideAngularModule,
} from 'lucide-angular';

type MessageStatus = 'unread' | 'read' | 'archived';

type AdminMessage = {
  id: number;
  senderName: string;
  senderEmail: string;
  subject: string;
  message: string;
  receivedAt: string;
  status: MessageStatus;
  projectType: string;
};

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './admin-messages.component.html',
})
export class AdminMessagesComponent {
  readonly InboxIcon = InboxIcon;
  readonly MailIcon = MailIcon;
  readonly MailOpenIcon = MailOpenIcon;
  readonly ArchiveIcon = ArchiveIcon;
  readonly MessageSquareTextIcon = MessageSquareTextIcon;
  readonly UserRoundIcon = UserRoundIcon;
  readonly SendIcon = SendIcon;
  readonly CheckCheckIcon = CheckCheckIcon;

  readonly messages: AdminMessage[] = [
    {
      id: 1,
      senderName: 'Exemple Client',
      senderEmail: 'client@example.com',
      subject: 'Demande de création de site vitrine',
      message:
        'Bonjour, je souhaite échanger avec vous au sujet de la création d’un site vitrine professionnel. Pouvez-vous me recontacter pour discuter du besoin ?',
      receivedAt: '2026-05-14',
      status: 'unread',
      projectType: 'Site vitrine',
    },
    {
      id: 2,
      senderName: 'Startup Demo',
      senderEmail: 'contact@startup-demo.com',
      subject: 'Application web sur mesure',
      message:
        'Nous cherchons un développeur full-stack pour créer une application métier avec tableau de bord administrateur. Votre profil semble correspondre à notre besoin.',
      receivedAt: '2026-05-12',
      status: 'read',
      projectType: 'Application web',
    },
    {
      id: 3,
      senderName: 'Association Locale',
      senderEmail: 'asso@example.org',
      subject: 'Refonte d’un site existant',
      message:
        'Notre association possède déjà un site, mais il est ancien et difficile à maintenir. Nous aimerions moderniser son design et améliorer son référencement.',
      receivedAt: '2026-05-08',
      status: 'archived',
      projectType: 'Refonte',
    },
  ];

  selectedStatus: MessageStatus | 'all' = 'all';
  selectedMessageId: number | null = this.messages[0]?.id ?? null;

  get filteredMessages(): AdminMessage[] {
    if (this.selectedStatus === 'all') {
      return this.messages;
    }

    return this.messages.filter((message) => message.status === this.selectedStatus);
  }

  get selectedMessage(): AdminMessage | undefined {
    return this.messages.find((message) => message.id === this.selectedMessageId);
  }

  get totalMessages(): number {
    return this.messages.length;
  }

  get unreadMessages(): number {
    return this.messages.filter((message) => message.status === 'unread').length;
  }

  get readMessages(): number {
    return this.messages.filter((message) => message.status === 'read').length;
  }

  get archivedMessages(): number {
    return this.messages.filter((message) => message.status === 'archived').length;
  }

  selectStatus(status: MessageStatus | 'all'): void {
    this.selectedStatus = status;

    const firstFilteredMessage = this.filteredMessages[0];

    this.selectedMessageId = firstFilteredMessage ? firstFilteredMessage.id : null;
  }

  selectMessage(message: AdminMessage): void {
    this.selectedMessageId = message.id;
  }

  getStatusLabel(status: MessageStatus): string {
    if (status === 'unread') {
      return 'Non lu';
    }

    if (status === 'read') {
      return 'Lu';
    }

    return 'Archivé';
  }
}