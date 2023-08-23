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
    <div className=" w-96 h-64 shadow-xl">
      <video autoPlay playsInline muted ref={videoRef} />
      <div className="card-body">
        <div className="card-actions justify-end"></div>
      </div>
    </div>
  );
};

export default VideoPlayer;
