import CatalogPage from './pages/catalog-page';

class App {
  private catalogPage: CatalogPage;

  constructor() {
    this.catalogPage = new CatalogPage();
  }

  start() {
    this.catalogPage.draw();
  }
}

export default App;
