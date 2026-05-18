import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ArchiveIcon,
  CheckCheckIcon,
  InboxIcon,
  MailIcon,
  MailOpenIcon,
  MessageSquareTextIcon,
  RefreshCwIcon,
  SearchIcon,
  SendIcon,
  Trash2Icon,
  UserRoundIcon,
  XIcon,
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

type BulkMessageAction = 'read' | 'unread' | 'archive';

@Component({
  selector: 'app-admin-messages',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
  readonly SearchIcon = SearchIcon;
  readonly XIcon = XIcon;

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
  selectedMessageIds = new Set<string>();

  searchDraft = '';
  searchQuery = '';

  currentPage = 0;
  pageSize = 10;
  totalElements = 0;
  totalPages = 0;

  isLoading = true;
  isLoadingDetail = false;
  isBulkActionRunning = false;
  errorMessage = '';

  actionMessageId: string | null = null;
  confirmDeleteMessageId: string | null = null;
  confirmBulkDelete = false;

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

  get selectedBulkCount(): number {
    return this.selectedMessageIds.size;
  }

  get hasBulkSelection(): boolean {
    return this.selectedBulkCount > 0;
  }

  get areAllCurrentPageMessagesSelected(): boolean {
    return this.messages.length > 0 && this.messages.every((message) => this.selectedMessageIds.has(message.id));
  }

  get isSearchActive(): boolean {
    return this.searchQuery.trim().length > 0;
  }

  get isActionLocked(): boolean {
    return this.actionMessageId !== null || this.isBulkActionRunning || this.isLoading || this.isLoadingDetail;
  }

  loadMessages(): void {
    this.isLoading = true;
    this.errorMessage = '';

    forkJoin({
      page: this.adminMessagesApi.getAll(
        this.selectedStatus,
        this.currentPage,
        this.pageSize,
        this.searchQuery
      ),
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
        this.pruneBulkSelectionToCurrentPage();
        this.syncSelectionAfterListChange();
      },
      error: (error) => {
        this.messages = [];
        this.selectedMessageId = null;
        this.selectedMessage = null;
        this.selectedMessageIds.clear();
        this.confirmBulkDelete = false;
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

  applySearch(): void {
    if (this.isLoading || this.isBulkActionRunning) {
      return;
    }

    const normalizedSearch = this.searchDraft.trim().replace(/\s+/g, ' ');

    if (normalizedSearch === this.searchQuery && this.currentPage === 0) {
      return;
    }

    this.searchQuery = normalizedSearch;
    this.currentPage = 0;
    this.confirmDeleteMessageId = null;
    this.clearBulkSelection();
    this.loadMessages();
  }

  clearSearch(): void {
    if (this.isLoading || this.isBulkActionRunning) {
      return;
    }

    this.searchDraft = '';
    this.searchQuery = '';
    this.currentPage = 0;
    this.confirmDeleteMessageId = null;
    this.clearBulkSelection();
    this.loadMessages();
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
    this.clearBulkSelection();
    this.loadMessages();
  }

  previousPage(): void {
    if (!this.hasPreviousPage || this.isLoading) {
      return;
    }

    this.currentPage -= 1;
    this.confirmDeleteMessageId = null;
    this.clearBulkSelection();
    this.loadMessages();
  }

  nextPage(): void {
    if (!this.hasNextPage || this.isLoading) {
      return;
    }

    this.currentPage += 1;
    this.confirmDeleteMessageId = null;
    this.clearBulkSelection();
    this.loadMessages();
  }

  selectMessage(message: ContactMessage): void {
    this.selectedMessageId = message.id;
    this.selectedMessage = message;
    this.confirmDeleteMessageId = null;
    this.loadMessageDetail(message.id);
  }

  toggleMessageSelection(messageId: string, event?: Event): void {
    event?.stopPropagation();

    if (this.selectedMessageIds.has(messageId)) {
      this.selectedMessageIds.delete(messageId);
    } else {
      this.selectedMessageIds.add(messageId);
    }

    this.confirmBulkDelete = false;
  }

  toggleSelectCurrentPage(): void {
    if (this.messages.length === 0 || this.isActionLocked) {
      return;
    }

    if (this.areAllCurrentPageMessagesSelected) {
      this.messages.forEach((message) => this.selectedMessageIds.delete(message.id));
    } else {
      this.messages.forEach((message) => this.selectedMessageIds.add(message.id));
    }

    this.confirmBulkDelete = false;
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

  bulkMarkAsRead(): void {
    this.runBulkStatusAction('read');
  }

  bulkMarkAsUnread(): void {
    this.runBulkStatusAction('unread');
  }

  bulkArchive(): void {
    this.runBulkStatusAction('archive');
  }

  requestBulkDelete(): void {
    if (!this.hasBulkSelection || this.isActionLocked) {
      return;
    }

    this.confirmBulkDelete = true;
  }

  cancelBulkDelete(): void {
    if (this.isActionLocked) {
      return;
    }

    this.confirmBulkDelete = false;
  }

  confirmBulkDeleteSelectedMessages(): void {
    if (!this.hasBulkSelection || !this.confirmBulkDelete || this.isActionLocked) {
      return;
    }

    const ids = this.getSelectedIds();
    const deletedCount = ids.length;

    this.isBulkActionRunning = true;
    this.errorMessage = '';

    this.adminMessagesApi.bulkDelete(ids).subscribe({
      next: () => {
        this.isBulkActionRunning = false;
        this.confirmBulkDelete = false;
        this.clearBulkSelection();

        if (this.selectedMessageId && ids.includes(this.selectedMessageId)) {
          this.selectedMessageId = null;
          this.selectedMessage = null;
        }

        this.toastService.success(`${deletedCount} message(s) supprimé(s).`);
        this.reloadCurrentPageAfterDelete(deletedCount);
      },
      error: (error) => {
        this.errorMessage = extractApiErrorMessage(
          error,
          'La suppression groupée des messages a échoué.'
        );
        this.toastService.error(this.errorMessage);
        this.isBulkActionRunning = false;
      },
    });
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
        this.selectedMessageIds.delete(id);
        this.toastService.success('Message supprimé.');
        this.reloadCurrentPageAfterDelete(1);
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

  getFilterLabel(status: ContactMessageFilter): string {
    if (status === 'all') {
      return 'Tous';
    }

    return this.getStatusLabel(status);
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

  isMessageChecked(messageId: string): boolean {
    return this.selectedMessageIds.has(messageId);
  }

  getMessageCardClasses(message: ContactMessage): string[] {
    const isDetailSelected = this.selectedMessageId === message.id;
    const isBulkSelected = this.isMessageChecked(message.id);

    if (isDetailSelected || isBulkSelected) {
      return [
        'border-primary/70',
        'bg-primary/10',
        'text-foreground',
        'shadow-soft',
        'dark:bg-primary/15',
        'dark:text-foreground',
      ];
    }

    return [
      'border-border/70',
      'bg-background/70',
      'text-foreground',
      'hover:bg-card/90',
      'dark:hover:bg-muted/80',
    ];
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

  private runBulkStatusAction(action: BulkMessageAction): void {
    if (!this.hasBulkSelection || this.isActionLocked) {
      return;
    }

    const ids = this.getSelectedIds();
    const request$ = this.buildBulkStatusRequest(action, ids);
    const successMessage = this.getBulkSuccessMessage(action, ids.length);

    this.isBulkActionRunning = true;
    this.errorMessage = '';

    request$.subscribe({
      next: () => {
        this.isBulkActionRunning = false;
        this.confirmBulkDelete = false;
        this.clearBulkSelection();
        this.toastService.success(successMessage);
        this.loadMessages();
      },
      error: (error) => {
        this.errorMessage = extractApiErrorMessage(
          error,
          'La mise à jour groupée des messages a échoué.'
        );
        this.toastService.error(this.errorMessage);
        this.isBulkActionRunning = false;
      },
    });
  }

  private buildBulkStatusRequest(
    action: BulkMessageAction,
    ids: string[]
  ): Observable<ContactMessage[]> {
    if (action === 'read') {
      return this.adminMessagesApi.bulkMarkAsRead(ids);
    }

    if (action === 'unread') {
      return this.adminMessagesApi.bulkMarkAsUnread(ids);
    }

    return this.adminMessagesApi.bulkArchive(ids);
  }

  private getBulkSuccessMessage(action: BulkMessageAction, count: number): string {
    if (action === 'read') {
      return `${count} message(s) marqué(s) comme lu(s).`;
    }

    if (action === 'unread') {
      return `${count} message(s) marqué(s) comme non lu(s).`;
    }

    return `${count} message(s) archivé(s).`;
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

  private reloadCurrentPageAfterDelete(deletedCount: number): void {
    const remainingElements = Math.max(this.totalElements - deletedCount, 0);
    const maxPageAfterDelete = remainingElements === 0
      ? 0
      : Math.ceil(remainingElements / this.pageSize) - 1;

    if (this.currentPage > maxPageAfterDelete) {
      this.currentPage = maxPageAfterDelete;
    }

    this.loadMessages();
  }

  private getSelectedIds(): string[] {
    return Array.from(this.selectedMessageIds);
  }

  private clearBulkSelection(): void {
    this.selectedMessageIds.clear();
    this.confirmBulkDelete = false;
  }

  private pruneBulkSelectionToCurrentPage(): void {
    const currentPageIds = new Set(this.messages.map((message) => message.id));

    this.selectedMessageIds = new Set(
      Array.from(this.selectedMessageIds).filter((id) => currentPageIds.has(id))
    );

    if (this.selectedMessageIds.size === 0) {
      this.confirmBulkDelete = false;
    }
  }
}