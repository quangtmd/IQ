
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import Button from '../ui/Button';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleAddToCart = () => {
    addToCart(product);
  };

  const handleBuyNow = () => {
    addToCart(product, 1); 
    navigate('/cart');
  };

  const discountPercentage = product.originalPrice && product.price < product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="bg-bgBase rounded-lg shadow-md overflow-hidden flex flex-col transition-all duration-300 hover:shadow-xl border border-borderDefault hover:border-borderStrong h-full relative">
      {discountPercentage > 0 && (
        <div className="discount-badge">
          -{discountPercentage}%
        </div>
      )}
      <Link to={`/product/${product.id}`} className="block">
        <img 
          src={(product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : `https://picsum.photos/seed/${product.id}/400/300`)} 
          alt={product.name} 
          className="w-full h-48 object-contain p-2" // Changed object-cover to object-contain and added padding
        />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        {product.brandLogoUrl || product.brand ? (
            <div className="h-8 mb-2 flex items-center">
              {product.brandLogoUrl ? (
                <img src={product.brandLogoUrl} alt={`${product.brand} logo`} className="max-h-full max-w-[80px] object-contain"/>
              ) : product.brand ? (
                <span className="text-xs font-semibold text-textMuted uppercase">{product.brand}</span>
              ) : null}
            </div>
        ) : <div className="h-8 mb-2"></div> } {/* Placeholder for alignment if no brand */}
        
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="text-sm font-semibold text-textBase hover:text-primary h-10 line-clamp-2 mb-1" title={product.name}>
            {product.name}
          </h3>
        </Link>
        {/* <p className="text-xs text-textMuted mb-1 truncate" title={`${product.mainCategory} / ${product.subCategory}`}>
            {product.mainCategory} / {product.subCategory}
        </p> */}
        <div className="mt-auto pt-2">
          <div className="mb-2">
            <p className="text-lg font-bold text-primary">
              {product.price.toLocaleString('vi-VN')}₫
            </p>
            {product.originalPrice && product.price < product.originalPrice && (
              <p className="text-xs text-textSubtle line-through">
                {product.originalPrice.toLocaleString('vi-VN')}₫
              </p>
            )}
          </div>
          {product.status && (
             <p className={`text-xs font-semibold mb-2 ${product.status === 'Mới' ? 'text-green-600' : product.status === 'Like new' ? 'text-sky-600' : 'text-amber-600'}`}>
               {product.status}
             </p>
          )}
          <div className="space-y-2">
            <Button onClick={handleAddToCart} size="sm" className="w-full" variant="outline">
              <i className="fas fa-cart-plus mr-2"></i> Thêm vào giỏ
            </Button>
            {/* <Button onClick={handleBuyNow} size="sm" className="w-full" variant="primary">
              Mua ngay
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
