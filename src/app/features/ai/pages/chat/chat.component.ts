import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChatService } from '../../services/chat.service';
import { MessageRole } from '../../enums/message-role';
import { IChatMessage } from '../../models/chat-message.interface';
import { IChatRequest } from '../../models/chat-request.interface';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css',
})
export class ChatComponent implements OnInit, OnChanges, AfterViewChecked {
  @Input({ required: true })
  lessonId!: string;

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  readonly MessageRole = MessageRole;

  private readonly chatService = inject(ChatService);
  private readonly cdr = inject(ChangeDetectorRef);

  messages: IChatMessage[] = [];
  question = '';
  conversationId?: string;
  loading = false;

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

  isUser(role: any): boolean {
    return role === MessageRole.User || role === 0 || role === 'User' || role === 'user';
  }

  isAssistant(role: any): boolean {
    return role === MessageRole.Assistant || role === 1 || role === 'Assistant' || role === 'assistant';
  }

  private loadChatHistory(): void {
    this.chatService.getHistory(this.lessonId).subscribe({
      next: (history) => {
        this.messages = history?.messages ?? [];
        this.conversationId = history?.conversationId;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading history:', error);
      },
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {}
  }

  sendMessage(): void {
    if (!this.question.trim() || this.loading) {
      return;
    }

    const userQuestion = this.question;

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

    this.chatService.sendMessage(request).subscribe({
      next: (response) => {
        this.messages.push({
          role: MessageRole.Assistant,
          content: response.answer,
          createdAt: new Date().toISOString(),
        });

        this.conversationId = response.conversationId;
        this.loading = false;
        this.cdr.detectChanges();
      },

      error: (error) => {
        console.error(error);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }
}