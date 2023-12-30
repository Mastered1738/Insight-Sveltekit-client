

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.8de5d633.js","_app/immutable/chunks/scheduler.63274e7e.js","_app/immutable/chunks/index.e159bb4a.js","_app/immutable/chunks/singletons.78cacbd8.js","_app/immutable/chunks/paths.41b0184a.js"];
export const stylesheets = [];
export const fonts = [];
