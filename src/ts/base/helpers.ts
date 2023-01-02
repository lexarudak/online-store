import plants from '../../data/plants.json';
import App from '../app';
import Cart from '../components/cart';
import PurchaseModal from '../components/purchase-modal';
import { Products } from './types';

function isHTMLElement<T>(el: T | HTMLElement): el is HTMLElement {
  return el instanceof EventTarget;
}

function getExistentElement<T extends HTMLElement>(selector: string, node: Document | HTMLElement = document): T {
  const el = node.querySelector<T>(selector);
  if (el === null) throw new Error(`Element not found!`);
  return el;
}

function isPlantsId(id: string): boolean {
  if (Number(id) > 0 && Number(id) <= plants.total) {
    return true;
  }
  return false;
}

function setAddButton(button: HTMLElement, cart: Cart, plant: Products) {
  const id = plant.id.toString();
  if (plant.stock > 0) {
    id in cart.basket ? button.classList.add('button-purple') : button.classList.add('button');
    id in cart.basket ? (button.innerHTML = 'In your cart') : (button.innerHTML = 'Add to cart');
    button.addEventListener('click', function () {
      id in cart.basket ? cart.delete(id) : cart.add(id);
      id in cart.basket
        ? button.classList.replace('button', 'button-purple')
        : button.classList.replace('button-purple', 'button');
      id in cart.basket ? (button.innerHTML = 'In your cart') : (button.innerHTML = 'Add to cart');
      cart.updateHeader();
    });
  } else {
    button.classList.add('button-unable');
    button.innerHTML = 'Not available';
  }
}

function setBuyNowButton(button: HTMLElement, cart: Cart, plant: Products) {
  const id = plant.id.toString();
  if (plant.stock > 0) {
    button.classList.add('button-light');
    button.addEventListener('click', function () {
      id in cart.basket ? null : cart.add(id);
      cart.updateHeader();
      App.loadStartPage('cart');
      openPurchaseModal(cart);
    });
  } else {
    button.classList.add('button-unable');
    button.innerHTML = 'Not available';
  }
}

function openPurchaseModal(cart: Cart) {
  const modalTemp = document.querySelector('#purchase');
  if (modalTemp instanceof HTMLTemplateElement) {
    const modal = new PurchaseModal(modalTemp, cart);
    modal.draw();
  }
}

export { isHTMLElement, getExistentElement, isPlantsId, setAddButton, setBuyNowButton, openPurchaseModal };
