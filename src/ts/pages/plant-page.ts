import Page from './page';
import plants from '../../data/plants.json';

class PlantPage extends Page {
  plantId?: string;

  constructor() {
    super('product-page');
  }

  private getPlant() {
    if (this.plantId) {
      const plant = plants.products.filter((val) => val.id === Number(this.plantId));
      return plant[0];
    } else {
      return plants.products[0];
    }
  }

  private setDescription(container: Element): void {
    const plant = this.getPlant();
    const descriptionTitles = [
      ['Title', `${plant.title}`],
      ['Type', `${plant.type}`],
      ['Description', `${plant.description}`],
      ['Price (with discount)', `$ ${plant.price}`],
      ['Height', `${plant.height} cm.`],
      ['Rating', `&#9733 ${plant.rating}`],
      ['Quantity in stock', `${plant.stock} psc.`],
    ];
    descriptionTitles.forEach((element) => {
      const block = document.createElement('li');
      block.classList.add('product-page__specification-item');
      const name = document.createElement('span');
      name.classList.add('product-page__specification-name');
      name.innerHTML = element[0];
      const value = document.createElement('span');
      value.classList.add(`product-page__specification-text`);
      value.innerHTML = element[1];
      block.append(name, value);
      container.append(block);
    });
  }

  private setPictures(page: DocumentFragment) {
    const plant = this.getPlant();
    const photo = page.querySelector('.product-page__photo-block');
    const container = page.querySelector('.product-page__photo-block');
    if (photo instanceof HTMLElement) {
      photo.style.backgroundImage = `url('assets/img/${plant.thumbnail}')`;
      plant.images.forEach((pic, index) => {
        const img = document.createElement('img');
        img.src = `assets/img/${pic}`;
        img.classList.add('product-page__photo-mini');
        img.addEventListener('click', function (e) {
          const target = e.target;
          if (target instanceof HTMLImageElement) {
            photo.style.backgroundImage = `url('${target.src}')`;
            const oldPhoto = document.querySelector('.product-page__photo-mini_active');
            console.log(oldPhoto);
            oldPhoto?.classList.remove('product-page__photo-mini_active');
            target.classList.add('product-page__photo-mini_active');
          }
        });
        index === 0 ? img.classList.add('product-page__photo-mini_active') : null;
        container ? container.append(img) : null;
      });
    }
  }

  protected fillPage(id: string, page: Node) {
    this.plantId = id;
    if (page instanceof DocumentFragment) {
      const plant = this.getPlant();
      if (plant) {
        const title = page.querySelector('#product-title');
        title ? (title.innerHTML = plant.title) : null;

        const navigationName = page.querySelector('#navigation-name');
        navigationName ? (navigationName.innerHTML = plant.title) : null;

        const description = page.querySelector('.product-page__info-text');
        description ? (description.innerHTML = plant.description) : null;

        const stockAmount = page.querySelector('.product-page__stoke-amount');
        if (plant.stock > 0) {
          stockAmount ? (stockAmount.innerHTML = `(${plant.stock} psc.)`) : null;
        } else {
          stockAmount ? (stockAmount.innerHTML = 'not in stock') : null;
          const inStoke = page.querySelector('.product-page__stoke-text');
          inStoke instanceof HTMLElement ? (inStoke.style.display = 'none') : null;
        }

        const newPrice = page.querySelector('.product-page__new-price');
        newPrice ? (newPrice.innerHTML = plant.price.toString()) : null;
        if (plant.discountPercentage > 0) {
          const oldPriceValue = Math.ceil(plant.price / ((100 - plant.discountPercentage) / 100));
          const oldPrice = document.createElement('span');
          oldPrice.textContent = oldPriceValue.toString();
          oldPrice.classList.add('product-page__old-price', 'usd-symbol');
          newPrice ? newPrice.after(oldPrice) : null;
          newPrice instanceof HTMLElement ? newPrice.classList.add('product-page__new-price_sale') : null;
        }

        const descriptionContainer = page.querySelector('.product-page__specification-list');
        descriptionContainer ? this.setDescription(descriptionContainer) : null;

        this.setPictures(page);
      }
    }
    return page;
  }
}

export default PlantPage;
