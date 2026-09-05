export const fetchApi = async (endpoint, options = {}) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const relativeUrl = `/api${cleanEndpoint}`;
  const directUrl = `http://localhost:5000/api${cleanEndpoint}`;

  try {
    const res = await fetch(relativeUrl, options);
    if (res.ok) return res;
    // Fallback to direct port 5000 if proxy failed
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return await fetch(directUrl, options);
    }
    return res;
  } catch (err) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return await fetch(directUrl, options);
    }
    throw err;
  }
};
