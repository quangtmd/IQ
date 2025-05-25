
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../types';
import Button from '../ui/Button';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
  context?: 'preview' | 'detail-view'; // To control appearance, e.g. show buttons only in detail view
}

const ProductCard: React.FC<ProductCardProps> = ({ product, context = 'preview' }) => {
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
    <div className="philong-product-card relative"> {/* Added relative for badge positioning */}
      {discountPercentage > 0 && (
        <div className="p-sale-badge">
          -{discountPercentage}%
        </div>
      )}
      <Link to={`/product/${product.id}`} className="p-img-wrapper">
        <img 
          src={(product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : `https://picsum.photos/seed/${product.id}/300/225`)} 
          alt={product.name} 
        />
      </Link>
      <div className="p-content">
        {(product.brandLogoUrl || product.brand) && (
            <div className="p-brand">
              {product.brandLogoUrl ? (
                <img src={product.brandLogoUrl} alt={`${product.brand || 'brand'} logo`} />
              ) : (
                <span className="text-xs font-semibold text-textMuted uppercase">{product.brand}</span>
              )}
            </div>
        )}
        
        <h4 className="p-name">
            <Link to={`/product/${product.id}`} title={product.name}>
                {product.name}
            </Link>
        </h4>

        <div className="p-price-group mt-auto"> {/* mt-auto pushes price to bottom */}
          <span className="p-price">
            {product.price.toLocaleString('vi-VN')}₫
          </span>
          {product.originalPrice && product.price < product.originalPrice && (
            <span className="p-unprice">
              {product.originalPrice.toLocaleString('vi-VN')}₫
            </span>
          )}
        </div>
        {product.status && context === 'detail-view' && ( // Only show status in detailed grid for less clutter
             <p className={`p-status text-xs ${product.status === 'Mới' ? 'text-green-600' : product.status === 'Like new' ? 'text-sky-600' : 'text-amber-600'}`}>
               {product.status}
             </p>
        )}

        {context === 'detail-view' && ( // Show buttons only in detailed grid view
          <div className="p-actions space-y-2 mt-2">
            <Button onClick={handleAddToCart} size="sm" className="w-full" variant="outline">
              <i className="fas fa-cart-plus mr-2"></i> Thêm vào giỏ
            </Button>
            {/* <Button onClick={handleBuyNow} size="sm" className="w-full" variant="primary">
              Mua ngay
            </Button> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
