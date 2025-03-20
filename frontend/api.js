const API_URL = "https://sql-db-platform-1.onrender.com";

export const apiRequest = async (endpoint, method = "GET", data = null) => {
  const url = `${API_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  return await response.json();
};
