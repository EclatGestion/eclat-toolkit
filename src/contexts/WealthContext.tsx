import { createContext, useContext, useState, ReactNode, useMemo, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";

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

export interface ExpenseAnalysis {
  id: string;
  analysis_date: string;
  categorized_expenses: Record<string, number>;
  total_amount: number;
}

interface WealthContextType {
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
  assets: Asset[];
  setAssets: (assets: Asset[]) => void;
  addAsset: (asset: Omit<Asset, "id">) => Promise<void>;
  removeAsset: (id: string) => Promise<void>;
  updateAsset: (id: string, asset: Partial<Asset>) => Promise<void>;
  incomes: Income[];
  addIncome: (income: Omit<Income, "id">) => Promise<void>;
  removeIncome: (id: string) => Promise<void>;
  updateIncome: (id: string, income: Partial<Income>) => Promise<void>;
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, "id">) => Promise<void>;
  removeExpense: (id: string) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  fireGoals: FireGoal[];
  addFireGoal: (goal: Omit<FireGoal, "id">) => void;
  updateFireGoal: (id: string, goal: Partial<FireGoal>) => void;
  removeFireGoal: (id: string) => void;
  totalPatrimoine: number;
  totalEpargne: number;
  totalRevenus: number;
  totalDepenses: number;
  epargneMensuelle: number;
  isLoading: boolean;
  expensesByCategory: Record<string, number>;
  lastAnalysis: ExpenseAnalysis | null;
}

const WealthContext = createContext<WealthContextType | undefined>(undefined);

const initialProfile: UserProfile = {
  name: "",
  email: "",
  situation: "",
  goals: [],
};

const initialFireGoals: FireGoal[] = [
  { id: "1", label: "Épargne d'urgence", target: 20000, color: "#2D60FF" },
  { id: "2", label: "Apport immobilier", target: 80000, color: "#16DBCC" },
  { id: "3", label: "Indépendance FIRE", target: 500000, color: "#FFBB38" },
];

