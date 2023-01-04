import Cart from './components/cart';
import Router from './router';

class App {
  public cart: Cart;
  static router: Router;

  constructor() {
    this.cart = new Cart();
    App.router = new Router(this.cart);
    console.log('App constructor');
  }

  start() {
    Router.startRouter();
    this.cart.updateHeader();
  }
}

export default App;
