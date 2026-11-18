import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { ISiteSettings, COMPANY_INFO } from '@shared/types';
import { api } from '../services/api';

export function normalizeWhatsApp(raw?: string): { digits: string; display: string } {
  if (!raw || !raw.trim()) {
    const defaultRaw = COMPANY_INFO.whatsappRaw || '919972536991';
    return {
      digits: defaultRaw.replace(/\D/g, ''),
      display: COMPANY_INFO.phone || '+91 997 253 6991',
    };
  }
  const clean = raw.trim();
  let digits = clean.replace(/\D/g, '');
  if (digits.length === 10) {
    digits = `91${digits}`;
  }
  let display = clean;
  if (!clean.includes(' ') && digits.length === 12 && digits.startsWith('91')) {
    display = `+91 ${digits.slice(2, 5)} ${digits.slice(5, 8)} ${digits.slice(8)}`;
  }
  return { digits, display };
}

export function normalizePhone(raw?: string): { phoneCallUrl: string; phone: string } {
  if (!raw || !raw.trim()) {
    const fallback = COMPANY_INFO.phone || '+91 997 253 6991';
    return {
      phoneCallUrl: `tel:${fallback.replace(/[^\d+]/g, '')}`,
      phone: fallback,
    };
  }
  const clean = raw.trim();
  const digits = clean.replace(/[^\d+]/g, '');
  return {
    phoneCallUrl: `tel:${digits}`,
    phone: clean,
  };
}

interface SettingsContextType {
  settings: ISiteSettings | null;
  loading: boolean;
  phone: string;
  phoneCallUrl: string;
  whatsappNumber: string;
  whatsappDigits: string;
  whatsappUrl: string;
  getWhatsAppUrl: (customMessage?: string) => string;
  clientsCount: number;
  completedProjectsCount: number;
  yearsExperience: number;
  refreshSettings: () => Promise<ISiteSettings | null>;
  updateSettingsState: (newSettings: Partial<ISiteSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ISiteSettings | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchSettings = useCallback(async (): Promise<ISiteSettings | null> => {
    try {
      const res: any = await api.get('/content/settings');
      if (res && res.data) {
        setSettings(res.data);
        return res.data;
      }
    } catch (err) {
      console.warn('Unable to load dynamic website settings, using defaults', err);
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettingsState = useCallback((newSettings: Partial<ISiteSettings>) => {
    setSettings((prev) => (prev ? { ...prev, ...newSettings } : (newSettings as ISiteSettings)));
  }, []);

  const { phone, phoneCallUrl } = useMemo(() => {
    return normalizePhone(settings?.primaryPhone);
  }, [settings?.primaryPhone]);

  const { whatsappNumber, whatsappDigits, whatsappUrl, getWhatsAppUrl } = useMemo(() => {
    const { digits, display } = normalizeWhatsApp(settings?.whatsappNumber);
    const baseWaUrl = `https://wa.me/${digits}`;
    return {
      whatsappNumber: display,
      whatsappDigits: digits,
      whatsappUrl: baseWaUrl,
      getWhatsAppUrl: (customMessage?: string) => {
        if (!customMessage) return baseWaUrl;
        return `${baseWaUrl}?text=${encodeURIComponent(customMessage)}`;
      },
    };
  }, [settings?.whatsappNumber]);

  const clientsCount = settings?.clientsCount ?? 1000;
  const completedProjectsCount = settings?.completedProjectsCount ?? 200;
  const yearsExperience = settings?.yearsExperience ?? 15;

  const value = useMemo(
    () => ({
      settings,
      loading,
      phone,
      phoneCallUrl,
      whatsappNumber,
      whatsappDigits,
      whatsappUrl,
      getWhatsAppUrl,
      clientsCount,
      completedProjectsCount,
      yearsExperience,
      refreshSettings: fetchSettings,
      updateSettingsState,
    }),
    [
      settings,
      loading,
      phone,
      phoneCallUrl,
      whatsappNumber,
      whatsappDigits,
      whatsappUrl,
      getWhatsAppUrl,
      clientsCount,
      completedProjectsCount,
      yearsExperience,
      fetchSettings,
      updateSettingsState,
    ]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = (): SettingsContextType => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
