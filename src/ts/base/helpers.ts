import plants from '../../data/plants.json';

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

export { isHTMLElement, getExistentElement, isPlantsId };
