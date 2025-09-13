import { beforeEach, afterAll, describe, it, expect, vi } from 'vitest';
import { render, within } from '@testing-library/svelte';

import { wrapOriginal } from '$lib/tests/component';
import Heading from '$lib/materials/heading.svelte';
import ContactInfo from './contactInfo.svelte';
import Contact from './contact.svelte';

const locale = vi.hoisted(() => ({ contact : { header : 'Contact Header' } }));

vi.mock('$lib/hooks/useLocale', async (original) => {
  const originalDefault =
    ((await original()) as { default : () => object; }).default;
  return {
    default : () => ({
      ...originalDefault(),
      getLocale : vi.fn(() => locale),
    }),
  };
});

vi.mock('$lib/materials/heading.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'heading' }) };
});
vi.mock('./contactInfo.svelte', async (original) => {
  return { default : await wrapOriginal(original, { testId : 'info' }) };
});

beforeEach(() => { vi.clearAllMocks(); });
afterAll(() => { vi.restoreAllMocks(); });

describe('Contact', () => {
  it('renders contact heading', () => {
    const { container } = render(Contact);

    const heading = within(container).queryByTestId('heading');
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent(locale.contact.header);

    expect(Heading).toHaveBeenCalledTimes(1);
    expect(Heading).toHaveBeenCalledWithProps(expect.objectContaining({
      level : 2,
    }));
  });

  it('renders contact info', () => {
    const { container } = render(Contact);

    const info = within(container).queryByTestId('info');
    expect(info).toBeInTheDocument();

    expect(ContactInfo).toHaveBeenCalledTimes(1);
  });

  it('renders contact info below heading', () => {
    const { container } = render(Contact);

    const heading = within(container).queryByTestId('heading') as HTMLElement;
    expect(heading).toBeInTheDocument();
    const info = within(container).queryByTestId('info') as HTMLElement;
    expect(info).toBeInTheDocument();

    expect(heading.compareDocumentPosition(info)
      & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});
