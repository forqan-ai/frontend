import { ISource } from "./source.interface";

export interface IChatResponse {
  conversationId: string;
  answer: string;
  source?: ISource;
}

