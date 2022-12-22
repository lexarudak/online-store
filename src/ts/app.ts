import CatalogPage from './pages/catalog-page';
import data from '../data/plants.json';

class App {
  private catalogPage: CatalogPage;

  constructor() {
    this.catalogPage = new CatalogPage();
  }

  start() {
    this.catalogPage.draw();
    this.catalogPage.drawProductCard(data);
  }
}

export default App;
