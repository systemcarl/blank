export function Cache<T>(ttl : number) {
  const cache : Record<string, { value : T; timestamp : number; }> = {};

  function isCacheValid(key : string) : boolean {
    const record = cache[key];
    if (!record) return false;
    return (Date.now() - record.timestamp) <= ttl;
  }

  async function getCache(key : string, load : () => T | Promise<T>) {
    if (isCacheValid(key)) return cache[key]?.value as T;
    const value = await load();
    cache[key] = { value : value, timestamp : Date.now() };
    return value;
  }

  return {
    get : getCache,
  };
}
