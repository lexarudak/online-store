import { Products } from '../../base/types';
import { isHTMLElement, getExistentElement } from '../../base/helpers';
import App from '../../app';

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
      getExistentElement('.product__price', productCardClone).textContent = item.price + '';
      getExistentElement('.product__stock-num', productCardClone).textContent = item.stock + '';
      getExistentElement('.product__rating-num', productCardClone).textContent = item.rating + '';

      if (item.discountPercentage) {
        getExistentElement('.product__discount-num', productCardClone).textContent = item.discountPercentage + '';
        getExistentElement('.product__price', productCardClone).style.color = '#ab5abb';
      } else {
        getExistentElement('.product__discount', productCardClone).style.display = 'none';
      }
      getExistentElement('.product__title', productCardClone).addEventListener('click', function () {
        console.log('qqq');
        App.loadStartPage(item.id.toString());
      });

      fragment.append(productCardClone);
    });
    getExistentElement('.products__container').innerHTML = '';
    getExistentElement('.products__container').appendChild(fragment);
  }
}

export default ProductCards;
