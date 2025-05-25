
import { Product, Service, Article, Testimonial, PCComponent, Project, User, Order, AdminNotification, UserRole, StaffRole } from '../types';
import React from 'react'; 
import { ADMIN_EMAIL } from '../constants';

export const MOCK_PRODUCTS: Product[] = [
  // Máy tính để bàn (PC)
  { id: 'pc001', name: 'PC Văn Phòng Standard VP01', mainCategory: "Máy tính để bàn (PC)", subCategory: "Máy tính văn phòng", category: "Máy tính văn phòng", price: 8500000, imageUrls: [`https://picsum.photos/seed/pcvp01/600/400`, `https://picsum.photos/seed/pcvp01_2/600/400`, `https://picsum.photos/seed/pcvp01_3/600/400`], description: 'PC tối ưu cho công việc văn phòng, học tập online.', specifications: { CPU: 'Intel Core i3-12100', RAM: '8GB DDR4', SSD: '256GB NVMe', OS: 'Windows 11 Home' }, stock: 10, status: 'Mới', brand: 'IQ Assembly' },
  { id: 'pc002', name: 'Gaming PC Tier S - RTX 4070', mainCategory: "Máy tính để bàn (PC)", subCategory: "Máy tính chơi game (Gaming PC)", category: "Máy tính chơi game (Gaming PC)", price: 38000000, originalPrice: 40000000, imageUrls: [`https://picsum.photos/seed/pcgame01/600/400`, `https://picsum.photos/seed/pcgame01_side/600/400`], description: 'Chiến mọi game AAA max setting với RTX 4070.', specifications: { CPU: 'Intel Core i7-13700K', RAM: '32GB DDR5 RGB', SSD: '1TB Gen4 NVMe', VGA: 'NVIDIA GeForce RTX 4070 12GB' }, stock: 5, status: 'Mới', brand: 'IQ Gaming' },
  { id: 'pc003', name: 'Workstation Pro CAD/Render W03', mainCategory: "Máy tính để bàn (PC)", subCategory: "Máy tính đồ họa – kỹ thuật (Workstation)", category: "Máy tính đồ họa – kỹ thuật (Workstation)", price: 55000000, imageUrls: [`https://picsum.photos/seed/pcws01/600/400`], description: 'Máy trạm chuyên dụng cho đồ họa 3D, render video.', specifications: { CPU: 'AMD Ryzen Threadripper 3960X', RAM: '64GB DDR4 ECC', SSD: '2TB NVMe PCIe 4.0', VGA: 'NVIDIA Quadro RTX A4000 16GB' }, stock: 3, status: 'Mới', brand: 'IQ ProStation' },
  { id: 'pc004', name: 'Apple iMac 27-inch 5K (2020)', mainCategory: "Máy tính để bàn (PC)", subCategory: "Máy tính All-in-One", category: "Máy tính All-in-One", price: 42000000, imageUrls: [`https://picsum.photos/seed/pcaio01/600/400`, `https://picsum.photos/seed/pcaio01_back/600/400`], description: 'Thiết kế tinh tế, màn hình 5K tuyệt đẹp.', specifications: { CPU: 'Intel Core i7 10th Gen', RAM: '16GB DDR4', SSD: '512GB', Display: '27-inch 5K Retina' }, stock: 7, status: 'Mới', brand: 'Apple' },
  { id: 'pc005', name: 'Intel NUC 11 Pro Kit', mainCategory: "Máy tính để bàn (PC)", subCategory: "Mini PC / NUC", category: "Mini PC / NUC", price: 12000000, imageUrls: [`https://picsum.photos/seed/pcmini01/600/400`], description: 'Mini PC mạnh mẽ, nhỏ gọn, tiết kiệm không gian.', specifications: { CPU: 'Intel Core i5-1135G7', RAM: 'Barebone (cần RAM)', SSD: 'Barebone (cần SSD)' }, stock: 15, status: 'Mới', brand: 'Intel' },
  { id: 'pc006', name: 'Dell OptiPlex 7090 SFF', mainCategory: "Máy tính để bàn (PC)", subCategory: "Máy đồng bộ (HP, Dell, Lenovo…)", category: "Máy đồng bộ (HP, Dell, Lenovo…)", price: 18500000, imageUrls: [`https://picsum.photos/seed/pcdb01/600/400`], description: 'Máy tính đồng bộ Dell bền bỉ, hiệu năng ổn định cho doanh nghiệp.', specifications: { CPU: 'Intel Core i5-11500', RAM: '16GB DDR4', SSD: '512GB NVMe', OS: 'Windows 10 Pro' }, stock: 9, status: 'Mới', brand: 'Dell' },

  // Laptop
  { id: 'lap001', name: 'Laptop Văn Phòng SlimBook S14', mainCategory: "Laptop", subCategory: "Laptop văn phòng", category: "Laptop văn phòng", price: 16500000, imageUrls: [`https://picsum.photos/seed/lapvp01/600/400`, `https://picsum.photos/seed/lapvp01_open/600/400`], description: 'Laptop mỏng nhẹ, pin trâu cho công việc năng động.', specifications: { CPU: 'Intel Core i5-1235U', RAM: '16GB DDR4', SSD: '512GB NVMe', Display: '14-inch FHD IPS' }, stock: 12, status: 'Mới', brand: 'IQ Book' },
  { id: 'lap002', name: 'ASUS ROG Strix SCAR 17 (2023)', mainCategory: "Laptop", subCategory: "Laptop gaming", category: "Laptop gaming", price: 65000000, imageUrls: [`https://picsum.photos/seed/lapgame01/600/400`, `https://picsum.photos/seed/lapgame01_top/600/400`, `https://picsum.photos/seed/lapgame01_keyboard/600/400`], description: 'Laptop gaming đỉnh cao với RTX 4080 Mobile.', specifications: { CPU: 'Intel Core i9-13980HX', RAM: '32GB DDR5', SSD: '2TB PCIe 4.0 NVMe', VGA: 'NVIDIA GeForce RTX 4080 Laptop GPU', Display: '17.3-inch QHD 240Hz' }, stock: 4, status: 'Mới', brand: 'ASUS' },
  { id: 'lap003', name: 'Dell XPS 15 (9530)', mainCategory: "Laptop", subCategory: "Laptop đồ họa – kỹ thuật", category: "Laptop đồ họa – kỹ thuật", price: 52000000, imageUrls: [`https://picsum.photos/seed/lapws01/600/400`], description: 'Laptop đồ họa cao cấp, màn hình InfinityEdge tuyệt đẹp.', specifications: { CPU: 'Intel Core i7-13700H', RAM: '32GB DDR5', SSD: '1TB NVMe', VGA: 'NVIDIA GeForce RTX 4050 Laptop', Display: '15.6-inch FHD+ IPS' }, stock: 6, status: 'Mới', brand: 'Dell' },
  { id: 'lap004', name: 'LG Gram 16 (2023)', mainCategory: "Laptop", subCategory: "Laptop mỏng nhẹ (Ultrabook)", category: "Laptop mỏng nhẹ (Ultrabook)", price: 35000000, imageUrls: [`https://picsum.photos/seed/lapultra01/600/400`], description: 'Siêu mỏng nhẹ, chỉ 1.19kg, pin cực lâu.', specifications: { CPU: 'Intel Core i7-1360P', RAM: '16GB LPDDR5', SSD: '1TB NVMe Gen4', Display: '16-inch WQXGA IPS' }, stock: 8, status: 'Mới', brand: 'LG' },
  { id: 'lap005', name: 'Microsoft Surface Pro 9', mainCategory: "Laptop", subCategory: "Laptop cảm ứng / 2-in-1", category: "Laptop cảm ứng / 2-in-1", price: 32000000, imageUrls: [`https://picsum.photos/seed/lap2in101/600/400`], description: 'Laptop lai tablet linh hoạt, hỗ trợ bút cảm ứng.', specifications: { CPU: 'Intel Core i5-1235U', RAM: '8GB LPDDR5', SSD: '256GB', Display: '13-inch PixelSense Flow' }, stock: 10, status: 'Mới', brand: 'Microsoft' },
  { id: 'lap006', name: 'MacBook Air M2 (2022)', mainCategory: "Laptop", subCategory: "MacBook (Air / Pro)", category: "MacBook (Air / Pro)", price: 28500000, imageUrls: [`https://picsum.photos/seed/macbook01/600/400`, `https://picsum.photos/seed/macbook01_angle/600/400`], description: 'Hiệu năng ấn tượng với chip M2, thiết kế mới.', specifications: { CPU: 'Apple M2 chip', RAM: '8GB Unified Memory', SSD: '256GB', Display: '13.6-inch Liquid Retina' }, stock: 9, status: 'Mới', brand: 'Apple' },
  { id: 'lap007', name: 'Laptop Acer Aspire 3 (Cũ)', mainCategory: "Laptop", subCategory: "Laptop cũ – refurbished", category: "Laptop cũ – refurbished", price: 7500000, imageUrls: [`https://picsum.photos/seed/lapcu01/600/400`], description: 'Laptop cũ, đã qua kiểm tra, giá tốt cho học sinh.', specifications: { CPU: 'Intel Core i3 10th Gen', RAM: '8GB DDR4', SSD: '256GB', Display: '15.6-inch HD' }, stock: 5, status: 'Cũ', brand: 'Acer' },

  // Linh kiện máy tính
  { id: 'lk001', name: 'CPU Intel Core i9-13900K', mainCategory: "Linh kiện máy tính", subCategory: "CPU (Intel, AMD)", category: 'CPU', price: 15000000, originalPrice: 16500000, imageUrls: [`https://picsum.photos/seed/cpu1/600/400`, `https://picsum.photos/seed/cpu1_box/600/400`], description: 'CPU hàng đầu cho gaming và sáng tạo.', specifications: { Cores: '24', Threads: '32', BaseClock: '3.0GHz' }, stock: 10, status: 'Mới', brand: 'Intel' },
  { id: 'lk002', name: 'RAM Corsair Vengeance LPX 32GB (2x16GB) DDR5 5600MHz', mainCategory: "Linh kiện máy tính", subCategory: "RAM (DDR4, DDR5…)", category: 'RAM', price: 4500000, imageUrls: [`https://picsum.photos/seed/ram1/600/400`], description: 'RAM DDR5 hiệu năng cao.', specifications: { Capacity: '32GB', Type: 'DDR5', Speed: '5600MHz' }, stock: 15, status: 'Mới', brand: 'Corsair' },
  { id: 'lk003', name: 'SSD Samsung 980 Pro 1TB NVMe PCIe 4.0', mainCategory: "Linh kiện máy tính", subCategory: "Ổ cứng HDD / SSD (SATA, NVMe)", category: 'SSD', price: 3800000, imageUrls: [`https://picsum.photos/seed/ssd1/600/400`], description: 'SSD NVMe tốc độ cực nhanh.', specifications: { Capacity: '1TB', Interface: 'NVMe PCIe 4.0', ReadSpeed: '7000MB/s' }, stock: 20, status: 'Mới', brand: 'Samsung' },
  { id: 'lk004', name: 'VGA NVIDIA GeForce RTX 4080 16GB', mainCategory: "Linh kiện máy tính", subCategory: "VGA (Card màn hình – GPU)", category: 'VGA', price: 32000000, imageUrls: [`https://picsum.photos/seed/vga1/600/400`, `https://picsum.photos/seed/vga1_ports/600/400`], description: 'Card đồ họa mạnh mẽ cho 4K gaming.', specifications: { Memory: '16GB GDDR6X', BoostClock: '2.5GHz' }, stock: 5, status: 'Mới', brand: 'NVIDIA' },
  { id: 'lk005', name: 'Mainboard ASUS ROG Strix Z790-E Gaming WiFi', mainCategory: "Linh kiện máy tính", subCategory: "Bo mạch chủ (Mainboard)", category: 'Mainboard', price: 12500000, imageUrls: [`https://picsum.photos/seed/main1/600/400`], description: 'Mainboard cao cấp cho Intel Gen 13.', specifications: { Chipset: 'Z790', Socket: 'LGA1700', FormFactor: 'ATX' }, stock: 8, status: 'Mới', brand: 'ASUS' },
  { id: 'lk006', name: 'PSU Corsair RM850x 850W 80+ Gold', mainCategory: "Linh kiện máy tính", subCategory: "Nguồn máy tính (PSU)", category: 'PSU', price: 3200000, imageUrls: [`https://picsum.photos/seed/psu1/600/400`], description: 'Nguồn công suất thực, ổn định.', specifications: { Wattage: '850W', Efficiency: '80+ Gold', Modular: 'Fully' }, stock: 12, status: 'Mới', brand: 'Corsair' },
  { id: 'lk007', name: 'Vỏ case NZXT H510 Flow', mainCategory: "Linh kiện máy tính", subCategory: "Vỏ case máy tính", category: 'Vỏ case', price: 2100000, imageUrls: [`https://picsum.photos/seed/case1/600/400`], description: 'Case tản nhiệt tốt, thiết kế đẹp.', specifications: { Type: 'Mid Tower', Material: 'Steel, Tempered Glass' }, stock: 18, status: 'Mới', brand: 'NZXT' },
  { id: 'lk008', name: 'Tản nhiệt Noctua NH-D15', mainCategory: "Linh kiện máy tính", subCategory: "Tản nhiệt (Air, Watercooling)", category: 'Tản nhiệt', price: 2800000, imageUrls: [`https://picsum.photos/seed/tannhiet1/600/400`], description: 'Tản nhiệt khí hiệu năng đỉnh cao.', specifications: { Type: 'Air Cooler', Fans: '2 x 140mm' }, stock: 11, status: 'Mới', brand: 'Noctua' },
  { id: 'lk009', name: 'Combo Build PC Gaming Tầm Trung', mainCategory: "Linh kiện máy tính", subCategory: "Combo build PC (theo cấu hình)", category: 'Combo build PC', price: 18000000, imageUrls: [`https://picsum.photos/seed/combo1/600/400`], description: 'Combo tối ưu cho gaming Full HD: i5-12400F, RTX 3060, 16GB RAM, 512GB SSD.', specifications: { CPU: 'Intel Core i5-12400F', VGA: 'RTX 3060', RAM: '16GB DDR4', SSD: '512GB NVMe' }, stock: 7, status: 'Mới', brand: 'IQ Combo' },

  // Thiết bị ngoại vi
  { id: 'tnv001', name: 'Màn hình LG UltraGear 27GP850-B 27" QHD Nano IPS 165Hz', mainCategory: "Thiết bị ngoại vi", subCategory: "Màn hình (LCD, LED, 2K, 4K, Gaming…)", category: 'Màn hình', price: 9800000, imageUrls: [`https://picsum.photos/seed/monitor1/600/400`, `https://picsum.photos/seed/monitor1_back/600/400`], description: 'Màn hình gaming QHD tuyệt vời.', specifications: { Size: '27 inch', Resolution: '2560x1440', RefreshRate: '165Hz', Panel: 'Nano IPS' }, stock: 7, status: 'Mới', brand: 'LG' },
  { id: 'tnv002', name: 'Bàn phím cơ Keychron K2 Pro', mainCategory: "Thiết bị ngoại vi", subCategory: "Bàn phím (cơ, thường)", category: 'Bàn phím', price: 3500000, imageUrls: [`https://picsum.photos/seed/keyboard1/600/400`], description: 'Bàn phím cơ không dây, layout 75%, QMK/VIA.', specifications: { Layout: '75%', Switch: 'Gateron Brown (Hot-swappable)', Connectivity: 'Bluetooth/USB-C' }, stock: 20, status: 'Mới', brand: 'Keychron' },
  { id: 'tnv003', name: 'Chuột Logitech G Pro X Superlight', mainCategory: "Thiết bị ngoại vi", subCategory: "Chuột (gaming, văn phòng)", category: 'Chuột', price: 2900000, imageUrls: [`https://picsum.photos/seed/mouse1/600/400`], description: 'Chuột gaming không dây siêu nhẹ.', specifications: { Weight: '<63g', Sensor: 'HERO 25K', DPI: '25600' }, stock: 15, status: 'Mới', brand: 'Logitech' },
  { id: 'tnv004', name: 'Tai nghe Sony WH-1000XM5', mainCategory: "Thiết bị ngoại vi", subCategory: "Tai nghe (có dây, không dây)", category: 'Tai nghe', price: 7500000, imageUrls: [`https://picsum.photos/seed/headphone1/600/400`], description: 'Tai nghe chống ồn chủ động hàng đầu.', specifications: { Type: 'Over-ear, Wireless', NoiseCancelling: 'Industry Leading' }, stock: 13, status: 'Mới', brand: 'Sony' },

  // Camera giám sát
  { id: 'cam001', name: 'Camera IP WiFi EZVIZ C6N 1080P', mainCategory: "Camera giám sát", subCategory: "Camera IP (WiFi / LAN)", category: 'Camera IP', price: 950000, imageUrls: [`https://picsum.photos/seed/camip01/600/400`], description: 'Camera IP WiFi xoay 360 độ, đàm thoại 2 chiều.', specifications: { Resolution: '1080P', Connectivity: 'WiFi', Features: 'Pan/Tilt, Two-way Audio, Night Vision' }, stock: 30, status: 'Mới', brand: 'EZVIZ' },
  { id: 'cam002', name: 'Đầu ghi hình Hikvision DS-7208HQHI-K1 8 kênh', mainCategory: "Camera giám sát", subCategory: "Đầu ghi hình (DVR, NVR)", category: 'Đầu ghi hình', price: 2200000, imageUrls: [`https://picsum.photos/seed/dvr01/600/400`], description: 'Đầu ghi hình 8 kênh hỗ trợ camera HD-TVI/AHD/CVI/CVBS/IP.', specifications: { Channels: '8', SupportedTech: 'HD-TVI/AHD/CVI/CVBS/IP', Compression: 'H.265+' }, stock: 10, status: 'Mới', brand: 'Hikvision' },

  // Thiết bị mạng
  { id: 'net001', name: 'Router WiFi TP-Link Archer AX73 AX5400', mainCategory: "Thiết bị mạng", subCategory: "Router WiFi (TP-Link, Asus, UniFi…)", category: 'Router WiFi', price: 3200000, imageUrls: [`https://picsum.photos/seed/router01/600/400`], description: 'Router WiFi 6 tốc độ cao, vùng phủ rộng.', specifications: { Standard: 'WiFi 6 (802.11ax)', Speed: 'AX5400 (4804Mbps on 5GHz, 574Mbps on 2.4GHz)', Features: 'OFDMA, MU-MIMO, HomeShield' }, stock: 18, status: 'Mới', brand: 'TP-Link' },
  { id: 'net002', name: 'Switch TP-Link TL-SG1008P 8 Port Gigabit PoE', mainCategory: "Thiết bị mạng", subCategory: "Switch mạng (PoE, thường)", category: 'Switch mạng', price: 1500000, imageUrls: [`https://picsum.photos/seed/switch01/600/400`], description: 'Switch 8 port Gigabit với 4 port PoE+.', specifications: { Ports: '8 Gigabit Ethernet', PoEPorts: '4 PoE+ (802.3af/at)', PoEBudget: '64W' }, stock: 14, status: 'Mới', brand: 'TP-Link' },
  
  // Phần mềm & dịch vụ (conceptual product)
  { id: 'soft001', name: 'Gói Cài Đặt Windows & Office Tận Nơi', mainCategory: "Phần mềm & dịch vụ", subCategory: "Dịch vụ cài đặt tận nơi / online", category: 'Dịch vụ cài đặt', price: 300000, imageUrls: [`https://picsum.photos/seed/softinstall/600/400`], description: 'Dịch vụ cài đặt hệ điều hành Windows và bộ Office bản quyền (chưa bao gồm key) tại nhà.', specifications: { Scope: 'Windows Installation, Office Suite Setup, Basic Drivers', Location: 'Tận nơi (Đà Nẵng)' }, stock: 99, status: 'Mới', brand: 'IQ Services' },
  { id: 'soft002', name: 'Bản quyền Windows 11 Pro OEM', mainCategory: "Phần mềm & dịch vụ", subCategory: "Bản quyền Windows, Office", category: 'Bản quyền phần mềm', price: 2800000, imageUrls: [`https://picsum.photos/seed/win11pro/600/400`], description: 'Key bản quyền Windows 11 Pro dạng OEM.', specifications: { Edition: 'Windows 11 Pro', Type: 'OEM' }, stock: 50, status: 'Mới', brand: 'Microsoft' },

  // Phụ kiện & thiết bị khác
  { id: 'acc001', name: 'Hub USB-C Anker 7-in-1', mainCategory: "Phụ kiện & thiết bị khác", subCategory: "Cáp chuyển, hub USB, docking", category: 'Hub USB', price: 1200000, imageUrls: [`https://picsum.photos/seed/hub01/600/400`], description: 'Hub USB-C đa năng: HDMI 4K, USB 3.0, PD, SD card reader.', specifications: { Ports: 'HDMI, 2xUSB-A 3.0, USB-C PD, SD, microSD', Material: 'Aluminum' }, stock: 25, status: 'Mới', brand: 'Anker' },
  { id: 'acc002', name: 'Balo Laptop Chống Sốc Tomtoc A13', mainCategory: "Phụ kiện & thiết bị khác", subCategory: "Túi, balo laptop", category: 'Balo Laptop', price: 990000, imageUrls: [`https://picsum.photos/seed/balo01/600/400`], description: 'Balo laptop 15.6 inch, chống sốc tốt, nhiều ngăn.', specifications: { Size: '15.6 inch', Material: 'Polyester', Features: 'Chống sốc CornerArmor, chống nước' }, stock: 22, status: 'Mới', brand: 'Tomtoc' },
];

