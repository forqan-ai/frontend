import { Component, signal, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModuleService } from '../../services/module.service';
import { ModuleModel } from '../../models/module.model';
import { ModuleCardComponent } from './components/module/module-card/module-card.component';
import { AddModuleDialogComponent } from './components/module/add-module-dialog/add-module-dialog.component';
import { EditCourseFormComponent } from './components/edit-course/edit-course-form.component';

@Component({
  selector: 'app-course-builder',
  standalone: true,
  imports: [ModuleCardComponent, AddModuleDialogComponent, EditCourseFormComponent],
  templateUrl: './course-builder.component.html',
  styleUrls: ['./course-builder.component.css'],
})
export class CourseBuilderComponent {
  private route = inject(ActivatedRoute);

  private moduleService = inject(ModuleService);
  showAddModule = signal(false);
  showEditCourse = signal(false);
  courseId = '';

  modules = signal<ModuleModel[]>([]);

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('courseId')!;

    this.loadModules();
  }

  loadModules() {
    this.moduleService.getModules(this.courseId).subscribe({
      next: (res) => this.modules.set(res),
    });
  }

  toggleAddModule() {
    this.showAddModule.update((v) => !v);
  }

  toggleEditCourse() {
    this.showEditCourse.update((v) => !v);
  }
}
