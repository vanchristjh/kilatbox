#!/bin/bash
# Setup UFW Firewall

echo "═══════════════════════════════════════════"
echo "   Firewall (UFW) Setup"
echo "═══════════════════════════════════════════"
echo ""

echo "Configuring firewall rules..."

# Allow SSH
sudo ufw allow 22/tcp
echo "✅ SSH allowed (port 22)"

# Allow HTTP
sudo ufw allow 80/tcp
echo "✅ HTTP allowed (port 80)"

# Allow HTTPS
sudo ufw allow 443/tcp
echo "✅ HTTPS allowed (port 443)"

# Enable UFW
echo ""
echo "Enabling firewall..."
echo "y" | sudo ufw enable

# Show status
echo ""
sudo ufw status

echo ""
echo "═══════════════════════════════════════════"
echo "   ✅ Firewall Setup Complete!"
echo "═══════════════════════════════════════════"
echo ""
