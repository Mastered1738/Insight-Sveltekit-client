

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/2.2c24677e.js","_app/immutable/chunks/scheduler.63274e7e.js","_app/immutable/chunks/index.e159bb4a.js","_app/immutable/chunks/paths.9d73bdc8.js"];
export const stylesheets = ["_app/immutable/assets/2.7dc68d88.css","_app/immutable/assets/app.3d3d1137.css"];
export const fonts = [];
