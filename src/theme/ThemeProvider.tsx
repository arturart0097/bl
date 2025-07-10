import { type ReactNode, useState } from "react";
import { Theme, ThemeContex, LOCAL_STORAGE_THEME } from "./ThemeContext";

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(() => {
        const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME);
        return (savedTheme as Theme) || Theme.LIGHT;
    });

    const handleSetTheme = (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem(LOCAL_STORAGE_THEME, newTheme);
    };

    return (
        <ThemeContex.Provider value={{ theme, setTheme: handleSetTheme }}>
            {children}
        </ThemeContex.Provider>
    );
};