# Focus Flow - Pomodoro Application Specification

## 1. Concept & Vision

**Focus Flow** is a premium Pomodoro timer application designed for deep work enthusiasts. It combines the classic 25-5-3 Pomodoro technique with ambient focus soundscapes, distraction blocking, and gamified statistics. The app feels like a personal productivity sanctuary—calm, professional, and iOS-inspired with glassmorphism aesthetics. Every interaction should feel smooth and intentional, encouraging sustained focus sessions.

## 2. Design Language

### Aesthetic Direction
iOS-inspired glassmorphism with dark mode as primary. Deep purple/blue gradient backgrounds with frosted glass cards. The UI should feel like it floats on a cosmic background.

### Color Palette
```
Background Gradient: radial-gradient(#1a1a2e → #0f0f1a)
Primary Accent: #6c63ff (soft purple)
Focus Mode: #6c63ff
Short Break: #4facfe (sky blue)
Long Break: #00f2fe (cyan)
Success: #00f2fe
Warning: #f093fb (pink)
Text Primary: #ffffff
Text Secondary: rgba(255, 255, 255, 0.7)
Glass Background: rgba(255, 255, 255, 0.05)
Glass Border: rgba(255, 255, 255, 0.1)
```

### Typography
- **Font Family**: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif
- **Timer Display**: 120px, weight 700, letter-spacing: -2px
- **Headings**: 24px, weight 600
- **Body**: 16px, weight 400
- **Secondary**: 14px, weight 400
- **Caption**: 12px, weight 500

### Spatial System
- **Card Padding**: 24px (mobile), 32px (desktop)
- **Card Border Radius**: 32px
- **Button Border Radius**: 16px
- **Element Spacing**: 16px vertical gaps
- **Max App Width**: 480px (mobile), 600px (desktop)

### Motion Philosophy
- **Transitions**: 0.3s cubic-bezier(0.4, 0, 0.2, 1)
- **Button Hover**: scale(1.02) + slight brightness increase
- **Button Active**: scale(0.98)
- **Timer Pulse**: Subtle opacity animation (0.8-1.0) when running
- **Card Entrance**: fadeIn + translateY(20px → 0) on load, staggered 100ms
- **Modal**: fadeIn backdrop + scale(0.95 → 1) content
- **Progress Ring**: Smooth stroke-dashoffset transition

### Visual Assets
- **Icons**: Font Awesome 6.5.1 (free)
- **Decorative**: Subtle gradient orbs in background (CSS), noise texture overlay
- **Favicon**: Simple timer/clock icon (inline SVG)

## 3. Layout & Structure

### Page Structure
```
┌─────────────────────────────────────┐
│  Header: Logo + Fullscreen + Gear  │
├─────────────────────────────────────┤
│  Timer Card (Glass)                │
│  ┌─────────────────────────────┐   │
│  │  Mode Label + Session Count │   │
│  │  ┌─────────────────────┐    │   │
│  │  │   SVG Progress Ring │    │   │
│  │  │   ┌─────────────┐   │    │   │
│  │  │   │  25:00      │   │    │   │
│  │  │   │  Current    │   │    │   │
│  │  │   │  Task       │   │    │   │
│  │  │   └─────────────┘   │    │   │
│  │  └─────────────────────┘    │   │
│  │  [↺]  [▶ Play]  [⏭]        │   │
│  └─────────────────────────────┘   │
├─────────────────────────────────────┤
│  Sound Controls (Glass)            │
│  [🌫️ Brown Noise ▼] [Slider] [▶]  │
├─────────────────────────────────────┤
│  Task Input (Glass)                │
│  [What are you working on?]       │
├─────────────────────────────────────┤
│  Quote Display (Glass)             │
│  "Deep work quote..."              │
├─────────────────────────────────────┤
│  Stats Bar                         │
│  🎯 2 | ⏱️ 50min | 🔥 3 days      │
├─────────────────────────────────────┤
│  Advanced Panel (Collapsible)      │
│  ├─ Blocklist                      │
│  ├─ 7-Day Chart                    │
│  └─ Achievements Grid              │
└─────────────────────────────────────┘
```

