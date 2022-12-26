import { isPlantsId } from './base/helpers';
import Cart from './components/cart';
import CartPage from './pages/cart-page';
import CatalogPage from './pages/catalog-page';
import Page from './pages/page';
import { PagesList } from './base/pages-list';
import PlantPage from './pages/plant-page';

class App {
  private static catalogPage: Page;
  private static cartPage: Page;
  private static plantPage: Page;
  public cart: Cart;

  constructor() {
    this.cart = new Cart();
    App.catalogPage = new CatalogPage(this.cart);
    App.cartPage = new CartPage(this.cart);
    App.plantPage = new PlantPage(this.cart);
  }

  private loadPage() {
    window.addEventListener('hashchange', function () {
      const hash = this.window.location.hash.slice(2);
      App.router(hash);
    });
  }

  static router(pageId: string) {
    if (isPlantsId(pageId)) {
      App.plantPage.draw(pageId);
    }
    if (pageId === PagesList.catalogPage) {
      App.catalogPage.draw();
    }
    if (pageId === PagesList.cartPage) {
      if (App.cartPage.cart.productAmount === 0) {
        App.cartPage.draw('empty');
      } else {
        App.cartPage.draw('full');
      }
    }
  }

  public static loadStartPage(startPageId: string) {
    window.location.hash = `#/${startPageId}`;
    App.router(startPageId);
  }

  start() {
    this.loadPage();
    App.loadStartPage(PagesList.cartPage);
    this.cart.updateHeader();
  }
}

export default App;
