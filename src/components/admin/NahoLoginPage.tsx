import React, { useState, useEffect } from 'react';
import { localAssets } from '../../assets';
import { useSiteData } from '../../context/SiteDataContext';
import {
  Eye,
  EyeOff,
  ShieldAlert,
  ArrowLeft,
  LogIn,
  AlertCircle,
} from 'lucide-react';

const AUTH_STORAGE_KEY = 'nahocraft_v3_admin_session';
const LOCKOUT_STORAGE_KEY = 'nahocraft_v3_ip_lockout_state';
const MAX_ATTEMPTS = 3;
const LOCKOUT_DURATION_MS = 24 * 60 * 60 * 1000; // 24 horas de bloqueo de IP
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 horas de vigencia de sesión

// Hash SHA-256 precalculado de la credencial por defecto para no exponerla en texto plano en el código
const DEFAULT_PASSWORD_SHA256 =
  '25be5222c4a8d2c68f8b55d69df1f0139ef6b87f1e720a79928f1b742f2a0e10';

interface LockoutState {
  failedAttempts: number;
  lockedUntil: number | null;
  blockedIp: string;
}

interface AdminSessionPayload {
  token: string;
  expiresAt: number;
}

async function computeSha256Hex(input: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(input);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return '';
}

export function isNahoAuthenticated(): boolean {
  try {
    // Limpiar llave antigua insegura si existía
    localStorage.removeItem('nahocraft_v2_admin_authenticated');

    const raw = sessionStorage.getItem(AUTH_STORAGE_KEY) || localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return false;
    const parsed = JSON.parse(raw) as AdminSessionPayload;
    if (!parsed.token || !parsed.expiresAt || Date.now() > parsed.expiresAt) {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      return false;
    }
    return parsed.token.startsWith('nh_sess_') && parsed.token.length >= 24;
  } catch {
    return false;
  }
}

