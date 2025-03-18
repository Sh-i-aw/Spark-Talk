import {initializeApp} from 'firebase/app'
import { getFirestore } from 'firebase/firestore';

const newFirebaseConfig = {
    apiKey: import.meta.env.VITE_FIRESTORE_API_KEY,
    authDomain: import.meta.env.VITE_FIRESTORE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIRESTORE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIRESTORE_STORAGE_BUCKET,
};

const newApp = initializeApp(newFirebaseConfig, 'newApp');
const newDb = getFirestore(newApp);

export {newApp, newDb};