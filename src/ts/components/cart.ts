import { Basket } from '../base/types';
import plants from '../../data/plants.json';
import { promoList } from '../base/promo-codes';

class Cart {
  public productAmount: number;
  public productSum: number;
  public productOldSum: number;
  public basket: Basket;
  public activePromoCodes: string[];

  constructor() {
    this.basket = {
      '1': 1,
    };
    this.productAmount = 1;
    this.productSum = 15;
    this.productOldSum = 19;
    this.activePromoCodes = [];
  }

  public showProductAmount(HTMLElement: HTMLElement | null) {
    HTMLElement ? (HTMLElement.innerHTML = this.productAmount.toString()) : null;
  }

  public showProductSum(HTMLElement: HTMLElement | null) {
    HTMLElement ? (HTMLElement.innerHTML = this.productSum.toString()) : null;
  }

  public showProductOldSum(HTMLElement: HTMLElement | null) {
    HTMLElement ? (HTMLElement.innerHTML = this.productOldSum.toString()) : null;
  }

  public updateHeader() {
    const amount = document.getElementById('header-amount');
    const sum = document.getElementById('header-sum');
    this.showProductAmount(amount);
    this.showProductSum(sum);
  }

  public add(id: string) {
    const plant = plants.products.filter((value) => value.id === Number(id))[0];
    const oldPriceValue = Math.ceil(plant.price / ((100 - plant.discountPercentage) / 100));
    if (plant.stock > this.basket[id] || !this.basket[id]) {
      this.basket[id] ? (this.basket[id] += 1) : (this.basket[id] = 1);
      this.productAmount += 1;
      this.productSum += plant.price;
      this.productOldSum += oldPriceValue;
    }
  }

  public delete(id: string) {
    const plant = plants.products.filter((value) => value.id === Number(id))[0];
    const oldPriceValue = Math.ceil(plant.price / ((100 - plant.discountPercentage) / 100));
    if (id in this.basket) {
      this.basket[id] === 1 ? delete this.basket[id] : (this.basket[id] -= 1);
      this.productAmount -= 1;
      this.productSum -= plant.price;
      this.productOldSum -= oldPriceValue;
    }
  }

  public deletePromo(promo: Element) {
    this.activePromoCodes = this.activePromoCodes.filter((code) => code !== promo.id);
  }

  public addPromo(input: HTMLInputElement) {
    const promo = input.value.toUpperCase();
    if (promo in promoList && !this.activePromoCodes.includes(promo)) {
      this.activePromoCodes.push(promo);
    }
  }
}

export default Cart;
