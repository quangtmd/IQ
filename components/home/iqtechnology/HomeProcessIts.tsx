
import React, { useState, useEffect, useCallback } from 'react';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { SITE_CONFIG_STORAGE_KEY, INITIAL_SITE_SETTINGS } from '../../../constants';
import { SiteSettings, HomepageProcessStep } from '../../../types';

const ProcessStepCard: React.FC<{ step: HomepageProcessStep; index: number }> = ({ step, index }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2, triggerOnce: true });
  return (
    <div 
        ref={ref} 
        className={`p-6 bg-white rounded-xl shadow-xl border border-gray-200 relative animate-on-scroll fade-in-up ${isVisible ? 'is-visible' : ''} group hover:shadow-primary/20 transition-all duration-300 transform hover:-translate-y-1`}
        style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="mb-6 relative h-48 rounded-lg overflow-hidden shadow-lg">
        <img src={`https://picsum.photos/seed/${step.imageUrlSeed || `defaultStepImg${index}`}/300/220`} alt={step.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        <span className="absolute top-4 left-4 bg-primary text-white text-xl font-bold w-12 h-12 flex items-center justify-center rounded-full shadow-md border-2 border-white">
          {step.stepNumber || `0${index+1}`}
        </span>
      </div>
      {step.shapeUrlSeed && (
        <div className={`absolute -bottom-6 ${step.alignRight ? 'right-4' : 'left-4'} w-16 h-16 opacity-10 group-hover:opacity-25 transition-opacity duration-300 hidden md:block -z-10 transform ${step.alignRight ? 'rotate-12' : '-rotate-12'}`}>
            <img src={`https://picsum.photos/seed/${step.shapeUrlSeed}/80/80?text=&fg=DD2222&bg=FFFFFF00`} alt="Decorative shape" className="w-full h-full object-contain filter drop-shadow-sm" />
        </div>
      )}
      <h4 className="text-xl font-semibold text-textBase mb-2.5 group-hover:text-primary transition-colors">{step.title}</h4>
      <p className="text-textMuted text-sm leading-relaxed h-24 line-clamp-4">{step.description}</p>
    </div>
  );
};

const HomeProcessIts: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [titleRef, isTitleVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  const processConfig = settings.homepageProcess;

  const loadSettings = useCallback(() => {
    const storedSettingsRaw = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
    if (storedSettingsRaw) {
      setSettings(JSON.parse(storedSettingsRaw));
    } else {
      setSettings(INITIAL_SITE_SETTINGS);
    }
  }, []);

  useEffect(() => {
    loadSettings();
    window.addEventListener('siteSettingsUpdated', loadSettings);
    return () => {
      window.removeEventListener('siteSettingsUpdated', loadSettings);
    };
  }, [loadSettings]);

  if (!processConfig.enabled || !processConfig.steps || processConfig.steps.length === 0) return null;

  const sortedSteps = [...processConfig.steps].sort((a,b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-bgCanvas via-red-50 to-gray-50 relative">
      <div className="absolute top-10 -left-40 w-[500px] h-[500px] bg-primary/5 rounded-full -z-10 opacity-20 blur-3xl hidden lg:block transform -rotate-45"></div>
      <div className="absolute bottom-10 -right-40 w-[450px] h-[450px] bg-red-100/10 rounded-full -z-10 opacity-20 blur-3xl hidden lg:block transform rotate-45"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div ref={titleRef} className={`text-center mb-12 md:mb-16 animate-on-scroll fade-in-up ${isTitleVisible ? 'is-visible' : ''}`}>
          {processConfig.preTitle && (
            <span className="inline-flex items-center text-sm font-semibold text-primary mb-3">
              <img src={settings.siteLogoUrl || ''} onError={(e) => (e.currentTarget.style.display = 'none')} alt={`${settings.companyName} logo`} className="inline h-6 mr-2 object-contain" /> 
              {processConfig.preTitle}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-textBase leading-tight">
            {processConfig.title || "Default Process Title"}
          </h2>
        </div>
        {sortedSteps.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {sortedSteps.map((step, index) => (
                <ProcessStepCard key={step.id || index} step={step} index={index} />
            ))}
            </div>
        ) : (
            <p className="text-center text-textMuted">Process steps are being updated.</p>
        )}
      </div>
    </section>
  );
};

export default HomeProcessIts;