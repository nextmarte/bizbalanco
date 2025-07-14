"use client";

import { db } from './firebase';
import { collection, addDoc, getDocs, Timestamp, query, orderBy } from 'firebase/firestore';
import type { Transaction, Appointment } from './types';

// Type helpers for Firestore data
type FirestoreTransaction = Omit<Transaction, 'id' | 'date'> & { date: Timestamp };
type FirestoreAppointment = Omit<Appointment, 'id' | 'date'> & { date: Timestamp };


// ====== Transaction Functions ======

export async function getTransactions(): Promise<Transaction[]> {
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
    const docRef = await addDoc(collection(db, 'transactions'), transaction);
    return { id: docRef.id, ...transaction };
}


// ====== Appointment Functions ======

export async function getAppointments(): Promise<Appointment[]> {
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
    const docRef = await addDoc(collection(db, 'appointments'), appointment);
    return { id: docRef.id, ...appointment };
}
