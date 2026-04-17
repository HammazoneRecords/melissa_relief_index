<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Melissa Relief Tracker

A comprehensive accountability and relief tracking dashboard for Hurricane Melissa, featuring donation tracking, community needs assessment, and AI-driven impact predictions.

## Data Model - What the App Captures

### Core Data Types

**1. Donations** 📊
- Donor details (name, type: Individual/NGO/Gov/Company/Artist/Diaspora/Influencer/YouTuber)
- Amount in JMD, donation type (Cash/Supplies/Service/Equipment/Food)
- Date, status (Pledged/Received/Verified/Distributed/Delayed/Failed)
- Target parish, source URL (required for verification)
- Notes field

**2. Community Reports** 📍
- Parish & community location
- Reporter type (Resident/Volunteer/Official)
- Severity level (Low/Medium/High/Critical)
- Issue description with verified/disputed counts
- Timestamp and source URL

**3. Government Promises** ⚖️
- Title, description, promised completion date
- Budget allocation vs actual spending
- Progress percentage and current status
- Implementing ministry and source URL

**4. Key Performance Indicators** 📈
- Total cash received, in-kind value, disbursements
- Families helped, active agencies, critical zones identified

### Derived Data & Features

**Parish-Level Analytics** 🗺️
- Donation totals by parish
- Severity heatmaps from community reports
- Geographic distribution visualization

**AI Analysis Engine** 🤖
- Predictive analytics on supply chain risks
- Impact assessment and recommendations
- Pattern recognition in relief distribution

**Admin Functionality** 🔐
- Source URL verification (prevents duplicate entries)
- Real-time data entry forms for all data types
- Export capabilities (CSV downloads)

## Data Sources

This app includes verified data from official government and NGO sources:
- **Timeline & Events**: `playground/2026-04-hurricane-melissa-response/2026-04-hurricane-melissa-response-timeline.md`
- **Verified Metrics**: `data/verifiedData.ts` - Government promises, community reports, and key statistics with source citations
- **ODPEM Dashboard Data**: Real-time operational metrics from https://supportjamaica.gov.jm/dashboard
- **Mock Data**: `data/mockData.ts` - Sample data for development and testing

## Data Coverage

**✅ Captured:**
- Government promises and budget tracking
- International aid (Belgian generators, Salvation Army operations)
- Infrastructure restoration (JPS 96%, NWC 94%, Telecom 95%)
- Community impact reports and casualty figures
- Donation totals and relief fund status

**📋 Remaining Gaps (from ODPEM Dashboard):**
- Parish-level emergency response team deployments
- Real-time curfew status updates
- Social media engagement metrics
- JCF security operation details
- Daily food package distribution updates

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Data Integrity

All data entries include source URLs for verification. The app prioritizes transparency and accountability in relief tracking.
