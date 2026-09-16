import { initializeApp, getApps } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAxqGgn6mEZZ4qa15zVMn2u79SaDIcn30I",
  authDomain: "efconte-app.firebaseapp.com",
  projectId: "efconte-app",
  storageBucket: "efconte-app.firebasestorage.app",
  messagingSenderId: "500664993080",
  appId: "1:500664993080:web:4056006f8042bb099a222d",
  measurementId: "G-PM9SS4FH5F"
};

// Inicializa o Firebase apenas se não houver nenhuma instância ativa (evita duplicação no Next.js)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const storage = getStorage(app);

export { app, storage };
