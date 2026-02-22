import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDyNWUJEAxhrL2MmHYiNh2AMPhlqgT7aIc",
  authDomain: "suolala-meme-wall.firebaseapp.com",
  projectId: "suolala-meme-wall",
  storageBucket: "suolala-meme-wall.appspot.com",
  messagingSenderId: "183627335961",
  appId: "1:183627335961:web:b324a08fde681be2f1dd88"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
