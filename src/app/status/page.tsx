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
			<main className="app-main flex items-center justify-center py-16 animate-fade-up">
				<div className="panel w-full max-w-md p-6 sm:p-8 shadow-lift">
					<p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-accent">
						Protected
					</p>
					<h1 className="text-2xl font-semibold tracking-tight text-ink">
						Status Page Access
					</h1>
					<p className="mt-2 text-sm text-ink-muted">
						Enter the password to view API health checks.
					</p>
					<form action={checkAuth} className="mt-6 space-y-4">
						<div>
							<label
								htmlFor="password"
								className="mb-1.5 block text-sm font-medium text-ink"
							>
								Password
							</label>
							<input
								type="password"
								id="password"
								name="password"
								required
								className="field"
								placeholder="Enter password"
							/>
						</div>
						<button type="submit" className="btn-primary w-full">
							Access Status Page
						</button>
					</form>
				</div>
			</main>
		);
	}

	return (
		<main className="app-main">
			<div className="mb-4 flex justify-end">
				<form action={logout}>
					<button type="submit" className="btn-danger !py-1.5 !text-xs">
						Logout
					</button>
				</form>
			</div>
			<StatusPage />
		</main>
	);
};

export default page;