export const MOCK_SERVICES: Service[] = [
  { 
    id: 'svc001', 
    name: 'Thiết Kế & Phát Triển Web Chuyên Nghiệp', 
    description: 'Chúng tôi cung cấp giải pháp website toàn diện, từ thiết kế UX/UI hiện đại, trực quan đến phát triển frontend & backend mạnh mẽ, đảm bảo tối ưu hóa SEO và mang lại trải nghiệm người dùng vượt trội.', 
    icon: 'fas fa-laptop-code', 
    imageUrl: 'https://picsum.photos/seed/webDevServiceITS/500/350',
    slug: 'thiet-ke-phat-trien-web' 
  },
  { 
    id: 'svc002', 
    name: 'Quản Trị Hệ Thống Mạng Doanh Nghiệp', 
    description: 'Dịch vụ quản trị, giám sát và bảo trì hệ thống mạng chuyên nghiệp cho doanh nghiệp. Đảm bảo hệ thống của bạn hoạt động ổn định, an toàn, hiệu quả với hiệu suất tối đa.', 
    icon: 'fas fa-network-wired', 
    imageUrl: 'https://picsum.photos/seed/networkAdminServiceITS/500/350',
    slug: 'quan-tri-he-thong-mang'
  },
  { 
    id: 'svc003', 
    name: 'Giải Pháp Lưu Trữ & Sao Lưu Đám Mây', 
    description: 'Tư vấn và triển khai các giải pháp lưu trữ đám mây (Cloud Storage) và sao lưu dữ liệu (Cloud Backup) linh hoạt, an toàn và tiết kiệm chi phí cho cá nhân và doanh nghiệp.', 
    icon: 'fas fa-cloud-upload-alt', 
    imageUrl: 'https://picsum.photos/seed/cloudStorageServiceITS/500/350',
    slug: 'luu-tru-sao-luu-dam-may'
  },
  { 
    id: 'svc004', 
    name: 'Hỗ Trợ Kỹ Thuật Từ Xa Nhanh Chóng', 
    description: 'Đội ngũ kỹ thuật viên chuyên nghiệp của chúng tôi sẵn sàng giải quyết nhanh chóng các sự cố máy tính, phần mềm qua TeamViewer, UltraViewer, đảm bảo công việc của bạn không bị gián đoạn.', 
    icon: 'fas fa-headset', 
    imageUrl: 'https://picsum.photos/seed/remoteSupportServiceITS/500/350',
    slug: 'ho-tro-ky-thuat-tu-xa'
  },
  { 
    id: 'svc005', 
    name: 'Tư Vấn & Triển Khai Chuyển Đổi Số', 
    description: 'Đánh giá toàn diện hiện trạng công nghệ và tư vấn lộ trình chuyển đổi số tối ưu, giúp doanh nghiệp của bạn tự động hóa quy trình, nâng cao năng lực cạnh tranh và phát triển bền vững.', 
    icon: 'fas fa-project-diagram', 
    imageUrl: 'https://picsum.photos/seed/digitalTransServiceITS/500/350',
    slug: 'tu-van-chuyen-doi-so'
  },
  { 
    id: 'svc006', 
    name: 'Bảo Mật Hệ Thống & An Toàn Dữ Liệu', 
    description: 'Dịch vụ kiểm tra, đánh giá lỗ hổng và triển khai các giải pháp bảo mật tiên tiến. Phòng chống hiệu quả virus, mã độc, tấn công mạng, bảo vệ an toàn tuyệt đối cho dữ liệu quan trọng.', 
    icon: 'fas fa-shield-alt', 
    imageUrl: 'https://picsum.photos/seed/securityServiceITS/500/350',
    slug: 'bao-mat-he-thong-du-lieu'
  },
];


