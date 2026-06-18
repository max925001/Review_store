/**
 * Safely saves data to localStorage
 * @param {string} key 
 * @param {any} value 
 */
export const saveToStorage = (key, value) => {
  try {
    const serialized = typeof value === 'string' ? value : JSON.stringify(value);
    localStorage.setItem(key, serialized);
  } catch (error) {
    // Fail silently in case storage is full or disabled
  }
};

/**
 * Safely gets data from localStorage
 * @param {string} key 
 * @param {any} defaultValue 
 */
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const value = localStorage.getItem(key);
    if (value === null) return defaultValue;
    
    // Attempt parsing in case it's stringified JSON
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  } catch (error) {
    return defaultValue;
  }
};

/**
 * Safely removes data from localStorage
 * @param {string} key 
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    // Fail silently
  }
};
