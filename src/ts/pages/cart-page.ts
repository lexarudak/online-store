import { getExistentElement, openPurchaseModal } from '../base/helpers';
import { promoList } from '../base/promo-codes';
import Cart from '../components/cart';
import CartList from '../components/cartList';
import App from '../app';
import Page from './page';
import { PageInfo } from '../base/types';

class CartPage extends Page {
  public pageInfo: PageInfo;

  constructor(cart: Cart) {
    super(cart, 'cart');
    this.cart = cart;
    this.pageInfo = {
      itemsOnPage: 3,
      currentPage: 1,
    };
  }

  private getTotal() {
    let sum = this.cart.productSum;
    if (this.cart.activePromoCodes.length > 0) {
      this.cart.activePromoCodes.forEach((code) => {
        sum = sum * ((100 - promoList[code]) / 100);
      });
    }
    return `$${Math.floor(sum).toString()}`;
  }

  private getProductDiscount() {
    return `- ${Math.floor((1 - this.cart.productSum / this.cart.productOldSum) * 100).toString()} %`;
  }

  private makePromoCard(code: string, discount: number): HTMLElement {
    const promoCard = document.createElement('li');
    promoCard.id = code;
    const promoText = document.createElement('span');
    const promoValue = document.createElement('span');
    promoCard.classList.add('discounts__item', 'discounts__item-promo');
    promoText.innerText = `Promo ${code}`;
    promoValue.innerText = `- ${discount} %`;
    promoCard.append(promoText, promoValue);
    return promoCard;
  }

  private setPromoCodes(container: HTMLElement) {
    container.innerHTML = '';
    if (this.cart.activePromoCodes.length > 0) {
      this.cart.activePromoCodes.forEach((code) => {
        if (code in promoList) {
          const promoCard = this.makePromoCard(code, promoList[code]);
          container.appendChild(promoCard);
        }
      });
    }
  }

  public updateBill(HTMLBill: Element) {
    console.log('bill update', this.cart.productAmount);
    const amount = HTMLBill.querySelector('#bill-item');
    amount ? (amount.innerHTML = this.cart.productAmount.toString()) : null;
    const subtotal = HTMLBill.querySelector('#bill-old-sum');
    subtotal ? (subtotal.innerHTML = this.cart.productOldSum.toString()) : null;
    const productDiscount = HTMLBill.querySelector('#bill-product-discount-value');
    productDiscount ? (productDiscount.innerHTML = this.getProductDiscount()) : null;
    const container = HTMLBill.querySelector('#bill-promo-container');
    container instanceof HTMLElement ? this.setPromoCodes(container) : null;
    const total = HTMLBill.querySelector('#bill-total');
    total ? (total.innerHTML = this.getTotal()) : null;
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
        if (fullPage instanceof DocumentFragment) {
          const fulledPage = this.fillFullPage(fullPage);
          cartContainer?.append(fulledPage);
        }
      }
    }
    return page;
  }

  protected fillFullPage(fullPage: DocumentFragment): DocumentFragment {
    const bill = fullPage.querySelector('#bill');
    if (bill) {
      this.updateBill(bill);
      const promoInput = fullPage.querySelector('.full-cart-page__promo-input');
      if (promoInput instanceof HTMLInputElement) {
        promoInput.addEventListener('input', () => this.cart.addPromo(promoInput));
        promoInput.addEventListener('input', () => this.updateBill(bill));
        bill.addEventListener('click', (e) => {
          const target = e.target;
          if (target instanceof HTMLElement) {
            const promo = target.closest('.discounts__item-promo');
            if (promo) {
              this.cart.deletePromo(promo);
              this.updateBill(bill);
            }
          }
        });
      }
    }
    const buyBtn = fullPage.querySelector('.full-cart-page__buy-button');
    buyBtn ? buyBtn.addEventListener('click', () => openPurchaseModal(this.cart)) : null;

    const itemsContainer = fullPage.querySelector('.full-cart-page__products');
    if (itemsContainer instanceof HTMLElement && bill) {
      getExistentElement('.clean-card-btn', itemsContainer).addEventListener('click', () => {
        this.cart.cleanCart();
        App.loadStartPage('cart');
      });
      const cartList = new CartList(itemsContainer);
      itemsContainer.addEventListener('click', (e) => {
        const newData = cartList.changeCartList(e, this.cart, this.pageInfo);
        this.cart = newData.cart;
        this.pageInfo = newData.pageInfo;
        this.updateBill(bill);
      });
      cartList.updateCartList(this.cart, this.pageInfo);
      cartList.fillCards(this.cart, this.pageInfo);
    }

    return fullPage;
  }
}

export default CartPage;
