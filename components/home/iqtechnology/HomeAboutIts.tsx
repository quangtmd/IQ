
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { SITE_CONFIG_STORAGE_KEY, INITIAL_SITE_SETTINGS } from '../../../constants';
import { SiteSettings, HomepageAboutFeature } from '../../../types';

const HomeAboutIts: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [imageRef, isImageVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const [contentRef, isContentVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  const aboutConfig = settings.homepageAbout;

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

  if (!aboutConfig.enabled) return null;

  return (
    <section className="py-16 md:py-24 bg-bgCanvas overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-12 lg:mb-0">
            <div ref={imageRef} className={`relative animate-on-scroll slide-in-left ${isImageVisible ? 'is-visible' : ''}`}>
              <img 
                src={aboutConfig.imageUrl || "https://picsum.photos/seed/defaultTechTeam/600/520"} 
                alt={aboutConfig.imageAltText || "Tech Team Collaboration"} 
                className="rounded-xl shadow-2xl w-full object-cover border-4 border-white"
              />
              {aboutConfig.imageDetailUrl && (
                <div className="absolute -bottom-10 -right-10 sm:-bottom-16 sm:-right-16 transform ">
                  <div className="relative group">
                      <img 
                          src={aboutConfig.imageDetailUrl} 
                          alt={aboutConfig.imageDetailAltText || "Detail Image"}
                          className="rounded-lg shadow-xl border-4 md:border-8 border-white object-cover"
                      />
                      {/* Play button can be made conditional if needed */}
                  </div>
                </div>
              )}
              <div className="absolute top-6 left-6 bg-primary text-white text-xs font-bold uppercase px-4 py-2 rounded-md shadow-lg transform -rotate-3 hidden md:block tracking-wider">
                {aboutConfig.preTitle || `ABOUT ${settings.companyName.split(' ')[0]}`}
              </div>
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <div ref={contentRef} className={`lg:pl-12 animate-on-scroll fade-in-up ${isContentVisible ? 'is-visible' : ''}`}>
              <span className="inline-flex items-center text-sm font-semibold text-primary mb-4">
                <img src={settings.siteLogoUrl || ''} onError={(e) => (e.currentTarget.style.display = 'none')} alt={`${settings.companyName} logo`} className="inline h-7 mr-2 object-contain" /> 
                 {aboutConfig.preTitle || 'VỀ CHÚNG TÔI'}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-textBase mb-6 leading-tight">
                {aboutConfig.title || `${settings.companyName} Hiểu Nỗi Lo Của Bạn Về CNTT!`}
              </h2>
              <div className="pl-0 pt-5">
                <p className="text-textMuted mb-8 leading-relaxed text-base">
                  {aboutConfig.description || "Default description about the company and its IT solutions commitment."}
                </p>
                {aboutConfig.features && aboutConfig.features.length > 0 && (
                  <ul className="space-y-6 mb-10">
                    {aboutConfig.features.map((item: HomepageAboutFeature) => (
                      <li key={item.id} className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className="bg-primary/10 text-primary rounded-xl p-4 mr-5 w-14 h-14 flex items-center justify-center shadow-sm">
                             <i className={`${item.icon || 'fas fa-check-circle'} text-2xl`}></i>
                          </div>
                        </div>
                        <div>
                          <Link to={item.link || '#'} className="text-lg font-semibold text-textBase hover:text-primary transition-colors">{item.title}</Link>
                          <p className="text-sm text-textMuted mt-1 leading-relaxed">{item.description}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                {aboutConfig.buttonLink && aboutConfig.buttonText && (
                  <Link to={aboutConfig.buttonLink}>
                    <Button variant="primary" size="lg" className="px-8 py-3 text-base shadow-md hover:shadow-primary/30 transition-shadow">
                      {aboutConfig.buttonText} <i className="fas fa-arrow-right ml-2 text-sm"></i>
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeAboutIts;