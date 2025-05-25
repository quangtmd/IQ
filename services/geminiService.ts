


// Fix: Import correct types from @google/genai
// Fix: Removed invalid non-English import.
import { GoogleGenAI, Chat, GenerateContentResponse, GenerateContentParameters, Part, Content } from "@google/genai"; // Added Part, Content
import { API_KEY_ERROR_MESSAGE } from '../constants';
import { AIBuildResponse, ChatMessage, GroundingChunk } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.error(API_KEY_ERROR_MESSAGE);
}
const ai = new GoogleGenAI({ apiKey: API_KEY || "MISSING_API_KEY" });

const CHAT_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
const BUILDER_MODEL_NAME = 'gemini-2.5-flash-preview-04-17';
const IMAGE_MODEL_NAME = 'imagen-3.0-generate-002';

let chatInstance: Chat | null = null;

// Fix: Change history type from GenerateContentParameters[] to Content[]
export const startChat = (history?: Content[], systemInstruction?: string): Chat => {
  if (!API_KEY) throw new Error(API_KEY_ERROR_MESSAGE);
  chatInstance = ai.chats.create({
    model: CHAT_MODEL_NAME,
    history: history || [],
    config: {
      systemInstruction: systemInstruction || "You are a helpful AI assistant for a PC components and IT services store. You can answer questions about products, services, and provide basic technical support. Please answer in Vietnamese.",
      thinkingConfig: { thinkingBudget: 0 } 
    },
  });
  return chatInstance;
};

export const sendMessageToChatStream = async (
  message: string,
  currentChatInstance?: Chat
// Fix: Change GenerateContentStreamResult to AsyncIterable<GenerateContentResponse>
): Promise<AsyncIterable<GenerateContentResponse>> => {
  if (!API_KEY) throw new Error(API_KEY_ERROR_MESSAGE);
  const chatToUse = currentChatInstance || chatInstance;
  if (!chatToUse) {
    throw new Error("Chat not initialized. Call startChat first.");
  }
  try {
    // For text-only, sending message directly is fine
    return await chatToUse.sendMessageStream({ message });
  } catch (error) {
    console.error("Error sending message to Gemini (stream):", error);
    throw error;
  }
};

export const generatePCBuildRecommendation = async (
  useCase: string,
  budget: string,
  currentComponents?: Record<string, string>
): Promise<AIBuildResponse> => {
  if (!API_KEY) throw new Error(API_KEY_ERROR_MESSAGE);

  let prompt = `Tôi cần xây dựng một cấu hình PC.
Nhu cầu sử dụng: ${useCase}.
Ngân sách: ${budget}.`;

  if (currentComponents && Object.keys(currentComponents).length > 0) {
    prompt += "\nCác linh kiện đã có hoặc ưu tiên:";
    for (const [key, value] of Object.entries(currentComponents)) {
      if (value) prompt += `\n- ${key}: ${value}`;
    }
  }

  prompt += `\nHãy đề xuất một cấu hình PC tương thích bao gồm CPU, Bo mạch chủ (Motherboard), RAM (ghi rõ dung lượng và tốc độ), GPU (Card đồ họa), SSD (ghi rõ dung lượng), PSU (Nguồn - ghi rõ công suất), và Vỏ máy (Case).
Cung cấp phản hồi dưới dạng một đối tượng JSON với các khóa: 'cpu', 'motherboard', 'ram', 'gpu', 'ssd', 'psu', 'case'. Mỗi khóa này nên là một đối tượng chứa hai khóa con: 'name' (tên linh kiện cụ thể) và 'reasoning' (lý do ngắn gọn chọn linh kiện đó).
Ví dụ: { "cpu": { "name": "AMD Ryzen 5 5600X", "reasoning": "Hiệu năng tốt cho gaming tầm trung." }, ... }.
Nếu ngân sách quá thấp cho nhu cầu sử dụng, hãy trả về JSON có dạng { "error": "Ngân sách quá thấp cho nhu cầu này." }.`;
  
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: BUILDER_MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    let jsonStr = response.text.trim();
    const fenceRegex = /^\`\`\`(\w*)?\s*\n?(.*?)\n?\s*\`\`\`$/s;
    const match = jsonStr.match(fenceRegex);
    if (match && match[2]) {
      jsonStr = match[2].trim();
    }
    
    return JSON.parse(jsonStr) as AIBuildResponse;

  } catch (error) {
    console.error("Error generating PC build recommendation:", error);
    if (error instanceof Error && error.message.includes("JSON")) {
         return { error: "AI đã trả về định dạng không hợp lệ. Vui lòng thử lại." };
    }
    return { error: "Đã xảy ra lỗi khi nhận đề xuất từ AI. Vui lòng thử lại." };
  }
};

export const generateTextWithGoogleSearch = async (
  prompt: string
): Promise<{ text: string; groundingChunks?: GroundingChunk[] }> => {
  if (!API_KEY) throw new Error(API_KEY_ERROR_MESSAGE);
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: CHAT_MODEL_NAME, 
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
    return {
      text: response.text,
      groundingChunks: groundingMetadata?.groundingChunks as GroundingChunk[] || undefined
    };
  } catch (error) {
    console.error("Error generating text with Google Search:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  if (!API_KEY) throw new Error(API_KEY_ERROR_MESSAGE);
  try {
    const response = await ai.models.generateImages({
        model: IMAGE_MODEL_NAME,
        prompt: prompt,
        config: {numberOfImages: 1, outputMimeType: 'image/jpeg'},
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const sendMessageWithImage = async (
  textPrompt: string,
  base64ImageData: string,
  mimeType: string,
  currentChatInstance?: Chat
): Promise<AsyncIterable<GenerateContentResponse>> => {
  if (!API_KEY) throw new Error(API_KEY_ERROR_MESSAGE);
  const chatToUse = currentChatInstance || chatInstance;
  if (!chatToUse) {
    throw new Error("Chat not initialized. Call startChat first.");
  }

  const imagePart: Part = {
    inlineData: {
      mimeType: mimeType,
      data: base64ImageData,
    },
  };
  const textPart: Part = { text: textPrompt };

  try {
    // Fix: Pass Parts array to the 'message' property of SendMessageParameters
    // The `message` property of SendMessageParameters can be string | Part[]
    return await chatToUse.sendMessageStream({ message: [textPart, imagePart] });
  } catch (error) {
    console.error("Error sending message with image to Gemini (stream):", error);
    throw error;
  }
};

export default {
  startChat,
  sendMessageToChatStream,
  generatePCBuildRecommendation,
  generateTextWithGoogleSearch,
  generateImage,
  sendMessageWithImage,
};