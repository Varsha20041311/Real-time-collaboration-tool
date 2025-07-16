// Import necessary hooks and socket.io-client for WebSocket communication
import React, { useEffect, useRef } from "react";
import io from "socket.io-client";

// Connect to the Socket.IO server running on port 5001
const socket = io("http://localhost:5001");

function App() {
  // useRef hook to hold a reference to the canvas element
  const canvasRef = useRef();

  // Setup drawing and socket listener on component mount
  useEffect(() => {
    const canvas = canvasRef.current;         // Get canvas DOM element
    const ctx = canvas.getContext("2d");      // Get 2D drawing context

    // Function to draw a small square at the given x, y coordinate
    const draw = ({ x, y }) => {
      ctx.fillRect(x, y, 2, 2);               // Draw a 2x2 pixel square
    };

    // Listen for "drawing" events from the server and call draw function
    socket.on("drawing", draw);

    // Cleanup: remove listener on component unmount
    return () => {
      socket.off("drawing");
    };
  }, []);

  // Function to handle user's drawing and emit coordinates to server
  const handleDraw = (e) => {
    // Get canvas boundaries
    const rect = canvasRef.current.getBoundingClientRect();

    // Calculate x, y coordinates relative to canvas
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Send the drawing coordinates to server
    socket.emit("drawing", { x, y });
  };

  return (
    <div>
      <h2>Real-time Whiteboard</h2>

      {/* Canvas for drawing */}
      <canvas
        ref={canvasRef}                   // Reference to access canvas element
        width={800}
        height={500}
        style={{ border: "1px solid black" }}  // Border for visibility
        onMouseMove={(e) => {
          // Only draw when mouse button is pressed (buttons === 1)
          if (e.buttons === 1) {
            handleDraw(e);
          }
        }}
      />
    </div>
  );
}

export default App;
