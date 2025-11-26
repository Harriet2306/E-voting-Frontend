# Deployment Guide for VoteSphere Frontend

## Production Deployment Steps

### 1. Build the Frontend
```bash
cd /var/www/dit_frontend
npm install
npm run build
```

This creates a `dist` folder with optimized production files.

### 2. Install Express (if not already installed)
```bash
npm install express
```

### 3. Start with PM2
```bash
pm2 start server.cjs --name dit_frontend
pm2 save
pm2 startup  # Run this once to enable PM2 on system startup
```

### 4. Verify it's Running
```bash
pm2 status
pm2 logs dit_frontend
```

Your frontend should now be accessible at: **http://64.23.169.136:3063**

**Note:** Make sure port 3063 is open in your firewall:
```bash
sudo ufw allow 3063
sudo ufw reload
```

### 5. Configure Nginx (Optional but Recommended)

Create `/etc/nginx/sites-available/dit_frontend`:
```nginx
server {
    listen 80;
    server_name 64.23.169.136;

    location / {
        proxy_pass http://localhost:3063;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Note:** If you prefer to access directly via IP and port without Nginx, you can skip this step and access your frontend at `http://64.23.169.136:3063` directly.

Then enable it:
```bash
sudo ln -s /etc/nginx/sites-available/dit_frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Environment Variables

The `.env` file is included with:
```
VITE_API_URL=http://64.23.169.136:5656/api
```

## Troubleshooting

- **Port already in use**: Change PORT in server.cjs or use `PORT=3063 pm2 start server.cjs`
- **dist folder missing**: Run `npm run build` first
- **Cannot find module 'express'**: Run `npm install express`
- **404 errors on routes**: Make sure server.cjs is serving index.html for all routes
- **Cannot connect from outside**: Check firewall rules with `sudo ufw status` and ensure port 3063 is allowed
- **PathError with wildcard routes**: This has been fixed in the current server.cjs - if you see this error, pull the latest version

## PM2 Commands

```bash
pm2 restart dit_frontend    # Restart the app
pm2 stop dit_frontend       # Stop the app
pm2 delete dit_frontend     # Remove from PM2
pm2 logs dit_frontend       # View logs
pm2 monit                   # Monitor resources
```


