# DealHunter Testing Guide

## Manual Testing Checklist

### Core Functionality

- [ ] App launches without crash
- [ ] Sample deals load on first launch
- [ ] Deals display with all information (title, business, discount, location)
- [ ] Category filtering works correctly
- [ ] Search filters deals by title and business name
- [ ] Pull-to-refresh reloads deals

### Favorites

- [ ] Tap heart icon toggles favorite status
- [ ] Favorites persist after app restart
- [ ] Favorites tab shows only favorited deals
- [ ] Favorites count updates in tab badge

### Deal Detail

- [ ] Tap deal card navigates to detail screen
- [ ] All deal information displays correctly
- [ ] Back navigation works
- [ ] Claim deal button functions (marks as claimed)

### Add Deal

- [ ] Add deal button navigates to form
- [ ] Form validates required fields
- [ ] New deal appears in list after saving
- [ ] Cancel discards changes

### Settings

- [ ] Theme toggle switches between light/dark
- [ ] Settings persist after restart
- [ ] Clear all deals removes all data
- [ ] Stats display accurate counts

### Onboarding

- [ ] First launch shows onboarding flow
- [ ] Skip button works
- [ ] Completion marks onboarding as done

### Paywall

- [ ] Premium upgrade screen accessible
- [ ] Subscription options display
- [ ] Close/Back navigation works

## Device Testing

### Required
- iOS Simulator (latest)
- Android Emulator (latest)

### Recommended
- Physical iOS device
- Physical Android device

## Performance Targets

- App launch: < 2 seconds
- Screen transition: < 300ms
- Search response: < 100ms
- Pull-to-refresh: < 1 second

## Automated Testing

### Unit Tests

```bash
# Run with Jest (if configured)
npm test
```

### Linting

```bash
# Check code style
npx expo lint

# Or ESLint
npx eslint .
```
