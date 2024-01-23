import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/kit/vite';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({})
	},
	vite: {
		server: {
			proxy: {
				'/socket.io': {
					target: 'http://localhost:3000',
					ws: true,
				}
			},
			fs: {
				allow: ['..'],
			}
		}
	},
	preprocess: vitePreprocess(),
	plugins: [preprocess({ typescript: true })]
};
export default config;
