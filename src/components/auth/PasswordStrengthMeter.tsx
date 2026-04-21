'use client';

import { motion } from 'framer-motion';

interface PasswordStrengthMeterProps {
  password: string;
}

export default function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  const getStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength += 1;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) strength += 1;
    if (/[0-9]/.test(pass)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pass)) strength += 1;
    return strength;
  };

  const strength = getStrength(password);

  const getColor = (s: number) => {
    if (s === 0) return 'bg-gray-200';
    if (s === 1) return 'bg-red-500';
    if (s === 2) return 'bg-orange-500';
    if (s === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getLabel = (s: number) => {
    if (s === 0) return '';
    if (s === 1) return 'Très faible';
    if (s === 2) return 'Faible';
    if (s === 3) return 'Moyen';
    return 'Fort';
  };

  return (
    <div className="mt-2 space-y-1.5">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black uppercase tracking-widest text-forest-green/40 dark:text-soft-cream/40">
          Force du mot de passe
        </span>
        <span className={`text-[10px] font-black uppercase tracking-widest ${strength >= 3 ? 'text-green-500' : 'text-forest-green/40'}`}>
          {getLabel(strength)}
        </span>
      </div>
      <div className="h-1.5 w-full bg-forest-green/5 dark:bg-soft-cream/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${(strength / 4) * 100}%` }}
          className={`h-full ${getColor(strength)} transition-colors duration-500`}
        />
      </div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-1 px-1">
        <Requirement met={password.length >= 8} label="8+ caractères" />
        <Requirement met={/[A-Z]/.test(password) && /[a-z]/.test(password)} label="Majuscule & Minuscule" />
        <Requirement met={/[0-9]/.test(password)} label="Un chiffre" />
        <Requirement met={/[^A-Za-z0-9]/.test(password)} label="Caractère spécial" />
      </div>
    </div>
  );
}

function Requirement({ met, label }: { met: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className={`material-symbols-outlined text-[10px] ${met ? 'text-green-500' : 'text-forest-green/20 dark:text-soft-cream/20'}`}>
        {met ? 'check_circle' : 'circle'}
      </span>
      <span className={`text-[10px] font-bold ${met ? 'text-forest-green dark:text-soft-cream' : 'text-forest-green/40 dark:text-soft-cream/40'}`}>
        {label}
      </span>
    </div>
  );
}
