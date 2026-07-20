import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { HeaderComponent } from '../../components/header/header.component';
import { QuickActionsComponent } from '../../components/quick-actions/quick-actions.component';

@Component({
  selector: 'app-course-builder',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, QuickActionsComponent],
  templateUrl: './course-builder.component.html',
  styleUrls: ['./course-builder.component.css'],
})
export class CourseBuilderComponent {
  private route = inject(ActivatedRoute);

  courseId = '';

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId')!;

    console.log(this.courseId);
  }
}
