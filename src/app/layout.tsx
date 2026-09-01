import { SiteHeader } from "@/components/SiteHeader";
import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const sans = Plus_Jakarta_Sans({
	subsets: ["latin"],
	variable: "--font-sans",
	display: "swap",
});

const mono = JetBrains_Mono({
	subsets: ["latin"],
	variable: "--font-mono",
	display: "swap",
});

export const metadata: Metadata = {
	title: "Utilito | App",
	description: "Useful tools for everyday use.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${sans.variable} ${mono.variable} font-sans`}>
				<div className="app-shell">
					<ToastContainer
						closeOnClick
						stacked
						autoClose={1000}
						hideProgressBar
						theme="light"
					/>
					<SiteHeader />
					{children}
				</div>
			</body>
		</html>
	);
}
