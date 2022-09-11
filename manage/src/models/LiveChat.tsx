export interface Message {
  sender: string;
  content: string;
}

export interface Client {
  room: string;
  name: string;
  isActive: boolean;
  messages: Message[];
  unread: number;
}
