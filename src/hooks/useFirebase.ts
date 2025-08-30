// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  deleteObject,
  getDownloadURL,
  getMetadata,
  getStorage,
  listAll,
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

export interface FileInfo {
  id: string;
  name: string;
  url: string;
  size: number;
  uploadedAt: Date;
}

export const useFirebase = () => {
  // Single file uploads (keeping for backward compatibility)
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

  // Multiple file uploads
  const uploadMultiplePDFs = async (
    files: File[],
    songId: string,
  ): Promise<FileInfo[]> => {
    const uploadPromises = files.map(async (file) => {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const fileName = `songs/${songId}/pdfs/${fileId}-${file.name}`;
      const storageRef = ref(storage, fileName);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        id: fileId,
        name: file.name,
        url: downloadURL,
        size: file.size,
        uploadedAt: new Date(),
      };
    });

    return Promise.all(uploadPromises);
  };

  const uploadMultipleMP3s = async (
    files: File[],
    songId: string,
  ): Promise<FileInfo[]> => {
    const uploadPromises = files.map(async (file) => {
      const fileId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const fileName = `songs/${songId}/mp3s/${fileId}-${file.name}`;
      const storageRef = ref(storage, fileName);

      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      return {
        id: fileId,
        name: file.name,
        url: downloadURL,
        size: file.size,
        uploadedAt: new Date(),
      };
    });

    return Promise.all(uploadPromises);
  };

  // Get multiple files
  const getMultiplePDFs = useCallback(
    async (songId: string): Promise<FileInfo[]> => {
      try {
        const folderRef = ref(storage, `songs/${songId}/pdfs/`);
        const result = await listAll(folderRef);

        const filePromises = result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          const fileName = item.name.split("-").slice(1).join("-"); // Remove the ID prefix
          const fileId = item.name.split("-")[0];

          return {
            id: fileId,
            name: fileName,
            url,
            size: metadata.size,
            uploadedAt: new Date(metadata.timeCreated),
          };
        });

        return Promise.all(filePromises);
      } catch {
        return [];
      }
    },
    [],
  );

  const getMultipleMP3s = useCallback(
    async (songId: string): Promise<FileInfo[]> => {
      try {
        const folderRef = ref(storage, `songs/${songId}/mp3s/`);
        const result = await listAll(folderRef);

        const filePromises = result.items.map(async (item) => {
          const url = await getDownloadURL(item);
          const metadata = await getMetadata(item);
          const fileName = item.name.split("-").slice(1).join("-"); // Remove the ID prefix
          const fileId = item.name.split("-")[0];

          return {
            id: fileId,
            name: fileName,
            url,
            size: metadata.size,
            uploadedAt: new Date(metadata.timeCreated),
          };
        });

        return Promise.all(filePromises);
      } catch {
        return [];
      }
    },
    [],
  );

  // Delete multiple files
  const deletePDF = async (songId: string, fileId?: string): Promise<void> => {
    if (fileId) {
      // Delete specific file
      const folderRef = ref(storage, `songs/${songId}/pdfs/`);
      const result = await listAll(folderRef);
      const fileToDelete = result.items.find((item) =>
        item.name.startsWith(fileId),
      );
      if (fileToDelete) {
        await deleteObject(fileToDelete);
      }
    } else {
      // Delete single PDF (backward compatibility)
      const fileName = `songs/${songId}/lyrics.pdf`;
      const storageRef = ref(storage, fileName);
      await deleteObject(storageRef);
    }
  };

  const deleteMP3 = async (songId: string, fileId?: string): Promise<void> => {
    if (fileId) {
      // Delete specific file
      const folderRef = ref(storage, `songs/${songId}/mp3s/`);
      const result = await listAll(folderRef);
      const fileToDelete = result.items.find((item) =>
        item.name.startsWith(fileId),
      );
      if (fileToDelete) {
        await deleteObject(fileToDelete);
      }
    } else {
      // Delete single MP3 (backward compatibility)
      const fileName = `songs/${songId}/audio.mp3`;
      const storageRef = ref(storage, fileName);
      await deleteObject(storageRef);
    }
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

  return {
    uploadPDF,
    uploadMP3,
    uploadMultiplePDFs,
    uploadMultipleMP3s,
    getPDFUrl,
    getMP3Url,
    getMultiplePDFs,
    getMultipleMP3s,
    deletePDF,
    deleteMP3,
  };
};
