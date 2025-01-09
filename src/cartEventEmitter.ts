
export const CART_UPDATED_EVENT = 'cartUpdated';

export const cartEventEmitter = {
  listeners: new Map<string, Set<Function>>(),

  emit(event: string, data?: any) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      listeners.forEach(listener => listener(data));
    }
  },

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  },

  off(event: string, callback: Function) {
    this.listeners.get(event)?.delete(callback);
  }
};