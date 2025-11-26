import { Suspense } from "react"
import { URLs } from "@/utils/constants"
import { ping } from "@/utils";

async function HealthStatusCard({ url }: { url: string }) {
  let time = Date.now();
  const status = await ping(url)
  time = Date.now() - time;

  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        status.status === 'success'
          ? 'bg-green-50 border-green-500'
          : status.status === 'failed'
          ? 'bg-yellow-50 border-yellow-500'
          : 'bg-red-50 border-red-500'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="font-mono text-sm break-all text-black">{status.url.split('https://api.')[1]}</p>
          {status.statusCode && (
            <p className="text-xs text-gray-600 mt-1">
              Status Code: {status.statusCode} | Response Time: {time} ms
            </p>
          )}
          {status.error && (
            <p className="text-xs text-red-600 mt-1">
              Error: {status.error}
            </p>
          )}
        </div>
        <div className="ml-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              status.status === 'success'
                ? 'bg-green-500 text-white'
                : status.status === 'failed'
                ? 'bg-yellow-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {status.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  )
}

export async function StatusPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">API Health Status</h1>
      <div className="grid grid-cols-2 gap-4">
        {URLs.map((url) => (
          <Suspense 
            key={url} 
            fallback={
              <div className="p-4 rounded-lg border-2 border-gray-300 bg-gray-50 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-mono text-sm text-gray-500">{url.split('https://api.')[1]}</p>
                    <p className="text-xs text-gray-400 mt-1">Checking...</p>
                  </div>
                </div>
              </div>
            }
          >
            <HealthStatusCard url={url} />
          </Suspense>
        ))}
      </div>
    </div>
  )
}

export default StatusPage