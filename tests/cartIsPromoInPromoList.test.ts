import Cart from '../src/ts/components/cart';

let cart: Cart;

beforeEach(() => {
  cart = new Cart();
  cart.saveCart = () => null;
});

test('check ease true', () => {
  expect(cart.isPromoInPromoList('SALE10')).toBe(true);
});

test('check ease true', () => {
  expect(cart.isPromoInPromoList('PLANTS10')).toBe(true);
});

test('check ease true', () => {
  expect(cart.isPromoInPromoList('FORYOU10')).toBe(true);
});

test('check ease false', () => {
  expect(cart.isPromoInPromoList('FORYOU11')).toBe(false);
});

test('check ease false', () => {
  expect(cart.isPromoInPromoList('sdasdasd')).toBe(false);
});

test('check empty', () => {
  expect(cart.isPromoInPromoList('')).toBe(false);
});

test('check lowercase', () => {
  expect(cart.isPromoInPromoList('sale10')).toBe(false);
});
