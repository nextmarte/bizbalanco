import type { Transaction, Appointment } from './types';

export const defaultCategories = [
  'Salary',
  'Freelance',
  'Investment',
  'Rent',
  'Groceries',
  'Utilities',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Software',
  'Marketing',
  'Office Supplies',
  'Other',
];

export const transactions: Transaction[] = [
  { id: '1', type: 'revenue', description: 'Web design project', amount: 2500, date: new Date('2024-05-15'), category: 'Freelance' },
  { id: '2', type: 'expense', description: 'Monthly software subscription', amount: 49.99, date: new Date('2024-05-12'), category: 'Software' },
  { id: '3', type: 'expense', description: 'Office coffee and snacks', amount: 75.50, date: new Date('2024-05-10'), category: 'Office Supplies' },
  { id: '4', type: 'revenue', description: 'Consulting services', amount: 1200, date: new Date('2024-05-05'), category: 'Freelance' },
  { id: '5', type: 'expense', description: 'Social media ads', amount: 250, date: new Date('2024-05-02'), category: 'Marketing' },
];

export const appointments: Appointment[] = [
    { id: '1', title: 'Client Meeting - Project Alpha', date: new Date(), startTime: '10:00 AM', endTime: '11:00 AM' },
    { id: '2', title: 'Follow-up with Jane Doe', date: new Date(), startTime: '02:00 PM', endTime: '02:30 PM' },
    { id: '3', title: 'Design Review', date: new Date(new Date().setDate(new Date().getDate() + 2)), startTime: '11:00 AM', endTime: '12:00 PM' },
    { id: '4', title: 'Project Kickoff', date: new Date(new Date().setDate(new Date().getDate() - 1)), startTime: '09:00 AM', endTime: '10:30 AM' },
];
