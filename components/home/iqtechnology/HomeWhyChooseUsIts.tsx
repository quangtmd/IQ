
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { SITE_CONFIG_STORAGE_KEY, INITIAL_SITE_SETTINGS } from '../../../constants';
import { SiteSettings, HomepageWhyChooseUsFeature } from '../../../types';

const HomeWhyChooseUsIts: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [imageRef, isImageVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const [contentRef, isContentVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  const whyChooseUsConfig = settings.homepageWhyChooseUs;

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

  if (!whyChooseUsConfig.enabled) return null;

  return (
    <section className="py-16 md:py-24 bg-bgCanvas overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center -mx-4">
          <div className="w-full lg:w-1/2 px-4 mb-16 lg:mb-0">
            <div ref={imageRef} className={`relative animate-on-scroll slide-in-left ${isImageVisible ? 'is-visible' : ''}`}>
              <img 
                src={whyChooseUsConfig.mainImageUrl || "https://picsum.photos/seed/defaultITSupport/600/720"} 
                alt="Why Choose Our IT Support Team" 
                className="rounded-xl shadow-2xl w-full object-cover max-w-md mx-auto lg:max-w-none border-4 border-white"
              />
              {whyChooseUsConfig.decorTopLeftImageUrl && (
                  <div className="absolute -top-10 -left-10 w-36 h-36 bg-primary/5 rounded-lg -z-10 hidden lg:block transform rotate-[-20deg] shadow-inner">
                    <img src={whyChooseUsConfig.decorTopLeftImageUrl} alt="decor" className="w-full h-full object-contain opacity-50"/>
                  </div>
              )}
              {whyChooseUsConfig.decorBottomRightImageUrl && (
                  <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-red-100/40 rounded-full -z-10 hidden lg:block shadow-inner">
                     <img src={whyChooseUsConfig.decorBottomRightImageUrl} alt="decor" className="w-full h-full object-contain opacity-50"/>
                  </div>
              )}
              {whyChooseUsConfig.experienceStatNumber && whyChooseUsConfig.experienceStatLabel && (
                 <div className="absolute top-1/2 -translate-y-1/2 -right-12 bg-white p-4 shadow-2xl rounded-xl hidden xl:block transform transition-all duration-300 hover:scale-105 hover:shadow-primary/30">
                   <div className="text-center">
                      <div className="text-primary text-4xl font-bold mb-1">{whyChooseUsConfig.experienceStatNumber}</div>
                      <p className="text-sm text-textMuted font-medium">{whyChooseUsConfig.experienceStatLabel}</p>
                   </div>
                 </div>
              )}
            </div>
          </div>
          <div className="w-full lg:w-1/2 px-4">
            <div ref={contentRef} className={`lg:pl-10 animate-on-scroll fade-in-up ${isContentVisible ? 'is-visible' : ''}`}>
              {whyChooseUsConfig.preTitle && (
                <span className="inline-flex items-center text-sm font-semibold text-primary mb-4">
                  <img src={settings.siteLogoUrl || ''} onError={(e) => (e.currentTarget.style.display = 'none')} alt={`${settings.companyName} logo`} className="inline h-6 mr-2 object-contain" /> 
                  {whyChooseUsConfig.preTitle}
                </span>
              )}
              <h2 className="text-3xl md:text-4xl font-bold text-textBase mb-6 leading-tight">
                {whyChooseUsConfig.title || "Default Why Choose Us Title"}
              </h2>
              <p className="text-textMuted mb-10 leading-relaxed text-base">
                {whyChooseUsConfig.description || "Default description explaining why to choose us."}
              </p>
              
              {whyChooseUsConfig.features && whyChooseUsConfig.features.length > 0 && (
                <ul className="space-y-8 mb-12">
                  {whyChooseUsConfig.features.map((item: HomepageWhyChooseUsFeature, index) => (
                    <li key={item.id || index} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 flex items-center justify-center text-primary bg-primary/10 rounded-full mr-5 shadow-md border-2 border-white">
                          <i className={`${item.iconClass || 'fas fa-star'} text-2xl`}></i>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-textBase mb-1.5">{item.title}</h4>
                        <p className="text-textMuted text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {whyChooseUsConfig.contactButtonLink && whyChooseUsConfig.contactButtonText && (
                <div className="flex items-center bg-gray-50 p-5 rounded-lg border border-gray-200 shadow-sm">
                    {whyChooseUsConfig.contactSectionText && <p className="text-textMuted mr-5 text-sm font-medium">{whyChooseUsConfig.contactSectionText}</p>}
                    <Link to={whyChooseUsConfig.contactButtonLink}>
                    <Button variant="primary" size="md" className="px-6 py-2.5 text-base shadow hover:shadow-primary/30 transition-shadow">
                        {whyChooseUsConfig.contactButtonText} <i className="ri-arrow-right-up-line ml-1.5 text-sm"></i>
                    </Button>
                    </Link>
                    <img src="https://picsum.photos/seed/techArrowV1/100/60?text=&fg=DD2222&bg=FFFFFF00" alt="decorative tech arrow" className="ml-auto h-10 opacity-20 hidden sm:block transform -rotate-12" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeWhyChooseUsIts;