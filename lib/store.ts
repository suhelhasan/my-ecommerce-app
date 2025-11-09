// lib/store.ts
import { v4 as uuid } from "uuid";

export type ID = string;

export interface Item {
  id: ID;
  name: string;
  price: number;
  image: string;
}
export interface CartItem {
  itemId: ID;
  qty: number;
}
export interface Cart {
  userId: ID;
  items: CartItem[];
  updatedAt: number;
}
export interface Order {
  id: ID;
  userId: ID;
  items: CartItem[];
  subtotal: number;
  discountApplied?: { code: string; amount: number };
  total: number;
  createdAt: number;
}
export interface DiscountCode {
  code: string;
  createdAt: number;
  used: boolean;
  usedBy?: ID | null;
  usedAt?: number | null;
  amountPercent: number;
}

const ITEMS = new Map<ID, Item>();
const CARTS = new Map<ID, Cart>();
const ORDERS: Order[] = [];
const DISCOUNT_CODES = new Map<string, DiscountCode>();

let ORDER_COUNTER = 0;
let ACTIVE_DISCOUNT_CODE: string | null = null;
const N = 2; // every Nth order creates a new code

// seed items
function seedItems() {
  ITEMS.set("item-1", {
    id: "item-1",
    name: "T-shirt - Classic Green",
    price: 49900,
    image: "/images/products/item-1.png",
  });
  ITEMS.set("item-2", {
    id: "item-2",
    name: "T-shirt - Charcoal Grey",
    price: 39900,
    image: "/images/products/item-2.png",
  });

  ITEMS.set("item-3", {
    id: "item-3",
    name: "T-shirt - Mustard Yellow",
    price: 39900,
    image: "/images/products/item-3.png",
  });
  ITEMS.set("item-4", {
    id: "item-4",
    name: "T-shirt - Sky Blue",
    price: 44900,
    image: "/images/products/item-4.png",
  });
  ITEMS.set("item-5", {
    id: "item-5",
    name: "T-shirt - Red",
    price: 24900,
    image: "/images/products/item-5.png",
  });
  ITEMS.set("item-6", {
    id: "item-6",
    name: "T-shirt - Purple",
    price: 59900,
    image: "/images/products/item-6.png",
  });
}

seedItems();

function generateCode() {
  return `DISCOUNT-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function listItems() {
  return Array.from(ITEMS.values());
}

export function addToCart(userId: ID, itemId: ID, qty = 1) {
  const item = ITEMS.get(itemId);
  if (!item) throw new Error("Invalid item");

  // ensure existing is typed as Cart
  const existing: Cart = CARTS.get(userId) ?? {
    userId,
    items: [],
    updatedAt: Date.now(),
  };

  const idx = existing.items.findIndex((i) => i.itemId === itemId);
  if (idx >= 0) {
    existing.items[idx].qty += qty;
  } else {
    existing.items.push({ itemId, qty });
  }

  existing.updatedAt = Date.now();
  CARTS.set(userId, existing);
  return existing;
}

export function getCart(userId: ID): Cart {
  const c: Cart = CARTS.get(userId) ?? {
    userId,
    items: [],
    updatedAt: Date.now(),
  };
  return c;
}

export function computeSubtotal(cart: Cart) {
  let subtotal = 0;
  for (const ci of cart.items) {
    const it = ITEMS.get(ci.itemId);
    if (!it) throw new Error(`Invalid item ${ci.itemId}`);
    subtotal += it.price * ci.qty;
  }
  return subtotal;
}

export function checkout(userId: ID, discountCode?: string) {
  const cart = getCart(userId);
  if (cart.items.length === 0) throw new Error("Cart empty");

  const subtotal = computeSubtotal(cart);
  let discountAmount = 0;

  if (discountCode) {
    const dc = DISCOUNT_CODES.get(discountCode);
    if (!dc) throw new Error("Invalid discount code");
    if (dc.used) throw new Error("Discount code already used");
    if (discountCode !== ACTIVE_DISCOUNT_CODE)
      throw new Error("Discount code not active");

    discountAmount = Math.floor((subtotal * dc.amountPercent) / 100);
    dc.used = true;
    dc.usedBy = userId;
    dc.usedAt = Date.now();
    DISCOUNT_CODES.set(dc.code, dc);
  }

  const total = subtotal - discountAmount;
  ORDER_COUNTER += 1;

  const order: Order = {
    id: uuid(),
    userId,
    items: cart.items,
    subtotal,
    discountApplied: discountAmount
      ? { code: discountCode!, amount: discountAmount }
      : undefined,
    total,
    createdAt: Date.now(),
  };
  ORDERS.push(order);

  // clear cart
  CARTS.set(userId, { userId, items: [], updatedAt: Date.now() });

  // if this is nth order generate new discount
  let newDiscount: DiscountCode | null = null;
  if (ORDER_COUNTER % N === 0) {
    const code = generateCode();
    const dc: DiscountCode = {
      code,
      createdAt: Date.now(),
      used: false,
      amountPercent: 10,
    };
    DISCOUNT_CODES.set(code, dc);
    ACTIVE_DISCOUNT_CODE = code;
    newDiscount = dc;
  }

  return { order, newDiscount };
}

export function adminGenerateDiscount() {
  if (ORDER_COUNTER % N !== 0) return null;
  const code = generateCode();
  const dc: DiscountCode = {
    code,
    createdAt: Date.now(),
    used: false,
    amountPercent: 10,
  };
  DISCOUNT_CODES.set(code, dc);
  ACTIVE_DISCOUNT_CODE = code;
  return dc;
}

export function adminStats() {
  const totalOrders = ORDERS.length;
  let totalItemsPurchased = 0;
  let totalPurchaseAmount = 0;
  let totalDiscountAmount = 0;
  for (const o of ORDERS) {
    for (const it of o.items) totalItemsPurchased += it.qty;
    totalPurchaseAmount += o.subtotal;
    if (o.discountApplied) totalDiscountAmount += o.discountApplied.amount;
  }
  return {
    totalOrders,
    totalItemsPurchased,
    totalPurchaseAmount,
    discountCodes: Array.from(DISCOUNT_CODES.values()),
    totalDiscountAmount,
  };
}

// helpers for dev/tests
export function resetStoreForTests() {
  CARTS.clear();
  ORDERS.length = 0;
  DISCOUNT_CODES.clear();
  ORDER_COUNTER = 0;
  ACTIVE_DISCOUNT_CODE = null;
}
