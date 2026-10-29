// src/js/main.js

import { appState } from './state.js';
import { generateMarkdown } from './engine/compiler.js';
import { renderMarkdownToHtml } from './engine/parser.js';
import { saveStateToStorage, loadStateFromStorage, exportConfigToJson, importConfigFromJson } from './utils/storage.js';
import { copyToClipboard, downloadMarkdownFile, showToast } from './utils/clipboard.js';
import { commitReadmeToGithub } from './utils/github-api.js';
import { debounce } from './utils/helpers.js';
import { presets } from './presets.js';
import { LayoutManager } from './layout.js';

console.log('🚀 Fully Featured Dashboard Initialized...');

const layoutManager = new LayoutManager(appState);

// --- DOM Elements Selection ---
// Top Navigation & Configuration
const btnExportJson = document.getElementById('btn-export-json');
const btnImportJson = document.getElementById('btn-import-json');
const fileImportInput = document.getElementById('file-import-input');

// Modal Tutorial
const modalTutorial = document.getElementById('modal-tutorial');
const btnOpenTutorial = document.getElementById('btn-open-tutorial');
const btnCloseTutorial = document.getElementById('btn-close-tutorial');
const btnUnderstood = document.getElementById('btn-understood');

// Direct GitHub Commit
const githubTokenInput = document.getElementById('github-token');
const githubRepoInput = document.getElementById('github-repo');
const btnDirectCommit = document.getElementById('btn-direct-commit');

// Profile Inputs
const inputName = document.getElementById('input-name');
const inputTitle = document.getElementById('input-title');
const inputBio = document.getElementById('input-bio');
const inputBuilding = document.getElementById('input-building');
const inputLearning = document.getElementById('input-learning');

// Project Showcase Inputs
const projName = document.getElementById('proj-name');
const projDesc = document.getElementById('proj-desc');
const projTech = document.getElementById('proj-tech');
const projRepo = document.getElementById('proj-repo');
const projDemo = document.getElementById('proj-demo');
const btnAddProject = document.getElementById('btn-add-project');
const projectList = document.getElementById('project-list');

// Tech Stack Search & Badges
const searchBadge = document.getElementById('search-badge');
const badgeBtns = document.querySelectorAll('.badge-btn');

// Widget Controls & Theme
const toggleStats = document.getElementById('toggle-stats');
const toggleStreak = document.getElementById('toggle-streak');
const toggleTopLangs = document.getElementById('toggle-top-langs');
const toggleTrophies = document.getElementById('toggle-trophies');
const toggleSnake = document.getElementById('toggle-snake');
const toggleSpotify = document.getElementById('toggle-spotify');
const toggleWakatime = document.getElementById('toggle-wakatime');
const toggleQuotes = document.getElementById('toggle-quotes');
const toggleJokes = document.getElementById('toggle-jokes');
const selectTheme = document.getElementById('select-theme');

// Social Media Links
const socialGithub = document.getElementById('social-github');
const socialLinkedin = document.getElementById('social-linkedin');
const socialInstagram = document.getElementById('social-instagram');

// Donations / Support
const donationBmc = document.getElementById('donation-bmc');
const donationKofi = document.getElementById('donation-kofi');
const donationSaweria = document.getElementById('donation-saweria');

// Custom Free-Text Section Inputs
const customTitle = document.getElementById('custom-title');
const customContent = document.getElementById('custom-content');
const btnAddCustomSection = document.getElementById('btn-add-custom-section');
const customSectionList = document.getElementById('custom-section-list');

// Preset Buttons
const btnPresetMinimal = document.getElementById('btn-preset-minimal');
const btnPresetFullstack = document.getElementById('btn-preset-fullstack');
const btnPresetStudent = document.getElementById('btn-preset-student');

