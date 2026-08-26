 const API_URL = "https://smart-log-system-2.onrender.com/api/logs";

// const API_URL = "http://localhost:5000/api/logs";

// page ke liye bas , page = 1, limit = 10 ,ye dala hai in below ()
export const getLogs = async (page = 1, limit = 10) => {
  // const response = await fetch(API_URL);   // page ke liye ye band kiya

    const response = await fetch(
    `${API_URL}?page=${page}&limit=${limit}`
  );


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