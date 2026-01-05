# GTM Planetary Website Migration TODO

## Core Features
- [x] Hero section with animated background and neon 'WHERE TRADES MEET AI' tagline
- [x] About section with video introduction and company overview
- [x] Services section (AI Consulting, Custom AI Solutions, Automation Implementation, Fractional System Enablement)
- [x] Products section (Custom AI Agent Workforce)
- [x] Who We Serve section (Trade Businesses and Skilled Professionals)
- [x] Pricing section (Standard, Plus, Premium, Enterprise packages + add-ons)
- [x] Contact section with interactive form and contact information
- [x] Navigation menu with smooth scrolling (HOME, ABOUT, SERVICES, WHO WE SERVE, PRICING, CONTACT)

## Technical Implementation
- [x] Copy and integrate existing TailwindCSS styles from original repository
- [x] Migrate custom animations and effects
- [x] Copy all Radix UI components from original
- [x] Copy public assets (images, videos, icons)
- [x] Update database schema for contact_submissions table
- [x] Implement contact form with database integration
- [x] Set up smooth scroll navigation
- [x] Configure routing in App.tsx

## Testing & Deployment
- [x] Test all sections and animations
- [x] Test contact form submission
- [x] Verify database storage
- [x] Create checkpoint for deployment

## Bug Fixes
- [x] Fix MEET AI neon animation to match live site
- [x] Fix phone number shake/vibrate animation
- [x] Remove all blue color references - brand is purple only

## Additional Fixes Needed
- [x] Add Font Awesome icons to service cards
- [x] Fix card background colors to match original (darker blue/purple)
- [x] Ensure MEET AI text styling matches original exactly
- [x] Verify all icon classes are correct (fa-brain, fa-code, fa-plug, fa-sync-alt, etc.)

## Critical Fixes Required
- [x] Fix MEET AI text to stay on same line as WHERE TRADES (not wrap)
- [x] Change ALL section backgrounds from blue to pure black
- [x] Change service card backgrounds from blue (#1a1a3e) to black
- [x] Change pricing card backgrounds to black with purple borders
- [x] Remove all blue/purple background colors - only black backgrounds allowed
- [x] Ensure MEET AI text size matches WHERE TRADES text size

## SEO Improvements
- [x] Add meta description (50-160 characters)
- [x] Add meta keywords
- [x] Add Open Graph tags for social sharing
- [ ] Add structured data for business information

## SEO Optimization Fixes
- [x] Reduce keywords from 10 to 5-7 focused terms
- [x] Shorten meta description from 175 to under 160 characters

## Notification System
- [x] Add Manus notification system for contact form submissions
- [x] Send owner notification with contact details when form is submitted

## Mobile Responsiveness Fixes
- [x] Fix hero title text overflow on mobile (WHERE TRADES MEET AI)
- [x] Replace video with text content in About section (video file too large for git)

## Visual Design Updates
- [x] Change MEET AI text color from purple to green
