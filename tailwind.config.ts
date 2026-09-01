import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				bg: "var(--color-bg)",
				"bg-accent": "var(--color-bg-accent)",
				surface: "var(--color-surface)",
				"surface-muted": "var(--color-surface-muted)",
				ink: "var(--color-ink)",
				"ink-muted": "var(--color-ink-muted)",
				border: "var(--color-border)",
				"border-strong": "var(--color-border-strong)",
				accent: {
					DEFAULT: "var(--color-accent)",
					hover: "var(--color-accent-hover)",
					soft: "var(--color-accent-soft)",
				},
				success: {
					DEFAULT: "var(--color-success)",
					soft: "var(--color-success-soft)",
				},
				warning: {
					DEFAULT: "var(--color-warning)",
					soft: "var(--color-warning-soft)",
				},
				danger: {
					DEFAULT: "var(--color-danger)",
					soft: "var(--color-danger-soft)",
				},
			},
			fontFamily: {
				sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
				mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
			},
			boxShadow: {
				panel: "var(--shadow-sm)",
				lift: "var(--shadow-md)",
			},
			borderRadius: {
				lg: "var(--radius-md)",
				xl: "var(--radius-lg)",
			},
			backgroundImage: {
				"gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
				"gradient-conic":
					"conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
			},
			keyframes: {
				"fade-up": {
					"0%": { opacity: "0", transform: "translateY(8px)" },
					"100%": { opacity: "1", transform: "translateY(0)" },
				},
				"soft-pulse": {
					"0%, 100%": { opacity: "1" },
					"50%": { opacity: "0.55" },
				},
			},
			animation: {
				"fade-up": "fade-up 0.45s ease-out both",
				"soft-pulse": "soft-pulse 1.4s ease-in-out infinite",
			},
		},
	},
	plugins: [],
};
export default config;
