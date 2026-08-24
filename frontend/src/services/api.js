const API_URL = "http://localhost:5000/api/logs";

export const getLogs = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch logs");
  }

  return response.json();
};

export const explainAnomaly = async (id) => {
  const response = await fetch(`${API_URL}/${id}/explain`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to generate AI explanation");
  }

  return data;
};