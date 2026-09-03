import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
	base: './',
	plugins: [react()],
	server: {
		port: 3000,
		open: true,
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					'vendor-react': ['react', 'react-dom'],
					'vendor-icons': ['lucide-react'],
				},
			},
		},
		chunkSizeWarningLimit: 600,
	},
});
