# Page Navigation Component - Fillout Take-Home Assignment

## 🔗 Demo URL 

https://page-nav-ten.vercel.app/


## 🚀 Getting Started

To run this project locally, follow these steps:

1. Clone the repository:

```
git clone git@github.com:rimildeyjsr/page-nav.git
cd page-nav
```

2. Install dependencies:

```
npm install
```

3. Run the development server:

```
npm run dev
```

4. Open your browser:
Navigate to http://localhost:3000 to see the component in action.

## 🎯 Features 

1. Drag & Drop Reordering : Reorder pages by dragging and dropping
2. Tab Navigation: Click to switch between pages
2. Context Menu Actions (does not work as of now) : Rename, duplicate, delete
3. Keyboard Navigation: Arrow keys, tab support
4. Responsive Design: Works on mobile and desktop
   - Arrow Left/Right - Navigate between pages (Lines 88-96)
   - Enter - Activate focused page
   - Cmd/Ctrl + Enter - Start editing page name
   - Spacebar - Activate focused page
   - F2 - Start editing page name
   - Escape - Cancel editing/close menus/stop dragging
   - Context Menu Key - Open context menu
   - Shift + F10 - Open context menu
   - Ctrl + Space - Open context menu
   - Enter/Escape in Edit Mode - Save/cancel editing
4. Dynamic Addition: Add pages with hover buttons or main add button
5. Inline editing : Ability to edit page names


## 🏗️ Architectural Overview

High-Level Design
```
PageNavigationContainer (Smart Component)
├── State Management (useReducer + Actions)
├── Event Handling (Keyboard, Mouse, Drag & Drop)
├── Performance Layer (Memoization, Callbacks)
└── Presentation Layer
├── PageTab (Draggable, Editable)
├── Divider (Hover Add Buttons)
├── AddPageButton (Primary Action)
├── ContextMenu (Right-click Actions)
└── DragOverlay (Visual Feedback)

```
## 🛠️ Technology Stack
### Core Technologies

React, TypeScript, Next.js 15, Tailwind CSS

### Drag & Drop
Used the `@dnd-kit` library for drag-and-drop functionality, which provides a flexible and accessible API. Chose it over native HTML5 drag & drop because it provides accessibility-first design with full keyboard navigation support and React-optimized performance with proper state management integration.

### Testing & Quality

Vitest with React testing library 


