// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
 apiKey: "AIzaSyCXKUpy5bXPPNrstc6ayHQTcXLjbwsNnEw",
  authDomain: "tasks-b52c5.firebaseapp.com",
  projectId: "tasks-b52c5",
  storageBucket: "tasks-b52c5.firebasestorage.app",
  messagingSenderId: "768498658017",
  appId: "1:768498658017:web:b1fb529cdd07669e22e5a0",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, addDoc };
