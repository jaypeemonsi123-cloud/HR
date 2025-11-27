import React, { useState } from 'react';
import { generateHRResponse } from '../services/aiService';
import { Bot, Send, Sparkles, Loader2 } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAsk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse('');
    
    try {
      const result = await generateHRResponse(query);
      setResponse(result);
    } catch (err) {
      setResponse("Sorry, I encountered an error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Sparkles size={24} className="text-yellow-300" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Nexus AI Assistant</h2>
            <p className="text-blue-100 text-sm">Your intelligent HR companion powered by Gemini</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {!response && !isLoading && (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-400 space-y-4">
             <Bot size={64} className="opacity-20" />
             <div>
               <p className="text-lg font-medium text-slate-600">How can I help you today?</p>
               <p className="text-sm">Try asking about policy drafts, email templates, or interview questions.</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl mt-8">
               {["Draft a rejection letter", "Explain FMLA simply", "Team building ideas", "Interview questions for React Dev"].map(suggestion => (
                 <button key={suggestion} onClick={() => setQuery(suggestion)} className="p-3 bg-slate-50 border border-slate-100 rounded-lg hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 text-sm transition-all text-left">
                   {suggestion}
                 </button>
               ))}
             </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <Loader2 size={40} className="text-blue-600 animate-spin" />
            <p className="text-slate-500 animate-pulse">Thinking...</p>
          </div>
        )}

        {response && (
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 prose prose-slate max-w-none">
            <div className="flex items-center gap-2 mb-4 text-blue-600 font-medium">
               <Bot size={20} /> Nexus AI Response:
            </div>
            <div className="whitespace-pre-wrap leading-relaxed text-slate-700">
              {response}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-200">
        <form onSubmit={handleAsk} className="relative">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm outline-none"
            placeholder="Ask anything about HR..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={isLoading || !query.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AIAssistant;