// Preview Display Elements & Action Buttons
const visualPreview = document.getElementById('visual-preview');
const markdownOutput = document.getElementById('markdown-output');
const tabVisual = document.getElementById('tab-visual');
const tabRaw = document.getElementById('tab-raw');
const btnCopy = document.getElementById('btn-copy');
const btnDownload = document.getElementById('btn-download');

// --- 1. Modal Tutorial Logic ---
const openModal = () => modalTutorial && modalTutorial.classList.add('active');
const closeModal = () => modalTutorial && modalTutorial.classList.remove('active');

if (btnOpenTutorial) btnOpenTutorial.addEventListener('click', openModal);
if (btnCloseTutorial) btnCloseTutorial.addEventListener('click', closeModal);
if (btnUnderstood) btnUnderstood.addEventListener('click', closeModal);

if (modalTutorial) {
  modalTutorial.addEventListener('click', (e) => {
    if (e.target === modalTutorial) closeModal();
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// --- 2. Export & Import JSON Configuration ---
if (btnExportJson) {
  btnExportJson.addEventListener('click', () => {
    exportConfigToJson(appState.getState());
    showToast('📥 Konfigurasi berhasil diekspor ke file JSON!');
  });
}

if (btnImportJson && fileImportInput) {
  btnImportJson.addEventListener('click', () => fileImportInput.click());
  fileImportInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      importConfigFromJson(file, (newParsedState) => {
        appState.setState(newParsedState);
        syncFormWithState(newParsedState);
        showToast('📤 Konfigurasi berhasil diimpor!');
      });
      fileImportInput.value = '';
    }
  });
}

// --- 3. Live Badge Search Filter ---
if (searchBadge) {
  searchBadge.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    badgeBtns.forEach(btn => {
      const slug = (btn.getAttribute('data-slug') || '').toLowerCase();
      const text = btn.textContent.toLowerCase();
      if (slug.includes(query) || text.includes(query)) {
        btn.style.display = 'inline-block';
      } else {
        btn.style.display = 'none';
      }
    });
  });
}

// --- 4. Tab Switching Handler ---
if (tabVisual && tabRaw) {
  tabVisual.addEventListener('click', () => {
    tabVisual.classList.add('active');
    tabRaw.classList.remove('active');
    visualPreview.style.display = 'block';
    markdownOutput.style.display = 'none';
  });

  tabRaw.addEventListener('click', () => {
    tabRaw.classList.add('active');
    tabVisual.classList.remove('active');
    markdownOutput.style.display = 'block';
    visualPreview.style.display = 'none';
  });
}

// --- 5. Direct GitHub API Commit Handler ---
if (btnDirectCommit) {
  btnDirectCommit.addEventListener('click', async () => {
    const token = githubTokenInput ? githubTokenInput.value.trim() : '';
    const repo = githubRepoInput ? githubRepoInput.value.trim() : '';
    const username = socialGithub ? socialGithub.value.trim() : '';
    const markdownContent = markdownOutput ? markdownOutput.textContent : '';

    if (!token) return showToast('⚠️ Masukkan Personal Access Token (PAT) kamu!');
    if (!username) return showToast('⚠️ Isi Username GitHub di bagian Social Media Links!');
    if (!repo) return showToast('⚠️ Masukkan Nama Target Repository!');

    try {
      btnDirectCommit.disabled = true;
      btnDirectCommit.innerHTML = '⏳ Memproses Commit...';
      showToast('🔄 Menghubungkan ke GitHub API...');

      await commitReadmeToGithub({
        token,
        username,
        repo,
        markdownContent
      });

      showToast('🎉 README.md Berhasil Di-commit & Diperbarui di GitHub!');
    } catch (err) {
      showToast(`❌ Error: ${err.message}`);
    } finally {
      btnDirectCommit.disabled = false;
      btnDirectCommit.innerHTML = '🚀 Push / Commit Langsung ke GitHub';
    }
  });
}

