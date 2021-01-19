#!/bin/bash
# isExistApp = `pgrep httpd`
# if [[ -n  $isExistApp ]]; then
#     service apache2 stop        
# fi
cd /nodeapp
pm2 stop bin/index.js
