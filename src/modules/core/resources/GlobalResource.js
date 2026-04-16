const API_BASE_URL = "https://localhost:44360/";
// const API_BASE_URL = "http://sparrow1989-001-site1.anytempurl.com/";

// const getHeaders = (isJson = true, token = null) => {
//   const headers = isJson ? { "Content-Type": "application/json" } : {};

//   if (token) {
//     headers["Authorization"] = `Bearer ${token}`;
//   }

//   return headers;
// };

const getHeaders = (isJson = true) => {
  // const username = "11273280"; // Reemplaza con tu usuario
  // const password = "60-dayfreetrial";   // Reemplaza con tu contraseña
  // const credentials = `${username}:${password}`;
  // const encoded = btoa(credentials);

  const headers = isJson ? { "Content-Type": "application/json" } : {};
  // headers["Authorization"] = `Basic ${encoded}`;

  return headers;
};

const handleResponse = async (response) => {

  const contentType = response.headers.get("Content-Type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : null;

  console.log(JSON.stringify(response));
  return {
    status: response.status,
    data,
  };
};

const apiService = {
  get: async (endpoint, token = null) => {
    console.log(`${API_BASE_URL}${endpoint}`);
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "GET",
      headers: getHeaders(true, token),
    });
    return handleResponse(res);
  },

  post: async (endpoint, body, token = null) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: getHeaders(true, token),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  put: async (endpoint, body, token = null) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "PUT",
      headers: getHeaders(true, token),
      body: JSON.stringify(body),
    });
    return handleResponse(res);
  },

  del: async (endpoint, token = null) => {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "DELETE",
      headers: getHeaders(true, token),
    });
    return handleResponse(res);
  },
};

export default apiService;
