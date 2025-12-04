
import React, { useState } from 'react';
import { Chapter, Subchapter, MarketingData, PodcastData, ChatMessage, Language } from '../types';
import { TabManuscript } from './TabManuscript';
import { TabPodcast } from './TabPodcast';
import { TabChat } from './TabChat';

interface ContentAreaProps {
  chapter: Chapter | null;
  subchapter: Subchapter | null;
  language: Language;
  
  marketingData: MarketingData;
  podcastData: PodcastData;
  chatHistory: ChatMessage[];

  onUpdateMarketing: (data: Partial<MarketingData>) => void;
  onUpdatePodcast: (data: Partial<PodcastData>) => void;
  onUpdateChat: (history: ChatMessage[]) => void;
}

export const ContentArea: React.FC<ContentAreaProps> = ({ 
  chapter, 
  subchapter,
  language, 
  marketingData,
  podcastData,
  chatHistory,
  onUpdateMarketing,
  onUpdatePodcast,
  onUpdateChat
}) => {
  const [activeTab, setActiveTab] = useState<'marketing' | 'podcast' | 'chat'>('marketing');

  return (
    <div className="flex-1 h-screen overflow-hidden bg-neutral-950 relative flex flex-col">
      {/* Top Bar / Tabs */}
      <div className="border-b border-neutral-700 bg-[#020202] flex items-center px-8 pt-4 space-x-6 z-50 flex-shrink-0 shadow-md">
         <button 
            onClick={() => setActiveTab('marketing')}
            className={`pb-4 px-3 text-sm font-bold tracking-wider transition-all border-b-2 hover:bg-neutral-800 rounded-t-lg ${activeTab === 'marketing' ? 'border-indigo-500 text-white shadow-[0_4px_20px_-10px_rgba(99,102,241,0.5)]' : 'border-transparent text-neutral-300 hover:text-white'}`}
         >
            MARKETING & VISUALS
         </button>
         <button 
            onClick={() => setActiveTab('podcast')}
            className={`pb-4 px-3 text-sm font-bold tracking-wider transition-all border-b-2 hover:bg-neutral-800 rounded-t-lg ${activeTab === 'podcast' ? 'border-purple-500 text-white shadow-[0_4px_20px_-10px_rgba(168,85,247,0.5)]' : 'border-transparent text-neutral-300 hover:text-white'}`}
         >
            PODCAST STUDIO
         </button>
         <button 
            onClick={() => setActiveTab('chat')}
            className={`pb-4 px-3 text-sm font-bold tracking-wider transition-all border-b-2 hover:bg-neutral-800 rounded-t-lg ${activeTab === 'chat' ? 'border-cyan-500 text-white shadow-[0_4px_20px_-10px_rgba(6,182,212,0.5)]' : 'border-transparent text-neutral-300 hover:text-white'}`}
         >
            CHAT QUÂNTICO
         </button>
         
         {/* Language Indicator */}
         <div className="ml-auto text-xs text-neutral-300 uppercase font-bold tracking-widest border border-neutral-600 bg-neutral-900 px-3 py-1.5 rounded shadow-sm">
            Output: <span className="text-white">{language === 'pt' ? 'PORTUGUÊS' : language === 'en' ? 'ENGLISH' : 'ESPAÑOL'}</span>
         </div>
      </div>

      {/* Tab Content - Uses CSS hiding to persist state */}
      <div className="flex-1 overflow-hidden relative bg-[#050505]">
          <div className={activeTab === 'marketing' ? 'h-full flex flex-col' : 'hidden'}>
              <TabManuscript 
                chapter={chapter} 
                subchapter={subchapter} 
                language={language}
                data={marketingData}
                onUpdate={onUpdateMarketing}
              />
          </div>

          <div className={activeTab === 'podcast' ? 'h-full flex flex-col' : 'hidden'}>
              <TabPodcast 
                chapter={chapter} 
                subchapter={subchapter} 
                language={language}
                data={podcastData}
                onUpdate={onUpdatePodcast}
              />
          </div>

          <div className={activeTab === 'chat' ? 'h-full flex flex-col' : 'hidden'}>
              <TabChat 
                 history={chatHistory}
                 language={language}
                 onUpdate={onUpdateChat}
              />
          </div>
      </div>
    </div>
  );
};
