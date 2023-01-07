import Page from './page';
import ProductCards from '../components/product-card/product-cards';
import Filter from '../components/filters/filter';
import { PlantsData, Products } from '../base/types';
import plantsData from '../../data/plants.json';
import Cart from '../components/cart';
import { getExistentElement, isHTMLElement } from '../base/helpers';

class CatalogPage extends Page {
  productCard: ProductCards;

  constructor(cart: Cart) {
    super(cart, 'catalog');
    this.productCard = new ProductCards(cart);
  }

  drawProductCard(data: PlantsData): void {
    const values: Products[] = data.products ? data.products : [];
    const filter = new Filter(values);

    filter.recoveryState(values);
    this.productCard.draw(filter.getData());

    getExistentElement('.filter').addEventListener('input', (e) => {
      filter.checkboxFilter(e.target, values);
      filter.rangeInputFilter(e.target, values);
      this.productCard.draw(filter.getData());
    });

    getExistentElement<HTMLInputElement>('.sort-input').addEventListener('input', () => {
      filter.sortInput(values);
      this.productCard.draw(filter.getData());
    });

    getExistentElement('.sort').addEventListener('click', (e) => {
      filter.sortBy(e.target, values);
      this.productCard.draw(filter.getData());
    });

    getExistentElement('.layout').addEventListener('click', (e) => {
      filter.changeLayout(e.target);
    });

    getExistentElement('.button_filter').addEventListener('click', () => {
      filter.resetState(values);
      this.productCard.draw(values);
    });

    getExistentElement('.button_copy').addEventListener('click', (e) => {
      navigator.clipboard.writeText(window.location.href);
      if (!isHTMLElement(e.target)) throw new Error();
      const button = e.target;
      button.style.color = '#FFFFFF';
      button.style.border = 'none';
      button.style.backgroundColor = '#ab5abb';
      button.textContent = 'Copied!';
      setTimeout(function () {
        button.style.color = '';
        button.style.border = '';
        button.style.backgroundColor = '';
        button.textContent = 'Copy link';
      }, 1200);
    });
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
