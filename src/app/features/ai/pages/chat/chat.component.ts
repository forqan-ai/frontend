import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  OnInit,
  inject,
  signal,
  Output,
  EventEmitter,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Marked } from 'marked';

import { ChatService } from '../../services/chat.service';
import { MessageRole } from '../../enums/message-role';
import { IChatMessage } from '../../models/chat-message.interface';
import { IChatRequest } from '../../models/chat-request.interface';
import { IReference } from '../../models/reference.interface';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnChanges {
  @Input({ required: true })
  lessonId!: string;

  @Output()
  referenceClicked = new EventEmitter<number>();

  @ViewChild('messagesContainer')
  private messagesContainer!: ElementRef<HTMLDivElement>;

  readonly MessageRole = MessageRole;

  private readonly chatService = inject(ChatService);
  private readonly cdr = inject(ChangeDetectorRef);

  messages: IChatMessage[] = [];

  question = '';

  conversationId?: string;

  loading = false;

  references = signal<IReference[] | undefined>([]);

  private markdown = new Marked();

  // =========================================================
  // Lifecycle
  // =========================================================

  ngOnInit(): void {
    if (this.lessonId) {
      this.loadChatHistory();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lessonId'] && !changes['lessonId'].firstChange && this.lessonId) {
      this.loadChatHistory();
    }
  }

  // =========================================================
  // Load Chat History
  // =========================================================

  private loadChatHistory(): void {
    // Clear old references immediately
    this.references.set([]);

    this.chatService.getHistory(this.lessonId).subscribe({
      next: (history) => {
        this.messages = history?.messages ?? [];

        this.conversationId = history?.conversationId;

        this.cdr.detectChanges();

        // Wait until Angular finishes rendering
        // the messages before scrolling.
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      },

      error: (error) => {
        console.error('Error loading history:', error);

        this.messages = [];

        this.conversationId = undefined;

        this.references.set([]);

        this.cdr.detectChanges();

        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      },
    });
  }

  // =========================================================
  // Message Role
  // =========================================================

  isUser(role: any): boolean {
    return role === MessageRole.User || role === 0 || role === 'User' || role === 'user';
  }

  isAssistant(role: any): boolean {
    return (
      role === MessageRole.Assistant || role === 1 || role === 'Assistant' || role === 'assistant'
    );
  }

  // =========================================================
  // Send Message
  // =========================================================

  sendMessage(): void {
    if (!this.question.trim() || this.loading) {
      return;
    }

    const userQuestion = this.question.trim();

    const request: IChatRequest = {
      question: userQuestion,
      lessonId: this.lessonId,
      conversationId: this.conversationId,
    };

    // Add user message
    this.messages.push({
      role: MessageRole.User,
      content: userQuestion,
      createdAt: new Date().toISOString(),
    });

    // Clear input
    this.question = '';

    // Show loading
    this.loading = true;

    this.cdr.detectChanges();

    // Scroll after user message appears
    setTimeout(() => {
      this.scrollToBottom();
    }, 0);

    // Send request
    this.chatService.sendMessage(request).subscribe({
      next: (response) => {
        console.log(response);

        // Add AI response
        this.messages.push({
          role: MessageRole.Assistant,
          content: response.answer,
          createdAt: new Date().toISOString(),
        });

        // Update references
        this.references.set(response.source?.references ?? []);

        // Update conversation
        this.conversationId = response.conversationId;

        // Hide loading
        this.loading = false;

        this.cdr.detectChanges();

        // Important:
        // Wait until the message + references
        // are rendered before scrolling.
        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      },

      error: (error) => {
        console.error('Error sending message:', error);

        this.loading = false;

        this.cdr.detectChanges();

        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      },
    });
  }

  // =========================================================
  // Scroll To Bottom
  // =========================================================

  private scrollToBottom(): void {
    const container = this.messagesContainer?.nativeElement;

    if (!container) {
      return;
    }

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }

  // =========================================================
  // Reference
  // =========================================================

  goToReference(timestamp: number | undefined): void {
    if (timestamp === undefined) {
      return;
    }

    this.referenceClicked.emit(timestamp);
  }

  // =========================================================
  // Format Timestamp
  // =========================================================

  formatTimestamp(seconds: number | undefined): string {
    if (seconds === undefined) {
      return '';
    }

    const minutes = Math.floor(seconds / 60);

    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  parseMarkdown(content: string): string {
    return this.markdown.parse(content) as string;
  }
}
