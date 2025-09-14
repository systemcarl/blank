export interface Config {
  likes : { icon : string; text : string; }[] | null;
  dislikes : { icon : string; text : string; }[] | null;
  profileLinks : { text : string; href : string; }[] | null;
  contact : {
    icon : string;
    text ?: string;
    link : string;
    href : string;
  }[] | null;
}

export const defaultConfig : Config = {
  likes : null,
  dislikes : null,
  contact : null,
  profileLinks : null,
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

  if (!('contact' in conf) || !Array.isArray((conf.contact))) {
    conf.contact = defaultConfig.contact;
  } else {
    conf.contact = conf.contact.filter((item) => {
      if (typeof item !== 'object' || item === null) return false;
      if (!('icon' in item) || typeof item.icon !== 'string') return false;
      if ('text' in item && typeof item.text !== 'string') return false;
      if (!('link' in item) || typeof item.link !== 'string') return false;
      if (!('href' in item) || typeof item.href !== 'string') return false;
      return true;
    });
  }

  if (!('profileLinks' in conf) || !Array.isArray((conf.profileLinks))) {
    conf.profileLinks = defaultConfig.profileLinks;
  } else {
    conf.profileLinks = conf.profileLinks.filter((item) => {
      if (typeof item !== 'object' || item === null) return false;
      if (!('text' in item) || typeof item.text !== 'string') return false;
      if (!('href' in item) || typeof item.href !== 'string') return false;
      return true;
    });
  }

  return conf;
}
