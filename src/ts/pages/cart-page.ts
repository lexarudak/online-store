import Page from './page';

class CartPage extends Page {
  constructor() {
    super('cart');
    console.log(this.id);
  }
}

export default CartPage;
