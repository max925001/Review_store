export default async function handler(req, res) {
  // Read backend URL from Vercel environment variables
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    return res.status(500).json({ error: 'BACKEND_URL environment variable is not defined' });
  }

  // req.url includes the path and query parameters (e.g. /api/v1/auth/login?param=1)
  const targetUrl = `${backendUrl}${req.url}`;
  
  // Forward incoming headers, excluding Host/Connection/Content-Length
  const headers = new Headers();
  Object.entries(req.headers).forEach(([key, value]) => {
    const lowerKey = key.toLowerCase();
    if (lowerKey !== 'host' && lowerKey !== 'connection' && lowerKey !== 'content-length') {
      if (Array.isArray(value)) {
        value.forEach(v => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
    }
  });

  const fetchOptions = {
    method: req.method,
    headers,
    redirect: 'manual'
  };

  // Forward body payload for write requests
  if (req.method !== 'GET' && req.method !== 'HEAD' && req.body) {
    fetchOptions.body = typeof req.body === 'object' ? JSON.stringify(req.body) : req.body;
  }

  try {
    const response = await fetch(targetUrl, fetchOptions);
    
    // Set matching response status code
    res.status(response.status);

    // Forward headers from backend response, excluding compression and size headers
    response.headers.forEach((value, key) => {
      const lowerKey = key.toLowerCase();
      if (lowerKey === 'set-cookie') {
        // Safely extract multiple cookie headers using getSetCookie() (Node 18+)
        const rawCookies = response.headers.getSetCookie();
        res.setHeader('Set-Cookie', rawCookies);
      } else if (
        lowerKey !== 'content-encoding' &&
        lowerKey !== 'transfer-encoding' &&
        lowerKey !== 'content-length'
      ) {
        res.setHeader(key, value);
      }
    });

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const json = await response.json();
      res.json(json);
    } else {
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    }
  } catch (error) {
    res.status(500).json({ error: `Backend Proxy error: ${error.message}` });
  }
}
