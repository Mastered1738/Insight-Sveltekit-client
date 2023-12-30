export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {"start":"_app/immutable/entry/start.c2af6daf.js","app":"_app/immutable/entry/app.e1fd65fc.js","imports":["_app/immutable/entry/start.c2af6daf.js","_app/immutable/chunks/scheduler.63274e7e.js","_app/immutable/chunks/singletons.634e3910.js","_app/immutable/chunks/paths.9d73bdc8.js","_app/immutable/entry/app.e1fd65fc.js","_app/immutable/chunks/scheduler.63274e7e.js","_app/immutable/chunks/index.e159bb4a.js"],"stylesheets":[],"fonts":[]},
		nodes: [
			__memo(() => import('../output/server/nodes/0.js')),
			__memo(() => import('../output/server/nodes/1.js')),
			__memo(() => import('../output/server/nodes/2.js')),
			__memo(() => import('../output/server/nodes/3.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/moj_profil",
				pattern: /^\/moj_profil\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		}
	}
}
})();
