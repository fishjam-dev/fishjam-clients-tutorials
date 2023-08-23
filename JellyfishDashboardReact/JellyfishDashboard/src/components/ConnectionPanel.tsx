import { CreateJellyfishClient, SignalingUrl } from "@jellyfish-dev/react-client-sdk/.";
import React, { useEffect, useState } from "react";
import { PeerMetadata, TrackMetadata } from "./App";

type Props = {
  client: CreateJellyfishClient<PeerMetadata, TrackMetadata>;
};

const JELLYFISH_URL = { protocol: "ws", host: "localhost:4002", path: "/socket/peer/websocket" } as SignalingUrl;
export const ConnectionPanel = ({ client }: Props) => {
  const [connected, setConnected] = useState<boolean>(false);
  const [peerToken, setPeerToken] = useState<string>("");
  const connect = client.useConnect();
  const disconnect = client.useDisconnect();

  return (
    <div>
      {!connected ? (
        <button
          onClick={() =>
            connect({
              peerMetadata: { name: "test" },
              token: peerToken,
              signaling: JELLYFISH_URL,
            })
          }
        >
          Connect
        </button>
      ) : (
        <button onClick={() => disconnect()}>Disconnect</button>
      )}
    </div>
  );
};