### Responsive Strategy
- Mobile-first (max-width: 480px default)
- Desktop: centered with max-width: 600px
- Safe area insets for iOS notches (env safe-area-inset)
- Touch targets minimum 44x44px

## 4. Features & Interactions

### 4.1 Pomodoro Timer System

**Timer Modes:**
- Focus: 25 minutes (default, configurable 5-60)
- Short Break: 5 minutes (default, configurable 1-15)
- Long Break: 15 minutes (default, configurable 10-30)
- Long break triggers after every 4 focus sessions (configurable 2-6)

**Controls:**
| Button | Action | Feedback |
|--------|--------|----------|
| Play/Pause | Toggle timer | Icon changes, pulse animation starts/stops |
| Reset | Reset current session to full time | Confirmation if >30s elapsed |
| Skip | Move to next phase | Smooth transition to next mode |

**Progress Ring:**
- SVG circle, 280px diameter, 8px stroke
- Background: rgba(255,255,255,0.1)
- Fill: Current mode color
- Animation: stroke-dashoffset from full to 0
- Complete: Flash animation + sound chime

**Session Counter:**
- Format: "Session 3/4" with visual dots
- Dots fill as sessions complete toward long break
- Resets after long break completion

**Timer Accuracy:**
- Store targetEndTime as absolute timestamp
- Use setInterval with 100ms updates for display
- Calculate remaining = targetEndTime - Date.now()
- On pause: store remainingTime, clear interval
- On resume: set new targetEndTime = Date.now() + remainingTime

### 4.2 Sound Generator (Web Audio API)

**Soundscapes:**

| Sound | Generation Method | Character |
|-------|------------------|-----------|
| Brown Noise | White noise filtered through brown/pink filter | Deep, rumbling |
| Pink Noise | White noise with 1/f filter | Soft, like rainfall |
| Rain | Filtered noise + random pops + reverb | Natural, varied |
| Lofi Beat | Sine wave arpeggio (C-E-G-C5) + delay | Calm, repetitive |
| Binaural 40Hz | 200Hz left, 240Hz right (panner nodes) | Focus enhancing |

**Audio Controls:**
- Sound dropdown: Icon + name for each option
- Volume slider: 0-100%, smooth gain transition
- Play/Pause: Toggle current sound
- Auto-play option: Start sound when timer starts
- Fade in/out: 500ms smooth transitions

**Implementation:**
```javascript
class SoundGenerator {
  // Single AudioContext, initialized on first user gesture
  // GainNode master for volume control
  // Disconnect all sources on stop()
  // Generate noise buffers programmatically
}
```

### 4.3 Distraction Blocker

**Blocklist Management:**
- Default domains: youtube.com, twitter.com, reddit.com, instagram.com, tiktok.com
- Add custom domain with input field
- Remove with X button
- Persist to localStorage

**Active Protection (Strict Mode):**
- Shield icon indicates when active
- Tab visibility change detection:
  - If hidden > 10s during focus: Show toast "👀 Stay focused..."
  - Uses timestamp comparison for accuracy
- beforeunload event: Custom message if timer running in focus mode

**Focus Mode Toggle:**
- Checkbox in settings for "Strict Mode"
- Visual indicator (shield) when enabled

### 4.4 Task Integration

**Current Task:**
- Input field with placeholder "What are you working on?"
- Max 50 characters
- Save to localStorage on change
- Display above timer in 16px secondary text
- Edit icon for quick change

**Quick Suggestions:**
- Morning (5-12): "Plan your day"
- Afternoon (12-17): "Deep work block"
- Evening (17-24): "Review & plan tomorrow"
- Click to set as current task

### 4.5 Statistics Dashboard

**Today's Stats:**
- Sessions completed (🎯 icon)
- Total focus minutes (⏱️ icon)
- Current streak with fire emoji (🔥)
- Days since last break in streak

