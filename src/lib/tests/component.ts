import type { Component, Snippet } from 'svelte';
import { vi } from 'vitest';
import { createRawSnippet, mount, unmount } from 'svelte';

import TestComponent from './component.svelte';

export function makeHtml(content : string) : Snippet {
  return createRawSnippet(() => ({ render : () => content }));
}

export function makeComponent({
  testId = '',
  style = {},
  noStyle = false,
  component = TestComponent,
} : {
  testId ?: string | ((...args : unknown[]) => string);
  style ?: Record<string, string>;
  noStyle ?: boolean;
  component ?: Component;
  wrapSnippets ?: Record<string, string>;
}) {
  const styles = !noStyle
    ? {
        'display' : 'flex',
        'align-items' : 'center',
        'justify-content' : 'center',
        ...style,
      }
    : { display : 'contents' };
  const css =
    Object.entries(styles).map(([key, value]) => `${key}: ${value};`).join(' ');
  return vi.fn((...params) => createRawSnippet((props) => {
    let id = testId;
    if (typeof testId === 'function') id = testId({ ...props });
    id = id ? `data-testid="${id}"` : '';
    return {
      render : () => `<div ${id} style="${css}"></div>`,
      setup : (node) => {
        const m = mount(
          component,
          { target : node, props : { ...props } },
        );
        return () => unmount(m);
      },
    };
  })(...params as never));
}

export async function wrapOriginal(
  component : () => Promise<unknown>,
  options : {
    testId ?: string | ((...args : unknown[]) => string);
    wrapSnippets ?: Record<string, string>;
  },
) {
  const originalComponent =
    ((await component()) as { default : Component; }).default;
  return makeComponent({
    ...options,
    component : originalComponent,
    noStyle : true,
  });
}
