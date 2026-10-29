/**
 * Theme Mapping for GitHub Stats & Widgets
 */

export const availableThemes = {
  'tokyo-night': { name: 'Tokyo Night', bg: '1a1b26' },
  'dracula': { name: 'Dracula', bg: '282a36' },
  'catppuccin': { name: 'Catppuccin', bg: '1e1e2e' },
  'one-dark': { name: 'One Dark', bg: '282c34' },
  'github-dark': { name: 'GitHub Dark', bg: '0d1117' }
};

export function getThemeParams(themeKey) {
  return availableThemes[themeKey] ? themeKey : 'tokyo-night';
}