import socket
import threading
import json

# Sample recommendations function
def get_recommendations(user_id):
    # This is a mock function. Replace it with your actual recommendation logic.
    return {"recommendations": [f"Product {user_id} - Item 1", f"Product {user_id} - Item 2", f"Product {user_id} - Item 3"]}

# Handle client connection
def handle_client(client_socket, client_address):
    print(f"New connection from {client_address}")

    # Receive the client request (user_id)
    request = client_socket.recv(1024).decode("utf-8")
    if request:
        data = json.loads(request)
        user_id = data.get("user_id")

        # Get recommendations for the user
        recommendations = get_recommendations(user_id)

        # Send the response back to the client
        client_socket.send(json.dumps(recommendations).encode("utf-8"))

    # Close the connection after sending the response
    client_socket.close()

# Start the server to handle multiple clients
def start_server():
    server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server.bind(("0.0.0.0", 9999))  # Bind to all interfaces on port 9999
    server.listen(5)
    print("Server listening on port 9999...")

    while True:
        client_socket, client_address = server.accept()
        client_thread = threading.Thread(target=handle_client, args=(client_socket, client_address))
        client_thread.start()

# Run the server
start_server()
