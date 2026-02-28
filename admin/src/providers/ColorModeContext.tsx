import React, {
  createContext,
  useEffect,
  useState,
  useContext,
  PropsWithChildren,
} from "react";
import { ConfigProvider, theme } from "antd";

type ColorModeContextType = {
  mode: "light" | "dark";
  setMode: (mode: "light" | "dark") => void;
};

export const ColorModeContext = createContext<ColorModeContextType>(
  {} as ColorModeContextType
);

export const ColorModeContextProvider: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const [mode, setMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Check local storage or system preference
    const storedTheme = localStorage.getItem("theme") as "light" | "dark";
    if (storedTheme) {
      setMode(storedTheme);
    } else if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setMode("dark");
    }
  }, []);

  const toggleVerify = (newMode: "light" | "dark") => {
      setMode(newMode);
      localStorage.setItem("theme", newMode);
  }

  return (
    <ColorModeContext.Provider
      value={{
        mode,
        setMode: toggleVerify,
      }}
    >
      <ConfigProvider
        theme={{
          algorithm: mode === "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
          components: {
             Layout: {
                 headerBg: mode === "dark" ? "#141414" : "#ffffff",
             }
          }
        }}
      >
        {children}
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);
