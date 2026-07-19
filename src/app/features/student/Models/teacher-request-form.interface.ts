import { FormControl } from "@angular/forms";

export interface ITeacherRequestForm {
    academicTitle: FormControl<string | null>;
    bio: FormControl<string | null>;
    specializations: FormControl<string[] | null>;
    highestQualification: FormControl<string | null>;
    experienceYears: FormControl<number | null>;
    previousInstitutions: FormControl<string | null>;
    previouslyTaughtCourses: FormControl<string | null>;
    teachingVideoUrl: FormControl<string | null>;
    teachingReason: FormControl<string | null>;
    phoneNumber: FormControl<string | null>;
    country: FormControl<string | null>;
    additionalInfo: FormControl<string | null>;
    declaration: FormControl<boolean | null>;
}