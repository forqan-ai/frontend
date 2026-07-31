import { Component, HostListener, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ITeacherRequestForm } from '../../Models/teacher-request-form.interface';
import { ButtonComponent } from "../../../../shared/components/button/button.component";
import { StudentService } from '../../Services/student.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TeachignRequestStatusBarComponent } from "../../Components/teachign-request-status-bar/teachign-request-status-bar.component";
import { TeachingRequestFormComponent } from "../../Components/teaching-request-form/teaching-request-form.component";
import { TeachingRequestResultPendingComponent } from "../../Components/teaching-request-result-pending/teaching-request-result-pending.component";
import { RequestStatus } from '../../Models/TeachingRequestStatusDto';
import { TeachingRequestResultAcceptedComponent } from "../../Components/teaching-request-result-accepted/teaching-request-result-accepted.component";
import { TeachingRequestResultRejectedComponent } from "../../Components/teaching-request-result-rejected/teaching-request-result-rejected.component";

@Component({
  selector: 'app-teaching-request',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent, TeachignRequestStatusBarComponent, TeachingRequestFormComponent, TeachingRequestResultPendingComponent, TeachingRequestResultAcceptedComponent, TeachingRequestResultRejectedComponent],
  templateUrl: './teaching-request.component.html',
  styleUrl: './teaching-request.component.css',
})
export class TeachingRequestComponent {
  requestStatus = signal<RequestStatus>('notRegistered');
  rejectionReason = signal<string>('');
  isLoading = signal<boolean>(true);

  ngOnInit() {
    this.loadRequestStatus();
  }

