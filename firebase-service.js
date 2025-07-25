// firebase-service.js
import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

export async function saveToFirebase(group, topic) {
  try {
    const docRef = await addDoc(collection(db, "temas_sorteados"), {
      grupo: group,
      tema: topic,
      timestamp: new Date()
    });
    console.log("Documento salvo com ID:", docRef.id);
  } catch (error) {
    console.error("Erro ao salvar documento:", error);
  }
}
