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
