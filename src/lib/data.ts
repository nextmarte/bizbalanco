import type { Transaction, Appointment } from './types';

export const defaultCategories = [
  'Salário',
  'Freelance',
  'Investimento',
  'Aluguel',
  'Mercado',
  'Contas',
  'Transporte',
  'Lazer',
  'Saúde',
  'Software',
  'Marketing',
  'Material de Escritório',
  'Outros',
];

export const transactions: Transaction[] = [
  { id: '1', type: 'revenue', description: 'Projeto de web design', amount: 2500, date: new Date('2024-05-15'), category: 'Freelance' },
  { id: '2', type: 'expense', description: 'Assinatura mensal de software', amount: 49.99, date: new Date('2024-05-12'), category: 'Software' },
  { id: '3', type: 'expense', description: 'Café e lanches para o escritório', amount: 75.50, date: new Date('2024-05-10'), category: 'Material de Escritório' },
  { id: '4', type: 'revenue', description: 'Serviços de consultoria', amount: 1200, date: new Date('2024-05-05'), category: 'Freelance' },
  { id: '5', type: 'expense', description: 'Anúncios em redes sociais', amount: 250, date: new Date('2024-05-02'), category: 'Marketing' },
];

export const appointments: Appointment[] = [
    { id: '1', title: 'Reunião Cliente - Projeto Alpha', date: new Date(), startTime: '10:00', endTime: '11:00' },
    { id: '2', title: 'Follow-up com Joana Silva', date: new Date(), startTime: '14:00', endTime: '14:30' },
    { id: '3', title: 'Revisão de Design', date: new Date(new Date().setDate(new Date().getDate() + 2)), startTime: '11:00', endTime: '12:00' },
    { id: '4', title: 'Início do Projeto', date: new Date(new Date().setDate(new Date().getDate() - 1)), startTime: '09:00', endTime: '10:30' },
];
