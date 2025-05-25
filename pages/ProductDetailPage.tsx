
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MOCK_PRODUCTS } from '../data/mockData';
import { Product } from '../types';
import Button from '../components/ui/Button';
import { useCart } from '../hooks/useCart';
import ProductCard from '../components/shop/ProductCard';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const foundProduct = MOCK_PRODUCTS.find(p => p.id === productId);
    setProduct(foundProduct || null);
    setQuantity(1); 
    window.scrollTo(0,0); // Scroll to top when product changes
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-semibold text-textBase">Không tìm thấy sản phẩm</h2>
        <Link to="/shop" className="text-primary hover:underline mt-4 inline-block">
          Quay lại cửa hàng
        </Link>
      </div>
    );
  }

  const relatedProducts = MOCK_PRODUCTS.filter(p => p.subCategory === product.subCategory && p.id !== product.id).slice(0, 4);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-bgBase p-6 md:p-8 rounded-lg shadow-xl border border-borderDefault">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div>
            <img 
              // Fix: Changed product.imageUrl to product.imageUrls[0]
              src={(product.imageUrls && product.imageUrls.length > 0 ? product.imageUrls[0] : `https://picsum.photos/seed/${product.id}/600/400`)} 
              alt={product.name} 
              className="w-full rounded-lg shadow-md object-contain max-h-[500px] border border-borderDefault"
            />
            {/* TODO: Image gallery for multiple images */}
          </div>

          {/* Product Info */}
          <div>
            <nav aria-label="breadcrumb" className="text-sm text-textMuted mb-2">
              <Link to="/shop" className="hover:text-primary">Sản phẩm</Link>
              <span className="mx-1">/</span>
              <Link to={`/shop?mainCategory=${product.mainCategory.toLowerCase().replace(/\s+/g, '_')}`} className="hover:text-primary">{product.mainCategory}</Link>
              <span className="mx-1">/</span>
              <Link to={`/shop?mainCategory=${product.mainCategory.toLowerCase().replace(/\s+/g, '_')}&subCategory=${product.subCategory.toLowerCase().replace(/\s+/g, '_')}`} className="hover:text-primary">{product.subCategory}</Link>
            </nav>
            <h1 className="text-3xl md:text-4xl font-bold text-textBase mb-2">{product.name}</h1>
            <p className="text-textMuted mb-1 text-lg">{product.brand && `Thương hiệu: ${product.brand}`}</p>
            
            <div className="mb-4">
              <span className="text-yellow-500">
                {[...Array(Math.floor(product.rating || 4))].map((_, i) => <i key={`star-${i}`} className="fas fa-star"></i>)}
                {(product.rating || 4) % 1 !== 0 && <i className="fas fa-star-half-alt"></i>}
                {[...Array(5 - Math.ceil(product.rating || 4))].map((_, i) => <i key={`empty-star-${i}`} className="far fa-star"></i>)}
              </span>
              <span className="text-textMuted ml-2">({product.reviews || Math.floor(Math.random() * 200) + 10} đánh giá)</span>
            </div>

            <p className="text-3xl font-bold text-primary mb-2">
              {product.price.toLocaleString('vi-VN')}₫
            </p>
            {product.originalPrice && (
              <p className="text-lg text-textSubtle line-through mb-4">
                {product.originalPrice.toLocaleString('vi-VN')}₫
              </p>
            )}
            {product.status && (
             <p className={`text-md font-semibold mb-4 ${product.status === 'Mới' ? 'text-green-600' : product.status === 'Like new' ? 'text-sky-600' : 'text-amber-600'}`}>
               Tình trạng: {product.status}
             </p>
            )}

            <p className="text-textMuted mb-6">{product.description}</p>

            <div className="flex items-center mb-6 space-x-3">
              <label htmlFor="quantity" className="font-semibold text-textMuted">Số lượng:</label>
              <input 
                type="number" 
                id="quantity"
                value={quantity}
                min="1"
                max={product.stock > 0 ? product.stock : 10} 
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
                className="w-20 bg-white border border-borderStrong text-textBase rounded-md p-2 text-center focus:ring-primary focus:border-primary"
              />
               <span className="text-sm text-textMuted">(Còn {product.stock} sản phẩm)</span>
            </div>
            
            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-3 sm:space-y-0">
              <Button onClick={handleAddToCart} size="lg" className="w-full sm:w-auto" variant="outline" disabled={product.stock <=0}>
                <i className="fas fa-cart-plus mr-2"></i> Thêm vào giỏ hàng
              </Button>
              <Button onClick={handleBuyNow} size="lg" className="w-full sm:w-auto" variant="primary" disabled={product.stock <=0}>
                Mua ngay
              </Button>
            </div>
            {product.stock <= 0 && <p className="text-danger-text mt-2 font-semibold">Hết hàng</p>}
            {product.stock > 0 && product.stock < 5 && <p className="text-warning-text mt-2">Chỉ còn {product.stock} sản phẩm</p>}
          </div>
        </div>

        {/* Product Details Tabs (Description, Specs, Reviews) */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-textBase mb-4 border-b border-borderDefault pb-2">Thông số kỹ thuật</h3>
          {Object.keys(product.specifications).length > 0 ? (
            <div className="space-y-2 text-textMuted">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 even:bg-bgMuted p-2 rounded">
                  <strong className="sm:col-span-1 text-textBase font-medium">{key}:</strong>
                  <span className="sm:col-span-2">{value}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-textMuted">Chưa có thông số kỹ thuật chi tiết cho sản phẩm này.</p>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-textBase mb-6 text-center">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetailPage;