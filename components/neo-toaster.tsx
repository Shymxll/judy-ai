"use client";
import { createContext, useContext, useState, useRef, useCallback, useEffect, ReactNode } from "react";
import { CheckCircle2Icon, XCircle, Info, AlertTriangle, X } from "lucide-react";
import { createPortal } from "react-dom";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastOptions {
    type?: ToastType;
    title?: string;
    description?: string;
    duration?: number; // ms
}

interface Toast extends ToastOptions {
    id: string;
}

interface NeoToastContextType {
    showToast: (opts: ToastOptions) => void;
}

const NeoToastContext = createContext<NeoToastContextType | undefined>(undefined);

const iconMap = {
    success: <CheckCircle2Icon className="text-green-600 w-6 h-6" />,
    error: <XCircle className="text-red-600 w-6 h-6" />,
    info: <Info className="text-blue-600 w-6 h-6" />,
    warning: <AlertTriangle className="text-yellow-600 w-6 h-6" />,
};

export function NeoToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timers = useRef<{ [id: string]: NodeJS.Timeout }>({});

    const showToast = useCallback((opts: ToastOptions) => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { ...opts, id }]);
        timers.current[id] = setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
            delete timers.current[id];
        }, opts.duration ?? 3500);
    }, []);

    const closeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
        if (timers.current[id]) {
            clearTimeout(timers.current[id]);
            delete timers.current[id];
        }
    };

    useEffect(() => {
        return () => {
            Object.values(timers.current).forEach(clearTimeout);
        };
    }, []);

    return (
        <NeoToastContext.Provider value={{ showToast }}>
            {children}
            {createPortal(
                <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-4 w-full max-w-sm">
                    {toasts.map((toast) => (
                        <Alert
                            key={toast.id}
                            className={`neobrutalism-card bg-secondary-background border-4 shadow-lg flex items-start gap-4 px-5 py-4 relative
                                ${toast.type === "success"
                                    ? "bg-green-50 border-green-400 "
                                    : toast.type === "error"
                                        ? "bg-red-50 border-red-400"
                                        : toast.type === "warning"
                                            ? "bg-yellow-50 border-yellow-400"
                                            : "bg-blue-50 border-blue-400"
                                }`}
                            role="status"
                            aria-live="polite"
                        >
                            {iconMap[toast.type || "info"]}
                            <div className="flex-1">
                                {toast.title && <AlertTitle className="font-heading text-lg mb-1">{toast.title}</AlertTitle>}
                                {toast.description && <AlertDescription className="font-base text-base">{toast.description}</AlertDescription>}
                            </div>
                            <button
                                onClick={() => closeToast(toast.id)}
                                className="ml-2 text-gray-400 hover:text-gray-700 font-bold text-xl focus:outline-none absolute top-2 right-2"
                                aria-label="Close toast"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </Alert>
                    ))}
                </div>,
                typeof window !== "undefined" ? document.body : (null as any)
            )}
        </NeoToastContext.Provider>
    );
}

export function useNeoToast() {
    const ctx = useContext(NeoToastContext);
    if (!ctx) throw new Error("useNeoToast must be used within NeoToastProvider");
    return ctx;
} 