export const MOCK_ARTICLES: Article[] = [
  { id: '1', title: 'Mẹo Chọn Linh Kiện PC Phù Hợp Ngân Sách 2024', summary: 'Hướng dẫn chi tiết cách lựa chọn CPU, VGA, RAM... tối ưu cho túi tiền của bạn trong năm nay.', imageUrl: `https://picsum.photos/seed/blog1/400/250`, author: 'Chuyên gia Tech', date: '2024-07-25', category: 'Mẹo vặt', content: 'Nội dung chi tiết bài viết 1... Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'},
  { id: '2', title: 'Hướng Dẫn Sửa Lỗi "Màn Hình Xanh Chết Chóc" (BSOD)', summary: 'Các bước cơ bản để tự chẩn đoán và khắc phục lỗi BSOD thường gặp trên Windows 10 và 11.', imageUrl: `https://picsum.photos/seed/blog2/400/250`, author: 'Kỹ thuật viên An', date: '2024-07-20', category: 'Hướng dẫn', content: 'Nội dung chi tiết bài viết 2... Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'},
  { id: '3', title: 'So Sánh Cấu Hình PC: Gaming vs. Học Tập vs. Văn Phòng', summary: 'Phân tích sự khác biệt và gợi ý cấu hình tối ưu cho từng nhu cầu sử dụng cụ thể.', imageUrl: `https://picsum.photos/seed/blog3/400/250`, author: 'Reviewer Dũng', date: '2024-07-15', category: 'So sánh', content: 'Nội dung chi tiết bài viết 3... Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.'},
  { id: '4', title: 'Chương Trình Khuyến Mãi Tháng 8: Back to School!', summary: 'Tổng hợp các ưu đãi hấp dẫn cho laptop, PC và phụ kiện mùa tựu trường.', imageUrl: `https://picsum.photos/seed/blog4/400/250`, author: 'Marketing Team', date: '2024-08-01', category: 'Khuyến mãi', content: 'Nội dung chi tiết bài viết 4... Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'},
  { id: '5', title: 'Tại Sao Cần Vệ Sinh Laptop Định Kỳ?', summary: 'Tìm hiểu lợi ích của việc vệ sinh laptop và hướng dẫn tự thực hiện tại nhà an toàn.', imageUrl: `https://picsum.photos/seed/blog5/400/250`, author: 'Kỹ thuật viên Minh', date: '2024-07-10', category: 'Mẹo vặt', content: 'Vệ sinh laptop định kỳ giúp máy hoạt động mát mẻ, ổn định và kéo dài tuổi thọ...'},
  { id: '6', title: 'Top 5 Phần Mềm Diệt Virus Tốt Nhất 2024', summary: 'Đánh giá và so sánh các phần mềm diệt virus hàng đầu hiện nay cho máy tính của bạn.', imageUrl: `https://picsum.photos/seed/blog6/400/250`, author: 'Chuyên gia Bảo mật', date: '2024-07-05', category: 'Đánh giá sản phẩm', content: 'Bảo vệ máy tính khỏi virus và mã độc là vô cùng quan trọng. Dưới đây là top 5 phần mềm...'},
  { 
    id: 'it001', 
    title: 'Giải Pháp Sao Lưu Dữ Liệu An Toàn Cho Doanh Nghiệp Nhỏ', 
    summary: 'Tầm quan trọng của backup dữ liệu và các giải pháp NAS, Cloud Backup phù hợp.', 
    imageUrl: `https://picsum.photos/seed/itsv01/400/250`, 
    author: 'Chuyên gia IT Solutions', 
    date: '2024-07-28', 
    category: 'Dịch vụ IT', 
    content: 'Dữ liệu là tài sản quý giá của doanh nghiệp. Mất mát dữ liệu có thể gây ra những thiệt hại không lường trước được. Chúng tôi cung cấp các giải pháp sao lưu toàn diện...'
  },
  { 
    id: 'it002', 
    title: 'Khắc Phục Sự Cố Mạng Wi-Fi Chậm Chờn Tại Nhà', 
    summary: 'Các bước kiểm tra và xử lý khi mạng Wi-Fi nhà bạn gặp vấn đề về tốc độ và ổn định.', 
    imageUrl: `https://picsum.photos/seed/itsv02/400/250`, 
    author: 'Kỹ thuật viên Mạng', 
    date: '2024-07-22', 
    category: 'Dịch vụ IT', 
    content: 'Mạng Wi-Fi chậm có thể do nhiều nguyên nhân từ router, modem, đến nhiễu sóng. Bài viết này sẽ hướng dẫn bạn cách tự kiểm tra và khắc phục...'
  },
  { 
    id: 'it003', 
    title: 'Tư Vấn Lắp Đặt Hệ Thống Camera An Ninh Gia Đình', 
    summary: 'Lựa chọn loại camera, vị trí lắp đặt và cấu hình hệ thống giám sát hiệu quả.', 
    imageUrl: `https://picsum.photos/seed/itsv03/400/250`, 
    author: 'Chuyên gia An Ninh', 
    date: '2024-07-18', 
    category: 'Dịch vụ IT', 
    content: 'An ninh cho ngôi nhà là ưu tiên hàng đầu. Một hệ thống camera giám sát tốt sẽ giúp bạn yên tâm hơn. Chúng tôi tư vấn từ A-Z...'
  },
  { 
    id: 'it004', 
    title: 'Dịch Vụ Bảo Trì Máy Tính Định Kỳ Cho Văn Phòng', 
    summary: 'Tại sao doanh nghiệp cần bảo trì máy tính định kỳ và lợi ích của gói dịch vụ này.', 
    imageUrl: `https://picsum.photos/seed/itsv04/400/250`, 
    author: 'IQ Technology Services', 
    date: '2024-07-12', 
    category: 'Dịch vụ IT', 
    content: 'Đảm bảo hệ thống máy tính văn phòng hoạt động trơn tru, giảm thiểu sự cố và tăng hiệu suất làm việc với dịch vụ bảo trì chuyên nghiệp của chúng tôi...'
  },
  {
    id: 'it005',
    title: 'Doanh Nghiệp Thăng Hoa: 6 Lợi Ích Vàng Khi Sử Dụng Dịch Vụ IT Chuyên Nghiệp',
    summary: 'Khám phá cách dịch vụ IT chuyên nghiệp giúp doanh nghiệp tối ưu chi phí, tăng cường bảo mật, nâng cao hiệu suất và tập trung vào mục tiêu cốt lõi để phát triển bền vững.',
    imageUrl: 'https://picsum.photos/seed/itsv05_benefits/400/250',
    author: 'Chuyên gia IQ Technology',
    date: '2024-08-05',
    category: 'Dịch vụ IT',
    content: `
Trong kỷ nguyên số hóa mạnh mẽ, công nghệ thông tin (IT) không còn là yếu tố phụ trợ mà đã trở thành xương sống của mọi doanh nghiệp, dù lớn hay nhỏ. Tuy nhiên, việc tự vận hành một đội ngũ IT nội bộ hiệu quả có thể tốn kém và phức tạp. Đây là lúc dịch vụ IT chuyên nghiệp từ các đối tác bên ngoài phát huy vai trò. Dưới đây là 6 lợi ích vượt trội mà doanh nghiệp bạn có thể nhận được:

### 1. Tối Ưu Chi Phí Vận Hành & Nhân Sự
Thay vì phải đầu tư vào việc tuyển dụng, đào tạo và duy trì một đội ngũ IT toàn thời gian với đầy đủ các chuyên môn (mạng, phần cứng, phần mềm, bảo mật), doanh nghiệp có thể sử dụng dịch vụ IT thuê ngoài với chi phí linh hoạt và thường thấp hơn đáng kể. Bạn chỉ trả tiền cho những gì bạn thực sự cần.

### 2. Bảo Mật Toàn Diện, An Tâm Dữ Liệu
Các nhà cung cấp dịch vụ IT chuyên nghiệp luôn cập nhật những giải pháp và công nghệ bảo mật mới nhất. Họ có chuyên môn sâu để xây dựng các lớp phòng thủ vững chắc, giám sát hệ thống 24/7, phát hiện và ngăn chặn các mối đe dọa tiềm ẩn, đảm bảo an toàn cho dữ liệu kinh doanh quý giá của bạn.

### 3. Nâng Cao Hiệu Suất, Tự Động Hóa Quy Trình
Dịch vụ IT có thể giúp doanh nghiệp bạn đánh giá và triển khai các giải pháp công nghệ phù hợp để tối ưu hóa quy trình làm việc, tự động hóa các tác vụ lặp đi lặp lại. Điều này không chỉ giúp tiết kiệm thời gian, nhân lực mà còn nâng cao đáng kể năng suất và hiệu quả hoạt động chung.

### 4. Hỗ Trợ Kỹ Thuật Chuyên Nghiệp, Khắc Phục Sự Cố Nhanh Chóng
Khi có sự cố xảy ra, việc hệ thống bị đình trệ có thể gây thiệt hại lớn. Với đội ngũ kỹ thuật viên chuyên nghiệp và giàu kinh nghiệm, các nhà cung cấp dịch vụ IT đảm bảo thời gian phản hồi nhanh, khắc phục sự cố hiệu quả, giảm thiểu tối đa thời gian chết (downtime) của hệ thống.

### 5. Tập Trung Vào Giá Trị Cốt Lõi Của Doanh Nghiệp
Khi các vấn đề IT đã được một đối tác tin cậy đảm nhận, ban lãnh đạo và nhân viên có thể hoàn toàn tập trung vào các hoạt động kinh doanh cốt lõi, phát triển sản phẩm, chăm sóc khách hàng và thực hiện các mục tiêu chiến lược của công ty.

### 6. Tiếp Cận Công Nghệ Mới Và Chuyên Môn Cao
Thế giới công nghệ thay đổi không ngừng. Các nhà cung cấp dịch vụ IT luôn đi đầu trong việc nghiên cứu và ứng dụng công nghệ mới. Hợp tác với họ đồng nghĩa với việc doanh nghiệp bạn sẽ được tư vấn và tiếp cận những giải pháp tiên tiến nhất, phù hợp với xu hướng phát triển.

**Kết luận:** Đầu tư vào dịch vụ IT chuyên nghiệp không chỉ là một khoản chi phí mà là một khoản đầu tư chiến lược, mang lại lợi thế cạnh tranh và nền tảng vững chắc cho sự phát triển bền vững của doanh nghiệp trong thời đại số.
    `
  }
];

