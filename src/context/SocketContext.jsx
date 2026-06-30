import { createContext, useContext, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { connectSocket, disconnectSocket } from "../services/socketService";

const SocketContext = createContext(null);

/**
 * SocketProvider - Manages WebSocket connection for real-time updates
 * 
 * Features:
 *   - Establishes Socket.IO connection when user authenticates
 *   - Automatically disconnects when user logs out
 *   - Handles connection errors and reconnection
 *   - Provides socket reference to all child components
 * 
 * Events Available:
 *   - lead:created, lead:updated, lead:deleted
 *   - customer:created, customer:updated
 *   - deal:moved, deal:updated
 *   - task:assigned, task:completed
 *   - notification:new
 *   - activity:created
 * 
 * Usage:
 *   <SocketProvider>
 *     <App />
 *   </SocketProvider>
 */
export function SocketProvider({ children }) {
  const { accessToken } = useAuth();
  const socketRef = useRef(null);

  /**
   * Connects/disconnects socket based on authentication status
   * Cleans up on unmount
   */
  useEffect(() => {
    if (!accessToken) {
      disconnectSocket();
      socketRef.current = null;
      return;
    }

    const socket = connectSocket(accessToken);
    socketRef.current = socket;

    socket.on("connect", () => console.log("[WS] Connected:", socket.id));

    socket.on("disconnect", () => console.log("[WS] Disconnected"));

    socket.on("connect_error", (err) =>
      console.error("[WS] Error:", err.message),
    );

    return () => {
      disconnectSocket();
      socketRef.current = null;
    };
  }, [accessToken]);

  return (
    <SocketContext.Provider value={socketRef}>
      {children}
    </SocketContext.Provider>
  );
}
/**
 * useSocketContext - Hook to access Socket.IO connection
 * Returns a ref to the socket instance
 * @returns {React.MutableRefObject<Socket|null>} Socket reference or null if disconnected
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useSocketContext() {
  return useContext(SocketContext);
}
