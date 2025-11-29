# 🔐 Security Guidelines - LaporIn

## ⚠️ API Keys & Secrets Management

### Critical Security Rules

1. **NEVER commit API keys, secrets, or credentials to Git**
   - All API keys must be stored in environment variables
   - Use `.env.local` for local development (already in `.gitignore`)
   - Use Vercel/Railway environment variables for production

2. **Google Maps API Key**
   - **Frontend**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` (exposed to client-side)
     - ⚠️ This key will be visible in browser/client code
     - **Solution**: Use API key with HTTP referrer restrictions in Google Cloud Console
     - Restrict key to only your domain: `*.vercel.app`, `*.railway.app`, `yourdomain.com`
   - **Backend**: `GOOGLE_MAPS_API_KEY` (server-side only)
     - ✅ This is safe as it's only used server-side

3. **Other Sensitive Keys**
   - Database URL: `DATABASE_URL`
   - JWT Secret: `JWT_SECRET`
   - Encryption Key: `ENCRYPTION_KEY`
   - AI API Keys: `GROQ_API_KEY`
   - Blockchain Private Keys: Never commit!

### Environment Variables Setup

#### Frontend (.env.local)
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3001/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key_here
```

#### Backend (.env)
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret_here
GOOGLE_MAPS_API_KEY=your_key_here
GROQ_API_KEY=your_key_here
ENCRYPTION_KEY=your_key_here
```

### Google Maps API Key Security

Since `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is exposed to client-side:

1. **Set HTTP Referrer Restrictions** in Google Cloud Console:
   - Go to Google Cloud Console → APIs & Services → Credentials
   - Edit your API key
   - Under "Application restrictions", select "HTTP referrers (web sites)"
   - Add allowed referrers:
     ```
     https://*.vercel.app/*
     https://*.railway.app/*
     https://yourdomain.com/*
     http://localhost:3000/*
     ```

2. **Set API Restrictions**:
   - Under "API restrictions", select "Restrict key"
   - Only enable: "Maps JavaScript API", "Geocoding API"

3. **Monitor Usage**:
   - Set up billing alerts
   - Monitor API usage in Google Cloud Console
   - Rotate keys if compromised

### If API Key is Exposed

1. **Immediately**:
   - Go to Google Cloud Console
   - Delete or regenerate the exposed API key
   - Create a new key with proper restrictions

2. **Check Git History**:
   ```bash
   git log --all --full-history -S "AIza" --oneline
   ```

3. **Remove from History** (if needed):
   - Use `git filter-branch` or BFG Repo-Cleaner
   - Force push (⚠️ coordinate with team first)

### Best Practices

1. ✅ Always use environment variables
2. ✅ Never hardcode secrets in code
3. ✅ Use `.env.example` for documentation (without real values)
4. ✅ Review `.gitignore` regularly
5. ✅ Use different keys for dev/staging/production
6. ✅ Rotate keys periodically
7. ✅ Monitor API usage and billing

### Files to Check Before Committing

- ✅ No `.env` files (except `.env.example`)
- ✅ No hardcoded API keys in code
- ✅ No secrets in documentation
- ✅ No credentials in config files

---

**Last Updated**: 2025-01-XX
**Maintained by**: Weladalah Team

