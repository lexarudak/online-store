import Page from './page';

class CatalogPage extends Page {
  constructor() {
    super('catalog');
    console.log(this.id);
  }
}

export default CatalogPage;
