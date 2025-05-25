
import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockData';
import { Product } from '../types';
import SearchBar from '../components/shared/SearchBar';
import Pagination from '../components/shared/Pagination';
import { PRODUCT_CATEGORIES_HIERARCHY } from '../constants';
import Button from '../components/ui/Button'; // For scroll buttons

const PRODUCTS_PER_PAGE = 15; // For detailed view
const PRODUCTS_PER_CATEGORY_PREVIEW = 10; // For Philong-style horizontal scroll

const BANNER_IMAGES = [
  "https://picsum.photos/seed/mainbanner1/1200/400?text=IQ+Technology+-+Banner+1",
  "https://picsum.photos/seed/mainbanner2/1200/400?text=Khuyến+Mãi+Laptop+Hè",
  "https://picsum.photos/seed/mainbanner3/1200/400?text=PC+Gaming+Giá+Tốt",
  "https://picsum.photos/seed/mainbanner4/1200/400?text=Dịch+Vụ+IT+Chuyên+Nghiệp",
];

const BannerCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % BANNER_IMAGES.length);
    }, 5000); // Change image every 5 seconds
    return () => clearTimeout(timer);
  }, [currentIndex]);

  return (
    <div className="banner-carousel bg-bgMuted flex items-center justify-center relative">
      {BANNER_IMAGES.map((src, index) => (
        <img 
          key={src}
          src={src} 
          alt={`Banner ${index + 1}`} 
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
        />
      ))}
      <div className="banner-carousel-dots">
        {BANNER_IMAGES.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setCurrentIndex(index)}
            className={`banner-carousel-dot ${index === currentIndex ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};


// New FixedCategoryNav component
const FixedCategoryNav: React.FC<{ onNavigate: (slug: string) => void, activeSlug: string | null }> = ({ onNavigate, activeSlug }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, slug: string) => {
    e.preventDefault();
    onNavigate(slug);
    const element = document.getElementById(`category-section-${slug}`);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="fixed-category-nav scrollbar-hide hidden lg:block">
      <h3 className="fixed-category-nav-title"><i className="fas fa-list-ul mr-2"></i> Danh Mục</h3>
      <ul>
        <li>
          <a 
            href="#hot-products-section" 
            onClick={(e) => { e.preventDefault(); document.getElementById('hot-products-section')?.scrollIntoView({ behavior: 'smooth' }); }}
            className={!activeSlug ? 'active' : ''} 
          >
            Sản phẩm nổi bật
          </a>
        </li>
        {PRODUCT_CATEGORIES_HIERARCHY.filter(cat => cat.slug !== 'pc_xay_dung').map(cat => (
          <li key={cat.slug}>
            <a 
              href={`#category-section-${cat.slug}`} 
              onClick={(e) => handleNavClick(e, cat.slug)}
              className={activeSlug === cat.slug ? 'active' : ''}
            >
              <i className={`${cat.icon || 'fas fa-tag'} mr-2 text-xs`}></i>{cat.name}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

// Reusable HorizontalProductScroll component
interface HorizontalProductScrollProps {
  products: Product[];
  title?: string;
  viewAllLink?: string;
}
const HorizontalProductScroll: React.FC<HorizontalProductScrollProps> = ({ products, title, viewAllLink }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollability = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5); // Add a small buffer for precision
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // Add a small buffer
    }
  }, []);

  useEffect(() => {
    checkScrollability(); // Initial check
    const currentRef = scrollRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', checkScrollability);
      const resizeObserver = new ResizeObserver(checkScrollability);
      resizeObserver.observe(currentRef);
      
      return () => {
        currentRef.removeEventListener('scroll', checkScrollability);
        resizeObserver.disconnect();
      };
    }
  }, [products, checkScrollability]);


  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const cardElement = scrollRef.current.querySelector('.philong-product-card-wrapper') as HTMLElement;
      const scrollAmount = cardElement ? cardElement.offsetWidth * 2 : scrollRef.current.clientWidth * 0.75; 
      
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!products.length) return null;
  
  const showArrows = products.length > 3; // Heuristic: show arrows if more than e.g., 3-4 cards might be visible

  return (
    <section className="mb-10">
      {title && (
        <div className="flex justify-between items-center mb-4 philong-category-header">
          <h2 className="philong-section-title">{title}</h2>
          {viewAllLink && (
            <Link to={viewAllLink} className="philong-view-all-link">
              Xem tất cả <i className="fa fa-angle-double-right text-xs"></i>
            </Link>
          )}
        </div>
      )}
       <div className="relative">
          {showArrows && (
            <>
              <Button 
                onClick={() => scroll('left')}
                variant="outline"
                className="scroll-arrow prev-arrow !p-0" 
                aria-label="Scroll Left"
                disabled={!canScrollLeft}
              >
                <i className="fas fa-chevron-left"></i>
              </Button>
              <Button 
                onClick={() => scroll('right')}
                variant="outline"
                className="scroll-arrow next-arrow !p-0"
                aria-label="Scroll Right"
                disabled={!canScrollRight}
              >
                <i className="fas fa-chevron-right"></i>
              </Button>
            </>
          )}
          <div ref={scrollRef} className="horizontal-product-scroll scrollbar-hide">
            {products.map(product => (
              <div key={product.id} className="philong-product-card-wrapper">
                <ProductCard product={product} context="preview" />
              </div>
            ))}
          </div>
        </div>
    </section>
  );
};


