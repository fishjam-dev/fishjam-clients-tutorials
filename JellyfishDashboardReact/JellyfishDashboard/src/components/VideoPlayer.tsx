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
    <div className="video-container">
      <video autoPlay playsInline muted ref={videoRef} />
    </div>
  );
};
<video />;

export default VideoPlayer;
