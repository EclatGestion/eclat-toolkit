import { createContext, useContext, useState, ReactNode, useMemo } from "react";

export interface UserProfile {
  name: string;
  email: string;
  situation: string;
  goals: string[];
}

export interface Asset {
  id: string;
  name: string;
  type: "Immobilier" | "Bourse" | "Cash" | "Crypto" | "Épargne" | "Autre";
  value: number;
  bankName?: string;
}

export interface Income {
  id: string;
  label: string;
  amount: number;
  frequency: "monthly" | "annual";
  category: string;
}

export interface Expense {
  id: string;
  label: string;
  amount: number;
  frequency: "monthly" | "annual";
  category: string;
}

export interface FireGoal {
  id: string;
  label: string;
  target: number;
  color: string;
  icon?: string;
}

interface WealthContextType {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Omit<Asset, "id">) => void;
  removeAsset: (id: string) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  incomes: Income[];
  addIncome: (income: Omit<Income, "id">) => void;
  removeIncome: (id: string) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => void;
  removeExpense: (id: string) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  fireGoals: FireGoal[];
  addFireGoal: (goal: Omit<FireGoal, "id">) => void;
  updateFireGoal: (id: string, goal: Partial<FireGoal>) => void;
  removeFireGoal: (id: string) => void;
  totalPatrimoine: number;
  totalEpargne: number;
  totalRevenus: number;
  totalDepenses: number;
  epargneMensuelle: number;
}

const WealthContext = createContext<WealthContextType | undefined>(undefined);

// Données mock initiales (vides/basiques)
const initialProfile: UserProfile = {
  name: "",
  email: "",
  situation: "",
  goals: [],
};

const initialAssets: Asset[] = [];
const initialIncomes: Income[] = [];
const initialExpenses: Expense[] = [];

const initialFireGoals: FireGoal[] = [
  { id: "1", label: "Épargne d'urgence", target: 20000, color: "#2D60FF" },
  { id: "2", label: "Apport immobilier", target: 80000, color: "#16DBCC" },
  { id: "3", label: "Indépendance FIRE", target: 500000, color: "#FFBB38" },
];

export function WealthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [fireGoals, setFireGoals] = useState<FireGoal[]>(initialFireGoals);

  // Asset CRUD
  const addAsset = (asset: Omit<Asset, "id">) => {
    const newAsset: Asset = { ...asset, id: crypto.randomUUID() };
    setAssets((prev) => [...prev, newAsset]);
  };

  const removeAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  };

  // Income CRUD
  const addIncome = (income: Omit<Income, "id">) => {
    const newIncome: Income = { ...income, id: crypto.randomUUID() };
    setIncomes((prev) => [...prev, newIncome]);
  };

  const removeIncome = (id: string) => {
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  };

  const updateIncome = (id: string, updates: Partial<Income>) => {
    setIncomes((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  };

  // Expense CRUD
  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense: Expense = { ...expense, id: crypto.randomUUID() };
    setExpenses((prev) => [...prev, newExpense]);
  };

  const removeExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  // Fire Goal CRUD
  const addFireGoal = (goal: Omit<FireGoal, "id">) => {
    const newGoal: FireGoal = { ...goal, id: crypto.randomUUID() };
    setFireGoals((prev) => [...prev, newGoal]);
  };

  const updateFireGoal = (id: string, updates: Partial<FireGoal>) => {
    setFireGoals((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const removeFireGoal = (id: string) => {
    setFireGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Calculs dynamiques
  const totalPatrimoine = useMemo(
    () => assets.reduce((sum, asset) => sum + asset.value, 0),
    [assets]
  );

  // Épargne = Cash + Épargne types only
  const totalEpargne = useMemo(
    () => assets
      .filter((a) => a.type === "Épargne" || a.type === "Cash")
      .reduce((sum, asset) => sum + asset.value, 0),
    [assets]
  );

  // Revenus annuels (convertit les revenus mensuels en annuels)
  const totalRevenus = useMemo(
    () => incomes.reduce((sum, i) => sum + (i.frequency === "monthly" ? i.amount * 12 : i.amount), 0),
    [incomes]
  );

  // Dépenses annuelles (convertit les dépenses mensuelles en annuelles)
  const totalDepenses = useMemo(
    () => expenses.reduce((sum, e) => sum + (e.frequency === "monthly" ? e.amount * 12 : e.amount), 0),
    [expenses]
  );

  // Épargne mensuelle = (Revenus annuels - Dépenses annuelles) / 12
  const epargneMensuelle = useMemo(
    () => Math.max(0, (totalRevenus - totalDepenses) / 12),
    [totalRevenus, totalDepenses]
  );

  return (
    <WealthContext.Provider
      value={{
        userProfile,
        setUserProfile,
        assets,
        setAssets,
        addAsset,
        removeAsset,
        updateAsset,
        incomes,
        addIncome,
        removeIncome,
        updateIncome,
        expenses,
        addExpense,
        removeExpense,
        updateExpense,
        fireGoals,
        addFireGoal,
        updateFireGoal,
        removeFireGoal,
        totalPatrimoine,
        totalEpargne,
        totalRevenus,
        totalDepenses,
        epargneMensuelle,
      }}
    >
      {children}
    </WealthContext.Provider>
  );
}

export function useWealth() {
  const context = useContext(WealthContext);
  if (context === undefined) {
    throw new Error("useWealth must be used within a WealthProvider");
  }
  return context;
}
