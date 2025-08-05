# 🐍 Snake Game

A modern, feature-rich Snake game built with React, TypeScript, and Vite. Enjoy classic Snake gameplay with enhanced features like high score tracking, multiple control schemes, and a beautiful responsive UI.

![Snake Game Screenshot](https://via.placeholder.com/800x400/10b981/ffffff?text=Snake+Game)

## ✨ Features

### 🎮 Gameplay
- **Classic Snake mechanics** - Eat food to grow longer
- **Collision detection** - Avoid walls and self-collision
- **Constant game speed** - Smooth, predictable gameplay
- **Score tracking** - Earn points for each food eaten

### 🏆 High Score System
- **Persistent storage** - High scores saved in browser localStorage
- **Visual indicators** - Trophy icon and special celebration for new records
- **Cross-session tracking** - Scores persist between browser sessions

### 🎯 Enhanced Controls
- **Arrow keys** - Traditional directional control
- **WASD keys** - Alternative keyboard layout
- **Spacebar/Enter** - Pause/resume functionality
- **Touch controls** - Swipe gestures for mobile devices
- **Button controls** - Click-to-play interface

### 🎨 Modern UI/UX
- **Responsive design** - Works on desktop, tablet, and mobile
- **Beautiful gradients** - Modern visual styling with Tailwind CSS
- **Smooth animations** - CSS transitions and hover effects
- **Game state overlays** - Clear pause and game over screens
- **Accessibility** - Keyboard navigation and screen reader friendly

### ⚡ Performance Optimizations
- **Memoized components** - Optimized rendering performance
- **Efficient state management** - Clean React hooks implementation
- **Smart food generation** - Prevents impossible food placement
- **Optimized game loop** - Smooth 60fps gameplay

## 🚀 Quick Start

### Prerequisites
- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd snake-game
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🎮 How to Play

### Basic Controls
- **Start**: Click "Start" button or press Spacebar/Enter
- **Move**: Use arrow keys or WASD keys
- **Pause**: Press Spacebar/Enter or click "Pause"
- **Reset**: Click "Reset" button to start over

### Mobile Controls
- **Swipe** on the game board to change direction
- **Tap** buttons for game control

### Game Rules
1. **Eat the red food** to grow longer and increase your score
2. **Avoid hitting the walls** - game ends if you touch the border
3. **Don't bite yourself** - collision with your own body ends the game
4. **Try to beat your high score** - challenge yourself to improve!

### Scoring
- **+10 points** for each food eaten
- **High score** is automatically saved and displayed
- **Special celebration** when you achieve a new record

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linting
npm run lint
```

### Tech Stack

- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library

### Project Structure

```
src/
├── App.tsx          # Main game component
├── main.tsx         # React entry point
├── index.css        # Global styles
└── vite-env.d.ts    # Vite type definitions
```

## 🎯 Game Features Explained

### Smart Food Generation
The game ensures food never spawns on the snake's body, preventing impossible situations and maintaining fair gameplay.

### Responsive Design
The game adapts to different screen sizes, providing an optimal experience on desktop, tablet, and mobile devices.

### Performance Optimizations
- **Memoized grid cells** reduce unnecessary re-renders
- **Optimized callbacks** prevent performance bottlenecks
- **Efficient state management** ensures smooth gameplay

### Accessibility Features
- **Keyboard navigation** for all game functions
- **Screen reader friendly** with proper ARIA labels
- **High contrast** visual design
- **Touch-friendly** interface for mobile users

## 🐛 Troubleshooting

### Common Issues

**Game won't start**
- Make sure you're using Node.js version 16 or higher
- Try running `npm install` again
- Check that the development server is running on `http://localhost:5173`

**Controls not working**
- Ensure the game window is focused (click on it)
- Try refreshing the page
- Check that your keyboard is working properly

**High score not saving**
- Make sure localStorage is enabled in your browser
- Try clearing browser cache and refreshing

### Performance Issues
- Close other browser tabs to free up memory
- Try a different browser if experiencing lag
- Ensure your device meets the minimum requirements

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the classic Snake game
- Icons provided by [Lucide](https://lucide.dev/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)

---

**Enjoy playing Snake!** 🐍✨

*Challenge yourself to beat your high score and have fun!* 