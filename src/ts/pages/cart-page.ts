import Cart from '../components/cart';
import Page from './page';

class CartPage extends Page {
  constructor(cart: Cart) {
    super(cart, 'cart');
    this.cart = cart;
  }

  protected fillPage(page: DocumentFragment, id: string): DocumentFragment {
    const cartContainer = page.querySelector('.cart-page__container');
    if (id === 'empty') {
      const emptyTemp = document.getElementById('empty-cart');
      if (emptyTemp instanceof HTMLTemplateElement) {
        const emptyPage = emptyTemp.content.cloneNode(true);
        cartContainer?.append(emptyPage);
      }
    }
    if (id === 'full') {
      const fullTemp = document.getElementById('full-cart');
      if (fullTemp instanceof HTMLTemplateElement) {
        const fullPage = fullTemp.content.cloneNode(true);
        const fulledPage = this.fillFullPage(fullPage);
        cartContainer?.append(fulledPage);
      }
    }
    return page;
  }

  protected fillFullPage(fullPage: Node): Node {
    return fullPage;
  }
}

export default CartPage;
