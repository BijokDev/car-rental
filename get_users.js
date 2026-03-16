import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyD1u9jVuJ2B9IAyZCvPvi2VFvEUXEL8EMw",
    authDomain: "photocollection-aaacb.firebaseapp.com",
    projectId: "photocollection-aaacb",
    storageBucket: "photocollection-aaacb.firebasestorage.app",
    messagingSenderId: "1098153185069",
    appId: "1:1098153185069:web:d3dfe08093d65662c88da4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkUsers() {
  const querySnapshot = await getDocs(collection(db, "car-rental-users"));
  console.log("Found users: " + querySnapshot.size);
  querySnapshot.forEach((doc) => {
    console.log(`${doc.id} => ${JSON.stringify(doc.data())}`);
  });
}

checkUsers().catch(console.error);
