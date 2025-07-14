export type Transaction = {
  id: string;
  userId: string;
  type: "revenue" | "expense";
  description: string;
  amount: number;
  date: Date;
  category: string;
};

export type Appointment = {
  id: string;
  userId: string;
  title: string;
  date: Date;
  startTime: string;
  endTime: string;
};
