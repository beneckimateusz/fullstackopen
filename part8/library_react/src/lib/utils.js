export const unique = xs => [...new Set(xs)];

export const includedIn = (set, object) =>
  set.map(o => o.id).includes(object.id);
