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
import { RouterLink } from '@angular/router';

import { ChatService } from '../../services/chat.service';
import { MessageRole } from '../../enums/message-role';
import { IChatMessage } from '../../models/chat-message.interface';
import { IChatRequest } from '../../models/chat-request.interface';
import { IReference } from '../../models/reference.interface';
import { ICourseRecommendation } from '../../models/course-recommendation.interface';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
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

  recommendedCourses = signal<ICourseRecommendation[]>([]);

  private markdown = new Marked();

  ngOnInit(): void {
    if (this.lessonId) {
      this.messages = [];
      this.conversationId = undefined;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lessonId'] && !changes['lessonId'].firstChange && this.lessonId) {
      this.messages = [];
      this.conversationId = undefined;
    }
  }

  private loadChatHistory(): void {
    this.references.set([]);
    this.recommendedCourses.set([]);

    this.chatService.getHistory(this.lessonId).subscribe({
      next: (history) => {
        this.messages = history?.messages ?? [];

        this.conversationId = history?.conversationId;

        this.cdr.detectChanges();

        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      },

      error: (error) => {
        console.error('Error loading history:', error);

        this.messages = [];

        this.conversationId = undefined;

        this.references.set([]);
        this.recommendedCourses.set([]);

        this.cdr.detectChanges();

        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      },
    });
  }

  isUser(role: any): boolean {
    return role === MessageRole.User || role === 0 || role === 'User' || role === 'user';
  }

  isAssistant(role: any): boolean {
    return (
      role === MessageRole.Assistant || role === 1 || role === 'Assistant' || role === 'assistant'
    );
  }

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

    this.messages.push({
      role: MessageRole.User,
      content: userQuestion,
      createdAt: new Date().toISOString(),
    });

    this.question = '';

    this.loading = true;

    this.cdr.detectChanges();

    setTimeout(() => {
      this.scrollToBottom();
    }, 0);

    this.chatService.sendMessage(request).subscribe({
      next: (response) => {
        console.log(response);

        this.messages.push({
          role: MessageRole.Assistant,
          content: response.answer,
          createdAt: new Date().toISOString(),
          references: response.source?.references ?? [],
          recommendedCourses: response.recommendedCourses ?? [],
        });

        this.references.set(response.source?.references ?? []);
        this.recommendedCourses.set(response.recommendedCourses ?? []);

        this.conversationId = response.conversationId;

        this.loading = false;

        this.cdr.detectChanges();

        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      },

      error: (error) => {
        console.error('Error sending message:', error.error?.error ?? error.message);

        this.loading = false;

        this.cdr.detectChanges();

        setTimeout(() => {
          this.scrollToBottom();
        }, 0);
      },
    });
  }

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

  goToReference(timestamp: number | undefined): void {
    if (timestamp === undefined) {
      return;
    }

    this.referenceClicked.emit(timestamp);
  }

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
