import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import { useState, useEffect, useRef } from "react";

const firebaseConfig = {
  apiKey: "AIzaSyA1lmP2w8kvfttndtEg-S9odPFzE1Z8oOE",
  authDomain: "vds-database.firebaseapp.com",
  projectId: "vds-database",
  storageBucket: "vds-database.appspot.com",
  messagingSenderId: "513241215688",
  appId: "1:513241215688:web:f688a4c298f61b5304ebfd",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getVersionAndUpdateCount() {
  const docRef = doc(db, "contentdensity", "1Qrbz5A1jHuO1PgypIo3");
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    let currentCount = docSnap.data().user || 0; // Ensure there's a default value
    const versions = ["A", "B", "C"];
    const version = versions[currentCount % 3];

    setTimeout(async () => {
      await updateDoc(docRef, { user: currentCount + 1 });
    }, 1000); // Update count after 1 second

    return version;
  } else {
    console.error("No such document!");
    return null;
  }
}

function VideoComponent({ videoSource, redirectUrl }) {
  const videoRef = useRef(null);
  const videoPlayedKey = "vdsresearchtestversion5";
  const [hasVideoBeenPlayed, setHasVideoBeenPlayed] = useState(
    localStorage.getItem(videoPlayedKey) === "true"
  );

  useEffect(() => {
    const videoElement = videoRef.current;
    if (hasVideoBeenPlayed) {
      window.location.href = redirectUrl;
    } else if (videoElement) {
      videoElement.autoplay = true;
      videoElement.controls = true;
      videoElement.volume = 1; // Set volume to max
      videoElement.addEventListener("ended", () => {
        localStorage.setItem(videoPlayedKey, "true");
        setHasVideoBeenPlayed(true);
        window.location.href = redirectUrl;
      });
    }
  }, [hasVideoBeenPlayed, redirectUrl]);

  return (
    <>
      <style>{`
        .video-container {
          position: fixed;
          top: 10px;
          left: 10px;
          right: 10px;
          bottom: 10px;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        #yourVideoElementId {
          max-width: calc(100% - 20px);
          max-height: calc(100% - 20px);
          object-fit: cover;
        }
      `}</style>
      <div className="video-container">
        {hasVideoBeenPlayed ? (
          <a href={redirectUrl}>Redirecting To New Webpage</a>
        ) : (
          <video
            ref={videoRef}
            id="yourVideoElementId"
            src={videoSource}
            autoPlay
            controlslist="nodownload"
          />
        )}
      </div>
    </>
  );
}

export default function FireBaseABTestComponent() {
  const [version, setVersion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      getVersionAndUpdateCount().then(setVersion);
    }, 1000); // 1-second delay before updating Firebase

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (version) {
      const loadTimer = setTimeout(() => {
        setIsLoading(false);
      }, 2000); // 2-second additional delay

      return () => clearTimeout(loadTimer);
    }
  }, [version]);

  const pageProps = {
    A: {
      videoSource:
        "https://zeshuzhu.com/wp-content/uploads/2024/04/VDSDensityLow.mp4",
      redirectUrl:
        "https://forms.office.com/e/d461YWmnpq",
    }, // Low
    B: {
      videoSource:
        "https://zeshuzhu.com/wp-content/uploads/2024/04/VDSDensityMedium.mp4",
      redirectUrl:
        "https://forms.office.com/e/NqLcd2m8mz",
    }, // Medium
    C: {
      videoSource:
        "https://zeshuzhu.com/wp-content/uploads/2024/04/VDSDensityHigh.mp4",
      redirectUrl:
        "https://forms.office.com/e/YJxm3A6iLQ",
    }, // High
  };

  if (isLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#282c34",
          color: "white",
          flexDirection: "column",
          fontSize: "20px",
          fontFamily: "Arial, sans-serif",
          textAlign: "center",
        }}
      >
        <div className="equalizer-container">
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
        <br />
        Content density refers to the ratio of content on a page in relation to the size of that same page. <br />
        The video is loading...
        <style>{`
          .equalizer-container {
            display: flex;
            justify-content: center;
            align-items: flex-end;
            height: 100px;
            width: 200px;
          }
          .bar {
            width: 10px;
            height: 20px;
            margin: 0 2px;
            background-color: #3498db;
            animation: bounce 1s ease-in-out infinite;
          }
          .bar:nth-child(1) { animation-delay: 0s; }
          .bar:nth-child(2) { animation-delay: 0.1s; }
          .bar:nth-child(3) { animation-delay: 0.2s; }
          .bar:nth-child(4) { animation-delay: 0.3s; }
          .bar:nth-child(5) { animation-delay: 0.4s; }
          .bar:nth-child(6) { animation-delay: 0.5s; }
          .bar:nth-child(7) { animation-delay: 0.6s; }
          .bar:nth-child(8) { animation-delay: 0.7s; }
          .bar:nth-child(9) { animation-delay: 0.8s; }
          .bar:nth-child(10) { animation-delay: 0.9s; }
          @keyframes bounce {
            0%, 100% { transform: scaleY(0.1); }
            50% { transform: scaleY(1.5); }
          }
        `}</style>
      </div>
    );
  }

  return <VideoComponent {...pageProps[version]} />;
}
