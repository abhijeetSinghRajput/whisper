import {create} from 'zustand';

export const useThemeStore = create((set, get)=>({
    theme: localStorage.getItem('theme') || 'coffee',
    setTheme: (theme)=>{
        localStorage.setItem('theme', theme);
        set({theme});
    },
}))