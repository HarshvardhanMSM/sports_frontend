export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  status: "Active" | "Inactive";
  createdDate: string;
  productsCount: number;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description: string;
  status: "Active" | "Inactive";
  createdDate: string;
  productsCount: number;
}

export interface ProductVariants {
  size: string[];
  color: string[];
  material: string[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  brandId: string;
  categoryId: string;
  subcategory: string;
  thumbnail: string;
  gallery: string[];
  video: string;
  price: number;
  salePrice?: number;
  discountPercentage?: number;
  stock: number;
  lowStockThreshold: number;
  variants: ProductVariants;
  description: string;
  features: string[];
  specifications: Record<string, string>;
  seoTitle: string;
  seoDescription: string;
  status: "Draft" | "Active" | "Out Of Stock" | "Archived";
  createdDate: string;
}

const initialCategories: Category[] = [
  {
    id: "cat-1",
    name: "Footwear",
    slug: "footwear",
    description:
      "Premium running shoes, training footwear, cleated shoes, and athletic sneakers.",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400",
    status: "Active",
    createdDate: "2026-01-15",
    productsCount: 3,
  },
  {
    id: "cat-2",
    name: "Apparel",
    slug: "apparel",
    description:
      "Moisture-wicking training tees, compression shirts, hoodies, shorts, and sweatpants.",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400",
    status: "Active",
    createdDate: "2026-02-10",
    productsCount: 2,
  },
  {
    id: "cat-3",
    name: "Accessories",
    slug: "accessories",
    description:
      "Socks, gym bags, water bottles, sweatbands, caps, and wearable athletic accessories.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400",
    status: "Active",
    createdDate: "2026-03-01",
    productsCount: 1,
  },
  {
    id: "cat-4",
    name: "Equipment",
    slug: "equipment",
    description:
      "Basketballs, soccer balls, resistance bands, yoga mats, and advanced sports gear.",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400",
    status: "Inactive",
    createdDate: "2026-03-12",
    productsCount: 0,
  },
];

const initialBrands: Brand[] = [
  {
    id: "brand-1",
    name: "Nike",
    slug: "nike",
    logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=100",
    description:
      "Just Do It. World leader in athletic footwear, apparel, and equipment.",
    status: "Active",
    createdDate: "2026-01-01",
    productsCount: 3,
  },
  {
    id: "brand-2",
    name: "Adidas",
    slug: "adidas",
    logo: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=100",
    description:
      "Impossible Is Nothing. Premium high-performance sportswear and style.",
    status: "Active",
    createdDate: "2026-01-05",
    productsCount: 1,
  },
  {
    id: "brand-3",
    name: "Puma",
    slug: "puma",
    logo: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=100",
    description:
      "Forever Faster. Sleek, athletic performance wear and streetstyle footwear.",
    status: "Active",
    createdDate: "2026-01-20",
    productsCount: 1,
  },
  {
    id: "brand-4",
    name: "Under Armour",
    slug: "under-armour",
    logo: "https://images.unsplash.com/photo-1518002171953-a080ee81be25?w=100",
    description:
      "Under Armour makes athletes better through passion, design, and innovation.",
    status: "Active",
    createdDate: "2026-02-01",
    productsCount: 1,
  },
];

const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Nike Air Zoom Pegasus 40",
    slug: "nike-air-zoom-pegasus-40",
    sku: "NK-PEG40-001",
    brandId: "brand-1",
    categoryId: "cat-1",
    subcategory: "Running Shoes",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
    gallery: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600",
    ],
    video: "https://www.w3schools.com/html/mov_bbb.mp4",
    price: 130.0,
    salePrice: 110.0,
    discountPercentage: 15,
    stock: 45,
    lowStockThreshold: 10,
    variants: {
      size: ["US 8", "US 9", "US 10", "US 11"],
      color: ["Black/White", "Volt Blue", "Crimson Red"],
      material: ["Mesh", "Zoom Air Pods", "Rubber Sole"],
    },
    description:
      "A springy ride for every run, the Peg’s familiar, just-for-you feel returns to help you accomplish your goals.",
    features: [
      "Breathable engineered mesh upper",
      "React technology foam midsole",
      "Dual Zoom Air units",
    ],
    specifications: {
      Weight: "288g (US 9)",
      Drop: "10mm",
      Cushioning: "Balanced",
    },
    seoTitle: "Nike Air Zoom Pegasus 40 | Premium Running Shoes",
    seoDescription:
      "Shop the Pegasus 40 runner. Springy cushioning, durable mesh, and maximum responsiveness.",
    status: "Active",
    createdDate: "2026-02-15",
  },
  {
    id: "prod-2",
    name: "Adidas Tiro Training Pants",
    slug: "adidas-tiro-training-pants",
    sku: "AD-TR-PANTS-09",
    brandId: "brand-2",
    categoryId: "cat-2",
    subcategory: "Training Pants",
    thumbnail:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
    gallery: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600",
    ],
    video: "",
    price: 45.0,
    stock: 120,
    lowStockThreshold: 15,
    variants: {
      size: ["S", "M", "L", "XL"],
      color: ["Black/White Stripes", "Navy/White Stripes"],
      material: ["Recycled Polyester", "AEROREADY Tech"],
    },
    description:
      "Born on the soccer field, worn everywhere. Classic Tiro fit featuring moisture-absorbing technology.",
    features: [
      "AEROREADY moisture-absorbing fabric",
      "Ankle zips for easy on/off over cleats",
      "Side zippered pockets",
    ],
    specifications: {
      Fit: "Slim fit with mid rise",
      Composition: "100% recycled polyester doubleknit",
    },
    seoTitle: "Adidas Tiro Soccer Training Pants - Sportswear Admin",
    seoDescription:
      "Classic slim-fit Adidas Tiro training pants. Zippered pockets and breathable soccer tech.",
    status: "Active",
    createdDate: "2026-02-20",
  },
  {
    id: "prod-3",
    name: "Puma Future Ultimate FG",
    slug: "puma-future-ultimate-fg",
    sku: "PM-FUT-ULT-02",
    brandId: "brand-3",
    categoryId: "cat-1",
    subcategory: "Cleats",
    thumbnail:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600",
    gallery: [
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600",
    ],
    video: "",
    price: 220.0,
    salePrice: 198.0,
    discountPercentage: 10,
    stock: 8,
    lowStockThreshold: 10,
    variants: {
      size: ["US 9", "US 9.5", "US 10", "US 11"],
      color: ["Fast Yellow", "Electric Blue"],
      material: ["FUZIONFIT360 Upper", "PWRTAPE Support"],
    },
    description:
      "Lock in, power through. The Future Ultimate soccer cleat offers maximum agility and lightweight power.",
    features: [
      "FUZIONFIT360 dual-mesh upper",
      "PWRTAPE support for ultimate lock-in",
      "Dynamic Motion System outsole",
    ],
    specifications: {
      Ground: "Firm Ground / Artificial Ground",
      Weight: "210g",
    },
    seoTitle: "Puma Future Ultimate Soccer Cleats | Elite Play",
    seoDescription:
      "Buy Puma Future Ultimate FG. The ultimate firm ground cleat for creative playmakers.",
    status: "Active",
    createdDate: "2026-02-28",
  },
  {
    id: "prod-4",
    name: "Under Armour Compression Tee",
    slug: "under-armour-compression-tee",
    sku: "UA-COMP-01",
    brandId: "brand-4",
    categoryId: "cat-2",
    subcategory: "T-Shirts",
    thumbnail:
      "https://images.unsplash.com/photo-1518002171953-a080ee81be25?w=600",
    gallery: [],
    video: "",
    price: 35.0,
    stock: 200,
    lowStockThreshold: 20,
    variants: {
      size: ["M", "L", "XL", "XXL"],
      color: ["Black", "Steel Gray", "White"],
      material: ["HeatGear Poly-blend", "4-way Stretch"],
    },
    description:
      "HeatGear fabric provides ultra-comfortable compression that helps keep your muscles warm and ready.",
    features: [
      "Ultra-tight, second-skin compression fit",
      "Underarm mesh panels deliver strategic ventilation",
      "Anti-odor technology",
    ],
    specifications: {
      Material: "84% Polyester, 16% Elastane",
      Care: "Machine wash cold with like colors",
    },
    seoTitle: "Under Armour HeatGear Compression T-Shirt",
    seoDescription:
      "Elite sportswear compression fit t-shirt from Under Armour. Keep cool, dry and athletic.",
    status: "Active",
    createdDate: "2026-03-05",
  },
  {
    id: "prod-5",
    name: "Nike Elite Basketball Socks",
    slug: "nike-elite-basketball-socks",
    sku: "NK-ELITE-SOCK-BK",
    brandId: "brand-1",
    categoryId: "cat-3",
    subcategory: "Socks",
    thumbnail:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600",
    gallery: [],
    video: "",
    price: 14.0,
    stock: 0,
    lowStockThreshold: 5,
    variants: {
      size: ["Medium", "Large"],
      color: ["Black/White", "White/Black"],
      material: ["Dri-FIT Knit Cotton-poly"],
    },
    description:
      "Comfortable cushion, zoned arch bands, and Dri-FIT sweat protection for court play.",
    features: [
      "Zoned underfoot cushioning",
      "Ribbed traction at forefoot helps reduce slipping",
      "Arch band offers a snug, supportive fit",
    ],
    specifications: {
      Fabric: "61% polyester/20% nylon/17% cotton/2% spandex",
    },
    seoTitle: "Nike Elite Basketball Crew Socks - High Cushion",
    seoDescription:
      "Step up your court performance with high-cushioned Nike Elite basketball socks.",
    status: "Out Of Stock",
    createdDate: "2026-03-10",
  },
];

