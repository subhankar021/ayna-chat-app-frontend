import React, { useState, useRef, useEffect } from 'react';
import { Send, LogOut } from 'lucide-react';
import { Message } from '../backend/types';
import { ChatMessage } from './components/ChatMessage';
import { AuthForm } from './components/AuthForm';
import { auth, messages } from '../backend';

function App() {
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(auth.getUser());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        loadMessages();
      } else {
        setMessageList([]);
      }
    });
  }, []);

  const loadMessages = async () => {
    try {
      const data = await messages.getAll();
      setMessageList(data);
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messageList]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading || !user) return;

    const messageText = inputText.trim();
    setInputText('');
    setIsLoading(true);

    // Optimistic update
    const timestamp = new Date();
    const optimisticMessages = [
      {
        id: `temp-${timestamp.getTime()}-user`,
        text: messageText,
        sender: 'user' as const,
        timestamp,
      },
      {
        id: `temp-${timestamp.getTime()}-server`,
        text: messageText,
        sender: 'server' as const,
        timestamp: new Date(timestamp.getTime() + 1),
      },
    ];

    setMessageList(prev => [...prev, ...optimisticMessages]);

    try {
      await messages.send(messageText, user.id);
      await loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      // Revert optimistic update on error
      setMessageList(prev => prev.filter(msg => !msg.id.startsWith('temp-')));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
  };

  if (!user) {
    return <AuthForm onSuccess={() => {}} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Chat Application</h1>
        <button
          onClick={handleLogout}
          className="text-gray-600 hover:text-gray-800 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto">
          {messageList.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="max-w-3xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 caret-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default App;