export interface Highlight {
  type : 'tag';
  key : string;
  section ?: string;
}

export interface Config {
  likes : { icon : string; text : string; }[] | null;
  dislikes : { icon : string; text : string; }[] | null;
  profileLinks : { text : string; href : string; }[] | null;
  highlights : Highlight[] | null;
  contact : {
    icon : string;
    text ?: string;
    link : string;
    href : string;
  }[] | null;
  weblog : {
    url ?: string;
  };
}

export const defaultConfig : Config = {
  likes : null,
  dislikes : null,
  highlights : null,
  contact : null,
  profileLinks : null,
  weblog : {},
};

export function buildConfig(config : unknown) : Config {
  if (typeof config !== 'object' || config === null) return defaultConfig;
  const conf = { ...config } as Config;

  if (!Array.isArray((conf.likes))) {
    conf.likes = defaultConfig.likes;
  } else {
    conf.likes = conf.likes.filter((item) => {
      if (typeof item !== 'object' || item === null) return false;
      if (!('icon' in item) || typeof item.icon !== 'string') return false;
      if (!('text' in item) || typeof item.text !== 'string') return false;
      return true;
    });
  }
  if (!Array.isArray((conf.dislikes))) {
    conf.dislikes = defaultConfig.dislikes;
  } else {
    conf.dislikes = conf.dislikes.filter((item) => {
      if (typeof item !== 'object' || item === null) return false;
      if (!('icon' in item) || typeof item.icon !== 'string') return false;
      if (!('text' in item) || typeof item.text !== 'string') return false;
      return true;
    });
  }

  if (!Array.isArray((conf.contact))) {
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

  if (!Array.isArray((conf.profileLinks))) {
    conf.profileLinks = defaultConfig.profileLinks;
  } else {
    conf.profileLinks = conf.profileLinks.filter((item) => {
      if (typeof item !== 'object' || item === null) return false;
      if (!('text' in item) || typeof item.text !== 'string') return false;
      if (!('href' in item) || typeof item.href !== 'string') return false;
      return true;
    });
  }

  if (!conf.weblog || (typeof conf.weblog !== 'object')) {
    conf.weblog = defaultConfig.weblog;
  } else if (!('url' in conf.weblog) || typeof conf.weblog.url !== 'string') {
    delete conf.weblog.url;
  }

  return conf;
}
