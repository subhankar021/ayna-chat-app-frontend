export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'server';
  timestamp: Date;
}

export interface User {
  id: string;
  email: string;
}

export interface AuthFormData {
  email: string;
  password: string;
}