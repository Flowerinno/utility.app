type HealthStatus = {
  url: string
  status: 'success' | 'failed' | 'error'
  statusCode?: number
  error?: string
}

export async function ping(url: string): Promise<HealthStatus> {
  try {
    const response = await fetch(url)
    if (response.ok) {
      return { url, status: 'success', statusCode: response.status }
    } else {
      return { url, status: 'failed', statusCode: response.status }
    }
  } catch (error) {
    return { 
      url, 
      status: 'error', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }
  }
}