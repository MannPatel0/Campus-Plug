import asyncio
import websockets

async def handle_client(websocket, path):
    try:
        # Receive user ID
        user_id = await websocket.recv()
        print(f"Received user ID: {user_id}")

        # Optional: You can add more logic here if needed

    except websockets.exceptions.ConnectionClosed:
        print("Client disconnected")
    except Exception as e:
        print(f"Error processing request: {str(e)}")

async def start_server():
    server = await websockets.serve(handle_client, "localhost", 5555)
    print("WebSocket server started")
    await server.wait_closed()

# Run the server
if __name__ == "__main__":
    asyncio.run(start_server())
