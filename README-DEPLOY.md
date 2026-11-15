# BackupHarbor — AdSense quality & canonical revision (15 Nov 2026)

This update is intended to improve editorial value and technical consistency. **It cannot resolve an AdSense account-level disapproval or guarantee site approval.**

## What changed
- 3 substantial fictional case studies: overwritten spreadsheet, family-photo handoff, and external-drive restore rehearsal. Each includes source links, a verification matrix and a safe checklist.
- 6 existing guides strengthened with case-specific exercises; original guides and both functional tools remain.
- Homepage now links to the scenario library; guide index includes the new pages.
- Canonical, Open Graph, JSON-LD, and sitemap aligned with `https://www.backupharbor.site`, because the live root was observed redirecting to that host on 15 Nov 2026. If you change the primary hostname later, replace the hostname consistently BEFORE deploying.
- Site brand BackupHarbor, contact `mylogolemon@gmail.com`, AdSense `ca-pub-9278916846563994` unchanged.
- Updated editorial changes disclosure and additional vendor source index.

## Deployment
1. Replace repository contents with the contents of this ZIP. Keep `index.html`, `ads.txt`, `robots.txt`, `sitemap.xml` and `vercel.json` at repo root. Do not nest inside an extra folder.
2. Set **www.backupharbor.site** as the Vercel primary domain and redirect `backupharbor.site` → `www.backupharbor.site` with a permanent redirect, OR, if you prefer the apex, choose apex as primary and change ALL www references here first. Never configure reciprocal redirect loops.
3. Check these exact live addresses from your own browser: `https://www.backupharbor.site/`, `/ads.txt`, `/robots.txt`, `/sitemap.xml`, `/guides/`, and the new case studies.
4. Re-submit the correct canonical hostname and sitemap in Google Search Console; inspect major URLs and indexing availability. Check that `https://backupharbor.site/` redirects only once to the chosen canonical host.
5. Check AdSense → Sites and Account setup, plus the original rejection email. The screenshot shows **account application not approved**, which could be due to account identity/duplicate account/payment settings, not solely content. If multiple AdSense publisher IDs are under the same payee, check Google's one-account policy; do not create new accounts to work around a rejection.
6. Only request a new review when the site is accessible and the stated account issues have been addressed. Do not misrepresent the content or publisher identity.

## Quality and safety notes
- Three new scenarios are explicitly **fictional** and not testimonials or measured experiments.
- The site does not ask visitors to upload data or passwords. Existing browser-only tools remain.
- Ads verification script is unchanged on homepage + article pages; no extra artificial ad blocks added.
- Review GDPR/EEA/UK/Switzerland consent requirements with a certified CMP if those visitors may see personalized Google ads. Privacy text alone is not a CMP.
- Google may reject for factors inaccessible to this code audit. No approval estimate or guarantee.
