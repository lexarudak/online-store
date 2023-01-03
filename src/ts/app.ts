import { PagesList } from './base/enums';
import { getExistentElement } from './base/helpers';
import Cart from './components/cart';
import Router from './router';

class App {
  public cart: Cart;
  static router: Router;

  constructor() {
    this.cart = new Cart();
    App.router = new Router(this.cart);
  }

  start() {
    Router.startRouter();
    this.cart.updateHeader();
    getExistentElement('.cart').addEventListener('click', () => Router.goTo(PagesList.cartPage));
    getExistentElement('.header__logo').addEventListener('click', () => Router.goTo(PagesList.catalogPage));
  }
}

export default App;
