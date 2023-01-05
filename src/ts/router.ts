import { PagesList } from './base/enums';
import { isPlantsId } from './base/helpers';
import Cart from './components/cart';
import CartPage from './pages/cart-page';
import CatalogPage from './pages/catalog-page';
import ErrorPage from './pages/error-page';
import Page from './pages/page';
import PlantPage from './pages/plant-page';
import { queryParamsObj } from './components/filters/queryParams';
import { QueryParams } from './base/types';

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
    // if (pathname.match(PagesList.catalogPage)) {
    //   Router.catalogPage.draw();
    // }
    // if (pathname.match(PagesList.cartPage)) {
    //   Router.cartPage.draw();
    // }
    // if (pathname === '/') {
    //   Router.catalogPage.draw();
    // }
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
    Router.setQueryParams(); //test
    Router.getQueryParams(); //test
  }

  //test
  static setQueryParams() {
    const oldQueryParams = localStorage.getItem('queryParams');
    let queryParamsTemp: QueryParams = queryParamsObj;
    if (oldQueryParams) {
      queryParamsTemp = JSON.parse(oldQueryParams);
    }
    const queryParams = Object.fromEntries(Object.entries(queryParamsTemp).filter((n) => n[1] !== ''));

    const params = new URLSearchParams(queryParams);
    const baseUrl = window.location.href;
    const postUrl = new URL('catalog', baseUrl);
    postUrl.search = params.toString();
    window.history.pushState('', postUrl.toString(), postUrl);
  }

  static getQueryParams() {
    const currentParams = window.location.search.slice(1).split('&');
    const currentParamsObj = Object.fromEntries(currentParams.map((el) => el.split('=')));
    console.log('Params:', currentParamsObj);
    return currentParamsObj;
  }
}

export default Router;
