
import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import useIntersectionObserver from '../../../hooks/useIntersectionObserver';
import { SITE_CONFIG_STORAGE_KEY, INITIAL_SITE_SETTINGS } from '../../../constants';
import { MOCK_ARTICLES } from '../../../data/mockData';
import { SiteSettings, Article } from '../../../types';

const BlogItemCard: React.FC<{article: Article, index: number}> = ({article, index}) => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
    const placeholderImg = article.imageUrl || `https://picsum.photos/seed/techBlog${article.id.replace(/\D/g,'') || index}/400/260`;
    
    return (
        <div 
            ref={ref} 
            className={`bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-primary/20 border border-gray-200 hover:border-primary/30 animate-on-scroll fade-in-up ${isVisible ? 'is-visible' : ''} flex flex-col`}
            style={{animationDelay: `${index * 100}ms`}}
        >
            <div className="relative aspect-[16/9]">
                <Link to={`/article/${article.id}`} className="block w-full h-full group">
                    <img src={placeholderImg} alt={article.title} className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute top-3 left-3">
                        <span className="text-xs font-semibold text-primary bg-white/80 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-sm border border-white/50">
                            <i className="ri-price-tag-3-line mr-1 opacity-80"></i> {article.category}
                        </span>
                    </div>
                </Link>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="text-xs text-textSubtle mb-2 space-x-2.5">
                    <span><i className="ri-user-3-line mr-1 opacity-70"></i> {article.author}</span>
                    <span><i className="ri-calendar-line mr-1 opacity-70"></i> {new Date(article.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-base font-semibold text-textBase mb-2 leading-snug hover:text-primary transition-colors">
                    <Link to={`/article/${article.id}`} className="line-clamp-2">{article.title}</Link>
                </h3>
                <p className="text-sm text-textMuted mb-4 line-clamp-2 flex-grow h-11 leading-relaxed">{article.summary}</p>
                <Link to={`/article/${article.id}`} className="mt-auto text-sm font-semibold text-primary hover:underline self-start group/readmore">
                    Đọc thêm <i className="ri-arrow-right-line ml-1 transition-transform duration-300 group-hover/readmore:translate-x-1"></i>
                </Link>
            </div>
        </div>
    );
}

interface HomeBlogPreviewItsProps {
  categoryFilter?: string;
  maxArticles?: number;
}

const HomeBlogPreviewIts: React.FC<HomeBlogPreviewItsProps> = ({ categoryFilter, maxArticles: maxArticlesProp }) => {
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SITE_SETTINGS);
  const [titleRef, isTitleVisible] = useIntersectionObserver({ threshold: 0.1, triggerOnce: true });
  const [loadedArticles, setLoadedArticles] = useState<Article[]>([]);

  const blogConfig = settings.homepageBlogPreview;
  const ARTICLES_STORAGE_KEY = 'adminArticles_v1';
  const DEFAULT_MAX_ARTICLES = 4;

  const loadContent = useCallback(() => {
    const storedSettingsRaw = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
    if (storedSettingsRaw) {
      setSettings(JSON.parse(storedSettingsRaw));
    } else {
      setSettings(INITIAL_SITE_SETTINGS);
    }

    const storedArticles = localStorage.getItem(ARTICLES_STORAGE_KEY);
    if (storedArticles) {
      try {
        setLoadedArticles(JSON.parse(storedArticles));
      } catch (e) {
        console.error("Failed to parse articles from localStorage", e);
        setLoadedArticles(MOCK_ARTICLES);
      }
    } else {
      setLoadedArticles(MOCK_ARTICLES);
    }
  }, []);

  useEffect(() => {
    loadContent();
    window.addEventListener('siteSettingsUpdated', loadContent);
    // Assuming articles are updated in admin panel, this event should be dispatched there.
    // If not, consider a more generic 'contentUpdated' or rely on page reload for now.
    window.addEventListener('articlesUpdated', loadContent); // Custom event if articles are managed live
    
    return () => {
      window.removeEventListener('siteSettingsUpdated', loadContent);
      window.removeEventListener('articlesUpdated', loadContent);
    };
  }, [loadContent]);

  if (!categoryFilter && !blogConfig.enabled) return null; // If not filtering by category and homepage section is disabled, hide

  const effectiveMaxArticles = maxArticlesProp || DEFAULT_MAX_ARTICLES;
  let articlesToDisplay: Article[] = [];

  if (categoryFilter) {
    articlesToDisplay = loadedArticles
      .filter(a => a.category.toLowerCase() === categoryFilter.toLowerCase())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by date descending
      .slice(0, effectiveMaxArticles);
  } else { // Homepage logic
    if (blogConfig.featuredArticleId) {
      const fa = loadedArticles.find(a => a.id === blogConfig.featuredArticleId);
      if (fa) articlesToDisplay.push(fa);
    }

    if (blogConfig.otherArticleIds && blogConfig.otherArticleIds.length > 0) {
      for (const id of blogConfig.otherArticleIds) {
        if (articlesToDisplay.length >= effectiveMaxArticles) break;
        if (!articlesToDisplay.some(a => a.id === id)) {
          const oa = loadedArticles.find(a => a.id === id);
          if (oa) articlesToDisplay.push(oa);
        }
      }
    }
    
    if (articlesToDisplay.length < effectiveMaxArticles) {
      const recentArticles = loadedArticles
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      for (const article of recentArticles) {
        if (articlesToDisplay.length >= effectiveMaxArticles) break;
        if (!articlesToDisplay.some(a => a.id === article.id)) {
          articlesToDisplay.push(article);
        }
      }
    }
    articlesToDisplay = articlesToDisplay.slice(0, effectiveMaxArticles);
  }


  return (
    <section className="py-16 md:py-24 bg-bgCanvas">
      <div className="container mx-auto px-4">
        {/* Conditionally render section title only if not filtering by category */}
        {!categoryFilter && (
          <div ref={titleRef} className={`text-center mb-12 md:mb-16 animate-on-scroll fade-in-up ${isTitleVisible ? 'is-visible' : ''}`}>
            {blogConfig.preTitle && (
              <span className="inline-flex items-center text-sm font-semibold text-primary mb-3">
                  <img src={settings.siteLogoUrl || ''} onError={(e) => (e.currentTarget.style.display = 'none')} alt={`${settings.companyName} logo`} className="inline h-6 mr-2 object-contain" /> 
                  {blogConfig.preTitle}
              </span>
            )}
            <h2 className="text-3xl md:text-4xl font-bold text-textBase leading-tight">
              {blogConfig.title || "Cập Nhật Tin Tức Từ IQ"}
            </h2>
          </div>
        )}

        {articlesToDisplay.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                {articlesToDisplay.map((article, index) => (
                    <BlogItemCard key={article.id || index} article={article} index={index} />
                ))}
            </div>
        ) : (
            <p className="text-center text-textMuted">
              {categoryFilter ? `Không có bài viết nào trong chuyên mục "${categoryFilter}".` : "Các bài viết đang được cập nhật."}
            </p>
        )}
      </div>
    </section>
  );
};

export default HomeBlogPreviewIts;
