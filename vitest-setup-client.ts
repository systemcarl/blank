import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';

// required for svelte5 + jsdom as jsdom does not support matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable : true,
  enumerable : true,
  value : vi.fn().mockImplementation(query => ({
    matches : false,
    media : query,
    onchange : null,
    addEventListener : vi.fn(),
    removeEventListener : vi.fn(),
    dispatchEvent : vi.fn(),
  })),
});

vi.mock('$env/static/public', () => ({}));
vi.mock('$env/static/private', () => ({}));
vi.mock('$env/dynamic/public', () => ({ env : {} }));
vi.mock('$env/dynamic/private', () => ({ env : {} }));