// --- 6. Form State Sync Helper ---
const syncFormWithState = (state) => {
  if (state.profile) {
    if (inputName) inputName.value = state.profile.name || '';
    if (inputTitle) inputTitle.value = state.profile.title || '';
    if (inputBio) inputBio.value = state.profile.bio || '';
    if (inputBuilding) inputBuilding.value = state.profile.building || '';
    if (inputLearning) inputLearning.value = state.profile.learning || '';
  }

  if (selectTheme) selectTheme.value = state.activeTheme || 'tokyo-night';

  if (state.statsConfig) {
    if (toggleStats) toggleStats.checked = !!state.statsConfig.showStats;
    if (toggleStreak) toggleStreak.checked = !!state.statsConfig.showStreak;
    if (toggleTopLangs) toggleTopLangs.checked = !!state.statsConfig.showTopLangs;
    if (toggleTrophies) toggleTrophies.checked = !!state.statsConfig.showTrophies;
    if (toggleSnake) toggleSnake.checked = !!state.statsConfig.showSnake;
    if (toggleSpotify) toggleSpotify.checked = !!state.statsConfig.showSpotify;
    if (toggleWakatime) toggleWakatime.checked = !!state.statsConfig.showWakatime;
    if (toggleQuotes) toggleQuotes.checked = !!state.statsConfig.showQuotes;
    if (toggleJokes) toggleJokes.checked = !!state.statsConfig.showJokes;
  }

  if (state.socialLinks) {
    if (socialGithub) socialGithub.value = state.socialLinks.github || '';
    if (socialLinkedin) socialLinkedin.value = state.socialLinks.linkedin || '';
    if (socialInstagram) socialInstagram.value = state.socialLinks.instagram || '';
  }

  if (state.donations) {
    if (donationBmc) donationBmc.value = state.donations.buymeacoffee || '';
    if (donationKofi) donationKofi.value = state.donations.kofi || '';
    if (donationSaweria) donationSaweria.value = state.donations.saweria || '';
  }
};

// --- 7. Render Dynamic Lists (Projects & Custom Sections) ---
const renderProjectsList = (projects) => {
  if (!projectList) return;
  projectList.innerHTML = projects.map(p => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-input); padding:8px 12px; border-radius:6px; margin-bottom:6px; border:1px solid var(--border-color);">
      <div>
        <strong style="color:var(--primary); font-size:0.85rem;">${p.name}</strong>
        <p style="margin:0; font-size:0.75rem; color:var(--text-muted);">${p.desc || ''}</p>
      </div>
      <button class="btn-del-proj" data-id="${p.id}" style="background:none; border:none; color:#ef4444; cursor:pointer; font-weight:bold;">✕</button>
    </div>
  `).join('');

  projectList.querySelectorAll('.btn-del-proj').forEach(btn => {
    btn.addEventListener('click', () => {
      appState.removeProject(Number(btn.getAttribute('data-id')));
    });
  });
};

const renderCustomSectionsList = (sections) => {
  if (!customSectionList) return;
  customSectionList.innerHTML = sections.map(s => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-input); padding:8px 12px; border-radius:6px; margin-bottom:6px; border:1px solid var(--border-color);">
      <div>
        <strong style="color:var(--primary); font-size:0.85rem;">${s.title}</strong>
      </div>
      <button class="btn-del-sec" data-id="${s.id}" style="background:none; border:none; color:#ef4444; cursor:pointer; font-weight:bold;">✕</button>
    </div>
  `).join('');

  customSectionList.querySelectorAll('.btn-del-sec').forEach(btn => {
    btn.addEventListener('click', () => {
      appState.removeCustomSection(Number(btn.getAttribute('data-id')));
    });
  });
};

