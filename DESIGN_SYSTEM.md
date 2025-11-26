# E-Voting System Design System

## Overview
Modern, professional, accessible design system for E-Voting System - Professional Election Management Platform.

## Color Palette

### Primary Colors
- **Background**: `#F6F8FB` - Soft neutral background
- **Surface**: `#FFFFFF` - Card and modal backgrounds
- **Accent (Primary)**: `#5B21B6` - Deep Purple (university brand)
- **Accent-2**: `#FF7A3D` - Warm Orange (secondary CTAs, warnings)
- **Success**: `#16A34A` - Green (voters, success states)
- **Muted**: `#6B7280` - Gray (secondary text)

### Semantic Colors
- **Foreground**: `#0F172A` - Slate 900 (primary text)
- **Border**: `#E2E8F0` - Slate 200 (borders)
- **Destructive**: `#EF4444` - Red 500 (errors, delete actions)

## Typography

### Font Family
- **Primary**: Inter (Google Fonts)
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Fallback**: System font stack

### Type Scale
- **H1**: 4xl/5xl (36px/48px) - Bold, tracking-tight
- **H2**: 2xl/3xl (24px/30px) - Semibold, tracking-tight
- **H3**: xl/2xl (20px/24px) - Semibold
- **Body**: base (16px) - Regular
- **Small**: sm (14px) - Regular
- **XS**: xs (12px) - Regular

## Spacing System

### Baseline Grid
- **Base Unit**: 8px
- **Gutters**: 24px (desktop), 16px (mobile)
- **Card Padding**: 24px (p-6)

### Common Spacing
- **xs**: 4px (gap-1)
- **sm**: 8px (gap-2)
- **md**: 16px (gap-4)
- **lg**: 24px (gap-6)
- **xl**: 32px (gap-8)

## Border Radius

- **Default**: 12px (rounded-xl)
- **Large**: 16px (rounded-2xl)
- **Small**: 8px (rounded-lg)

## Components

### Cards
- **Border**: 1px solid, 50% opacity
- **Shadow**: Subtle elevation (shadow-sm)
- **Hover**: Enhanced shadow (shadow-xl)
- **Radius**: 16px (rounded-2xl)
- **Padding**: 24px

### Buttons
- **Height**: 48px (h-12)
- **Padding**: 24px horizontal (px-6)
- **Radius**: 12px (rounded-xl)
- **Font**: Semibold, base size
- **Gradient**: Primary buttons use gradient backgrounds
- **Hover**: Shadow elevation increase

### Inputs
- **Height**: 48px (h-12)
- **Padding**: 16px horizontal (px-4)
- **Radius**: 12px (rounded-xl)
- **Border**: 1px solid, focus ring
- **Font**: Base size (16px)

### Icons
- **Size**: 32px (h-8 w-8) for primary icons
- **Container**: 64px (h-16 w-16) with gradient background
- **Style**: Outline with subtle fill

## Animations

### Entrance Animations
- **Fade In**: 0.3s ease-out
- **Slide from Bottom**: 0.4s ease-out
- **Slide from Top**: 0.3s ease-out

### Micro-interactions
- **Hover**: 200ms transition
- **Button Press**: Scale transform
- **Card Hover**: Shadow elevation

## Accessibility

### Focus States
- **Outline**: 2px ring, 2px offset
- **Color**: Accent color
- **Visible**: Always on keyboard navigation

### ARIA Labels
- All interactive elements have proper labels
- Form inputs have error message associations
- Buttons have descriptive text

### Color Contrast
- **Text on Background**: WCAG AA compliant
- **CTAs**: High contrast (white on gradient)
- **Muted Text**: Sufficient contrast for readability

## Layout Patterns

### Container
- **Max Width**: 1280px (2xl breakpoint)
- **Padding**: 16px mobile, 24px desktop
- **Centered**: Auto margins

### Grid System
- **Mobile**: 1 column
- **Tablet**: 2 columns (md:grid-cols-2)
- **Desktop**: 3 columns (lg:grid-cols-3)
- **Gap**: 24px (gap-6)

## Role-Specific Colors

### Voters
- **Primary**: Green gradient (#16A34A to #059669)
- **Icon**: Users/people icon

### Candidates
- **Primary**: Purple gradient (#5B21B6 to #4C1D95)
- **Icon**: Badge/certificate icon

### Returning Officers
- **Primary**: Blue-Indigo gradient (#2563EB to #4F46E5)
- **Secondary**: Teal-Cyan gradient (#14B8A6 to #06B6D4)
- **Accent**: Purple gradient (#7C3AED to #8B5CF6)
- **Neutral**: Slate-Gray scale (#64748B to #1E293B)
- **Icon**: Document/clipboard icon

## Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px
- **2xl**: 1536px

## Implementation Notes

- All components use Tailwind CSS utility classes
- Design tokens defined in `index.css` as CSS variables
- Components follow shadcn/ui patterns
- Consistent use of `cn()` utility for className merging
- All animations use CSS transitions for performance


