import { Component, inject, Signal, signal } from '@angular/core';
import { PointsService } from '../../services/points.service';
import { pointPakcage } from '../../models/PointPackages';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-point-packages',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './point-packages.component.html',
  styleUrl: './point-packages.component.css',
})
export class PointPackagesComponent {
  readonly currentPoints = signal(0);
  readonly pointPackages = signal<pointPakcage[] | null>([]);
  readonly activeCard = signal(false);
  readonly router = inject(Router);
  private poService = inject(PointsService);
  isLoading = signal<boolean>(true);
  ngOnInit(): void {
    this.poService.getUserBalance().subscribe({
      next: (res) => {
        console.log(res);

        this.currentPoints.set(res);
      },
      error: (err) => {
        console.log(err);
      }
    });

    this.poService.getPointPackages().subscribe({
      next: (res) => {
        this.pointPackages.set(res);
        console.log(res);

      },
      error: (err) => {
        console.log(err);

      },
      complete: () => {
        this.isLoading.set(false);
      }
    })
  }

  buyClick(pointPackageID: string) {
    this.router.navigate(['./checkout', pointPackageID])
  }
}
