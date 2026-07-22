import { Component, HostListener, signal, computed, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { ITeacherRequestForm } from '../../Models/teacher-request-form.interface';
import { StudentService } from '../../Services/student.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-teaching-request-form',
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './teaching-request-form.component.html',
  styleUrl: './teaching-request-form.component.css',
})
export class TeachingRequestFormComponent {
  specializationsList = signal<string[]>([
    'القرآن الكريم',
    'الحديث',
    'الفقه',
    'العقيدة',
    'السيرة',
    'الدعوة',
  ]);
  qualificationsList = signal<string[]>([
    'طالب علم',
    'دبلوم',
    'بكالوريوس',
    'ليسانس',
    'ماجستير',
    'دكتوراه',
    'أخرى',
  ]);
  countriesList = signal<string[]>([
    'أفغانستان', 'ألبانيا', 'الجزائر', 'أندورا', 'أنغولا',
    'الأرجنتين', 'أرمينيا', 'أستراليا', 'النمسا', 'أذربيجان',
    'البحرين', 'بنغلاديش', 'باربادوس', 'روسيا البيضاء', 'بلجيكا',
    'بنين', 'بوتان', 'بوليفيا', 'البوسنة والهرسك', 'بوتسوانا',
    'البرازيل', 'بروناي', 'بلغاريا', 'بوركينا فاسو', 'بوروندي',
    'كمبوديا', 'الكاميرون', 'كندا', 'الرأس الأخضر', 'جمهورية أفريقيا الوسطى',
    'تشاد', 'تشيلي', 'الصين', 'كولومبيا', 'جزر القمر',
    'الكونغو', 'كوستاريكا', 'ساحل العاج', 'كرواتيا', 'كوبا',
    'قبرص', 'جمهورية التشيك', 'الدنمارك', 'جيبوتي', 'دومينيكا',
    'جمهورية الدومينيكان', 'الإكوادور', 'مصر', 'السلفادور', 'غينيا الاستوائية',
    'إريتريا', 'إستونيا', 'إثيوبيا', 'فيجي', 'فنلندا',
    'فرنسا', 'الغابون', 'غامبيا', 'جورجيا', 'ألمانيا',
    'غانا', 'اليونان', 'غرينادا', 'غواتيمالا', 'غينيا',
    'غينيا بيساو', 'غيانا', 'هايتي', 'هندوراس', 'المجر',
    'آيسلندا', 'الهند', 'إندونيسيا', 'إيران', 'العراق',
    'أيرلندا', 'إيطاليا', 'جامايكا', 'اليابان', 'الأردن',
    'كازاخستان', 'كينيا', 'كيريباتي', 'كوريا الشمالية', 'كوريا الجنوبية',
    'الكويت', 'قيرغيزستان', 'لاوس', 'لاتفيا', 'لبنان',
    'ليسوتو', 'ليبيريا', 'ليبيا', 'ليختنشتاين', 'ليتوانيا',
    'لوكسمبورغ', 'مدغشقر', 'مالاوي', 'ماليزيا', 'جزر المالديف',
    'مالي', 'مالطا', 'جزر مارشال', 'موريتانيا', 'موريشيوس',
    'المكسيك', 'ميكرونيسيا', 'مولدوفا', 'موناكو', 'منغوليا',
    'الجبل الأسود', 'المغرب', 'موزمبيق', 'ميانمار', 'ناميبيا',
    'ناورو', 'نيبال', 'هولندا', 'نيوزيلندا', 'نيكاراغوا',
    'النيجر', 'نيجيريا', 'مقدونيا الشمالية', 'النرويج', 'عُمان',
    'باكستان', 'بالاو', 'فلسطين', 'بنما', 'بابوا غينيا الجديدة',
    'الباراغواي', 'بيرو', 'الفلبين', 'بولندا', 'البرتغال',
    'قطر', 'رومانيا', 'روسيا', 'رواندا', 'سانت كيتس ونيفيس',
    'سانت لوسيا', 'سانت فينسنت والغرينادين', 'ساموا', 'سان مارينو', 'ساو تومي وبرينسيبي',
    'المملكة العربية السعودية', 'السنغال', 'صربيا', 'سيشل', 'سيراليون',
    'سنغافورة', 'سلوفاكيا', 'سلوفينيا', 'جزر سليمان', 'الصومال',
    'جنوب أفريقيا', 'جنوب السودان', 'إسبانيا', 'سريلانكا', 'السودان',
    'سورينام', 'السويد', 'سويسرا', 'سوريا', 'تايوان',
    'طاجيكستان', 'تنزانيا', 'تايلاند', 'تيمور الشرقية', 'توغو',
    'تونغا', 'ترينيداد وتوباغو', 'تونس', 'تركيا', 'تركمانستان',
    'توفالو', 'أوغندا', 'أوكرانيا', 'الإمارات العربية المتحدة', 'المملكة المتحدة',
    'الولايات المتحدة', 'الأوروغواي', 'أوزبكستان', 'فانواتو', 'الفاتيكان',
    'فنزويلا', 'فيتنام', 'اليمن', 'زامبيا', 'زيمبابوي',
  ]);

