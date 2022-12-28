import { changeCartListActions } from '../base/enums';
import { getExistentElement } from '../base/helpers';
import Cart from './cart';
import CartCard from './product-card/cart-cards';
import plants from '../../data/plants.json';
import App from '../app';
import { PageInfo } from '../base/types';

class CartList {
  public container: HTMLElement;
  public currentPageContainer: HTMLElement | null;
  public itemsOnPageContainer: HTMLElement | null;
  public maxPageContainer: HTMLElement | null;
  public cardsContainer: HTMLElement | null;

  constructor(container: HTMLElement) {
    this.container = container;
    this.cardsContainer = container.querySelector('.cart-list');
    this.currentPageContainer = container.querySelector('#paginationCurrentPage');
    this.maxPageContainer = container.querySelector('#pagination-max-pages');
    this.itemsOnPageContainer = container.querySelector('#pagination-items');
  }

  public changeCartList(e: Event, cart: Cart, pageInfo: PageInfo) {
    const target = e.target;
    console.log(target, cart);
    if (target instanceof HTMLElement) {
      switch (target.id) {
        case changeCartListActions.pageUp:
          this.currentPageUp(cart, pageInfo);
          break;
        case changeCartListActions.pageDown:
          this.currentPageDown(cart, pageInfo);
          break;
        case changeCartListActions.itemsUp:
          pageInfo = this.itemsOnPageUp(cart, pageInfo);
          break;
        case changeCartListActions.itemsDown:
          pageInfo = this.itemsOnPageDown(cart, pageInfo);
          break;
        default:
          if (target.classList.contains('product__right-arrow')) {
            cart = this.updateCart(cart, target.closest('.cart-list__item'), 'up');
          }
          if (target.classList.contains('product__left-arrow')) {
            cart = this.updateCart(cart, target.closest('.cart-list__item'), 'down');
          }
          if (this.getMaxPage(cart, pageInfo) < pageInfo.currentPage && this.getMaxPage(cart, pageInfo) !== 0) {
            pageInfo.currentPage -= 1;
            App.loadStartPage('cart');
          }
          break;
      }
      cart.updateHeader();
      this.updateCartList(cart, pageInfo);
    }
    return { cart, pageInfo };
  }

  public updateCartList(cart: Cart, pageInfo: PageInfo) {
    this.currentPageContainer instanceof HTMLInputElement
      ? (this.currentPageContainer.value = pageInfo.currentPage.toString())
      : null;
    this.itemsOnPageContainer instanceof HTMLInputElement
      ? (this.itemsOnPageContainer.value = pageInfo.itemsOnPage.toString())
      : null;
    this.maxPageContainer instanceof HTMLInputElement
      ? (this.maxPageContainer.value = this.getMaxPage(cart, pageInfo).toString())
      : null;
  }

  private updateCart(cart: Cart, element: HTMLElement | null, upOrDown: string) {
    if (element) {
      const id = element.id;
      switch (upOrDown) {
        case 'up':
          cart.add(id);
          this.updateCard(element, cart, id);
          break;

        case 'down':
          cart.basket[id] === 1 ? element.remove() : null;
          cart.basket[id] !== 1 ? this.updateCard(element, cart, id) : null;
          cart.delete(id);
          App.loadStartPage('cart');
          break;
        default:
          break;
      }
    }
    return cart;
  }

  private updateCard(element: HTMLElement, cart: Cart, id: string) {
    const plant = plants.products.filter((plant) => plant.id === Number(id))[0];
    const priceContainer = getExistentElement('.product__price', element);
    const oldPriceContainer = getExistentElement('.product__old-price', element);
    const countContainer = getExistentElement('.product__amount-number', element) as HTMLInputElement;
    priceContainer.innerHTML = '$' + (plant.price * cart.basket[id]).toString();
    if (plant.discountPercentage) {
      const oldPriceValue = Math.ceil((plant.price * cart.basket[id]) / ((100 - plant.discountPercentage) / 100));
      oldPriceContainer.innerHTML = '$' + oldPriceValue.toString();
    }
    countContainer.value = cart.basket[id].toString();
  }

  private getMaxPage(cart: Cart, pageInfo: PageInfo) {
    const itemsInBasket = Object.keys(cart.basket).length;
    return Math.ceil(itemsInBasket / pageInfo.itemsOnPage);
  }

  private currentPageUp(cart: Cart, pageInfo: PageInfo) {
    const maxPage = this.getMaxPage(cart, pageInfo);
    pageInfo.currentPage < maxPage ? (pageInfo.currentPage += 1) : null;
    this.fillCards(cart, pageInfo);
  }

  private currentPageDown(cart: Cart, pageInfo: PageInfo) {
    pageInfo.currentPage > 1 ? (pageInfo.currentPage -= 1) : null;
    this.fillCards(cart, pageInfo);
  }

  private itemsOnPageUp(cart: Cart, pageInfo: PageInfo) {
    pageInfo.itemsOnPage < 10 ? (pageInfo.itemsOnPage += 1) : null;

    this.fillCards(cart, pageInfo);
    return pageInfo;
  }

  private itemsOnPageDown(cart: Cart, pageInfo: PageInfo) {
    pageInfo.itemsOnPage > 1 ? (pageInfo.itemsOnPage -= 1) : null;
    this.fillCards(cart, pageInfo);
    return pageInfo;
  }

  public fillCards(cart: Cart, pageInfo: PageInfo) {
    if (this.cardsContainer) {
      this.cardsContainer.innerHTML = '';
      const itemsInBasket = Object.keys(cart.basket);
      const startItem = (pageInfo.currentPage - 1) * pageInfo.itemsOnPage;
      itemsInBasket.forEach((item, num) => {
        if (num >= startItem && num < startItem + pageInfo.itemsOnPage) {
          const card = new CartCard(item, num + 1, cart.basket[item]);
          this.cardsContainer ? card.draw(this.cardsContainer) : null;
        }
      });
    }
  }
}

export default CartList;
