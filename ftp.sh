IP="1.239.10.194"
USER_ID="luck3862"
USER_PW="Ysw158962@"

ftp -i -n $IP <<EOF

user $USER_ID $USER_PW

cd Drive/FTP

pas

get btc_server.js

EOF
