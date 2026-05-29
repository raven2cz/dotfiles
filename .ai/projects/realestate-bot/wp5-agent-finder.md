---
id: project.realestate-bot.wp5-agent-finder
title: WP5 Agent Finder design
type: topic
scope: project
feature: null
project: realestate-bot
summary: WP5 rewritten from CRM (timeline/meetings) to Agent Finder — discovery for a quality realtor handling user's parallel house sale + new RD purchase.
tags: [realestate-bot, wp5, agents, discovery, sreality]
applies_to: [realestate-bot]
machines: []
status: active
confidence: high
owner: tonda
last_updated: 2026-05-05
supersedes: []
superseded_by: null
links: [project.realestate-bot.meta]
---

# WP5 Agent Finder

WP5 byl přepsán z „Agents CRM" (timeline, schůzky, remindery) na **„Agent Finder"** — discovery tool pro nalezení kvalitního makléře.

**Why:** Tonda potřebuje makléře pro současný PRODEJ svého domu + NÁKUP nového RD. Ideálně jednoho makléře/kancelář pro oboje, protože smlouvy musí jít ruku v ruce (timing prodeje financuje nákup).

**Scope decisions:**
- Žádný CRM, žádné timeline schůzek — čistě ranking a discovery
- Spec: `docs/work-packages/WP5-agents-crm.md` (přepsán 2026-05-05)
- Codex research: `docs/reviews/WP5-agent-finder-codex-research.md`
- Gemini review: doporučil pozor na price-drop pattern, off-market paradox, kvalita > kvantita

## Data already in our DB

- 377 unikátních makléřů z 718 Sreality listingů s `detail_json`
- Deduplikace přes `seller.id` (stabilní Sreality ID)
- `agent_name` sloupec je prázdný — data jsou jen v `detail_json.seller`
- Top kanceláře: M&M Reality (44 makléřů), RE/MAX (33), BCAS (32)
- Bezrealitky nemá profily makléřů — nepoužíváme

## Data sources (prioritized)

- **P0**: Vlastní DB — seller.id, portfolio, DOM, price-drops, lokální specializace
- **P1**: Sreality adresář (`/adresar/plzensky-kraj`) — rating, IČO, recenze, kontakt
- **P1**: Google Places API — rating, review count (vyžaduje API key)
- **P2**: Firmy.cz — hodnocení (proklik ze Sreality)
- **P2**: ARES REST API — ověření IČO, aktivní živnost „Realitní zprostředkování"
- **P3**: ARK ČR / Realitní komora — certifikace (bonusový signál)

## Scoring formula

```
0.30 listing_performance
+ 0.20 local_specialization
+ 0.15 reviews
+ 0.10 legal
+ 0.10 marketing
+ 0.10 buyer_access
+ 0.05 certifications
```
