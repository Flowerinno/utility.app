import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ROUTES } from "@/lib";
import { Anchor } from "@/components";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
				</header>

				{children}
			</body>
		</html>
	);
}
