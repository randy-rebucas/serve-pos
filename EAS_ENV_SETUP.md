# EAS Environment Variables Setup

This guide explains how to securely manage environment variables for Expo EAS builds.

## Overview

Environment variables are handled differently for:
- **Local Development**: Uses `.env` file (not committed to git)
- **EAS Builds**: Uses EAS Secrets (stored securely in Expo's cloud)

## Local Development Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your local values:
   ```bash
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   EXPO_PUBLIC_TENANT_SLUG=default
   ```

3. For physical devices, use your computer's IP address:
   ```bash
   EXPO_PUBLIC_API_URL=http://192.168.1.100:3000/api
   ```

4. Restart the Expo dev server after changes.

## EAS Build Setup (Production)

### Setting Up EAS Secrets

EAS Secrets are encrypted and stored securely. They're injected during the build process.

#### 1. Install EAS CLI (if not already installed)
```bash
npm install -g eas-cli
```

#### 2. Login to EAS
```bash
eas login
```

#### 3. Create Secrets for Each Build Profile

**For Development builds:**
```bash
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://dev-api.example.com/api" --type string
eas secret:create --scope project --name EXPO_PUBLIC_TENANT_SLUG --value "dev-tenant" --type string
```

**For Preview builds:**
```bash
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://staging-api.example.com/api" --type string --environment preview
eas secret:create --scope project --name EXPO_PUBLIC_TENANT_SLUG --value "staging-tenant" --type string --environment preview
```

**For Production builds:**
```bash
eas secret:create --scope project --name EXPO_PUBLIC_API_URL --value "https://api.example.com/api" --type string --environment production
eas secret:create --scope project --name EXPO_PUBLIC_TENANT_SLUG --value "production-tenant" --type string --environment production
```

#### 4. List Existing Secrets
```bash
eas secret:list
```

#### 5. Update a Secret
```bash
eas secret:update --name EXPO_PUBLIC_API_URL --value "https://new-api.example.com/api"
```

#### 6. Delete a Secret
```bash
eas secret:delete --name EXPO_PUBLIC_API_URL
```

### How It Works

1. **During EAS Build**: 
   - EAS reads secrets based on the build profile (development/preview/production)
   - Secrets are injected as environment variables during the build
   - `app.config.js` reads these via `process.env` and adds them to `expo.extra`
   - The app accesses them via `Constants.expoConfig.extra`

2. **In the App Code**:
   - Development: Uses `process.env.EXPO_PUBLIC_*` from `.env` file
   - Production: Uses `Constants.expoConfig.extra` (populated from EAS secrets)

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `EXPO_PUBLIC_API_URL` | Base URL for the API | `https://api.example.com/api` |
| `EXPO_PUBLIC_TENANT_SLUG` | Tenant identifier | `default` |

## Security Notes

- ✅ `.env` files are gitignored and never committed
- ✅ EAS Secrets are encrypted and stored securely
- ✅ Secrets are scoped per project and environment
- ✅ Only team members with access can view/update secrets
- ⚠️ `EXPO_PUBLIC_*` variables are exposed in the client bundle (by design)
- ⚠️ Never put sensitive secrets (API keys, tokens) in `EXPO_PUBLIC_*` variables

## Troubleshooting

### Variables not working in production build?

1. Verify secrets are set:
   ```bash
   eas secret:list
   ```

2. Check `eas.json` has the correct environment variable names

3. Verify `app.config.js` is reading from `process.env` correctly

4. Check build logs for any environment variable errors

### Variables work locally but not in EAS build?

- Ensure secrets are created for the correct build profile (development/preview/production)
- Verify the secret names match exactly (case-sensitive)
- Check that `app.config.js` is being used (not `app.json`)

## Additional Resources

- [EAS Secrets Documentation](https://docs.expo.dev/build-reference/variables/)
- [Expo Environment Variables](https://docs.expo.dev/guides/environment-variables/)
