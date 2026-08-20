import postcssPresetEnv from 'postcss-preset-env';
import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';
import { BROWSERSLIST } from '../../build/browser-floor.mjs';

const config = (ctx) => ({
	plugins: [
		postcssPresetEnv({ browsers: BROWSERSLIST }),
		ctx.env === 'production' ? purgeCSSPlugin({
			content: [
				'./src/**/*.html',
				'./src/**/*.jsx',
				'./src/**/*.js',
			],
			defaultExtractor: content => content.match(/[\w-/:]+(?<!:)/g) || [],
		}) : null,
	].filter(Boolean),
});

export default config;
