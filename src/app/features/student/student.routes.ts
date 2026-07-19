import { Routes } from "@angular/router";
import { StudentprofileComponent } from "./Pages/studentprofile/studentprofile.component";
import { StudentSettingsComponent } from "./Pages/student-settings/student-settings.component";
import { StudentCertificatesComponent } from "./Pages/student-certificates/student-certificates.component";
import { CoursesBrowseComponent } from "../courses-browse/pages/courses-browse/courses-browse.component";
import { TeachersBrowseComponent } from "../teacher/pages/teachers-browse/teachers-browse.component";
import { StudentLearningCirclesComponent } from "./Pages/student-learning-circles/student-learning-circles.component";
import { StudentCoursesComponent } from "./Pages/student-courses/student-courses.component";
import { TeachingRequestComponent } from "./Pages/teaching-request/teaching-request.component";

export const STUDENT_ROUTES: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'home'
    },
    {
        path: 'home',
        component: StudentprofileComponent,
        title: 'الصفحة الرئيسية'
    },
    {
        path: 'settings',
        component: StudentSettingsComponent,
        title: 'الإعدادات'
    },
    {
        path: 'my-certificates',
        component: StudentCertificatesComponent,
        title: 'شهاداتي'
    },
    {
        path: 'courses',
        component: CoursesBrowseComponent,
        title: 'تصفح الدورات المقدمة من منصة الفرقان'
    },
    {
        path: 'teachers',
        component: TeachersBrowseComponent,
        title: 'تصفح المعلمون المسجلون علي من منصة الفرقان'
    },
    {
        path: 'learning-circles',
        component: StudentLearningCirclesComponent,
        title: 'حلقات العلم الخاصة بي'
    },
    {
        path: 'my-courses',
        component: StudentCoursesComponent,
        title: 'دوراتي'
    },
    {
        path: 'teaching-request',
        component: TeachingRequestComponent,
        title: 'طلب الانضمام كمعلم'
    }
];