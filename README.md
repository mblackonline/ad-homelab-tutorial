# AD Homelab Tutorial

This repository contains the source code for a beginner-friendly, step-by-step guide to building an Active Directory homelab using VirtualBox, Windows Server 2025, and Windows 11.

**If you want to follow the tutorial, you don't need anything in this repository. Read the guide on the website:**

**>>> https://YOUR-SITE.netlify.app <<<**

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

All guide content lives in `src/content/docs/` as Markdown files. Sidebar order is defined in `astro.config.mjs`. The network diagram source is `src/assets/nat-network-diagram.drawio` (edit in [draw.io](https://app.diagrams.net/), export as PNG with a white background).

## License

MIT. See [LICENSE](LICENSE).
