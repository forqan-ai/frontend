import { IModuleLessonDto } from "./module-lesson-dto.interface";

export interface ICourseModuleDto {
    title: string;
    durationSec: number;
    isOpen: boolean;
    moduleLessons: IModuleLessonDto[]
}
