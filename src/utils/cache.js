export function getCache (key, isTemp = false) {
  let objStr = ''
  if (isTemp) {
    objStr = sessionStorage.getItem(key)
  } else {
    objStr = localStorage.getItem(key)
  }
  const obj = objStr ? JSON.parse(objStr) : null
  if (obj && obj.expiration > Date.now()) {
    return obj.data
  }
  return null
}

export function setCache (key, value, isTemp = false, expiration = 7 * 24 * 60 * 60 * 1000) {
  if (!value) {
    removeCache(key)
    return false
  }
  const obj = {
    data: value,
    expiration: Date.now() + expiration
  }
  if (isTemp) {
    sessionStorage.setItem(key, JSON.stringify(obj))
  } else {
    localStorage.setItem(key, JSON.stringify(obj))
  }
}

export function removeCache (key, isTemp = false) {
  if (isTemp) {
    sessionStorage.removeItem(key)
  } else {
    localStorage.removeItem(key)
  }
}
