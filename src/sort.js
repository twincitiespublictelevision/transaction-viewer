function numberComp(a, b) {
  return a - b;
}

function dateComp(a, b) {
  return numberComp(new Date(a), new Date(b));
}

function stringComp(a, b) {
  return a.localeCompare(b);
}

/**
 * Generates a comparator function for sorting
 *
 * @param {boolean} [asc] Optional boolean flag to determine sort ordering
 * @returns {Function}
 */
export function sortGen(asc) {
  let dir = asc || false;

  return function(a, b) {
    let result;

    // If "a" look like a Date then try to sort it as a Date
    if (a instanceof Date || (typeof a !== 'number' && !isNaN(new Date(a).getTime()))) {
      result = dateComp(a, b);
    } else if (typeof a === 'string') {
      result = stringComp(a, b);
    } else {
      result = numberComp(a, b);
    }

    return dir ? 0 - result : result;
  };
}