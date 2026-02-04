# 福运闯闸 (Fortune Gate Rush)

## Overview

This is a Chinese New Year themed interactive web game called "福运闯闸" (Fortune Gate Rush). Players must survive 25 rounds by choosing doors with different risk/reward levels while avoiding the "年兽" (Nian beast). The game features a traditional Chinese aesthetic with decorative elements like lanterns, fans, and flowers.

**Core Gameplay:**
- Players start with 3 health points
- Each round presents 3-4 doors with varying risk levels (A: low risk, B: medium risk, C: high risk, D: requires key)
- Doors may contain: safe passage, power-ups (elimination card, health boost, key), or the Nian beast
- Survive 25 rounds to win; game ends if health reaches 0

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static HTML Multi-Page Application**: The game uses separate HTML files for each game state/screen rather than a single-page application
- **No Frontend Framework**: Pure HTML, CSS, and vanilla JavaScript
- **Build Tool**: Vite for development server and asset bundling

### Page Structure
| Page Type | Files | Purpose |
|-----------|-------|---------|
| Entry | `index.html` | Game title/landing page |
| Rules | `rule1.html`, `rule2.html`, `rule3.html` | Game instructions |
| Info | `info.html` | Player information collection |
| Gameplay | `no1.html` through `no25.html` | 25 round progression screens |
| Door Selection | `doora.html`, `doorb.html`, `doorc.html`, `doord.html` | Door choice confirmation |
| Outcomes | `live.html`, `lose.html`, `victory.html`, `minushp.html` | Game state results |
| Power-ups | `key.html`, `addhp.html`, `elimination.html` | Item acquisition screens |

### Styling Approach
- **Shared Stylesheet**: `style.css` for game screens, `index.css` for entry pages
- **Chinese Typography**: Heavy use of Google Fonts Chinese typefaces (Ma Shan Zheng, ZCOOL families, cwTeX families)
- **Fixed Positioning**: UI elements use absolute/fixed positioning for precise layout
- **External Assets**: All images hosted on Imgur

### Navigation Pattern
- Page-to-page navigation using `onclick="location.href='...'"`
- Animation-triggered navigation using `animationend` event listeners
- Sequential round progression (no1 → no2 → ... → no25)

## External Dependencies

### CDN Resources
- **Google Fonts**: Chinese typeface families for traditional aesthetic
  - Ma Shan Zheng, ZCOOL XiaoWei, ZCOOL QingKe HuangYou, ZCOOL KuaiLe
  - Long Cang, Liu Jian Mao Cao, Zhi Mang Xing
  - cwTeX families (kai, yen, fangsong, ming, hei)

### External Image Hosting
- **Imgur**: All game assets (backgrounds, UI elements, cards, animations) hosted externally
- Background: `rCT63ws.png`
- Decorative elements: lanterns, fans, flowers, school logo
- Door images, power-up cards, character sprites

### Development Dependencies
- **Vite**: Development server with HMR, configured on port 5000