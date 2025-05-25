
import React, { useState, useEffect, useCallback } from 'react';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { SITE_CONFIG_STORAGE_KEY, INITIAL_SITE_SETTINGS } from '../../../constants';
import { SiteSettings, HomepageTestimonialItem } from '../../../types';

interface TestimonialCardProps {
  testimonial: HomepageTestimonialItem;
  index: number;
}

const TestimonialCardIts: React.FC<TestimonialCardProps> = ({ testimonial, index }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  return (
    <div 
        ref={ref} 
        className={`bg-white p-8 rounded-xl shadow-xl border border-gray-100 animate-on-scroll fade-in-up ${isVisible ? 'is-visible' : ''} flex flex-col items-center text-center transition-all duration-300 hover:shadow-2xl hover:border-primary/40 transform hover:-translate-y-1`}
        style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="mb-6 text-primary opacity-20">
        <i className="fas fa-quote-left text-5xl"></i>
      </div>
      <p className="text-textMuted italic text-center mb-8 leading-relaxed flex-grow h-32 overflow-auto text-base">{testimonial.quote}</p>
      <div className="flex flex-col items-center mt-auto">
        <div className="text-yellow-400 mb-4 text-xl">
            <i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star"></i><i className="fas fa-star-half-alt"></i>
        </div>
        <img src={testimonial.avatarUrl || `https://picsum.photos/seed/defaultAvatar${index}/100/100`} alt={testimonial.name} className="w-20 h-20 rounded-full mb-4 shadow-lg border-4 border-white object-cover" />
        <h5 className="text-lg font-semibold text-textBase">{testimonial.name}</h5>
        <span className="text-sm text-primary font-medium">{testimonial.role || 'Khách hàng'}</span>
      </div>
    </div>
  );
};

const HomeTestimonialsIts: React.FC = () => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [titleRef, isTitleVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  
  const testimonialsConfig = settings.homepageTestimonials;

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

  if (!testimonialsConfig.enabled || !testimonialsConfig.testimonials || testimonialsConfig.testimonials.length === 0) return null;
  
  const sortedTestimonials = [...testimonialsConfig.testimonials].sort((a,b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-bgCanvas via-red-50 to-gray-50 relative overflow-hidden">
      <div className="absolute top-20 -left-32 w-80 h-80 bg-primary/5 rounded-full -z-10 opacity-40 blur-2xl hidden md:block transform rotate-45"></div>
      <div className="absolute bottom-20 -right-32 w-96 h-96 bg-red-100/20 rounded-full -z-10 opacity-40 blur-2xl hidden md:block transform -rotate-45"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div ref={titleRef} className={`text-center mb-12 md:mb-16 animate-on-scroll fade-in-up ${isTitleVisible ? 'is-visible' : ''}`}>
          {testimonialsConfig.preTitle && (
            <div className="flex justify-center mb-4">
                <h2 className="text-primary font-bold text-sm uppercase tracking-wider bg-white shadow-md border border-gray-200 px-4 py-1.5 rounded-full inline-block">
                {testimonialsConfig.preTitle}
                </h2>
            </div>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-textBase mt-1 leading-tight">
            {testimonialsConfig.title || "Default Testimonials Title"}
          </h2>
        </div>
        
        {sortedTestimonials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedTestimonials.map((testimonial, index) => (
                <TestimonialCardIts key={testimonial.id} testimonial={testimonial} index={index} />
            ))}
            </div>
        ): (
            <p className="text-center text-textMuted">Testimonials are being updated.</p>
        )}
      </div>
    </section>
  );
};

export default HomeTestimonialsIts;