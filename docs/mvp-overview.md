# Blog MVP Overview

## Product Goal

Build a reading-first editorial blog inspired by the reference image:

- light content surfaces with a strong red accent
- a large hero area with a centered feature card
- magazine-like content grouping
- visible section structure
- strong subscription and footer identity

## MVP Outcome

The first release should do three things well:

1. Explain the site's editorial point of view quickly.
2. Help readers browse articles and enter detail pages with minimal friction.
3. Support direct retrieval through search and trust-building through the about page.

## Audience

- readers interested in internet culture, games, methods, and long-form essays
- returning readers who want to scan featured and recent pieces
- readers searching for a specific topic or keyword
- first-time visitors who want to understand the publication and its voice

## Included Pages

1. Homepage
2. Archive page
3. Detail page
4. Search page
5. About page

## Included Features

### Homepage

- brand-led hero
- featured article
- section-based article blocks
- newsletter entry point

### Archive page

- full article listing
- section filtering
- readable metadata and summaries

### Detail page

- article header
- article body
- tags and metadata
- related reading

### Search page

- keyword input
- real-time filtering
- result count
- empty state

### About page

- editorial mission
- content principles
- section overview
- contact positioning

## Not Included Yet

- auth
- comments
- CMS
- likes and saves
- author management
- internationalization
- advanced recommendations

## Content Model

Each post should include:

- `title`
- `slug`
- `category`
- `excerpt`
- `publishedAt`
- `readingTime`
- `author`
- `tags`
- `cover` or visual theme data
- `body`
- `featured`

## Success Criteria

- readers understand the site's focus within a few seconds
- article cards are easy to scan
- search results change clearly and quickly
- long-form pages feel calm and readable
- the about page explains why the site exists
