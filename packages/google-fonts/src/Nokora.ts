import {loadFonts} from './base';

export const getInfo = () => ({
	fontFamily: 'Nokora',
	importName: 'Nokora',
	version: 'v33',
	url: 'https://fonts.googleapis.com/css2?family=Nokora:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900',
	unicodeRanges: {
		khmer: 'U+1780-17FF, U+19E0-19FF, U+200C-200D, U+25CC',
		latin:
			'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD',
	},
	fonts: {
		normal: {
			'100': {
				khmer:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgNzAOkvY.woff2',
				latin:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgPDAO.woff2',
			},
			'200': {
				khmer:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgNzAOkvY.woff2',
				latin:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgPDAO.woff2',
			},
			'300': {
				khmer:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgNzAOkvY.woff2',
				latin:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgPDAO.woff2',
			},
			'400': {
				khmer:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgNzAOkvY.woff2',
				latin:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgPDAO.woff2',
			},
			'500': {
				khmer:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgNzAOkvY.woff2',
				latin:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgPDAO.woff2',
			},
			'600': {
				khmer:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgNzAOkvY.woff2',
				latin:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgPDAO.woff2',
			},
			'700': {
				khmer:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgNzAOkvY.woff2',
				latin:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgPDAO.woff2',
			},
			'800': {
				khmer:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgNzAOkvY.woff2',
				latin:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgPDAO.woff2',
			},
			'900': {
				khmer:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgNzAOkvY.woff2',
				latin:
					'https://fonts.gstatic.com/s/nokora/v33/hYkIPuwgTubzaWxgPDAO.woff2',
			},
		},
	},
	subsets: ['khmer', 'latin'],
});

export const fontFamily = 'Nokora' as const;

type Variants = {
	normal: {
		weights:
			| '100'
			| '200'
			| '300'
			| '400'
			| '500'
			| '600'
			| '700'
			| '800'
			| '900';
		subsets: 'khmer' | 'latin';
	};
};

export const loadFont = <T extends keyof Variants>(
	style?: T,
	options?: {
		weights?: Variants[T]['weights'][];
		subsets?: Variants[T]['subsets'][];
		document?: Document;
		ignoreTooManyRequestsWarning?: boolean;
	},
) => {
	return loadFonts(getInfo(), style, options);
};
