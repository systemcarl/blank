import { env } from '$env/dynamic/public';

export function resolveUrl(path : string, base ?: string) {
  if (base === undefined) base = env.PUBLIC_BASE_URL ?? '/';
  if (path.match(/^https?:\/\//)) return new URL(path);
  if (!base.match(/^https?:\/\//))
    return (`/${base}/${path}`)
      .replace(/\/{2,}/g, '/')
      .replace(/\/\.\//g, '/');
  return new URL(path, base);
}
