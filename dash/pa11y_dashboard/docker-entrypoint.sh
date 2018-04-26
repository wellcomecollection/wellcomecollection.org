#!/bin/sh

# Set up the pa11y configuration.
echo "{\n"\
  "  \"port\": $PA11Y_PORT,\n"\
  "  \"noindex\": $PA11Y_NOINDEX,\n"\
  "  \"readonly\": $PA11Y_READONLY,\n"\
  "  \"webservice\": {\n"\
	"    \"database\": \"$PA11Y_WEBSERVICE_DATABASE\",\n"\
	"    \"host\": \"$PA11Y_WEBSERVICE_HOST\",\n"\
	"    \"port\": $PA11Y_WEBSERVICE_PORT,\n"\
	"    \"cron\": \"$PA11Y_WEBSERVICE_CRON\"\n"\
	"  }\n"\
	"}" | tee /dashboard/config/production.json

# Start up the dashboard.
cd /dashboard && node .
