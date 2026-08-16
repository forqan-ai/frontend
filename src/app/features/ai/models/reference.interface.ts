import { ContentType } from '../enums/content-type';

export interface IReference {
  timestamp?: number;
  pageNumber?: number;
  mediaType?: ContentType;
}