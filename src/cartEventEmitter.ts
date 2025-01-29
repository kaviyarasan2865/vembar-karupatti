type CartEventCallback = (data?: unknown) => void;

export const CART_UPDATED_EVENT = 'cartUpdated';

export const cartEventEmitter = {
  listeners: new Map<string, Set<CartEventCallback>>(),

  emit(event: string, data?: unknown) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  },

  on(event: string, callback: CartEventCallback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  },

  off(event: string, callback: CartEventCallback) {
    this.listeners.get(event)?.delete(callback);
  }
};