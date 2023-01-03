import { PagesList } from './base/enums';
import { isPlantsId } from './base/helpers';
import Cart from './components/cart';
import CartPage from './pages/cart-page';
import CatalogPage from './pages/catalog-page';
import ErrorPage from './pages/error-page';
import Page from './pages/page';
import PlantPage from './pages/plant-page';

class Router {
  static catalogPage: Page;
  static cartPage: Page;
  static plantPage: Page;
  static errorPage: Page;

  constructor(cart: Cart) {
    Router.catalogPage = new CatalogPage(cart);
    Router.cartPage = new CartPage(cart);
    Router.plantPage = new PlantPage(cart);
    Router.errorPage = new ErrorPage(cart);
  }

  static render(pathname: string) {
    console.log('render start', pathname);

    if (isPlantsId(pathname)) {
      Router.plantPage.draw(pathname);
    }
    if (pathname === PagesList.catalogPage) {
      console.log('load Catalog Page');
      Router.catalogPage.draw();
    }
    if (pathname === PagesList.cartPage) {
      console.log('load Cart Page');
      if (Router.cartPage.cart.productAmount === 0) {
        Router.cartPage.draw('empty');
      } else {
        Router.cartPage.draw('full');
      }
    }
  }

  static goTo(pageId: string) {
    window.history.pushState('', pageId, pageId);
    Router.render(pageId);
  }

  static startRouter() {
    window.addEventListener('popstate', () => {
      Router.render(new URL(window.location.href).pathname);
    });
    const page = new URL(window.location.href).pathname;
    Router.render(page);
  }
}

export default Router;
