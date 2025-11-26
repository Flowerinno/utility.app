import StatusPage from "@/components/StatusPage";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function checkAuth(formData: FormData) {
	"use server";
	const password = formData.get("password");
	
	if (password === process.env.STATUS_PAGE_PASSWORD) {
		cookies().set("status-auth", "true", {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 60 * 60 * 24,
		});
		redirect("/status");
	}
	
	return { error: "Invalid password" };
}

async function logout() {
	"use server";
	cookies().delete("status-auth");
	redirect("/status");
}

const page = async () => {
	const cookieStore = cookies();
	const isAuthenticated = cookieStore.get("status-auth")?.value === "true";

	if (!isAuthenticated) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gray-100">
				<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
					<h1 className="text-2xl font-bold mb-6 text-center">
						Status Page Access
					</h1>
					<form action={checkAuth} className="space-y-4">
						<div>
							<label
								htmlFor="password"
								className="block text-sm font-medium text-gray-700 bg-b mb-2"
							>
								Password
							</label>
							<input
								type="password"
								id="password"
								name="password"
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
								placeholder="Enter password"
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
						>
							Access Status Page
						</button>
					</form>
				</div>
			</div>
		);
	}

	return (
		<div>
			<div className="container mx-auto p-6">
				<form action={logout} className="flex justify-end mb-4">
					<button
						type="submit"
						className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition-colors text-sm"
					>
						Logout
					</button>
				</form>
			</div>
			<StatusPage />
		</div>
	);
};

export default page;
