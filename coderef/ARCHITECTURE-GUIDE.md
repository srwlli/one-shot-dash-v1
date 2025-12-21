++# Architecture Decision Guide

Use this checklist to decide where new code should go.

---

## Where Does It Go?

### 1. Is it **styling/colors/appearance**?
→ **Theme** (`packages/ui/styles/globals.css`)
- Light/dark mode colors
- Brand colors
- Fonts, spacing defaults

---

### 2. Is it a **reusable building block**?
→ **Component** (`packages/ui`)

Ask:
- [ ] Used in multiple places?
- [ ] Always looks/works the same?
- [ ] No per-tenant customization needed?
- [ ] Other things are built from it?

**Examples:** Button, Input, Card, Modal, Nav, Dropdown, Table, Avatar

---

### 3. Is it a **dashboard feature**?
→ **Widget** (`packages/widgets`)

Ask:
- [ ] Shows in the dashboard grid?
- [ ] Needs per-tenant config (different title, data source, etc.)?
- [ ] Self-contained mini-app?
- [ ] Defined in layout JSON?

**Examples:** Sales Chart, Calendar, Notifications Panel, Task List, Analytics Card

---

### 4. Is it **app infrastructure**?
→ **Core** (`packages/core`)

Ask:
- [ ] Manages global state?
- [ ] Provides context to entire app?
- [ ] Platform detection (Electron/Web)?

**Examples:** PlatformProvider, WidgetRegistry, Dashboard renderer

---

### 5. Is it **JSON configuration**?
→ **Config** (`packages/config`)

- Layout definitions (which widgets, where)
- Tenant settings (branding, features enabled)

---

## Quick Reference

| Thing | Package | Example |
|-------|---------|---------|
| Button | `ui` | `<Button>` |
| Card | `ui` | `<Card>` |
| Nav | `ui` | `<Nav>` |
| Theme Toggle | `ui` | `<ThemeToggle>` |
| Dark mode CSS | `ui/styles` | `globals.css` |
| Sales Chart | `widgets` | `{ widgetId: "sales-chart" }` |
| Coming Soon | `widgets` | `{ widgetId: "coming-soon" }` |
| Theme state | `core` | `PlatformProvider` |
| Dashboard grid | `core` | `<Dashboard>` |
| Layout JSON | `config` | `dashboard.json` |

---

## Definitions

### Component
A reusable building block. Always looks/works the same. Used to build other things.
- Like a LEGO brick

### Widget
A configurable dashboard feature. Changes based on JSON config. Self-contained mini-app.
- Like a LEGO set with instructions

### Theme
Global styling that controls colors, fonts, dark/light mode.
- Applies to everything

### Core
App infrastructure. State management, providers, platform detection.
- The foundation

### Config
JSON files that control what widgets appear and how they're configured.
- The instructions

---

## Flow

```
Config (JSON)
    ↓ defines which widgets to show
Core (Dashboard)
    ↓ renders widgets from registry
Widgets
    ↓ built from components
Components (UI)
    ↓ styled by
Theme (CSS)
```
