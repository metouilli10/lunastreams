# Luna Streams – Technical SEO Checklist (Cursor + Vercel)

## 🎯 Goal
Ensure Luna Streams ranks fast, loads fast, and is crawlable across Google Australia (`google.com.au`) by maintaining perfect technical SEO fundamentals.

This checklist applies to:
- Homepage `/`
- Pricing `/pricing`
- FAQ-Legal `/faq-legal`
- Blog `/blog/...`
- Setup pages `/au/...`

---

## ⚙️ 1. Core Web Vitals (Performance)

| Metric | Target | How to Fix / Maintain |
|---------|---------|-----------------------|
| **LCP (Largest Contentful Paint)** | < 1.8s | Lazy-load hero images, use `next/image` or Cloudflare Images |
| **FID / INP (Interaction Latency)** | < 100ms | Reduce JavaScript bundle; code-split components |
| **CLS (Cumulative Layout Shift)** | < 0.1 | Reserve space for images/videos (use `aspect-ratio`) |
| **TTFB (Time to First Byte)** | < 300ms | Use Vercel edge functions + caching |
| **Page weight** | < 1MB | Compress images with `imagemin` or TinyPNG |
| **Responsive design** | ✅ | Test on desktop, tablet, mobile, smart TV |

✅ **Tooling:**  
- Run `npx next build && npx next export && npx vercel --prod`  
- Check live performance in **Google PageSpeed Insights** (AU server if possible)

---

## 🧭 2. Metadata & Structured Data

### Required on every main page:

| Element | Implementation Tip |
|----------|--------------------|
| **Title tag** | 55–65 chars, include “Australia” |
| **Meta description** | 140–160 chars, include “IPTV” and “Luna Streams” |
| **Canonical URL** | Absolute URL with `https://lunastreams.net/...` |
| **OG Tags** | Include `og:image`, `og:title`, and `og:description` |
| **Twitter Cards** | Use `summary_large_image` |
| **Language** | `<html lang="en-AU">` |
| **Robots tag** | `<meta name="robots" content="index,follow">` |

### Schema (JSON-LD)

Use `next/head` or inject via `<Script type="application/ld+json">`.

**Homepage**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Luna Streams",
  "url": "https://lunastreams.net",
  "logo": "https://lunastreams.net/logo.webp",
  "sameAs": ["https://facebook.com/lunastreams", "https://instagram.com/lunastreams"]
}


Pricing Page
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Luna Streams IPTV Subscription",
  "description": "Premium IPTV subscription plans in Australia with HD channels.",
  "brand": "Luna Streams",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "AUD",
    "price": "89.00",
    "availability": "https://schema.org/InStock"
  }
}

FAQ Page
Use FAQPage schema for each question → answer pair.

🔍 3. Sitemap, Robots & Canonicals
FileImplementationsitemap.xmlAuto-generate with next-sitemaprobots.txtAllow all except /wp-admin (if any legacy)Canonical URLsAlways absolute, no query parametershreflang (optional)For English variants: en-AU, en-US if expanding later
Example next-sitemap.config.js:
module.exports = {
  siteUrl: 'https://lunastreams.net',
  generateRobotsTxt: true,
  priority: 0.7,
  changefreq: 'monthly',
};


🧱 4. Internal Linking & Site Architecture
RuleImplementationHomepage → Pricing“View IPTV Plans”Homepage → FAQ“Is IPTV Legal in Australia?”Blog → Pricing“Compare IPTV Plans in AUD”Blog → Homepage“Best IPTV Australia”Setup guides → FAQ“Learn about IPTV legality”BreadcrumbsImplement BreadcrumbList schema for all main pages
Ideal Structure:
/        → Homepage
/pricing → Conversion page
/faq-legal → Authority + trust
/au/... → Setup / localized pages
/blog/... → Educational content


🧩 5. Content Optimization & Keyword Mapping
PagePrimary KeywordSecondary Keywords/iptv australiabest iptv australia, affordable iptv/pricingiptv plans australiacheap iptv australia, iptv free trial/faq-legalis iptv legal in australiasafe iptv provider australia/blogiptv australia guidefirestick iptv australia, kayo alternatives/au/firestick-setupfirestick iptv australiainstall iptv fire tv stick
✅ Checklist:


Primary keyword in title, H1, meta, and URL


Secondary keywords in H2s and FAQs


Avoid keyword cannibalization (unique focus per page)


Internal link anchor text = main keyword



📡 6. Indexing, Crawling & GSC Setup
TaskDescriptionAdd property to Google Search ConsoleVerify via DNS or HTML tagSubmit sitemap.xml/sitemap.xmlCheck Coverage report weeklyFix 404s and “Crawled – currently not indexed”Exclude staging URLsUse robots.txt or noindex metaMonitor Core Web Vitals reportOptimize each URL individually

🔐 7. Security & Technical Trust
FeatureImplementationHTTPSAuto-managed by Vercel (SSL certificate)HSTSEnabled by default on VercelPrivacy PolicyLink in footer /privacy-policyTerms of ServiceLink in footer /termsCookie ConsentAdd banner for GDPR/CCPA complianceSecure PaymentsStripe + PayPal with visible trust badgesGDPR / Data RetentionMention “We store user data securely in encrypted servers.”

🪶 8. Page Speed Enhancements (Next.js / Cursor)


Use Vercel Edge Caching


Import images with next/image (automatic WebP conversion)


Use loading="lazy" for all non-hero images


Defer non-critical scripts (chat widgets, analytics)


Implement font-display: swap for custom fonts


Bundle analysis: ANALYZE=true next build


Prefetch important routes:
import Link from 'next/link';
<Link href="/pricing" prefetch>Pricing</Link>




🧠 9. Analytics & Tracking
ToolUseGoogle Analytics 4 (GA4)Measure traffic, conversion, regionGoogle Tag Manager (GTM)Manage tags, pixelsHotjar / Microsoft ClarityBehavior heatmapsConversion TrackingTrack “Start Trial” button clicksUTM LinksTag campaigns (Facebook, Reddit ads)

🧩 10. Ongoing SEO Maintenance


✅ Update all prices, offers, and plan details quarterly.


🧭 Refresh meta titles with year tags (e.g., “Best IPTV in Australia 2025”).


🧱 Check for broken internal links with ahrefs.com or screaming frog.


📅 Run Lighthouse audits monthly.


🔄 Regenerate sitemap after adding new blog posts.


🔗 Acquire backlinks from tech blogs, Reddit, and AU IPTV comparison sites.


⚖️ Keep legal page updated if IPTV regulations change in Australia.



📈 Bonus: Launch SEO QA Checklist


 Homepage indexed & appears for “Luna Streams” brand name


 Pricing page indexed with price-rich snippet


 FAQ page eligible for rich results


 Sitemap.xml submitted


 No duplicate titles or meta descriptions


 All internal links functional


 Mobile layout verified


 HTTPS enforced site-wide


 Core Web Vitals green in Search Console


 CDN caching validated (Vercel Edge, Cloudflare optional)



✅ Pro tip:
After full deployment, use site:lunastreams.com iptv australia in Google to confirm correct indexing and snippet appearance.

🧾 Credits
Created for Luna Streams IPTV (Australia)
Technical SEO by ChatGPT (GPT-5) — tailored for Cursor + Vercel environment.
Last updated: November 2025

---

Would you like me to generate a **sixth `.md` file** next — a **backlink & outreach strategy** (for guest posts, forums, and tech websites in Australia to quickly boost authority)?
