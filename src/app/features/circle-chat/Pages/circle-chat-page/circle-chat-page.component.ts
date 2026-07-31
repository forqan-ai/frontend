import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CircleChatComponent } from '../../Components/circle-chat/circle-chat.component';

@Component({
  selector: 'app-circle-chat-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CircleChatComponent],
  template: `
    <div class="container" style="padding: 32px 0;">
      @if (!activeCircleId) {
        <div style="display: flex; flex-direction: column; gap: 12px; max-width: 480px;">
          <h2>محادثة الحلقة</h2>
          <input
            type="text"
            [(ngModel)]="circleIdInput"
            placeholder="الصق الـ Circle ID هنا"
            style="padding: 10px 14px; border: 1px solid var(--border); border-radius: 10px;"
          />
          <button
            type="button"
            (click)="startChat()"
            style="padding: 10px; background: var(--primary); color: var(--primary-light); border-radius: 10px; font-weight: 700;"
          >
            فتح المحادثة
          </button>
        </div>
      } @else {
        <app-circle-chat [circleId]="activeCircleId" />
      }
    </div>
  `,
})
export class CircleChatPageComponent {
  circleIdInput = '';
  activeCircleId = '';

  startChat(): void {
    const id = this.circleIdInput.trim();
    if (id) this.activeCircleId = id;
  }
}
