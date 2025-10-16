#!/bin/bash
# Setup Nginx Reverse Proxy untuk Exora ID

echo "═══════════════════════════════════════════"
echo "   Nginx Reverse Proxy Setup"
echo "═══════════════════════════════════════════"
echo ""

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)

echo "Creating Nginx configuration..."

# Create Nginx config
sudo tee /etc/nginx/sites-available/Exora ID > /dev/null << EOF
server {
    listen 80;
    server_name $SERVER_IP _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Client body size (untuk upload file)
    client_max_body_size 100M;

    # Proxy ke Node.js app
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeout untuk upload file besar
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;
        send_timeout 600;
    }

    # Logs
    access_log /var/log/nginx/Exora ID_access.log;
    error_log /var/log/nginx/Exora ID_error.log;
}
EOF

# Enable site
echo "Enabling site..."
sudo ln -sf /etc/nginx/sites-available/Exora ID /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx config
echo "Testing Nginx configuration..."
sudo nginx -t

if [ $? -eq 0 ]; then
    # Restart Nginx
    echo "Restarting Nginx..."
    sudo systemctl restart nginx
    
    echo ""
    echo "═══════════════════════════════════════════"
    echo "   ✅ Nginx Setup Complete!"
    echo "═══════════════════════════════════════════"
    echo ""
    echo "Your application is now accessible at:"
    echo ""
    echo "  🌐 http://$SERVER_IP"
    echo ""
    echo "Test with:"
    echo "  curl http://$SERVER_IP/api/health"
    echo ""
else
    echo "❌ Nginx configuration test failed!"
    echo "Please check the error messages above"
fi

echo ""
echo "Next step: Setup firewall"
echo "  Run: bash setup-firewall.sh"
echo ""
