/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			colors: {
				space: {
					bg: '#090A27',
					card: '#0F123D',
					border: '#23296B',
					accent: '#FF4B72',
					purple: '#5B4DFF',
					blue: '#1F8EFA',
					teal: '#00E5FF',
					green: '#00D166',
					yellow: '#FFB800',
					orange: '#FF9500',
					red: '#FF435A',
				},
			},
			fontFamily: {
				sans: [
					'"Nunito"',
					'system-ui',
					'-apple-system',
					'BlinkMacSystemFont',
					'Segoe UI',
					'Roboto',
					'sans-serif',
				],
			},
			animation: {
				'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				float: 'float 4s ease-in-out infinite',
				'bounce-short': 'bounceShort 0.5s ease-in-out infinite alternate',
				sparkle: 'sparkle 1.5s ease-in-out infinite',
			},
			keyframes: {
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-8px)' },
				},
				bounceShort: {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(-5px)' },
				},
				sparkle: {
					'0%, 100%': { opacity: 1, transform: 'scale(1)' },
					'50%': { opacity: 0.4, transform: 'scale(0.85)' },
				},
			},
		},
	},
	plugins: [],
};
