import {
  beforeAll,
  beforeEach,
  afterAll,
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { page } from '@vitest/browser/context';
import { render } from '@testing-library/svelte';

import { loadStyles } from '$lib/tests/browser';
import {
  makeComponent,
  addChildComponent,
  wrapOriginal,
} from '$lib/tests/component';
import Content from './content.svelte';

vi.mock('./background.svelte', async original => ({
  default : await wrapOriginal(original, { testId : 'background' }),
}));

const TestContent = makeComponent({
  testId : 'content',
  style : {
    width : '100%',
    height : '100px',
  },
});

beforeAll(async () => await loadStyles());
beforeEach(() => { vi.clearAllMocks(); });

afterAll(() => { vi.restoreAllMocks(); });

describe('Content', () => {
  it('renders content layout', async () => {
    await page.viewport(768, 1024);
    const expectedSpacing = 32;
    const expectedPadding = 2 * expectedSpacing;

    const { container } = render(Content, {
      section : 'profile',
      children : TestContent,
    });

    container.style.setProperty('display', 'flex');
    container.style.setProperty('--layout-spacing', `${expectedSpacing}px`);

    const section = container.querySelector('section') as HTMLElement;
    expect(section).toBeInTheDocument();

    const background = page.elementLocator(container).getByTestId('background');
    const content = background.getByTestId('content');
    await expect.element(background).toBeInTheDocument();
    await expect.element(content).toBeInTheDocument();

    const layout = content.element().parentElement as HTMLElement;
    await expect.element(layout).toBeInTheDocument();

    expect(section.className).toMatch(/section-profile/);

    const layoutStyle = getComputedStyle(layout);
    expect(layoutStyle.display).toBe('flex');
    expect(layoutStyle.flexDirection).toBe('column');
    expect(layoutStyle.justifyContent).toBe('flex-start');
    expect(layoutStyle.alignItems).toBe('flex-start');

    const containerBounds = container.getBoundingClientRect();
    const contentBounds = content.element().getBoundingClientRect();
    expect(contentBounds.left)
      .toEqual(containerBounds.left + expectedPadding);
    expect(contentBounds.right)
      .toEqual(containerBounds.right - expectedPadding);
    expect(contentBounds.top)
      .toEqual(containerBounds.top + expectedPadding);
    expect(contentBounds.bottom)
      .toBeLessThanOrEqual(containerBounds.bottom - expectedPadding);
  });

  it('renders top navigation content layout', async () => {
    await page.viewport(768, 1024);
    const expectedSpacing = 32;
    const expectedPadding = 2 * expectedSpacing;

    const { container } = render(Content, {
      hasNav : true,
      children : TestContent,
    });

    container.style.setProperty('display', 'flex');
    container.style.setProperty('--layout-spacing', `${expectedSpacing}px`);

    const background = page.elementLocator(container).getByTestId('background');
    const content = background.getByTestId('content');
    await expect.element(background).toBeInTheDocument();
    await expect.element(content).toBeInTheDocument();

    const containerBounds = container.getBoundingClientRect();
    const contentBounds = content.element().getBoundingClientRect();
    expect(contentBounds.left)
      .toEqual(containerBounds.left + expectedPadding);
    expect(contentBounds.right)
      .toEqual(containerBounds.right - expectedPadding);
    expect(contentBounds.top)
      .toEqual(containerBounds.top + expectedSpacing / 2);
    expect(contentBounds.bottom)
      .toBeLessThanOrEqual(containerBounds.bottom - expectedPadding);
  });

  it('renders mobile content layout', async () => {
    await page.viewport(767, 1024);
    const expectedSpacing = 32;
    const expectedPadding = 2 * expectedSpacing;

    const { container } = render(Content, { children : TestContent });

    container.style.setProperty('display', 'flex');
    container.style.setProperty('--layout-spacing', `${2 * expectedSpacing}px`);

    const section = container.querySelector('section') as HTMLElement;
    expect(section).toBeInTheDocument();

    const background = page.elementLocator(container).getByTestId('background');
    const content = background.getByTestId('content');
    await expect.element(background).toBeInTheDocument();
    await expect.element(content).toBeInTheDocument();

    const layout = content.element().parentElement as HTMLElement;
    await expect.element(layout).toBeInTheDocument();

    const layoutStyle = getComputedStyle(layout);
    expect(layoutStyle.display).toBe('flex');
    expect(layoutStyle.flexDirection).toBe('column');
    expect(layoutStyle.justifyContent).toBe('flex-start');
    expect(layoutStyle.alignItems).toBe('flex-start');

    const containerBounds = container.getBoundingClientRect();
    const contentBounds = content.element().getBoundingClientRect();
    expect(contentBounds.left)
      .toEqual(containerBounds.left + expectedPadding);
    expect(contentBounds.right)
      .toEqual(containerBounds.right - expectedPadding);
    expect(contentBounds.top)
      .toEqual(containerBounds.top + expectedPadding);
    expect(contentBounds.bottom)
      .toBeLessThanOrEqual(containerBounds.bottom - expectedPadding);
  });

  it('renders top navigation mobile content layout', async () => {
    await page.viewport(767, 1024);
    const expectedSpacing = 32;
    const expectedPadding = 2 * expectedSpacing;

    const { container } = render(Content, {
      hasNav : true,
      children : TestContent,
    });

    container.style.setProperty('display', 'flex');
    container.style.setProperty('--layout-spacing', `${2 * expectedSpacing}px`);

    const background = page.elementLocator(container).getByTestId('background');
    const content = background.getByTestId('content');
    await expect.element(background).toBeInTheDocument();
    await expect.element(content).toBeInTheDocument();

    const containerBounds = container.getBoundingClientRect();
    const contentBounds = content.element().getBoundingClientRect();
    expect(contentBounds.left)
      .toEqual(containerBounds.left + expectedPadding);
    expect(contentBounds.right)
      .toEqual(containerBounds.right - expectedPadding);
    expect(contentBounds.top)
      .toEqual(containerBounds.top + expectedSpacing / 2);
    expect(contentBounds.bottom)
      .toBeLessThanOrEqual(containerBounds.bottom - expectedPadding);
  });

  it('renders content vertically centered layout', async () => {
    await page.viewport(768, 1024);
    const expectedSpacing = 32;
    const expectedPadding = 2 * expectedSpacing;

    const { container } = render(
      Content,
      { justification : 'centre', children : TestContent },
    );

    container.style.setProperty('display', 'flex');
    container.style.setProperty('height', '500px');
    container.style.setProperty('--layout-spacing', `${expectedSpacing}px`);

    const section = container.querySelector('section') as HTMLElement;
    expect(section).toBeInTheDocument();

    const background = page.elementLocator(container).getByTestId('background');
    const content = background.getByTestId('content');
    await expect.element(background).toBeInTheDocument();
    await expect.element(content).toBeInTheDocument();

    const layout = content.element().parentElement as HTMLElement;
    await expect.element(layout).toBeInTheDocument();

    const layoutStyle = getComputedStyle(layout);
    expect(layoutStyle.display).toBe('flex');
    expect(layoutStyle.flexDirection).toBe('column');
    expect(layoutStyle.justifyContent).toBe('center');
    expect(layoutStyle.alignItems).toBe('flex-start');

    const containerBounds = container.getBoundingClientRect();
    const contentBounds = content.element().getBoundingClientRect();
    expect(contentBounds.left)
      .toEqual(containerBounds.left + expectedPadding);
    expect(contentBounds.right)
      .toEqual(containerBounds.right - expectedPadding);
    expect(contentBounds.top)
      .toBeGreaterThan(containerBounds.top + expectedPadding);
    expect(contentBounds.bottom)
      .toBeLessThan(containerBounds.bottom - expectedPadding);
    expect(contentBounds.top - containerBounds.top)
      .toEqual(containerBounds.bottom - contentBounds.bottom);
  });

  it('renders content horizontally centered layout', async () => {
    await page.viewport(768, 1024);
    const expectedSpacing = 32;
    const expectedPadding = 2 * expectedSpacing;

    const { container } = render(
      Content,
      { alignment : 'centre', children : TestContent },
    );

    container.style.setProperty('display', 'flex');
    container.style.setProperty('height', '500px');
    container.style.setProperty('--layout-spacing', `${expectedSpacing}px`);

    const section = container.querySelector('section') as HTMLElement;
    expect(section).toBeInTheDocument();

    const background = page.elementLocator(container).getByTestId('background');
    const content = background.getByTestId('content');
    await expect.element(background).toBeInTheDocument();
    await expect.element(content).toBeInTheDocument();

    const layout = content.element().parentElement as HTMLElement;
    await expect.element(layout).toBeInTheDocument();

    const layoutStyle = getComputedStyle(layout);
    expect(layoutStyle.display).toBe('flex');
    expect(layoutStyle.flexDirection).toBe('column');
    expect(layoutStyle.justifyContent).toBe('flex-start');
    expect(layoutStyle.alignItems).toBe('center');

    const containerBounds = container.getBoundingClientRect();
    const contentBounds = content.element().getBoundingClientRect();
    expect(contentBounds.left)
      .toEqual(containerBounds.left + expectedPadding);
    expect(contentBounds.right)
      .toEqual(containerBounds.right - expectedPadding);
    expect(contentBounds.top)
      .toEqual(containerBounds.top + expectedPadding);
    expect(contentBounds.bottom)
      .toBeLessThan(containerBounds.bottom - expectedPadding);
  });

  it('stretches first content to fill layout', async () => {
    await page.viewport(768, 1024);
    const expectedHeight = 100;

    const { container } = render(Content);
    addChildComponent(container, Content);

    container.style.setProperty('display', 'flex');
    container.style.setProperty('flex-direction', 'column');
    container.style.setProperty('height', `${3 * expectedHeight}px`);
    container.style.setProperty('--layout-spacing', `${expectedHeight / 4}px`);

    const first = container.children[0] as HTMLElement;
    const second = container.children[1] as HTMLElement;
    await expect.element(first).toBeInTheDocument();
    await expect.element(second).toBeInTheDocument();

    const firstBounds = first.getBoundingClientRect();
    const secondBounds = second.getBoundingClientRect();

    expect(firstBounds.height).toEqual(2 * expectedHeight);
    expect(secondBounds.height).toEqual(expectedHeight);
  });
});
