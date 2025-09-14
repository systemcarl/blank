import { describe, it, expect } from 'vitest';

import { defaultConfig, buildConfig } from './config';

const testConfig = {
  likes : null,
  dislikes : null,
};

describe('config', () => {
  it('returns default config', () => {
    const config = buildConfig(undefined);
    expect(config).toEqual(defaultConfig);
  });
});

describe('config likes', () => {
  it('returns config with valid likes', () => {
    const config = buildConfig({
      ...testConfig,
      likes : [
        { icon : 'icon1', text : 'Item 1' },
      ],
    });
    expect(config).toEqual(expect.objectContaining({
      likes : [
        { icon : 'icon1', text : 'Item 1' },
      ],
    }));
  });

  it('filters out invalid likes', () => {
    const config = buildConfig({
      ...testConfig,
      likes : [
        { icon : 'icon1', text : 'Item 1' },
        { icon : 123, text : 'Item 2' },
        { icon : 'icon3', text : null },
      ],
    });
    expect(config).toEqual(expect.objectContaining({
      likes : [{ icon : 'icon1', text : 'Item 1' }],
    }));
  });

  it('drops invalid likes property', () => {
    const config = buildConfig({
      ...testConfig,
      likes : 'invalid',
    });
    expect(config).toEqual(expect.objectContaining({
      likes : null,
    }));
  });
});

describe('config dislikes', () => {
  it('returns config with valid dislikes', () => {
    const config = buildConfig({
      ...testConfig,
      dislikes : [
        { icon : 'icon1', text : 'Item 1' },
      ],
    });
    expect(config).toEqual(expect.objectContaining({
      dislikes : [
        { icon : 'icon1', text : 'Item 1' },
      ],
    }));
  });

  it('filters out invalid dislikes', () => {
    const config = buildConfig({
      ...testConfig,
      dislikes : [
        { icon : 'icon1', text : 'Item 1' },
        { icon : 123, text : 'Item 2' },
        { icon : 'icon3', text : null },
      ],
    });
    expect(config).toEqual(expect.objectContaining({
      dislikes : [{ icon : 'icon1', text : 'Item 1' }],
    }));
  });

  it('drops invalid dislikes property', () => {
    const config = buildConfig({
      ...testConfig,
      dislikes : 'invalid',
    });
    expect(config).toEqual(expect.objectContaining({
      dislikes : null,
    }));
  });
});

describe('config contact', () => {
  it('returns config with valid contact', () => {
    const config = buildConfig({
      ...testConfig,
      contact : [
        {
          icon : 'icon1',
          link : 'Link 1',
          href : 'https://example1.com',
        },
        {
          icon : 'icon2',
          text : 'Text 2',
          link : 'Link 2',
          href : 'https://example2.com',
        },
      ],
    });
    expect(config).toEqual(expect.objectContaining({
      contact : [
        {
          icon : 'icon1',
          link : 'Link 1',
          href : 'https://example1.com',
        },
        {
          icon : 'icon2',
          text : 'Text 2',
          link : 'Link 2',
          href : 'https://example2.com',
        },
      ],
    }));
  });

  it('filters out invalid contact', () => {
    const config = buildConfig({
      ...testConfig,
      contact : [
        {
          icon : 'icon1',
          link : 'Link 1',
          href : 'https://example1.com',
        },
        { icon : 123, link : 'Link 2', href : 'https://example2.com' },
        { link : 'Link 3', href : 'https://example3.com' },
        { icon : 'icon4', link : 456, href : 'https://example4.com' },
        { icon : 'icon4', href : 'https://example5.com' },
        { icon : 'icon5', link : 'Link 5', href : 789 },
        { icon : 'icon5', link : 'Link 5' },
      ],
    });
    expect(config).toEqual(expect.objectContaining({
      contact : [
        { icon : 'icon1', link : 'Link 1', href : 'https://example1.com' },
      ],
    }));
  });

  it('drops invalid contact property', () => {
    const config = buildConfig({
      ...testConfig,
      contact : 'invalid',
    });
    expect(config).toEqual(expect.objectContaining({
      contact : null,
    }));
  });
});

describe('config profile links', () => {
  it('returns config with valid profile links', () => {
    const config = buildConfig({
      ...testConfig,
      profileLinks : [
        { text : 'Link 1', href : 'https://example1.com' },
        { text : 'Link 2', href : 'https://example2.com' },
      ],
    });
    expect(config).toEqual(expect.objectContaining({
      profileLinks : [
        { text : 'Link 1', href : 'https://example1.com' },
        { text : 'Link 2', href : 'https://example2.com' },
      ],
    }));
  });

  it('filters out invalid profile links', () => {
    const config = buildConfig({
      ...testConfig,
      profileLinks : [
        { text : 'Link 1', href : 'https://example1.com' },
        { text : 123, href : 'https://example2.com' },
        { href : 'https://example3.com' },
        { text : 'Link 4', href : 456 },
        { text : 'Link 5' },
      ],
    });
    expect(config).toEqual(expect.objectContaining({
      profileLinks : [
        { text : 'Link 1', href : 'https://example1.com' },
      ],
    }));
  });

  it('drops invalid profile links property', () => {
    const config = buildConfig({
      ...testConfig,
      profileLinks : 'invalid',
    });
    expect(config).toEqual(expect.objectContaining({
      profileLinks : null,
    }));
  });
});