export function WealthProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile>(initialProfile);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [fireGoals, setFireGoals] = useState<FireGoal[]>(initialFireGoals);
  const [isLoading, setIsLoading] = useState(true);
  const [expensesByCategory, setExpensesByCategory] = useState<Record<string, number>>({});
  const [lastAnalysis, setLastAnalysis] = useState<ExpenseAnalysis | null>(null);

  // Load data from Supabase when user changes
  useEffect(() => {
    if (user) {
      loadUserData();
    } else {
      // Reset state when logged out
      setAssets([]);
      setIncomes([]);
      setExpenses([]);
      setIsLoading(false);
    }
  }, [user]);

  const loadUserData = async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // Load assets
      const { data: assetsData } = await supabase
        .from("assets")
        .select("*")
        .eq("user_id", user.id);
      
      if (assetsData) {
        setAssets(assetsData.map(a => ({
          id: a.id,
          name: a.name,
          type: a.type as Asset["type"],
          value: Number(a.value),
          bankName: a.bank_name || undefined,
        })));
      }

      // Load incomes
      const { data: incomesData } = await supabase
        .from("incomes")
        .select("*")
        .eq("user_id", user.id);
      
      if (incomesData) {
        setIncomes(incomesData.map(i => ({
          id: i.id,
          label: i.label,
          amount: Number(i.amount),
          frequency: i.frequency as Income["frequency"],
          category: i.category,
        })));
      }

      // Load expenses
      const { data: expensesData } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id);
      
      if (expensesData) {
        setExpenses(expensesData.map(e => ({
          id: e.id,
          label: e.label,
          amount: Number(e.amount),
          frequency: e.frequency as Expense["frequency"],
          category: e.category,
        })));
      }

      // Load latest expense analysis
      const { data: analysisData } = await supabase
        .from("expense_analyses")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (analysisData) {
        const categorized = analysisData.categorized_expenses as Record<string, number> || {};
        setExpensesByCategory(categorized);
        setLastAnalysis({
          id: analysisData.id,
          analysis_date: analysisData.analysis_date || "",
          categorized_expenses: categorized,
          total_amount: Number(analysisData.total_amount) || 0,
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Asset CRUD with Supabase sync
  const addAsset = useCallback(async (asset: Omit<Asset, "id">) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("assets")
      .insert({
        user_id: user.id,
        name: asset.name,
        type: asset.type,
        value: asset.value,
        bank_name: asset.bankName || null,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding asset:", error);
      return;
    }
    
    if (data) {
      const newAsset: Asset = {
        id: data.id,
        name: data.name,
        type: data.type as Asset["type"],
        value: Number(data.value),
        bankName: data.bank_name || undefined,
      };
      setAssets((prev) => [...prev, newAsset]);
    }
  }, [user]);

  const removeAsset = useCallback(async (id: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from("assets")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("Error removing asset:", error);
      return;
    }
    
    setAssets((prev) => prev.filter((a) => a.id !== id));
  }, [user]);

  const updateAsset = useCallback(async (id: string, updates: Partial<Asset>) => {
    if (!user) return;
    
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.value !== undefined) dbUpdates.value = updates.value;
    if (updates.bankName !== undefined) dbUpdates.bank_name = updates.bankName;
    
    const { error } = await supabase
      .from("assets")
      .update(dbUpdates)
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("Error updating asset:", error);
      return;
    }
    
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...updates } : a)));
  }, [user]);

  // Income CRUD with Supabase sync
  const addIncome = useCallback(async (income: Omit<Income, "id">) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("incomes")
      .insert({
        user_id: user.id,
        label: income.label,
        amount: income.amount,
        frequency: income.frequency,
        category: income.category,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding income:", error);
      return;
    }
    
    if (data) {
      const newIncome: Income = {
        id: data.id,
        label: data.label,
        amount: Number(data.amount),
        frequency: data.frequency as Income["frequency"],
        category: data.category,
      };
      setIncomes((prev) => [...prev, newIncome]);
    }
  }, [user]);

  const removeIncome = useCallback(async (id: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from("incomes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("Error removing income:", error);
      return;
    }
    
    setIncomes((prev) => prev.filter((i) => i.id !== id));
  }, [user]);

  const updateIncome = useCallback(async (id: string, updates: Partial<Income>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from("incomes")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("Error updating income:", error);
      return;
    }
    
    setIncomes((prev) => prev.map((i) => (i.id === id ? { ...i, ...updates } : i)));
  }, [user]);

  // Expense CRUD with Supabase sync
  const addExpense = useCallback(async (expense: Omit<Expense, "id">) => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from("expenses")
      .insert({
        user_id: user.id,
        label: expense.label,
        amount: expense.amount,
        frequency: expense.frequency,
        category: expense.category,
      })
      .select()
      .single();
    
    if (error) {
      console.error("Error adding expense:", error);
      return;
    }
    
    if (data) {
      const newExpense: Expense = {
        id: data.id,
        label: data.label,
        amount: Number(data.amount),
        frequency: data.frequency as Expense["frequency"],
        category: data.category,
      };
      setExpenses((prev) => [...prev, newExpense]);
    }
  }, [user]);

  const removeExpense = useCallback(async (id: string) => {
    if (!user) return;
    
    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("Error removing expense:", error);
      return;
    }
    
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  }, [user]);

  const updateExpense = useCallback(async (id: string, updates: Partial<Expense>) => {
    if (!user) return;
    
    const { error } = await supabase
      .from("expenses")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id);
    
    if (error) {
      console.error("Error updating expense:", error);
      return;
    }
    
    setExpenses((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  }, [user]);

  // Fire Goal CRUD (local only for now)
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

  const totalEpargne = useMemo(
    () => assets
      .filter((a) => a.type === "Épargne" || a.type === "Cash")
      .reduce((sum, asset) => sum + asset.value, 0),
    [assets]
  );

  const totalRevenus = useMemo(
    () => incomes.reduce((sum, i) => sum + (i.frequency === "monthly" ? i.amount * 12 : i.amount), 0),
    [incomes]
  );

  const totalDepenses = useMemo(
    () => expenses.reduce((sum, e) => sum + (e.frequency === "monthly" ? e.amount * 12 : e.amount), 0),
    [expenses]
  );

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
        isLoading,
        expensesByCategory,
        lastAnalysis,
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
