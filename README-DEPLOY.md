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

## Recovery Lab release — 18 November 2026
- Preserve the existing Vercel project and canonical www host. Upload the contents of this ZIP to the repository root, including `author/`, `lab/`, `assets/`, and `tools/`.
- Author/contact: Putri Dahlia / mylogolemon@gmail.com. Publisher ID: ca-pub-9278916846563994. Existing validated ads.txt text is retained. AdSense script is present on editorial pages, not lab/tool pages; configure consent and Auto ads exclusions in the publisher account before ad serving, as applicable.
- 48 HTML pages, including 18 original evergreen guides, 3 illustrative recovery cases, 2 update explainers, 12 tools, author profile and Recovery Lab. All 21 guides/cases received a topic-specific exercise. No fabricated device tests or credentials.
- Recovery Lab includes 3 disposable files, computed expected hashes, 4 exercises and a CSV log template. File processing is local with a 64 MiB per-file limit.
- Validation: internal file URLs resolved and JSON-LD parsed; JavaScript syntax checked. Seven new form/calculation tools tested in Chromium with isolated markup. Three file tools tested using their actual JS with Node Web Crypto and a mock DOM (matching, altered, checksum and duplicate group). Full HTTPS navigation in Chromium was blocked by environment policy; deployed site, responsive visual rendering, existing tools and actual HTTPS file-selection flow still require verification.
- Post-deploy: verify custom domain and production deployment, open /lab/ and /tools/, test selected files over HTTPS (original vs identical: MATCH; original vs altered: DIFFERENT), inspect ads.txt and sitemap, check mobile navigation, and test Google Search Console live URL. Configure consent where required. AdSense approval is not guaranteed; consult the actual rejection reason.
