import { Component, OnInit ,ChangeDetectorRef} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PlacementService } from '../../services/placement.service';
@Component({
  selector: 'app-placement-intro',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placement-intro.component.html',
  styleUrls: ['./placement-intro.component.css'],
})
export class PlacementIntroComponent implements OnInit {
  hasTaken = false;
  loading = true;

  constructor(private placementService: PlacementService, private router: Router,private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.placementService.hasTakenTest().subscribe({
      next: (res) => {
        this.hasTaken = res;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => (this.loading = false),
    });
  }

  startTest(): void {
    this.router.navigate(['/dashboard/student/placement-test/quiz']);
  }

  viewResult(): void {
    this.router.navigate(['/dashboard/student/placement-test/result']);
  }
}
