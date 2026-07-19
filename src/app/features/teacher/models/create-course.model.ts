export interface CreateCourse {
  title: string;
  subtitle: string;
  description: string;

  categoryID: string;

  level: number;
  levelAr: number;

  language: number;
  languageAr: number;

  price: number;

  thumbnail?: File;
}
