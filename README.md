# Outreach AI

Finds people who engage with your LinkedIn posts and YouTube videos, scores them, enriches their profiles, and writes personalized outreach using Claude AI.

## What it does
You add companies and employees you want to monitor. The system scrapes their LinkedIn posts and YouTube videos for engagement. Every person who likes or comments becomes a lead. Each lead gets scored, enriched with email and title data, and gets two AI-written messages, one for LinkedIn DM and one for email. Everything exports to Google Sheets for your sales team.

## Features

**Discovery**
- Captures likes and comments from monitored LinkedIn posts
- Scrapes YouTube video comments for additional leads
- Auto-discovers employees at target companies via Bright Data
- Bulk CSV import for employee lists

**Scoring and enrichment**
- Scores each lead 0 to 100 based on seniority, engagement type, and ICP match
- Filters out irrelevant profiles like students, recruiters, and competitors
- Enriches with work email, verified title, and company through Apollo.io, ZoomInfo, or LeadIQ

**AI outreach**
- Claude writes two message versions per lead, LinkedIn DM and email
- Each message references the specific post or comment they engaged with
- Follows your brand voice and tone rules
- BDRs edit inline before sending

**Tracking and export**
- One-click export to Google Sheets
- Tracks sent, replied, connected, ignored
- Dashboard with conversion funnel and daily trends
- Admin and viewer roles

## Tech stack
- Next.js 16, React 19, Tailwind CSS
- Prisma ORM with SQLite or Turso
- Anthropic Claude API
- Bright Data Web Scraper API
- Apollo.io, ZoomInfo, LeadIQ
- Google Sheets API

---

## Setup and usage guide
This walks you through everything from installing the app to sending your first outreach. No dev background needed.

### 1. Install Node.js
Download and install Node.js from https://nodejs.org. Pick the LTS version. Run the installer with default settings.

To verify it worked, open a terminal and type:
```
node --version
```
You should see a version number.

### 2. Download the project
Open a terminal and run:
```
git clone https://github.com/iamdvirsharon/outreach-ai.git
cd outreach-ai
npm install
```
This downloads the code and installs everything it needs. Takes a few minutes.

### 3. Configure your API keys
In the project folder, find the file called `.env.example`. Make a copy of it and rename the copy to `.env.local`. Open it in any text editor and fill in your keys.

The minimum to get the app running:
```
DATABASE_URL=file:./data/linkedin-outreach.db
ADMIN_PASSWORD=pick-a-password
VIEWER_PASSWORD=pick-another-password
INTERNAL_API_KEY=any-random-string
CRON_SECRET=any-random-string
NEXTAUTH_URL=http://localhost:3000
```

To actually scrape and generate outreach, you also need:
- `BRIGHT_DATA_API_KEY` from your Bright Data dashboard
- `ANTHROPIC_API_KEY` from console.anthropic.com
- At least one enrichment provider key, Apollo or ZoomInfo or LeadIQ

### 4. Start the app
Run these two commands in the terminal:
```
npx prisma db push
npm run dev
```
The first command creates your database. The second starts the app. Open your browser and go to http://localhost:3000.

Log in with whatever you set as `ADMIN_PASSWORD`.

### 5. Set up your ICP and brand voice
Go to **Settings** in the sidebar.

Under **Brand voice**, create a profile that tells the AI how to write your outreach. Set your company name, tone guidelines, and rules like "be direct, skip the flattery".

Under **ICP**, define your ideal customer:
- Target titles like VP, Director, Head of, CTO. These get a scoring boost.
- Exclude titles like Student, Intern, Recruiter. These get filtered out.
- Set target countries where your sales team operates.
- Set a minimum lead score. Only leads above this number get outreach drafts.

### 6. Add companies to monitor
Go to **Companies**. Click **Add Company** and paste a LinkedIn company URL.

Then add the employees whose posts you want to track:
- Click the company, then **Add Employee**, and paste their LinkedIn profile URL
- Or upload a CSV with columns for name, LinkedIn URL, and role
- Or click **Discover Employees** to let Bright Data find them automatically

### 7. Run your first scrape
On the Companies page, click **Scrape** next to a company. The system will fetch their recent posts, grab every person who engaged, pull their LinkedIn profiles, score them, and generate outreach drafts for the qualified ones.

Watch the progress on the **Dashboard**.

### 8. Add YouTube videos
Go to **YouTube**. Paste video URLs, one per line. Click **Scrape Comments**. Commenters go through the same scoring and draft pipeline.

### 9. Enrich your leads
Go to **Engagers**. Select the leads you want to enrich, click **Enrich**, pick your provider, and name the batch. This finds their work emails and confirms their current titles.

### 10. Review and send
Go to **Outreach Drafts**. Each lead has a LinkedIn DM and an email version ready. Edit if needed, copy to clipboard, and paste into LinkedIn or your email client. Mark outcomes as you go, replied, connected, or ignored.

### 11. Export
Click **Export to Sheets** to push all leads with their enriched data and drafts to your Google Sheet.

---

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | Use `file:./data/linkedin-outreach.db` for local |
| `TURSO_AUTH_TOKEN` | Cloud DB only | Turso auth token |
| `ADMIN_PASSWORD` | Yes | Full access password |
| `VIEWER_PASSWORD` | Yes | Read-only access password |
| `INTERNAL_API_KEY` | Yes | Internal API secret |
| `CRON_SECRET` | Yes | Scheduled jobs secret |
| `BRIGHT_DATA_API_KEY` | Yes | From brightdata.com dashboard |
| `BRIGHT_DATA_POSTS_DATASET` | Yes | LinkedIn posts dataset ID |
| `BRIGHT_DATA_COMMENTS_DATASET` | Yes | LinkedIn comments dataset ID |
| `BRIGHT_DATA_PROFILES_DATASET` | Yes | LinkedIn profiles dataset ID |
| `BRIGHT_DATA_LIKERS_DATASET` | No | Post likers, 5 to 10x more leads |
| `BRIGHT_DATA_COMPANY_DATASET` | No | Employee auto-discovery |
| `BRIGHT_DATA_YOUTUBE_COMMENTS_DATASET` | No | YouTube comment scraping |
| `APOLLO_API_KEY` | One enrichment | apollo.io |
| `ZOOMINFO_CLIENT_ID` | provider | zoominfo.com |
| `ZOOMINFO_PRIVATE_KEY` | required | zoominfo.com |
| `LEADIQ_API_KEY` | | leadiq.com |
| `ANTHROPIC_API_KEY` | Yes | From console.anthropic.com |
| `CLAUDE_MODEL` | No | Defaults to claude-sonnet-4-6 |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | For export | Google Cloud service account |
| `GOOGLE_SERVICE_ACCOUNT_KEY` | For export | Service account JSON key |
| `GOOGLE_SHEET_ID` | For export | Target spreadsheet ID |

## How it works

```
LinkedIn posts + YouTube videos
        |
   Bright Data API -- scrapes engagements and profiles
        |
   Lead scoring -- ICP match, seniority, engagement quality
        |
   Enrichment -- Apollo / ZoomInfo / LeadIQ for emails and titles
        |
   Claude AI -- personalized LinkedIn DM + email drafts
        |
   Google Sheets -- export for sales team
```

## License
MIT
