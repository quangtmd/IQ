
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
// Removed useIntersectionObserver as it's being replaced by useEffect for this component's text animations
import { SITE_CONFIG_STORAGE_KEY, INITIAL_SITE_SETTINGS } from '../../../constants';
import { SiteSettings } from '../../../types';

const HomeBannerIts: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  // State to control the start of animations for banner text elements
  const [startTextAnimation, setStartTextAnimation] = useState(false);

  const bannerConfig = settings.homepageBanner;

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

  // useEffect to trigger text animations shortly after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setStartTextAnimation(true);
    }, 50); // Small delay to ensure component is mounted and styles can apply
    return () => clearTimeout(timer);
  }, []);


  const sectionBaseClasses = "py-20 md:py-32 overflow-hidden relative";
  const sectionBgImageClasses = bannerConfig.backgroundImageUrl 
    ? "bg-cover bg-center animate-ken-burns" 
    : "bg-gradient-to-br from-gray-50 via-red-50 to-red-100 animate-animated-gradient"; 
  const sectionStyle = bannerConfig.backgroundImageUrl ? { backgroundImage: `url('${bannerConfig.backgroundImageUrl}')` } : {};


  return (
    <section 
      className={`${sectionBaseClasses} ${sectionBgImageClasses}`}
      style={sectionStyle}
    >
      {bannerConfig.backgroundImageUrl && <div className="absolute inset-0 bg-black/40"></div>}
      
      <div className="container mx-auto px-4">
        <div className="w-full px-4 text-center"> 
            <div className="max-w-2xl mx-auto relative z-10"> 
              {bannerConfig.preTitle && (
                <span className={`block text-sm font-semibold text-primary uppercase tracking-wider mb-3 animate-on-scroll fade-in-up ${startTextAnimation ? 'is-visible' : ''}`}>
                  {bannerConfig.preTitle}
                </span>
              )}
              <h1 className={`text-4xl md:text-5xl xl:text-6xl font-bold mb-6 leading-tight animate-on-scroll fade-in-up ${startTextAnimation ? 'is-visible' : ''}`} style={{ animationDelay: '0.1s' }}>
                <span className={bannerConfig.backgroundImageUrl ? 'text-white' : 'text-textBase'} dangerouslySetInnerHTML={{ __html: bannerConfig.title.replace(settings.companyName, `<span class="text-primary">${settings.companyName}</span>`) || 'Default Banner Title' }} />
              </h1>
              <p className={`text-lg ${bannerConfig.backgroundImageUrl ? 'text-gray-100' : 'text-textMuted'} mb-10 animate-on-scroll fade-in-up ${startTextAnimation ? 'is-visible' : ''}`} style={{ animationDelay: '0.2s' }}>
                {bannerConfig.subtitle || 'Default subtitle describing the service.'}
              </p>
              <div className={`space-y-3 sm:space-y-0 sm:space-x-4 animate-on-scroll fade-in-up ${startTextAnimation ? 'is-visible' : ''}`} style={{ animationDelay: '0.3s' }}>
                {bannerConfig.primaryButtonLink && bannerConfig.primaryButtonText && (
                  <Link to={bannerConfig.primaryButtonLink}>
                    <Button size="lg" variant="primary" className="w-full sm:w-auto px-8 py-3 text-base shadow-lg hover:shadow-primary/40 transition-shadow">
                      {bannerConfig.primaryButtonText} <i className="fas fa-arrow-right ml-2 text-sm"></i>
                    </Button>
                  </Link>
                )}
                {bannerConfig.secondaryButtonLink && bannerConfig.secondaryButtonText && (
                  <Link to={bannerConfig.secondaryButtonLink}>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className={`w-full sm:w-auto px-8 py-3 text-base shadow-md hover:shadow-primary/20 transition-shadow ${bannerConfig.backgroundImageUrl ? 'border-white text-white hover:bg-white hover:text-primary' : 'border-primary text-primary hover:bg-primary/5' }`}
                    >
                      {bannerConfig.secondaryButtonText} <i className="fas fa-info-circle ml-2 text-sm"></i>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
        </div>
      </div>
       <div className="absolute bottom-5 right-5 text-6xl md:text-8xl lg:text-[120px] xl:text-[150px] font-bold text-gray-200/30 opacity-20 select-none -z-10 leading-none hidden md:block" style={{pointerEvents: 'none'}}>
            IT SOLUTIONS
       </div>
    </section>
  );
};

export default HomeBannerIts;
