import { Component, inject, Signal, signal } from '@angular/core';
import { SidebarComponent } from '../../../student/components/sidebar/sidebar.component';
import { PointsService } from '../../services/points.service';
import { pointPakcage } from '../../models/PointPackages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-point-packages',
  imports: [SidebarComponent],
  standalone:true,
  templateUrl: './point-packages.component.html',
  styleUrl: './point-packages.component.css',
})
export class PointPackagesComponent {
  readonly currentPoints = signal(0);
  readonly pointPackages = signal<pointPakcage[] | null>([]);
  readonly activeCard = signal(false);
  readonly router = inject(Router);
  private poService = inject(PointsService);

  ngOnInit(): void {
    this.poService.getUserBalance().subscribe({
      next: (res)=>{
        console.log(res);
        
        this.currentPoints.set(res);
      },
      error:(err)=>{
        console.log(err);
      }
    });

    this.poService.getPointPackages().subscribe({
      next:(res)=>{
        this.pointPackages.set(res);
        console.log(res);
        
      },
      error:(err)=>{
        console.log(err);
        
      }
    })


    
  }

  buyClick(pointPackageID:string){
      this.router.navigate(['/checkout',pointPackageID])
  }
}
