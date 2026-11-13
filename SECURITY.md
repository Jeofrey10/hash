# HASH.DEVS — Security Policy & Guidelines

## 1. Scope & Objective

As a client-facing web application and digital presence, HASH.DEVS adheres to strict client-side security standards to safeguard user privacy, protect brand integrity, and ensure resilience against modern web vulnerabilities.

---

## 2. Core Security Practices

### 2.1 Dependency Hygiene
- Regular vulnerability scanning using `npm audit`.
- Zero unnecessary dependencies. Only vetted, established open-source packages (React, Vite, Tailwind CSS, Playwright) are included.
- Strict lockfile maintenance (`package-lock.json`) to prevent supply chain tampering.

### 2.2 Content Security Policy (CSP) Directives
When deploying to production, the server environment must deliver robust HTTP security headers:

```http
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none';
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### 2.3 Cross-Site Scripting (XSS) Prevention
- React 19's native JSX escaping is strictly enforced.
- Never use `dangerouslySetInnerHTML` unless rendering pre-sanitized, trusted SVG paths.
- All user inputs in future contact forms must be strictly validated on both client and API boundaries.

### 2.4 External Links & Safe Referrers
- Any external hyperlink must declare `rel="noopener noreferrer"` to prevent tab-napping and referrer leaks.

### 2.5 Secret & Credential Management
- No API keys, database credentials, or secret tokens may ever be stored in client-side code or committed to version control.
- Any future environment configurations must use `.env.local` (ignored in `.gitignore`).

### 2.6 Form Intake & Submission Security (Stage 10)
- **Input Sanitization & Trimming:** All user input fields in `src/sections/ContactSection.tsx` and `src/lib/inquirySubmission.ts` are strictly stripped of dangerous characters, whitespace-trimmed, and validated against max length bounds before network serialization.
- **Email Validation:** RFC 5322 regex checks are performed to ensure syntactic validity prior to payload transmission.
- **No Secret Exposure in Frontend:** The submission adapter interacts with the endpoint (`VITE_INQUIRY_API_ENDPOINT` or `/api/inquiry`) without exposing backend service-role keys or database credentials in client bundles.
- **Privacy Assurance:** The form collects only project-relevant parameters (services, description, preliminary goals, contact info) and explicitly refrains from harvesting marketing data, unnecessary third-party cookies, or sensitive business secrets.
- **No False Success Simulation:** Production code strictly gates the success confirmation state behind a verified HTTP 2xx server response with a valid inquiry ID.

---

## 3. Vulnerability Reporting

If any security issue is identified within the codebase or build pipeline, notify the project lead immediately for rapid remediation.

