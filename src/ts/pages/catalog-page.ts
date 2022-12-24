import Page from './page';
import ProductCards from '../components/product-card/product-cards';
import { PlantsData, Products } from '../base/types';
import plantsData from '../../data/plants.json';

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

  draw(id?: string) {
    const page = this.makePage(id);
    if (page && this.container) {
      this.container.innerHTML = '';
      this.container.append(page);
      this.drawProductCard(plantsData);
    }
  }
}

export default CatalogPage;
