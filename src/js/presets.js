/**
 * Preset Templates Loader
 */

export const presets = {
  minimalist: {
    profile: {
      name: 'Wandi Wijaya',
      title: 'Full-Stack Web Developer',
      bio: 'Suka membangun aplikasi web yang cepat, estetik, dan responsif.',
      building: '',
      learning: ''
    },
    techStack: ['html5', 'css3', 'javascript', 'tailwind', 'laravel'],
    statsConfig: { showStats: true, showTopLangs: false },
    activeTheme: 'tokyo-night',
    socialLinks: { github: 'Luxy-cripto', linkedin: '', instagram: '' }
  },

  fullstack: {
    profile: {
      name: 'Wandi Wijaya',
      title: 'Senior Full-Stack Engineer & AI Enthusiast',
      bio: 'Fokus pada pengembangan aplikasi web dan mobile modern berbasis Laravel, Vue, dan Flutter.',
      building: 'Aplikasi AI Assistant & Web SaaS Generator',
      learning: 'TypeScript & Cloud Architecture'
    },
    techStack: ['javascript', 'typescript', 'php', 'laravel', 'vue.js', 'react', 'tailwindcss', 'python', 'mysql', 'git'],
    statsConfig: { showStats: true, showTopLangs: true },
    activeTheme: 'dracula',
    socialLinks: { 
      github: 'Luxy-cripto', 
      linkedin: 'https://linkedin.com/in/wandi-wijaya', 
      instagram: 'https://instagram.com/wandi' 
    }
  },

  student: {
    profile: {
      name: 'Wandi Wijaya',
      title: 'Software Engineering Student @ SMK Assalaam',
      bio: 'Siswa Rekayasa Perangkat Lunak yang antusias belajar web development dan game programming.',
      building: 'Game retro Python & Web Dashboard',
      learning: 'Next.js & REST API'
    },
    techStack: ['html5', 'css3', 'javascript', 'php', 'python', 'flutter', 'git'],
    statsConfig: { showStats: true, showTopLangs: true },
    activeTheme: 'catppuccin',
    socialLinks: { github: 'Luxy-cripto', instagram: 'https://instagram.com/wandi' }
  }
};