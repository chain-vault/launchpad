// eslint-disable-next-line max-classes-per-file
class EventBus extends EventTarget {
  private listeners: Map<string, Map<(event: CustomEvent<any>) => void, EventListener>> = new Map();

  addCustomEventListener<T extends Partial<Record<string, any>>>(
    type: string,
    listener: (event: CustomEvent<T>) => void,
    options?: AddEventListenerOptions | boolean
  ) {
    const eventListener: EventListener = (event: Event) => {
      listener(event as CustomEvent<T>);
    };

    if (!this.listeners.has(type)) {
      this.listeners.set(type, new Map());
    }

    this.listeners.get(type)!.set(listener, eventListener);
    this.addEventListener(type, eventListener, options);
  }

  dispatchCustomEvent<T>(type: string, detail: T) {
    const customEvent = new CustomEvent<T>(type, { detail });
    this.dispatchEvent(customEvent);
  }

  removeCustomEventListener<T extends Partial<Record<string, any>>>(
    type: string,
    listener: (event: CustomEvent<T>) => void
  ) {
    if (this.listeners.has(type) && this.listeners.get(type)!.has(listener)) {
      const eventListener = this.listeners.get(type)!.get(listener)!;
      this.removeEventListener(type, eventListener as EventListener);
      this.listeners.get(type)!.delete(listener);
    }
  }
}

export class EventManager {
  private static instances: Map<string, EventBus> = new Map();

  public static getInstance(name: string): EventBus {
    if (!EventManager.instances.has(name)) {
      EventManager.instances.set(name, new EventBus());
    }
    return EventManager.instances.get(name)!;
  }
}
