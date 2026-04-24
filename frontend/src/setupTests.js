import '@testing-library/jest-dom';

/* ── Mock IntersectionObserver (not in jsdom) ── */
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

/* ── Mock @rails/actioncable ── */
jest.mock('@rails/actioncable', () => ({
  createConsumer: jest.fn(() => ({
    subscriptions: {
      create: jest.fn(() => ({ unsubscribe: jest.fn() })),
    },
    disconnect: jest.fn(),
  })),
}));

/* ── Mock api service ── */
jest.mock('./services/api', () => {
  const mock = {
    defaults: { headers: { common: {} } },
    interceptors: {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    },
    get: jest.fn(() => Promise.resolve({ data: { properties: [], meta: { total_pages: 1 } } })),
    post: jest.fn(() => Promise.resolve({ data: {} })),
    delete: jest.fn(() => Promise.resolve({ data: {} })),
  };
  mock.default = mock;
  return {
    __esModule: true,
    default: mock,
    loginUser: jest.fn(),
    registerUser: jest.fn(),
    getCurrentUser: jest.fn(),
    getProperties: jest.fn(() => Promise.resolve({ properties: [], meta: { total_pages: 1 } })),
    getWatchlist: jest.fn(() => Promise.resolve({ watchlist_items: [] })),
    addToWatchlist: jest.fn(),
    removeFromWatchlist: jest.fn(),
  };
});