**7-Day History:**
- CSS flexbox bar chart (no external library)
- Bars proportional to max value
- Hover/tap shows exact minutes
- Labels: Mon, Tue, Wed, etc.

**Achievements:**
| Badge | Requirement | Icon |
|-------|-------------|------|
| First Focus | Complete 1 session | 🎯 |
| Getting Started | 3 sessions total | 🌟 |
| On Fire | 3-day streak | 🔥 |
| Week Warrior | 7-day streak | 💪 |
| Century | 100 sessions total | 🏆 |
| Time Master | 10 total hours | ⏰ |
| Night Owl | Session after 10 PM | 🌙 |
| Early Bird | Session before 8 AM | 🌅 |
| Focused Mind | 50 sessions | 🧠 |
| Deep Worker | 25 hours total | 📚 |

**Badge Display:**
- Unlocked: Full color, subtle glow animation
- Locked: Grayscale, 50% opacity, tooltip shows requirement
- Hover: Scale up slightly

### 4.6 Settings Panel

**Modal Overlay:**
- Backdrop blur effect
- Centered card, max-width 400px
- Close X button, click outside to close

**Settings Sections:**

1. **Timer Durations**
   - Focus: Slider 5-60 min, default 25
   - Short Break: Slider 1-15 min, default 5
   - Long Break: Slider 10-30 min, default 15
   - Long Break Interval: Slider 2-6, default 4

2. **Theme**
   - Dark (default) / Light toggle
   - Accent color picker (preset swatches)

3. **Sound Defaults**
   - Default soundscape dropdown
   - Auto-play sound with timer toggle
   - Default volume slider

4. **Notifications**
   - Request permission button
   - Notify when session ends toggle
   - Notify when break ends toggle
   - Sound alert toggle

5. **Data**
   - Export data as JSON button
   - Reset all data button (with confirmation)

### 4.7 Additional Features

**Quotes:**
- 20 curated productivity quotes
- Rotate on each new session
- Subtle italic styling
- Attribution to author

**Keyboard Shortcuts:**
| Key | Action |
|-----|--------|
| Space | Play/Pause |
| R | Reset |
| S | Skip |
| F | Fullscreen |
| ? | Show shortcuts |

**Fullscreen Mode:**
- Uses Fullscreen API
- Minimal UI (timer + pause only)
- ESC or button to exit
- Remembers position on exit

**Auto-Break Suggestion:**
- If no interaction for 2+ minutes during break
- Gentle toast: "Ready to start next focus session?"

## 5. Component Inventory

### Timer Card
- **Default**: Glass card, centered content, mode label top, controls bottom
- **Running**: Timer pulses subtly, progress ring animates
- **Paused**: Pause icon, no pulse, ring static
- **Complete**: Flash animation, transition to next mode

### Control Buttons
- **Default**: Glass background, icon centered
- **Hover**: Scale 1.02, brightness 1.1
- **Active**: Scale 0.98
- **Disabled**: 50% opacity, no pointer events

### Sound Selector
- **Default**: Glass dropdown, current sound shown
- **Open**: Dropdown with all options, icons visible
- **Disabled**: If Web Audio not supported

### Volume Slider
- **Default**: Track with thumb
- **Active**: Thumb highlighted
- **Muted**: Grayed out when sound is "None"

### Task Input
- **Default**: Transparent background, bottom border
- **Focused**: Bottom border accent color
- **Filled**: White text, subtle background

### Settings Modal
- **Closed**: Not in DOM / display none
- **Open**: Fade in backdrop, scale in content
- **Loading**: Spinner if needed for data operations

### Achievement Badge
- **Locked**: Grayscale, "?" or faded icon, tooltip
- **Unlocked**: Full color, glow effect
- **Hover**: Scale 1.1

### Toast Notification
- **Info**: Default glass style
- **Warning**: Pink accent
- **Success**: Cyan accent
- **Position**: Top center, auto-dismiss 4s

## 6. Technical Approach

### Architecture
- Single HTML file with embedded `<style>` and `<script>`
- Module pattern for JavaScript organization
- State management via single state object
- localStorage for persistence

