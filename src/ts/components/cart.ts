import { Basket } from '../base/types';
import plants from '../../data/plants.json';

class Cart {
  private productAmount: number;
  private productSum: number;
  private productOldSum: number;
  public basket: Basket;

  constructor() {
    this.basket = {};
    this.productAmount = 0;
    this.productSum = 0;
    this.productOldSum = 0;
  }

  public showProductAmount(documentId: string) {
    const amount = document.getElementById(documentId);
    amount ? (amount.innerHTML = this.productAmount.toString()) : null;
  }

  public showProductSum(documentId: string) {
    const sum = document.getElementById(`${documentId}`);
    console.log(documentId, sum);
    sum ? (sum.innerHTML = this.productSum.toString()) : null;
  }

  public showProductOldSum(documentId: string) {
    const oldSum = document.getElementById(documentId);
    oldSum ? (oldSum.innerHTML = this.productOldSum.toString()) : null;
  }

  public updateHeader() {
    this.showProductAmount('header-amount');
    this.showProductSum('header-sum');
  }

  public add(id: string) {
    console.log('add');
    const plant = plants.products.filter((value) => value.id === Number(id))[0];
    const oldPriceValue = Math.ceil(plant.price / ((100 - plant.discountPercentage) / 100));
    console.log(plant.stock, this.basket[id]);
    if (plant.stock > this.basket[id] || !this.basket[id]) {
      this.basket[id] ? (this.basket[id] += 1) : (this.basket[id] = 1);
      console.log(this.basket);
      this.productAmount += 1;
      this.productSum += plant.price;
      this.productOldSum += oldPriceValue;
      console.log(this.productSum);
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
}

export default Cart;
