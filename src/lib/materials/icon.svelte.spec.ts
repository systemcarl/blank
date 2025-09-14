import {
  beforeAll,
  beforeEach,
  afterAll,
  describe,
  it,
  expect,
  vi,
} from 'vitest';
import { render } from '@testing-library/svelte';

import { loadStyles } from '$lib/tests/browser';
import { wrapOriginal } from '$lib/tests/component';
import Graphic from './graphic.svelte';
import Icon from './icon.svelte';

vi.mock('$lib/materials/graphic.svelte', async original => ({
  default : await wrapOriginal(original, { testId : 'graphic' }),
}));

beforeAll(async () => await loadStyles());
beforeEach(() => { vi.clearAllMocks(); });

afterAll(() => { vi.restoreAllMocks(); });

describe('Icon', () => {
  it('renders icon graphic', async () => {
    const { container } = render(Icon, {
      graphic : 'icon-graphic',
    });

    const icon = container.children[0] as HTMLElement;
    await expect.element(icon).toBeInTheDocument();

    const iconStyle = getComputedStyle(icon);
    expect(iconStyle.width).toBe(`${2 * 16}px`);
    expect(iconStyle.height).toBe(`${2 * 16}px`);

    expect(Graphic).toHaveBeenCalledOnce();
    expect(Graphic).toHaveBeenCalledWithProps(expect.objectContaining({
      graphic : 'icon-graphic',
    }));
  });
});
