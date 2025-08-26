import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import Webcam from 'react-webcam';

const FaceEmotionDetector = ({ onDetect }) => {
  const webcamRef = useRef(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detecting, setDetecting] = useState(true); // detect only once

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = '/models';
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
      setModelsLoaded(true);
    };
    loadModels();
  }, []);

  const detectEmotion = async () => {
    if (
      detecting &&
      webcamRef.current &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const detections = await faceapi
        .detectSingleFace(video, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      if (detections?.expressions) {
        const emotion = Object.entries(detections.expressions).reduce(
          (max, curr) => (curr[1] > max[1] ? curr : max)
        )[0];

        onDetect(emotion); // callback to App
        setDetecting(false); // disable further detection
      }
    }
  };

  useEffect(() => {
    if (!modelsLoaded || !detecting) return;

    const interval = setInterval(() => {
      detectEmotion();
    }, 3000);

    return () => clearInterval(interval);
  }, 
);

  const handleStartAgain = () => {
    setDetecting(true);
  };

  return (
    <div className="absolute top-4 right-4 flex flex-col items-center gap-2">
      <div className="w-44 border-2 border-indigo-500 rounded-xl overflow-hidden">
        <Webcam
          ref={webcamRef}
          audio={false}
          height={160}
          width={200}
          screenshotFormat="image/jpeg"
          videoConstraints={{ facingMode: 'user' }}
        />
      </div>
      <button
        onClick={handleStartAgain}
        className="mt-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm transition"
      >
        🔄 Start Again
      </button>
    </div>
  );
};

export default FaceEmotionDetector;
