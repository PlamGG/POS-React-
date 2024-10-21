import { v4 as uuidv4 } from 'uuid';

export const menuItems = [
  {
    id: uuidv4(),
    name: 'เบอร์เกอร์ไก่กรอบ',
    price: 75,
    category: 'Main Course',
    image: '/images/crispy-chicken-burger.jpg',
    description: 'เบอร์เกอร์ไก่กรอบเสิร์ฟพร้อมผักและซอส',
    stock: 40,
    lowStockThreshold: 8
  },
  {
    id: uuidv4(),
    name: 'เบอร์เกอร์หมู',
    price: 80,
    category: 'Main Course',
    image: '/images/pork-burger.jpg',
    description: 'เบอร์เกอร์หมูเนื้อนุ่มพร้อมผักและซอสพิเศษ',
    stock: 50,
    lowStockThreshold: 10
  },
  {
    id: uuidv4(),
    name: 'ไก่ทอดไทยสไปซี่',
    price: 90,
    category: 'Main Course',
    image: '/images/spicy-thai-fried-chicken.jpg',
    description: 'ไก่ทอดกรอบรสเผ็ดสไตล์ไทย',
    stock: 60,
    lowStockThreshold: 12
  },
  {
    id: uuidv4(),
    name: 'เฟรนช์ฟรายส์',
    price: 45,
    category: 'Snacks',
    image: '/images/french-fries.jpg',
    description: 'เฟรนช์ฟรายส์ทอดกรอบเสิร์ฟพร้อมซอสมะเขือเทศ',
    stock: 100,
    lowStockThreshold: 20
  },
  {
    id: uuidv4(),
    name: 'นักเก็ตไก่',
    price: 50,
    category: 'Snacks',
    image: '/images/chicken-nuggets.jpg',
    description: 'นักเก็ตไก่ทอดกรอบเสิร์ฟพร้อมซอสดิป',
    stock: 80,
    lowStockThreshold: 15
  },
  {
    id: uuidv4(),
    name: 'ไก่ป๊อป',
    price: 55,
    category: 'Snacks',
    image: '/images/chicken-pop.jpg',
    description: 'ไก่ป๊อปชิ้นเล็กๆ กรอบนอกนุ่มใน',
    stock: 90,
    lowStockThreshold: 18
  },
  {
    id: uuidv4(),
    name: 'ข้าวเหนียวหมูทอด',
    price: 65,
    category: 'Main Course',
    image: '/images/sticky-rice-fried-pork.jpg',
    description: 'ข้าวเหนียวหมูทอดกรอบ เสิร์ฟพร้อมน้ำจิ้มแจ่ว',
    stock: 70,
    lowStockThreshold: 14
  },
  {
    id: uuidv4(),
    name: 'ส้มตำไทย',
    price: 50,
    category: 'Main Course',
    image: '/images/somtam-thai.jpg',
    description: 'ส้มตำไทยรสจัด เสิร์ฟพร้อมผักสด',
    stock: 60,
    lowStockThreshold: 12
  },
  {
    id: uuidv4(),
    name: 'ไส้กรอกอีสาน',
    price: 60,
    category: 'Snacks',
    image: '/images/isan-sausage.jpg',
    description: 'ไส้กรอกอีสานเสิร์ฟพร้อมผักและขิง',
    stock: 50,
    lowStockThreshold: 10
  },
  {
    id: uuidv4(),
    name: 'ข้าวผัดอเมริกัน',
    price: 75,
    category: 'Main Course',
    image: '/images/american-fried-rice.jpg',
    description: 'ข้าวผัดอเมริกัน เสิร์ฟพร้อมไส้กรอก ไก่ทอด และไข่ดาว',
    stock: 40,
    lowStockThreshold: 8
  },
  {
    id: uuidv4(),
    name: 'น้ำอัดลม',
    price: 25,
    category: 'Drinks',
    image: '/images/soft-drink.jpg',
    description: 'น้ำอัดลมเย็นสดชื่น',
    stock: 100,
    lowStockThreshold: 20
  },
  {
    id: uuidv4(),
    name: 'น้ำมะนาวโซดา',
    price: 35,
    category: 'Drinks',
    image: '/images/lemon-soda.jpg',
    description: 'น้ำมะนาวโซดาสดชื่น',
    stock: 60,
    lowStockThreshold: 12
  },
  {
    id: uuidv4(),
    name: 'ชามะนาว',
    price: 30,
    category: 'Drinks',
    image: '/images/lemon-tea.jpg',
    description: 'ชามะนาวหวานเปรี้ยวสดชื่น',
    stock: 80,
    lowStockThreshold: 16
  },
  {
    id: uuidv4(),
    name: 'น้ำเปล่า',
    price: 10,
    category: 'Drinks',
    image: '/images/water.jpg',
    description: 'น้ำเปล่าเย็น',
    stock: 120,
    lowStockThreshold: 25
  },
  {
    id: uuidv4(),
    name: 'ไอศกรีมกะทิ',
    price: 40,
    category: 'Desserts',
    image: '/images/coconut-ice-cream.jpg',
    description: 'ไอศกรีมกะทิเสิร์ฟพร้อมถั่วและข้าวเหนียว',
    stock: 50,
    lowStockThreshold: 10
  },
  {
    id: uuidv4(),
    name: 'ขนมปังปิ้ง',
    price: 30,
    category: 'Desserts',
    image: '/images/grilled-bread.jpg',
    description: 'ขนมปังปิ้งเนยน้ำตาล',
    stock: 60,
    lowStockThreshold: 12
  },
  {
    id: uuidv4(),
    name: 'บัวลอยน้ำกะทิ',
    price: 50,
    category: 'Desserts',
    image: '/images/bua-loi.jpg',
    description: 'บัวลอยน้ำกะทิรสหวานมัน',
    stock: 40,
    lowStockThreshold: 8
  },
  {
    id: uuidv4(),
    name: 'ลูกชุบ',
    price: 35,
    category: 'Desserts',
    image: '/images/luk-chup.jpg',
    description: 'ลูกชุบสีสันสดใส รสชาติหวานละมุน',
    stock: 70,
    lowStockThreshold: 14
  },
  {
    id: uuidv4(),
    name: 'เฉาก๊วย',
    price: 25,
    category: 'Desserts',
    image: '/images/grass-jelly.jpg',
    description: 'เฉาก๊วยหวานเย็น เสิร์ฟพร้อมน้ำเชื่อม',
    stock: 80,
    lowStockThreshold: 16
  },
  {
    id: uuidv4(),
    name: 'ข้าวเหนียวมะม่วง',
    price: 60,
    category: 'Desserts',
    image: '/images/mango-sticky-rice.jpg',
    description: 'ข้าวเหนียวมะม่วงราดน้ำกะทิหวานมัน',
    stock: 50,
    lowStockThreshold: 10
  }
];
