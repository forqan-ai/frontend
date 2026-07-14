import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from '../../services/teacher.service';
import { ITeacherDetailsDto } from '../../models/teacher-details-dto.interface';

@Component({
  selector: 'app-teacher-details',
  imports: [CommonModule],
  templateUrl: './teacher-details.component.html',
  styleUrl: './teacher-details.component.css',
})

export class TeacherDetailsComponent {

  constructor(private sanitizer: DomSanitizer, private route: ActivatedRoute,
    private router: Router) { }

  teacherService = inject(TeacherService);

  teacher = signal<ITeacherDetailsDto | null>(null);


  ngOnInit() {
    const teacherId = this.route.snapshot.paramMap.get('id');
    this.loadTeacherDetails(teacherId!);
  }

  loadTeacherDetails(id: string) {
    this.teacherService.getTeacherDetails(id).subscribe({
      next: (res: ITeacherDetailsDto) => {
        res.joinedAt = res.joinedAt?.split('-')[0];
        this.teacher.set(res);
        // this.teacher()?.joinedAt?.slice('-')[0]
      },
      error: (err: any) => {
        console.log(err);
      }
    })
  }
}
