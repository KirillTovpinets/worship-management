// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useCallback } from "react";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const useFirebase = () => {
  const uploadPDF = async (file: File, songId: string): Promise<string> => {
    const fileName = `songs/${songId}/lyrics.pdf`;
    const storageRef = ref(storage, fileName);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  };

  const uploadMP3 = async (file: File, songId: string): Promise<string> => {
    const fileName = `songs/${songId}/audio.mp3`;
    const storageRef = ref(storage, fileName);

    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return downloadURL;
  };

  const getPDFUrl = useCallback(
    async (songId: string): Promise<string | null> => {
      try {
        const fileName = `songs/${songId}/lyrics.pdf`;
        const storageRef = ref(storage, fileName);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch {
        return null;
      }
    },
    [],
  );

  const getMP3Url = useCallback(
    async (songId: string): Promise<string | null> => {
      try {
        const fileName = `songs/${songId}/audio.mp3`;
        const storageRef = ref(storage, fileName);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch {
        return null;
      }
    },
    [],
  );

  const deletePDF = async (songId: string): Promise<void> => {
    const fileName = `songs/${songId}/lyrics.pdf`;
    const storageRef = ref(storage, fileName);
    await deleteObject(storageRef);
  };

  const deleteMP3 = async (songId: string): Promise<void> => {
    const fileName = `songs/${songId}/audio.mp3`;
    const storageRef = ref(storage, fileName);
    await deleteObject(storageRef);
  };

  return {
    uploadPDF,
    uploadMP3,
    getPDFUrl,
    getMP3Url,
    deletePDF,
    deleteMP3,
  };
};
