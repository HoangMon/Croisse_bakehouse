export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

export const MENU_ITEMS: MenuItem[] = [
  {
    id: 'butter-croissant',
    name: 'Butter croissant',
    price: 55000,
    description: 'Croissant truyền thống, bột T55, bơ AOP Pháp',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop',
    category: 'Croissant'
  },
  {
    id: 'pain-au-chocolat',
    name: 'Pain au Chocolat',
    price: 67000,
    description: 'Bánh ngàn lớp cuộn socola Bỉ',
    image: 'https://images.unsplash.com/photo-1530610476181-d83430b64dcd?q=80&w=800&auto=format&fit=crop',
    category: 'Croissant'
  },
  {
    id: 'almond-croissant',
    name: 'Almond Croissant',
    price: 75000,
    description: 'Croissant kẹp sốt hạnh nhân',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=800&auto=format&fit=crop',
    category: 'Croissant'
  },
  {
    id: 'pomme',
    name: 'Pomme',
    price: 59000,
    description: 'Bánh ngàn lớp nhân táo vani tươi',
    image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=800&auto=format&fit=crop',
    category: 'Pastry'
  },
  {
    id: 'honey-toast',
    name: 'Honey Toast',
    price: 62000,
    description: 'Bánh toast nướng bơ đường, mật ong, kem phô mai chanh',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?q=80&w=800&auto=format&fit=crop',
    category: 'Toast'
  },
  {
    id: 'enchanted',
    name: 'Enchanted',
    price: 69000,
    description: 'Croissant vị kem trà bá tước',
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop',
    category: 'Specialty'
  },
  {
    id: 'lemon',
    name: 'Lemon',
    price: 69000,
    description: 'Croissant kem chanh vàng, kem đánh bông khò lửa',
    image: 'https://images.unsplash.com/photo-1519869325930-281384150729?q=80&w=800&auto=format&fit=crop',
    category: 'Specialty'
  },
  {
    id: 'pistachio',
    name: 'Pistachio',
    price: 74000,
    description: 'Croissant kem hạt dẻ cười',
    image: 'https://images.unsplash.com/photo-1626263469007-12466699933a?q=80&w=800&auto=format&fit=crop',
    category: 'Specialty'
  },
  {
    id: 'black-magic',
    name: 'Black Magic',
    price: 78000,
    description: 'Croissant kem Matcha Nhật',
    image: 'https://images.unsplash.com/photo-1515823662273-ad95251cb8b4?q=80&w=800&auto=format&fit=crop',
    category: 'Specialty'
  },
  {
    id: 'strawberry-yum',
    name: 'Strawberry Yum',
    price: 75000,
    description: 'Danish kem vị miso, mứt dâu nhà nấu, quả dâu tươi',
    image: 'https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?q=80&w=800&auto=format&fit=crop',
    category: 'Pastry'
  }
];
