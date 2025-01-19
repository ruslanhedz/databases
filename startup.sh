#!/bin/sh

# Run the backup script immediately on startup
sh ./backup.sh

# Schedule the backup script to run every 24 hours
echo "0 0 * * * sh ./backup.sh" | crontab -
