const def = '\x1b[0m';
const red = '\x1b[33m';
const green = '\x1b[32m';

export function error(m) {
  console.info(red, m, def);
}

export function success(m) {
  console.info(green, m, def);
}

export function info(m) {
  console.info(def, m, def);
}
