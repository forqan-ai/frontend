import { ContentType } from "../enums/content-type";
import { IReference } from "./reference.interface";
export interface ISource {
  contentId: string;
  contentTitle: string;
  type: ContentType;
  references: IReference[];
}