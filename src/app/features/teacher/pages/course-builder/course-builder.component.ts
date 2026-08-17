import {
  Component,
  inject,
  OnInit,
  signal,
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { ModuleService } from '../../services/module.service';
import { ModuleModel } from '../../models/module.model';

import { ModuleCardComponent } from './components/module/module-card/module-card.component';
import { AddModuleDialogComponent } from './components/module/add-module-dialog/add-module-dialog.component';
import { EditCourseFormComponent } from './components/edit-course/edit-course-form.component';

@Component({
  selector: 'app-course-builder',
  standalone: true,
  imports: [
    ModuleCardComponent,
    AddModuleDialogComponent,
    EditCourseFormComponent,
  ],
  templateUrl: './course-builder.component.html',
  styleUrls: ['./course-builder.component.css'],
})
export class CourseBuilderComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly moduleService = inject(ModuleService);

  showAddModule = signal(false);
  showEditCourse = signal(false);

  courseId = '';

  modules = signal<ModuleModel[]>([]);

  deleteType = signal<'module' | 'lesson' | 'quiz' | null>(null);
  deleteId = signal('');
  deleteParentId = signal('');
  deleteTitle = signal('');
  isDeleting = signal(false);

  ngOnInit(): void {
    this.courseId =
      this.route.snapshot.paramMap.get('courseId') ?? '';

    this.loadModules();
  }

  loadModules(): void {
    this.moduleService
      .getModules(this.courseId)
      .subscribe({
        next: (res) => {
          this.modules.set(res);
        },
        error: (err) => {
          console.error(err);
        },
      });
  }

  toggleAddModule(): void {
    this.showEditCourse.set(false);

    this.showAddModule.update(
      (value) => !value
    );
  }

  toggleEditCourse(): void {
    this.showAddModule.set(false);

    this.showEditCourse.update(
      (value) => !value
    );
  }

  closeOverlay(): void {
    this.showAddModule.set(false);
    this.showEditCourse.set(false);
  }

  openDeleteConfirm(
    type: 'module' | 'lesson' | 'quiz',
    id: string,
    parentId: string,
    title: string
  ): void {
    this.deleteType.set(type);
    this.deleteId.set(id);
    this.deleteParentId.set(parentId);
    this.deleteTitle.set(title);
  }

  closeDeleteConfirm(): void {
    if (this.isDeleting()) {
      return;
    }

    this.deleteType.set(null);
    this.deleteId.set('');
    this.deleteParentId.set('');
    this.deleteTitle.set('');
  }

  confirmDelete(): void {
    if (
      this.isDeleting() ||
      !this.deleteType() ||
      !this.deleteId()
    ) {
      return;
    }

    this.isDeleting.set(true);

    const type = this.deleteType();
    const id = this.deleteId();
    const parentId = this.deleteParentId();

    if (type === 'module') {
      this.moduleService.delete(
        this.courseId,
        id
      ).subscribe({
        next: () => {
          this.isDeleting.set(false);
          this.closeDeleteConfirm();
          this.loadModules();
        },
        error: (err) => {
          console.error(err);
          this.isDeleting.set(false);
        },
      });

      return;
    }
  }
}
