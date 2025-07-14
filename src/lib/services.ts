
"use client";

import { db, auth } from './firebase';
import { collection, addDoc, getDocs, Timestamp, query, orderBy, writeBatch, doc, getCountFromServer, where } from 'firebase/firestore';
import type { Transaction, Appointment } from './types';

// Flag to ensure initialization only runs once per session
let isInitialized = false;

async function initializeData(userId: string) {
    // If initialization has already been attempted (successfully or not), skip.
    if (isInitialized) {
        return;
    }
    isInitialized = true; // Set immediately to prevent multiple attempts

    try {
        const transactionsQuery = query(collection(db, 'transactions'), where('userId', '==', userId));
        const appointmentsQuery = query(collection(db, 'appointments'), where('userId', '==', userId));

        const transactionsSnapshot = await getCountFromServer(transactionsQuery);
        const appointmentsSnapshot = await getCountFromServer(appointmentsQuery);
        
        const batch = writeBatch(db);
        let needsCommit = false;

        if (transactionsSnapshot.data().count === 0) {
            console.log('Initializing transactions collection with sample data for user...');
            const initialTransaction: Omit<Transaction, 'id' | 'userId'> = {
                amount: 120,
                category: "Freelance",
                date: new Date(),
                description: "Desenvolvimento de site",
                type: "revenue",
            };
            const newTransactionRef = doc(collection(db, 'transactions'));
            batch.set(newTransactionRef, {
                ...initialTransaction,
                userId,
                date: Timestamp.fromDate(initialTransaction.date)
            });
            needsCommit = true;
        }

        if (appointmentsSnapshot.data().count === 0) {
            console.log('Initializing appointments collection with sample data for user...');
            const initialAppointment: Omit<Appointment, 'id' | 'userId'> = {
                title: "Reunião de Alinhamento",
                date: new Date(),
                startTime: "10:00",
                endTime: "11:00",
            };
            const newAppointmentRef = doc(collection(db, 'appointments'));
            batch.set(newAppointmentRef, {
                ...initialAppointment,
                userId,
                date: Timestamp.fromDate(initialAppointment.date)
            });
            needsCommit = true;
        }

        if (needsCommit) {
            await batch.commit();
            console.log('Initial data committed to Firestore for user.');
        }

    } catch (error) {
        console.error("Failed to initialize collections:", error);
    }
}


// ====== Transaction Functions ======

export async function getTransactions(userId: string): Promise<Transaction[]> {
    await initializeData(userId);
    const transactionsCol = collection(db, 'transactions');
    const q = query(transactionsCol, where('userId', '==', userId), orderBy('date', 'desc'));
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

export async function addTransaction(transaction: Omit<Transaction, 'id'>, userId: string): Promise<Transaction> {
    const transactionWithUser = {
        ...transaction,
        userId,
        date: Timestamp.fromDate(new Date(transaction.date))
    };
    const docRef = await addDoc(collection(db, 'transactions'), transactionWithUser);
    return { id: docRef.id, ...transaction, userId };
}


// ====== Appointment Functions ======

export async function getAppointments(userId: string): Promise<Appointment[]> {
    await initializeData(userId);
    const appointmentsCol = collection(db, 'appointments');
    const q = query(appointmentsCol, where('userId', '==', userId), orderBy('date', 'desc'));
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

export async function addAppointment(appointment: Omit<Appointment, 'id'>, userId: string): Promise<Appointment> {
     const appointmentWithUser = {
        ...appointment,
        userId,
        date: Timestamp.fromDate(new Date(appointment.date))
    };
    const docRef = await addDoc(collection(db, 'appointments'), appointmentWithUser);
    return { id: docRef.id, ...appointment, userId };
}
