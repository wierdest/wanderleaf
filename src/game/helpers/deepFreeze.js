export function deepFreeze (obj) {
  Object.freeze(obj)
  for (const key in obj) {
    if (
      Object.hasOwn(obj, key) &&
        obj[key] !== null &&
        (typeof obj[key] === 'object' || typeof obj[key] === 'function') &&
        !Object.isFrozen(obj[key])
    ) {
      deepFreeze(obj[key])
    }
  }
  return obj
}
