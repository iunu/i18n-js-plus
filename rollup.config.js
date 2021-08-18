import babel from '@rollup/plugin-babel'
import pkg from './package.json'

export default [
	{
		input: 'src/main.js',
		external: [
			'@babel/runtime/helpers/applyDecoratedDescriptor',
			'@babel/runtime/helpers/asyncToGenerator',
			'@babel/runtime/helpers/classCallCheck',
			'@babel/runtime/helpers/createClass',
			'@babel/runtime/helpers/defineProperty',
			'@babel/runtime/helpers/getPrototypeOf',
			'@babel/runtime/helpers/inherits',
			'@babel/runtime/helpers/initializerDefineProperty',
			'@babel/runtime/helpers/initializerWarningHelper',
			'@babel/runtime/helpers/objectSpread',
			'@babel/runtime/helpers/possibleConstructorReturn',
			'@babel/runtime/helpers/slicedToArray',
			'@babel/runtime/regenerator',
			'@babel/runtime/helpers/assertThisInitialized',
			'@babel/runtime/helpers/toConsumableArray',
			'@babel/runtime/helpers/wrapNativeSuper'
		],
		output: [
			{ file: pkg.main, format: 'cjs' },
			{ file: pkg.module, format: 'es' }
		],
		plugins: [
			babel({
				exclude: ['node_modules/**'],
				babelHelpers: 'runtime',
				plugins: [['@babel/transform-runtime', { regenerator: true, useESModules: false }]]
			})
		]
	}
];
