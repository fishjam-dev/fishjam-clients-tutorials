import React, { useEffect, useState } from "react";
import { create } from "@jellyfish-dev/react-client-sdk/experimental";
import VideoPlayer from "./VideoPlayer";
import { SCREEN_SHARING_MEDIA_CONSTRAINTS } from "@jellyfish-dev/browser-media-utils";
import { JellyfishClient, Peer } from "@jellyfish-dev/ts-client-sdk";
import { SignalingUrl } from "@jellyfish-dev/react-client-sdk/.";

// Example metadata types for peer and track
// You can define your own metadata types just make sure they are serializable
export type PeerMetadata = {
  name: string;
};

export type TrackMetadata = {
  type: "camera" | "screen";
};

// This is the address of the Jellyfish backend. Change the local IP to yours. We
// strongly recommend setting this as an environment variable, we hardcoded it here
// for simplicity.
const JELLYFISH_URL = { protocol: "ws", host: "localhost:4002", path: "/socket/peer/websocket" } as SignalingUrl;

// Create a Membrane client instance
const client = create<PeerMetadata, TrackMetadata>();

export const App = () => {
  // Create the connect function
  // Create a state to store the peer token used to connect to the room
  const [peerToken, setPeerToken] = useState<string>("");
  const [connected, setConnected] = useState<boolean>(false);
  const connect = client.useConnect();
  const disconnect = client.useDisconnect();
  // Get the full state
  const remoteTracks = client.useSelector((snapshot) => Object.values(snapshot?.remote || {}));

  // Get the webrtcApi reference
  const webrtcApi = client.useSelector((snapshot) => snapshot.connectivity.api);

  // Get jellyfish client reference
  const jellyfishClient = client.useSelector((snapshot) => snapshot.connectivity.client);

  useEffect(() => {
    async function startScreenSharing() {
      // Check if webrtc is initialized
      if (!webrtcApi) return console.error("webrtc is not initialized");

      // Create a new MediaStream to add tracks to
      const localStream: MediaStream = new MediaStream();

      // Get screen sharing MediaStream
      const screenStream = await navigator.mediaDevices.getDisplayMedia(SCREEN_SHARING_MEDIA_CONSTRAINTS);

      // Add tracks from screen sharing MediaStream to local MediaStream
      screenStream.getTracks().forEach((track) => localStream.addTrack(track));

      // Add local MediaStream to webrtc
      localStream.getTracks().forEach((track) => webrtcApi.addTrack(track, localStream, { type: "screen" }));
    }

    const onJoinSuccess = (peerId: string, peersInRoom: Peer[]) => {
      console.log("join success");
      console.log("peerId", peerId);
      console.log("peersInRoom", peersInRoom);

      // To start broadcasting your media you will need source of MediaStream like camera, microphone or screen
      // In this example we will use screen sharing
      startScreenSharing();
    };

    // You can listen to events emitted by the client
    jellyfishClient?.on("joined", onJoinSuccess);

    return () => {
      // Remove the event listener when the component unmounts
      jellyfishClient?.off("joined", onJoinSuccess);
    };
  }, [jellyfishClient, webrtcApi]);

  // Render the remote tracks from other peers
  return (
    <>
      <div>
        <input
          type="text"
          value={peerToken}
          onChange={(e) => setPeerToken(e.target.value)}
          placeholder="Enter peer token"
        />
        {!connected ? (
          <button
            disabled={peerToken === ""}
            onClick={() => {
              connect({
                peerMetadata: { name: "test" },
                token: peerToken,
                signaling: JELLYFISH_URL,
              });
              setConnected(true);
            }}
          >
            Connect
          </button>
        ) : (
          <button
            onClick={() => {
              disconnect();
              setConnected(false);
            }}
          >
            Disconnect
          </button>
        )}
      </div>

      <div className="flex flex-col">
        {remoteTracks.map(({ tracks }) => {
          return Object.values(tracks || {}).map(({ stream, trackId }) => (
            <VideoPlayer key={trackId} stream={stream} /> // Simple component to render a video element
          ));
        })}
      </div>
    </>
  );
};