// --- 8. Section Order Controls Renderer ---
const renderSectionOrderControls = (state) => {
  const container = document.getElementById('section-order-list');
  if (!container) return;

  const sectionLabels = {
    header: 'Header & Title',
    bio: 'Bio & Aktivitas',
    projects: 'Project Showcase',
    techStack: 'Tech Stack Badges',
    stats: 'GitHub Stats, Trophies & Streak',
    socials: 'Social Media Badges',
    donations: 'Donation & Support Buttons',
    customSections: 'Custom Free-Text Sections'
  };

  container.innerHTML = state.sectionOrder.map((key, idx) => `
    <div style="display:flex; align-items:center; justify-content:space-between; background:var(--bg-input); padding:8px 12px; border-radius:6px; margin-bottom:6px; border:1px solid var(--border-color);">
      <span style="font-size:0.85rem; font-weight:600; color:var(--text-main);">${sectionLabels[key] || key}</span>
      <div>
        <button class="btn-order-up" data-key="${key}" ${idx === 0 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : 'style="cursor:pointer;"'} style="background:none; border:none; color:var(--primary); font-weight:bold;">▲</button>
        <button class="btn-order-down" data-key="${key}" ${idx === state.sectionOrder.length - 1 ? 'disabled style="opacity:0.3; cursor:not-allowed;"' : 'style="cursor:pointer;"'} style="background:none; border:none; color:var(--primary); font-weight:bold;">▼</button>
      </div>
    </div>
  `).join('');

  container.querySelectorAll('.btn-order-up').forEach(btn => {
    btn.addEventListener('click', () => layoutManager.moveUp(btn.getAttribute('data-key')));
  });

  container.querySelectorAll('.btn-order-down').forEach(btn => {
    btn.addEventListener('click', () => layoutManager.moveDown(btn.getAttribute('data-key')));
  });
};

// --- 9. Presets Templates ---
const applyPreset = (presetKey) => {
  const selectedPreset = presets[presetKey];
  if (selectedPreset) {
    appState.setState(selectedPreset);
    syncFormWithState(selectedPreset);
    showToast(`✨ Template ${presetKey.toUpperCase()} berhasil dimuat!`);
  }
};

if (btnPresetMinimal) btnPresetMinimal.addEventListener('click', () => applyPreset('minimalist'));
if (btnPresetFullstack) btnPresetFullstack.addEventListener('click', () => applyPreset('fullstack'));
if (btnPresetStudent) btnPresetStudent.addEventListener('click', () => applyPreset('student'));

// --- 10. Restore Saved State from LocalStorage ---
const savedState = loadStateFromStorage();
if (savedState) {
  appState.setState(savedState);
  syncFormWithState(savedState);
}