const ShopPage: React.FC = () => {
  const [allProducts] = useState<Product[]>(MOCK_PRODUCTS);
  
  const [activeMainCategorySlug, setActiveMainCategorySlug] = useState<string | null>(null);
  const [activeSubCategorySlug, setActiveSubCategorySlug] = useState<string | null>(null); 
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const term = queryParams.get('q') || '';
    const mainCatSlug = queryParams.get('mainCategory') || null;
    const subCatSlug = queryParams.get('subCategory') || null;

    setSearchTerm(term);
    setActiveMainCategorySlug(mainCatSlug);
    setActiveSubCategorySlug(subCatSlug);
    setCurrentPage(1); 
    
    if (mainCatSlug) {
        const element = document.getElementById(`category-section-${mainCatSlug}`);
        if(element && !term && !subCatSlug) { 
            setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
        }
    }

  }, [location.search]);

  const handleCategorySelect = (mainSlug: string | null, subSlug: string | null = null) => {
    const queryParams = new URLSearchParams();
    if (mainSlug) queryParams.set('mainCategory', mainSlug);
    if (subSlug) queryParams.set('subCategory', subSlug);
    if (searchTerm && mainSlug) queryParams.set('q', searchTerm); 
    
    navigate(`/shop?${queryParams.toString()}`);
  };
  
  const handleSearch = (term: string) => {
    const queryParams = new URLSearchParams(location.search); 
    if (term) {
      queryParams.set('q', term);
    } else {
      queryParams.delete('q');
    }
    navigate(`/shop?${queryParams.toString()}`);
  };

  const filteredProductsForDetailView = useMemo(() => {
    let products = allProducts;
    const lowerSearchTerm = searchTerm.toLowerCase();

    if (activeMainCategorySlug) {
      const mainCat = PRODUCT_CATEGORIES_HIERARCHY.find(mc => mc.slug === activeMainCategorySlug);
      if (mainCat) {
        products = products.filter(p => p.mainCategory === mainCat.name);
        if (activeSubCategorySlug) {
          const subCat = mainCat.subCategories.find(sc => sc.slug === activeSubCategorySlug);
          if (subCat) {
            products = products.filter(p => p.subCategory === subCat.name);
          }
        }
      }
    }

    if (searchTerm) {
      products = products.filter(p => 
        p.name.toLowerCase().includes(lowerSearchTerm) ||
        (p.brand && p.brand.toLowerCase().includes(lowerSearchTerm)) ||
        p.description.toLowerCase().includes(lowerSearchTerm) ||
        (p.tags && p.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm)))
      );
    }
    return products.filter(p => p.mainCategory !== "PC Xây Dựng");
  }, [allProducts, activeMainCategorySlug, activeSubCategorySlug, searchTerm]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProductsForDetailView.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProductsForDetailView, currentPage]);

  const totalPages = Math.ceil(filteredProductsForDetailView.length / PRODUCTS_PER_PAGE);
  
  const showDetailedView = !!activeMainCategorySlug || !!searchTerm;

  const hotProducts = useMemo(() => {
    let selected = allProducts.filter(p => p.originalPrice && p.mainCategory !== "PC Xây Dựng").slice(0, PRODUCTS_PER_CATEGORY_PREVIEW);
    if(selected.length < 5 && allProducts.length > selected.length) {
        const additionalNeeded = Math.max(0, PRODUCTS_PER_CATEGORY_PREVIEW - selected.length);
        selected = selected.concat(
            allProducts
                .filter(p => !selected.find(sp => sp.id === p.id) && p.mainCategory !== "PC Xây Dựng")
                .slice(0, additionalNeeded)
        );
    }
    return selected;
  }, [allProducts]);

  const mainCategoryProductGroups = useMemo(() => {
    return PRODUCT_CATEGORIES_HIERARCHY
      .filter(mc => mc.slug !== 'pc_xay_dung')
      .map(mainCat => ({
        ...mainCat,
        products: allProducts.filter(p => p.mainCategory === mainCat.name).slice(0, PRODUCTS_PER_CATEGORY_PREVIEW)
      }))
      .filter(group => group.products.length > 0);
  }, [allProducts]);

  const getCurrentCategoryName = () => {
    if (!activeMainCategorySlug) return searchTerm ? `Kết quả cho "${searchTerm}"` : "Tất cả sản phẩm";
    const mainCat = PRODUCT_CATEGORIES_HIERARCHY.find(mc => mc.slug === activeMainCategorySlug);
    if (!mainCat) return "Danh mục không xác định";
    let name = mainCat.name;
    if (activeSubCategorySlug) {
      const subCat = mainCat.subCategories.find(sc => sc.slug === activeSubCategorySlug);
      if (subCat) name += ` > ${subCat.name}`;
    }
    if (searchTerm) name += ` (tìm kiếm: "${searchTerm}")`;
    return name;
  };

  return (
    <div className="bg-bgMuted min-h-screen">
      <div className="container mx-auto px-2 sm:px-4 py-6">
        <div className="mb-6">
          <SearchBar onSearch={handleSearch} placeholder="Tìm kiếm sản phẩm..." initialTerm={searchTerm} className="max-w-3xl mx-auto" />
        </div>
      </div>

      <div className="flex">
         <FixedCategoryNav onNavigate={(slug) => handleCategorySelect(slug)} activeSlug={activeMainCategorySlug && !searchTerm && !activeSubCategorySlug ? activeMainCategorySlug : null} />
        
        <main className={`flex-grow ${showDetailedView ? 'lg:ml-[220px]' : 'lg:ml-[220px]' } transition-all duration-300`}>
          {showDetailedView ? (
            <div className="container mx-auto px-4 py-2">
              <h1 className="text-2xl font-bold text-textBase mb-6">{getCurrentCategoryName()}</h1>
              {filteredProductsForDetailView.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {paginatedProducts.map(product => (
                      <ProductCard key={product.id} product={product} context="detail-view" />
                    ))}
                  </div>
                  {totalPages > 1 && (
                    <Pagination 
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-12 bg-bgBase rounded-lg border border-borderDefault">
                  <i className="fas fa-search text-5xl text-textSubtle mb-4"></i>
                  <h3 className="text-xl font-semibold text-textBase mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-textMuted">Vui lòng thử lại với bộ lọc hoặc từ khóa khác.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="philong-shop-layout container mx-auto px-4 pb-8">
              <BannerCarousel />
              
              <div id="hot-products-section" className="scroll-mt-20"> 
                <HorizontalProductScroll products={hotProducts} title="SẢN PHẨM BÁN CHẠY" />
              </div>

              {mainCategoryProductGroups.map((group) => (
                <section key={group.slug} id={`category-section-${group.slug}`} className="mb-10 scroll-mt-20 bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-borderDefault">
                  <div className="flex justify-between items-center mb-2 philong-category-header">
                    <h2 className="philong-section-title !mb-0 !border-b-0">{group.name.toUpperCase()}</h2>
                    <Link 
                        to={`/shop?mainCategory=${group.slug}`} 
                        className="philong-view-all-link text-sm"
                        onClick={() => { setActiveMainCategorySlug(group.slug); setActiveSubCategorySlug(null); setSearchTerm('');}}
                    >
                      Xem tất cả <i className="fa fa-angle-double-right text-xs"></i>
                    </Link>
                  </div>
                  <div className="philong-subcategory-links mb-4">
                    {group.subCategories.map(subCat => (
                      <Link key={subCat.slug} 
                        to={`/shop?mainCategory=${group.slug}&subCategory=${subCat.slug}`}
                        onClick={() => { setActiveMainCategorySlug(group.slug); setActiveSubCategorySlug(subCat.slug); setSearchTerm('');}}
                      >
                        {subCat.name}
                      </Link>
                    ))}
                  </div>
                  <HorizontalProductScroll products={group.products} />
                </section>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
