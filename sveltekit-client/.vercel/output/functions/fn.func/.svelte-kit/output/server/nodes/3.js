

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/moj_profil/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.f1932f7f.js","_app/immutable/chunks/scheduler.63274e7e.js","_app/immutable/chunks/index.e159bb4a.js"];
export const stylesheets = ["_app/immutable/assets/3.57e794ce.css","_app/immutable/assets/app.3d3d1137.css"];
export const fonts = [];