export const MOCK_TESTIMONIALS: Testimonial[] = [
  { id: '1', name: 'Nguyễn Văn An', quote: 'Dịch vụ sửa chữa PC rất nhanh chóng và chuyên nghiệp. Máy tôi giờ chạy êm ru. Cảm ơn IQ Technology!', avatarUrl: `https://picsum.photos/seed/avatar1/100/100`, role: 'Khách hàng Cá nhân' },
  { id: '2', name: 'Trần Thị Bích Hợp', quote: 'Được tư vấn cấu hình PC Gaming rất ưng ý, giá cả cũng hợp lý. Các bạn kỹ thuật viên nhiệt tình.', avatarUrl: `https://picsum.photos/seed/avatar2/100/100`, role: 'Gamer' },
  { id: '3', name: 'Công ty TNHH ABC', quote: 'IQ Technology đã hỗ trợ chúng tôi bảo trì toàn bộ hệ thống máy tính văn phòng. Rất hài lòng về chất lượng và thái độ phục vụ.', avatarUrl: `https://picsum.photos/seed/avatar3/100/100`, role: 'Khách hàng Doanh nghiệp' },
];


export const MOCK_PC_COMPONENTS: Record<string, PCComponent[]> = {
  CPU: [
    { type: 'CPU', name: 'Intel Core i5-13600K', price: 8000000, details: '14 Cores, 20 Threads' },
    { type: 'CPU', name: 'AMD Ryzen 5 7600X', price: 7500000, details: '6 Cores, 12 Threads' },
    { type: 'CPU', name: 'Intel Core i9-13900K', price: 15000000, details: '24 Cores, 32 Threads' },
  ],
  'Bo mạch chủ': [
    { type: 'Motherboard', name: 'ASUS B760M-PLUS WIFI D4', price: 4500000, details: 'DDR4, LGA1700' },
    { type: 'Motherboard', name: 'Gigabyte B650 AORUS ELITE AX', price: 6000000, details: 'DDR5, AM5' },
    { type: 'Motherboard', name: 'MSI Z790 TOMAHAWK WIFI', price: 8000000, details: 'DDR5, LGA1700' },
  ],
  RAM: [
    { type: 'RAM', name: 'Corsair Vengeance LPX 16GB (2x8GB) DDR4 3200MHz', price: 1500000, details: '16GB DDR4' },
    { type: 'RAM', name: 'Kingston Fury Beast 32GB (2x16GB) DDR5 5600MHz', price: 3500000, details: '32GB DDR5' },
  ],
  'Card màn hình': [
    { type: 'GPU', name: 'NVIDIA GeForce RTX 3060 12GB', price: 9000000, details: '12GB GDDR6' },
    { type: 'GPU', name: 'AMD Radeon RX 6700 XT 12GB', price: 10000000, details: '12GB GDDR6' },
    { type: 'GPU', name: 'NVIDIA GeForce RTX 4070 Ti 12GB', price: 22000000, details: '12GB GDDR6X' },
  ],
  'Ổ cứng': [
    { type: 'SSD', name: 'Samsung 970 EVO Plus 1TB NVMe M.2', price: 2500000, details: '1TB NVMe Gen3' },
    { type: 'SSD', name: 'Western Digital SN850X 2TB NVMe M.2', price: 5000000, details: '2TB NVMe Gen4' },
    { type: 'HDD', name: 'Seagate Barracuda 2TB 7200RPM SATA', price: 1500000, details: '2TB HDD SATA' },
  ],
  'Nguồn máy tính': [
    { type: 'PSU', name: 'Cooler Master MWE Bronze V2 650W', price: 1500000, details: '650W 80+ Bronze' },
    { type: 'PSU', name: 'Corsair RM750e 750W 80+ Gold', price: 2800000, details: '750W 80+ Gold' },
  ],
  'Vỏ case': [
    { type: 'Case', name: 'Corsair 4000D Airflow', price: 2000000, details: 'Mid-Tower ATX' },
    { type: 'Case', name: 'NZXT H5 Flow', price: 2200000, details: 'Mid-Tower ATX' },
  ],
};