// Helper to initialize database if empty
function initializeDb() {
  if (typeof window === "undefined") return;
  if (!localStorage.getItem("categories")) {
    localStorage.setItem("categories", JSON.stringify(initialCategories));
  }
  if (!localStorage.getItem("brands")) {
    localStorage.setItem("brands", JSON.stringify(initialBrands));
  }
  if (!localStorage.getItem("products")) {
    localStorage.setItem("products", JSON.stringify(initialProducts));
  }
}

// Category CRUD
export const getCategories = (): Category[] => {
  initializeDb();
  if (typeof window === "undefined") return initialCategories;
  const cats = localStorage.getItem("categories");
  return cats ? JSON.parse(cats) : initialCategories;
};

export const saveCategory = (
  cat: Omit<Category, "id" | "productsCount" | "createdDate"> & { id?: string },
): Category => {
  initializeDb();
  const cats = getCategories();
  const dateStr = new Date().toISOString().split("T")[0];

  if (cat.id) {
    // Edit
    const index = cats.findIndex((c) => c.id === cat.id);
    if (index !== -1) {
      const updatedCat: Category = {
        ...cats[index],
        ...cat,
        id: cat.id, // Ensure id is preserved
      };
      cats[index] = updatedCat;
      localStorage.setItem("categories", JSON.stringify(cats));
      return updatedCat;
    }
  }

  // Create
  const newCat: Category = {
    ...cat,
    id: `cat-${Date.now()}`,
    createdDate: dateStr,
    productsCount: 0,
  };
  cats.push(newCat);
  localStorage.setItem("categories", JSON.stringify(cats));
  return newCat;
};

