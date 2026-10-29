/**
 * Markdown Compiler Engine (Complete with All Next-Level Widgets)
 */

export function generateMarkdown(state) {
  const { profile, techStack, statsConfig, socialLinks, projects, donations, customSections, sectionOrder, activeTheme } = state;
  let markdown = '';

  const githubUser = (socialLinks && socialLinks.github && socialLinks.github.trim() !== '') 
    ? socialLinks.github.trim() 
    : 'Luxy-cripto';

  const sectionBuilders = {
    header: () => {
      if (!profile.name && !profile.title) return '';
      let res = `<h1 align="center">Hi 👋, I'm ${profile.name || 'Your Name'}</h1>\n`;
      if (profile.title) {
        res += `<h3 align="center">${profile.title}</h3>\n\n`;
      }
      return res;
    },

    bio: () => {
      let bioText = '';
      if (profile.bio) bioText += `- 📝 ${profile.bio}\n`;
      if (profile.building) bioText += `- 🔭 I’m currently working on **${profile.building}**\n`;
      if (profile.learning) bioText += `- 🌱 I’m currently learning **${profile.learning}**\n`;
      return bioText ? `${bioText}\n` : '';
    },

    projects: () => {
      if (!projects || projects.length === 0) return '';
      let res = '### 🚀 Featured Projects\n\n';
      projects.forEach(p => {
        res += `#### 📌 [${p.name || 'Project Name'}](${p.repo || '#'})\n`;
        if (p.desc) res += `${p.desc}\n\n`;
        if (p.tech) res += `**Tech Stack:** \`${p.tech}\`\n\n`;
        if (p.demo) res += `🔗 [Live Demo](${p.demo})\n\n`;
      });
      return res;
    },

    techStack: () => {
      if (!techStack || techStack.length === 0) return '';
      let badges = '### 🛠️ Languages and Tools\n<p align="left">\n';
      techStack.forEach(slug => {
        badges += `  <img src="https://img.shields.io/badge/-${slug}-000?style=for-the-badge&logo=${slug}" alt="${slug}" />\n`;
      });
      badges += '</p>\n\n';
      return badges;
    },

    stats: () => {
      let statsMd = '';

      // Trophies
      if (statsConfig.showTrophies) {
        statsMd += `### 🏆 GitHub Trophies\n<p align="center">\n  <img src="https://github-profile-trophy.vercel.app/?username=${githubUser}&theme=${activeTheme}&no-frame=true&no-background=true" alt="GitHub Trophies" />\n</p>\n\n`;
      }

      // Stats & Streak
      if (statsConfig.showStats || statsConfig.showTopLangs || statsConfig.showStreak) {
        statsMd += '### 📊 GitHub Stats\n<p align="center">\n';
        if (statsConfig.showStats) {
          statsMd += `  <img src="https://github-readme-stats.vercel.app/api?username=${githubUser}&theme=${activeTheme}&show_icons=true" alt="GitHub Stats" />\n`;
        }
        if (statsConfig.showStreak) {
          statsMd += `  <img src="https://github-readme-streak-stats.herokuapp.com/?user=${githubUser}&theme=${activeTheme}" alt="GitHub Streak" />\n`;
        }
        if (statsConfig.showTopLangs) {
          statsMd += `  <img src="https://github-readme-stats.vercel.app/api/top-langs/?username=${githubUser}&theme=${activeTheme}&layout=compact" alt="Top Languages" />\n`;
        }
        statsMd += '</p>\n\n';
      }

      // Contribution Snake Game
      if (statsConfig.showSnake) {
        statsMd += `### 🐍 Contribution Snake Game\n<p align="center">\n  <img src="https://raw.githubusercontent.com/${githubUser}/${githubUser}/output/github-contribution-grid-snake.svg" alt="Snake Animation" />\n</p>\n\n`;
      }

      // WakaTime & Spotify
      if (statsConfig.showWakatime || statsConfig.showSpotify) {
        statsMd += '### 🎵 Music & Coding Activity\n<p align="center">\n';
        if (statsConfig.showWakatime) {
          statsMd += `  <img src="https://github-readme-stats.vercel.app/api/wakatime?username=${githubUser}&theme=${activeTheme}" alt="WakaTime Stats" />\n`;
        }
        if (statsConfig.showSpotify) {
          statsMd += `  <img src="https://novatorem-novatorem.vercel.app/api/spotify?background_color=${activeTheme}" alt="Spotify Currently Playing" />\n`;
        }
        statsMd += '</p>\n\n';
      }

      // Dev Quotes & Jokes
      if (statsConfig.showQuotes || statsConfig.showJokes) {
        statsMd += '### 💬 Daily Dev Quotes & Jokes\n<p align="center">\n';
        if (statsConfig.showQuotes) {
          statsMd += `  <img src="https://quotes-github-readme.vercel.app/api?type=horizontal&theme=${activeTheme}" alt="Dev Quote" />\n`;
        }
        if (statsConfig.showJokes) {
          statsMd += `  <img src="https://readme-jokes.vercel.app/api?theme=${activeTheme}" alt="Dev Joke" />\n`;
        }
        statsMd += '</p>\n\n';
      }

      return statsMd;
    },

    socials: () => {
      const activeSocials = Object.entries(socialLinks || {}).filter(([_, url]) => url && url.trim() !== '');
      if (activeSocials.length === 0) return '';
      let socialMd = '### 📫 Connect with me\n<p align="left">\n';
      activeSocials.forEach(([platform, url]) => {
        let fullUrl = url;
        if (platform === 'github' && !url.startsWith('http')) {
          fullUrl = `https://github.com/${url}`;
        }
        socialMd += `  <a href="${fullUrl}" target="_blank"><img src="https://img.shields.io/badge/-${platform}-181717?style=for-the-badge&logo=${platform}" alt="${platform}" /></a>\n`;
      });
      socialMd += '</p>\n\n';
      return socialMd;
    },

    donations: () => {
      const activeDonations = Object.entries(donations || {}).filter(([_, val]) => val && val.trim() !== '');
      if (activeDonations.length === 0) return '';
      let res = '### ☕ Support Me\n<p align="left">\n';
      activeDonations.forEach(([platform, val]) => {
        if (platform === 'buymeacoffee') {
          res += `  <a href="https://www.buymeacoffee.com/${val}" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="40" /></a>\n`;
        } else if (platform === 'kofi') {
          res += `  <a href="https://ko-fi.com/${val}" target="_blank"><img src="https://ko-fi.com/img/githubbutton_sm.svg" alt="Ko-fi" height="40" /></a>\n`;
        } else if (platform === 'saweria') {
          res += `  <a href="https://saweria.co/${val}" target="_blank"><img src="https://img.shields.io/badge/Saweria-Support-orange?style=for-the-badge&logo=saweria" alt="Saweria" /></a>\n`;
        }
      });
      res += '</p>\n\n';
      return res;
    },

    customSections: () => {
      if (!customSections || customSections.length === 0) return '';
      let res = '';
      customSections.forEach(sec => {
        if (sec.title) res += `### ${sec.title}\n`;
        if (sec.content) res += `${sec.content}\n\n`;
      });
      return res;
    }
  };

  sectionOrder.forEach(section => {
    if (sectionBuilders[section]) {
      markdown += sectionBuilders[section]();
    }
  });

  return markdown;
}