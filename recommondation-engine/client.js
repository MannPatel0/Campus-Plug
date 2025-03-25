const net = require("net");

// Function to get recommendations from the Python server
function getRecommendations(userId) {
  const client = new net.Socket();

  // Connect to the server on localhost at port 9999
  client.connect(9999, "localhost", function () {
    console.log(`Connected to server, sending user_id: ${userId}`);

    // Send the user_id in JSON format
    const message = JSON.stringify({ user_id: userId });
    client.write(message);
  });

  // Listen for data from the server
  client.on("data", function (data) {
    const recommendations = JSON.parse(data.toString());
    console.log(
      `Recommendations for User ${userId}:`,
      recommendations.recommendations,
    );

    // Close the connection after receiving the response
    client.destroy();
  });

  // Handle connection errors
  client.on("error", function (error) {
    console.error("Connection error:", error.message);
  });

  // Handle connection close
  client.on("close", function () {
    console.log(`Connection to server closed for User ${userId}`);
  });
}

// Function to simulate multiple users requesting recommendations
function simulateClients() {
  for (let i = 1; i <= 5; i++) {
    setTimeout(() => {
      getRecommendations(i); // Simulate clients with IDs 1 to 5
    }, i * 1000); // Stagger requests every second
  }
}

simulateClients();
