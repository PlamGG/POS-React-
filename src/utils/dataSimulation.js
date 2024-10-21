const menuItems = [
  { id: 1, name: 'เบอร์เกอร์ไก่กรอบ', category: 'Main Course', price: 80, description: 'เบอร์เกอร์ไก่กรอบ เสิร์ฟพร้อมซอสพิเศษ' },
  { id: 2, name: 'ไก่ทอดไทยสไปซี่', category: 'Main Course', price: 120, description: 'ไก่ทอดรสเผ็ดจัดจ้าน เสิร์ฟพร้อมน้ำจิ้ม' },
  { id: 3, name: 'เฟรนช์ฟรายส์', category: 'Snacks', price: 100, description: 'มันฝรั่งทอดกรอบ เสิร์ฟร้อนๆ' },
  { id: 4, name: 'ส้มตำไทย', category: 'Salad', price: 70, description: 'ส้มตำรสเผ็ดหวาน พร้อมถั่วลิสงและมะนาว' },
  { id: 5, name: 'ข้าวเหนียวมะม่วง', category: 'Desserts', price: 60, description: 'ข้าวเหนียวหวานเสิร์ฟพร้อมมะม่วงสุก' },
  { id: 6, name: 'เฉาก๊วย', category: 'Desserts', price: 90, description: 'ของหวานเฉาก๊วยเย็นๆ ทานคู่กับน้ำเชื่อม' },
  { id: 7, name: 'น้ำอัดลม', category: 'Drinks', price: 40, description: 'น้ำอัดลมหวานเย็น ชื่นใจ' },
  { id: 8, name: 'น้ำส้มคั้นสด', category: 'Drinks', price: 110, description: 'น้ำส้มสด เสิร์ฟเย็น สดชื่น' },
  { id: 9, name: 'สลัดผักสด', category: 'Salad', price: 50, description: 'สลัดผักสด เสิร์ฟพร้อมน้ำสลัด' },
  { id: 10, name: 'ไข่เจียว', category: 'Main Course', price: 50, description: 'ไข่เจียวรสอร่อย เสิร์ฟพร้อมข้าวสวย' }
];


const generateMenuItems = (count = 10) => {
  return menuItems.slice(0, count);
};

// ฟังก์ชันเพื่อสร้างข้อมูลการขาย (สุ่มยอดขายของแต่ละวัน)
const generateSalesData = (count = 30) => {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    day: new Date(Date.now() - (count - index) * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // วันในรูปแบบ YYYY-MM-DD
    sales: Math.floor(Math.random() * (5000 - 1000 + 1)) + 1000, // ยอดขายแต่ละวันแบบสุ่มระหว่าง 1000 ถึง 5000
  }));
};

// ฟังก์ชันเพื่อสร้างข้อมูลยอดขายสินค้าขายดี (สร้างจากเมนูที่เรามี)
const generateTopSellingItems = (count = 5) => {
  return menuItems.slice(0, count).map(item => ({
    name: item.name,
    sales: Math.floor(Math.random() * (1000 - 100 + 1)) + 100, // สุ่มจำนวนยอดขาย
  }));
};

// ฟังก์ชันเพื่อสร้างข้อมูลยอดขายตามหมวดหมู่
const generateCategorySales = () => {
  const categories = ['Main Course', 'Snacks', 'Drinks', 'Desserts', 'Salad'];
  return categories.map(category => ({
    name: category,
    value: Math.floor(Math.random() * (30000 - 5000 + 1)) + 5000, // สุ่มยอดขายตามหมวดหมู่
  }));
};

// ฟังก์ชันเพื่อสร้างข้อมูลวิธีการชำระเงิน
const generatePaymentMethods = () => {
  return [
    { name: 'Cash', count: Math.floor(Math.random() * (100 - 20 + 1)) + 20 },
    { name: 'Credit Card', count: Math.floor(Math.random() * (50 - 10 + 1)) + 10 },
    { name: 'QR Code', count: Math.floor(Math.random() * (30 - 5 + 1)) + 5 },
  ];
};


export {
  generateMenuItems,
  generateSalesData,
  generateTopSellingItems,
  generateCategorySales,
  generatePaymentMethods,
};
