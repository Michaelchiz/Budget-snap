import React from 'react';

// --- Card ---
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-[#15221d] rounded-2xl border border-[#2a3d35] overflow-hidden ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}
  >
    {children}
  </div>
);

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'glass';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  className = '', 
  ...props 
}) => {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#22c55e] hover:bg-[#16a34a] text-[#052e16] shadow-[0_0_15px_rgba(34,197,94,0.3)]",
    secondary: "bg-[#2a3d35] text-emerald-50 hover:bg-[#344e43] border border-[#3f574d]",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20",
    ghost: "text-slate-400 hover:text-white hover:bg-white/5",
    glass: "bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-3 text-sm",
    lg: "px-6 py-4 text-base",
    icon: "p-3",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`} {...props}>
      {children}
    </button>
  );
};

// --- Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5 w-full">
    {label && <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider ml-1">{label}</label>}
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">{icon}</div>}
      <input 
        className={`w-full bg-[#0f1a15] border ${error ? 'border-red-500/50 focus:border-red-500' : 'border-[#2a3d35] focus:border-[#22c55e]'} rounded-xl px-4 py-3 ${icon ? 'pl-10' : ''} text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-[#22c55e] transition-all ${className}`}
        {...props}
      />
    </div>
    {error && <span className="text-xs text-red-400 ml-1">{error}</span>}
  </div>
);

// --- Badge ---
export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'red' | 'blue' | 'gray' | 'dark' }> = ({ children, color = 'gray' }) => {
  const colors = {
    green: 'bg-[#22c55e]/20 text-[#4ade80] border border-[#22c55e]/30',
    red: 'bg-red-500/20 text-red-300 border border-red-500/30',
    blue: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
    gray: 'bg-slate-500/20 text-slate-300 border border-slate-500/30',
    dark: 'bg-black/40 text-slate-300 border border-white/10'
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wide ${colors[color]}`}>
      {children}
    </span>
  );
};

// --- Toggle ---
export const Toggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
  <button 
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${checked ? 'bg-[#22c55e]' : 'bg-[#2a3d35]'}`}
  >
    <span
      aria-hidden="true"
      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);
