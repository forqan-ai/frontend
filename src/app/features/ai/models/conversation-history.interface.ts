import { IChatMessage } from "./chat-message.interface";

export interface IConversationHistory {
    conversationId: string;
  messages: IChatMessage[];
}
