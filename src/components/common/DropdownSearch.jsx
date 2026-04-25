import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { Search, X, ChevronDown, Check } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * DropdownSearch — Reusable debounced searchable dropdown
 *
 * Props:
 *   value       — current selected id (string/number)
 *   onChange    — (e) => void  — called with { target: { value: id } }
 *   options     — [{ id, name, name_mr? }]
 *   placeholder — string (e.g. "All Districts")
 *   icon        — optional lucide icon component
 */
const DropdownSearch = ({ value, onChange, options = [], placeholder = 'Select…', icon: Icon }) => {
    const [open, setOpen]             = useState(false);
    const [query, setQuery]           = useState('');
    const [panelStyle, setPanelStyle] = useState({});
    const debouncedQuery              = useDebounce(query, 200);
    const triggerRef                  = useRef(null);
    const panelRef                    = useRef(null);
    const inputRef                    = useRef(null);

    const calcPosition = () => {
        if (!triggerRef.current) return;
        const rect       = triggerRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUpward = spaceBelow < 320 && rect.top > 320;
        setPanelStyle({
            position: 'fixed',
            left: rect.left,
            width: Math.max(rect.width, 260),
            zIndex: 9999,
            ...(openUpward
                ? { bottom: window.innerHeight - rect.top + 4 }
                : { top: rect.bottom + 4 }),
        });
    };

    // Close on outside click
    useEffect(() => {
        const handler = (e) => {
            if (
                triggerRef.current && !triggerRef.current.contains(e.target) &&
                panelRef.current   && !panelRef.current.contains(e.target)
            ) { setOpen(false); setQuery(''); }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    // Reposition on scroll / resize
    useEffect(() => {
        if (!open) return;
        const h = () => calcPosition();
        window.addEventListener('scroll', h, true);
        window.addEventListener('resize', h);
        return () => {
            window.removeEventListener('scroll', h, true);
            window.removeEventListener('resize', h);
        };
    }, [open]);

    // Auto-focus search input
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 50);
    }, [open]);

    const filtered = options.filter((o) => {
        if (!debouncedQuery) return true;
        const q = debouncedQuery.toLowerCase();
        return (
            o.name?.toLowerCase().includes(q) ||
            o.name_mr?.toLowerCase().includes(q)
        );
    });

    const selected = options.find((o) => String(o.id) === String(value));

    const handleSelect = (id) => {
        onChange({ target: { value: id } });
        setOpen(false);
        setQuery('');
    };

    const panel = open ? (
        <div
            ref={panelRef}
            style={{ ...panelStyle, animation: 'sdropIn 0.15s ease-out' }}
            className="bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden"
        >
            {/* Inner search */}
            <div className="p-2 border-b border-slate-100">
                <div className="relative">
                    <Search className="h-3.5 w-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Type to search…"
                        className="w-full pl-8 pr-7 py-2 rounded-lg border border-slate-200 bg-slate-50
                                   text-xs text-slate-700 placeholder:text-slate-300
                                   focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100
                                   transition-all duration-150"
                    />
                    {query && (
                        <button onClick={() => setQuery('')} className="absolute right-2.5 top-2.5 text-slate-300 hover:text-slate-500">
                            <X className="h-3 w-3" />
                        </button>
                    )}
                </div>
            </div>

            {/* Options */}
            <div className="max-h-52 overflow-y-auto p-1.5">
                {/* All / reset option */}
                <button
                    type="button"
                    onClick={() => handleSelect('')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors
                        ${!value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <span className={`h-4 w-4 rounded-full border flex-shrink-0 flex items-center justify-center
                        ${!value ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                        {!value && <Check className="h-2.5 w-2.5 text-white" />}
                    </span>
                    {placeholder}
                </button>

                {filtered.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">No results found</p>
                )}

                {filtered.map((o) => {
                    const isSel = String(value) === String(o.id);
                    return (
                        <button
                            key={o.id}
                            type="button"
                            onClick={() => handleSelect(o.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-left transition-colors
                                ${isSel ? 'bg-blue-50 text-blue-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                        >
                            <span className={`h-4 w-4 rounded-full border flex-shrink-0 flex items-center justify-center
                                ${isSel ? 'bg-blue-500 border-blue-500' : 'border-slate-300'}`}>
                                {isSel && <Check className="h-2.5 w-2.5 text-white" />}
                            </span>
                            <span className="whitespace-normal leading-snug">
                                {o.name}{o.name_mr ? ` / ${o.name_mr}` : ''}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Footer count */}
            {query && (
                <div className="px-3 py-2 border-t border-slate-100 text-xs text-slate-400">
                    {filtered.length} result{filtered.length !== 1 ? 's' : ''} for &ldquo;{debouncedQuery}&rdquo;
                </div>
            )}
        </div>
    ) : null;

    return (
        <>
            <div ref={triggerRef}>
                <button
                    type="button"
                    onClick={() => { if (open) { setOpen(false); } else { calcPosition(); setOpen(true); } }}
                    className={`w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm bg-white transition-all duration-150
                        ${open
                            ? 'border-blue-500 ring-2 ring-blue-100 shadow-md'
                            : 'border-slate-200 hover:border-blue-300 shadow-md'
                        }`}
                >
                    {Icon && <Icon className={`h-4 w-4 flex-shrink-0 ${selected ? 'text-blue-500' : 'text-slate-300'}`} />}
                    <span className={`flex-1 text-left truncate ${selected ? 'text-slate-800 font-medium' : 'text-slate-400'}`}>
                        {selected
                            ? `${selected.name}${selected.name_mr ? ` / ${selected.name_mr}` : ''}`
                            : placeholder}
                    </span>
                    {value
                        ? <X
                            className="h-3.5 w-3.5 text-slate-400 hover:text-rose-400 transition-colors flex-shrink-0"
                            onClick={(e) => { e.stopPropagation(); handleSelect(''); }}
                          />
                        : <ChevronDown className={`h-4 w-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                    }
                </button>
            </div>

            {typeof document !== 'undefined' && open && ReactDOM.createPortal(panel, document.body)}

            <style>{`
                @keyframes sdropIn {
                    from { opacity: 0; transform: translateY(-6px) scale(0.98); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </>
    );
};

export default DropdownSearch;