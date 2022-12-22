import Page from './page';
import ProductCards from '../components/product-card/product-cards';
import { PlantsData, Products } from '../base/types';

class CatalogPage extends Page {
  productCard: ProductCards;

  constructor() {
    super('catalog');
    console.log(this.id);
    this.productCard = new ProductCards();
  }

  drawProductCard(data: PlantsData): void {
    const values: Products[] = data.products ? data.products : [];
    this.productCard.draw(values);
  }
}

export default CatalogPage;
