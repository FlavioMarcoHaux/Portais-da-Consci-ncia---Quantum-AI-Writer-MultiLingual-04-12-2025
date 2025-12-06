
import React, { useState } from 'react';
import { Chapter, Subchapter, MarketingData, PodcastData, ChatMessage, Language } from '../types';
import { TabManuscript } from './TabManuscript';
import { TabPodcast } from './TabPodcast';
import { TabChat } from './TabChat';
import { Menu } from 'lucide-react';

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
  
  onToggleSidebar: () => void; // Prop to open sidebar on mobile
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
  onUpdateChat,
  onToggleSidebar
}) => {
  const [activeTab, setActiveTab] = useState<'marketing' | 'podcast' | 'chat'>('marketing');

  return (
    <div className="flex-1 h-screen overflow-hidden bg-neutral-950 relative flex flex-col w-full">
      {/* Top Bar / Tabs */}
      <div className="border-b border-neutral-700 bg-[#020202] flex items-center px-4 md:px-8 pt-4 space-x-4 md:space-x-6 z-30 flex-shrink-0 shadow-md">
         
         {/* Hamburger Menu (Mobile Only) */}
         <button 
            onClick={onToggleSidebar}
            className="md:hidden text-white p-2 rounded-lg hover:bg-neutral-800 -ml-2 mr-2"
         >
            <Menu size={24} />
         </button>

         {/* Scrollable Tabs Container */}
         <div className="flex space-x-4 md:space-x-6 overflow-x-auto scrollbar-hide flex-1 md:flex-none no-scrollbar">
             <button 
                onClick={() => setActiveTab('marketing')}
                className={`pb-4 px-3 text-sm font-bold tracking-wider transition-all border-b-2 hover:bg-neutral-800 rounded-t-lg whitespace-nowrap ${activeTab === 'marketing' ? 'border-indigo-500 text-white shadow-[0_4px_20px_-10px_rgba(99,102,241,0.5)]' : 'border-transparent text-neutral-300 hover:text-white'}`}
             >
                MARKETING
             </button>
             <button 
                onClick={() => setActiveTab('podcast')}
                className={`pb-4 px-3 text-sm font-bold tracking-wider transition-all border-b-2 hover:bg-neutral-800 rounded-t-lg whitespace-nowrap ${activeTab === 'podcast' ? 'border-purple-500 text-white shadow-[0_4px_20px_-10px_rgba(168,85,247,0.5)]' : 'border-transparent text-neutral-300 hover:text-white'}`}
             >
                PODCAST
             </button>
             <button 
                onClick={() => setActiveTab('chat')}
                className={`pb-4 px-3 text-sm font-bold tracking-wider transition-all border-b-2 hover:bg-neutral-800 rounded-t-lg whitespace-nowrap ${activeTab === 'chat' ? 'border-cyan-500 text-white shadow-[0_4px_20px_-10px_rgba(6,182,212,0.5)]' : 'border-transparent text-neutral-300 hover:text-white'}`}
             >
                CHAT
             </button>
         </div>
         
         {/* Language Indicator - Hidden on very small screens if needed, or condensed */}
         <div className="hidden sm:block ml-auto text-[10px] md:text-xs text-neutral-300 uppercase font-bold tracking-widest border border-neutral-600 bg-neutral-900 px-2 py-1 md:px-3 md:py-1.5 rounded shadow-sm whitespace-nowrap">
            OUT: <span className="text-white">{language.toUpperCase()}</span>
         </div>
      </div>

      {/* Tab Content - Uses CSS hiding to persist state */}
      <div className="flex-1 overflow-hidden relative bg-[#050505] w-full">
          <div className={`h-full flex flex-col ${activeTab === 'marketing' ? '' : 'hidden'}`}>
              <TabManuscript 
                chapter={chapter} 
                subchapter={subchapter} 
                language={language}
                data={marketingData}
                onUpdate={onUpdateMarketing}
              />
          </div>

          <div className={`h-full flex flex-col ${activeTab === 'podcast' ? '' : 'hidden'}`}>
              <TabPodcast 
                chapter={chapter} 
                subchapter={subchapter} 
                language={language}
                data={podcastData}
                onUpdate={onUpdatePodcast}
              />
          </div>

          <div className={`h-full flex flex-col ${activeTab === 'chat' ? '' : 'hidden'}`}>
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
