
import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ContentArea } from './components/ContentArea';
import { BOOK_STRUCTURE } from './constants';
import { Chapter, Subchapter, MarketingData, PodcastData, ChatMessage, Language } from './types';

function App() {
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentSubchapter, setCurrentSubchapter] = useState<Subchapter | null>(null);
  const [language, setLanguage] = useState<Language>('pt');
  
  // ------------------------------------------------------------------
  // GLOBAL STATE MANAGEMENT (Data Persistence)
  // ------------------------------------------------------------------

  // 1. Marketing & Visuals Cache
  const [marketingCache, setMarketingCache] = useState<Record<string, MarketingData>>(() => {
    try {
        const saved = localStorage.getItem('quantum_marketing_cache');
        return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  // 2. Podcast Cache
  const [podcastCache, setPodcastCache] = useState<Record<string, PodcastData>>(() => {
    try {
        const saved = localStorage.getItem('quantum_podcast_cache');
        return saved ? JSON.parse(saved) : {};
    } catch (e) { return {}; }
  });

  // 3. Chat History (Global but Language Specific if needed, currently shared or wiped)
  // For this implementation, we will keep chat history unified but prompt will change language.
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    try {
        const saved = localStorage.getItem('quantum_chat_history');
        const parsed = saved ? JSON.parse(saved) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) { return []; }
  });

  // ------------------------------------------------------------------
  // PERSISTENCE EFFECTS
  // ------------------------------------------------------------------
  useEffect(() => {
    localStorage.setItem('quantum_marketing_cache', JSON.stringify(marketingCache));
  }, [marketingCache]);

  useEffect(() => {
    localStorage.setItem('quantum_podcast_cache', JSON.stringify(podcastCache));
  }, [podcastCache]);

  useEffect(() => {
    localStorage.setItem('quantum_chat_history', JSON.stringify(chatHistory));
  }, [chatHistory]);

  // ------------------------------------------------------------------
  // HANDLERS
  // ------------------------------------------------------------------
  const handleSelectSubchapter = (chapter: Chapter, subchapter: Subchapter) => {
    setCurrentChapter(chapter);
    setCurrentSubchapter(subchapter);
  };

  // CACHE KEY GENERATION: Combines Subchapter ID + Language
  // This ensures outputs are distinct per language (Option B strategy)
  const getCacheKey = (subId: string) => `${subId}_${language}`;

  const activeBaseId = currentSubchapter?.id || 'free-roam';
  const activeCacheKey = getCacheKey(activeBaseId);

  const updateMarketingData = (data: Partial<MarketingData>) => {
    setMarketingCache(prev => {
        const current = prev[activeCacheKey] || {};
        return {
            ...prev,
            [activeCacheKey]: { ...current, ...data } as MarketingData
        };
    });
  };

  const updatePodcastData = (data: Partial<PodcastData>) => {
    setPodcastCache(prev => {
        const current = prev[activeCacheKey] || {};
        return {
            ...prev,
            [activeCacheKey]: { ...current, ...data } as PodcastData
        };
    });
  };

  
  // Default values definitions
  const defaultMarketingData: MarketingData = {
      strategy: null,
      customTopic: "",
      imagePrompt: "",
      generatedImage: null
  };

  const defaultPodcastData: PodcastData = {
      segments: [],
      durationMinutes: 5,
      customTopic: "",
      isDeep: false
  };

  // Safe merging: Merge Cache OVER Defaults
  const activeMarketingData: MarketingData = { 
      ...defaultMarketingData, 
      ...(marketingCache[activeCacheKey] || {}) 
  };

  const activePodcastData: PodcastData = { 
      ...defaultPodcastData, 
      ...(podcastCache[activeCacheKey] || {}) 
  };

  if (!activePodcastData.segments) activePodcastData.segments = [];
  if (!activeMarketingData.strategy) activeMarketingData.strategy = null;

  return (
    <div className="flex h-screen w-full bg-[#050505] overflow-hidden selection:bg-indigo-500/30">
      <Sidebar 
        book={BOOK_STRUCTURE} 
        currentSubchapter={currentSubchapter}
        onSelectSubchapter={handleSelectSubchapter}
        currentLanguage={language}
        onSetLanguage={setLanguage}
      />
      <ContentArea 
        chapter={currentChapter}
        subchapter={currentSubchapter}
        language={language}
        
        // Pass Data
        marketingData={activeMarketingData}
        podcastData={activePodcastData}
        chatHistory={chatHistory}
        
        // Pass Updaters
        onUpdateMarketing={updateMarketingData}
        onUpdatePodcast={updatePodcastData}
        onUpdateChat={setChatHistory}
      />
    </div>
  );
}

export default App;