export const MOCK_PROJECTS: Project[] = [
    {
        id: 'proj001',
        title: 'Triển Khai Hệ Thống Mạng LAN & Wi-Fi Cho Văn Phòng Công Ty XYZ',
        client: 'Công Ty TNHH Giải Pháp XYZ',
        description: 'Tư vấn, thiết kế và thi công toàn bộ hệ thống mạng nội bộ cho văn phòng mới 200m2, bao gồm đi dây mạng CAT6, lắp đặt switch, router, access point UniFi, và cấu hình firewall bảo mật. Đảm bảo kết nối ổn định cho 50+ thiết bị.',
        imageUrl: 'https://picsum.photos/seed/projectlan/600/400',
        technologiesUsed: ['UniFi Networking', 'CAT6 Cabling', 'Firewall Configuration', 'VLAN Segmentation'],
        completionDate: '2024-05-15',
        category: 'Hệ thống mạng doanh nghiệp'
    },
    {
        id: 'proj002',
        title: 'Lắp Đặt Hệ Thống Camera Giám Sát An Ninh Cho Biệt Thự Anh An',
        client: 'Anh Nguyễn Văn An',
        description: 'Lắp đặt trọn gói 8 camera IP Hikvision Full Color có màu ban đêm, đầu ghi hình NVR, ổ cứng chuyên dụng. Cấu hình xem qua mạng từ xa trên điện thoại, máy tính. Bảo hành 24 tháng.',
        imageUrl: 'https://picsum.photos/seed/projectcam/600/400',
        technologiesUsed: ['Hikvision IP Cameras', 'NVR Setup', 'Mobile Viewing Configuration', 'Network Attached Storage (NAS) Integration'],
        completionDate: '2024-06-20',
        category: 'Giải pháp Camera an ninh'
    },
    {
        id: 'proj003',
        title: 'Nâng Cấp Dàn PC Gaming & Streaming Cho Streamer "ProGamerVN"',
        client: 'Streamer ProGamerVN',
        description: 'Tư vấn và nâng cấp toàn bộ dàn PC cũ lên cấu hình mới nhất với Intel Core i9, RTX 4090, 64GB RAM DDR5, tản nhiệt nước custom. Tối ưu hóa cho việc chơi game AAA max settings và streaming chất lượng cao trên Twitch/YouTube.',
        imageUrl: 'https://picsum.photos/seed/projectgamingpc/600/400',
        technologiesUsed: ['High-end PC Components', 'Custom Water Cooling', 'Streaming Software Setup (OBS)', 'Performance Optimization'],
        completionDate: '2024-07-10',
        category: 'PC Build Cao Cấp'
    },
    {
        id: 'proj004',
        title: 'Xây Dựng Hệ Thống Lưu Trữ NAS Cho Studio Thiết Kế Đồ Họa',
        client: 'Pixel Perfect Studio',
        description: 'Cung cấp giải pháp lưu trữ tập trung NAS Synology, dung lượng 20TB. Cấu hình RAID, phân quyền người dùng, backup tự động cho các máy trạm thiết kế. Đảm bảo an toàn dữ liệu và truy cập nhanh chóng.',
        imageUrl: 'https://picsum.photos/seed/projectnas/600/400',
        technologiesUsed: ['Synology NAS', 'RAID Configuration', 'Data Backup Solutions', 'User Access Control'],
        completionDate: '2024-04-01',
        category: 'Lưu trữ dữ liệu & Backup'
    }
];

