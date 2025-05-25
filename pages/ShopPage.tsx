
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProductCard from '../components/shop/ProductCard';
import { MOCK_PRODUCTS } from '../data/mockData';
import { Product, MainCategoryInfo, SubCategoryInfo } from '../types';
import Button from '../components/ui/Button';
import SearchBar from '../components/shared/SearchBar';
import CategorySidebar from '../components/shop/CategorySidebar'; // Import the sidebar
import { PRODUCT_CATEGORIES_HIERARCHY } from '../constants';
import Pagination from '../components/shared/Pagination'; // Import Pagination

const PRODUCTS_PER_PAGE = 12; // For single category view with pagination
const PRODUCTS_PER_GROUP_PREVIEW = 5; // For "All Categories" view

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
    setCurrentPage(1); // Reset page on filter change
  }, [location.search]);

  const handleCategorySelect = (mainSlug: string | null, subSlug: string | null) => {
    const queryParams = new URLSearchParams();
    if (mainSlug) queryParams.set('mainCategory', mainSlug);
    if (subSlug) queryParams.set('subCategory', subSlug);
    if (searchTerm) queryParams.set('q', searchTerm);
    navigate(`/shop?${queryParams.toString()}`);
  };
  
  const handleSearch = (term: string) => {
    const queryParams = new URLSearchParams();
    if (activeMainCategorySlug) queryParams.set('mainCategory', activeMainCategorySlug);
    if (activeSubCategorySlug) queryParams.set('subCategory', activeSubCategorySlug);
    if (term) queryParams.set('q', term);
    navigate(`/shop?${queryParams.toString()}`);
  };

  const filteredProducts = useMemo(() => {
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
        p.description.toLowerCase().includes(lowerSearchTerm)
      );
    }
    return products.filter(p => p.mainCategory !== "PC Xây Dựng"); // Exclude PC Builder items
  }, [allProducts, activeMainCategorySlug, activeSubCategorySlug, searchTerm]);

  // Paginated products for single category view
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);

  // Product groups for "All Categories" view
  const productGroups = useMemo(() => {
    if (activeMainCategorySlug) return []; // Not used if a main category is selected

    return PRODUCT_CATEGORIES_HIERARCHY
      .filter(mc => mc.slug !== 'pc_xay_dung') // Exclude PC Builder category from groups
      .map(mainCat => {
        let productsInGroup = allProducts.filter(p => p.mainCategory === mainCat.name);
        if (searchTerm) {
          const lowerSearchTerm = searchTerm.toLowerCase();
          productsInGroup = productsInGroup.filter(p => 
            p.name.toLowerCase().includes(lowerSearchTerm) ||
            (p.brand && p.brand.toLowerCase().includes(lowerSearchTerm))
          );
        }
        return { 
          ...mainCat, 
          displayProducts: productsInGroup.slice(0, PRODUCTS_PER_GROUP_PREVIEW),
          totalMatching: productsInGroup.length
        };
      }).filter(group => group.displayProducts.length > 0);
  }, [allProducts, searchTerm, activeMainCategorySlug]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-8">
      <div className="mb-8">
        <SearchBar onSearch={handleSearch} placeholder="Tìm kiếm sản phẩm..." initialTerm={searchTerm} className="shadow-md max-w-2xl mx-auto" />
        {searchTerm && <p className="text-sm text-textMuted mt-2 text-center">Kết quả tìm kiếm cho: "{searchTerm}"</p>}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-3/12 xl:w-1/4">
          <CategorySidebar 
            onCategorySelect={handleCategorySelect}
            currentMainCategorySlug={activeMainCategorySlug}
            currentSubCategorySlug={activeSubCategorySlug}
          />
        </aside>

        <main className="lg:w-9/12 xl:w-3/4">
          {activeMainCategorySlug ? (
            // Single Category View
            <div>
              {filteredProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {paginatedProducts.map(product => (
                      <ProductCard key={product.id} product={product} />
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
                  <i className="fas fa-search text-6xl text-textSubtle mb-4"></i>
                  <h3 className="text-2xl font-semibold text-textBase mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-textMuted">Vui lòng thử lại với bộ lọc hoặc từ khóa khác.</p>
                </div>
              )}
            </div>
          ) : (
            // "All Categories" View (Grouped)
            productGroups.length > 0 ? (
              productGroups.map((mainCatGroup) => (
                <section key={mainCatGroup.slug} className="mb-10 bg-white shadow-lg rounded-lg border border-gray-200">
                  <div className="shop-category-title-band">
                    <span>{mainCatGroup.name.toUpperCase()}</span>
                    <Link 
                      to={`/shop?mainCategory=${mainCatGroup.slug}${searchTerm ? `&q=${encodeURIComponent(searchTerm)}` : ''}`}
                      className="shop-view-all-link text-white hover:text-red-200 text-xs"
                    >
                      Xem tất cả ({mainCatGroup.totalMatching}) <i className="fas fa-chevron-right text-xs"></i>
                    </Link>
                  </div>
                  <div className="p-4">
                    {mainCatGroup.displayProducts.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {mainCatGroup.displayProducts.map(product => (
                          <ProductCard key={product.id} product={product} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-textMuted py-6">
                        Không có sản phẩm nào trong mục "{mainCatGroup.name}"{searchTerm ? ` khớp với tìm kiếm "${searchTerm}"` : ''}.
                      </p>
                    )}
                  </div>
                </section>
              ))
            ) : (
              <div className="text-center py-12 bg-bgBase rounded-lg border border-borderDefault">
                <i className="fas fa-search text-6xl text-textSubtle mb-4"></i>
                <h3 className="text-2xl font-semibold text-textBase mb-2">Không tìm thấy sản phẩm</h3>
                <p className="text-textMuted">Vui lòng thử lại với bộ lọc hoặc từ khóa khác.</p>
              </div>
            )
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;