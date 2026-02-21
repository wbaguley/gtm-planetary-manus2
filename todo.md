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
- [x] Revert MEET AI text color back to original purple

## Footer and Legal Pages
- [x] Update copyright year from 2025 to 2026
- [x] Create Privacy Policy page
- [x] Create Terms & Conditions page

## Contact Section Updates
- [x] Remove contact form
- [x] Replace with contact information only

## Blog System (OpenAI Cookbook Style)
- [x] Fix broken /blog page (currently 404)
- [x] Create blog hub with colorful topic category tiles
- [x] Build blog post grid with cards (date, author, title, tags)
- [ ] Add search functionality for blog posts
- [ ] Implement "Load More" button for pagination
- [x] Create blog post template with markdown rendering
- [x] Add "View as Markdown" button to blog posts
- [x] Add "Open in GitHub" button to blog posts
- [x] Upload first blog post (RecursiveLargeModelCookbook.md)

## Remaining Blog Tasks
- [x] Add BLOG link to navigation menu
- [x] Copy blog post markdown to public directory
- [ ] Configure GitHub URL for "Open in GitHub" button (currently points to wbaguley/GTM_Planetary_Site2)
- [ ] Test search functionality
- [ ] Test topic category filtering (clicking on topic tiles)
- [ ] Push all changes to GitHub repository

## Blog System Bug Fixes
- [x] Fix nested anchor tag error (console error: cannot contain a nested <a>)
- [x] Remove unnecessary "Open in GitHub" button duplicate (line 118)
- [x] Configure markdown modal to properly display raw markdown content
- [x] Add copy-to-clipboard buttons to code blocks for easy copying of prompts and code

## Blog System Additional Fixes
- [x] Fix remaining nested anchor tag error in blog post page
- [x] Add download markdown button to the markdown modal
- [x] Fix code block styling with proper border/box
- [x] Position copy button at top-right of code blocks

## Blog Page Logo Fix
- [x] Fix broken logo image on Blog page (line 53)

## Logo and Button Fixes
- [x] Fix broken logo on BlogPost page (line 81)
- [x] Check and fix logo on all other pages
- [x] Remove "Open in GitHub" button from BlogPost page (line 114)

## Fix All Nested Anchor Tags
- [x] Find all Link components with nested <a> tags across entire codebase
- [x] Fix all instances to prevent recurring console errors

## Blog Article Update
- [x] Replace RecursiveLargeModelCookbook.md with restructured version

## Update Author Avatar Image
- [x] Copy attached image to public directory
- [x] Update BlogPost.tsx to use new avatar image path

## Blog Post Spacing and Typography Fixes
- [x] Increase line height for better readability
- [x] Add proper paragraph spacing between sections
- [x] Improve heading spacing and hierarchy
- [x] Optimize font sizes for mobile and desktop

## Fix List Formatting
- [x] Fix bullet point styling to show proper bullets instead of tiny dots
- [x] Fix numbered list formatting in TL;DR section

## Blog Admin System
- [x] Create database schema for blog posts (title, slug, content, author, date, tags, description)
- [x] Add tRPC procedures for blog CRUD (create, read, update, delete)
- [x] Build admin dashboard page at /admin/blog with authentication
- [x] Create blog post upload form with markdown file upload
- [x] Add metadata form fields (title, author, tags, date, description)
- [x] Implement blog post preview functionality
- [x] Add edit and delete capabilities for existing posts
- [x] Update Blog.tsx to fetch posts from database
- [x] Update BlogPost.tsx to fetch content from database
- [x] Test complete admin workflow

## Blog Filtering and Avatar Fix
- [x] Wire up topic tiles to filter blog posts by tags
- [x] Fix broken avatar icon on blog pages

## Update Blog Filters and Add Media Support
- [x] Update topic tiles to new categories (AI and Automation, Local Hosting, Beginner Guides, Intermediate Guides, Case Studies, Sovereign AI, Free)
- [x] Add image upload functionality to admin panel
- [x] Add video embed support to blog posts (YouTube, Vimeo, etc.)
- [x] Update existing blog post tags to match new categories

## Update Topic Tile Name
- [ ] Change "Free" to "Free Stuff" in Blog.tsx

## Blog Enhancements
- [x] Change "Free" to "Free Stuff" in topic tiles
- [x] Create database schema for newsletter subscriptions
- [x] Add tRPC procedures for newsletter subscription
- [x] Build newsletter subscription widget UI for blog
- [x] Add structured data (JSON-LD) to blog posts for SEO

