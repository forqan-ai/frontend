import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

export type HelpCategory =
  | 'all'
  | 'account'
  | 'courses'
  | 'payments'
  | 'sessions'
  | 'teachers';

export interface HelpTopic {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: HelpCategory;
}

export interface HelpFaq {
  id: string;
  category: Exclude<HelpCategory, 'all'>;
  question: string;
  answer: string;
  keywords: string[];
}

function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u064B-\u0652]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي');
}

@Component({
  selector: 'app-help-center',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './help-center.component.html',
  styleUrl: './help-center.component.css',
})
export class HelpCenterComponent {
  searchInput = '';
  searchQuery = '';
  activeCategory: HelpCategory = 'all';
  openFaqId: string | null = 'email-verification';

  readonly categories: { id: HelpCategory; label: string }[] = [
    { id: 'all', label: 'الكل' },
    { id: 'account', label: 'الحساب' },
    { id: 'courses', label: 'الدورات' },
    { id: 'payments', label: 'الدفع والنقاط' },
    { id: 'sessions', label: 'الجلسات' },
    { id: 'teachers', label: 'المعلمون' },
  ];

  readonly topics: HelpTopic[] = [
    {
      id: 'account',
      title: 'الحساب وتسجيل الدخول',
      description: 'إنشاء الحساب، تأكيد البريد الإلكتروني، تسجيل الدخول، استعادة كلمة المرور وتحديث البيانات.',
      icon: 'bi-person-lock',
      category: 'account',
    },
    {
      id: 'courses',
      title: 'الدورات والشهادات',
      description: 'الاشتراك في الدورات، متابعة الدروس، معرفة نسبة التقدم والحصول على شهادة الإتمام.',
      icon: 'bi-book',
      category: 'courses',
    },
    {
      id: 'payments',
      title: 'الدفع وباقات النقاط',
      description: 'عمليات الدفع، شراء باقات النقاط، متابعة حالة العملية والإلغاء أو الاسترداد.',
      icon: 'bi-credit-card',
      category: 'payments',
    },
    {
      id: 'sessions',
      title: 'الجلسات والحجوزات',
      description: 'حجز الجلسات التعليمية، اختيار الموعد، متابعة الحجز أو إلغاؤه والتواصل مع المعلم.',
      icon: 'bi-calendar-check',
      category: 'sessions',
    },
    {
      id: 'circles',
      title: 'حلقات العلم والمحادثات',
      description: 'الانضمام إلى الحلقات، متابعة المنشورات، استخدام المحادثات وإدارة الإشعارات.',
      icon: 'bi-people',
      category: 'all',
    },
    {
      id: 'teachers',
      title: 'المعلمون والتقديم كمعلم',
      description: 'البحث عن معلم، مشاهدة ملفه، حجز جلسة معه، ومعرفة خطوات التقديم كمعلم.',
      icon: 'bi-person-badge',
      category: 'teachers',
    },
  ];

