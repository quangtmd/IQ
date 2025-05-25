

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../ui/Button';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
// Fix: Import MOCK_SERVICES from data/mockData
import { SITE_CONFIG_STORAGE_KEY, INITIAL_SITE_SETTINGS } from '../../../constants';
import { MOCK_SERVICES } from '../../../data/mockData';
import { SiteSettings, Service } from '../../../types';

interface ProjectItemProps {
  item: Service; 
  index: number;
}

const ProjectCardIts: React.FC<ProjectItemProps> = ({ item, index }) => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05, triggerOnce: true });
    const placeholderImg = item.imageUrl || `https://picsum.photos/seed/techService${item.id.replace(/\D/g,'') || index}/500/650`;
    return (
        <div 
            ref={ref} 
            className={`group relative overflow-hidden rounded-xl shadow-xl animate-on-scroll fade-in-up ${isVisible ? 'is-visible' : ''} aspect-[3/4] border-2 border-transparent hover:border-primary/30 transition-all duration-300`}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <img src={placeholderImg} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-opacity duration-300 opacity-100 group-hover:from-black/90 group-hover:via-black/70"></div>
            <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end">
                <div className="transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 ease-out">
                    <div className="mb-auto">
                        <span className="inline-block text-xs font-semibold text-primary bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full mb-3 uppercase tracking-wider shadow-sm">
                            <i className="ri-price-tag-3-line mr-1.5"></i> Dịch vụ
                        </span>
                        <h3 className="text-xl lg:text-2xl font-bold text-white mb-2.5 leading-tight">
                            <Link to={`/services#${item.slug || item.id}`} className="hover:underline line-clamp-2">{item.name}</Link>
                        </h3>
                    </div>
                    <p className="text-sm text-gray-200 mb-5 line-clamp-3 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-400 delay-100 ease-in-out">{item.description}</p>
                    <Link 
                        to={`/services#${item.slug || item.id}`}
                        className="absolute right-6 bottom-6 text-white bg-primary/90 hover:bg-primary p-3.5 rounded-full text-xl opacity-0 group-hover:opacity-100 transition-all duration-500 delay-200 ease-in-out transform scale-75 group-hover:scale-100 shadow-lg"
                        aria-label={`View details for ${item.name}`}
                    >
                        <i className="ri-arrow-right-up-line"></i>
                    </Link>
                </div>
            </div>
        </div>
    );
}


const HomeFeaturedProjectsIts: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [titleRef, isTitleVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  
  const projectsConfig = settings.homepageFeaturedProjects;

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

  if (!projectsConfig.enabled) return null;

  const featuredItems = projectsConfig.featuredServiceIds
    .map(id => MOCK_SERVICES.find(service => service.id === id))
    .filter(Boolean) as Service[];

  return (
    <section className="py-16 md:py-24 bg-bgMuted">
      <div className="container mx-auto px-4">
        <div ref={titleRef} className={`flex flex-col md:flex-row justify-between items-center mb-12 md:mb-16 animate-on-scroll fade-in-up ${isTitleVisible ? 'is-visible' : ''}`}>
          <div className="text-center md:text-left mb-6 md:mb-0 max-w-xl">
            {projectsConfig.preTitle && (
              <span className="inline-flex items-center text-sm font-semibold text-primary mb-2">
                <img src={settings.siteLogoUrl || ''} onError={(e) => (e.currentTarget.style.display = 'none')} alt={`${settings.companyName} logo`} className="inline h-6 mr-2 object-contain" /> 
                {projectsConfig.preTitle}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-textBase leading-tight">
              {projectsConfig.title || "Default Featured Projects Title"}
            </h2>
          </div>
          {projectsConfig.buttonLink && projectsConfig.buttonText && (
            <div className="shrink-0">
                <Link to={projectsConfig.buttonLink}>
                <Button variant="primary" size="lg" className="px-8 py-3 text-base shadow-md hover:shadow-primary/30 transition-shadow">
                    {projectsConfig.buttonText} <i className="fas fa-arrow-right ml-2 text-sm"></i>
                </Button>
                </Link>
            </div>
          )}
        </div>
        
        {featuredItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {featuredItems.map((item, index) => (
                <ProjectCardIts key={item.id} item={item} index={index} />
            ))}
            </div>
        ) : (
            <p className="text-center text-textMuted">Featured projects/services are being updated.</p>
        )}
      </div>
    </section>
  );
};

export default HomeFeaturedProjectsIts;