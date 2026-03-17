# Deploy on AWS (Amazon Linux 2 + RDS + Nginx)

This guide deploys:
- Backend (Node/Express) on EC2
- Frontend (Vite build) served by Nginx on EC2
- MySQL on RDS
- HTTPS via Let’s Encrypt

## 1) RDS (MySQL)
1. Create an RDS MySQL instance (db.t3.micro is fine for testing).
2. VPC/Security Group: allow inbound 3306 **only** from your EC2 security group.
3. Create database (e.g., `art_shop`).
4. Save: host, port, username, password.

## 2) EC2 prerequisites (Amazon Linux 2)
Install Node.js 18, Nginx, Git, and build tools:

- Enable Node 18:
  - `curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -`
  - `sudo yum install -y nodejs git nginx`

Enable and start Nginx:
- `sudo systemctl enable nginx`
- `sudo systemctl start nginx`

Install PM2 globally:
- `sudo npm i -g pm2`

## 3) Upload project and install deps
Clone repo and install deps:
- `git clone <your_repo_url> /opt/sell-pictures`
- `cd /opt/sell-pictures/backend && npm install`
- `cd /opt/sell-pictures/frontend && npm install`

## 4) Backend env
Create `/opt/sell-pictures/backend/.env`:

DB_HOST=<rds-endpoint>
DB_USER=<rds-user>
DB_PASSWORD=<rds-password>
DB_NAME=art_shop
JWT_SECRET=<strong-secret>
PORT=5000
CORS_ORIGIN=https://<your-domain>

## 5) Database schema
From your local machine or EC2:
- `mysql -h <rds-endpoint> -u <rds-user> -p art_shop < /opt/sell-pictures/backend/scripts/schema.sql`

## 6) Build and run backend
- `cd /opt/sell-pictures/backend`
- `npm run build`
- `pm2 start dist/server.js --name sell-pictures-backend`
- `pm2 save`

## 7) Frontend env and build
Create `/opt/sell-pictures/frontend/.env`:

VITE_API_BASE_URL=https://<your-domain>

Build:
- `cd /opt/sell-pictures/frontend`
- `npm run build`

## 8) Nginx config
Create `/etc/nginx/conf.d/sell-pictures.conf`:

server {
  listen 80;
  server_name <your-domain> www.<your-domain>;

  root /opt/sell-pictures/frontend/dist;
  index index.html;

  location /api/ {
    proxy_pass http://127.0.0.1:5000/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }

  location /uploads/ {
    alias /opt/sell-pictures/backend/uploads/;
    access_log off;
    expires 30d;
  }

  location / {
    try_files $uri /index.html;
  }
}

Then:
- `sudo nginx -t`
- `sudo systemctl reload nginx`

## 9) HTTPS
Install Certbot for Nginx:
- `sudo amazon-linux-extras install epel -y`
- `sudo yum install -y certbot python2-certbot-nginx`
- `sudo certbot --nginx -d <your-domain> -d www.<your-domain>`

## 10) Security Group
- Inbound: 80, 443 from anywhere; 22 from your IP only
- RDS: 3306 from EC2 SG only

## 11) Smoke checks
- `https://<your-domain>` loads frontend
- `https://<your-domain>/api/paintings` returns JSON
- `https://<your-domain>/uploads/<file>` serves an image

## 12) Update deployment
- `cd /opt/sell-pictures && git pull`
- Rebuild backend and frontend
- `pm2 restart sell-pictures-backend`
- `sudo systemctl reload nginx`

## Notes
- Uploads are stored on EC2 filesystem. For production, consider S3.
- Set `CORS_ORIGIN` to your domain for security.
