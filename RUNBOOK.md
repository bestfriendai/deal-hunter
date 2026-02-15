# DealHunter Runbook

## Daily Operations

### Monitoring

- **Crash Reports**: Check Expo dashboard for any crashes
- **Performance**: Monitor app startup time and screen transitions
- **Storage**: Monitor AsyncStorage usage, clean up old deals periodically

### Content Management

- **Sample Data**: App seeds sample deals on first launch
- **Deal Expiration**: Expired deals remain in storage but show expiration date
- **Manual Cleanup**: Users can delete deals in Settings

## Troubleshooting

### Common Issues

#### "No deals found"
- Normal on first launch - sample deals will appear after app starts
- Check AsyncStorage permissions

#### App crashes on launch
- Clear app cache and data
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Expo CLI version compatibility

#### Search not working
- Verify deals exist in storage
- Check search query string handling

### Debug Mode

```bash
# Enable developer menu
npx expo start --dev-client

# Clear all storage (in app code)
await AsyncStorage.clear();
```

## Maintenance Tasks

### Weekly
- Check for Expo SDK updates
- Review user feedback (if implemented)

### Monthly
- Review and update ASO keywords
- Check competitor apps for feature parity

### Quarterly
- Major Expo SDK updates
- Design refresh consideration

## Support Resources

- Expo Documentation: https://docs.expo.dev
- React Native: https://reactnative.dev
- Zustand: https://github.com/pmndrs/zustand
