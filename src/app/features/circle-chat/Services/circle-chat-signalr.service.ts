import { Injectable, NgZone, inject } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { CircleMessage, UserTypingEvent } from '../Models/circle-message.model';
import { AuthService } from '../../../core/services/auth.service';

export type ChatConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'reconnecting';

@Injectable({ providedIn: 'root' })
export class CircleChatSignalrService {
  private zone = inject(NgZone);
  private authService = inject(AuthService);

  private connection: HubConnection | null = null;
  private currentCircleId: string | null = null;

  connectionState$ = new BehaviorSubject<ChatConnectionState>('disconnected');
  messageReceived$ = new Subject<CircleMessage>();
  messageEdited$ = new Subject<CircleMessage>();
  messageDeleted$ = new Subject<{ circleId: string; messageId: string }>();
  userTyping$ = new Subject<UserTypingEvent>();
  userOnline$ = new Subject<string>();
  userOffline$ = new Subject<{userId: string, lastSeen: string}>();

  async connect(circleId: string): Promise<void> {
    if (
      this.connection &&
      this.connection.state === HubConnectionState.Connected &&
      this.currentCircleId === circleId
    ) {
      return;
    }

    await this.disconnect();

    this.currentCircleId = circleId;
    this.connectionState$.next('connecting');

    this.connection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/hubs/circle-chat`, {
        accessTokenFactory: () => this.getToken(),
      })
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Warning)
      .build();

    this.registerHandlers();

    try {
      await this.connection.start();
      await this.connection.invoke('JoinCircleChat', circleId);
      this.zone.run(() => this.connectionState$.next('connected'));
    } catch {
      this.zone.run(() => this.connectionState$.next('disconnected'));
      throw new Error('فشل الاتصال بالمحادثة');
    }
  }

  async disconnect(): Promise<void> {
    if (!this.connection) return;

    try {
      if (
        this.connection.state === HubConnectionState.Connected &&
        this.currentCircleId
      ) {
        await this.connection.invoke('LeaveCircleChat', this.currentCircleId);
      }
      await this.connection.stop();
    } catch {}
    finally {
      this.connection = null;
      this.currentCircleId = null;
      this.connectionState$.next('disconnected');
    }
  }

  notifyTyping(circleId: string, userName: string): void {
    if (this.connection?.state === HubConnectionState.Connected) {
      this.connection.invoke('Typing', circleId, userName).catch(() => {});
    }
  }

  async getOnlineUsers(): Promise<string[]> {
    if (this.connection?.state === HubConnectionState.Connected) {
      return await this.connection.invoke<string[]>('GetOnlineUsers');
    }
    return [];
  }

  private registerHandlers(): void {
    if (!this.connection) return;

    this.connection.on('MessageReceived', (message: CircleMessage) => {
      this.zone.run(() => this.messageReceived$.next(message));
    });

    this.connection.on('MessageEdited', (message: CircleMessage) => {
      this.zone.run(() => this.messageEdited$.next(message));
    });

    this.connection.on(
      'MessageDeleted',
      (payload: { circleId: string; messageId: string }) => {
        this.zone.run(() => this.messageDeleted$.next(payload));
      }
    );

    this.connection.on('UserTyping', (payload: UserTypingEvent) => {
      this.zone.run(() => this.userTyping$.next(payload));
    });

    this.connection.on('UserOnline', (userId: string) => {
      this.zone.run(() => this.userOnline$.next(userId));
    });

    this.connection.on('UserOffline', (data: {userId: string, lastSeen: string}) => {
      this.zone.run(() => this.userOffline$.next(data));
    });

    this.connection.onreconnecting(() => {
      this.zone.run(() => this.connectionState$.next('reconnecting'));
    });

    this.connection.onreconnected(async () => {
      if (this.currentCircleId) {
        await this.connection?.invoke('JoinCircleChat', this.currentCircleId);
      }
      this.zone.run(() => this.connectionState$.next('connected'));
    });

    this.connection.onclose(() => {
      this.zone.run(() => this.connectionState$.next('disconnected'));
    });
  }

  private getToken(): string {
    return this.authService.getToken() ?? '';
  }
}