export const deleteCategory = (id: string): void => {
  initializeDb();
  const cats = getCategories().filter((c) => c.id !== id);
  localStorage.setItem("categories", JSON.stringify(cats));
};

// Brand CRUD
export const getBrands = (): Brand[] => {
  initializeDb();
  if (typeof window === "undefined") return initialBrands;
  const brands = localStorage.getItem("brands");
  return brands ? JSON.parse(brands) : initialBrands;
};

export const saveBrand = (
  brand: Omit<Brand, "id" | "productsCount" | "createdDate"> & { id?: string },
): Brand => {
  initializeDb();
  const brands = getBrands();
  const dateStr = new Date().toISOString().split("T")[0];

  if (brand.id) {
    const index = brands.findIndex((b) => b.id === brand.id);
    if (index !== -1) {
      const updatedBrand: Brand = {
        ...brands[index],
        ...brand,
        id: brand.id,
      };
      brands[index] = updatedBrand;
      localStorage.setItem("brands", JSON.stringify(brands));
      return updatedBrand;
    }
  }

  const newBrand: Brand = {
    ...brand,
    id: `brand-${Date.now()}`,
    createdDate: dateStr,
    productsCount: 0,
  };
  brands.push(newBrand);
  localStorage.setItem("brands", JSON.stringify(brands));
  return newBrand;
};

export const deleteBrand = (id: string): void => {
  initializeDb();
  const brands = getBrands().filter((b) => b.id !== id);
  localStorage.setItem("brands", JSON.stringify(brands));
};

// Product CRUD
export const getProducts = (): Product[] => {
  initializeDb();
  if (typeof window === "undefined") return initialProducts;
  const products = localStorage.getItem("products");
  return products ? JSON.parse(products) : initialProducts;
};

export const getProductById = (id: string): Product | undefined => {
  const prods = getProducts();
  return prods.find((p) => p.id === id);
};

export const saveProduct = (
  prod: Omit<Product, "id" | "createdDate"> & { id?: string },
): Product => {
  initializeDb();
  const prods = getProducts();
  const dateStr = new Date().toISOString().split("T")[0];

  let savedProduct: Product;
  if (prod.id) {
    const index = prods.findIndex((p) => p.id === prod.id);
    if (index !== -1) {
      savedProduct = {
        ...prods[index],
        ...prod,
        id: prod.id,
      };
      prods[index] = savedProduct;
    } else {
      savedProduct = {
        ...prod,
        id: prod.id,
        createdDate: dateStr,
      };
      prods.push(savedProduct);
    }
  } else {
    savedProduct = {
      ...prod,
      id: `prod-${Date.now()}`,
      createdDate: dateStr,
    };
    prods.push(savedProduct);
  }

  localStorage.setItem("products", JSON.stringify(prods));
  updateCounts();
  return savedProduct;
};

export const deleteProduct = (id: string): void => {
  initializeDb();
  const prods = getProducts().filter((p) => p.id !== id);
  localStorage.setItem("products", JSON.stringify(prods));
  updateCounts();
};

// Helper to keep productsCount sync'd up
function updateCounts() {
  const prods = getProducts();
  const cats = getCategories();
  const brands = getBrands();

  const updatedCats = cats.map((c) => ({
    ...c,
    productsCount: prods.filter((p) => p.categoryId === c.id).length,
  }));

  const updatedBrands = brands.map((b) => ({
    ...b,
    productsCount: prods.filter((p) => p.brandId === b.id).length,
  }));

  localStorage.setItem("categories", JSON.stringify(updatedCats));
  localStorage.setItem("brands", JSON.stringify(updatedBrands));
}
