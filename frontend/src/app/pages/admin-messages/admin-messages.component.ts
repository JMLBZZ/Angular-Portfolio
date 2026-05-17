import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  ArchiveIcon,
  CheckCheckIcon,
  InboxIcon,
  MailIcon,
  MailOpenIcon,
  MessageSquareTextIcon,
  RefreshCwIcon,
  SendIcon,
  Trash2Icon,
  UserRoundIcon,
  LucideAngularModule,
} from 'lucide-angular';
import { forkJoin, Observable } from 'rxjs';

import {
  AdminMessagesApiService,
  ContactMessageFilter,
} from '../../core/api/admin-messages-api.service';
import { extractApiErrorMessage } from '../../core/api/api-error.utils';
import {
  ContactMessage,
  ContactMessageStats,
  ContactMessageStatus,
} from '../../shared/models/contact-message.model';
import { ToastService } from '../../shared/services/toast.service';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [
    CommonModule,
    LucideAngularModule,
  ],
  templateUrl: './admin-messages.component.html',
})
export class AdminMessagesComponent implements OnInit {
  readonly InboxIcon = InboxIcon;
  readonly MailIcon = MailIcon;
  readonly MailOpenIcon = MailOpenIcon;
  readonly ArchiveIcon = ArchiveIcon;
  readonly MessageSquareTextIcon = MessageSquareTextIcon;
  readonly UserRoundIcon = UserRoundIcon;
  readonly SendIcon = SendIcon;
  readonly CheckCheckIcon = CheckCheckIcon;
  readonly Trash2Icon = Trash2Icon;
  readonly RefreshCwIcon = RefreshCwIcon;

  messages: ContactMessage[] = [];
  stats: ContactMessageStats = {
    total: 0,
    unread: 0,
    read: 0,
    archived: 0,
  };

  selectedStatus: ContactMessageFilter = 'all';
  selectedMessageId: string | null = null;
  selectedMessage: ContactMessage | null = null;

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  isLoading = true;
  isLoadingDetail = false;
  errorMessage = '';

  actionMessageId: string | null = null;
  confirmDeleteMessageId: string | null = null;

