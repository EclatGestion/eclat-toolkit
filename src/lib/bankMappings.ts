import { CSVParseConfig } from "./csvParser";

export interface BankMapping {
  id: string;
  name: string;
  config: CSVParseConfig;
  lastUsed: string;
  isDefault?: boolean;
}

const STORAGE_KEY = "eclat_bank_mappings";
const DEFAULT_MAPPING_KEY = "eclat_default_mapping";

/**
 * Generate a unique ID for a new mapping
 */
function generateId(): string {
  return `mapping_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Get all saved bank mappings
 */
export function getBankMappings(): BankMapping[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as BankMapping[];
  } catch {
    return [];
  }
}

/**
 * Save a new bank mapping
 */
export function saveBankMapping(name: string, config: CSVParseConfig): BankMapping {
  const mappings = getBankMappings();
  
  // Check if a mapping with this name already exists
  const existingIndex = mappings.findIndex(m => m.name.toLowerCase() === name.toLowerCase());
  
  const newMapping: BankMapping = {
    id: existingIndex >= 0 ? mappings[existingIndex].id : generateId(),
    name: name.trim(),
    config,
    lastUsed: new Date().toISOString(),
  };
  
  if (existingIndex >= 0) {
    mappings[existingIndex] = newMapping;
  } else {
    mappings.push(newMapping);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
  return newMapping;
}

/**
 * Update an existing bank mapping
 */
export function updateBankMapping(id: string, updates: Partial<BankMapping>): void {
  const mappings = getBankMappings();
  const index = mappings.findIndex(m => m.id === id);
  
  if (index >= 0) {
    mappings[index] = {
      ...mappings[index],
      ...updates,
      lastUsed: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mappings));
  }
}

/**
 * Delete a bank mapping
 */
export function deleteBankMapping(id: string): void {
  const mappings = getBankMappings();
  const filtered = mappings.filter(m => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  
  // If this was the default, clear default
  if (getDefaultMappingId() === id) {
    localStorage.removeItem(DEFAULT_MAPPING_KEY);
  }
}

/**
 * Get the default mapping ID
 */
export function getDefaultMappingId(): string | null {
  return localStorage.getItem(DEFAULT_MAPPING_KEY);
}

/**
 * Set a mapping as default
 */
export function setDefaultMapping(id: string): void {
  localStorage.setItem(DEFAULT_MAPPING_KEY, id);
}

/**
 * Get the last used mapping (or default if set)
 */
export function getLastUsedMapping(): BankMapping | null {
  const mappings = getBankMappings();
  if (mappings.length === 0) return null;
  
  // Check for default first
  const defaultId = getDefaultMappingId();
  if (defaultId) {
    const defaultMapping = mappings.find(m => m.id === defaultId);
    if (defaultMapping) return defaultMapping;
  }
  
  // Otherwise return most recently used
  return mappings.sort((a, b) => 
    new Date(b.lastUsed).getTime() - new Date(a.lastUsed).getTime()
  )[0];
}

/**
 * Mark a mapping as used (update lastUsed timestamp)
 */
export function markMappingAsUsed(id: string): void {
  updateBankMapping(id, {});
}