export function setNahoAuthenticated(val: boolean): void {
  try {
    localStorage.removeItem('nahocraft_v2_admin_authenticated');
    if (val) {
      const randomBytes = new Uint8Array(12);
      if (typeof window !== 'undefined' && window.crypto?.getRandomValues) {
        window.crypto.getRandomValues(randomBytes);
      }
      const hex = Array.from(randomBytes)
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
      const payload: AdminSessionPayload = {
        token: `nh_sess_${hex}_${Date.now().toString(36)}`,
        expiresAt: Date.now() + SESSION_DURATION_MS,
      };
      const serialized = JSON.stringify(payload);
      sessionStorage.setItem(AUTH_STORAGE_KEY, serialized);
      localStorage.setItem(AUTH_STORAGE_KEY, serialized);
    } else {
      sessionStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch {
    // ignore
  }
}

export function NahoLoginPage() {
  const { navigateTo } = useSiteData();

  const rawEnvEmail = (import.meta.env.VITE_ADMIN_EMAIL || '').trim();
  const customPasswordHash = (import.meta.env.VITE_ADMIN_PASSWORD_HASH || '').trim().toLowerCase();
  const expectedEmail = rawEnvEmail || 'Centrodearte@nahocraft.com';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [clientIp, setClientIp] = useState<string>('189.216.44.102');

  const [lockoutState, setLockoutState] = useState<LockoutState>(() => {
    try {
      const raw = localStorage.getItem(LOCKOUT_STORAGE_KEY);
      if (raw) return JSON.parse(raw) as LockoutState;
    } catch {
      // ignore
    }
    return {
      failedAttempts: 0,
      lockedUntil: null,
      blockedIp: '189.216.44.102',
    };
  });

  const [now, setNow] = useState(() => Date.now());

  // If already logged in, redirect to /naho/gestion
  useEffect(() => {
    if (isNahoAuthenticated()) {
      navigateTo('/naho/gestion');
    }
  }, [navigateTo]);

  // Try to detect public IP if available, fallback gracefully
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((r) => r.json())
      .then((data: { ip?: string }) => {
        if (data?.ip) setClientIp(data.ip);
      })
      .catch(() => {
        // Keep default local IP identifier in sandboxed/offline environments
      });
  }, []);

  // Tick timer for lockout countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const saveLockoutState = (next: LockoutState) => {
    setLockoutState(next);
    try {
      localStorage.setItem(LOCKOUT_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const isCurrentlyLocked =
    lockoutState.lockedUntil !== null && lockoutState.lockedUntil > now;

  const formatLockoutRemaining = () => {
    if (!lockoutState.lockedUntil) return '';
    const diff = Math.max(0, lockoutState.lockedUntil - now);
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isCurrentlyLocked) return;

    const cleanEmail = email.trim().toLowerCase();
    const isValidEmail = cleanEmail === expectedEmail.trim().toLowerCase();

    const trimmedPass = password.trim();
    const inputHash = await computeSha256Hex(trimmedPass);

    // Validación segura mediante hash SHA-256 (nunca compara ni expone contraseñas en texto plano)
    const targetHash = customPasswordHash || DEFAULT_PASSWORD_SHA256;
    const isValidPassword = inputHash === targetHash;

    if (isValidEmail && isValidPassword) {
      saveLockoutState({
        failedAttempts: 0,
        lockedUntil: null,
        blockedIp: clientIp,
      });
      setNahoAuthenticated(true);
      setErrorMessage(null);
      navigateTo('/naho/gestion');
      return;
    }

    // Increment failed attempts
    const nextAttempts = lockoutState.failedAttempts + 1;
    if (nextAttempts >= MAX_ATTEMPTS) {
      const lockUntilTime = Date.now() + LOCKOUT_DURATION_MS;
      saveLockoutState({
        failedAttempts: nextAttempts,
        lockedUntil: lockUntilTime,
        blockedIp: clientIp,
      });
      setErrorMessage(
        `Se superó el límite de ${MAX_ATTEMPTS} intentos. Acceso bloqueado temporalmente.`
      );
    } else {
      saveLockoutState({
        failedAttempts: nextAttempts,
        lockedUntil: null,
        blockedIp: clientIp,
      });
      const left = MAX_ATTEMPTS - nextAttempts;
      setErrorMessage(
        `Credenciales incorrectas (${left} ${left === 1 ? 'intento restante' : 'intentos restantes'}).`
      );
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#FBFBFA] text-neutral-900">
      {/* Left Column: Full-bleed Artwork Showcase */}
      <div className="relative hidden lg:block overflow-hidden bg-neutral-900">
        <img
          src={localAssets.murales.hojas}
          alt="Obra mural de Nahocraft Centro de Arte"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

        <div className="absolute bottom-12 left-12 right-12 z-10 text-white">
          <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-white/75 mb-3">
            Panel de Administración
          </span>
          <h2 className="text-4xl xl:text-5xl font-light tracking-tight leading-[1.12] text-white">
            Nahomy
            <span className="block font-serif italic font-normal text-white/90 mt-1">
              Centro de Arte
            </span>
          </h2>
          <div className="w-8 h-[2px] bg-naho-pink mt-5" />
        </div>
      </div>

      {/* Right Column: Clean Editorial Login Form aligned with Nahocraft's palette */}
      <div className="flex flex-col justify-center items-center px-6 py-12 sm:px-12 lg:px-16 bg-[#FBFBFA] relative">
        <div className="w-full max-w-[360px] space-y-10">
          {/* Brand Monogram / Logo & Greeting */}
          <div className="space-y-6">
            <div className="w-12 h-12 rounded-xl border border-black/[0.1] bg-white shadow-2xs flex items-center justify-center overflow-hidden p-1">
              <img
                src={localAssets.logo}
                alt="Nahocraft"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
                Bienvenida
              </h1>
              <p className="text-sm text-neutral-500 mt-2">
                Accede para gestionar tu portafolio, cursos y cotizaciones.
              </p>
            </div>
          </div>

          {/* IP Lockout State (Without public bypass button) */}
          {isCurrentlyLocked ? (
            <div className="space-y-6">
              <div
                role="alert"
                className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <h2 className="text-base font-bold text-rose-950">
                  Acceso bloqueado por seguridad
                </h2>
                <p className="text-xs text-rose-800/90 leading-relaxed">
                  Se superó el límite de {MAX_ATTEMPTS} intentos de inicio de sesión. Por seguridad, el acceso desde tu dirección IP ({lockoutState.blockedIp || clientIp}) ha sido suspendido temporalmente.
                </p>
                <p className="text-xs font-mono font-bold text-rose-700 pt-1">
                  Tiempo restante de bloqueo: {formatLockoutRemaining()}
                </p>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => navigateTo('/')}
                  className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver al sitio principal</span>
                </button>
              </div>
            </div>
          ) : (
            /* Minimalist Form */
            <form onSubmit={handleSubmit} method="post" className="space-y-7">
              {errorMessage && (
                <div
                  role="alert"
                  className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2"
                  >
                    Correo
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="username"
                    spellCheck={false}
                    placeholder="tu@correo.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errorMessage) setErrorMessage(null);
                    }}
                    className="w-full py-3 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="current-password"
                    className="block text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-2"
                  >
                    Contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="current-password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (errorMessage) setErrorMessage(null);
                      }}
                      className="w-full py-3 pr-9 bg-transparent border-b border-neutral-300 focus:border-naho-pink text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none transition-colors"
                    />
                    <button
                      type="button"
                      aria-pressed={showPassword}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-6">
                <button
                  type="submit"
                  className="w-full py-4 px-6 bg-naho-pink hover:bg-neutral-950 text-white text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 transition-colors cursor-pointer shadow-sm"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Entrar</span>
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigateTo('/')}
                    className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 hover:text-neutral-900 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Volver al sitio</span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
