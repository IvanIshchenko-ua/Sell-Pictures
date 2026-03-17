import { OrderCreatePayload } from "../types";

type ValidationResult = {
  ok: boolean;
  message?: string;
};

const normalizeText = (value: unknown, maxLength: number): string => {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
};

export const normalizePaintingInput = (payload: unknown) => {
  const data = (payload ?? {}) as Record<string, unknown>;

  return {
    title: normalizeText(data.title, 255),
    description: normalizeText(data.description, 5000),
    category: normalizeText(data.category, 100),
    image_url: normalizeText(data.image_url, 255),
    price: Number(data.price)
  };
};

export const validatePaintingInput = (payload: unknown): ValidationResult => {
  const data = normalizePaintingInput(payload);

  if (!data.title) return { ok: false, message: "Назва є обов'язковою" };
  if (!Number.isFinite(data.price) || data.price <= 0) {
    return { ok: false, message: "Ціна має бути додатнім числом" };
  }
  if (data.image_url && !/^\/(uploads)\/[A-Za-z0-9._-]+$/.test(data.image_url) && !/^https?:\/\//i.test(data.image_url)) {
    return { ok: false, message: "Невірний формат URL зображення" };
  }

  return { ok: true };
};

export const validateOrderInput = (payload: unknown): ValidationResult => {
  const data = (payload ?? {}) as OrderCreatePayload;

  const customerName = normalizeText(data.customer_name, 255);
  const customerEmail = normalizeText(data.customer_email, 255);
  const customerPhone = normalizeText(data.customer_phone, 20);
  const customerComment = normalizeText(data.customer_comment, 1500);
  const totalAmount = Number(data.total_amount);

  if (!customerName) return { ok: false, message: "Ім'я клієнта є обов'язковим" };
  if (!Array.isArray(data.items) || data.items.length === 0 || data.items.length > 20) {
    return { ok: false, message: "Невірний склад замовлення" };
  }

  if (!Number.isFinite(totalAmount) || totalAmount <= 0) {
    return { ok: false, message: "Невірна загальна сума замовлення" };
  }

  if (customerEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerEmail)) {
    return { ok: false, message: "Невірний email" };
  }

  if (customerPhone && !/^[+0-9()\-\s]{7,20}$/.test(customerPhone)) {
    return { ok: false, message: "Невірний формат телефону" };
  }

  const normalizedItems = data.items.map((item) => ({
    painting_id: Number(item.painting_id),
    quantity: Number(item.quantity),
    price: Number(item.price)
  }));

  for (const item of normalizedItems) {
    if (!Number.isInteger(item.painting_id) || item.painting_id <= 0) {
      return { ok: false, message: "Невірний товар у замовленні" };
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0 || item.quantity > 20) {
      return { ok: false, message: "Невірна кількість у замовленні" };
    }
    if (!Number.isFinite(item.price) || item.price <= 0) {
      return { ok: false, message: "Невірна ціна у замовленні" };
    }
  }

  const recomputedTotal = normalizedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (Math.abs(recomputedTotal - totalAmount) > 0.01) {
    return { ok: false, message: "Невідповідність суми замовлення" };
  }

  if (customerComment.length > 1500) {
    return { ok: false, message: "Коментар занадто довгий" };
  }

  return { ok: true };
};

export const normalizeOrderInput = (payload: unknown): OrderCreatePayload => {
  const data = (payload ?? {}) as Record<string, unknown>;
  const rawItems = Array.isArray(data.items) ? data.items : [];

  return {
    customer_name: normalizeText(data.customer_name, 255),
    customer_email: normalizeText(data.customer_email, 255),
    customer_phone: normalizeText(data.customer_phone, 20),
    customer_comment: normalizeText(data.customer_comment, 1500),
    total_amount: Number(data.total_amount),
    items: rawItems.map((item) => {
      const row = (item ?? {}) as Record<string, unknown>;
      return {
        painting_id: Number(row.painting_id),
        quantity: Number(row.quantity),
        price: Number(row.price)
      };
    })
  };
};