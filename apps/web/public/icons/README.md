# PWA Icons

This directory should contain the following icon files for PWA support:

- `icon-192x192.png` - 192x192 pixel icon
- `icon-512x512.png` - 512x512 pixel icon

## Generating Icons

You can generate these icons from an SVG source using tools like:

1. **ImageMagick**: `convert icon.svg -resize 192x192 icon-192x192.png`
2. **Sharp** (Node.js): Use the sharp library
3. **Online tools**: realfavicongenerator.net

## Icon Requirements

- Use a simple, recognizable design
- Ensure visibility on both light and dark backgrounds
- Include padding for "maskable" icon support (safe zone is inner 80%)
- Save as PNG with transparency support

## Placeholder

Until real icons are created, the app will work but won't have proper icons in:
- Browser install prompts
- Home screen shortcuts
- App switchers
