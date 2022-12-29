import Page from './page';
import ProductCards from '../components/product-card/product-cards';
import Filter from '../components/filters/filter';
import { PlantsData, Products, DataObj } from '../base/types';
import plantsData from '../../data/plants.json';
import Cart from '../components/cart';
import { getExistentElement } from '../base/helpers';

class CatalogPage extends Page {
  productCard: ProductCards;

  constructor(cart: Cart) {
    super(cart, 'catalog');
    this.productCard = new ProductCards();
  }

  drawProductCard(data: PlantsData): void {
    const values: Products[] = data.products ? data.products : [];
    this.productCard.draw(values);

    const dataObj: DataObj = {
      newData: values,
      inputData: [],
      sortData: [],
      chekedData: [],
      priceData: [],
    };

    const checkTypes: string[] = [];

    getExistentElement<HTMLInputElement>('.sort-input').addEventListener('input', () =>
      this.productCard.sortInput(dataObj)
    );

    getExistentElement('.sort').addEventListener('click', (e) => this.productCard.sortBy(e.target, dataObj));

    getExistentElement('.filter__type').addEventListener('change', (e) => {
      this.productCard.checkboxTypeFilter(e.target, dataObj, checkTypes);
    });

    const filter = new Filter();

    getExistentElement('.filter').addEventListener('input', (e) => {
      dataObj.priceData = filter.rangeInputFilter(dataObj.newData, e.target);
      this.productCard.draw(dataObj.priceData);
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
