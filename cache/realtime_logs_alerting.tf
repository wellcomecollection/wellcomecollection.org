# Per-behaviour 5xx alerting for the prod distribution, from CloudFront
# real-time logs: a Kinesis stream, a lambda turning records into
# CloudFront/ByCacheBehaviour metrics, alarms on those, and a responder that
# posts to Slack with the failing URLs attached. Same mechanism as
# api.wellcomecollection.org, instantiated from the shared module.
#
# Everything lands in us-east-1 (this stack's default region), which is where
# CloudFront wants the stream and publishes its metrics.

module "alerting" {
  source = "git::github.com/wellcomecollection/platform-infrastructure.git//cloudfront/modules/cloudfront_alerting?ref=5073902a48d9c7ec847fc3e7d00ecbfae833ed8f"

  distribution_domain = "wellcomecollection.org"

  stream_name              = "cloudfront-wc-org-realtime-logs"
  realtime_log_config_name = "wc-org-requests"
  metrics_function_name    = "send_wc_org_behaviour_metrics"
  responder_function_name  = "send_wc_org_5xx_alarm_detail"
  responder_topic_name     = "cloudfront-5xx-alarm-responder"
  alarm_name_prefix        = "cloudfront-wc-org"

  chatbot_topic_arn = local.monitoring_infra["chatbot_topic_arns"]["us-east-1"]

  # Peak observed over 2026-08-06 to 2026-08-12 is ~52 requests/sec against a
  # shard limit of 1000/sec.
  shard_count = 1

  # Measured over 2026-08-06 to 2026-08-12, 28.3M requests (~4.0M/day):
  #
  #   /_next/*       43.3%   ~6,079 req/5min    0 5xx all week
  #   /works*        31.0%   ~4,348 req/5min   37 5xx, max 31/5min
  #   * (default)     6.7%     ~937 req/5min  3,086 5xx, max 369/5min
  #   /_next/data/*   6.3%     ~878 req/5min   12 5xx
  #   /concepts*      5.1%     ~712 req/5min    1 5xx
  #   /account*       4.0%     ~563 req/5min  148 5xx, max 12/5min
  #   /search*        3.0%     ~425 req/5min    9 5xx
  #   /events* and below: under 0.5% each
  #
  # The two big behaviours have the volume for a rate to behave; the mid-size
  # ones get an absolute count, because a rate on a few hundred requests per
  # 5 minutes reads a handful of errors as a spike. 20 errors in 5 minutes is
  # a real fault at any of these volumes: /account* peaked at 12 all week.
  counted_behaviours = {
    "/account*"     = { threshold = 20 }
    "/concepts*"    = { threshold = 20 }
    "/search*"      = { threshold = 20 }
    "/_next/data/*" = { threshold = 20 }
  }

  rate_behaviours = {
    "/works*"  = { threshold_percent = 1 }
    "/_next/*" = { threshold_percent = 1 }
  }

  # The default behaviour has no alarm of its own: its 3,086 5xx over the
  # measured week were almost all 502s from bots probing junk paths (.php,
  # wp-json), spiking to 369 in one 5-minute window, so any threshold either
  # flaps on bot bursts or ignores real errors. The distribution-wide
  # 5xxErrorRate alarm in alarms.tf stays as the backstop for it: an origin
  # outage on the default behaviour trips that within a period.

  # Never quieter than ~2,700 req/5min all week, so its silence means the
  # metrics pipeline is down, not the site being unpopular.
  canary_behaviour = "/_next/*"
}
