import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlacementService } from '../../services/placement.service';
import { PlacementResult } from '../../models/placement.models';

@Component({
  selector: 'app-placement-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placement-result.component.html',
  styleUrls: ['./placement-result.component.css'],
})
export class PlacementResultComponent implements OnInit {
  result: PlacementResult | null = null;
  loading = true;

  constructor(private placementService: PlacementService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    const cached = localStorage.getItem('placementResult');
    if (cached) {
      this.result = JSON.parse(cached);
      this.loading = false;
      // localStorage.removeItem('placementResult');
      this.cdr.detectChanges();
      return;
    }
    this.placementService.getMyResult().subscribe({
      next: (res) => {
        this.result = res;
        this.loading = false;
        this.cdr.detectChanges();
        localStorage.setItem(
          'placementResult',
          JSON.stringify(res)
        );
      },
      error: () => (this.loading = false),


    });
  }

  getLevelColor(level: string): string {
    switch (level) {
      case 'متقدم': return '#10b981';
      case 'متوسط': return '#f59e0b';
      default: return '#ef4444';
    }
  }

  getLevelIcon(level: string): string {
    switch (level) {
      case 'متقدم': return '🌟';
      case 'متوسط': return '📈';
      default: return '🌱';
    }
  }

  goToCourse(courseId: string): void {
    this.router.navigate(['/student/courses', courseId]);
  }

  retakeTest(): void {
    this.router.navigate(['/student/placement-test/quiz']);
  }
}
