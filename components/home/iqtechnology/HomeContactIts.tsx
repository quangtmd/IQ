
import React, { useState, useEffect, useCallback } from 'react';
import Button from '../../ui/Button';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { SITE_CONFIG_STORAGE_KEY, INITIAL_SITE_SETTINGS } from '../../../constants';
import { SiteSettings } from '../../../types';
import { useAuth } from '../../../contexts/AuthContext';


const HomeContactIts: React.FC = () => {
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [titleRef, isTitleVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const [formRef, isFormVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const [infoRef, isInfoVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });

  const { addAdminNotification } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contactConfig = siteSettings.homepageContactSection;

  const loadSiteSettings = useCallback(() => {
    const storedSettingsRaw = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
    if (storedSettingsRaw) {
      setSiteSettings(JSON.parse(storedSettingsRaw));
    } else {
      setSiteSettings(INITIAL_SITE_SETTINGS);
    }
  }, []);

  useEffect(() => {
    loadSiteSettings();
    window.addEventListener('siteSettingsUpdated', loadSiteSettings);
    return () => {
      window.removeEventListener('siteSettingsUpdated', loadSiteSettings);
    };
  }, [loadSiteSettings]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        setError("Vui lòng điền đầy đủ các trường bắt buộc.");
        return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError("Địa chỉ email không hợp lệ.");
        return;
    }

    console.log("Homepage Contact Form:", formData);
    addAdminNotification(`Tin nhắn nhanh từ trang chủ: ${formData.name} (${formData.email}). Nội dung: ${formData.message.substring(0,30)}...`, 'info');
    setIsSubmitted(true);
    setFormData({ name: '', email: '', message: '' }); 
  };

  if (!contactConfig.enabled) return null;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-bgMuted via-red-50 to-gray-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-red-400 to-secondary opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
            <div ref={titleRef} className={`text-center mb-12 md:mb-16 animate-on-scroll fade-in-up ${isTitleVisible ? 'is-visible' : ''}`}>
                {contactConfig.preTitle && (
                    <span className="inline-flex items-center text-sm font-semibold text-primary mb-3">
                        <img src={siteSettings.siteLogoUrl || ''} onError={(e) => (e.currentTarget.style.display = 'none')} alt={`${siteSettings.companyName} logo`} className="inline h-6 mr-2 object-contain" /> 
                        {contactConfig.preTitle}
                    </span>
                )}
                <h2 className="text-3xl md:text-4xl font-bold text-textBase leading-tight">
                    {contactConfig.title || "Kết Nối Với Chúng Tôi!"}
                </h2>
            </div>

            <div className="flex flex-wrap items-stretch -mx-4">
                <div ref={formRef} className={`w-full lg:w-1/2 px-4 mb-12 lg:mb-0 animate-on-scroll slide-in-left ${isFormVisible ? 'is-visible' : ''}`}>
                    {isSubmitted ? (
                        <div className="bg-white p-8 rounded-xl shadow-2xl text-center border-2 border-green-400 h-full flex flex-col justify-center items-center">
                            <i className="fas fa-check-circle text-7xl text-green-500 mb-6"></i>
                            <h3 className="text-2xl font-semibold text-textBase mb-3">Gửi Yêu Cầu Thành Công!</h3>
                            <p className="text-textMuted mb-8">Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể.</p>
                            <Button onClick={() => setIsSubmitted(false)} variant="outline" className="border-primary text-primary hover:bg-primary/5 shadow-md">Gửi tin nhắn khác</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-10 rounded-xl shadow-2xl space-y-6 border border-gray-200 h-full flex flex-col">
                            {error && <p className="text-sm text-red-600 bg-red-100 p-3 rounded-md border border-red-300">{error}</p>}
                            <div>
                                <label htmlFor="home_contact_name" className="sr-only">Tên của bạn</label>
                                <input type="text" name="name" id="home_contact_name" value={formData.name} onChange={handleChange} placeholder="Tên của bạn *" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow text-sm placeholder-textSubtle shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="home_contact_email" className="sr-only">Email của bạn</label>
                                <input type="email" name="email" id="home_contact_email" value={formData.email} onChange={handleChange} placeholder="Email của bạn *" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow text-sm placeholder-textSubtle shadow-sm" />
                            </div>
                            <div>
                                <label htmlFor="home_contact_message" className="sr-only">Lời nhắn</label>
                                <textarea name="message" id="home_contact_message" rows={5} value={formData.message} onChange={handleChange} placeholder="Lời nhắn của bạn... *" className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-shadow text-sm placeholder-textSubtle flex-grow shadow-sm"></textarea>
                            </div>
                            <Button type="submit" variant="primary" size="lg" className="w-full py-3.5 text-base mt-auto shadow-lg hover:shadow-primary/40 transition-shadow">Gửi Tin Nhắn <i className="ri-arrow-right-fill ml-2"></i></Button>
                        </form>
                    )}
                </div>
                <div ref={infoRef} className={`w-full lg:w-1/2 px-4 animate-on-scroll slide-in-right ${isInfoVisible ? 'is-visible' : ''} flex`}>
                    <div className="bg-white p-8 md:p-10 rounded-xl shadow-2xl space-y-6 border-2 border-primary/30 w-full flex flex-col justify-between">
                        <div>
                        {[
                            { icon: 'ri-phone-fill', title: 'Phone:', content: siteSettings.companyPhone, href: `tel:${siteSettings.companyPhone.replace(/\./g, '')}` },
                            { icon: 'ri-mail-send-fill', title: 'Email:', content: siteSettings.companyEmail, href: `mailto:${siteSettings.companyEmail}` },
                            { icon: 'ri-map-pin-fill', title: 'Address:', content: siteSettings.companyAddress, href: '#' } 
                        ].map(info => (
                            <div key={info.title} className="flex items-start py-4 border-b border-gray-100 last:border-b-0">
                                <div className="flex-shrink-0 mr-6">
                                    <div className="bg-primary/10 text-primary w-14 h-14 rounded-xl flex items-center justify-center shadow-md border border-white">
                                        <i className={`${info.icon} text-3xl`}></i>
                                    </div>
                                </div>
                                <div>
                                    <span className="block text-sm font-semibold text-textMuted mb-0.5">{info.title}</span>
                                    <a href={info.href} className="text-lg font-medium text-textBase hover:text-primary transition-colors break-words leading-tight">{info.content}</a>
                                </div>
                            </div>
                        ))}
                        </div>
                        <div className="mt-auto text-center text-5xl md:text-6xl lg:text-7xl font-bold text-gray-100 opacity-60 select-none -z-10 pt-6">
                            CONTACT
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <img src="https://picsum.photos/seed/circuitPatternV1/150/150?text=&bg=FFFFFF00&fg=DD2222" alt="Decorative Tech Shape" className="absolute bottom-5 left-5 w-28 h-28 opacity-10 transform -rotate-45 hidden lg:block -z-10" />
    </section>
  );
};

export default HomeContactIts;