import { Products, DataObj } from '../../base/types';
import { isHTMLElement, getExistentElement } from '../../base/helpers';
import App from './../../app';

class ProductCards {
  draw(data: Products[]): void {
    // console.log(data);
    const productCard: Products[] = data;
    const fragment: DocumentFragment = document.createDocumentFragment();
    const productCardTemp: HTMLTemplateElement = getExistentElement<HTMLTemplateElement>('#productCardTemp');

    productCard.forEach((item) => {
      const productCardClone: Node = productCardTemp.content.cloneNode(true);
      if (!isHTMLElement(productCardClone)) throw new Error(`Element is not HTMLElement!`);

      getExistentElement(
        '.product__photo',
        productCardClone
      ).style.backgroundImage = `url('assets/img/${item.thumbnail}')`;

      getExistentElement('.product__type', productCardClone).textContent = item.type;
      getExistentElement('.product__title', productCardClone).textContent = item.title;
      getExistentElement('.product__description', productCardClone).textContent = item.description;
      getExistentElement('.product__price', productCardClone).textContent = item.price.toString();
      getExistentElement('.product__stock-num', productCardClone).textContent = item.stock.toString();
      getExistentElement('.product__rating-num', productCardClone).textContent = item.rating.toString();

      if (item.discountPercentage) {
        getExistentElement('.product__discount-num', productCardClone).textContent = item.discountPercentage.toString();
        getExistentElement('.product__price', productCardClone).style.color = '#ab5abb';
      } else {
        getExistentElement('.product__discount', productCardClone).style.display = 'none';
      }

      const button = getExistentElement<HTMLButtonElement>('button', productCardClone);

      getExistentElement('.product', productCardClone).addEventListener('click', function (e) {
        if (e.target === button) {
          console.log('add to card');
        } else {
          App.loadStartPage(item.id.toString());
        }
      });

      fragment.append(productCardClone);
    });
    getExistentElement('.products__container').innerHTML = '';
    getExistentElement('.products__container').appendChild(fragment);
  }

  sortInput(dataObj: DataObj): void {
    let newData: Products[] = dataObj.newData;
    if (dataObj.chekedData.length) newData = dataObj.chekedData;

    const input = getExistentElement<HTMLInputElement>('.sort-input');
    const sortInputValue: string = input.value.toLowerCase().trim();
    dataObj.inputData = newData.filter((item) => {
      return (
        item.title.toLowerCase().includes(sortInputValue) ||
        item.type.toLowerCase().includes(sortInputValue) ||
        item.description.toLowerCase().includes(sortInputValue)
      );
    });

    this.draw(dataObj.inputData);
  }

  sortBy(target: EventTarget | null, dataObj: DataObj): void {
    let newData: Products[] = dataObj.newData;
    if (dataObj.chekedData.length) newData = dataObj.chekedData;
    if (!isHTMLElement(target)) throw new Error();
    switch (target.dataset.sort) {
      case 'rating-up':
        newData = newData.sort((a, b) => a.rating - b.rating);
        break;
      case 'rating-down':
        newData = newData.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-up':
        newData = newData.sort((a, b) => a.price - b.price);
        break;
      case 'price-down':
        newData = newData.sort((a, b) => b.price - a.price);
        break;
    }

    this.draw(newData);
  }

  checkboxTypeFilter(target: EventTarget | null, dataObj: DataObj, checkTypes: string[]): void {
    if (!isHTMLElement(target)) throw new Error();
    let newData: Products[] = dataObj.newData;
    if (dataObj.inputData.length) newData = dataObj.inputData;

    if (target instanceof HTMLInputElement) {
      if (target.checked) {
        checkTypes.push(target.value);
      } else if (!target.checked) {
        checkTypes.splice(checkTypes.indexOf(target.value), 1);
      }
    }

    if (checkTypes.length) {
      const chekedTypes = [];
      for (const type of checkTypes) {
        const oneType = newData.filter((item) => item.type.toLowerCase() === type);
        chekedTypes.push(oneType);
      }
      newData = chekedTypes.flat();
      dataObj.chekedData = chekedTypes.flat();
    }

    this.draw(newData);
  }
}

export default ProductCards;
