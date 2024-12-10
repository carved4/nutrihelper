OAuth Provider Keys:
Google OAuth:
a. Go to Google Cloud Console (https://console.cloud.google.com/)
b. Create a new project
c. Navigate to "Credentials"
d. Click "Create Credentials" > "OAuth client ID"
e. Choose "Web application"
f. Add authorized JavaScript origins and redirect URIs
Local: http://localhost:3000
Deployed: https://your-domain.com
GitHub OAuth:
a. Go to GitHub Settings (https://github.com/settings/developers)
b. Click "New OAuth App"
c. Set Homepage URL and Authorization callback URL
Local: http://localhost:3000
Deployed: https://your-domain.com/api/auth/callback/github
NextAuth Secret:
Generate a secure random string
Use a command like:
Deployment Considerations:
Use environment-specific configurations
Never commit sensitive keys to version control
Use platform-specific environment variable settings
Vercel: Project Settings > Environment Variables
Netlify: Site Settings > Build & Deploy > Environment
Render: Web Service > Environment
Example .env template for deployment:
Recommendations:
1. Use different OAuth app registrations for:
Local development
Staging environment
Production deployment
Configure allowed redirect URIs carefully
3. Use environment variables in deployment platforms
Rotate secrets periodically
Would you like me to elaborate on any specific part of obtaining and managing these keys?