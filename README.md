# AD Homelab Tutorial

This repository contains the source code for a beginner-friendly, step-by-step guide to building an Active Directory homelab using VirtualBox, Windows Server 2025, and Windows 11.

**If you want to follow the tutorial, you don't need anything in this repository. Read the guide on the website:**

**>>> https://ad-homelab-tutorial.netlify.app <<<**

Everything below is only for developing the website itself.

---

## Site development

The site is built with [Astro Starlight](https://starlight.astro.build/) and deploys automatically to Netlify on every push to `main`.

### Local preview

Requires Node.js 20+.

```
npm install
npm run dev
```

The site runs at http://localhost:4321

### Content

Guide content lives in `src/content/docs/` as Markdown. Sidebar order is set in `astro.config.mjs`.

## License

MIT. See [LICENSE](LICENSE).
