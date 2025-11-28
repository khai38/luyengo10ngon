
import { GoogleGenAI } from "@google/genai";
import { Lesson } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePracticeContent = async (topic: string): Promise<Lesson | null> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      Hãy tạo một bài luyện gõ phím tiếng Việt.
      Chủ đề: ${topic}.
      Độ dài: khoảng 30-50 từ.
      Yêu cầu: Chỉ trả về nội dung văn bản thuần túy để gõ, không có tiêu đề, không có markdown, không có lời dẫn.
      Văn bản NÊN chia thành 2-3 dòng ngắn gọn để luyện phím Enter.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    const text = response.text?.trim() || "";
    
    if (!text) return null;

    return {
      id: `gen-${Date.now()}`,
      groupId: 'gen',
      groupTitle: 'Bài tập AI',
      title: `Luyện tập: ${topic}`,
      description: 'Bài tập được tạo bởi AI',
      content: text,
      difficulty: 'medium',
      category: 'generated'
    };
  } catch (error) {
    console.error("Error generating content:", error);
    return null;
  }
};
