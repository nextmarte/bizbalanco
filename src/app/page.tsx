"use client";

import * as React from "react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { FileUp, PlusCircle } from "lucide-react";
import { FinancialSummaryCards } from "@/components/dashboard/financial-summary-cards";
import { RecentTransactions } from "@/components/dashboard/recent-transactions";
import { AddTransactionSheet } from "@/components/dashboard/add-transaction-sheet";
import type { Transaction } from "@/lib/types";
import { transactions as initialTransactions } from "@/lib/data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export default function DashboardPage() {
  const [transactions, setTransactions] = React.useState<Transaction[]>(initialTransactions);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = React.useState(false);

  const { totalRevenue, totalExpenses, totalProfit } = React.useMemo(() => {
    let revenue = 0;
    let expenses = 0;
    transactions.forEach(t => {
      if (t.type === 'revenue') {
        revenue += t.amount;
      } else {
        expenses += t.amount;
      }
    });
    return {
      totalRevenue: revenue,
      totalExpenses: expenses,
      totalProfit: revenue - expenses,
    };
  }, [transactions]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    setTransactions(prev => [
      { ...newTransaction, id: crypto.randomUUID() },
      ...prev,
    ]);
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Painel</h1>
            <p className="text-muted-foreground">Aqui está um resumo das finanças do seu negócio.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsImportDialogOpen(true)}>
              <FileUp />
              Importar Dados
            </Button>
            <Button onClick={() => setIsSheetOpen(true)}>
              <PlusCircle />
              Adicionar Transação
            </Button>
          </div>
        </div>

        <FinancialSummaryCards
          totalRevenue={totalRevenue}
          totalExpenses={totalExpenses}
          totalProfit={totalProfit}
        />

        <RecentTransactions transactions={transactions} />

        <AddTransactionSheet
          isOpen={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          onTransactionAdded={handleAddTransaction}
        />

        <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Importar Planilha</DialogTitle>
                    <DialogDescription>
                        Faça o upload de um arquivo CSV com suas transações. O arquivo deve ter colunas para: data, descrição, valor, tipo (receita/despesa) e categoria.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input type="file" accept=".csv" />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>Cancelar</Button>
                    <Button>Importar</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
