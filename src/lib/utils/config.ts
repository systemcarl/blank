export interface Config {
  likes : { icon : string; text : string; }[] | null;
  dislikes : { icon : string; text : string; }[] | null;
}

export const defaultConfig : Config = {
  likes : null,
  dislikes : null,
};

export function buildConfig(config : unknown) : Config {
  if (typeof config !== 'object' || config === null) return defaultConfig;
  const conf = { ...config } as Config;

  if (!('likes' in conf) || !Array.isArray((conf.likes))) {
    conf.likes = defaultConfig.likes;
  } else {
    conf.likes = conf.likes.filter((item) => {
      if (typeof item !== 'object' || item === null) return false;
      if (!('icon' in item) || typeof item.icon !== 'string') return false;
      if (!('text' in item) || typeof item.text !== 'string') return false;
      return true;
    });
  }
  if (!('dislikes' in conf) || !Array.isArray((conf.dislikes))) {
    conf.dislikes = defaultConfig.dislikes;
  } else {
    conf.dislikes = conf.dislikes.filter((item) => {
      if (typeof item !== 'object' || item === null) return false;
      if (!('icon' in item) || typeof item.icon !== 'string') return false;
      if (!('text' in item) || typeof item.text !== 'string') return false;
      return true;
    });
  }

  return conf;
}
