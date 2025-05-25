




import React, { useState, useEffect, useCallback } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { 
    Product, Article, User, StaffRole, Order, OrderStatus, AdminNotification, UserRole, 
    FaqItem, DiscountCode, SiteThemeSettings, CustomMenuLink, SiteSettings, TeamMember, StoreImage,
    MainCategoryInfo, SubCategoryInfo, ProductCategoryHierarchy,
    HomepageBannerSettings, HomepageAboutSettings, HomepageAboutFeature, 
    HomepageServiceBenefit, HomepageServicesBenefitsSettings,
    HomepageWhyChooseUsFeature, HomepageWhyChooseUsSettings,
    HomepageStatItem, HomepageStatsCounterSettings,
    HomepageFeaturedProjectItem, HomepageFeaturedProjectsSettings, 
    HomepageTestimonialItem, HomepageTestimonialsSettings,
    HomepageBrandLogo, HomepageBrandLogosSettings,
    HomepageProcessStep, HomepageProcessSettings,
    HomepageCallToActionSettings, HomepageBlogPreviewSettings, HomepageContactSectionSettings
} from '../types';
import { 
    ARTICLE_CATEGORIES, STAFF_ROLE_OPTIONS_CONST, ORDER_STATUSES, PRODUCT_CATEGORIES_HIERARCHY, 
    FAQ_STORAGE_KEY, DISCOUNTS_STORAGE_KEY, THEME_SETTINGS_STORAGE_KEY, CUSTOM_MENU_STORAGE_KEY,
    SITE_CONFIG_STORAGE_KEY, INITIAL_SITE_SETTINGS, INITIAL_FAQS, INITIAL_DISCOUNT_CODES, INITIAL_THEME_SETTINGS, INITIAL_CUSTOM_MENU_LINKS,
    PRODUCTS_STORAGE_KEY, // Import new storage key
    COMPANY_NAME as DEFAULT_COMPANY_NAME, NAVIGATION_LINKS_BASE, ADMIN_EMAIL
} from '../constants';
import { MOCK_PRODUCTS, MOCK_ARTICLES as ALL_MOCK_ARTICLES, MOCK_ORDERS, MOCK_STAFF_USERS as initialStaffUsers, MOCK_SERVICES } from '../data/mockData';
import { useAuth, AuthContextType, AdminPermission } from '../contexts/AuthContext';
import ImageUploadPreview from '../components/ui/ImageUploadPreview';
import Markdown from 'react-markdown';

// Helper to get/set localStorage items
const getLocalStorageItem = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        return defaultValue;
    }
};

const setLocalStorageItem = <T,>(key: string, value: T) => {
    try {
        localStorage.setItem(key, JSON.stringify(value));
        if (key === SITE_CONFIG_STORAGE_KEY) window.dispatchEvent(new CustomEvent('siteSettingsUpdated'));
        if (key === FAQ_STORAGE_KEY) window.dispatchEvent(new CustomEvent('faqsUpdated'));
        if (key === DISCOUNTS_STORAGE_KEY) window.dispatchEvent(new CustomEvent('discountsUpdated'));
        if (key === THEME_SETTINGS_STORAGE_KEY) window.dispatchEvent(new CustomEvent('themeSettingsUpdated'));
        if (key === CUSTOM_MENU_STORAGE_KEY) window.dispatchEvent(new CustomEvent('menuUpdated'));
        // No event for productsUpdated yet, add if needed later
    } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
    }
};

const getAndMergeSiteSettings = (): SiteSettings => {
    const defaultValue = INITIAL_SITE_SETTINGS;
    try {
        const item = localStorage.getItem(SITE_CONFIG_STORAGE_KEY);
        if (item) {
            const parsedItem = JSON.parse(item) as Partial<SiteSettings>;
            const mergedSettings: SiteSettings = { ...defaultValue };

            for (const key in defaultValue) {
                const K = key as keyof SiteSettings;
                if (parsedItem.hasOwnProperty(K)) {
                    if (
                        typeof defaultValue[K] === 'object' && defaultValue[K] !== null && !Array.isArray(defaultValue[K]) &&
                        typeof parsedItem[K] === 'object' && parsedItem[K] !== null && !Array.isArray(parsedItem[K])
                    ) {
                        (mergedSettings[K] as any) = { ...(defaultValue[K] as object), ...(parsedItem[K] as object) };
                    } else if (parsedItem[K] !== undefined) {
                        (mergedSettings[K] as any) = parsedItem[K];
                    }
                }
            }
             // Ensure all nested homepage sections from INITIAL_SITE_SETTINGS are present and are objects
            (Object.keys(INITIAL_SITE_SETTINGS) as Array<keyof SiteSettings>).forEach(sectionKey => {
                if (sectionKey.startsWith('homepage') && typeof INITIAL_SITE_SETTINGS[sectionKey] === 'object' && INITIAL_SITE_SETTINGS[sectionKey] !== null) {
                    if (typeof mergedSettings[sectionKey] !== 'object' || mergedSettings[sectionKey] === null) {
                        // If parsedItem didn't have this section or it wasn't an object, fully take from default
                        (mergedSettings[sectionKey] as any) = { ...(INITIAL_SITE_SETTINGS[sectionKey] as object) };
                    } else {
                        // If it exists in parsed and is an object, ensure all sub-keys from default are there
                         (mergedSettings[sectionKey]as any) = { ...(INITIAL_SITE_SETTINGS[sectionKey] as object), ...(mergedSettings[sectionKey] as object) };
                    }
                }
            });
            return mergedSettings;
        }
        return defaultValue;
    } catch (error) {
        console.error(`Error reading or merging SiteSettings from localStorage:`, error);
        return defaultValue;
    }
};


// Form states and initial values
interface AdminProductFormState { id?: string; name: string; mainCategorySlug: string; subCategorySlug: string; price: number; originalPrice?: number; imageUrlsData: string[]; description: string; specifications: string; stock: number; status: 'Mới' | 'Cũ' | 'Like new'; brand: string;}
const initialProductFormState: AdminProductFormState = { name: '', mainCategorySlug: PRODUCT_CATEGORIES_HIERARCHY[0]?.slug || '', subCategorySlug: PRODUCT_CATEGORIES_HIERARCHY[0]?.subCategories[0]?.slug || '', price: 0, originalPrice: undefined, imageUrlsData: [], description: '', specifications: '{}', stock: 0, status: 'Mới', brand: '',};
interface AdminArticleFormState { id?: string; title: string; summary: string; imageUrl: string; author: string; date: string; category: string; content: string; }
const initialArticleFormState: AdminArticleFormState = { title: '', summary: '', imageUrl: '', author: 'Admin', date: new Date().toISOString().split('T')[0], category: ARTICLE_CATEGORIES[0], content: '',};
interface AdminStaffFormState { id?: string; username: string; email: string; password?: string; role: UserRole; staffRole?: StaffRole;}
const initialStaffFormState: AdminStaffFormState = { username: '', email: '', password: '', role: 'staff', staffRole: STAFF_ROLE_OPTIONS_CONST[0],};
interface AdminFaqFormState extends Omit<FaqItem, 'id'> { id?: string; }
const initialFaqFormState: AdminFaqFormState = { question: '', answer: '', category: 'Chung', isVisible: true };
interface AdminDiscountFormState extends Omit<DiscountCode, 'id' | 'timesUsed'> { id?: string; }
const initialDiscountFormState: AdminDiscountFormState = { code: '', type: 'percentage', value: 10, description: '', isActive: true, expiryDate: '', minSpend: 0, usageLimit: 0 };
interface AdminMenuLinkFormState extends Omit<CustomMenuLink, 'id' | 'originalPath'> { id?: string }
const initialMenuLinkFormState: AdminMenuLinkFormState = { label: '', path: '', order: 100, icon: 'fas fa-link', isVisible: true };
interface AdminTeamMemberFormState extends Omit<TeamMember, 'id'>{ id?: string }
const initialTeamMemberFormState: AdminTeamMemberFormState = { name: '', role: '', quote: '', imageUrl: ''};
interface AdminStoreImageFormState extends Omit<StoreImage, 'id'>{ id?: string }
const initialStoreImageFormState: AdminStoreImageFormState = { url: '', caption: ''};

// Homepage section form states
type AdminHomepageBannerFormState = HomepageBannerSettings;
type AdminHomepageAboutFormState = HomepageAboutSettings;
type AdminHomepageServiceBenefitFormState = HomepageServiceBenefit;
type AdminHomepageWhyChooseUsFormState = HomepageWhyChooseUsSettings;
type AdminHomepageStatItemFormState = HomepageStatItem;
type AdminHomepageFeaturedProjectFormState = HomepageFeaturedProjectsSettings;
type AdminHomepageTestimonialItemFormState = HomepageTestimonialItem;
type AdminHomepageBrandLogoFormState = HomepageBrandLogo;
type AdminHomepageProcessStepFormState = HomepageProcessStep;
type AdminHomepageCallToActionFormState = HomepageCallToActionSettings;
type AdminHomepageBlogPreviewFormState = HomepageBlogPreviewSettings;
type AdminHomepageContactSectionFormState = HomepageContactSectionSettings;


type AdminPageMainTab = 'dashboard' | 'content' | 'users' | 'sales' | 'appearance' | 'notifications' | 'performance' | 'security' | 'analytics' | 'backup' | 'maintenance' | 'support';
type AdminContentSubTab = 'products' | 'articles' | 'siteSettings' | 'faqs';
type AdminUserSubTab = 'staff' | 'customers';
type AdminSalesSubTab = 'orders' | 'discounts';
type AdminAppearanceSubTab = 'theme' | 'menu';

