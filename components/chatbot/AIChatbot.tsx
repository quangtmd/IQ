import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChatMessage as ChatMessageType, GroundingChunk } from '../../types';
import ChatMessage from './ChatMessage';
import Button from '../ui/Button';
import geminiService from '../../services/geminiService';
import { Chat, GenerateContentResponse, Part } from '@google/genai'; // Added Part
import { API_KEY_ERROR_MESSAGE, COMPANY_PHONE } from '../../constants';

const AIChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatSession, setChatSession] = useState<Chat | null>(null);
  const [currentBotMessageId, setCurrentBotMessageId] = useState<string | null>(null);
  const [currentGroundingChunks, setCurrentGroundingChunks] = useState<GroundingChunk[] | undefined>(undefined);
  const [isChatInitialized, setIsChatInitialized] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);
  
  const initializeChat = useCallback(async () => {
    if (isChatInitialized || !isOpen) return;
    setIsLoading(true);
    setError(null);
    try {
      const newChatSession = geminiService.startChat([], "Bạn là một trợ lý AI hữu ích cho cửa hàng linh kiện PC và dịch vụ IT tên là IQ Technology. Hãy trả lời bằng tiếng Việt.");
      setChatSession(newChatSession);
      setMessages([{ 
        id: Date.now().toString(), 
        text: "Xin chào! Tôi là trợ lý AI của IQ Technology. Tôi có thể giúp gì cho bạn về sản phẩm hoặc dịch vụ?",
        sender: 'bot', 
        timestamp: new Date() 
      }]);
      setIsChatInitialized(true);
    } catch (err) {
      console.error("Failed to initialize chat:", err);
      const specificError = (err instanceof Error && err.message === API_KEY_ERROR_MESSAGE) ? API_KEY_ERROR_MESSAGE : "Không thể khởi tạo chatbot. Vui lòng thử lại sau.";
      setError(specificError);
      setMessages([{
        id: Date.now().toString(),
        text: `Lỗi: ${specificError}`,
        sender: 'system',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  }, [isOpen, isChatInitialized]);


  useEffect(() => {
    if (isOpen && !isChatInitialized) {
      initializeChat();
    }
  }, [isOpen, isChatInitialized, initializeChat]);


  const handleSendMessage = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault();
    if (!input.trim() || isLoading || !chatSession) return;

    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);
    setCurrentGroundingChunks(undefined);

    const botMessageId = `bot-${Date.now()}`;
    setCurrentBotMessageId(botMessageId);
    setMessages((prev) => [
      ...prev,
      { id: botMessageId, text: '', sender: 'bot', timestamp: new Date() },
    ]);

    try {
      // Use sendMessageToChatStream for text-only messages
      const stream: AsyncIterable<GenerateContentResponse> = await geminiService.sendMessageToChatStream(input, chatSession);
      let currentText = '';
      for await (const chunk of stream) {
        currentText += chunk.text; // Ensure chunk.text is accessed correctly
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.id === botMessageId ? { ...msg, text: currentText } : msg
          )
        );
         if (chunk.candidates?.[0]?.groundingMetadata?.groundingChunks) {
          setCurrentGroundingChunks(chunk.candidates[0].groundingMetadata.groundingChunks as GroundingChunk[]);
        }
      }
    } catch (err) {
      console.error("Error sending message:", err);
      const errorText = err instanceof Error ? err.message : "Đã xảy ra lỗi khi gửi tin nhắn.";
      setError(errorText);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === botMessageId ? { ...msg, text: `Lỗi: ${errorText}`, sender: 'system' } : msg
        )
      );
    } finally {
      setIsLoading(false);
      setCurrentBotMessageId(null); 
    }
  };

  if (!process.env.API_KEY) {
     return (
      <div className="fixed bottom-4 right-4 z-[60]"> {/* Ensure buttons are above chat window */}
        <div className="flex flex-col items-center space-y-3">
            <a 
              href={`tel:${COMPANY_PHONE.replace(/\./g, '')}`}
              className="bg-green-500 text-white rounded-full p-3 shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center animate-subtle-beat"
              aria-label="Call Now"
            >
              <i className="fas fa-phone-alt text-xl"></i>
            </a>
            <Button 
                variant="primary" 
                onClick={() => alert(API_KEY_ERROR_MESSAGE)}
                leftIcon={<i className="fas fa-robot"></i>}
                className="rounded-full p-3 h-14 w-14 flex items-center justify-center"
            >
               <i className="fas fa-comments text-2xl"></i>
            </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-center space-y-3">
         <a 
            href={`tel:${COMPANY_PHONE.replace(/\./g, '')}`}
            className={`bg-green-500 text-white rounded-full p-3.5 shadow-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100 animate-subtle-beat'}`}
            aria-label="Call Now"
          >
            <i className="fas fa-phone-alt text-xl"></i>
        </a>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-dark transition-all duration-300 ${isOpen ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}`}
          aria-label="Toggle Chatbot"
        >
          <i className="fas fa-comments text-2xl"></i>
        </button>
      </div>

      <div
        className={`fixed bottom-0 right-0 sm:bottom-6 sm:right-6 bg-bgBase rounded-t-lg sm:rounded-lg shadow-xl w-full sm:w-96 h-[70vh] sm:h-[calc(100vh-10rem)] max-h-[600px] flex flex-col z-50 transition-all duration-300 ease-in-out transform border border-borderDefault ${
          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-full sm:translate-y-16 opacity-0 pointer-events-none'
        }`}
      >
        <header className="bg-primary text-white p-4 flex justify-between items-center rounded-t-lg sm:rounded-t-lg">
          <h3 className="font-semibold text-lg">AI Chatbot IQ Technology</h3>
          <button onClick={() => setIsOpen(false)} className="text-xl hover:text-red-100">
            <i className="fas fa-times"></i>
          </button>
        </header>

        <div className="flex-grow p-4 overflow-y-auto bg-bgCanvas"> {/* Message area */}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} groundingChunks={msg.id === currentBotMessageId ? currentGroundingChunks : undefined} />
          ))}
          <div ref={messagesEndRef} />
          {error && <div className="text-danger-text text-sm p-2 bg-danger-bg rounded border border-danger-border">{error}</div>}
        </div>

        <form onSubmit={handleSendMessage} className="p-4 border-t border-borderDefault bg-bgBase">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn..."
              className="flex-grow bg-white border border-borderStrong text-textBase rounded-lg p-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none placeholder:text-textSubtle"
              disabled={isLoading || !isChatInitialized}
            />
            <Button type="submit" isLoading={isLoading} disabled={isLoading || !input.trim() || !isChatInitialized}>
              <i className="fas fa-paper-plane"></i>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AIChatbot;