  studentService = inject(StudentService);
  private toast = inject(ToastService);
  authService = inject(AuthService);


  countrySearch = signal('');
  filteredCountries = computed(() => {
    const q = this.countrySearch();
    if (!q) return this.countriesList();
    return this.countriesList().filter((c) => c.includes(q));
  });

  teacherForm = new FormGroup<ITeacherRequestForm>({
    academicTitle: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    bio: new FormControl('', [Validators.required]),
    specializations: new FormControl([] as string[], [Validators.required]),
    highestQualification: new FormControl('', [Validators.required]),
    experienceYears: new FormControl(null, [
      Validators.required,
      Validators.min(1),
    ]),
    previousInstitutions: new FormControl(''),
    previouslyTaughtCourses: new FormControl('', [Validators.required]),
    teachingVideoUrl: new FormControl('', [Validators.pattern(/https?:\/\/.+|www\..+/)]),
    teachingReason: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[\+]?[\d\s\-\(\)]{7,20}$/),
    ]),
    country: new FormControl('', [Validators.required]),
    additionalInfo: new FormControl(''),
    declaration: new FormControl(false, [Validators.requiredTrue]),
  });

  errorMsg = signal('');
  certificateFiles = signal<{ file: File; id: number }[]>([]);
  cvFile = signal<File | null>(null);
  specOpen = signal(false);
  countryOpen = signal(false);
  qualOpen = signal(false);
  private certFileIdCounter = 0;

  phonePattern = /^[\+]?[\d\s\-\(\)]{7,20}$/;

  getValidationMessage(control: AbstractControl | null): string {
    if (!control || !control.errors || (!control.touched && !control.dirty))
      return '';

    const errors = control.errors;

    if (errors['required']) return 'هذا الحقل مطلوب';
    if (errors['requiredTrue']) return 'يجب الموافقة على الإقرار';
    if (errors['min']) return `يجب أن تكون القيمة أكبر من أو تساوي ${errors['min'].min}`;
    if (errors['pattern']) return 'يرجى إدخال قيمة صحيحة';
    if (errors['minlength'])
      return `يجب أن يحتوي على الأقل ${errors['minlength'].requiredLength} أحرف`;
    if (errors['maxlength'])
      return `يجب ألا يزيد عن ${errors['maxlength'].requiredLength} حرف`;
    if (errors['maxFileSize']) return 'حجم الملف يجب ألا يتجاوز 2 ميجابايت';

    return '';
  }

  toggleSpecDropdown() {
    this.specOpen.update((v) => !v);
  }

  openSpecDropdown() {
    this.specOpen.set(true);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.tr-select-wrapper')) {
      this.specOpen.set(false);
    }
    if (
      !target.closest('.tr-country-wrapper')
    ) {
      this.countryOpen.set(false);
    }
    if (!target.closest('.tr-qual-wrapper')) {
      this.qualOpen.set(false);
    }
  }

  toggleSpecialization(spec: string) {
    const current = this.teacherForm.value.specializations ?? [];
    const idx = current.indexOf(spec);
    const updated = idx >= 0 ? current.filter((s) => s !== spec) : [...current, spec];
    this.teacherForm.controls.specializations.setValue(updated);
    this.teacherForm.controls.specializations.markAsDirty();
    this.teacherForm.controls.specializations.markAsTouched();
  }

  isSpecializationSelected(spec: string): boolean {
    return (this.teacherForm.value.specializations ?? []).includes(spec);
  }

  toggleQualDropdown() {
    this.qualOpen.update((v) => !v);
  }

  selectQualification(q: string) {
    this.teacherForm.controls.highestQualification.setValue(q);
    this.teacherForm.controls.highestQualification.markAsDirty();
    this.teacherForm.controls.highestQualification.markAsTouched();
    this.qualOpen.set(false);
  }

  toggleCountryDropdown() {
    this.countryOpen.update((v) => !v);
    if (this.countryOpen()) {
      this.countrySearch.set('');
    }
  }

  selectCountry(c: string) {
    this.teacherForm.controls.country.setValue(c);
    this.teacherForm.controls.country.markAsDirty();
    this.teacherForm.controls.country.markAsTouched();
    this.countryOpen.set(false);
  }

  onCountrySearchInput(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.countrySearch.set(value);
  }

  onCertificateAdd() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.jpeg,.png,.pdf';
    input.onchange = (event: Event) => {
      const el = event.target as HTMLInputElement;
      if (el.files && el.files.length > 0) {
        const file = el.files[0];
        if (file.size > 2 * 1024 * 1024) {
          this.errorMsg.set('حجم الملف يجب ألا يتجاوز 2 ميجابايت');
          setTimeout(() => this.errorMsg.set(''), 4000);
          return;
        }
        this.certificateFiles.update((list) => [
          ...list,
          { file, id: ++this.certFileIdCounter },
        ]);
      }
    };
    input.click();
  }

  removeCertificate(id: number) {
    this.certificateFiles.update((list) => list.filter((item) => item.id !== id));
  }

  onCVChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[input.files.length - 1];
      if (!file.name.toLowerCase().endsWith('.pdf')) {
        this.errorMsg.set('يُرجى اختيار ملف بصيغة PDF فقط');
        setTimeout(() => this.errorMsg.set(''), 4000);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        this.errorMsg.set('حجم الملف يجب ألا يتجاوز 2 ميجابايت');
        setTimeout(() => this.errorMsg.set(''), 4000);
        return;
      }
      this.cvFile.set(file);
    }
  }

  removeCV() {
    this.cvFile.set(null);
  }

  @Output() requestSubmitted = new EventEmitter<void>();

  private readonly router = inject(Router);

  isLoading = signal<boolean>(false);

  

  onSubmit() {
    if (this.teacherForm.invalid) {
      Object.values(this.teacherForm.controls).forEach((c) => {
        c.markAsTouched();
      });
      return;
    }
    this.isLoading.set(true);
    const formData = new FormData();
    const raw = this.teacherForm.getRawValue();
    formData.append('academicTitle', raw.academicTitle ?? '');
    formData.append('bio', raw.bio ?? '');
    formData.append('specializations', JSON.stringify(raw.specializations));
    formData.append('highestQualification', raw.highestQualification ?? '');
    formData.append('experienceYears', String(raw.experienceYears ?? ''));
    formData.append('previousInstitutions', raw.previousInstitutions ?? '');
    formData.append('previouslyTaughtCourses', raw.previouslyTaughtCourses ?? '');
    formData.append('teachingVideoUrl', raw.teachingVideoUrl ?? '');
    formData.append('teachingReason', raw.teachingReason ?? '');
    formData.append('phoneNumber', raw.phoneNumber ?? '');
    formData.append('country', raw.country ?? '');
    formData.append('additionalInfo', raw.additionalInfo ?? '');
    formData.append('declaration', raw.declaration ? 'true' : 'false');
    formData.append('userId', this.authService.getUserId()!)
    this.certificateFiles().forEach((item) => {
      formData.append('certificates', item.file);
    });
    if (this.cvFile()) {
      formData.append('cv', this.cvFile()!);
    }

    this.studentService.sendTeachingRequest(formData).subscribe({
      next: (res) => {
        console.log(res)
        this.isLoading.set(false);
        this.toast.show('تم أرسال طلبك بنجاح');
        this.requestSubmitted.emit();
      },
      error: (err) => {
        console.log(err);
        this.isLoading.set(false);
        this.toast.show('فشل الارسال, برجاء إعادة المحاولة لاحقا');
      }
    })
  }
}
