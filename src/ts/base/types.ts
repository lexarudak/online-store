export interface Products {
  id: number;
  title: string;
  description: string;
  height: number;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  type: string;
  thumbnail: string;
  images: string[];
}

export interface PlantsData {
  products: Products[];
  total: number;
}
