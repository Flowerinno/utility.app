import { Anchor } from "@/components";
import { ROUTES } from "@/lib";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Utilito | App",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<ToastContainer closeOnClick stacked autoClose={1000} hideProgressBar />
				<header className="p-2 flex flex-row gap-2 items-center">
					<h1 className="font-bold text-lg">Utilito| </h1>
					<Anchor label="EnvToJson" href={ROUTES.envToJson} />
					<Anchor label="Status" href={ROUTES.status} />
					<Anchor label="Shopify Snippets" href={ROUTES.shopify_snippets} />
				</header>

				{children}
			</body>
		</html>
	);
}
