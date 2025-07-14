"use client";

import { db } from './firebase';
import { collection, addDoc, getDocs, Timestamp, query, orderBy, writeBatch, doc, getCountFromServer } from 'firebase/firestore';
import type { Transaction, Appointment } from './types';

// Flag to ensure initialization only runs once per session
let isInitialized = false;

async function initializeData() {
    // If initialization has already been attempted (successfully or not), skip.
    if (isInitialized) {
        return;
    }
    isInitialized = true; // Set immediately to prevent multiple attempts

    try {
        const transactionsCol = collection(db, 'transactions');
        const appointmentsCol = collection(db, 'appointments');

        const transactionsSnapshot = await getCountFromServer(transactionsCol);
        const appointmentsSnapshot = await getCountFromServer(appointmentsCol);
        
        const batch = writeBatch(db);
        let needsCommit = false;

        if (transactionsSnapshot.data().count === 0) {
            console.log('Initializing transactions collection with sample data...');
            const initialTransaction: Omit<Transaction, 'id'> = {
                amount: 120,
                category: "Freelance",
                date: new Date(),
                description: "Desenvolvimento de site",
                type: "revenue",
            };
            const newTransactionRef = doc(transactionsCol);
            batch.set(newTransactionRef, {
                ...initialTransaction,
                date: Timestamp.fromDate(initialTransaction.date)
            });
            needsCommit = true;
        }

        if (appointmentsSnapshot.data().count === 0) {
            console.log('Initializing appointments collection with sample data...');
            const initialAppointment: Omit<Appointment, 'id'> = {
                title: "Reunião de Alinhamento",
                date: new Date(),
                startTime: "10:00",
                endTime: "11:00",
            };
            const newAppointmentRef = doc(appointmentsCol);
            batch.set(newAppointmentRef, {
                ...initialAppointment,
                date: Timestamp.fromDate(initialAppointment.date)
            });
            needsCommit = true;
        }

        if (needsCommit) {
            await batch.commit();
            console.log('Initial data committed to Firestore.');
        }

    } catch (error) {
        console.error("Failed to initialize collections:", error);
    }
}


// ====== Transaction Functions ======

export async function getTransactions(): Promise<Transaction[]> {
    await initializeData();
    const transactionsCol = collection(db, 'transactions');
    const q = query(transactionsCol, orderBy('date', 'desc'));
    const transactionSnapshot = await getDocs(q);
    const transactionList = transactionSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
            date: (data.date as Timestamp).toDate() 
        } as Transaction;
    });
    return transactionList;
}

export async function addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const transactionWithTimestamp = {
        ...transaction,
        // Ensure date is converted to Firestore Timestamp before saving
        date: Timestamp.fromDate(new Date(transaction.date))
    };
    const docRef = await addDoc(collection(db, 'transactions'), transactionWithTimestamp);
    // Return the original transaction object with the new ID
    return { id: docRef.id, ...transaction };
}


// ====== Appointment Functions ======

export async function getAppointments(): Promise<Appointment[]> {
    await initializeData();
    const appointmentsCol = collection(db, 'appointments');
    const q = query(appointmentsCol, orderBy('date', 'desc'));
    const appointmentSnapshot = await getDocs(q);
    const appointmentList = appointmentSnapshot.docs.map(doc => {
        const data = doc.data();
        return { 
            id: doc.id, 
            ...data,
            date: (data.date as Timestamp).toDate() 
        } as Appointment;
    });
    return appointmentList;
}

export async function addAppointment(appointment: Omit<Appointment, 'id'>): Promise<Appointment> {
     const appointmentWithTimestamp = {
        ...appointment,
        // Ensure date is converted to Firestore Timestamp before saving
        date: Timestamp.fromDate(new Date(appointment.date))
    };
    const docRef = await addDoc(collection(db, 'appointments'), appointmentWithTimestamp);
    // Return the original appointment object with the new ID
    return { id: docRef.id, ...appointment };
}
