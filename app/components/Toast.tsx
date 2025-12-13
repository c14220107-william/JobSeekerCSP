'use client'

import { useEffect, useState, useRef } from 'react';

interface ToastProps {
    show: boolean;
    message: string;
    type: 'success' | 'error' | 'warning';
    onClose: () => void;
    key?: string | number;
}

export default function Toast({ show, message, type, onClose }: ToastProps) {
    const [progress, setProgress] = useState(100);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!show) {
            // Clean up timer when toast is hidden
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
            return;
        }

        // Start countdown timer
        const duration = 3000;
        const interval = 30;
        const step = (100 / duration) * interval;

        timerRef.current = setInterval(() => {
            setProgress(prev => {
                const nextProgress = prev - step;
                if (nextProgress <= 0) {
                    if (timerRef.current) {
                        clearInterval(timerRef.current);
                        timerRef.current = null;
                    }
                    // Defer onClose to avoid updating parent during render
                    setTimeout(() => onClose(), 0);
                    return 0;
                }
                return nextProgress;
            });
        }, interval);

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        };
    }, [show, onClose]);

    if (!show) return null;

    const bgColor = type === 'error' ? 'bg-red-50 border-red-500' :
        type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
            'bg-green-50 border-green-500';

    const iconColor = type === 'error' ? 'text-red-500' :
        type === 'warning' ? 'text-yellow-500' :
            'text-green-500';

    return (
        <div className={`fixed top-4 right-4 z-50 min-w-[320px] max-w-md animate-slideIn ${bgColor} border-l-4 rounded-lg shadow-2xl overflow-hidden`}>
            <div className="flex items-start p-4">
                <div className="shrink-0">
                    {type === 'success' && (
                        <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    {type === 'error' && (
                        <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                    {type === 'warning' && (
                        <svg className={`w-6 h-6 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    )}
                </div>
                <div className="ml-3 w-0 flex-1 pt-0.5">
                    <p className="text-sm font-medium text-gray-900">{message}</p>
                </div>
                <div className="ml-4 shrink-0 flex">
                    <button
                        onClick={onClose}
                        className="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <span className="sr-only">Close</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className="w-full bg-gray-200 h-1">
                <div
                    className={`h-1 transition-all ease-linear ${type === 'error' ? 'bg-red-500' : type === 'warning' ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
}