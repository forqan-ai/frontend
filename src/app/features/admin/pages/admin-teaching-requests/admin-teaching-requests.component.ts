import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestState } from '../../models/RequestState';
import { TeachingRequestCardDto } from '../../models/TeachingRequestCardDto';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { AdminTeachingRequestsService } from '../../services/admin-teaching-requests.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-teaching-request-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent, RouterLink],
  templateUrl: './admin-teaching-requests.component.html',
  styleUrls: ['./admin-teaching-requests.component.css']
})
export class AdminTeachingRequestsComponent {

  teachingRequestsService = inject(AdminTeachingRequestsService);
  requests = signal<TeachingRequestCardDto[]>([]);

  currentPage = signal(1);

  readonly pageSize = 5;

  hasNextPage = signal(false);

  loading = signal(false);
  initialLoading = signal(true);

  loadingMore = signal(false);


  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    if (this.currentPage() === 1) {
      this.initialLoading.set(true);
    } else {
      this.loadingMore.set(true);
    } this.teachingRequestsService
      .getPaginatedRequests(this.pageSize, this.currentPage(), RequestState.Pending
      )
      .subscribe({
        next: res => {
          if (this.currentPage() === 1) {
            this.initialLoading.set(false);
          } else {
            this.loadingMore.set(false);
          }
          this.requests.update(old => [...old, ...res.items]);
          this.hasNextPage.set(res.hasNextPage);

        },

        error: (err) => {
          if (this.currentPage() === 1) {
            this.initialLoading.set(false);
          } else {
            this.loadingMore.set(false);
          }
          console.log(err);
        }
      });
  }

  groupedRequests = computed(() => {

    const groups: { date: string; requests: TeachingRequestCardDto[]; }[] = [];

    for (const request of this.requests()) {

      let group = groups.find(g => g.date === request.createdAt);

      if (!group) {

        group = {
          date: request.createdAt,
          requests: []
        };

        groups.push(group);
      }

      group.requests.push(request);
    }

    return groups;

  });


  loadMore(): void {

    if (!this.hasNextPage()) {
      return;
    }
    this.currentPage.update(page => page + 1);
    this.loadRequests();
  }
}
