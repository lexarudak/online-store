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

export type Basket = {
  [id: string]: number;
};

export type PromoList = {
  [id: string]: number;
};

export type PageInfo = {
  [id: string]: number;
};

export interface DataObj {
  newData: Products[];
  inputData: Products[];
  sortData: Products[];
  chekedData: Products[];
  priceData: Products[];
}