// MOCK_USERS for Staff Management demo (excluding pre-registered admin)
export const MOCK_STAFF_USERS: User[] = [
  { id: 'staff001', username: 'NhanVien Sales', email: 'sales01@iqtech.com', role: 'staff', staffRole: 'Sales Manager', password: 'password123' },
  { id: 'staff002', username: 'KyThuat Vien', email: 'tech01@iqtech.com', role: 'staff', staffRole: 'Technical Lead', password: 'password123' },
  { id: 'staff003', username: 'Content Writer', email: 'content01@iqtech.com', role: 'staff', staffRole: 'Content Editor', password: 'password123' },
];


// MOCK_ORDERS for Sales Management demo
export const MOCK_ORDERS: Order[] = [
    {
        id: 'order001',
        customerInfo: {
            fullName: 'Nguyễn Văn A',
            phone: '0901234567',
            address: '123 Đường ABC, Quận XYZ, TP. Đà Nẵng',
            email: 'nguyenvana@example.com',
            notes: 'Giao hàng vào buổi chiều.'
        },
        items: [
            { productId: 'pc001', productName: 'PC Văn Phòng Standard VP01', quantity: 1, price: 8500000 },
            { productId: 'tnv002', productName: 'Bàn phím cơ Keychron K2 Pro', quantity: 1, price: 3500000 }
        ],
        totalAmount: 12000000,
        orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        status: 'Đang giao'
    },
    {
        id: 'order002',
        customerInfo: {
            fullName: 'Trần Thị B',
            phone: '0987654321',
            address: '456 Đường DEF, Quận UVW, TP. Đà Nẵng',
            email: 'tranthib@example.com'
        },
        items: [
            { productId: 'lk001', productName: 'CPU Intel Core i9-13900K', quantity: 1, price: 15000000 },
        ],
        totalAmount: 15000000,
        orderDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
        status: 'Hoàn thành'
    },
     {
        id: 'order003',
        customerInfo: {
            fullName: 'Lê Văn C',
            phone: '0912345678',
            address: '789 Đường GHI, Quận KLM, TP. Đà Nẵng',
            email: 'levanc@example.com',
            notes: 'Vui lòng gọi trước khi giao.'
        },
        items: [
            { productId: 'lap002', productName: 'ASUS ROG Strix SCAR 17 (2023)', quantity: 1, price: 65000000 },
        ],
        totalAmount: 65000000,
        orderDate: new Date().toISOString(),
        status: 'Chờ xử lý'
    }
];

// MOCK_ADMIN_NOTIFICATIONS
export const MOCK_ADMIN_NOTIFICATIONS: AdminNotification[] = [
    {
        id: 'notif001',
        message: 'Đơn hàng #order003 vừa được tạo.',
        type: 'info',
        timestamp: new Date().toISOString(),
        isRead: false,
    },
    {
        id: 'notif002',
        message: 'Sản phẩm "CPU Intel Core i9-13900K" sắp hết hàng (còn 2).',
        type: 'warning',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isRead: true,
    }
];