  readonly faqs: HelpFaq[] = [
    {
      id: 'email-verification',
      category: 'account',
      question: 'لم تصلني رسالة تأكيد البريد الإلكتروني، ماذا أفعل؟',
      answer:
        'تأكد من كتابة البريد بصورة صحيحة، ثم افحص صندوق الرسائل غير المرغوب فيها. إذا كان خيار إعادة الإرسال متاحًا، انتظر قليلًا ثم أعد إرسال رسالة التأكيد.',
      keywords: ['البريد', 'التأكيد', 'رسالة', 'حساب', 'تأكيد البريد'],
    },
    {
      id: 'password-recovery',
      category: 'account',
      question: 'كيف أستعيد كلمة المرور؟',
      answer:
        'من صفحة تسجيل الدخول اختر «نسيت كلمة المرور»، ثم اكتب البريد المرتبط بحسابك واتبع التعليمات التي تصلك عبر البريد الإلكتروني.',
      keywords: ['كلمة المرور', 'نسيت', 'تسجيل الدخول', 'الحساب', 'استعادة'],
    },
    {
      id: 'enroll-course',
      category: 'courses',
      question: 'كيف أشترك في دورة وأبدأ مشاهدة الدروس؟',
      answer:
        'افتح صفحة الدورة وراجع تفاصيلها، ثم أكمل خطوات الاشتراك. بعد نجاح العملية ستتمكن من الوصول إلى محتوى الدورة من حسابك.',
      keywords: ['دورة', 'الاشتراك', 'الدروس', 'المحتوى', 'مشاهدة'],
    },
    {
      id: 'course-certificate',
      category: 'courses',
      question: 'متى يمكنني الحصول على شهادة إتمام الدورة؟',
      answer:
        'تظهر شهادة الإتمام عند استكمال الدروس والمتطلبات المحددة للدورة. يمكنك متابعة نسبة تقدمك من صفحة الدورة داخل حسابك.',
      keywords: ['شهادة', 'إتمام', 'التقدم', 'الدورة', 'الحصول'],
    },
    {
      id: 'payment-issue',
      category: 'payments',
      question: 'تم خصم قيمة الدفع ولكن العملية لم تظهر في حسابي، ماذا أفعل؟',
      answer:
        'لا تكرر عملية الدفع مباشرة. احتفظ برقم العملية وتاريخها وقيمتها، ثم تواصل مع فريق الدعم من البريد المرتبط بحسابك.',
      keywords: ['الدفع', 'خصم', 'عملية', 'النقاط', 'الرصيد', 'شراء'],
    },
    {
      id: 'book-session',
      category: 'sessions',
      question: 'كيف أحجز جلسة تعليمية مع أحد المعلمين؟',
      answer:
        'افتح ملف المعلم، اختر الجلسة والموعد المتاح، ثم أكمل خطوات الحجز والتأكيد الظاهرة أمامك.',
      keywords: ['جلسة', 'حجز', 'موعد', 'معلم', 'تعليمية'],
    },
    {
      id: 'forqan-points',
      category: 'payments',
      question: 'ما هي نقاط الفرقان وكيف أستخدمها؟',
      answer:
        'يمكن شراء باقات النقاط واستخدام الرصيد في الخدمات التي تعرض تكلفة بالنقاط. يمكنك متابعة رصيدك والعمليات من حسابك.',
      keywords: ['النقاط', 'باقات', 'الرصيد', 'شراء', 'الفرقان'],
    },
    {
      id: 'apply-teacher',
      category: 'teachers',
      question: 'كيف يمكنني التقديم كمعلم في المنصة؟',
      answer:
        'افتح صفحة التقديم كمعلم، وأدخل البيانات المطلوبة بدقة. ستتمكن من متابعة حالة الطلب من حسابك بعد إرساله.',
      keywords: ['معلم', 'التقديم', 'طلب', 'التدريس', 'المعلمون'],
    },
  ];

  applySearch(): void {
    this.searchQuery = this.searchInput.trim();
  }

  selectCategory(category: HelpCategory): void {
    this.activeCategory = category;
  }

  onTopicClick(category: HelpCategory): void {
    this.selectCategory(category);
    const el = document.getElementById('faqs');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  toggleFaq(id: string): void {
    this.openFaqId = this.openFaqId === id ? null : id;
  }

  get filteredFaqs(): HelpFaq[] {
    const normQuery = normalizeArabicText(this.searchQuery);

    return this.faqs.filter((faq) => {
      const categoryMatch =
        this.activeCategory === 'all' || faq.category === this.activeCategory;
      if (!categoryMatch) return false;

      if (!normQuery) return true;

      const normQ = normalizeArabicText(faq.question);
      const normA = normalizeArabicText(faq.answer);
      const normKeywords = faq.keywords.map((k) => normalizeArabicText(k));

      return (
        normQ.includes(normQuery) ||
        normA.includes(normQuery) ||
        normKeywords.some((k) => k.includes(normQuery))
      );
    });
  }
}
