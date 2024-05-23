import { useState } from "react";
import { create, SCREEN_SHARING_MEDIA_CONSTRAINTS } from "@jellyfish-dev/react-client-sdk";
import VideoPlayer from "./VideoPlayer.tsx";

// Example metadata types for peer and track
// You can define your metadata types just make sure they are serializable
type PeerMetadata = {
  name: string;
};

type TrackMetadata = {
  type: "camera" | "screen";
};

// Create a Fishjam client instance
// Since we will use this context outside of the component we need to export it
export const {
  useStatus, // Hook to check the status of the connection
  useTracks, // Hook to get the tracks from the server
  useClient, // Hook to get the client reference
  useConnect, // Hook to connect to the server
  useDisconnect, // Hook to disconnect from the server
  JellyfishContextProvider, // Context provider
} = create<PeerMetadata, TrackMetadata>();

export const App = () => {
  // Create a state to store the peer token
  const [token, setToken] = useState("");
  // Use the built-in hook to check the status of the connection
  const status = useStatus();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const tracks = useTracks()

  // Get the webrtcApi reference
  const client = useClient();

  function startScreenSharing() {
    // Get screen sharing MediaStream
    navigator.mediaDevices.getDisplayMedia(SCREEN_SHARING_MEDIA_CONSTRAINTS).then((screenStream) => {
      // Add local MediaStream to webrtc
      screenStream.getTracks().forEach((track) => client.addTrack(track, screenStream, { type: "screen" }));
    });
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <input
        className="input-field"
        value={token}
        onChange={(e) => setToken(() => e?.target?.value)}
        placeholder="token"
      />
      <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        <button
          className="button"
          disabled={token === "" || status === "joined"} // simple check to avoid errors
          onClick={() => {
            connect({
              peerMetadata: { name: "John Doe" }, // example metadata
              token: token,
            });
          }}
        >
          Connect
        </button>
        <button
          className="button"
          disabled={status !== "joined"}
          onClick={() => {
            disconnect();
          }}
        >
          Disconnect
        </button>
        <button
          className="button"
          disabled={status !== "joined"}
          onClick={() => {
            startScreenSharing();
          }}
        >
          Start screen share
        </button>
        <span className="span-status">Status: {status}</span>
      </div>
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center", // To align items in the center
        gap: "20px",
      }}
      >
        {Object.values(tracks).map(({ stream, trackId }) => (
          <VideoPlayer key={trackId} stream={stream}/> // pass the stream to the component
        ))}
      </div>
    </div>
  );
};
