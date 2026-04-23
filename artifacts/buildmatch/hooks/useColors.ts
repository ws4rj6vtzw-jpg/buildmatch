import { useColorScheme } from "react-native";

import colors from "@/constants/colors";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Returns design tokens for the active color scheme.
 * Priority: manual override (ThemeContext) → system preference → dark default.
 */
export function useColors() {
  const { mode } = useTheme();
  const system = useColorScheme();

  const resolved = mode === "system" ? system : mode;
  const palette = resolved === "light" ? colors.lightMode : colors.light;

  return { ...palette, radius: colors.radius };
}
