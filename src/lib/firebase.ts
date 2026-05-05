import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Suas configurações extraídas do console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyChW9nJwSCkTe9Olv8bDN659bNjGncwfak",
  authDomain: "music-student-rpg-dashboard.firebaseapp.com",
  projectId: "music-student-rpg-dashboard",
  storageBucket: "music-student-rpg-dashboard.firebasestorage.app",
  messagingSenderId: "439820131477",
  appId: "1:439820131477:web:70bacf7180dfa3a40b0f9c"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Exporta o serviço de Autenticação para usarmos no Login
export const auth = getAuth(app);