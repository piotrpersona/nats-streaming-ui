IP=$( /sbin/ip route|awk '/default/ { print $3 }');

sed -i "4s/127.0.0.1/${IP}/g" ./server/settings.js
sed -i "5s/127.0.0.1/${IP}/g" ./server/settings.js