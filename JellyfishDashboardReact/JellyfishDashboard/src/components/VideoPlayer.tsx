import { RefObject, useEffect, useRef } from "react";

type Props = {
  stream: MediaStream | null | undefined;
};

const VideoPlayer = ({ stream }: Props) => {
  const videoRef: RefObject<HTMLVideoElement> = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.srcObject = stream || null;
  }, [stream]);

  return (
    <div className="card card-compact w-96 bg-base-100 shadow-xl">
      <video autoPlay playsInline muted ref={videoRef} />
      <div className="card-body">
        <div className="card-actions justify-end"></div>
      </div>
    </div>
  );
};

export default VideoPlayer;
