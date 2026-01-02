import { useState, useEffect } from 'react';

const STORAGE_KEY = 'plans_list_v1';
const DEFAULT_PLANS = ['Particular', 'Plano A', 'Plano B'];

export function usePlans() {
  const [plans, setPlans] = useState<string[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as string[];
        setPlans(parsed);
        return;
      } catch (e) {
        // ignore
      }
    }
    setPlans(DEFAULT_PLANS);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(plans));
    } catch (e) {
      // ignore
    }
  }, [plans]);

  const addPlan = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (plans.includes(trimmed)) return;
    setPlans((p) => [...p, trimmed]);
  };

  const removePlan = (name: string) => {
    setPlans((p) => p.filter((x) => x !== name));
  };

  return { plans, addPlan, removePlan };
}
