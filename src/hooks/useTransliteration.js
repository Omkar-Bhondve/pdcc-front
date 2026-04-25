import { useState, useCallback } from 'react';
import { useDebounce } from './useDebounce';

/**
 * Hook to transliterate text from source language to target language using Google Input Tools API.
 * Currently configured for English -> Marathi.
 * 
 * Usage:
 * const { transliterate, suggestions, loading } = useTransliteration();
 * const marathiText = await transliterate('Admin');
 */
export const useTransliteration = () => {
    const [loading, setLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    const transliterate = useCallback(async (text, langCode = 'mr-t-i0-und') => {
        if (!text || !text.trim()) return '';

        setLoading(true);
        try {
            // Google Input Tools API (Public Endpoint)
            // itc options: mr-t-i0-und (Marathi), hi-t-i0-und (Hindi), etc.
            const url = `https://inputtools.google.com/request?text=${encodeURIComponent(text)}&itc=${langCode}&num=5&cp=0&cs=1&ie=utf-8&oe=utf-8`;

            const response = await fetch(url);
            const data = await response.json();

            if (data && data[0] === 'SUCCESS') {
                // data[1][0][1] contains the array of suggestions
                const result = data[1][0][1][0];
                const allSuggestions = data[1][0][1];

                setSuggestions(allSuggestions);
                return result;
            }
            return text;
        } catch (error) {
            console.error('Transliteration failed:', error);
            return text; // Return original text on failure
        } finally {
            setLoading(false);
        }
    }, []);

    return { transliterate, suggestions, loading };
};
