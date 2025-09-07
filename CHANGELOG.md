# Changelog

## v0.2.0 (2024-09-07)

### 🎯 Major Fixes
- **Fixed SVG restart issue**: Resolved critical bug where clicking pause/play would restart SVG animations from the beginning
- **Improved component lifecycle**: Separated animation control from SVG DOM creation to prevent unwanted re-renders

### ✨ New Features
- **Customizable button colors**: Added support for custom play, pause, and restart button colors via parameters
- **Enhanced hover controls**: Improved visual feedback and button styling with soft color defaults

### 🔧 Technical Improvements  
- **Better React state management**: Fixed useEffect dependencies to prevent unnecessary SVG re-creation
- **Cross-browser compatibility**: Enhanced fallback methods for SVG animation control
- **Debugging support**: Added console logging to help diagnose animation control behavior

### 🎨 UI Enhancements
- **Consolidated play/pause button**: Combined separate play and pause buttons into a single toggle
- **Softer default colors**: Updated default button colors for a more modern, pleasant appearance
- **Improved button states**: Better visual indication of current animation state

### 🐛 Bug Fixes
- **Component re-render prevention**: Fixed React re-rendering that was causing animations to restart
- **Animation state preservation**: Improved handling of pause/resume functionality
- **Proper cleanup**: Added cleanup for temporary styles and event handlers

### 📦 Package Updates
- Updated to v0.2.0 with proper version synchronization across all package files
- Enhanced build configuration and package metadata

## v0.1.0 (2024-09-04)

### 🎉 Initial Release
- Basic SVG animation display with hover controls
- Play, pause, and restart functionality
- Streamlit custom component integration
- Responsive design with customizable dimensions