  loadRequestStatus() {
    this.studentService.getTeachingRequestStatus().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.requestStatus.set(res.status);
        console.log(res)
        console.log(res.rejectionReason)
        this.rejectionReason.set(res.rejectionReason);
        console.log(this.rejectionReason());
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  studentService = inject(StudentService);
  private toast = inject(ToastService);
  authService = inject(AuthService);


  // countrySearch = signal('');
  // filteredCountries = computed(() => {
  //   const q = this.countrySearch();
  //   if (!q) return this.countriesList();
  //   return this.countriesList().filter((c) => c.includes(q));
  // });

  // teacherForm = new FormGroup<ITeacherRequestForm>({
  //   academicTitle: new FormControl('', [Validators.required, Validators.maxLength(100)]),
  //   bio: new FormControl('', [Validators.required]),
  //   specializations: new FormControl([] as string[], [Validators.required]),
  //   highestQualification: new FormControl('', [Validators.required]),
  //   experienceYears: new FormControl(null, [
  //     Validators.required,
  //     Validators.min(1),
  //   ]),
  //   previousInstitutions: new FormControl(''),
  //   previouslyTaughtCourses: new FormControl('', [Validators.required]),
  //   teachingVideoUrl: new FormControl('', [Validators.pattern(/https?:\/\/.+|www\..+/)]),
  //   teachingReason: new FormControl('', [Validators.required]),
  //   phoneNumber: new FormControl('', [
  //     Validators.required,
  //     Validators.pattern(/^[\+]?[\d\s\-\(\)]{7,20}$/),
  //   ]),
  //   country: new FormControl('', [Validators.required]),
  //   additionalInfo: new FormControl(''),
  //   declaration: new FormControl(false, [Validators.requiredTrue]),
  // });

  // errorMsg = signal('');
  // certificateFiles = signal<{ file: File; id: number }[]>([]);
  // cvFile = signal<File | null>(null);
  // specOpen = signal(false);
  // countryOpen = signal(false);
  // qualOpen = signal(false);
  // private certFileIdCounter = 0;

  // phonePattern = /^[\+]?[\d\s\-\(\)]{7,20}$/;

  // getValidationMessage(control: AbstractControl | null): string {
  //   if (!control || !control.errors || (!control.touched && !control.dirty))
  //     return '';

  //   const errors = control.errors;

  //   if (errors['required']) return 'هذا الحقل مطلوب';
  //   if (errors['requiredTrue']) return 'يجب الموافقة على الإقرار';
  //   if (errors['min']) return `يجب أن تكون القيمة أكبر من أو تساوي ${errors['min'].min}`;
  //   if (errors['pattern']) return 'يرجى إدخال قيمة صحيحة';
  //   if (errors['minlength'])
  //     return `يجب أن يحتوي على الأقل ${errors['minlength'].requiredLength} أحرف`;
  //   if (errors['maxlength'])
  //     return `يجب ألا يزيد عن ${errors['maxlength'].requiredLength} حرف`;
  //   if (errors['maxFileSize']) return 'حجم الملف يجب ألا يتجاوز 2 ميجابايت';

  //   return '';
  // }

  // toggleSpecDropdown() {
  //   this.specOpen.update((v) => !v);
  // }

  // openSpecDropdown() {
  //   this.specOpen.set(true);
  // }

  // @HostListener('document:click', ['$event'])
  // onDocumentClick(event: MouseEvent) {
  //   const target = event.target as HTMLElement;
  //   if (!target.closest('.tr-select-wrapper')) {
  //     this.specOpen.set(false);
  //   }
  //   if (
  //     !target.closest('.tr-country-wrapper')
  //   ) {
  //     this.countryOpen.set(false);
  //   }
  //   if (!target.closest('.tr-qual-wrapper')) {
  //     this.qualOpen.set(false);
  //   }
  // }

  // toggleSpecialization(spec: string) {
  //   const current = this.teacherForm.value.specializations ?? [];
  //   const idx = current.indexOf(spec);
  //   const updated = idx >= 0 ? current.filter((s) => s !== spec) : [...current, spec];
  //   this.teacherForm.controls.specializations.setValue(updated);
  //   this.teacherForm.controls.specializations.markAsDirty();
  //   this.teacherForm.controls.specializations.markAsTouched();
  // }

  // isSpecializationSelected(spec: string): boolean {
  //   return (this.teacherForm.value.specializations ?? []).includes(spec);
  // }

  // toggleQualDropdown() {
  //   this.qualOpen.update((v) => !v);
  // }

  // selectQualification(q: string) {
  //   this.teacherForm.controls.highestQualification.setValue(q);
  //   this.teacherForm.controls.highestQualification.markAsDirty();
  //   this.teacherForm.controls.highestQualification.markAsTouched();
  //   this.qualOpen.set(false);
  // }

  // toggleCountryDropdown() {
  //   this.countryOpen.update((v) => !v);
  //   if (this.countryOpen()) {
  //     this.countrySearch.set('');
  //   }
  // }

  // selectCountry(c: string) {
  //   this.teacherForm.controls.country.setValue(c);
  //   this.teacherForm.controls.country.markAsDirty();
  //   this.teacherForm.controls.country.markAsTouched();
  //   this.countryOpen.set(false);
  // }

  // onCountrySearchInput(event: Event) {
  //   const value = (event.target as HTMLInputElement).value;
  //   this.countrySearch.set(value);
  // }

  // onCertificateAdd() {
  //   const input = document.createElement('input');
  //   input.type = 'file';
  //   input.accept = '.jpg,.jpeg,.png,.pdf';
  //   input.onchange = (event: Event) => {
  //     const el = event.target as HTMLInputElement;
  //     if (el.files && el.files.length > 0) {
  //       const file = el.files[0];
  //       if (file.size > 2 * 1024 * 1024) {
  //         this.errorMsg.set('حجم الملف يجب ألا يتجاوز 2 ميجابايت');
  //         setTimeout(() => this.errorMsg.set(''), 4000);
  //         return;
  //       }
  //       this.certificateFiles.update((list) => [
  //         ...list,
  //         { file, id: ++this.certFileIdCounter },
  //       ]);
  //     }
  //   };
  //   input.click();
  // }

  // removeCertificate(id: number) {
  //   this.certificateFiles.update((list) => list.filter((item) => item.id !== id));
  // }

  // onCVChange(event: Event) {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files.length > 0) {
  //     const file = input.files[input.files.length - 1];
  //     if (!file.name.toLowerCase().endsWith('.pdf')) {
  //       this.errorMsg.set('يُرجى اختيار ملف بصيغة PDF فقط');
  //       setTimeout(() => this.errorMsg.set(''), 4000);
  //       return;
  //     }
  //     if (file.size > 2 * 1024 * 1024) {
  //       this.errorMsg.set('حجم الملف يجب ألا يتجاوز 2 ميجابايت');
  //       setTimeout(() => this.errorMsg.set(''), 4000);
  //       return;
  //     }
  //     this.cvFile.set(file);
  //   }
  // }

  // removeCV() {
  //   this.cvFile.set(null);
  // }


  // isLoading = signal<boolean>(false);

  // onSubmit() {
  //   if (this.teacherForm.invalid) {
  //     Object.values(this.teacherForm.controls).forEach((c) => {
  //       c.markAsTouched();
  //     });
  //     return;
  //   }
  //   this.isLoading.set(true);
  //   const formData = new FormData();
  //   const raw = this.teacherForm.getRawValue();
  //   formData.append('academicTitle', raw.academicTitle ?? '');
  //   formData.append('bio', raw.bio ?? '');
  //   formData.append('specializations', JSON.stringify(raw.specializations));
  //   formData.append('highestQualification', raw.highestQualification ?? '');
  //   formData.append('experienceYears', String(raw.experienceYears ?? ''));
  //   formData.append('previousInstitutions', raw.previousInstitutions ?? '');
  //   formData.append('previouslyTaughtCourses', raw.previouslyTaughtCourses ?? '');
  //   formData.append('teachingVideoUrl', raw.teachingVideoUrl ?? '');
  //   formData.append('teachingReason', raw.teachingReason ?? '');
  //   formData.append('phoneNumber', raw.phoneNumber ?? '');
  //   formData.append('country', raw.country ?? '');
  //   formData.append('additionalInfo', raw.additionalInfo ?? '');
  //   formData.append('declaration', raw.declaration ? 'true' : 'false');
  //   formData.append('userId', this.authService.getUserId()!)
  //   this.certificateFiles().forEach((item) => {
  //     formData.append('certificates', item.file);
  //   });
  //   if (this.cvFile()) {
  //     formData.append('cv', this.cvFile()!);
  //   }
  //   console.log('----- FormData -----');

  //   for (const [key, value] of formData.entries()) {
  //     console.log(key, value);
  //   }

  //   this.studentService.sendTeachingRequest(formData).subscribe({
  //     next: (res) => {
  //       console.log(res)
  //       this.isLoading.set(false);
  //       this.toast.show('تم أرسال طلبك بنجاح');
  //     },
  //     error: (err) => {
  //       console.log(err);
  //       this.isLoading.set(false);
  //       this.toast.show('فشل الارسال, برجاء إعادة المحاولة لاحقا');
  //     }
  //   })
  // }
}
