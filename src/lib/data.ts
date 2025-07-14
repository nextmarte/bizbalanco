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

// Os dados agora são carregados do Firebase. 
// Estas listas estão vazias por padrão.
export const transactions: Transaction[] = [];

export const appointments: Appointment[] = [];