## Fix Admin Page Redirect Issue
- [x] Diagnose why /admin/blog redirects to main page
- [x] Fix routing or authentication problem
- [x] Test admin page access

## Fix 404 on Published Site for /admin/blog
- [ ] Check App.tsx routing configuration
- [ ] Fix routing issue causing 404 on published site

## Add Hidden Login Link
- [x] Add subtle login link to footer (hard to see)
- [x] Improve AdminBlog to show login button instead of blank page

## Add Logout Functionality
- [x] Add logout button to admin blog header
- [x] Test logout functionality

## Website Redesign - Interactive Parallax & AI Focus
- [x] Research competitor messaging (custom AI agents/fine-tuned models companies)
- [x] Research trade business pain points (5-8 common frustrations)
- [x] Design new site structure and content strategy
- [x] Implement parallax scroll effects (multiple layers, different speeds)
- [x] Build floating card system for AI capabilities
- [x] Create hero section with clickable AI capability cards (Voice Agents, Document AI, etc.)
- [x] Build trade pain points section with interactive cards
- [x] Remove "Our Services" and "Our Products" sections
- [x] Remove pricing section entirely
- [x] Update about messaging (focus on AI models/agents for trades, not typical SaaS)
- [x] Update contact section styling (keep approach, update look/feel)
- [x] Maintain cyberpunk/neon aesthetic throughout
- [x] Test all animations and interactions
- [x] Optimize performance for smooth 60fps

## Differentiate Autonomous Agents from Chatbots
- [x] Research OpenClaw positioning and autonomous agent messaging
- [x] Rewrite AI capability cards to emphasize autonomous execution (not just chat)
- [x] Add section on custom fine-tuned models trained on trade-specific data
- [x] Remove all "chatbot" language and replace with "autonomous agent" / "operational AI"
- [x] Emphasize models trained on HVAC/plumbing/electrical/construction data
- [x] Show agents that DO work, not just answer questions
- [x] Test revised messaging

## 3D Morphing Objects & Scifi Retro Redesign
- [x] Implement 3D morphing hero section (text left, object right)
- [x] Create trade tools to AI elements morphing animation (continuous scroll-triggered)
- [x] Build scifi retro pain points section layout (no tiles)
- [x] Add different 3D morphing object for pain points section
- [x] Implement continuous scroll-triggered morphing for pain points
- [x] Add neon wireframes, holographic panels, terminal-style displays
- [x] Test animation performance and smoothness
- [x] Add WebGL fallback for environments without 3D support

## Professional 3D Visual Rebuild
- [x] Replace basic Three.js geometric shapes with professional particle system / glowing orb
- [x] Add proper shaders, glow effects, depth-of-field for premium look
- [x] Implement scroll-pinning (sticky sections) so animations play out during scroll
- [x] Rebuild pain points 3D visual to professional quality
- [x] Make morphing smooth and continuous as you scroll
- [ ] Test on published site to verify WebGL rendering

## AI-Themed Hero Images
- [x] Generate image 1: Wrench/pipe wrench morphing into circuit board / neural network
- [x] Generate image 2: Hardhat morphing into AI brain / neural network
- [x] Generate image 3: Blueprint/toolbox morphing into holographic data interface
- [x] Generate image 4: Trade tools dissolving into glowing AI particles / digital matrix
- [x] Upload all images to S3
- [x] Replace CSS orb with scroll-triggered image transitions in hero section
- [x] Replace PainPointsScene with scroll-triggered pain point images
- [ ] Test scroll-based image morphing effect

## Real-Time Particle Morph System (Replace Static Image Crossfades)
- [x] Build particle point cloud system with thousands of points
- [x] Define shape coordinates for hero: wrench → brain → circuit → neural network
- [x] Define shape coordinates for pain points: chaos → systems → scaling → resolution
- [x] Implement scroll-driven interpolation (particles move between positions as you scroll)
- [x] Add glow, trails, and color shifts during morphing transitions
- [x] Integrate into hero section replacing image crossfades
- [x] Integrate into pain points section replacing image crossfades
- [x] Keep AI-generated images as background/accent behind particles
- [x] Fix hero text opacity fading too aggressively
- [ ] Test on published site

## Fix Particle Morph Not Rendering on Published Site
- [x] Debug why Canvas 2D particles don't render on published site
- [x] Fix rendering issue
- [x] Test and verify fix
