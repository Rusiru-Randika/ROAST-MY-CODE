import React, { useState, useRef } from 'react';
import type { RoastLevel, SupportedLanguage, RoastResponseData } from './types/roast';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { RoastSelector } from './components/RoastSelector';
import { RoastButton } from './components/RoastButton';
import { RoastResult } from './components/RoastResult';
import { LoadingState } from './components/LoadingState';
import { Footer } from './components/Footer';
import { PixelFlame } from './components/PixelFlame';
import { submitRoastRequest } from './services/roastApi';
import { AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<SupportedLanguage>('javascript');
  const [roastLevel, setRoastLevel] = useState<RoastLevel>('savage');
  
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [roastResult, setRoastResult] = useState<RoastResponseData | null>(null);

  const editorRef = useRef<HTMLDivElement>(null);

  const handleRoast = async () => {
    setError(null);

    if (!code || !code.trim()) {
      setError('ERROR 404: NO CODE DETECTED. PASTE SOME CODE FIRST! 🔥');
      return;
    }

    setIsLoading(true);

    try {
      const response = await submitRoastRequest({
        code,
        language,
        roastLevel,
      });

      if (response.success && response.result) {
        setRoastResult(response.result);
      } else {
        setError(response.error || 'The roaster failed to parse this code. Try again!');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setRoastResult(null);
    setError(null);
    if (editorRef.current) {
      editorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNavigate = (sectionId: string) => {
    if (sectionId === 'editor') {
      if (editorRef.current) {
        editorRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b1a] text-slate-100 flex flex-col font-sans relative">
      <Header onNavigate={handleNavigate} />

      <main className="flex-1 z-10 relative">
        <section ref={editorRef} id="editor" className="py-6 sm:py-8 px-3 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-4 sm:mb-6">
            <h1 className="text-lg sm:text-3xl font-pixel text-white tracking-wider text-pixel-orange flex items-center justify-center gap-2 sm:gap-3">
              <PixelFlame className="w-6 h-6 sm:w-8 sm:h-8" size={30} />
              <span>ROAST MY CODE</span>
            </h1>
            <p className="text-slate-400 text-[9px] sm:text-xs font-pixel mt-1.5 sm:mt-2">
              PASTE CODE &bull; SET LEVEL &bull; SEE WHAT'S WRONG
            </p>
          </div>

          <CodeEditor
            code={code}
            setCode={setCode}
            language={language}
            setLanguage={setLanguage}
            disabled={isLoading}
          />

          <RoastSelector
            selectedLevel={roastLevel}
            onSelectLevel={setRoastLevel}
            disabled={isLoading}
          />

          {error && (
            <div className="my-4 sm:my-6 p-3.5 sm:p-4 bg-red-950 border-3 border-black shadow-pixel-pink text-red-200 text-[11px] sm:text-xs flex items-center gap-2.5 sm:gap-3 font-pixel">
              <AlertCircle className="w-5 h-5 text-pink-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <RoastButton
            onRoast={handleRoast}
            isLoading={isLoading}
          />

          {isLoading && <LoadingState />}

          {roastResult && !isLoading && (
            <RoastResult
              data={roastResult}
              roastLevel={roastLevel}
              onReset={handleReset}
            />
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default App;
