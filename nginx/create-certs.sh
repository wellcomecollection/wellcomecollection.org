PURPLE='\033[0;35m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'
# TODO: Get this from `nginx -V`
NGINX_CONF_PATH=/usr/local/etc/nginx/
PEM_PATH=certs/wellcomecollection.org.pem
KEY_PATH=certs/wellcomecollection.org.key
CURRENT_PATH=$(pwd)/


openssl req -x509 -sha256 -newkey rsa:2048 \
            -keyout ./${KEY_PATH} \
            -out ./${PEM_PATH} \
            -days 1024 -nodes -subj '/CN=dev-wellcomecollection.org'


# I don't do the whole directory incase we need to add others for other projects
mkdir -p ${CURRENT_PATH}certs
mkdir -p ${NGINX_CONF_PATH}certs

cp ${CURRENT_PATH}${KEY_PATH} ${NGINX_CONF_PATH}${KEY_PATH}
cp ${CURRENT_PATH}${PEM_PATH} ${NGINX_CONF_PATH}${PEM_PATH}
cp ${CURRENT_PATH}wellcomecollection.org.conf ${NGINX_CONF_PATH}sites-enabled/wellcomecollection.org.conf

SEC_COM="sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain \
${NGINX_CONF_PATH}${PEM_PATH}"

echo "${CYAN}We need sudo to add the cert to your keychain${NC}"
echo "${CYAN}You can do this manually by running${NC}"
echo ${PURPLE}${SEC_COM}${NC}

eval ${SEC_COM}

# We issue this as an instruction so we don't keep appending the line
echo "${CYAN}You can add this to your hosts file if you haven't already by running:${NC}"
echo "${PURPLE}echo \"127.0.0.1 dev-wellcomecollection.org\" >> /etc/hosts${NC}"

echo "${GREEN}All Done${NC}"
