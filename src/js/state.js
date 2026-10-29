/**
 * Central State Manager (Single Source of Truth - Extended)
 */

const defaultState = {
  profile: {
    name: '',
    title: '',
    bio: '',
    learning: '',
    building: ''
  },
  techStack: [],
  statsConfig: {
    showStats: true,
    showTopLangs: true,
    showStreak: true,
    showTrophies: true
  },
  socialLinks: {
    github: '',
    linkedin: '',
    twitter: '',
    instagram: ''
  },
  projects: [], // [{ id, name, desc, tech, repo, demo }]
  donations: {
    buymeacoffee: '',
    kofi: '',
    saweria: ''
  },
  customSections: [], // [{ id, title, content }]
  sectionOrder: ['header', 'bio', 'projects', 'techStack', 'stats', 'socials', 'donations', 'customSections'],
  activeTheme: 'tokyo-night'
};

class StateManager {
  constructor() {
    this.state = JSON.parse(JSON.stringify(defaultState));
    this.listeners = [];
  }

  getState() {
    return this.state;
  }

  setState(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
  }

  updateProfile(profileData) {
    this.state.profile = { ...this.state.profile, ...profileData };
    this.notify();
  }

  toggleTechBadge(badgeSlug) {
    const index = this.state.techStack.indexOf(badgeSlug);
    if (index === -1) {
      this.state.techStack.push(badgeSlug);
    } else {
      this.state.techStack.splice(index, 1);
    }
    this.notify();
  }

  // --- Helper Metode Proyek Showcase ---
  addProject(project) {
    this.state.projects.push({ id: Date.now(), ...project });
    this.notify();
  }

  removeProject(id) {
    this.state.projects = this.state.projects.filter(p => p.id !== id);
    this.notify();
  }

  // --- Helper Metode Section Kustom ---
  addCustomSection(section) {
    this.state.customSections.push({ id: Date.now(), ...section });
    this.notify();
  }

  removeCustomSection(id) {
    this.state.customSections = this.state.customSections.filter(s => s.id !== id);
    this.notify();
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const appState = new StateManager();