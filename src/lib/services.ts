"use client";

import { db } from './firebase';
import { collection, addDoc, getDocs, Timestamp, query, orderBy, limit, writeBatch, doc } from 'firebase/firestore';
import type { Transaction, Appointment } from './types';

// Type helpers for Firestore data
type FirestoreTransaction = Omit<Transaction, 'id' | 'date'> & { date: Timestamp };
type FirestoreAppointment = Omit<Appointment, 'id' | 'date'> & { date: Timestamp };

// Singleton promise to ensure initialization only runs once
let initializationPromise: Promise<void> | null = null;

async function initializeCollections() {
  // If the promise already exists, just return it
  if (initializationPromise) {
    return initializationPromise;
  }

  // Otherwise, create the promise and store it
  initializationPromise = (async () => {
    try {
      const transactionsCol = collection(db, 'transactions');
      const appointmentsCol = collection(db, 'appointments');

      const transactionsSnapshot = await getDocs(query(transactionsCol, limit(1)));
      const appointmentsSnapshot = await getDocs(query(appointmentsCol, limit(1)));

      const batch = writeBatch(db);
      let needsCommit = false;

      if (transactionsSnapshot.empty) {
        const initialTransaction: Omit<Transaction, 'id'> = {
          amount: 120,
          category: "Freelance",
          date: new Date(),
          description: "Desenvolvimento de site",
          type: "revenue",
        };
        const newTransactionRef = doc(transactionsCol);
        batch.set(newTransactionRef, initialTransaction);
        needsCommit = true;
        console.log('Initializing transactions collection...');
      }

      if (appointmentsSnapshot.empty) {
        const initialAppointment: Omit<Appointment, 'id'> = {
          title: "Reunião de Alinhamento",
          date: new Date(),
          startTime: "10:00",
          endTime: "11:00",
        };
        const newAppointmentRef = doc(appointmentsCol);
        batch.set(newAppointmentRef, initialAppointment);
        needsCommit = true;
        console.log('Initializing appointments collection...');
      }

      if (needsCommit) {
        await batch.commit();
        console.log('Collections initialized successfully.');
      }
    } catch (error) {
      console.error("Failed to initialize collections:", error);
      // Prevent app from getting stuck by re-throwing
      throw error; 
    }
  })();
  
  return initializationPromise;
}

// Ensure initialization is called on client-side
if (typeof window !== 'undefined') {
    initializeCollections();
}


// ====== Transaction Functions ======

export async function getTransactions(): Promise<Transaction[]> {
    await initializeCollections(); // Ensure initialization is complete
    const transactionsCol = collection(db, 'transactions');
    const q = query(transactionsCol, orderBy('date', 'desc'));
    const transactionSnapshot = await getDocs(q);
    const transactionList = transactionSnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreTransaction;
        return { 
            id: doc.id, 
            ...data,
            date: data.date.toDate() 
        };
    });
    return transactionList;
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    await initializeCollections();
    const docRef = await addDoc(collection(db, 'transactions'), transaction);
    return { id: docRef.id, ...transaction };
}


// ====== Appointment Functions ======

export async function getAppointments(): Promise<Appointment[]> {
    await initializeCollections(); // Ensure initialization is complete
    const appointmentsCol = collection(db, 'appointments');
    const q = query(appointmentsCol, orderBy('date', 'desc'));
    const appointmentSnapshot = await getDocs(q);
    const appointmentList = appointmentSnapshot.docs.map(doc => {
        const data = doc.data() as FirestoreAppointment;
        return { 
            id: doc.id, 
            ...data,
            date: data.date.toDate() 
        };
    });
    return appointmentList;
}

export async function addAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
    await initializeCollections();
    const docRef = await addDoc(collection(db, 'appointments'), appointment);
    return { id: docRef.id, ...appointment };
}
