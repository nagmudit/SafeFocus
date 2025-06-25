# SafeFocus 🎯

> **Secure your tasks, focus on one**

A productivity application designed for ambitious but lazy individuals who struggle with traditional task management systems. SafeFocus helps you break the overwhelm-procrastination cycle by hiding tasks in a "safe" and revealing only one task at a time.

![SafeFocus Demo](https://img.shields.io/badge/Status-Active%20Development-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-14.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0-38B2AC)

## 🧠 The Psychology Behind SafeFocus

SafeFocus is built for people with specific personality traits from the Big Five inventory:

- **High Openness**: Creative minds who crave new experiences and dynamic approaches
- **Low Conscientiousness**: Struggle with rigid structures and traditional productivity systems

### The Problem
Traditional to-do lists overwhelm creative minds, leading to:
- Decision paralysis when faced with multiple tasks
- Procrastination due to feeling overwhelmed
- Loss of motivation from seeing an endless list of responsibilities

### The Solution
SafeFocus implements a "task vault" system that:
- 🔒 **Hides overwhelming tasks** in a secure vault
- 🎯 **Shows only one task** at a time to maintain focus
- 📊 **Tracks progress** to build confidence and momentum
- ⏱️ **Times your work** to understand productivity patterns

## ✨ Features

### Core Functionality
- **Task Vault**: Store all your tasks safely out of sight
- **Single Task Focus**: Work on one task at a time without distractions
- **Automatic Progression**: Complete a task to unlock the next one
- **Smart Task Selection**: Choose your next task when multiple options are available

### Analytics Dashboard
- **Completion Rate**: Track your overall productivity
- **Time Analysis**: Understand how long tasks actually take
- **Daily Progress**: See your productivity patterns over time
- **Task Distribution**: Visualize task completion by time spent

### User Experience
- **Auto-save**: Your data is automatically saved to local storage
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Keyboard Shortcuts**: Navigate efficiently with keyboard controls
- **Dark Theme**: Easy on the eyes for extended use

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm, yarn, pnpm, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/safefocus.git
   cd safefocus
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   # or
   bun install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   # or
   bun dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see SafeFocus in action.

### Production Build

To create an optimized production build:

```bash
npm run build
npm start
```

## 🎮 How to Use SafeFocus

### First Time Setup
1. **Add your first task**: Click the "+" button or press Enter to add a task
2. **Watch it become active**: Your first task automatically becomes the active task
3. **Start working**: Focus on completing just this one task

### Daily Workflow
1. **Focus on the active task**: Only one task is visible and unlocked
2. **Complete the task**: Click the checkmark when done
3. **Choose next task**: If you have multiple tasks, select which one to tackle next
4. **Repeat**: Continue this cycle to maintain focus and build momentum

### Advanced Features
- **View Analytics**: Click the "Analytics" button to see your productivity insights
- **Learn About the Project**: Click "About" to understand the psychology behind SafeFocus
- **Reset Data**: Use the "Reset" button to clear all tasks and start fresh

### Keyboard Shortcuts
- `Enter`: Add a new task (when input is focused)
- `Escape`: Close any open modal or cancel task creation
- `Space`: Complete the active task (coming soon)

## 🏗️ Project Structure

```
src/
├── app/
│   └── page.tsx                 # Main application page
├── components/
│   ├── ui/                      # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   └── ProgressBar.tsx
│   ├── modals/                  # Modal components
│   │   ├── AboutModal.tsx
│   │   ├── AnalyticsModal.tsx
│   │   └── TaskSelectorModal.tsx
│   ├── tasks/                   # Task-related components
│   │   ├── ActiveTaskPanel.tsx
│   │   ├── SafePanel.tsx
│   │   ├── AddTaskForm.tsx
│   │   └── CompletedTasks.tsx
│   └── layout/                  # Layout components
│       ├── Header.tsx
│       └── LoadingSpinner.tsx
├── hooks/                       # Custom React hooks
│   ├── useLocalStorage.tsx
│   ├── useTasks.tsx
│   └── useAnalytics.tsx
├── lib/                         # Utility functions
│   ├── analytics.ts
│   └── constants.ts
└── types/                       # TypeScript type definitions
    └── task.ts
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Storage**: Browser localStorage
- **State Management**: React hooks with custom state management

## 🔧 Development

### Code Style
This project follows:
- ESLint configuration for code quality
- TypeScript strict mode for type safety
- Modular component architecture
- Custom hooks for business logic separation

### Adding New Features
1. Create components in appropriate directories
2. Use TypeScript interfaces for all props and data structures
3. Implement custom hooks for complex state logic
4. Follow the existing naming conventions

### Testing
```bash
# Run type checking
npm run type-check

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

## 📊 Data Storage

SafeFocus uses browser localStorage to persist your data:
- **Tasks**: All task data including completion status and timestamps
- **Task Order**: Your preferred task sequence
- **Timing Data**: Active task timing information

**Note**: Data is stored locally in your browser. Clearing browser data will remove all tasks.

## 🤝 Contributing

Contributions are welcome! This project is particularly valuable for:
- UX/UI improvements for better focus
- Analytics enhancements
- Performance optimizations
- Accessibility improvements

### Development Setup
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Why SafeFocus?

> "Traditional productivity systems assume everyone works the same way. SafeFocus recognizes that creative, open-minded individuals need a different approach—one that works with their psychology, not against it."

SafeFocus isn't just another to-do app. It's a carefully designed system that understands the unique challenges faced by ambitious but organizationally-challenged individuals. By hiding complexity and promoting single-task focus, it helps break the cycle of overwhelm and procrastination.

## 📞 Support & Feedback

- 🐛 **Bug Reports**: [Create an issue](https://github.com/yourusername/safefocus/issues)
- 💡 **Feature Requests**: [Start a discussion](https://github.com/yourusername/safefocus/discussions)
- ❓ **Questions**: Check the [FAQ](https://github.com/yourusername/safefocus/wiki/FAQ) or ask in discussions

---

**Made with ❤️ for the ambitious but lazy**

*Remember: Your struggle with traditional productivity doesn't make you lazy—it makes you human. You just need tools that work with your brain, not against it.*
