// ============================================================
// EventBus — React ↔ Phaser communication
// ============================================================

type EventCallback = (...args: unknown[]) => void;

class EventBus {
  private listeners: Map<string, EventCallback[]> = new Map();

  on(event: string, callback: EventCallback): this {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
    return this;
  }

  off(event: string, callback: EventCallback): this {
    const cbs = this.listeners.get(event);
    if (cbs) {
      const idx = cbs.indexOf(callback);
      if (idx !== -1) cbs.splice(idx, 1);
    }
    return this;
  }

  emit(event: string, ...args: unknown[]): this {
    const cbs = this.listeners.get(event);
    if (cbs) {
      cbs.forEach(cb => cb(...args));
    }
    return this;
  }

  removeAllListeners(event?: string): this {
    if (event) {
      this.listeners.delete(event);
    } else {
      this.listeners.clear();
    }
    return this;
  }
}

export const eventBus = new EventBus();
