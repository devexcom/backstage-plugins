import '@testing-library/jest-dom';

// Mock IntersectionObserver for infinite scroll tests
class MockIntersectionObserver implements IntersectionObserver {
  callback: IntersectionObserverCallback;
  elements: Set<Element> = new Set();
  root: Element | Document | null = null;
  rootMargin: string = '0px';
  thresholds: ReadonlyArray<number> = [0];

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe(element: Element) {
    this.elements.add(element);
  }

  unobserve(element: Element) {
    this.elements.delete(element);
  }

  disconnect() {
    this.elements.clear();
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }

  // Test utility to trigger intersection
  trigger(entries: Partial<IntersectionObserverEntry>[]) {
    this.callback(
      entries as IntersectionObserverEntry[],
      this as IntersectionObserver,
    );
  }
}

Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  configurable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver for responsive tests
class MockResizeObserver {
  observe = jest.fn();
  disconnect = jest.fn();
  unobserve = jest.fn();
}

Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  configurable: true,
  value: MockResizeObserver,
});

// Mock window.open
Object.defineProperty(window, 'open', {
  writable: true,
  value: jest.fn(),
});

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Suppress console warnings in tests unless explicitly needed
const originalWarn = console.warn;
console.warn = (...args: any[]) => {
  if (
    args[0]?.includes?.('Material-UI') ||
    args[0]?.includes?.('deprecated') ||
    args[0]?.includes?.('Warning:') ||
    args[0]?.includes?.('react-window')
  ) {
    return;
  }
  originalWarn(...args);
};
