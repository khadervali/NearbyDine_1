export type Theme = "light" | "dark" | "system";

export const themeScript = {
  get: (): Theme => {
    try {
      return (localStorage.getItem("theme") as Theme) || "system";
    } catch (e) {
      console.error("Error reading theme:", e);
      return "system";
    }
  },

  set: (theme: Theme): void => {
    try {
      // Save to localStorage
      localStorage.setItem("theme", theme);
      
      const root = document.documentElement;
      root.classList.remove("light", "dark");

      if (theme === "system") {
        // Handle system theme
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);

        // Add system theme change listener
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e: MediaQueryListEvent) => {
          root.classList.remove("light", "dark");
          root.classList.add(e.matches ? "dark" : "light");
        };

        mediaQuery.addEventListener("change", handleChange);
      } else {
        // Set explicit theme
        root.classList.add(theme);
      }

      console.log("Theme set to:", theme);
    } catch (e) {
      console.error("Error setting theme:", e);
    }
  },

  // For initial page load
  initialize: (): string => {
    return `
      try {
        const theme = localStorage.getItem('theme') || 'system';
        const root = document.documentElement;
        
        if (theme === 'system') {
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          root.classList.add(isDark ? 'dark' : 'light');
        } else {
          root.classList.add(theme);
        }
      } catch (e) {
        document.documentElement.classList.add('light');
      }
    `;
  }
}; 