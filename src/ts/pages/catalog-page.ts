import Page from './page';
import ProductCards from '../components/product-card/product-cards';
import { getExistentElement } from '../base/helpers';
import { PlantsData, Products, DataObj } from '../base/types';
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

    const dataObj: DataObj = {
      newData: values,
      inputData: [],
      sortData: [],
      chekedData: [],
    };

    const checkTypes: string[] = [];

    getExistentElement<HTMLInputElement>('.sort-input').addEventListener('input', () =>
      this.productCard.sortInput(dataObj)
    );

    getExistentElement('.sort').addEventListener('click', (e) => this.productCard.sortBy(e.target, dataObj));

    getExistentElement('.filter__type').addEventListener('change', (e) => {
      this.productCard.checkboxTypeFilter(e.target, dataObj, checkTypes);
    });
  }

  draw(info = {}) {
    const page = this.makePage(info);
    if (page && this.container) {
      this.container.innerHTML = '';
      this.container.append(page);
      this.drawProductCard(plantsData);
    }
  }
}

export default CatalogPage;
