import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, onSnapshot, query, orderBy, setDoc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyACYdy49klq_Fnj8KL4xWg7w7wRFskJ2nY",
  authDomain: "budget-app-2bc56.firebaseapp.com",
  projectId: "budget-app-2bc56",
  storageBucket: "budget-app-2bc56.firebasestorage.app",
  messagingSenderId: "693773487732",
  appId: "1:693773487732:web:6521929f84df203ace4b21",
  measurementId: "G-ZGWFZNZYCB"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const registerWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

const loginWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw error;
  }
};

const signInWithGoogle = async () => {
    try {
        const userCredential = await signInWithPopup(auth, googleProvider);
        return userCredential.user;
    } catch (error) {
        throw error;
    }
};

const logout = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    throw error;
  }
};

const addTransaction = async (userId, transaction) => {
  try {
    const transactionsCollection = collection(db, 'users', userId, 'transactions');
    await addDoc(transactionsCollection, transaction);
  } catch (error) {
    throw error;
  }
};

const deleteTransaction = async (userId, transactionId) => {
    try {
        const transactionDoc = doc(db, 'users', userId, 'transactions', transactionId);
        await deleteDoc(transactionDoc);
    } catch (error) {
        throw error;
    }
};

const getTransactions = (userId, setTransactions) => {
    if (!userId) {
        setTransactions([]);
        return () => {};
    }
    const transactionsCollection = collection(db, 'users', userId, 'transactions');
    const q = query(transactionsCollection, orderBy('createdAt', 'desc'));
    return onSnapshot(q, (querySnapshot) => {
        const transactions = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        setTransactions(transactions);
    });
};

const setUserSettings = async (userId, settings) => {
    try {
        const userDoc = doc(db, 'users', userId);
        await setDoc(userDoc, { settings }, { merge: true });
    } catch (error) {
        throw error;
    }
};

const getUserSettings = async (userId) => {
    try {
        const userDoc = doc(db, 'users', userId);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
            return docSnap.data().settings || {};
        } else {
            return {};
        }
    } catch (error) {
        console.error("Error fetching user settings:", error);
        return {};
    }
};


export { auth, registerWithEmailAndPassword, loginWithEmailAndPassword, signInWithGoogle, logout, addTransaction, getTransactions, deleteTransaction, firebaseConfig, setUserSettings, getUserSettings };
