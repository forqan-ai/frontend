import { MessageRole } from "../enums/message-role";

export interface IChatMessage {
  role: MessageRole;
  content: string;
  createdAt: string;
}