import React from "react";

const VideoGrid = ({ localStream }) => {
  return (
    <div className="video-container" id="videoContainer">
      <div className="video-wrapper">
        <video id="video-local" autoPlay playsInline muted />
      </div>
      {/* Remote videos will be dynamically added here */}
    </div>
  );
};

export default VideoGrid;
