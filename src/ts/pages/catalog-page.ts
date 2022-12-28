import Page from './page';
import { PlantsData, Products } from '../base/types';
import plantsData from '../../data/plants.json';
import Cart from '../components/cart';
import ProductCards from '../components/product-card/product-cards';

class CatalogPage extends Page {
  productCard: ProductCards;

  constructor(cart: Cart) {
    super(cart, 'catalog');
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
