/**
 * LocalStorage & JSON Export/Import Utility
 */

const STORAGE_KEY = 'github_readme_generator_state';

export function saveStateToStorage(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Gagal menyimpan ke LocalStorage:', err);
  }
}

export function loadStateFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error('Gagal membaca dari LocalStorage:', err);
    return null;
  }
}

// 📥 Export seluruh racikan ke file .json
export function exportConfigToJson(state) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
  const dlAnchor = document.createElement('a');
  dlAnchor.setAttribute("href", dataStr);
  dlAnchor.setAttribute("download", "readme-config.json");
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  document.body.removeChild(dlAnchor);
}

// 📤 Import racikan dari file .json
export function importConfigFromJson(file, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsedState = JSON.parse(e.target.result);
      callback(parsedState);
    } catch (err) {
      alert('❌ File JSON tidak valid!');
    }
  };
  reader.readAsText(file);
}