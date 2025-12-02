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

export interface Transaction {
  id: string;
  label: string;
  amount: number;
  date: string;
  category: string;
  type: "income" | "expense";
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
  transactions: Transaction[];
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  fireGoals: FireGoal[];
  addFireGoal: (goal: Omit<FireGoal, "id">) => void;
  updateFireGoal: (id: string, goal: Partial<FireGoal>) => void;
  removeFireGoal: (id: string) => void;
  totalPatrimoine: number;
  totalRevenus: number;
  totalDepenses: number;
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

const initialTransactions: Transaction[] = [];

const initialFireGoals: FireGoal[] = [
  { id: "1", label: "Épargne d'urgence", target: 20000, color: "#2D60FF" },
  { id: "2", label: "Apport immobilier", target: 80000, color: "#16DBCC" },
  { id: "3", label: "Indépendance FIRE", target: 500000, color: "#FFBB38" },
];

export function WealthProvider({ children }: { children: ReactNode }) {
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [fireGoals, setFireGoals] = useState<FireGoal[]>(initialFireGoals);

  const addAsset = (asset: Omit<Asset, "id">) => {
    const newAsset: Asset = {
      ...asset,
      id: crypto.randomUUID(),
    };
    setAssets((prev) => [...prev, newAsset]);
  };

  const removeAsset = (id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const addTransaction = (transaction: Omit<Transaction, "id">) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
    };
    setTransactions((prev) => [...prev, newTransaction]);
  };

  const addFireGoal = (goal: Omit<FireGoal, "id">) => {
    const newGoal: FireGoal = {
      ...goal,
      id: crypto.randomUUID(),
    };
    setFireGoals((prev) => [...prev, newGoal]);
  };

  const updateFireGoal = (id: string, updates: Partial<FireGoal>) => {
    setFireGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...updates } : g))
    );
  };

  const removeFireGoal = (id: string) => {
    setFireGoals((prev) => prev.filter((g) => g.id !== id));
  };

  // Calculs dynamiques
  const totalPatrimoine = useMemo(
    () => assets.reduce((sum, asset) => sum + asset.value, 0),
    [assets]
  );

  const totalRevenus = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  );

  const totalDepenses = useMemo(
    () =>
      transactions
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0),
    [transactions]
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
        transactions,
        setTransactions,
        addTransaction,
        fireGoals,
        addFireGoal,
        updateFireGoal,
        removeFireGoal,
        totalPatrimoine,
        totalRevenus,
        totalDepenses,
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
