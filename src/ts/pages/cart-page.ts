import Cart from '../components/cart';
import Page from './page';

class CartPage extends Page {
  constructor(cart: Cart) {
    super(cart, 'cart');
  }
}

export default CartPage;
