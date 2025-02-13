import { Message } from '../types';

const RESPONSE_DELAY = 1000;

const responses = [
  "Hello! How can I assist you today?",
  "That's interesting! Tell me more.",
  "I understand. Is there anything specific you'd like to know?",
  "I'm here to help! What would you like to discuss?",
  "That's a great question! Let me help you with that.",
];

export function sendMessageToServer(message: string): Promise<Message> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = responses[Math.floor(Math.random() * responses.length)];
      resolve({
        id: Math.random().toString(36).substring(7),
        text: response,
        sender: 'server',
        timestamp: new Date(),
      });
    }, RESPONSE_DELAY);
  });
}