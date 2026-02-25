import React, { useState, useRef, useEffect } from 'react';
// Always use import {GoogleGenAI} from "@google/genai";
import {GoogleGenAI} from "@google/genai";
import { AppData } from '../../types';
import SectionHeader from '../SectionHeader';
import { PageTransition } from '../CommonLayout';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export const AIHistorian: React.FC<{ data: AppData }> = ({ data }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: `مرحباً بك يا سليل المجد! أنا مساعد أواصر الذكي. كيف يمكنني مساعدتك اليوم في معرفة تاريخ عائلة ${data.founderName}؟` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsTyping(true);

    try {
      // Create a new GoogleGenAI instance right before making an API call to ensure current credentials.
      // Use named parameter for apiKey and obtain it exclusively from process.env.API_KEY.
      const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
      
      const systemInstruction = `أنت الخبير العائلي لذرية ${data.founderName}. استخدم نبرة محترمة وفخورة. بياناتك: ${data.founderBio}. قصة العائلة: ${data.featuredStoryText}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMessage,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      // Extract text directly from .text property (not a method).
      const aiText = response.text || "عذراً يا سليل الكرام، لم أستطع استحضار الرد حالياً.";
      setMessages(prev => [...prev, { role: 'model', text: aiText }]);
    } catch (error) {
      console.error("Gemini Error:", error);
      setMessages(prev => [...prev, { role: 'model', text: "يبدو أنني بحاجة لبعض الوقت لاستجماع أفكاري. تأكد من إعدادات الربط وحاول مجدداً." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <PageTransition>
      <div className="pt-40 container mx-auto px-6 mb-40 text-right" dir="rtl">
        <SectionHeader title="الخبير العائلي الذكي" subtitle="اسأل مساعدنا الذكي عن تاريخ العائلة والجذور." />
        <div className="max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[600px] border border-slate-100 dark:border-slate-800">
          <div className="bg-emerald-600 p-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-xl">✨</div>
              <h3 className="font-black">مساعد أواصر الذكي</h3>
            </div>
          </div>
          <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[80%] p-4 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-slate-200 dark:bg-slate-800' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-900 dark:text-emerald-100'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && <div className="text-left text-xs text-emerald-600 animate-pulse">جاري الكتابة...</div>}
          </div>
          <form onSubmit={handleSend} className="p-4 bg-white dark:bg-slate-900 border-t flex gap-2">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="اطرح سؤالك هنا..." className="flex-grow bg-slate-100 dark:bg-slate-800 p-3 rounded-xl outline-none dark:text-white" />
            <button type="submit" className="bg-emerald-600 text-white px-6 rounded-xl font-black">إرسال</button>
          </form>
        </div>
      </div>
    </PageTransition>
  );
};