import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CircleMessage } from '../../Models/circle-message.model';
import { CircleMessageService } from '../../Services/circle-message.service';
import {
  ChatConnectionState,
  CircleChatSignalrService,
} from '../../Services/circle-chat-signalr.service';

import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-circle-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, AvatarComponent],
  templateUrl: './circle-chat.component.html',
  styleUrls: ['./circle-chat.component.css'],
})
export class CircleChatComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input({ required: true }) circleId!: string;
  @Input() currentUserName = '';

  @ViewChild('messagesContainer') messagesContainer?: ElementRef<HTMLDivElement>;

  private messageService = inject(CircleMessageService);
  private signalrService = inject(CircleChatSignalrService);
  private cdr = inject(ChangeDetectorRef);
  private destroy$ = new Subject<void>();

  messages: CircleMessage[] = [];
  newMessageContent = '';
  connectionState: ChatConnectionState = 'disconnected';
  userStatusMap: Map<string, { isOnline: boolean; lastSeen?: string }> = new Map();

  isLoading = true;
  isSending = false;
  isLoadingMore = false;
  hasMore = false;
  errorMessage = '';

  editingMessageId: string | null = null;
  editContent = '';

  typingUserName = '';
  private typingTimeout: ReturnType<typeof setTimeout> | null = null;
  private lastTypingSentAt = 0;

  private pageNumber = 1;
  private readonly pageSize = 50;
  private shouldScrollToBottom = false;

  ngOnInit(): void {
    this.loadMessages();
    this.connectToHub();
    this.subscribeToRealtimeEvents();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.signalrService.disconnect();
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
  }

  private loadMessages(): void {
    this.isLoading = true;
    this.messageService
      .getMessages(this.circleId, this.pageNumber, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.succeeded && result.data) {
            this.messages = result.data.messages;
            this.hasMore = result.data.hasMore;
            this.shouldScrollToBottom = true;
          } else {
            this.errorMessage = result.errorMessage || 'حدث خطأ أثناء تحميل الرسائل';
          }
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'حدث خطأ أثناء تحميل الرسائل';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  loadOlderMessages(): void {
    if (this.isLoadingMore || !this.hasMore) return;

    this.isLoadingMore = true;
    const nextPage = this.pageNumber + 1;

    this.messageService
      .getMessages(this.circleId, nextPage, this.pageSize)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.succeeded && result.data) {
            this.messages = [...result.data.messages, ...this.messages];
            this.hasMore = result.data.hasMore;
            this.pageNumber = nextPage;
          }
          this.isLoadingMore = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.isLoadingMore = false;
          this.cdr.detectChanges();
        },
      });
  }

  private async connectToHub(): Promise<void> {
    this.signalrService.connectionState$
      .pipe(takeUntil(this.destroy$))
      .subscribe((state) => (this.connectionState = state));

    try {
      await this.signalrService.connect(this.circleId);
      const onlineUsers = await this.signalrService.getOnlineUsers();
      onlineUsers.forEach(userId => {
        this.userStatusMap.set(userId, { isOnline: true });
      });
      this.cdr.detectChanges();
    } catch {
      this.errorMessage = 'تعذر الاتصال بالمحادثة المباشرة';
    }
  }

  private subscribeToRealtimeEvents(): void {
    this.signalrService.messageReceived$
      .pipe(takeUntil(this.destroy$))
      .subscribe((message) => {
        if (message.circleId !== this.circleId) return;
        if (this.messages.some((m) => m.id === message.id)) return;
        this.messages = [...this.messages, message];
        this.shouldScrollToBottom = true;
        this.cdr.detectChanges();
      });

    this.signalrService.messageEdited$
      .pipe(takeUntil(this.destroy$))
      .subscribe((message) => {
        if (message.circleId !== this.circleId) return;
        this.messages = this.messages.map((m) =>
          m.id === message.id ? { ...m, content: message.content, updatedAt: message.updatedAt } : m
        );
        this.cdr.detectChanges();
      });

    this.signalrService.messageDeleted$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ circleId, messageId }) => {
        if (circleId !== this.circleId) return;
        this.messages = this.messages.map((m) =>
          m.id === messageId ? { ...m, content: 'تم حذف هذه الرسالة', isDeleted: true } : m
        );
        this.cdr.detectChanges();
      });

    this.signalrService.userTyping$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ circleId, userName }) => {
        if (circleId !== this.circleId) return;
        this.typingUserName = userName;
        if (this.typingTimeout) clearTimeout(this.typingTimeout);
        this.typingTimeout = setTimeout(() => {
          this.typingUserName = '';
          this.cdr.detectChanges();
        }, 3000);
        this.cdr.detectChanges();
      });

    this.signalrService.userOnline$
      .pipe(takeUntil(this.destroy$))
      .subscribe((userId) => {
        this.userStatusMap.set(userId, { isOnline: true });
        this.cdr.detectChanges();
      });

    this.signalrService.userOffline$
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ userId, lastSeen }) => {
        this.userStatusMap.set(userId, { isOnline: false, lastSeen });
        this.cdr.detectChanges();
      });
  }

  onInputTyping(): void {
    const now = Date.now();
    if (now - this.lastTypingSentAt > 2000) {
      this.lastTypingSentAt = now;
      this.signalrService.notifyTyping(this.circleId, this.currentUserName);
    }
  }

  onEnterPress(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.isComposing || keyboardEvent.keyCode === 229) return;
    if (keyboardEvent.shiftKey) return;
    keyboardEvent.preventDefault();
    this.sendMessage();
  }

  sendMessage(): void {
    const content = this.newMessageContent.trim();
    if (!content || this.isSending) return;

    this.isSending = true;
    this.messageService
      .sendMessage(this.circleId, { content })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.succeeded && result.data) {
            if (!this.messages.some((m) => m.id === result.data!.id)) {
              this.messages = [...this.messages, result.data];
            }
            this.newMessageContent = '';
            this.shouldScrollToBottom = true;
          } else {
            this.errorMessage = result.errorMessage || 'تعذر إرسال الرسالة';
          }
          this.isSending = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.errorMessage = 'تعذر إرسال الرسالة';
          this.isSending = false;
          this.cdr.detectChanges();
        },
      });
  }

  startEditing(message: CircleMessage): void {
    this.editingMessageId = message.id;
    this.editContent = message.content;
  }

  cancelEditing(): void {
    this.editingMessageId = null;
    this.editContent = '';
  }

  saveEdit(messageId: string): void {
    const content = this.editContent.trim();
    if (!content) return;

    this.messageService
      .editMessage(this.circleId, messageId, { content })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.succeeded && result.data) {
            this.messages = this.messages.map((m) =>
              m.id === messageId
                ? { ...m, content: result.data!.content, updatedAt: result.data!.updatedAt }
                : m
            );
          }
          this.cancelEditing();
          this.cdr.detectChanges();
        },
        error: () => {
          this.cancelEditing();
          this.cdr.detectChanges();
        },
      });
  }

  deleteMessage(messageId: string): void {
    if (!confirm('هل أنت متأكد من حذف هذه الرسالة؟')) return;

    this.messageService
      .deleteMessage(this.circleId, messageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          if (result.succeeded) {
            this.messages = this.messages.filter((m) => m.id !== messageId);
            this.cdr.detectChanges();
          }
        },
      });
  }

  dismissError(): void {
    this.errorMessage = '';
  }

  trackByMessageId(_index: number, message: CircleMessage): string {
    return message.id;
  }


  private scrollToBottom(): void {
    const el = this.messagesContainer?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
