
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../../data/mockData';
import ProductCard from '../shop/ProductCard';
import Button from '../ui/Button';

const HotProducts: React.FC = () => {
  // Select some products, e.g., those with originalPrice (implying sale) or just first few
  // Aim for up to 8 products for a decent carousel feel
  let hotProducts = MOCK_PRODUCTS.filter(p => p.originalPrice && p.mainCategory !== "PC Xây Dựng").slice(0, 8);
  if (hotProducts.length < 4 && MOCK_PRODUCTS.length > hotProducts.length) { // Ensure at least 4 if possible
    const additionalNeeded = Math.max(0, 8 - hotProducts.length); // Try to get up to 8 total
    const otherProducts = MOCK_PRODUCTS.filter(p => !p.originalPrice && p.mainCategory !== "PC Xây Dựng" && !hotProducts.find(hp => hp.id === p.id));
    hotProducts.push(...otherProducts.slice(0, additionalNeeded));
  }
  if (hotProducts.length === 0 && MOCK_PRODUCTS.length > 0) { // Fallback if no sale items
    hotProducts = MOCK_PRODUCTS.filter(p => p.mainCategory !== "PC Xây Dựng").slice(0,4);
  }


  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const cardElement = scrollContainerRef.current.children[0] as HTMLElement;
      const scrollAmount = cardElement ? cardElement.offsetWidth * 2 : 300 * 2; // Scroll by approx 2 card widths
      
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (hotProducts.length === 0) {
    return (
      <section className="py-16 bg-bgMuted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-textBase mb-4">Sản Phẩm Hot & Khuyến Mãi</h2>
          <p className="text-textMuted mb-8">Hiện chưa có sản phẩm nổi bật nào. Vui lòng quay lại sau!</p>
          <Link to="/shop">
            <Button size="lg" variant="primary">Khám phá tất cả sản phẩm</Button>
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-bgMuted">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
          <div className="text-center sm:text-left mb-4 sm:mb-0">
            <h2 className="text-3xl font-bold text-textBase mb-1">Sản Phẩm Hot & Khuyến Mãi</h2>
            <p className="text-textMuted">
              Khám phá các linh kiện PC đang được ưa chuộng nhất và những ưu đãi đặc biệt.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button 
              onClick={() => scroll('left')} 
              variant="outline" 
              size="md" 
              aria-label="Scroll Left" 
              className="p-2 h-10 w-10 rounded-full border-borderStrong text-textMuted hover:bg-bgCanvas !leading-none" // !leading-none might help alignment
            >
              <i className="fas fa-chevron-left"></i>
            </Button>
            <Button 
              onClick={() => scroll('right')} 
              variant="outline" 
              size="md" 
              aria-label="Scroll Right" 
              className="p-2 h-10 w-10 rounded-full border-borderStrong text-textMuted hover:bg-bgCanvas !leading-none"
            >
              <i className="fas fa-chevron-right"></i>
            </Button>
          </div>
        </div>
        
        <div 
          ref={scrollContainerRef} 
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x snap-mandatory"
        >
          {hotProducts.map(product => (
            <div key={product.id} className="flex-none w-[270px] sm:w-[280px] md:w-[290px] snap-start"> {/* Slightly adjusted fixed widths */}
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/shop">
            <Button size="lg" variant="primary">Xem tất cả sản phẩm</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HotProducts;
