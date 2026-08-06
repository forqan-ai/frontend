import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface AboutUsChallengeCard {
  title: string;
  description: string;
  iconClass: string;
}

export interface AboutUsPillarCard {
  title: string;
  description: string;
  iconClass: string;
}

export interface AboutUsOfferingCard {
  title: string;
  description: string;
  iconClass: string;
}

export interface AboutUsMethodologyStep {
  stepNumber: string;
  title: string;
  description: string;
}

export interface AboutUsValueCard {
  title: string;
  description: string;
  iconClass: string;
}

export interface AboutUsQualityPoint {
  title: string;
  description: string;
  iconClass: string;
}

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.css',
})

export class AboutUsComponent {
  readonly challengeCards: ReadonlyArray<AboutUsChallengeCard> = [
    {
      title: 'تشتت المصادر',
      description: 'وجود المحتوى في أماكن متعددة دون مسار واضح.',
      iconClass: 'bi-diagram-3-fill',
    },
    {
      title: 'صعوبة اختيار البداية',
      description: 'عدم معرفة الدورة أو المستوى المناسب للمتعلم.',
      iconClass: 'bi-signpost-split-fill',
    },
    {
      title: 'ضعف المتابعة',
      description: 'غياب وسيلة واضحة لمتابعة الدروس والتقدم والاستمرار.',
      iconClass: 'bi-graph-up-arrow',
    },
  ];

  readonly visionMissionPillars: ReadonlyArray<AboutUsPillarCard> = [
    {
      title: 'رؤيتنا',
      description:
        'أن تكون الفرقان بيئة تعليمية رقمية موثوقة وسهلة الاستخدام، تساعد مختلف الفئات على الوصول إلى العلوم الشرعية وتعلّمها بطريقة منظمة، مرنة وقابلة للاستمرار.',
      iconClass: 'bi-eye-fill',
    },
    {
      title: 'رسالتنا',
      description:
        'تقديم تجربة تعليمية تجمع بين المحتوى الواضح، والمعلمين المتخصصين، والمتابعة المستمرة، والتفاعل بين المتعلمين، مع الاستفادة من التقنيات الحديثة لتسهيل رحلة التعلّم.',
      iconClass: 'bi-bullseye',
    },
  ];

  readonly platformOfferings: ReadonlyArray<AboutUsOfferingCard> = [
    {
      title: 'دورات تعليمية منظمة',
      description:
        'دورات مقسمة إلى وحدات ودروس مرتبة، تساعد المتعلم على الانتقال من الأساسيات إلى الموضوعات الأكثر تقدمًا.',
      iconClass: 'bi-play-circle-fill',
    },
    {
      title: 'معلمون متخصصون',
      description:
        'ملفات تعريفية تساعد المتعلم على معرفة تخصصات المعلمين وخبراتهم واختيار المحتوى المناسب.',
      iconClass: 'bi-person-badge-fill',
    },
    {
      title: 'حلقات تعلم',
      description:
        'بيئة تعليمية جماعية تجمع المعلمين والمتعلمين، وتساعد على التفاعل والمراجعة وتبادل المعرفة.',
      iconClass: 'bi-people-fill',
    },
    {
      title: 'جلسات تعليمية مباشرة',
      description:
        'جلسات مباشرة مرتبطة بحلقات التعلم، تتيح للمتعلمين المشاركة والتواصل وفق المواعيد المتاحة.',
      iconClass: 'bi-camera-video-fill',
    },
    {
      title: 'متابعة التقدم',
      description:
        'أدوات تساعد المستخدم على معرفة الدورات والدروس التي أكملها، وما تبقى له في رحلته التعليمية.',
      iconClass: 'bi-graph-up-arrow',
    },
    {
      title: 'شهادات إتمام',
      description:
        'إمكانية الحصول على شهادة إتمام بعد استكمال الدورات التي تدعم إصدار الشهادات وتحقيق متطلباتها.',
      iconClass: 'bi-award-fill',
    },
  ];

  readonly methodologySteps: ReadonlyArray<AboutUsMethodologyStep> = [
    {
      stepNumber: '01',
      title: 'محتوى محدد وواضح',
      description:
        'يتم تقديم كل دورة بعنوان ووصف ومستوى يساعد المستخدم على معرفة ما إذا كانت مناسبة له قبل البدء.',
    },
    {
      stepNumber: '02',
      title: 'دروس مرتبة',
      description:
        'يتم تقسيم محتوى الدورة إلى وحدات ودروس، حتى يستطيع المتعلم متابعة الموضوعات بالترتيب المناسب.',
    },
    {
      stepNumber: '03',
      title: 'تعلّم مرن',
      description:
        'يستطيع المتعلم الوصول إلى المحتوى في الوقت المناسب له، والتقدم وفق سرعته وظروفه الشخصية.',
    },
    {
      stepNumber: '04',
      title: 'متابعة وإتمام',
      description:
        'يمكن للمستخدم متابعة ما أكمله من محتوى، ومعرفة تقدمه، والحصول على شهادة في الدورات المؤهلة لذلك.',
    },
  ];

  readonly platformValues: ReadonlyArray<AboutUsValueCard> = [
    {
      title: 'الوضوح',
      description:
        'تقديم المعلومات والمحتوى بطريقة منظمة تساعد المستخدم على معرفة خطوته التالية.',
      iconClass: 'bi-compass-fill',
    },
    {
      title: 'التبسيط',
      description:
        'تحويل رحلة التعلّم إلى خطوات سهلة دون تعقيد غير ضروري.',
      iconClass: 'bi-lightbulb-fill',
    },
    {
      title: 'الموثوقية',
      description:
        'الاهتمام بتخصص المعلمين ووضوح المحتوى قبل تقديمه للمتعلمين.',
      iconClass: 'bi-shield-check',
    },
    {
      title: 'المرونة',
      description:
        'إتاحة أكثر من طريقة للتعلّم بما يناسب أوقات المستخدمين ومستوياتهم المختلفة.',
      iconClass: 'bi-clock-history',
    },
    {
      title: 'الاستمرارية',
      description:
        'مساعدة المتعلم على متابعة تقدمه والعودة إلى رحلته التعليمية دون أن يفقد ما وصل إليه.',
      iconClass: 'bi-arrow-repeat',
    },
    {
      title: 'التفاعل',
      description:
        'تشجيع التواصل بين المتعلمين والمعلمين من خلال الحلقات والجلسات والمحتوى التفاعلي.',
      iconClass: 'bi-people-fill',
    },
  ];

  readonly qualityPoints: ReadonlyArray<AboutUsQualityPoint> = [
    {
      title: 'مراجعة طلبات المعلمين',
      description:
        'تمر طلبات الانضمام كمعلم بمراحل مراجعة قبل اعتماد الحساب وإتاحة خصائص التدريس.',
      iconClass: 'bi-person-check-fill',
    },
    {
      title: 'وضوح بيانات الدورات',
      description:
        'يتم عرض عنوان الدورة ووصفها ومستواها ومحتوياتها، حتى يستطيع المتعلم اتخاذ قرار مناسب قبل البدء.',
      iconClass: 'bi-card-checklist',
    },
    {
      title: 'تنظيم تجربة التعلّم',
      description:
        'يتم تقسيم المحتوى إلى وحدات ودروس، مع توفير وسائل لمتابعة التقدم والإكمال.',
      iconClass: 'bi-list-check',
    },
    {
      title: 'تطوير مستمر',
      description:
        'يتم تحسين المنصة وخصائصها بناءً على تجربة الاستخدام واحتياجات المتعلمين والمعلمين.',
      iconClass: 'bi-arrow-repeat',
    },
  ];
}



