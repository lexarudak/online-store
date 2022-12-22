import { isPlantsId } from './components/functions';
import CartPage from './pages/cart-page';
import CatalogPage from './pages/catalog-page';
import Page from './pages/page';
import { PagesList } from './pages/pages-list';
import PlantPage from './pages/plant-page';

class App {
  private static catalogPage: Page;
  private static cartPage: Page;
  private static plantPage: Page;

  constructor() {
    App.catalogPage = new CatalogPage();
    App.cartPage = new CartPage();
    App.plantPage = new PlantPage();
  }

  private loadPage() {
    window.addEventListener('hashchange', function () {
      const hash = this.window.location.hash.slice(2);
      App.router(hash);
    });
  }

  static router(pageId: string) {
    switch (pageId) {
      case PagesList.catalogPage:
        App.catalogPage.draw();
        break;
      case PagesList.cartPage:
        App.cartPage.draw();
        break;
      default:
        if (isPlantsId(pageId)) {
          App.plantPage.draw(pageId);
        }
    }
  }

  static loadStartPage(startPageId: string) {
    window.location.hash = `#/${startPageId}`;
    App.router(startPageId);
  }

  start() {
    this.loadPage();
    App.loadStartPage(PagesList.catalogPage);
  }
}

export default App;
