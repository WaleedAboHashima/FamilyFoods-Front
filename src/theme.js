import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// Coloring Tokens

export const tokens = (mode) => ({
  ...(mode === "dark"
    ? {
        primary: {
          100: "#d6e4de",
          200: "#accabd",
          300: "#83af9b",
          400: "#ECEFF1",
          500: "#307a59",
          600: "#266247",
          700: "#1d4935",
          800: "#133124",
          900: "#0a1812",
        },
        grey: {
          100: "#d5d5d5",
          200: "#ababab",
          300: "#818181",
          400: "#575757",
          500: "#2d2d2d",
          600: "#242424",
          700: "#1b1b1b",
          800: "#121212",
          900: "#090909",
        },
        whiteAccent: {
          100: "#fdfdfe",
          200: "#fafbfd",
          300: "#f8fafb",
          400: "#f5f8fa",
          500: "#f3f6f9",
          600: "#c2c5c7",
          700: "#929495",
          800: "#616264",
          900: "#313132",
        },
      }
    : {
        primary: {
          100: "#0a1812",
          200: "#133124",
          300: "#1d4935",
          400: "#ECEFF1", // Changed Due To Search Bar.
          500: "#307a59",
          600: "#59957a",
          700: "#83af9b",
          800: "#accabd",
          900: "#d6e4de",
        },
        grey: {
          100: "#090909",
          200: "#121212",
          300: "#1b1b1b",
          400: "#242424",
          500: "#2d2d2d",
          600: "#575757",
          700: "#818181",
          800: "#ababab",
          900: "#d5d5d5",
        },
        whiteAccent: {
          100: "#313132",
          200: "#616264",
          300: "#929495",
          400: "#c2c5c7",
          500: "#f3f6f9",
          600: "#f5f8fa",
          700: "#929495",
          800: "#fafbfd",
          900: "#f3f6f9", //Changed Cuz of Side Bar
        },
      }),
});

/// Material Ui Settings

export const themeSettings = (mode) => {
  const colors = tokens(mode);

  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            primary: {
              main: colors.primary[500],
            },
            secondary: {
              main: colors.whiteAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#2D2D2D", // Changed For Background Dark Theme.
            },
          }
        : {
            primary: {
              main: colors.primary[100],
            },
            secondary: {
              main: colors.whiteAccent[500],
            },
            neutral: {
              dark: colors.grey[700],
              main: colors.grey[500],
              light: colors.grey[100],
            },
            background: {
              default: "#fcfcfc",
            },
          }),
    },
    typography: {
      fontFamily: ["'Almarai', sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["'Almarai', sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["'Almarai', sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["'Almarai', sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["'Almarai', sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["'Almarai', sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["'Almarai', sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};

// Context FOr the color mode.

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
});

export const useMode = () => {
  const [mode, setMode] = useState(localStorage.getItem("theme"));

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () =>
        setMode((prev) => {
          if (prev === "dark") {
            localStorage.setItem("theme", "light");
            return (prev = "light");
          } else {
            localStorage.setItem("theme", "dark");
            return (prev = "dark");
          }
        }),
    }),
    []
  );
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  return [theme, colorMode];
};