### Key Classes
```javascript
class FocusFlow {
  constructor()
  init()
  loadState()
  saveState()
  // Timer methods
  startTimer()
  pauseTimer()
  resetTimer()
  skipSession()
  // Audio methods
  initAudio()
  // UI methods
  updateDisplay()
  renderChart()
  renderBadges()
  // Settings
  openSettings()
  updateSettings()
}

class SoundGenerator {
  constructor()
  initAudio()
  play(type, volume)
  stop()
  fadeIn()
  fadeOut()
  setVolume()
  // Sound generators
  createBrownNoise()
  createPinkNoise()
  createRain()
  createLofiBeat()
  createBinaural()
}

class TimerEngine {
  constructor(duration, onTick, onComplete)
  start()
  pause()
  resume()
  reset()
  getRemaining()
}
```

### Data Schema
```javascript
{
  settings: {
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    longBreakInterval: 4,
    theme: 'dark',
    accentColor: '#6c63ff',
    soundDefault: 'brownNoise',
    autoPlaySound: true,
    defaultVolume: 0.5,
    strictMode: false,
    notifySessionEnd: true,
    notifyBreakEnd: true,
    soundAlert: true
  },
  stats: {
    sessionsCompleted: 0,
    totalFocusMinutes: 0,
    totalHours: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: '2024-01-01',
    dailyHistory: { '2024-01-01': 120, ... },
    unlockedBadges: ['first_session']
  },
  blocklist: ['youtube.com', 'twitter.com', 'reddit.com'],
  currentTask: '',
  currentMode: 'focus',
  currentSession: 1
}
```

### Browser Compatibility
- ES6+ features (arrow functions, classes, template literals)
- CSS custom properties
- Web Audio API (with fallback message)
- Fullscreen API (with vendor prefixes)
- localStorage (with quota handling)
- Intersection Observer (for lazy effects)

### Performance Considerations
- Debounce localStorage writes (300ms)
- Clean up intervals on unload
- Disconnect Web Audio nodes properly
- Use CSS transforms for animations (GPU accelerated)
- Lazy load non-critical components

### Accessibility
- ARIA labels on all interactive elements
- Role attributes where needed
- Focus management in modals
- Keyboard navigation support
- prefers-reduced-motion support
- prefers-contrast support
- High contrast mode fallback

## 7. Demo Data (Initial State)

On first load, show app as if user has been using it:
- Current streak: 3 days
- Today's sessions: 2
- Today's minutes: 50
- 7-day history: varied values
- Some badges unlocked: First Focus, Getting Started, On Fire

## 8. iOS-Style Animations

### 8.1 Home Screen
- iOS-style home screen with clock, date, and app icon
- Real-time clock display matching device time
- Floating animation on app icon
- Gradient overlay effect

### 8.2 App Launch Animation
- Tap app icon to trigger launch sequence
- Pill expansion from icon position
- Morph transition to full-screen app
- Spring-based card entrance animations

### 8.3 Dynamic Island Style Timer
- Floating pill when timer is running
- Live countdown display
- Pulse animation during active session
- Color-coded by mode (focus/break)
- Quick pause/play controls

### 8.4 Spring Physics Easing
```css
/* iOS-style spring bounce */
animation: springBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);

/* iOS-style card entrance */
animation: springCardIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);

/* iOS press effect */
animation: iosPress 0.2s cubic-bezier(0.4, 0, 0.2, 1);
```

### 8.5 Haptic Feedback Simulation
- Button tap animations
- Scale effects on interaction
- Visual feedback for all controls

### 8.6 Mode Transition Effects
- Smooth color transitions between modes
- Glow effects on timer during focus
- Animated progress ring

### 8.7 Toast Notifications
- iOS-style notification cards
- Icon indicators by type
- Spring-based entrance/exit animations
- Glass morphism styling

### 8.8 Button Interactions
- Hover: Scale up with enhanced shadow
- Active: Scale down (press effect)
- Spring bounce on state change
- Ripple effect on tap
