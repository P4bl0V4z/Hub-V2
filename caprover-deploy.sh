#!/bin/bash
# Script manual para hacer deploy usando CapRover CLI

# BACKEND
caprover deploy -h https://captain.yourdomain.com -a hub2-backend -p ./backend -t $CAPROVER_TOKEN

# FRONTEND
caprover deploy -h https://captain.yourdomain.com -a hub2-frontend -p ./frontend -t $CAPROVER_TOKEN