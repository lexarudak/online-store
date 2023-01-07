import { PagesList } from './base/enums';
import { isPlantsId } from './base/helpers';
import Cart from './components/cart';
import CartPage from './pages/cart-page';
import CatalogPage from './pages/catalog-page';
import ErrorPage from './pages/error-page';
import Page from './pages/page';
import PlantPage from './pages/plant-page';
import { queryParamsObj } from './components/filters/queryParams';

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
    switch (pathname) {
      case PagesList.catalogPage:
        Router.catalogPage.draw();
        break;
      case PagesList.cartPage:
        Router.cartPage.draw();
        break;
      case '/':
        this.goTo(PagesList.catalogPage);
        break;
      default:
        if (isPlantsId(pathname)) {
          Router.plantPage.draw(pathname.slice(1));
        } else {
          Router.errorPage.draw();
        }
        break;
    }
    Router.changeLinks();
  }

  static goTo(pageId: string) {
    window.history.pushState({ pageId }, pageId, pageId);
    Router.render(pageId);
  }

  static changeLinks() {
    const links = document.querySelectorAll('[href^="/"]');
    links.forEach((link) => {
      if (!link.classList.contains('link-changed')) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          link instanceof HTMLAnchorElement ? Router.goTo(new URL(link.href).pathname) : null;
        });
        link.classList.add('link-changed');
      }
    });
  }

  static startRouter() {
    window.addEventListener('popstate', () => {
      Router.render(new URL(window.location.href).pathname);
    });
    const page = new URL(window.location.href).pathname;
    Router.render(page);
  }

  static setQueryParams() {
    const currentParamsObj = Object.fromEntries(Object.entries(queryParamsObj).filter((item) => item[1] !== ''));
    const paramsStr = new URLSearchParams(currentParamsObj);
    const currentUrl = new URL(window.location.href);
    currentUrl.search = paramsStr.toString();
    window.history.pushState({}, 'catalog', currentUrl);
  }
}

export default Router;