  constructor(
    private adminMessagesApi: AdminMessagesApiService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  get totalMessages(): number {
    return this.stats.total;
  }

  get unreadMessages(): number {
    return this.stats.unread;
  }

  get readMessages(): number {
    return this.stats.read;
  }

  get archivedMessages(): number {
    return this.stats.archived;
  }

  get currentPageDisplay(): number {
    if (this.totalPages === 0) {
      return 0;
    }

    return this.currentPage + 1;
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 0;
  }

  get hasNextPage(): boolean {
    return this.currentPage + 1 < this.totalPages;
  }

  get isActionLocked(): boolean {
    return this.actionMessageId !== null || this.isLoading || this.isLoadingDetail;
  }

  loadMessages(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      page: this.adminMessagesApi.getAll(this.selectedStatus, this.currentPage, this.pageSize),
      stats: this.adminMessagesApi.getStats(),
    }).subscribe({
      next: ({ page, stats }) => {
        this.messages = page.data ?? [];
        this.stats = stats;
        this.totalElements = page.meta?.totalElements ?? this.messages.length;
        this.totalPages = page.meta?.totalPages ?? 1;
        this.currentPage = page.meta?.page ?? this.currentPage;
        this.pageSize = page.meta?.size ?? this.pageSize;
        this.isLoading = false;
        this.syncSelectionAfterListChange();
      },
      error: (error) => {
        this.messages = [];
        this.selectedMessageId = null;
        this.selectedMessage = null;
        this.totalElements = 0;
        this.totalPages = 0;
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible de charger les messages de contact.'
        );
        this.toastService.error(this.errorMessage);
        this.isLoading = false;
      },
    });
  }

  selectStatus(status: ContactMessageFilter): void {
    if (this.selectedStatus === status && !this.isLoading) {
      return;
    }

    this.selectedStatus = status;
    this.currentPage = 0;
    this.confirmDeleteMessageId = null;
    this.selectedMessageId = null;
    this.selectedMessage = null;
    this.loadMessages();
  }

  previousPage(): void {
    if (!this.hasPreviousPage || this.isLoading) {
      return;
    }

    this.currentPage -= 1;
    this.confirmDeleteMessageId = null;
    this.loadMessages();
  }

  nextPage(): void {
    if (!this.hasNextPage || this.isLoading) {
      return;
    }

    this.currentPage += 1;
    this.confirmDeleteMessageId = null;
    this.loadMessages();
  }

  selectMessage(message: ContactMessage): void {
    this.selectedMessageId = message.id;
    this.selectedMessage = message;
    this.confirmDeleteMessageId = null;
    this.loadMessageDetail(message.id);
  }

  markSelectedAsRead(): void {
    if (!this.selectedMessage || this.selectedMessage.status === 'read' || this.isActionLocked) {
      return;
    }

    this.updateSelectedMessageStatus(
      this.selectedMessage.id,
      this.adminMessagesApi.markAsRead(this.selectedMessage.id),
      'Message marqué comme lu.'
    );
  }

  markSelectedAsUnread(): void {
    if (!this.selectedMessage || this.selectedMessage.status === 'unread' || this.isActionLocked) {
      return;
    }

    this.updateSelectedMessageStatus(
      this.selectedMessage.id,
      this.adminMessagesApi.markAsUnread(this.selectedMessage.id),
      'Message marqué comme non lu.'
    );
  }

  archiveSelectedMessage(): void {
    if (!this.selectedMessage || this.selectedMessage.status === 'archived' || this.isActionLocked) {
      return;
    }

    this.updateSelectedMessageStatus(
      this.selectedMessage.id,
      this.adminMessagesApi.archive(this.selectedMessage.id),
      'Message archivé.'
    );
  }

  requestDeleteSelectedMessage(): void {
    if (!this.selectedMessage || this.isActionLocked) {
      return;
    }

    this.confirmDeleteMessageId = this.selectedMessage.id;
  }

  cancelDelete(): void {
    if (this.isActionLocked) {
      return;
    }

    this.confirmDeleteMessageId = null;
  }

  confirmDeleteSelectedMessage(): void {
    if (!this.selectedMessage || this.confirmDeleteMessageId !== this.selectedMessage.id || this.isActionLocked) {
      return;
    }

    const id = this.selectedMessage.id;

    this.actionMessageId = id;
    this.errorMessage = '';

    this.adminMessagesApi.delete(id).subscribe({
      next: () => {
        this.actionMessageId = null;
        this.confirmDeleteMessageId = null;
        this.selectedMessageId = null;
        this.selectedMessage = null;
        this.toastService.success('Message supprimé.');
        this.reloadCurrentPageAfterDelete();
      },
      error: (error) => {
        this.errorMessage = extractApiErrorMessage(
          error,
          'La suppression du message a échoué.'
        );
        this.toastService.error(this.errorMessage);
        this.actionMessageId = null;
      },
    });
  }

  getStatusLabel(status: ContactMessageStatus): string {
    if (status === 'unread') {
      return 'Non lu';
    }

    if (status === 'read') {
      return 'Lu';
    }

    return 'Archivé';
  }

  formatDate(value: string | null | undefined): string {
    if (!value) {
      return 'Date inconnue';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('fr-FR', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }

  getReplyLink(message: ContactMessage): string {
    const subject = encodeURIComponent(`Re: ${message.subject}`);
    return `mailto:${message.senderEmail}?subject=${subject}`;
  }

  trackByMessageId(_: number, message: ContactMessage): string {
    return message.id;
  }

  private loadMessageDetail(id: string): void {
    this.isLoadingDetail = true;
    this.errorMessage = '';

    this.adminMessagesApi.getById(id).subscribe({
      next: (message) => {
        this.upsertMessage(message);

        if (this.selectedMessageId === message.id) {
          this.selectedMessage = message;
        }

        this.isLoadingDetail = false;
      },
      error: (error) => {
        this.errorMessage = extractApiErrorMessage(
          error,
          'Impossible de charger le détail du message.'
        );
        this.toastService.error(this.errorMessage);
        this.isLoadingDetail = false;
      },
    });
  }

  private updateSelectedMessageStatus(
    id: string,
    request$: Observable<ContactMessage>,
    successMessage: string
  ): void {
    this.actionMessageId = id;
    this.errorMessage = '';

    request$.subscribe({
      next: () => {
        this.actionMessageId = null;
        this.confirmDeleteMessageId = null;
        this.toastService.success(successMessage);
        this.loadMessages();
      },
      error: (error) => {
        this.errorMessage = extractApiErrorMessage(
          error,
          'La mise à jour du message a échoué.'
        );
        this.toastService.error(this.errorMessage);
        this.actionMessageId = null;
      },
    });
  }

  private upsertMessage(updatedMessage: ContactMessage): void {
    const index = this.messages.findIndex((message) => message.id === updatedMessage.id);

    if (index === -1) {
      this.messages = [updatedMessage, ...this.messages];
      return;
    }

    this.messages = this.messages.map((message) =>
      message.id === updatedMessage.id ? updatedMessage : message
    );
  }

  private syncSelectionAfterListChange(): void {
    if (
      this.selectedMessageId &&
      this.messages.some((message) => message.id === this.selectedMessageId)
    ) {
      this.selectedMessage = this.messages.find((message) => message.id === this.selectedMessageId) ?? null;
      return;
    }

    const firstMessage = this.messages[0];

    if (firstMessage) {
      this.selectedMessageId = firstMessage.id;
      this.selectedMessage = firstMessage;
      return;
    }

    this.selectedMessageId = null;
    this.selectedMessage = null;
  }

  private reloadCurrentPageAfterDelete(): void {
    const remainingElements = Math.max(this.totalElements - 1, 0);
    const maxPageAfterDelete = remainingElements === 0
      ? 0
      : Math.ceil(remainingElements / this.pageSize) - 1;

    if (this.currentPage > maxPageAfterDelete) {
      this.currentPage = maxPageAfterDelete;
    }

    this.loadMessages();
  }
}