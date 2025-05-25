
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { SITE_CONFIG_STORAGE_KEY, INITIAL_SITE_SETTINGS } from '../../../constants';
import { SiteSettings, HomepageServiceBenefit } from '../../../types';

const ServiceBenefitCard: React.FC<{ item: HomepageServiceBenefit; index: number }> = ({ item, index }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const cardBgStyle = item.bgImageUrlSeed ? { 
    backgroundImage: `url(https://picsum.photos/seed/${item.bgImageUrlSeed}/80/80?blur=2&grayscale)`, 
    backgroundRepeat: 'no-repeat', 
    backgroundPosition: 'bottom -20px right -20px', 
    backgroundSize: '100px auto',
  } : {};

  return (
    <div 
        ref={ref} 
        className={`animate-on-scroll fade-in-up ${isVisible ? 'is-visible' : ''} relative bg-white rounded-xl shadow-xl p-6 md:p-8 group hover:shadow-primary/20 transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary/30`} 
        style={{ animationDelay: `${index * 100}ms`, ...cardBgStyle }}
    >
      <div className="relative z-10">
        <div className="mb-6">
           <div className="w-16 h-16 flex items-center justify-center text-primary bg-primary/10 rounded-full shadow-lg border-2 border-white">
                <i className={`${item.iconClass || 'fas fa-check-circle'} text-3xl`}></i>
           </div>
        </div>
        <h3 className="text-xl font-semibold text-textBase mb-3 group-hover:text-primary transition-colors">
          <Link to={item.link || '#'} className="line-clamp-1">{item.title}</Link>
        </h3>
        <p className="text-textMuted text-sm mb-6 h-24 line-clamp-4 leading-relaxed">{item.description}</p>
        <Link to={item.link || '#'} className="text-primary font-semibold hover:underline text-sm group-hover:font-bold flex items-center transition-all duration-200 hover:text-primary-dark">
          Read More <i className="ri-arrow-right-fill ml-1.5 transition-transform duration-300 group-hover:translate-x-1"></i>
        </Link>
      </div>
      <div className="absolute top-4 right-6 text-7xl font-bold text-gray-100 opacity-90 transition-all duration-300 group-hover:text-gray-200 group-hover:scale-110 -z-0 select-none">
        0{item.order || index + 1}
      </div>
    </div>
  );
};

const HomeServicesBenefitsIts: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [titleRef, isTitleVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  const servicesBenefitsConfig = settings.homepageServicesBenefits;

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

  if (!servicesBenefitsConfig.enabled) return null;
  
  const sortedBenefits = [...servicesBenefitsConfig.benefits].sort((a,b) => (a.order || 0) - (b.order || 0));


  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-bgCanvas to-red-50 relative">
      <div className="container mx-auto px-4 relative z-10">
        <div ref={titleRef} className={`text-center mb-12 md:mb-16 animate-on-scroll fade-in-up ${isTitleVisible ? 'is-visible' : ''}`}>
          {servicesBenefitsConfig.preTitle && (
            <span className="inline-flex items-center text-sm font-semibold text-primary mb-3">
              <img src={settings.siteLogoUrl || ''} onError={(e) => (e.currentTarget.style.display = 'none')} alt={`${settings.companyName} logo`} className="inline h-6 mr-2 object-contain" /> 
              {servicesBenefitsConfig.preTitle}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-textBase leading-tight">
            {servicesBenefitsConfig.title || "Default Service Benefits Title"}
          </h2>
        </div>
        {sortedBenefits.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedBenefits.map((item, index) => (
                <ServiceBenefitCard key={item.id} item={item} index={index} />
            ))}
            </div>
        ) : (
            <p className="text-center text-textMuted">Service benefits information is being updated.</p>
        )}
      </div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[10vw] sm:text-[15vw] md:text-[20vw] font-bold text-gray-200/40 opacity-20 select-none -z-0 hidden lg:block whitespace-nowrap" style={{pointerEvents: 'none'}}>
            SERVICE BENEFITS
       </div>
    </section>
  );
};

export default HomeServicesBenefitsIts;