const AdminPage: React.FC = () => {
  const { 
    currentUser, users: authUsers, addUser, updateUser, deleteUser, 
    addAdminNotification: notify, hasPermission, 
    adminNotifications, markAdminNotificationRead, clearAdminNotifications
  } = useAuth();
  
  const [activeMainTab, setActiveMainTab] = useState<AdminPageMainTab>('content');
  const [activeContentSubTab, setActiveContentSubTab] = useState<AdminContentSubTab>('siteSettings'); // Default to Site Settings
  const [activeUserSubTab, setActiveUserSubTab] = useState<AdminUserSubTab>('staff');
  const [activeSalesSubTab, setActiveSalesSubTab] = useState<AdminSalesSubTab>('orders');
  const [activeAppearanceSubTab, setActiveAppearanceSubTab] = useState<AdminAppearanceSubTab>('theme');
  const [openSiteSettingsSections, setOpenSiteSettingsSections] = useState<Record<string, boolean>>({'general':true, 'homepageBanner': true});


  // Product State
  const [products, setProducts] = useState<Product[]>(() => getLocalStorageItem(PRODUCTS_STORAGE_KEY, MOCK_PRODUCTS));
  const [showProductForm, setShowProductForm] = useState(false);
  const [productFormData, setProductFormData] = useState<AdminProductFormState>(initialProductFormState);
  const [isEditingProduct, setIsEditingProduct] = useState<string | null>(null); 
  
  // Article State
  const [articles, setArticles] = useState<Article[]>(() => getLocalStorageItem('adminArticles_v1', ALL_MOCK_ARTICLES));
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [articleFormData, setArticleFormData] = useState<AdminArticleFormState>(initialArticleFormState);
  const [isEditingArticle, setIsEditingArticle] = useState<string | null>(null);

  // Staff & Customer State
  const [staffUsers, setStaffUsers] = useState<User[]>([]);
  const [customerUsers, setCustomerUsers] = useState<User[]>([]);
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffFormData, setStaffFormData] = useState<AdminStaffFormState>(initialStaffFormState);
  const [isEditingStaff, setIsEditingStaff] = useState<string | null>(null);
  
  useEffect(() => {
    setStaffUsers(authUsers.filter(u => u.role === 'staff' || u.role === 'admin'));
    setCustomerUsers(authUsers.filter(u => u.role === 'customer'));
  }, [authUsers]);

  // Order State
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS); 
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  
  // Site Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(getAndMergeSiteSettings);
  const [siteSettingsForm, setSiteSettingsForm] = useState<SiteSettings>(getAndMergeSiteSettings);
  const [showTeamMemberForm, setShowTeamMemberForm] = useState(false);
  const [teamMemberFormData, setTeamMemberFormData] = useState<AdminTeamMemberFormState>(initialTeamMemberFormState);
  const [editingTeamMemberId, setEditingTeamMemberId] = useState<string | null>(null);
  const [showStoreImageForm, setShowStoreImageForm] = useState(false);
  const [storeImageFormData, setStoreImageFormData] = useState<AdminStoreImageFormState>(initialStoreImageFormState);
  const [editingStoreImageId, setEditingStoreImageId] = useState<string | null>(null);

  // Homepage Sub-section Form States
  const [editingHomepageBenefit, setEditingHomepageBenefit] = useState<HomepageServiceBenefit | null>(null);
  const [editingHomepageWhyChooseUsFeature, setEditingHomepageWhyChooseUsFeature] = useState<HomepageWhyChooseUsFeature | null>(null);
  const [editingHomepageStat, setEditingHomepageStat] = useState<HomepageStatItem | null>(null);
  const [editingHomepageTestimonial, setEditingHomepageTestimonial] = useState<HomepageTestimonialItem | null>(null);
  const [editingHomepageBrandLogo, setEditingHomepageBrandLogo] = useState<HomepageBrandLogo | null>(null);
  const [editingHomepageProcessStep, setEditingHomepageProcessStep] = useState<HomepageProcessStep | null>(null);


  // FAQ State
  const [faqs, setFaqs] = useState<FaqItem[]>(() => getLocalStorageItem(FAQ_STORAGE_KEY, INITIAL_FAQS));
  const [showFaqForm, setShowFaqForm] = useState(false);
  const [faqFormData, setFaqFormData] = useState<AdminFaqFormState>(initialFaqFormState);
  const [isEditingFaq, setIsEditingFaq] = useState<string | null>(null);

  // Discount Code State
  const [discounts, setDiscounts] = useState<DiscountCode[]>(() => getLocalStorageItem(DISCOUNTS_STORAGE_KEY, INITIAL_DISCOUNT_CODES));
  const [showDiscountForm, setShowDiscountForm] = useState(false);
  const [discountFormData, setDiscountFormData] = useState<AdminDiscountFormState>(initialDiscountFormState);
  const [isEditingDiscount, setIsEditingDiscount] = useState<string | null>(null);

  // Theme Settings State
  const [themeSettings, setThemeSettings] = useState<SiteThemeSettings>(() => getLocalStorageItem(THEME_SETTINGS_STORAGE_KEY, INITIAL_THEME_SETTINGS));
  const [themeSettingsForm, setThemeSettingsForm] = useState<SiteThemeSettings>(() => getLocalStorageItem(THEME_SETTINGS_STORAGE_KEY, INITIAL_THEME_SETTINGS));

  // Menu Management State
  const [customMenu, setCustomMenu] = useState<CustomMenuLink[]>(() => getLocalStorageItem(CUSTOM_MENU_STORAGE_KEY, INITIAL_CUSTOM_MENU_LINKS));
  const [editingMenuLink, setEditingMenuLink] = useState<CustomMenuLink | null>(null);
  const [showMenuForm, setShowMenuForm] = useState(false);
  const [menuLinkFormData, setMenuLinkFormData] = useState<AdminMenuLinkFormState>(initialMenuLinkFormState);

  const unreadNotificationCount = adminNotifications.filter(n => !n.isRead).length;


  useEffect(() => {
    const handleSettingsUpdate = () => {
      const updatedSettings = getAndMergeSiteSettings();
      setSiteSettings(updatedSettings);
      setSiteSettingsForm(updatedSettings); // Keep form in sync
    };
    window.addEventListener('siteSettingsUpdated', handleSettingsUpdate);
    // Also re-initialize form for theme settings if that changes from localStorage
    const handleThemeUpdate = () => setThemeSettingsForm(getLocalStorageItem(THEME_SETTINGS_STORAGE_KEY, INITIAL_THEME_SETTINGS));
    window.addEventListener('themeSettingsUpdated', handleThemeUpdate);
    
    // Load products from localStorage or use MOCK_PRODUCTS if not found
    const storedProducts = getLocalStorageItem<Product[]>(PRODUCTS_STORAGE_KEY, MOCK_PRODUCTS);
    if (localStorage.getItem(PRODUCTS_STORAGE_KEY) === null) { // Only save MOCK_PRODUCTS if nothing was in localStorage
      setLocalStorageItem(PRODUCTS_STORAGE_KEY, MOCK_PRODUCTS);
    }
    setProducts(storedProducts);

    return () => {
        window.removeEventListener('siteSettingsUpdated', handleSettingsUpdate);
        window.removeEventListener('themeSettingsUpdated', handleThemeUpdate);
    };
  }, []);


  const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProductFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleProductImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const dataUrls = await Promise.all(filesArray.map(fileToDataUrl));
      setProductFormData(prevData => ({
        ...prevData,
        imageUrlsData: [...prevData.imageUrlsData.filter(url => !url.startsWith('data:image')), ...dataUrls] 
      }));
    }
  };
  const handleProductImageUrlChange = (index: number, value: string) => {
    const newImageUrls = [...productFormData.imageUrlsData];
    newImageUrls[index] = value;
    setProductFormData(prev => ({ ...prev, imageUrlsData: newImageUrls }));
  };
  const addProductImageUrlField = () => setProductFormData(prev => ({ ...prev, imageUrlsData: [...prev.imageUrlsData, ''] }));
  const removeProductImageUrlField = (indexToRemove: number) => setProductFormData(prev => ({ ...prev, imageUrlsData: prev.imageUrlsData.filter((_, index) => index !== indexToRemove) }));
  const resetProductForm = () => { setProductFormData(initialProductFormState); setIsEditingProduct(null); setShowProductForm(false); };
  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission(['manageProducts'])) { notify("Bạn không có quyền.", "error"); return; }
    let specsObject = {}; try { specsObject = JSON.parse(productFormData.specifications || '{}'); } catch (error) { notify("JSON thông số kỹ thuật không hợp lệ.", "error"); return; }
    const mainCat = PRODUCT_CATEGORIES_HIERARCHY.find(mc => mc.slug === productFormData.mainCategorySlug);
    const subCat = mainCat?.subCategories.find(sc => sc.slug === productFormData.subCategorySlug);
    if (!mainCat || !subCat) { notify("Danh mục không hợp lệ.", "error"); return; }
    const productPayload: Product = {
      id: isEditingProduct || `prod-${Date.now()}`, name: productFormData.name, mainCategory: mainCat.name, subCategory: subCat.name, category: subCat.name,
      price: Number(productFormData.price), originalPrice: productFormData.originalPrice ? Number(productFormData.originalPrice) : undefined,
      imageUrls: productFormData.imageUrlsData.filter(url => url.trim() !== ''), description: productFormData.description,
      specifications: specsObject, stock: Number(productFormData.stock), status: productFormData.status, brand: productFormData.brand,
    };
    
    let updatedProducts;
    if (isEditingProduct) { 
        updatedProducts = products.map(p => p.id === isEditingProduct ? productPayload : p);
        notify(`Sản phẩm "${productPayload.name}" cập nhật.`, 'success');
    } else { 
        updatedProducts = [productPayload, ...products];
        notify(`Sản phẩm "${productPayload.name}" đã thêm.`, 'success'); 
    }
    setProducts(updatedProducts);
    setLocalStorageItem(PRODUCTS_STORAGE_KEY, updatedProducts);
    resetProductForm();
  };
  const handleEditProduct = (product: Product) => {
    if (!hasPermission(['manageProducts'])) { notify("Không có quyền.", "error"); return; }
    const mainCat = PRODUCT_CATEGORIES_HIERARCHY.find(mc => mc.name === product.mainCategory);
    const subCat = mainCat?.subCategories.find(sc => sc.name === product.subCategory);
    setProductFormData({
      id: product.id, name: product.name, mainCategorySlug: mainCat?.slug || '', subCategorySlug: subCat?.slug || '',
      price: product.price, originalPrice: product.originalPrice, imageUrlsData: product.imageUrls, 
      description: product.description, specifications: JSON.stringify(product.specifications, null, 2),
      stock: product.stock, status: product.status || 'Mới', brand: product.brand || '',
    });
    setIsEditingProduct(product.id); setShowProductForm(true); setActiveContentSubTab('products'); setActiveMainTab('content');
  };
  const handleDeleteProduct = (productId: string) => {
    if (!hasPermission(['manageProducts'])) { notify("Không có quyền.", "error"); return; }
    if (window.confirm("Xóa sản phẩm này?")) { 
        const name = products.find(p=>p.id===productId)?.name; 
        const updatedProducts = products.filter(p => p.id !== productId);
        setProducts(updatedProducts); 
        setLocalStorageItem(PRODUCTS_STORAGE_KEY, updatedProducts);
        notify(`Sản phẩm "${name || 'Không tên'}" đã xóa.`, 'warning');
    }
  };
  
  const handleArticleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setArticleFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleArticleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) { try { const dataUrl = await fileToDataUrl(e.target.files[0]); setArticleFormData(prev => ({ ...prev, imageUrl: dataUrl })); } catch (error) { notify("Lỗi tải ảnh.", "error"); }}};
  const resetArticleForm = () => { setArticleFormData(initialArticleFormState); setIsEditingArticle(null); setShowArticleForm(false); };
  const handleArticleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasPermission(['manageArticles'])) { notify("Không có quyền.", "error"); return; }
    const articlePayload: Article = { id: isEditingArticle || `art-${Date.now()}`, ...articleFormData, content: articleFormData.content || "Nội dung đang cập nhật." };
    let updatedArticles;
    if (isEditingArticle) { updatedArticles = articles.map(a => a.id === isEditingArticle ? articlePayload : a); notify(`Bài viết "${articlePayload.title}" cập nhật.`, 'success');
    } else { updatedArticles = [articlePayload, ...articles]; notify(`Bài viết "${articlePayload.title}" đã thêm.`, 'success'); }
    setArticles(updatedArticles); setLocalStorageItem('adminArticles_v1', updatedArticles); resetArticleForm();
  };
  const handleEditArticle = (article: Article) => { if (!hasPermission(['manageArticles'])) { notify("Không có quyền.", "error"); return; } setArticleFormData({ ...article, content: article.content || '' }); setIsEditingArticle(article.id); setShowArticleForm(true); setActiveContentSubTab('articles'); setActiveMainTab('content'); };
  const handleDeleteArticle = (articleId: string) => {
    if (!hasPermission(['manageArticles'])) { notify("Không có quyền.", "error"); return; }
    if (window.confirm("Xóa bài viết này?")) { const title = articles.find(a=>a.id===articleId)?.title; const updated = articles.filter(a => a.id !== articleId); setArticles(updated); setLocalStorageItem('adminArticles_v1', updated); notify(`Bài viết "${title || 'Không tên'}" đã xóa.`, 'warning'); }
  };

  const handleSiteSettingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, section?: keyof SiteSettings, field?: string, index?: number) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;

    if (section && field && typeof index === 'number') { // Editing an item in an array (e.g., teamMembers, homepageBanner.features)
        setSiteSettingsForm(prev => {
            const sectionData = prev[section] as any;
            if (Array.isArray(sectionData)) { // Simple array like teamMembers
                const updatedArray = sectionData.map((item: any, i: number) => i === index ? {...item, [name]: val} : item);
                return {...prev, [section]: updatedArray};
            } else if (typeof sectionData === 'object' && sectionData !== null && Array.isArray(sectionData[field])) { // Nested array like homepageAbout.features
                 const updatedArray = sectionData[field].map((item: any, i: number) => i === index ? {...item, [name]: val} : item);
                 return {...prev, [section]: {...sectionData, [field]: updatedArray}};
            }
            return prev;
        });
    } else if (section && field) { // Editing a direct field of a section object (e.g. homepageBanner.title)
        setSiteSettingsForm(prev => {
            const sectionData = prev[section] as any;
            return {...prev, [section]: {...sectionData, [field]: val}};
        });
    } else { // Editing a root field of SiteSettings (e.g. companyName)
        setSiteSettingsForm(prev => ({ ...prev, [name]: val }));
    }
  };

  const handleSiteImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof SiteSettings | {section: keyof SiteSettings, field: string, index?: number, subField?: string} ) => {
    if (e.target.files && e.target.files[0]) {
        try {
            const dataUrl = await fileToDataUrl(e.target.files[0]);
            if (typeof fieldName === 'string') {
                setSiteSettingsForm(prev => ({...prev, [fieldName]: dataUrl}));
            } else if (typeof fieldName === 'object') {
                const { section, field, index, subField } = fieldName;
                setSiteSettingsForm(prev => {
                    const sectionData = prev[section] as any;
                    if (typeof index === 'number' && Array.isArray(sectionData)) { // Array of objects e.g. teamMembers
                        const updatedArray = sectionData.map((item: any, i: number) => i === index ? {...item, [field]: dataUrl} : item);
                        return {...prev, [section]: updatedArray};
                    } else if (typeof index === 'number' && subField && Array.isArray(sectionData[subField])) { // Array within a section object e.g. homepageAbout.features
                        const updatedArray = sectionData[subField].map((item: any, i: number) => i === index ? {...item, [field]: dataUrl} : item);
                        return {...prev, [section]: {...sectionData, [subField]: updatedArray}};
                    }
                    else { // Direct field of a section object e.g. homepageBanner.backgroundImageUrl
                         return {...prev, [section]: {...sectionData, [field]: dataUrl}};
                    }
                });
            }
        } catch (error) { notify(`Lỗi tải ảnh.`, "error"); }
    }
  };
  
  const handleSaveSiteSettings = () => { if (!hasPermission(['manageSiteSettings'])) { notify("Không có quyền.", "error"); return; } setLocalStorageItem(SITE_CONFIG_STORAGE_KEY, siteSettingsForm); setSiteSettings(siteSettingsForm); notify("Cài đặt trang đã lưu.", 'success'); };
  const handleFaqInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => { const { name, value, type } = e.target; const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value; setFaqFormData(prev => ({ ...prev, [name]: val }));};
  const resetFaqForm = () => { setFaqFormData(initialFaqFormState); setIsEditingFaq(null); setShowFaqForm(false); };
  const handleFaqFormSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!hasPermission(['manageFaqs'])) { notify("Không có quyền.", "error"); return; } const faqPayload: FaqItem = { id: isEditingFaq || `faq-${Date.now()}`, ...faqFormData }; let updatedFaqs; if (isEditingFaq) { updatedFaqs = faqs.map(f => f.id === isEditingFaq ? faqPayload : f); notify("FAQ cập nhật.", 'success'); } else { updatedFaqs = [faqPayload, ...faqs]; notify("FAQ đã thêm.", 'success'); } setFaqs(updatedFaqs); setLocalStorageItem(FAQ_STORAGE_KEY, updatedFaqs); resetFaqForm(); };
  const handleEditFaq = (faq: FaqItem) => { if (!hasPermission(['manageFaqs'])) { notify("Không có quyền.", "error"); return; } setFaqFormData({ ...faq }); setIsEditingFaq(faq.id); setShowFaqForm(true); setActiveContentSubTab('faqs'); setActiveMainTab('content'); };
  const handleDeleteFaq = (faqId: string) => { if (!hasPermission(['manageFaqs'])) { notify("Không có quyền.", "error"); return; } if (window.confirm("Xóa FAQ này?")) { const updated = faqs.filter(f => f.id !== faqId); setFaqs(updated); setLocalStorageItem(FAQ_STORAGE_KEY, updated); notify("FAQ đã xóa.", 'warning'); }};
  const handleStaffInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setStaffFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const resetStaffForm = () => { setStaffFormData(initialStaffFormState); setIsEditingStaff(null); setShowStaffForm(false); };
  const handleStaffFormSubmit = async (e: React.FormEvent) => { e.preventDefault(); if (!hasPermission(['manageStaff'])) { notify("Không có quyền.", "error"); return; } if (!staffFormData.email || !staffFormData.username) { notify("Email và Tên là bắt buộc.", "error"); return;} if (isEditingStaff) { const { password, ...updates } = staffFormData; const finalUpdates = password ? staffFormData : updates; const success = await updateUser(isEditingStaff, finalUpdates); if (success) notify("Nhân viên cập nhật.", 'success'); else notify("Lỗi cập nhật.", 'error'); } else { if (!staffFormData.password) { notify("Mật khẩu là bắt buộc.", "error"); return;} const newUser = await addUser({ ...staffFormData, role: 'staff' }); if (newUser) notify("Nhân viên mới đã thêm.", 'success'); else notify("Lỗi thêm.", 'error'); } resetStaffForm(); };
  const handleEditStaff = (staff: User) => { if (!hasPermission(['manageStaff'])) { notify("Không có quyền.", "error"); return; } const { password, ...formData } = staff; setStaffFormData({ ...formData, password: '' }); setIsEditingStaff(staff.id); setShowStaffForm(true); setActiveUserSubTab('staff'); setActiveMainTab('users'); };
  const handleDeleteStaff = async (staffId: string) => { if (!hasPermission(['manageStaff'])) { notify("Không có quyền.", "error"); return; } const staffToDelete = staffUsers.find(s => s.id === staffId); if (staffToDelete && staffToDelete.email === currentUser?.email) { notify("Không thể xóa chính mình.", "error"); return; } if (window.confirm("Xóa nhân viên này?")) { const success = await deleteUser(staffId); if (success) notify("Nhân viên đã xóa.", 'warning'); else notify("Lỗi xóa.", 'error'); }};
  const handleUpdateOrderStatus = (orderId: string, newStatus: OrderStatus) => { if (!hasPermission(['manageOrders'])) { notify("Không có quyền.", "error"); return; } setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)); notify(`Đơn hàng #${orderId} cập nhật: "${newStatus}".`, 'info'); };
  const handleDiscountInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { const { name, value, type } = e.target; const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? parseFloat(value) || 0 : value; setDiscountFormData(prev => ({ ...prev, [name]: val })); };
  const resetDiscountForm = () => { setDiscountFormData(initialDiscountFormState); setIsEditingDiscount(null); setShowDiscountForm(false); };
  const handleDiscountFormSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!hasPermission(['manageDiscounts'])) { notify("Không có quyền.", "error"); return; } const payload: DiscountCode = { id: isEditingDiscount || `dc-${Date.now()}`, ...discountFormData, timesUsed: 0, }; let updated; if (isEditingDiscount) { updated = discounts.map(d => d.id === isEditingDiscount ? payload : d); notify(`Mã "${payload.code}" cập nhật.`, 'success'); } else { updated = [payload, ...discounts]; notify(`Mã "${payload.code}" đã thêm.`, 'success'); } setDiscounts(updated); setLocalStorageItem(DISCOUNTS_STORAGE_KEY, updated); resetDiscountForm(); };
  const handleEditDiscount = (discount: DiscountCode) => { if (!hasPermission(['manageDiscounts'])) { notify("Không có quyền.", "error"); return; } setDiscountFormData({ ...discount }); setIsEditingDiscount(discount.id); setShowDiscountForm(true); setActiveSalesSubTab('discounts'); setActiveMainTab('sales'); };
  const handleDeleteDiscount = (discountId: string) => { if (!hasPermission(['manageDiscounts'])) { notify("Không có quyền.", "error"); return; } if (window.confirm("Xóa mã này?")) { const code = discounts.find(d=>d.id===discountId)?.code; const updated = discounts.filter(d => d.id !== discountId); setDiscounts(updated); setLocalStorageItem(DISCOUNTS_STORAGE_KEY, updated); notify(`Mã "${code}" đã xóa.`, 'warning'); }};
  const handleThemeColorChange = (e: React.ChangeEvent<HTMLInputElement>) => setThemeSettingsForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const applyThemeToDocument = (theme: SiteThemeSettings) => { const root = document.documentElement; Object.entries(theme).forEach(([key, value]) => { const cssVarName = `--color-${key.replace(/([A-Z])/g, '-$1').toLowerCase().replace(/-color/, '')}`; root.style.setProperty(cssVarName, value); });};
  const handleSaveThemeSettings = () => { if (!hasPermission(['manageTheme'])) { notify("Không có quyền.", "error"); return; } setThemeSettings(themeSettingsForm); setLocalStorageItem(THEME_SETTINGS_STORAGE_KEY, themeSettingsForm); applyThemeToDocument(themeSettingsForm); notify("Màu sắc đã lưu & áp dụng.", 'success'); };
  const handleMenuLinkInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => { const { name, value, type } = e.target; const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? parseInt(value) || 0 : value; setMenuLinkFormData(prev => ({ ...prev, [name]: val as never})); };
  const resetMenuLinkForm = () => { setMenuLinkFormData(initialMenuLinkFormState); setEditingMenuLink(null); setShowMenuForm(false); };
  const handleMenuLinkFormSubmit = (e: React.FormEvent) => { e.preventDefault(); if (!hasPermission(['manageMenu'])) { notify("Không có quyền.", "error"); return; } const payload: CustomMenuLink = { id: editingMenuLink?.id || `menu-${Date.now()}`, ...menuLinkFormData, originalPath: editingMenuLink?.originalPath || menuLinkFormData.path, }; let updated; if (editingMenuLink) { updated = customMenu.map(m => m.id === editingMenuLink.id ? payload : m); notify(`Link "${payload.label}" cập nhật.`, 'success'); } else { updated = [...customMenu, payload]; notify(`Link "${payload.label}" đã thêm.`, 'success'); } updated.sort((a,b) => a.order - b.order); setCustomMenu(updated); setLocalStorageItem(CUSTOM_MENU_STORAGE_KEY, updated); resetMenuLinkForm(); };
  const handleEditMenuLink = (link: CustomMenuLink) => { if (!hasPermission(['manageMenu'])) { notify("Không có quyền.", "error"); return; } setMenuLinkFormData(link); setEditingMenuLink(link); setShowMenuForm(true); setActiveAppearanceSubTab('menu'); setActiveMainTab('appearance'); };
  const handleDeleteMenuLink = (linkId: string) => { if (!hasPermission(['manageMenu'])) { notify("Không có quyền.", "error"); return; } if (window.confirm("Xóa link này?")) { const label = customMenu.find(m=>m.id===linkId)?.label; const updated = customMenu.filter(m => m.id !== linkId); setCustomMenu(updated); setLocalStorageItem(CUSTOM_MENU_STORAGE_KEY, updated); notify(`Link "${label}" đã xóa.`, 'warning'); }};

  const toggleSiteSettingsSection = (sectionName: string) => {
    setOpenSiteSettingsSections(prev => ({...prev, [sectionName]: !prev[sectionName]}));
  };

  // Generic add/edit/delete for arrays within SiteSettingsForm
  const handleHomepageArrayChange = (section: keyof SiteSettings, field: string, index: number, subField: string, value: any) => {
    setSiteSettingsForm(prev => {
        const currentSection = prev[section] as any;
        const arrayToUpdate = currentSection[field] as any[];
        const updatedArray = arrayToUpdate.map((item, i) => i === index ? { ...item, [subField]: value } : item);
        return { ...prev, [section]: { ...currentSection, [field]: updatedArray }};
    });
  };

  const addHomepageArrayItem = (sectionKey: keyof SiteSettings, arrayField: string, newItemTemplate: any) => {
    setSiteSettingsForm(prev => {
        const sectionData = prev[sectionKey] as any;
        const currentArray = sectionData[arrayField] as any[] || [];
        const newId = `${arrayField.slice(0,3)}-${Date.now()}`;
        return {
            ...prev,
            [sectionKey]: {
                ...sectionData,
                [arrayField]: [...currentArray, { ...newItemTemplate, id: newId, order: currentArray.length + 1 }]
            }
        };
    });
  };

  const deleteHomepageArrayItem = (sectionKey: keyof SiteSettings, arrayField: string, itemId: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa mục này?")) return;
    setSiteSettingsForm(prev => {
        const sectionData = prev[sectionKey] as any;
        const currentArray = sectionData[arrayField] as any[];
        return {
            ...prev,
            [sectionKey]: {
                ...sectionData,
                [arrayField]: currentArray.filter(item => item.id !== itemId)
            }
        };
    });
  };

  const handleHomepageImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionKey: keyof SiteSettings, field: string, itemId?: string, arrayField?: string) => {
    if (e.target.files && e.target.files[0]) {
        const dataUrl = await fileToDataUrl(e.target.files[0]);
        setSiteSettingsForm(prev => {
            const sectionData = prev[sectionKey] as any;
            if (itemId && arrayField) { // Image for an item in an array
                const updatedArray = (sectionData[arrayField] as any[]).map(item => 
                    item.id === itemId ? { ...item, [field]: dataUrl } : item
                );
                return { ...prev, [sectionKey]: { ...sectionData, [arrayField]: updatedArray }};
            } else { // Direct image field in the section
                return { ...prev, [sectionKey]: { ...sectionData, [field]: dataUrl }};
            }
        });
    }
  };
  
  const renderProductManagement = () => (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-6"> <h3 className="text-xl font-semibold">Sản phẩm ({products.length})</h3> {hasPermission(['manageProducts']) && (<Button onClick={() => { setShowProductForm(true); setIsEditingProduct(null); setProductFormData(initialProductFormState); }}> <i className="fas fa-plus mr-2"></i> Thêm Mới </Button>)} </div>
      {showProductForm && hasPermission(['manageProducts']) && ( <form onSubmit={handleProductFormSubmit} className="mb-8 p-6 border rounded-lg bg-bgMuted space-y-4"> <h4 className="text-lg font-medium mb-3">{isEditingProduct ? "Chỉnh sửa" : "Thêm mới"}</h4> <div className="grid md:grid-cols-2 gap-4"> <div><label>Tên*</label><input type="text" name="name" value={productFormData.name} onChange={handleProductInputChange} required className="input-style mt-1"/></div> <div><label>Thương hiệu</label><input type="text" name="brand" value={productFormData.brand} onChange={handleProductInputChange} className="input-style mt-1"/></div> </div> <div className="grid md:grid-cols-2 gap-4"> <div> <label>Danh mục chính*</label> <select name="mainCategorySlug" value={productFormData.mainCategorySlug} onChange={handleProductInputChange} required className="input-style mt-1"> {PRODUCT_CATEGORIES_HIERARCHY.map(mc => <option key={mc.slug} value={mc.slug}>{mc.name}</option>)} </select> </div> <div> <label>Danh mục phụ*</label> <select name="subCategorySlug" value={productFormData.subCategorySlug} onChange={handleProductInputChange} required className="input-style mt-1" disabled={!productFormData.mainCategorySlug}> {(PRODUCT_CATEGORIES_HIERARCHY.find(mc => mc.slug === productFormData.mainCategorySlug)?.subCategories || []).map(sc => <option key={sc.slug} value={sc.slug}>{sc.name}</option>)} </select> </div> </div> <div className="grid md:grid-cols-2 gap-4"> <div><label>Giá (VNĐ)*</label><input type="number" name="price" value={productFormData.price} onChange={handleProductInputChange} required className="input-style mt-1"/></div> <div><label>Giá gốc (VNĐ)</label><input type="number" name="originalPrice" value={productFormData.originalPrice || ''} onChange={handleProductInputChange} className="input-style mt-1"/></div> </div> <div> <label>Link Hình ảnh</label> {productFormData.imageUrlsData.map((url, index) => ( <div key={index} className="flex items-center space-x-2 mt-1"> <input type="text" value={url.startsWith('data:image') ? '(File đã chọn)' : url} onChange={(e) => handleProductImageUrlChange(index, e.target.value)} className="input-style flex-grow" disabled={url.startsWith('data:image')} placeholder="https://example.com/image.jpg"/> {!url.startsWith('data:image') && <Button type="button" variant="danger" size="sm" onClick={() => removeProductImageUrlField(index)}><i className="fas fa-times"></i></Button>} </div> ))} <Button type="button" size="sm" variant="outline" onClick={addProductImageUrlField} className="mt-1 mr-2">Thêm Link</Button> <label htmlFor="productImageUpload" className="mt-1 text-sm text-primary hover:underline cursor-pointer">Hoặc Tải Lên</label> <input type="file" id="productImageUpload" multiple onChange={handleProductImageFileChange} className="hidden" accept="image/*"/> <div className="flex flex-wrap gap-2 mt-2"> {productFormData.imageUrlsData.filter(url => url.startsWith('data:image')).map((dataUrl, index) => ( <ImageUploadPreview key={`preview-file-${index}`} src={dataUrl} onRemove={() => removeProductImageUrlField(productFormData.imageUrlsData.indexOf(dataUrl))} /> ))} </div> </div> <div><label>Mô tả</label><textarea name="description" value={productFormData.description} onChange={handleProductInputChange} rows={3} className="input-style mt-1"></textarea></div> <div> <label>Thông số (JSON)</label> <textarea name="specifications" value={productFormData.specifications} onChange={handleProductInputChange} rows={4} className="input-style mt-1 font-mono text-xs" placeholder='{ "CPU": "Intel Core i5", "RAM": "16GB DDR4" }'></textarea> </div> <div className="grid md:grid-cols-2 gap-4"> <div><label>Tồn kho*</label><input type="number" name="stock" value={productFormData.stock} onChange={handleProductInputChange} required className="input-style mt-1"/></div> <div> <label>Tình trạng*</label> <select name="status" value={productFormData.status} onChange={handleProductInputChange} required className="input-style mt-1"> <option value="Mới">Mới</option><option value="Cũ">Cũ</option><option value="Like new">Like new</option> </select> </div> </div> <div className="flex justify-end space-x-3 pt-3"> <Button type="button" variant="ghost" onClick={resetProductForm}>Hủy</Button> <Button type="submit">{isEditingProduct ? "Cập nhật" : "Thêm"}</Button> </div> </form> )}
      <div className="overflow-x-auto"><table className="min-w-full bg-white text-sm"><thead className="bg-bgMuted"><tr>{['Tên', 'Danh mục', 'Giá', 'Kho', 'Trạng thái', 'Hãng', 'Hành động'].map(h=><th key={h} className="px-4 py-2 text-left font-semibold text-textMuted whitespace-nowrap">{h}</th>)}</tr></thead><tbody className="divide-y divide-borderDefault">{products.map(p=>(<tr key={p.id} className="hover:bg-bgMuted/50"><td className="px-4 py-2 whitespace-nowrap text-textBase font-medium">{p.name}</td><td className="px-4 py-2 whitespace-nowrap text-textMuted text-xs">{p.mainCategory} /<br/>{p.subCategory}</td><td className="px-4 py-2 whitespace-nowrap text-primary font-semibold">{p.price.toLocaleString('vi-VN')}₫</td><td className="px-4 py-2 whitespace-nowrap text-textMuted">{p.stock}</td><td className="px-4 py-2 whitespace-nowrap"><span className={`px-2 py-0.5 text-xs rounded-full ${p.status === 'Mới' ? 'bg-green-100 text-green-700' : p.status === 'Cũ' ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>{p.status}</span></td><td className="px-4 py-2 whitespace-nowrap text-textMuted">{p.brand}</td><td className="px-4 py-2 whitespace-nowrap">{hasPermission(['manageProducts'])?(<><Button variant="ghost" size="sm" onClick={()=>handleEditProduct(p)} className="mr-2 text-primary/80 hover:text-primary"><i className="fas fa-edit"></i></Button><Button variant="ghost" size="sm" onClick={()=>handleDeleteProduct(p.id)} className="text-danger-text/80 hover:text-danger-text"><i className="fas fa-trash"></i></Button></>):(<span className="text-xs text-textSubtle italic">Chỉ xem</span>)}</td></tr>))}</tbody></table></div>
      {products.length === 0 && <p className="text-center text-textMuted py-6">Chưa có sản phẩm.</p>}
    </Card>
  );
  const renderArticleManagement = () => ( <Card className="p-6"> <div className="flex justify-between items-center mb-6"> <h3 className="text-xl font-semibold">Bài viết ({articles.length})</h3> {hasPermission(['manageArticles']) && <Button onClick={() => { setShowArticleForm(true); setIsEditingArticle(null); setArticleFormData(initialArticleFormState); }}><i className="fas fa-plus mr-2"></i> Thêm Mới</Button>} </div> {showArticleForm && hasPermission(['manageArticles']) && ( <form onSubmit={handleArticleFormSubmit} className="mb-8 p-6 border rounded-lg bg-bgMuted space-y-4"> <h4 className="text-lg font-medium">{isEditingArticle ? "Chỉnh sửa" : "Thêm mới"}</h4> <div><label>Tiêu đề*</label><input type="text" name="title" value={articleFormData.title} onChange={handleArticleInputChange} required className="input-style mt-1"/></div> <div><label>Tóm tắt*</label><textarea name="summary" value={articleFormData.summary} onChange={handleArticleInputChange} required rows={2} className="input-style mt-1"></textarea></div> <div><label>URL Hình ảnh</label><input type="text" name="imageUrl" value={articleFormData.imageUrl.startsWith('data:image') ? '(File đã chọn)' : articleFormData.imageUrl} disabled={articleFormData.imageUrl.startsWith('data:image')} onChange={handleArticleInputChange} className="input-style mt-1"/></div> <div><label>Hoặc tải ảnh</label><input type="file" onChange={handleArticleImageUpload} accept="image/*" className="input-style mt-1"/> {articleFormData.imageUrl && articleFormData.imageUrl.startsWith('data:image') && <ImageUploadPreview src={articleFormData.imageUrl} onRemove={() => setArticleFormData(prev => ({...prev, imageUrl: ''}))} className="mt-2"/>} </div> <div className="grid md:grid-cols-3 gap-4"> <div><label>Tác giả</label><input type="text" name="author" value={articleFormData.author} onChange={handleArticleInputChange} className="input-style mt-1"/></div> <div><label>Ngày</label><input type="date" name="date" value={articleFormData.date} onChange={handleArticleInputChange} className="input-style mt-1"/></div> <div><label>Chuyên mục</label><select name="category" value={articleFormData.category} onChange={handleArticleInputChange} className="input-style mt-1">{ARTICLE_CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}</select></div> </div> <div><label>Nội dung (Markdown)*</label><textarea name="content" value={articleFormData.content} onChange={handleArticleInputChange} rows={10} required className="input-style mt-1 font-mono text-xs"></textarea></div> <div className="flex justify-end space-x-3"><Button type="button" variant="ghost" onClick={resetArticleForm}>Hủy</Button><Button type="submit">{isEditingArticle ? "Cập nhật" : "Thêm"}</Button></div> </form> )} <div className="overflow-x-auto"> <table className="min-w-full bg-white text-sm"> <thead className="bg-bgMuted"><tr>{['Tiêu đề', 'Chuyên mục', 'Tác giả', 'Ngày', 'Hành động'].map(h=><th key={h} className="px-4 py-2 text-left font-semibold text-textMuted">{h}</th>)}</tr></thead> <tbody className="divide-y divide-borderDefault"> {articles.map(a=>(<tr key={a.id} className="hover:bg-bgMuted/50"> <td className="px-4 py-2 text-textBase font-medium">{a.title}</td><td className="px-4 py-2">{a.category}</td><td className="px-4 py-2">{a.author}</td><td className="px-4 py-2">{new Date(a.date).toLocaleDateString()}</td> <td className="px-4 py-2">{hasPermission(['manageArticles'])?(<><Button variant="ghost" size="sm" onClick={()=>handleEditArticle(a)} className="mr-2"><i className="fas fa-edit"></i></Button><Button variant="ghost" size="sm" onClick={()=>handleDeleteArticle(a.id)} className="text-danger-text"><i className="fas fa-trash"></i></Button></>):(<span className="text-xs text-textSubtle italic">Chỉ xem</span>)}</td></tr>))}</tbody> </table> </div> {articles.length === 0 && <p className="text-center text-textMuted py-6">Chưa có bài viết.</p>} </Card> );
  
  // Site Settings section render functions will be defined inside renderSiteSettingsManagement
  const renderSiteSettingsManagement = () => {
    const SiteSettingsSection: React.FC<{title: string, sectionKey: string, children: React.ReactNode}> = ({title, sectionKey, children}) => (
        <div className="border-t pt-4 mt-4">
            <Button onClick={() => toggleSiteSettingsSection(sectionKey)} variant="ghost" className="w-full text-left !justify-start mb-2 hover:bg-bgMuted">
                <h4 className="text-lg font-medium text-textBase">{title}</h4>
                <i className={`fas ${openSiteSettingsSections[sectionKey] ? 'fa-chevron-up' : 'fa-chevron-down'} ml-auto text-sm text-textSubtle`}></i>
            </Button>
            {openSiteSettingsSections[sectionKey] && <div className="space-y-4 pl-2">{children}</div>}
        </div>
    );

    return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Cài đặt Trang & Site</h3>
      {hasPermission(['manageSiteSettings']) ? (
        <form onSubmit={(e) => { e.preventDefault(); handleSaveSiteSettings(); }} className="space-y-2">
          <SiteSettingsSection title="Thông tin Công ty & Chung" sectionKey="general">
            <div className="grid md:grid-cols-2 gap-4"> <div><label>Tên công ty</label><input type="text" name="companyName" value={siteSettingsForm.companyName} onChange={handleSiteSettingInputChange} className="input-style mt-1"/></div> <div><label>Slogan</label><input type="text" name="companySlogan" value={siteSettingsForm.companySlogan} onChange={handleSiteSettingInputChange} className="input-style mt-1"/></div> <div><label>Điện thoại</label><input type="text" name="companyPhone" value={siteSettingsForm.companyPhone} onChange={handleSiteSettingInputChange} className="input-style mt-1"/></div> <div><label>Email</label><input type="email" name="companyEmail" value={siteSettingsForm.companyEmail} onChange={handleSiteSettingInputChange} className="input-style mt-1"/></div> </div> <div><label>Địa chỉ</label><textarea name="companyAddress" value={siteSettingsForm.companyAddress} onChange={handleSiteSettingInputChange} rows={2} className="input-style mt-1"/></div>
            <div className="grid md:grid-cols-2 gap-4 items-start"> <div><label>Site Logo URL</label><input type="text" name="siteLogoUrl" value={siteSettingsForm.siteLogoUrl.startsWith('data:image') ? '(File đã chọn)' : siteSettingsForm.siteLogoUrl} disabled={siteSettingsForm.siteLogoUrl.startsWith('data:image')} onChange={(e) => handleSiteSettingInputChange(e, undefined, 'siteLogoUrl')} className="input-style mt-1"/> <input type="file" accept="image/*" onChange={(e) => handleSiteImageUpload(e, 'siteLogoUrl')} className="input-style mt-1"/> {siteSettingsForm.siteLogoUrl && <ImageUploadPreview src={siteSettingsForm.siteLogoUrl} onRemove={()=>setSiteSettingsForm(p=>({...p, siteLogoUrl: ''}))} className="mt-2"/>} </div> <div><label>Site Favicon URL</label><input type="text" name="siteFaviconUrl" value={siteSettingsForm.siteFaviconUrl.startsWith('data:image') ? '(File đã chọn)' : siteSettingsForm.siteFaviconUrl} disabled={siteSettingsForm.siteFaviconUrl.startsWith('data:image')} onChange={(e) => handleSiteSettingInputChange(e, undefined, 'siteFaviconUrl')} className="input-style mt-1"/> <input type="file" accept="image/*" onChange={(e) => handleSiteImageUpload(e, 'siteFaviconUrl')} className="input-style mt-1"/> {siteSettingsForm.siteFaviconUrl && <ImageUploadPreview src={siteSettingsForm.siteFaviconUrl} onRemove={()=>setSiteSettingsForm(p=>({...p, siteFaviconUrl: ''}))} className="mt-2"/>} </div> </div>
            <div><label>Giờ làm việc</label><input type="text" name="workingHours" value={siteSettingsForm.workingHours} onChange={handleSiteSettingInputChange} className="input-style mt-1"/></div>
          </SiteSettingsSection>

          <SiteSettingsSection title="Trang chủ - Banner" sectionKey="homepageBanner">
            <div><label>Tiêu đề chính</label><input type="text" value={siteSettingsForm.homepageBanner?.title || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageBanner', 'title')} className="input-style mt-1" /></div>
            <div><label>Tiêu đề phụ (Pre-title)</label><input type="text" value={siteSettingsForm.homepageBanner?.preTitle || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageBanner', 'preTitle')} className="input-style mt-1" /></div>
            <div><label>Mô tả ngắn (Subtitle)</label><textarea value={siteSettingsForm.homepageBanner?.subtitle || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageBanner', 'subtitle')} rows={3} className="input-style mt-1" /></div>
            <div>
                <label>Ảnh nền Banner</label>
                <input type="text" value={(siteSettingsForm.homepageBanner?.backgroundImageUrl || '').startsWith('data:') ? '(File đã tải)' : (siteSettingsForm.homepageBanner?.backgroundImageUrl || '')} 
                       disabled={(siteSettingsForm.homepageBanner?.backgroundImageUrl || '').startsWith('data:')} 
                       onChange={e => handleSiteSettingInputChange(e, 'homepageBanner', 'backgroundImageUrl')} className="input-style mt-1" />
                 <input type="file" accept="image/*" onChange={e => handleSiteImageUpload(e, {section: 'homepageBanner', field: 'backgroundImageUrl'})} className="input-style mt-1"/>
                 {siteSettingsForm.homepageBanner?.backgroundImageUrl && <ImageUploadPreview src={siteSettingsForm.homepageBanner.backgroundImageUrl} onRemove={()=> setSiteSettingsForm(p => ({...p, homepageBanner: {...p.homepageBanner, backgroundImageUrl: ''}}))} />}
            </div>
             <div><label>Nút chính - Chữ</label><input type="text" value={siteSettingsForm.homepageBanner?.primaryButtonText || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageBanner', 'primaryButtonText')} className="input-style mt-1" /></div>
             <div><label>Nút chính - Link</label><input type="text" value={siteSettingsForm.homepageBanner?.primaryButtonLink || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageBanner', 'primaryButtonLink')} className="input-style mt-1" /></div>

          </SiteSettingsSection>

          <SiteSettingsSection title="Trang chủ - Giới thiệu (About)" sectionKey="homepageAbout">
            <label><input type="checkbox" checked={siteSettingsForm.homepageAbout?.enabled || false} onChange={e => handleSiteSettingInputChange(e, 'homepageAbout', 'enabled')} className="mr-2" /> Kích hoạt mục này</label>
            <div><label>Tiêu đề chính</label><input type="text" value={siteSettingsForm.homepageAbout?.title || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageAbout', 'title')} className="input-style mt-1" /></div>
            <div><label>Mô tả</label><textarea value={siteSettingsForm.homepageAbout?.description || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageAbout', 'description')} rows={4} className="input-style mt-1" /></div>
            <div><label>Ảnh chính</label><input type="file" accept="image/*" onChange={e => handleSiteImageUpload(e, {section: 'homepageAbout', field: 'imageUrl'})} className="input-style mt-1"/>{siteSettingsForm.homepageAbout?.imageUrl && <ImageUploadPreview src={siteSettingsForm.homepageAbout.imageUrl} onRemove={()=> setSiteSettingsForm(p => ({...p, homepageAbout: {...p.homepageAbout, imageUrl: ''}}))} />}</div>
            <h5 className="font-medium mt-2">Đặc điểm nổi bật:</h5>
            {(siteSettingsForm.homepageAbout?.features || []).map((feature, index) => (
                <div key={feature.id} className="p-2 border rounded my-1 bg-gray-50 space-y-1">
                    <input placeholder="Tiêu đề đặc điểm" value={feature.title} onChange={e => handleHomepageArrayChange('homepageAbout', 'features', index, 'title', e.target.value)} className="input-style text-sm" />
                    <input placeholder="Icon (FontAwesome)" value={feature.icon} onChange={e => handleHomepageArrayChange('homepageAbout', 'features', index, 'icon', e.target.value)} className="input-style text-sm" />
                    <textarea placeholder="Mô tả đặc điểm" value={feature.description} onChange={e => handleHomepageArrayChange('homepageAbout', 'features', index, 'description', e.target.value)} rows={2} className="input-style text-sm" />
                    <Button type="button" variant="danger" size="sm" onClick={() => deleteHomepageArrayItem('homepageAbout', 'features', feature.id)}>Xóa</Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addHomepageArrayItem('homepageAbout', 'features', {icon:'', title:'', description:''})}>Thêm Đặc điểm</Button>
          </SiteSettingsSection>

          <SiteSettingsSection title="Trang chủ - Lợi ích Dịch vụ" sectionKey="homepageServicesBenefits">
            <label><input type="checkbox" checked={siteSettingsForm.homepageServicesBenefits?.enabled || false} onChange={e => handleSiteSettingInputChange(e, 'homepageServicesBenefits', 'enabled')} className="mr-2" /> Kích hoạt</label>
            <div><label>Tiêu đề chính</label><input type="text" value={siteSettingsForm.homepageServicesBenefits?.title || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageServicesBenefits', 'title')} className="input-style mt-1" /></div>
             <h5 className="font-medium mt-2">Các lợi ích:</h5>
            {(siteSettingsForm.homepageServicesBenefits?.benefits || []).map((benefit, index) => (
                <div key={benefit.id} className="p-2 border rounded my-1 bg-gray-50 space-y-1">
                    <input placeholder="Tiêu đề lợi ích" value={benefit.title} onChange={e => handleHomepageArrayChange('homepageServicesBenefits', 'benefits', index, 'title', e.target.value)} className="input-style text-sm" />
                    <input placeholder="Icon (FontAwesome)" value={benefit.iconClass} onChange={e => handleHomepageArrayChange('homepageServicesBenefits', 'benefits', index, 'iconClass', e.target.value)} className="input-style text-sm" />
                    <textarea placeholder="Mô tả lợi ích" value={benefit.description} onChange={e => handleHomepageArrayChange('homepageServicesBenefits', 'benefits', index, 'description', e.target.value)} rows={2} className="input-style text-sm" />
                    <input placeholder="Link" value={benefit.link} onChange={e => handleHomepageArrayChange('homepageServicesBenefits', 'benefits', index, 'link', e.target.value)} className="input-style text-sm" />
                    <input type="number" placeholder="Thứ tự" value={benefit.order} onChange={e => handleHomepageArrayChange('homepageServicesBenefits', 'benefits', index, 'order', parseInt(e.target.value))} className="input-style text-sm w-20" />
                    <Button type="button" variant="danger" size="sm" onClick={() => deleteHomepageArrayItem('homepageServicesBenefits', 'benefits', benefit.id)}>Xóa</Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addHomepageArrayItem('homepageServicesBenefits', 'benefits', {iconClass:'', title:'', description:'', link:'/services', order:0})}>Thêm Lợi ích</Button>
          </SiteSettingsSection>
          
          <SiteSettingsSection title="Trang chủ - Tại sao chọn chúng tôi" sectionKey="homepageWhyChooseUs">
            <label><input type="checkbox" checked={siteSettingsForm.homepageWhyChooseUs?.enabled || false} onChange={e => handleSiteSettingInputChange(e, 'homepageWhyChooseUs', 'enabled')} className="mr-2" /> Kích hoạt</label>
            <div><label>Tiêu đề</label><input value={siteSettingsForm.homepageWhyChooseUs?.title || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageWhyChooseUs', 'title')} className="input-style"/></div>
            <div><label>Mô tả</label><textarea value={siteSettingsForm.homepageWhyChooseUs?.description || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageWhyChooseUs', 'description')} className="input-style" rows={3}/></div>
            <div><label>Ảnh chính</label><input type="file" accept="image/*" onChange={e => handleSiteImageUpload(e, {section: 'homepageWhyChooseUs', field: 'mainImageUrl'})} className="input-style"/>{siteSettingsForm.homepageWhyChooseUs?.mainImageUrl && <ImageUploadPreview src={siteSettingsForm.homepageWhyChooseUs.mainImageUrl} onRemove={()=> setSiteSettingsForm(p => ({...p, homepageWhyChooseUs: {...p.homepageWhyChooseUs, mainImageUrl: ''}}))} />}</div>
            <h5 className="font-medium mt-2">Đặc điểm:</h5>
            {(siteSettingsForm.homepageWhyChooseUs?.features || []).map((item, index) => (
              <div key={item.id} className="p-2 border rounded my-1">
                <input value={item.title} onChange={e => handleHomepageArrayChange('homepageWhyChooseUs', 'features', index, 'title', e.target.value)} placeholder="Tiêu đề" className="input-style"/>
                <input value={item.iconClass} onChange={e => handleHomepageArrayChange('homepageWhyChooseUs', 'features', index, 'iconClass', e.target.value)} placeholder="Icon (FontAwesome)" className="input-style"/>
                <textarea value={item.description} onChange={e => handleHomepageArrayChange('homepageWhyChooseUs', 'features', index, 'description', e.target.value)} placeholder="Mô tả" className="input-style" rows={2}/>
                <Button type="button" variant="danger" size="sm" onClick={() => deleteHomepageArrayItem('homepageWhyChooseUs', 'features', item.id)}>Xóa</Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addHomepageArrayItem('homepageWhyChooseUs', 'features', {iconClass:'', title:'', description:''})}>Thêm</Button>
          </SiteSettingsSection>


          <SiteSettingsSection title="Trang chủ - Số liệu Thống kê" sectionKey="homepageStatsCounter">
             <label><input type="checkbox" checked={siteSettingsForm.homepageStatsCounter?.enabled || false} onChange={e => handleSiteSettingInputChange(e, 'homepageStatsCounter', 'enabled')} className="mr-2" /> Kích hoạt</label>
             <h5 className="font-medium mt-2">Các mục thống kê:</h5>
             {(siteSettingsForm.homepageStatsCounter?.stats || []).map((stat, index) => (
                <div key={stat.id} className="p-2 border rounded my-1 bg-gray-50 space-y-1">
                    <input placeholder="Số liệu (VD: 20+)" value={stat.count} onChange={e => handleHomepageArrayChange('homepageStatsCounter', 'stats', index, 'count', e.target.value)} className="input-style text-sm" />
                    <input placeholder="Nhãn (VD: Khách hàng)" value={stat.label} onChange={e => handleHomepageArrayChange('homepageStatsCounter', 'stats', index, 'label', e.target.value)} className="input-style text-sm" />
                    <input placeholder="Icon (FontAwesome)" value={stat.iconClass} onChange={e => handleHomepageArrayChange('homepageStatsCounter', 'stats', index, 'iconClass', e.target.value)} className="input-style text-sm" />
                    <input type="number" placeholder="Thứ tự" value={stat.order} onChange={e => handleHomepageArrayChange('homepageStatsCounter', 'stats', index, 'order', parseInt(e.target.value))} className="input-style text-sm w-20" />
                    <Button type="button" variant="danger" size="sm" onClick={() => deleteHomepageArrayItem('homepageStatsCounter', 'stats', stat.id)}>Xóa</Button>
                </div>
             ))}
             <Button type="button" variant="outline" size="sm" onClick={() => addHomepageArrayItem('homepageStatsCounter', 'stats', {iconClass:'', count:'', label:'', order: 0})}>Thêm Số liệu</Button>
          </SiteSettingsSection>
          
          <SiteSettingsSection title="Trang chủ - Dự án/Dịch vụ nổi bật" sectionKey="homepageFeaturedProjects">
            <label><input type="checkbox" checked={siteSettingsForm.homepageFeaturedProjects?.enabled || false} onChange={e => handleSiteSettingInputChange(e, 'homepageFeaturedProjects', 'enabled')} className="mr-2" /> Kích hoạt</label>
            <div><label>Tiêu đề</label><input value={siteSettingsForm.homepageFeaturedProjects?.title || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageFeaturedProjects', 'title')} className="input-style"/></div>
            <h5 className="font-medium mt-2">ID Dịch vụ nổi bật (phân cách bằng dấu phẩy):</h5>
            <input 
                type="text" 
                value={(siteSettingsForm.homepageFeaturedProjects?.featuredServiceIds || []).join(',')} 
                onChange={e => {
                    const ids = e.target.value.split(',').map(id => id.trim()).filter(id => id);
                    handleSiteSettingInputChange(e, 'homepageFeaturedProjects', 'featuredServiceIds', undefined) // This onChange pattern is not ideal for arrays. Need to adjust handleSiteSettingInputChange or use a specific handler.
                    setSiteSettingsForm(prev => ({...prev, homepageFeaturedProjects: { ...prev.homepageFeaturedProjects, featuredServiceIds: ids}} as SiteSettings))
                }}
                placeholder="1,2,3"
                className="input-style"
            />
          </SiteSettingsSection>

          <SiteSettingsSection title="Trang chủ - Đánh giá Khách hàng" sectionKey="homepageTestimonials">
            <label><input type="checkbox" checked={siteSettingsForm.homepageTestimonials?.enabled || false} onChange={e => handleSiteSettingInputChange(e, 'homepageTestimonials', 'enabled')} className="mr-2" /> Kích hoạt</label>
            <div><label>Tiêu đề</label><input value={siteSettingsForm.homepageTestimonials?.title || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageTestimonials', 'title')} className="input-style"/></div>
            <h5 className="font-medium mt-2">Các đánh giá:</h5>
            {(siteSettingsForm.homepageTestimonials?.testimonials || []).map((item, index) => (
              <div key={item.id} className="p-2 border rounded my-1">
                <input value={item.name} onChange={e => handleHomepageArrayChange('homepageTestimonials', 'testimonials', index, 'name', e.target.value)} placeholder="Tên" className="input-style"/>
                <textarea value={item.quote} onChange={e => handleHomepageArrayChange('homepageTestimonials', 'testimonials', index, 'quote', e.target.value)} placeholder="Đánh giá" className="input-style" rows={2}/>
                <input value={item.role || ''} onChange={e => handleHomepageArrayChange('homepageTestimonials', 'testimonials', index, 'role', e.target.value)} placeholder="Vai trò" className="input-style"/>
                <input value={item.avatarUrl} onChange={e => handleHomepageArrayChange('homepageTestimonials', 'testimonials', index, 'avatarUrl', e.target.value)} placeholder="URL Avatar" className="input-style"/>
                <input type="file" accept="image/*" onChange={e => handleHomepageImageUpload(e, 'homepageTestimonials', 'avatarUrl', item.id, 'testimonials')} className="input-style"/>
                {item.avatarUrl && <ImageUploadPreview src={item.avatarUrl} onRemove={() => handleHomepageArrayChange('homepageTestimonials', 'testimonials', index, 'avatarUrl', '')}/>}
                <Button type="button" variant="danger" size="sm" onClick={() => deleteHomepageArrayItem('homepageTestimonials', 'testimonials', item.id)}>Xóa</Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addHomepageArrayItem('homepageTestimonials', 'testimonials', {name:'', quote:'', avatarUrl:'', role:'', order:0})}>Thêm</Button>
          </SiteSettingsSection>

          <SiteSettingsSection title="Trang chủ - Logo Đối tác" sectionKey="homepageBrandLogos">
            <label><input type="checkbox" checked={siteSettingsForm.homepageBrandLogos?.enabled || false} onChange={e => handleSiteSettingInputChange(e, 'homepageBrandLogos', 'enabled')} className="mr-2" /> Kích hoạt</label>
            <h5 className="font-medium mt-2">Các logo:</h5>
            {(siteSettingsForm.homepageBrandLogos?.logos || []).map((item, index) => (
              <div key={item.id} className="p-2 border rounded my-1">
                <input value={item.name} onChange={e => handleHomepageArrayChange('homepageBrandLogos', 'logos', index, 'name', e.target.value)} placeholder="Tên đối tác" className="input-style"/>
                <input value={item.logoUrl} onChange={e => handleHomepageArrayChange('homepageBrandLogos', 'logos', index, 'logoUrl', e.target.value)} placeholder="URL Logo" className="input-style"/>
                <input type="file" accept="image/*" onChange={e => handleHomepageImageUpload(e, 'homepageBrandLogos', 'logoUrl', item.id, 'logos')} className="input-style"/>
                {item.logoUrl && <ImageUploadPreview src={item.logoUrl} onRemove={() => handleHomepageArrayChange('homepageBrandLogos', 'logos', index, 'logoUrl', '')}/>}
                <Button type="button" variant="danger" size="sm" onClick={() => deleteHomepageArrayItem('homepageBrandLogos', 'logos', item.id)}>Xóa</Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addHomepageArrayItem('homepageBrandLogos', 'logos', {name:'', logoUrl:'', order:0})}>Thêm</Button>
          </SiteSettingsSection>

          <SiteSettingsSection title="Trang chủ - Quy trình Làm việc" sectionKey="homepageProcess">
            <label><input type="checkbox" checked={siteSettingsForm.homepageProcess?.enabled || false} onChange={e => handleSiteSettingInputChange(e, 'homepageProcess', 'enabled')} className="mr-2" /> Kích hoạt</label>
            <div><label>Tiêu đề</label><input value={siteSettingsForm.homepageProcess?.title || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageProcess', 'title')} className="input-style"/></div>
            <h5 className="font-medium mt-2">Các bước:</h5>
            {(siteSettingsForm.homepageProcess?.steps || []).map((item, index) => (
              <div key={item.id} className="p-2 border rounded my-1">
                <input value={item.stepNumber} onChange={e => handleHomepageArrayChange('homepageProcess', 'steps', index, 'stepNumber', e.target.value)} placeholder="Số bước (01)" className="input-style"/>
                <input value={item.title} onChange={e => handleHomepageArrayChange('homepageProcess', 'steps', index, 'title', e.target.value)} placeholder="Tiêu đề bước" className="input-style"/>
                <textarea value={item.description} onChange={e => handleHomepageArrayChange('homepageProcess', 'steps', index, 'description', e.target.value)} placeholder="Mô tả bước" className="input-style" rows={2}/>
                <input value={item.imageUrlSeed} onChange={e => handleHomepageArrayChange('homepageProcess', 'steps', index, 'imageUrlSeed', e.target.value)} placeholder="Seed ảnh (picsum)" className="input-style"/>
                <Button type="button" variant="danger" size="sm" onClick={() => deleteHomepageArrayItem('homepageProcess', 'steps', item.id)}>Xóa</Button>
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addHomepageArrayItem('homepageProcess', 'steps', {stepNumber:'', title:'', description:'', imageUrlSeed:'', order:0})}>Thêm</Button>
          </SiteSettingsSection>

          <SiteSettingsSection title="Trang chủ - Kêu gọi Hành động (CTA)" sectionKey="homepageCallToAction">
            <label><input type="checkbox" checked={siteSettingsForm.homepageCallToAction?.enabled || false} onChange={e => handleSiteSettingInputChange(e, 'homepageCallToAction', 'enabled')} className="mr-2" /> Kích hoạt</label>
            <div><label>Tiêu đề</label><input value={siteSettingsForm.homepageCallToAction?.title || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageCallToAction', 'title')} className="input-style"/></div>
            <textarea value={siteSettingsForm.homepageCallToAction?.description || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageCallToAction', 'description')} placeholder="Mô tả CTA" className="input-style" rows={3}/>
            <input value={siteSettingsForm.homepageCallToAction?.buttonText || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageCallToAction', 'buttonText')} placeholder="Chữ trên nút" className="input-style"/>
            <input value={siteSettingsForm.homepageCallToAction?.buttonLink || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageCallToAction', 'buttonLink')} placeholder="Link nút" className="input-style"/>
          </SiteSettingsSection>

          <SiteSettingsSection title="Trang chủ - Xem trước Blog" sectionKey="homepageBlogPreview">
            <label><input type="checkbox" checked={siteSettingsForm.homepageBlogPreview?.enabled || false} onChange={e => handleSiteSettingInputChange(e, 'homepageBlogPreview', 'enabled')} className="mr-2" /> Kích hoạt</label>
            <div><label>Tiêu đề</label><input value={siteSettingsForm.homepageBlogPreview?.title || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageBlogPreview', 'title')} className="input-style"/></div>
            <input value={siteSettingsForm.homepageBlogPreview?.featuredArticleId || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageBlogPreview', 'featuredArticleId')} placeholder="ID Bài viết nổi bật" className="input-style"/>
            <input 
                value={(siteSettingsForm.homepageBlogPreview?.otherArticleIds || []).join(',')} 
                onChange={e => {
                    const ids = e.target.value.split(',').map(id=>id.trim()).filter(id=>id);
                    setSiteSettingsForm(p => ({...p, homepageBlogPreview: {...p.homepageBlogPreview, otherArticleIds: ids}} as SiteSettings))
                }} 
                placeholder="IDs Bài viết khác (phân cách bằng dấu phẩy)" className="input-style"/>
          </SiteSettingsSection>

           <SiteSettingsSection title="Trang chủ - Phần Liên hệ" sectionKey="homepageContactSection">
            <label><input type="checkbox" checked={siteSettingsForm.homepageContactSection?.enabled || false} onChange={e => handleSiteSettingInputChange(e, 'homepageContactSection', 'enabled')} className="mr-2" /> Kích hoạt</label>
            <div><label>Tiêu đề</label><input value={siteSettingsForm.homepageContactSection?.title || ''} onChange={e => handleSiteSettingInputChange(e, 'homepageContactSection', 'title')} className="input-style"/></div>
            {/* Contact details are usually global, but can add specific override title/text if needed */}
          </SiteSettingsSection>


          <SiteSettingsSection title="Thông tin Trang Giới Thiệu (Trang Riêng)" sectionKey="aboutPage">
            <div><label>Tiêu đề trang Giới thiệu</label><input type="text" name="aboutPageTitle" value={siteSettingsForm.aboutPageTitle} onChange={handleSiteSettingInputChange} className="input-style mt-1"/></div>
            <div><label>Phụ đề trang Giới thiệu</label><input type="text" name="aboutPageSubtitle" value={siteSettingsForm.aboutPageSubtitle} onChange={handleSiteSettingInputChange} className="input-style mt-1"/></div>
            <div><label>Nội dung "Câu chuyện" (Markdown)</label><textarea name="ourStoryContentMarkdown" value={siteSettingsForm.ourStoryContentMarkdown} onChange={handleSiteSettingInputChange} rows={5} className="input-style mt-1 font-mono text-xs"/></div>
            <div><label>Nội dung "Sứ mệnh" (Markdown)</label><textarea name="missionStatementMarkdown" value={siteSettingsForm.missionStatementMarkdown} onChange={handleSiteSettingInputChange} rows={3} className="input-style mt-1 font-mono text-xs"/></div>
            <div><label>Nội dung "Tầm nhìn" (Markdown)</label><textarea name="visionStatementMarkdown" value={siteSettingsForm.visionStatementMarkdown} onChange={handleSiteSettingInputChange} rows={3} className="input-style mt-1 font-mono text-xs"/></div>

            <h5 className="font-medium mt-2">Thành viên đội ngũ:</h5>
            {siteSettingsForm.teamMembers.map(tm => <div key={tm.id} className="flex items-center justify-between p-2 border-b text-sm"><span>{tm.name} ({tm.role})</span><div><Button size="sm" variant="ghost" onClick={()=>{setTeamMemberFormData(tm); setEditingTeamMemberId(tm.id); setShowTeamMemberForm(true);}}>Sửa</Button><Button size="sm" variant="danger" onClick={()=>{setSiteSettingsForm(p => ({ ...p, teamMembers: p.teamMembers.filter(m => m.id !== tm.id)}))}}>Xóa</Button></div></div>)}
            <Button type="button" size="sm" onClick={()=>{setShowTeamMemberForm(true); setEditingTeamMemberId(null); setTeamMemberFormData(initialTeamMemberFormState);}}>Thêm Thành Viên</Button>
            {showTeamMemberForm && (<div className="p-4 border rounded mt-2 space-y-3 bg-bgMuted"><h5>{editingTeamMemberId ? 'Sửa' : 'Thêm'} Thành Viên</h5> <input name="name" placeholder="Tên" value={teamMemberFormData.name} onChange={(e)=>setTeamMemberFormData(p=>({...p, name:e.target.value}))} className="input-style"/> <input name="role" placeholder="Vai trò" value={teamMemberFormData.role} onChange={(e)=>setTeamMemberFormData(p=>({...p, role:e.target.value}))} className="input-style"/> <textarea name="quote" placeholder="Quote" value={teamMemberFormData.quote} onChange={(e)=>setTeamMemberFormData(p=>({...p, quote:e.target.value}))} className="input-style"/> <input name="imageUrl" placeholder="URL Ảnh" value={teamMemberFormData.imageUrl.startsWith('data:')?'(File đã chọn)':teamMemberFormData.imageUrl} disabled={teamMemberFormData.imageUrl.startsWith('data:')} onChange={(e)=>setTeamMemberFormData(p=>({...p, imageUrl:e.target.value}))} className="input-style"/> <input type="file" accept="image/*" onChange={async e=>{if(e.target.files && e.target.files[0]){const d=await fileToDataUrl(e.target.files[0]); setTeamMemberFormData(p=>({...p,imageUrl:d}));}}} className="input-style"/> {teamMemberFormData.imageUrl && <ImageUploadPreview src={teamMemberFormData.imageUrl} onRemove={()=> setTeamMemberFormData(p => ({...p, imageUrl: ''}))} />} <Button type="button" onClick={()=>{ let updated; if(editingTeamMemberId){updated=siteSettingsForm.teamMembers.map(t=>t.id===editingTeamMemberId?{...teamMemberFormData,id:editingTeamMemberId}:t);}else{const newM:TeamMember={...teamMemberFormData,id:`tm-${Date.now()}`};updated=[...siteSettingsForm.teamMembers,newM];} setSiteSettingsForm(p=>({...p,teamMembers:updated}));setShowTeamMemberForm(false);setEditingTeamMemberId(null);setTeamMemberFormData(initialTeamMemberFormState);}}>Lưu</Button> <Button type="button" variant="ghost" onClick={()=>setShowTeamMemberForm(false)}>Hủy</Button> </div>)}
             <h5 className="font-medium mt-2">Hình ảnh cửa hàng:</h5>
            {siteSettingsForm.storeImages.map(si => <div key={si.id} className="p-2 border-b text-sm"><span>{si.caption || si.url.substring(0,30)}</span><div><Button size="sm" variant="ghost" onClick={()=>{setStoreImageFormData(si); setEditingStoreImageId(si.id); setShowStoreImageForm(true);}}>Sửa</Button><Button size="sm" variant="danger" onClick={()=>{setSiteSettingsForm(p => ({ ...p, storeImages: p.storeImages.filter(i => i.id !== si.id)}))}}>Xóa</Button></div></div>)}
            <Button type="button" size="sm" onClick={()=>{setShowStoreImageForm(true); setEditingStoreImageId(null); setStoreImageFormData(initialStoreImageFormState);}}>Thêm Ảnh Cửa Hàng</Button>
            {showStoreImageForm && (<div className="p-4 border rounded mt-2 space-y-3 bg-bgMuted"><h5>{editingStoreImageId ? 'Sửa' : 'Thêm'} Ảnh Cửa Hàng</h5><input name="url" placeholder="URL Ảnh" value={storeImageFormData.url.startsWith('data:')?'(File đã chọn)':storeImageFormData.url} disabled={storeImageFormData.url.startsWith('data:')} onChange={e=>setStoreImageFormData(p=>({...p, url:e.target.value}))} className="input-style"/> <input type="file" accept="image/*" onChange={async e=>{if(e.target.files && e.target.files[0]){const d=await fileToDataUrl(e.target.files[0]); setStoreImageFormData(p=>({...p,url:d}));}}} className="input-style"/> {storeImageFormData.url && <ImageUploadPreview src={storeImageFormData.url} onRemove={()=> setStoreImageFormData(p => ({...p, url: ''}))} />}<input name="caption" placeholder="Chú thích" value={storeImageFormData.caption} onChange={e=>setStoreImageFormData(p=>({...p, caption:e.target.value}))} className="input-style"/><Button type="button" onClick={()=>{let updated;if(editingStoreImageId){updated=siteSettingsForm.storeImages.map(i=>i.id===editingStoreImageId?{...storeImageFormData, id:editingStoreImageId}:i);}else{const newI:StoreImage={...storeImageFormData, id:`si-${Date.now()}`};updated=[...siteSettingsForm.storeImages,newI];}setSiteSettingsForm(p=>({...p,storeImages:updated}));setShowStoreImageForm(false);setEditingStoreImageId(null);setStoreImageFormData(initialStoreImageFormState);}}>Lưu</Button><Button type="button" variant="ghost" onClick={()=>setShowStoreImageForm(false)}>Hủy</Button></div>)}

          </SiteSettingsSection>


          <Button type="submit" variant="primary" size="lg" className="mt-6">Lưu Cài Đặt Site</Button>
        </form>
      ) : ( <p className="italic text-textSubtle">Không có quyền xem hoặc sửa cài đặt.</p> )}
    </Card>
  )};
  const renderFaqManagement = () => ( <Card className="p-6"> <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold">FAQ ({faqs.length})</h3>{hasPermission(['manageFaqs']) && <Button onClick={() => { setShowFaqForm(true); setIsEditingFaq(null); setFaqFormData(initialFaqFormState); }}><i className="fas fa-plus mr-2"></i> Thêm FAQ</Button>}</div> {showFaqForm && hasPermission(['manageFaqs']) && ( <form onSubmit={handleFaqFormSubmit} className="mb-8 p-6 border rounded-lg bg-bgMuted space-y-4"> <h4 className="text-lg font-medium">{isEditingFaq ? "Sửa" : "Thêm"} FAQ</h4> <div><label>Câu hỏi*</label><input type="text" name="question" value={faqFormData.question} onChange={handleFaqInputChange} required className="input-style mt-1"/></div> <div><label>Trả lời (Markdown)*</label><textarea name="answer" value={faqFormData.answer} onChange={handleFaqInputChange} rows={5} required className="input-style mt-1 font-mono text-xs"></textarea></div> <div className="grid md:grid-cols-2 gap-4"> <div><label>Chuyên mục</label><input type="text" name="category" value={faqFormData.category} onChange={handleFaqInputChange} className="input-style mt-1"/></div> <div className="flex items-center pt-6"><input type="checkbox" name="isVisible" id="faqIsVisible" checked={faqFormData.isVisible} onChange={handleFaqInputChange} className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded mr-2"/><label htmlFor="faqIsVisible">Hiển thị</label></div> </div> <div className="flex justify-end space-x-3"><Button type="button" variant="ghost" onClick={resetFaqForm}>Hủy</Button><Button type="submit">{isEditingFaq ? "Cập nhật" : "Thêm"}</Button></div> </form> )} <div className="space-y-3"> {faqs.map(f=>(<div key={f.id} className="p-3 border rounded hover:shadow-sm"> <div className="font-semibold">{f.question} <span className="text-xs text-textSubtle">({f.category}, {f.isVisible ? 'Hiện':'Ẩn'})</span></div>
{/* Fix: Ensure children of Markdown is a single string by concatenating */}
            <div className="text-xs text-textMuted prose prose-sm max-w-none"><Markdown>{f.answer.substring(0,100) + (f.answer.length > 100 ? '...' : '')}</Markdown></div> {hasPermission(['manageFaqs']) && <div className="mt-1"><Button variant="ghost" size="sm" onClick={()=>handleEditFaq(f)}>Sửa</Button><Button variant="ghost" size="sm" onClick={()=>handleDeleteFaq(f.id)} className="text-danger-text">Xóa</Button></div>} </div>))} </div> {faqs.length === 0 && <p className="text-center text-textMuted py-6">Chưa có FAQ.</p>} </Card> );
  const renderStaffManagement = () => ( <Card className="p-6"> <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold">Nhân viên ({staffUsers.length})</h3>{hasPermission(['manageStaff']) && <Button onClick={() => { setShowStaffForm(true); setIsEditingStaff(null); setStaffFormData(initialStaffFormState); }}><i className="fas fa-user-plus mr-2"></i> Thêm Nhân Viên</Button>}</div> {showStaffForm && hasPermission(['manageStaff']) && ( <form onSubmit={handleStaffFormSubmit} className="mb-8 p-6 border rounded-lg bg-bgMuted space-y-4"> <h4 className="text-lg font-medium">{isEditingStaff ? "Sửa" : "Thêm"} Nhân Viên</h4> <div><label>Tên*</label><input type="text" name="username" value={staffFormData.username} onChange={handleStaffInputChange} required className="input-style mt-1"/></div> <div><label>Email*</label><input type="email" name="email" value={staffFormData.email} onChange={handleStaffInputChange} required className="input-style mt-1"/></div> <div><label>Mật khẩu {isEditingStaff ? '(Để trống nếu không đổi)' : '*'}</label><input type="password" name="password" value={staffFormData.password || ''} onChange={handleStaffInputChange} className="input-style mt-1" required={!isEditingStaff}/></div> <div><label>Vai trò*</label><select name="staffRole" value={staffFormData.staffRole} onChange={handleStaffInputChange} required className="input-style mt-1">{STAFF_ROLE_OPTIONS_CONST.map(r=><option key={r} value={r}>{r}</option>)}</select></div> <div className="flex justify-end space-x-3"><Button type="button" variant="ghost" onClick={resetStaffForm}>Hủy</Button><Button type="submit">{isEditingStaff ? "Cập nhật" : "Thêm"}</Button></div> </form> )} <div className="overflow-x-auto"> <table className="min-w-full bg-white text-sm"> <thead className="bg-bgMuted"><tr>{['Tên', 'Email', 'Vai trò', 'Hành động'].map(h=><th key={h} className="px-4 py-2 text-left font-semibold text-textMuted">{h}</th>)}</tr></thead> <tbody className="divide-y divide-borderDefault"> {staffUsers.map(s=>(<tr key={s.id} className="hover:bg-bgMuted/50"> <td className="px-4 py-2">{s.username} {s.email === ADMIN_EMAIL && <span className="text-xs text-primary">(Admin chính)</span>}</td><td className="px-4 py-2">{s.email}</td><td className="px-4 py-2">{s.staffRole || s.role}</td> <td className="px-4 py-2">{hasPermission(['manageStaff']) && s.email !== ADMIN_EMAIL ?(<><Button variant="ghost" size="sm" onClick={()=>handleEditStaff(s)}>Sửa</Button><Button variant="ghost" size="sm" onClick={()=>handleDeleteStaff(s.id)} className="text-danger-text">Xóa</Button></>):(<span className="text-xs text-textSubtle italic">N/A</span>)}</td></tr>))}</tbody> </table> </div> </Card> );
  const renderCustomerManagement = () => ( <Card className="p-6"> <h3 className="text-xl font-semibold mb-4">Khách hàng ({customerUsers.length})</h3> {hasPermission(['viewCustomers']) ? ( customerUsers.length > 0 ? ( <div className="overflow-x-auto"> <table className="min-w-full bg-white text-sm"><thead className="bg-bgMuted"><tr>{['Tên', 'Email'].map(h=><th key={h} className="px-4 py-2 text-left font-semibold text-textMuted">{h}</th>)}</tr></thead> <tbody className="divide-y divide-borderDefault">{customerUsers.map(c=>(<tr key={c.id} className="hover:bg-bgMuted/50"><td className="px-4 py-2">{c.username}</td><td className="px-4 py-2">{c.email}</td></tr>))}</tbody></table> </div> ) : <p className="text-center text-textMuted py-6">Chưa có khách hàng.</p> ) : <p className="italic text-textSubtle">Không có quyền xem.</p>} </Card> );
  const renderOrderManagement = () => ( <Card className="p-6"> <h3 className="text-xl font-semibold mb-4">Đơn hàng ({orders.length})</h3> {hasPermission(['viewOrders']) ? ( <div className="overflow-x-auto"> <table className="min-w-full bg-white text-sm"> <thead className="bg-bgMuted"><tr>{['ID', 'Khách hàng', 'Ngày', 'Tổng tiền', 'Trạng thái', 'Hành động'].map(h=><th key={h} className="px-4 py-2 text-left font-semibold text-textMuted whitespace-nowrap">{h}</th>)}</tr></thead> <tbody className="divide-y divide-borderDefault"> {orders.map(o=>(<tr key={o.id} className="hover:bg-bgMuted/50"> <td className="px-4 py-2 text-xs font-mono">{o.id.substring(0,10)}...</td><td className="px-4 py-2">{o.customerInfo.fullName}</td><td className="px-4 py-2">{new Date(o.orderDate).toLocaleDateString()}</td> <td className="px-4 py-2 text-primary font-semibold">{o.totalAmount.toLocaleString('vi-VN')}₫</td> <td className="px-4 py-2"> {hasPermission(['manageOrders']) ? (<select value={o.status} onChange={(e)=>handleUpdateOrderStatus(o.id, e.target.value as OrderStatus)} className="input-style p-1 text-xs"> {ORDER_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}</select>) : (<span className={`px-2 py-0.5 text-xs rounded-full bg-gray-200`}>{o.status}</span>) } </td> <td className="px-4 py-2"><Button variant="ghost" size="sm" onClick={()=>setViewingOrder(o)}>Xem</Button></td></tr>))}</tbody> </table> {viewingOrder && <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={()=>setViewingOrder(null)}><div className="bg-white p-6 rounded-lg max-w-lg w-full max-h-[80vh] overflow-y-auto" onClick={e=>e.stopPropagation()}><h4 className="text-lg font-semibold mb-2">Chi tiết ĐH: {viewingOrder.id}</h4><pre className="text-xs bg-bgMuted p-2 rounded overflow-x-auto">{JSON.stringify(viewingOrder, null, 2)}</pre><Button onClick={()=>setViewingOrder(null)} className="mt-4">Đóng</Button></div></div>} </div> ) : <p className="italic text-textSubtle">Không có quyền xem.</p>} {orders.length === 0 && hasPermission(['viewOrders']) && <p className="text-center text-textMuted py-6">Chưa có đơn hàng.</p>} </Card> );
  const renderDiscountManagement = () => ( <Card className="p-6"> <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold">Mã Giảm Giá ({discounts.length})</h3>{hasPermission(['manageDiscounts']) && <Button onClick={() => { setShowDiscountForm(true); setIsEditingDiscount(null); setDiscountFormData(initialDiscountFormState); }}><i className="fas fa-tags mr-2"></i>Thêm Mới</Button>}</div> {showDiscountForm && hasPermission(['manageDiscounts']) && ( <form onSubmit={handleDiscountFormSubmit} className="mb-8 p-6 border rounded-lg bg-bgMuted space-y-4"> <h4 className="text-lg font-medium">{isEditingDiscount ? "Sửa" : "Thêm"} Mã</h4> <div className="grid md:grid-cols-2 gap-4"> <div><label>Mã code*</label><input type="text" name="code" value={discountFormData.code} onChange={handleDiscountInputChange} required className="input-style mt-1"/></div> <div><label>Loại*</label><select name="type" value={discountFormData.type} onChange={handleDiscountInputChange} className="input-style mt-1"><option value="percentage">Phần trăm</option><option value="fixed_amount">Số tiền</option></select></div> </div> <div><label>Giá trị*</label><input type="number" name="value" value={discountFormData.value} onChange={handleDiscountInputChange} required className="input-style mt-1"/></div> <div><label>Mô tả</label><textarea name="description" value={discountFormData.description} onChange={handleDiscountInputChange} rows={2} className="input-style mt-1"></textarea></div> <div className="grid md:grid-cols-2 gap-4"> <div><label>Hết hạn (YYYY-MM-DD)</label><input type="date" name="expiryDate" value={discountFormData.expiryDate?.split('T')[0]} onChange={handleDiscountInputChange} className="input-style mt-1"/></div> <div><label>Chi tiêu tối thiểu</label><input type="number" name="minSpend" value={discountFormData.minSpend} onChange={handleDiscountInputChange} className="input-style mt-1"/></div> </div> <div className="grid md:grid-cols-2 gap-4 items-center"> <div><label>Giới hạn sử dụng</label><input type="number" name="usageLimit" value={discountFormData.usageLimit || 0} onChange={handleDiscountInputChange} className="input-style mt-1"/></div> <div className="pt-5"><input type="checkbox" name="isActive" id="discountIsActive" checked={discountFormData.isActive} onChange={handleDiscountInputChange} className="h-4 w-4 mr-2"/> <label htmlFor="discountIsActive">Kích hoạt</label></div> </div> <div className="flex justify-end space-x-3"><Button type="button" variant="ghost" onClick={resetDiscountForm}>Hủy</Button><Button type="submit">{isEditingDiscount ? "Cập nhật" : "Thêm"}</Button></div> </form> )} <div className="overflow-x-auto"> <table className="min-w-full bg-white text-sm"> <thead className="bg-bgMuted"><tr>{['Mã', 'Loại', 'Giá trị', 'Hết hạn', 'Trạng thái', 'Hành động'].map(h=><th key={h} className="px-4 py-2 text-left font-semibold text-textMuted">{h}</th>)}</tr></thead> <tbody className="divide-y divide-borderDefault"> {discounts.map(d=>(<tr key={d.id} className="hover:bg-bgMuted/50"> <td className="px-4 py-2 font-mono">{d.code}</td><td>{d.type}</td><td>{d.value.toLocaleString()}{d.type==='percentage'?'%':''}</td><td>{d.expiryDate ? new Date(d.expiryDate).toLocaleDateString() : 'N/A'}</td> <td><span className={`px-2 py-0.5 rounded-full text-xs ${d.isActive ? 'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{d.isActive?'Active':'Inactive'}</span></td> <td className="px-4 py-2">{hasPermission(['manageDiscounts'])?(<><Button variant="ghost" size="sm" onClick={()=>handleEditDiscount(d)}>Sửa</Button><Button variant="ghost" size="sm" onClick={()=>handleDeleteDiscount(d.id)} className="text-danger-text">Xóa</Button></>):(<span className="text-xs text-textSubtle italic">Chỉ xem</span>)}</td></tr>))}</tbody> </table> </div> {discounts.length === 0 && <p className="text-center text-textMuted py-6">Chưa có mã giảm giá.</p>} </Card> );
  const renderThemeManagement = () => ( <Card className="p-6"> <h3 className="text-xl font-semibold mb-6">Màu Sắc Giao Diện</h3> {hasPermission(['manageTheme']) ? ( <form onSubmit={(e)=>{e.preventDefault(); handleSaveThemeSettings();}} className="space-y-4"> <div className="grid md:grid-cols-3 gap-6"> {(['primaryColorDefault', 'primaryColorLight', 'primaryColorDark'] as const).map(key => ( <div key={key}><label className="capitalize block text-sm mb-1">{key.replace(/([A-Z])/g, ' $1').replace('Color',' Màu ')}</label><input type="color" name={key} value={themeSettingsForm[key]} onChange={handleThemeColorChange} className="w-full h-10 input-style p-1"/></div> ))} </div> <div className="grid md:grid-cols-3 gap-6"> {(['secondaryColorDefault', 'secondaryColorLight', 'secondaryColorDark'] as const).map(key => ( <div key={key}><label className="capitalize block text-sm mb-1">{key.replace(/([A-Z])/g, ' $1').replace('Color',' Màu ')}</label><input type="color" name={key} value={themeSettingsForm[key]} onChange={handleThemeColorChange} className="w-full h-10 input-style p-1"/></div> ))} </div> <Button type="submit" variant="primary" size="lg" className="mt-6">Lưu & Áp dụng</Button> </form> ) : <p className="italic text-textSubtle">Không có quyền.</p>} </Card> );
  const renderMenuManagement = () => ( <Card className="p-6"> <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold">Menu Chính ({customMenu.length})</h3>{hasPermission(['manageMenu']) && <Button onClick={() => { setShowMenuForm(true); setEditingMenuLink(null); setMenuLinkFormData(initialMenuLinkFormState); }}><i className="fas fa-plus mr-2"></i>Thêm Link</Button>}</div> {showMenuForm && hasPermission(['manageMenu']) && ( <form onSubmit={handleMenuLinkFormSubmit} className="mb-8 p-6 border rounded-lg bg-bgMuted space-y-4"> <h4 className="text-lg font-medium">{editingMenuLink ? "Sửa" : "Thêm"} Link</h4> <div className="grid md:grid-cols-2 gap-4"> <div><label>Nhãn*</label><input type="text" name="label" value={menuLinkFormData.label} onChange={handleMenuLinkInputChange} required className="input-style mt-1"/></div> <div><label>Đường dẫn* (VD: /shop)</label><input type="text" name="path" value={menuLinkFormData.path} onChange={handleMenuLinkInputChange} required className="input-style mt-1"/></div> </div> <div className="grid md:grid-cols-2 gap-4 items-center"> <div><label>Icon (VD: fas fa-home)</label><input type="text" name="icon" value={menuLinkFormData.icon} onChange={handleMenuLinkInputChange} className="input-style mt-1"/></div> <div><label>Thứ tự</label><input type="number" name="order" value={menuLinkFormData.order} onChange={handleMenuLinkInputChange} className="input-style mt-1"/></div> </div> <div className="pt-2"><input type="checkbox" name="isVisible" id="menuIsVisible" checked={menuLinkFormData.isVisible} onChange={handleMenuLinkInputChange} className="h-4 w-4 mr-2"/> <label htmlFor="menuIsVisible">Hiển thị</label></div> <div className="flex justify-end space-x-3"><Button type="button" variant="ghost" onClick={resetMenuLinkForm}>Hủy</Button><Button type="submit">{editingMenuLink ? "Cập nhật" : "Thêm"}</Button></div> </form> )} <div className="space-y-2"> {customMenu.map(m => (<div key={m.id} className="flex items-center justify-between p-3 border rounded hover:bg-bgMuted/50"> <div><i className={`${m.icon || 'fas fa-link'} mr-2 opacity-60`}></i><span className="font-medium">{m.label}</span> <span className="text-xs text-textSubtle">({m.path}, order: {m.order}, {m.isVisible?'Hiện':'Ẩn'})</span></div> {hasPermission(['manageMenu']) && <div><Button variant="ghost" size="sm" onClick={()=>handleEditMenuLink(m)}>Sửa</Button><Button variant="ghost" size="sm" onClick={()=>handleDeleteMenuLink(m.id)} className="text-danger-text">Xóa</Button></div>} </div>))} </div> {customMenu.length === 0 && <p className="text-center text-textMuted py-6">Chưa có link menu.</p>} </Card> );
  const renderNotifications = () => ( <Card className="p-6"> <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-semibold">Thông Báo ({adminNotifications.length}, {unreadNotificationCount} chưa đọc)</h3>{adminNotifications.length > 0 && <Button variant="outline" size="sm" onClick={clearAdminNotifications}>Xóa tất cả</Button>}</div> {hasPermission(['viewNotifications']) ? ( adminNotifications.length > 0 ? ( <div className="space-y-3 max-h-[60vh] overflow-y-auto"> {adminNotifications.map(n => ( <div key={n.id} className={`p-3 rounded border flex justify-between items-start ${n.isRead ? 'bg-bgMuted opacity-70' : 'bg-white shadow-sm'} ${n.type === 'error' ? 'border-danger-border' : n.type === 'warning' ? 'border-warning-border' : 'border-borderDefault'}`}> <div> <p className={`text-sm ${n.type === 'error' ? 'text-danger-text' : n.type === 'warning' ? 'text-warning-text' : 'text-textBase'}`}>{n.message}</p> <p className="text-xs text-textSubtle mt-1">{new Date(n.timestamp).toLocaleString()}</p> </div> {!n.isRead && <Button size="sm" variant="ghost" onClick={() => markAdminNotificationRead(n.id)}>Đánh dấu đã đọc</Button>} </div> ))} </div> ) : <p className="text-center text-textMuted py-6">Không có thông báo.</p> ) : <p className="italic text-textSubtle">Không có quyền xem.</p>} </Card> );

  const renderMainContent = () => {
    if (activeMainTab === 'dashboard') return <Card className="p-6"><h3 className="text-xl font-semibold mb-4">Dashboard</h3><p className="italic text-textSubtle">Đang phát triển.</p></Card>;
    if (activeMainTab === 'content') {
      switch(activeContentSubTab) {
        case 'products': return renderProductManagement();
        case 'articles': return renderArticleManagement();
        case 'siteSettings': return renderSiteSettingsManagement();
        case 'faqs': return renderFaqManagement();
        default: return null;
      }
    }
    if (activeMainTab === 'users') {
        if (activeUserSubTab === 'staff') return renderStaffManagement();
        if (activeUserSubTab === 'customers') return renderCustomerManagement();
    }
    if (activeMainTab === 'sales') {
        if (activeSalesSubTab === 'orders') return renderOrderManagement();
        if (activeSalesSubTab === 'discounts') return renderDiscountManagement();
    }
     if (activeMainTab === 'appearance') {
        if (activeAppearanceSubTab === 'theme') return renderThemeManagement();
        if (activeAppearanceSubTab === 'menu') return renderMenuManagement();
    }
    if (activeMainTab === 'notifications') return renderNotifications();
    
    const currentMainTabInfo = mainTabs.find(t => t.id === activeMainTab);
    return <Card className="p-6"><p className="italic">"{currentMainTabInfo?.label}" - Đang phát triển.</p></Card>;
  };

  const mainTabs: Array<{ id: AdminPageMainTab; label: string; icon: string; permission?: AdminPermission | AdminPermission[]; subTabs?: Array<{ id: AdminContentSubTab | AdminUserSubTab | AdminSalesSubTab | AdminAppearanceSubTab; label: string; mainTabId: AdminPageMainTab; permission?: AdminPermission | AdminPermission[]; }>;}> = [ { id: 'dashboard', label: "Dashboard", icon: "fas fa-tachometer-alt", permission: 'viewDashboard' }, { id: 'content', label: "Nội dung", icon: "fas fa-cubes", permission: 'viewContent', subTabs: [ {id: 'siteSettings', label: "Trang & Site", mainTabId: 'content', permission: 'manageSiteSettings'}, {id: 'products', label: "Sản phẩm", mainTabId: 'content', permission: 'viewProducts'}, {id: 'articles', label: "Bài viết", mainTabId: 'content', permission: 'viewArticles'}, {id: 'faqs', label: "FAQ", mainTabId: 'content', permission: 'manageFaqs'}, ] }, { id: 'users', label: "Người dùng", icon: "fas fa-users", permission: 'viewUsers', subTabs: [ {id: 'staff', label: "Nhân viên", mainTabId: 'users', permission: 'manageStaff'}, {id: 'customers', label: "Khách hàng", mainTabId: 'users', permission: 'viewCustomers'}, ] }, { id: 'sales', label: "Bán hàng", icon: "fas fa-chart-line", permission: 'viewSales', subTabs: [ {id: 'orders', label: "Đơn hàng", mainTabId: 'sales', permission: 'viewOrders'}, {id: 'discounts', label: "Mã Giảm Giá", mainTabId: 'sales', permission: 'manageDiscounts'}, ] }, { id: 'appearance', label: "Giao diện", icon: "fas fa-paint-brush", permission: 'viewAppearance', subTabs: [ {id: 'theme', label: "Màu Sắc", mainTabId: 'appearance', permission: 'manageTheme'}, {id: 'menu', label: "Menu", mainTabId: 'appearance', permission: 'manageMenu'}, ] }, { id: 'notifications', label: `Thông báo ${unreadNotificationCount > 0 ? `(${unreadNotificationCount})` : ''}`, icon: "fas fa-bell", permission: 'viewNotifications' }, { id: 'performance', label: "Hiệu suất", icon: "fas fa-rocket", permission: 'viewPerformance' }, { id: 'security', label: "Bảo mật", icon: "fas fa-shield-alt", permission: 'viewSecurity' }, ];
  const currentMainTabForSidebar = activeMainTab;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-textBase mb-6">Trang Quản Trị {siteSettingsForm.companyName || DEFAULT_COMPANY_NAME}</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <aside className="md:w-72 bg-bgBase p-4 rounded-lg shadow-md border border-borderDefault h-fit md:sticky md:top-24">
          <nav className="space-y-1">
            {mainTabs.map(mainTab => { const canViewMainTab = mainTab.permission ? hasPermission(Array.isArray(mainTab.permission) ? mainTab.permission : [mainTab.permission]) : true; if (!canViewMainTab && !mainTab.subTabs?.some(st => st.permission ? hasPermission(Array.isArray(st.permission) ? st.permission : [st.permission]) : true )) return null; return ( <div key={mainTab.id}> <button onClick={() => { setActiveMainTab(mainTab.id); if (mainTab.subTabs && mainTab.subTabs.length > 0) { const firstPermittedSubTab = mainTab.subTabs.find(st => st.permission ? hasPermission(Array.isArray(st.permission) ? st.permission : [st.permission]) : true) || mainTab.subTabs[0]; if (mainTab.id === 'content') setActiveContentSubTab(firstPermittedSubTab.id as AdminContentSubTab); else if (mainTab.id === 'users') setActiveUserSubTab(firstPermittedSubTab.id as AdminUserSubTab); else if (mainTab.id === 'sales') setActiveSalesSubTab(firstPermittedSubTab.id as AdminSalesSubTab); else if (mainTab.id === 'appearance') setActiveAppearanceSubTab(firstPermittedSubTab.id as AdminAppearanceSubTab); } }} className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
currentMainTabForSidebar === mainTab.id ? (mainTab.subTabs ? 'text-textBase font-semibold' : 'bg-primary text-white shadow-sm') : 'text-textMuted hover:bg-bgMuted hover:text-textBase'}`} > <i className={`${mainTab.icon} w-5 text-center opacity-80`}></i> <span>{mainTab.label}</span> {mainTab.subTabs && <i className={`fas fa-chevron-down text-xs ml-auto transition-transform duration-200 ${
currentMainTabForSidebar === mainTab.id ? 'rotate-180' : ''}`}></i>} </button> {mainTab.subTabs && 
currentMainTabForSidebar === mainTab.id && ( <div className="pl-6 mt-1 space-y-0.5 border-l-2 border-borderDefault ml-3"> {mainTab.subTabs.map(sub => { const canViewSubTab = sub.permission ? hasPermission(Array.isArray(sub.permission) ? sub.permission : [sub.permission]) : true; if (!canViewSubTab) return null; let isActiveSubTab = false; if (mainTab.id === 'content' && activeContentSubTab === sub.id) isActiveSubTab = true; else if (mainTab.id === 'users' && activeUserSubTab === sub.id) isActiveSubTab = true; else if (mainTab.id === 'sales' && activeSalesSubTab === sub.id) isActiveSubTab = true; else if (mainTab.id === 'appearance' && activeAppearanceSubTab === sub.id) isActiveSubTab = true; return ( <button key={sub.id} onClick={() => { if (mainTab.id === 'content') setActiveContentSubTab(sub.id as AdminContentSubTab); else if (mainTab.id === 'users') setActiveUserSubTab(sub.id as AdminUserSubTab); else if (mainTab.id === 'sales') setActiveSalesSubTab(sub.id as AdminSalesSubTab); else if (mainTab.id === 'appearance') setActiveAppearanceSubTab(sub.id as AdminAppearanceSubTab); setActiveMainTab(mainTab.id); }} className={`w-full flex items-start text-left space-x-2 px-2 py-1.5 rounded-md text-xs ${isActiveSubTab ? 'text-primary font-semibold bg-primary/5' : 'text-textSubtle hover:bg-bgMuted hover:text-textMuted'}`} ><span>{sub.label}</span></button> ); })} </div> )} </div> )})}
          </nav>
        </aside>
        <main className="flex-grow min-w-0">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminPage;