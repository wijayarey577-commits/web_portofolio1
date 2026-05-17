# Project Structure

## HTML
- `index.html` - markup utama portfolio, modal, crop editor, dan 3D model viewer.

## CSS
- `css/00-base.css` - variables lama, reset, body, background, cursor.
- `css/10-nav-dev.css` - navbar, mobile nav, developer login, developer bar.
- `css/20-home-sections.css` - hero dasar, buttons, section headers, awards awal.
- `css/30-cards-projects.css` - skills, AI box, filters, project cards.
- `css/40-detail-modal-responsive.css` - project detail page, gallery, modal, footer, responsive awal.
- `css/50-hero-portrait.css` - hero custom, portrait layout, responsive hero.
- `css/60-apple-theme.css` - Apple-style UI, dark/light mode, cards, light-mode fixes.
- `css/70-admin-media-3d.css` - crop editor, image delete, STL model viewer, project detail theme overrides.

## JavaScript
- `js/00-config-data.js` - credentials, storage keys, default database, localStorage helpers.
- `js/10-theme.js` - dark/light mode.
- `js/20-ui-auth.js` - cursor, nav, login/logout, misc UI events.
- `js/30-render-sections.js` - profile, awards, skills, project cards.
- `js/40-project-detail-media.js` - project detail, gallery, image upload/delete, STL upload/delete.
- `js/50-admin-modal.js` - add/edit modal, form save logic, export/import database.
- `js/60-database-crop-3d.js` - image crop editor, STL parser, 3D canvas viewer.
- `js/70-ai-toast-observe.js` - AI assistant, toast, reveal animation.
- `js/99-bootstrap.js` - starts the app after all files are loaded.

## Backup
- `styles.css` and `script.js` are the previous monolithic files kept as backup.
