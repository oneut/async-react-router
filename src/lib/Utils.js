/**
 * Clean path.
 */

export function cleanPath(path) {
    return path.replace(/\/\//g, '/');
}

/**
 * Normalize pathname.
 */

export function normalizePathname(pathname) {
    return pathname.split('?')[0].split("#")[0];
}

/**
 * Normalize route based on the parent.
 */

export function createRoute(path, parentPath) {
    if (path[0] === '/' && path.length === 1) return path;
    if (typeof parentPath === 'undefined') return path;
    if (parentPath[0] === '/' && parentPath.length === 1) return path;
    return `${parentPath}/${path}`;
}
