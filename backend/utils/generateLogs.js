function generateLogs(count = 100) {
  const logs = [];

  const normalSources = [
    "192.168.1.10",
    "192.168.1.11",
    "192.168.1.12",
    "192.168.1.14",
  ];

  const endpoints = [
    "/api/users",
    "/api/products",
    "/api/orders",
    "/api/profile",
  ];

  // Normal logs
  for (let i = 0; i < count - 10; i++) {
    logs.push({
      timestamp: new Date(Date.now() - i * 60000),
      source:
        normalSources[Math.floor(Math.random() * normalSources.length)],
      eventType: "GET",
      severity: "INFO",
      status: 200,
      message: `GET ${
        endpoints[Math.floor(Math.random() * endpoints.length)]
      } - success`,
    });
  }

  // Anomaly 1
  for (let i = 0; i < 4; i++) {
    logs.push({
      timestamp: new Date(Date.now() - i * 30000),
      source: "10.0.0.55",
      eventType: "POST",
      severity: "ERROR",
      status: 500,
      message: "POST /api/payment - internal server error",
    });
  }

  // Anomaly 2
  for (let i = 3; i < 6; i++) {
    logs.push({
      timestamp: new Date(Date.now() - i * 45000),
      source: "203.0.113.7",
      eventType: "GET",
      severity: "WARNING",
      status: 403,
      message: "GET /admin - access denied",
    });
  }

  // Anomaly 3
  for (let i = 6; i < 10; i++) {
    logs.push({
      timestamp: new Date(Date.now() - i * 50000),
      source: "10.10.10.99",
      eventType: "GET",
      severity: "ERROR",
      status: 404,
      message: "GET /api/unknown - resource not found",
    });
  }

  return logs;
}

module.exports = generateLogs;