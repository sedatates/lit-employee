const basePath = (() => {
  const {pathname} = new URL('.', document.baseURI);
  if (pathname === '/' || pathname === '') {
    return '';
  }
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
})();

export function getBasePath() {
  return basePath;
}

export function resolveAppPath(path = '/') {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalized}`;
}