// --- 11. Main Render Function ---
const render = (state) => {
  const rawMarkdown = generateMarkdown(state);
  
  if (markdownOutput) markdownOutput.textContent = rawMarkdown;
  if (visualPreview) visualPreview.innerHTML = renderMarkdownToHtml(rawMarkdown);

  badgeBtns.forEach(btn => {
    const slug = btn.getAttribute('data-slug');
    if (state.techStack.includes(slug)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  renderProjectsList(state.projects || []);
  renderCustomSectionsList(state.customSections || []);
  renderSectionOrderControls(state);

  saveStateToStorage(state);
};

const debouncedRender = debounce(render, 300);
appState.subscribe(debouncedRender);

// --- 12. Input & Control Event Listeners ---
if (inputName) inputName.addEventListener('input', (e) => appState.updateProfile({ name: e.target.value }));
if (inputTitle) inputTitle.addEventListener('input', (e) => appState.updateProfile({ title: e.target.value }));
if (inputBio) inputBio.addEventListener('input', (e) => appState.updateProfile({ bio: e.target.value }));
if (inputBuilding) inputBuilding.addEventListener('input', (e) => appState.updateProfile({ building: e.target.value }));
if (inputLearning) inputLearning.addEventListener('input', (e) => appState.updateProfile({ learning: e.target.value }));

if (toggleStats) toggleStats.addEventListener('change', (e) => appState.setState({ statsConfig: { ...appState.getState().statsConfig, showStats: e.target.checked } }));
if (toggleStreak) toggleStreak.addEventListener('change', (e) => appState.setState({ statsConfig: { ...appState.getState().statsConfig, showStreak: e.target.checked } }));
if (toggleTopLangs) toggleTopLangs.addEventListener('change', (e) => appState.setState({ statsConfig: { ...appState.getState().statsConfig, showTopLangs: e.target.checked } }));
if (toggleTrophies) toggleTrophies.addEventListener('change', (e) => appState.setState({ statsConfig: { ...appState.getState().statsConfig, showTrophies: e.target.checked } }));
if (toggleSnake) toggleSnake.addEventListener('change', (e) => appState.setState({ statsConfig: { ...appState.getState().statsConfig, showSnake: e.target.checked } }));
if (toggleSpotify) toggleSpotify.addEventListener('change', (e) => appState.setState({ statsConfig: { ...appState.getState().statsConfig, showSpotify: e.target.checked } }));
if (toggleWakatime) toggleWakatime.addEventListener('change', (e) => appState.setState({ statsConfig: { ...appState.getState().statsConfig, showWakatime: e.target.checked } }));
if (toggleQuotes) toggleQuotes.addEventListener('change', (e) => appState.setState({ statsConfig: { ...appState.getState().statsConfig, showQuotes: e.target.checked } }));
if (toggleJokes) toggleJokes.addEventListener('change', (e) => appState.setState({ statsConfig: { ...appState.getState().statsConfig, showJokes: e.target.checked } }));

if (selectTheme) selectTheme.addEventListener('change', (e) => appState.setState({ activeTheme: e.target.value }));

const updateSocials = () => {
  appState.setState({
    socialLinks: {
      github: socialGithub ? socialGithub.value : '',
      linkedin: socialLinkedin ? socialLinkedin.value : '',
      instagram: socialInstagram ? socialInstagram.value : ''
    }
  });
};
if (socialGithub) socialGithub.addEventListener('input', updateSocials);
if (socialLinkedin) socialLinkedin.addEventListener('input', updateSocials);
if (socialInstagram) socialInstagram.addEventListener('input', updateSocials);

const updateDonations = () => {
  appState.setState({
    donations: {
      buymeacoffee: donationBmc ? donationBmc.value : '',
      kofi: donationKofi ? donationKofi.value : '',
      saweria: donationSaweria ? donationSaweria.value : ''
    }
  });
};
if (donationBmc) donationBmc.addEventListener('input', updateDonations);
if (donationKofi) donationKofi.addEventListener('input', updateDonations);
if (donationSaweria) donationSaweria.addEventListener('input', updateDonations);

// Add Project Button Handler
if (btnAddProject) {
  btnAddProject.addEventListener('click', () => {
    if (!projName.value) return showToast('⚠️ Isi nama proyek terlebih dahulu!');
    appState.addProject({
      name: projName.value,
      desc: projDesc.value,
      tech: projTech.value,
      repo: projRepo.value,
      demo: projDemo.value
    });
    projName.value = ''; projDesc.value = ''; projTech.value = ''; projRepo.value = ''; projDemo.value = '';
    showToast('📌 Proyek berhasil ditambahkan!');
  });
}

// Add Custom Section Button Handler
if (btnAddCustomSection) {
  btnAddCustomSection.addEventListener('click', () => {
    if (!customTitle.value) return showToast('⚠️ Isi judul section terlebih dahulu!');
    appState.addCustomSection({
      title: customTitle.value,
      content: customContent.value
    });
    customTitle.value = ''; customContent.value = '';
    showToast('📝 Section kustom berhasil ditambahkan!');
  });
}

badgeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const slug = btn.getAttribute('data-slug');
    appState.toggleTechBadge(slug);
  });
});

if (btnCopy) btnCopy.addEventListener('click', () => copyToClipboard(markdownOutput.textContent));
if (btnDownload) btnDownload.addEventListener('click', () => downloadMarkdownFile(markdownOutput.textContent));

// Render Awal
render(appState.getState());