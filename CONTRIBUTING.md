# Contributing to DealHunter

## Getting Started

1. Fork the repository
2. Clone your fork locally
3. Create a feature branch

```bash
git checkout -b feature/your-feature-name
```

## Development Setup

```bash
# Install dependencies
npm install

# Start development server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android
```

## Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Run linting before commits

```bash
# Check lint
npm run lint
```

## Pull Request Process

1. Update documentation if needed
2. Ensure all tests pass
3. Update the CHANGELOG if applicable
4. Request review from maintainers

## Commit Messages

Use clear, descriptive commit messages:

```
feat: Add deal search functionality
fix: Fix category filter not clearing
docs: Update README with new screenshots
```

## File Structure

```
app/           # Screen components (Expo Router)
src/
  ├── store/   # Zustand state stores
  ├── services/ # External integrations
  └── ui/      # Design system, theme
```

## Questions?

Open an issue for bugs, features, or questions.
