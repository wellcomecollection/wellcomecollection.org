locals {
  // Rate limits cover 5 minute windows

  // We saw significant performance degradation for
  // random (404ing) requests at about 8-10k transactions per minute,
  // which led us to set this initially to 5000. We later saw non-random
  // requests (ie, to non-404ing) URLs that were causing the content application
  // to struggle at around 800tpm, leading us to halve that number.
  blanket_rate_limit = 2500

  // A more restrictive limit for expensive URLs (eg /works)
  // Prefix matches, so subpaths like /search/works and /works/{id}/items
  // are covered too.
  restrictive_rate_limit  = 1000
  restricted_path_regexes = ["^\\/works", "^\\/images", "^\\/concepts", "^\\/search"]

  // These come from the information security team
  // Qualys is an "enterprise vulnerability management tool"
  // They get the list from the Qualys Cloud Portal
  qualys_scanner_ips = toset([
    "151.104.35.212",
    "151.104.35.215",
    "151.104.32.131",
    "151.104.32.115",
    "151.104.34.237",
    "151.104.34.255",
    "151.104.35.70",
    "151.104.33.138",
    "151.104.33.133",
    "151.104.35.241",
    "151.104.35.184",
    "151.104.33.225",
    "151.104.33.135",
    "151.104.34.102",
    "151.104.34.22",
    "151.104.34.6",
    "151.104.32.9",
  ])

  ip_allowlist = setunion(var.waf_ip_allowlist, local.qualys_scanner_ips)

  cidr_watchlist = [
    "20.49.161.16/28",
    "20.77.132.128/28"
  ]

  // This is the complete list of Bot Control rules from
  // https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-bot.html
  //
  // For ease of maintenance, we have the complete list here and comment out those rules which are
  // we wish to be enabled or that we wish to remain enabled.
  // Everything that is not commented out in this list will be disabled by setting its action to count.
  //
  // Config and rationale currently reflect's @jamieparkinson's understanding 3/1/2024
  //
  // TL;DR comment out a rule if you want to enable it
  bot_control_rule_no_block_list = [
    "CategoryAdvertising",       // No substantial traffic
    "CategoryArchiver",          // Traffic is always desirable
    "CategoryContentFetcher",    // Traffic is always desirable
    "CategoryEmailClient",       // Traffic is always desirable
    "CategoryHttpLibrary",       // High-risk for breaking scripts and other application services
    "CategoryLinkChecker",       // No substantial traffic
    "CategoryMiscellaneous",     // No substantial traffic
    "CategoryMonitoring",        // Traffic is always desirable
    "CategoryScrapingFramework", // No substantial traffic
    "CategorySearchEngine",      // Traffic is always desirable
    "CategorySecurity",          // Traffic is always desirable
    // "CategorySeo",            // Unverified SEO bots are the source of the _vast_ majority of our bot traffic
    "CategorySocialMedia",       // Traffic is always desirable
    "CategoryAI",                // No substantial traffic
    "SignalAutomatedBrowser",    // No substantial traffic
    "SignalKnownBotDataCenter",  // Known bot data centres include "good" bots such as Updown
    "SignalNonBrowserUserAgent", // High risk for breaking scripts and other application services
  ]

  // The targeted-inspection rules start in count mode: they label /search
  // traffic for analysis without acting. Remove a rule from this list to
  // enable its default action once the label soak supports it.
  bot_control_targeted_count_list = [
    // CAUTION: names must exactly match the rules in the pinned rule set
    // version (aws wafv2 describe-managed-rule-group); an override for a
    // name that does not exist is silently ignored and the real rule runs
    // with its default action (Captcha or Block for several of these).
    "TGT_VolumetricIpTokenAbsent",
    "TGT_VolumetricSession",
    "TGT_VolumetricSessionMaximum",
    "TGT_SignalBrowserAutomationExtension",
    "TGT_SignalAutomatedBrowser",
    "TGT_SignalBrowserInconsistency",
    "TGT_TokenAbsent",
    "TGT_TokenReuseIpLow",
    "TGT_TokenReuseIpMedium",
    "TGT_TokenReuseIpHigh",
    "TGT_TokenReuseCountryLow",
    "TGT_TokenReuseCountryMedium",
    "TGT_TokenReuseCountryHigh",
    "TGT_TokenReuseAsnLow",
    "TGT_TokenReuseAsnMedium",
    "TGT_TokenReuseAsnHigh",
    "TGT_ML_CoordinatedActivityLow",
    "TGT_ML_CoordinatedActivityMedium",
    "TGT_ML_CoordinatedActivityHigh",
  ]

  // Unverified SEO crawlers blocked unconditionally, site-wide. This
  // replaces Bot Control's CategorySeo coverage, which only sees /search
  // once the group is scoped down for targeted inspection. Measured
  // 2026-07-07: SemrushBot was ~85% of CategorySeo's blocks.
  seo_block_user_agents = [
    "SemrushBot",
    "DotBot",
    "MJ12bot",
    "MojeekBot",
    "TinEye",
    "yacybot",
  ]
}

resource "aws_wafv2_web_acl" "wc_org" {
  name        = "weco-cloudfront-acl-${var.namespace}"
  description = "Access control for the wellcomecollection.org CloudFront distributions"
  scope       = "CLOUDFRONT"

  default_action {
    allow {}
  }

  dynamic "rule" {
    for_each = length(var.allowed_countries) > 0 ? [1] : []
    content {
      name     = "geo-restriction"
      priority = 0

      action {
        block {}
      }

      statement {
        not_statement {
          statement {
            geo_match_statement {
              country_codes = var.allowed_countries
            }
          }
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        sampled_requests_enabled   = true
        metric_name                = "geo-restriction-${var.namespace}"
      }
    }
  }

  rule {
    name     = "ip-allowlist"
    priority = 1

    action {
      allow {}
    }

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.allowlist.arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = false
      sampled_requests_enabled   = false
      metric_name                = "weco-cloudfront-acl-allowlist-${var.namespace}"
    }
  }

  rule {
    name     = "ip-blocklist"
    priority = 2

    action {
      block {}
    }

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.blocklist.arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-acl-blocklist-${var.namespace}"
    }
  }

  rule {
    name     = "ip-watchlist"
    priority = 3

    action {
      count {}
    }

    statement {
      ip_set_reference_statement {
        arn = aws_wafv2_ip_set.watchlist.arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-acl-watchlist-${var.namespace}"
    }
  }

  rule {
    name     = "allow-google-bots"
    priority = 4

    action {
      allow {}
    }

    statement {
      and_statement {
        statement {
          ip_set_reference_statement {
            arn = var.google_bots_ip_set_arn
          }
        }
        statement {
          byte_match_statement {
            positional_constraint = "CONTAINS"
            search_string         = "Googlebot"

            field_to_match {
              single_header {
                name = "user-agent"
              }
            }

            text_transformation {
              priority = 0
              type     = "NONE"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "allow-google-bots-${var.namespace}"
    }
  }

  rule {
    name     = "allow-github-actions"
    priority = 5

    action {
      allow {}
    }

    statement {
      ip_set_reference_statement {
        arn = var.github_actions_ip_set_arn
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "allow-github-actions-${var.namespace}"
    }
  }

  rule {
    name     = "managed-ip-blocking"
    priority = 6

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        // https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-ip-rep.html
        name        = "AWSManagedRulesAmazonIpReputationList"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-acl-ip-block-${var.namespace}"
    }
  }

  rule {
    name     = "bot-user-agent-manual"
    priority = 7

    action {
      block {}
    }

    statement {
      rate_based_statement {
        aggregate_key_type    = "CONSTANT"
        evaluation_window_sec = 60
        limit                 = 300

        scope_down_statement {
          or_statement {
            statement {
              byte_match_statement {
                positional_constraint = "CONTAINS"
                search_string         = "Amazonbot"

                field_to_match {
                  single_header {
                    name = "user-agent"
                  }
                }

                text_transformation {
                  priority = 0
                  type     = "NONE"
                }
              }
            }

            statement {
              byte_match_statement {
                positional_constraint = "CONTAINS"
                search_string         = "Applebot"

                field_to_match {
                  single_header {
                    name = "user-agent"
                  }
                }

                text_transformation {
                  priority = 0
                  type     = "NONE"
                }
              }
            }
            statement {
              byte_match_statement {
                positional_constraint = "CONTAINS"
                search_string         = "Claude-SearchBot"

                field_to_match {
                  single_header {
                    name = "user-agent"
                  }
                }

                text_transformation {
                  priority = 0
                  type     = "NONE"
                }
              }
            }
            statement {
              byte_match_statement {
                positional_constraint = "CONTAINS"
                search_string         = "ClaudeBot"

                field_to_match {
                  single_header {
                    name = "user-agent"
                  }
                }

                text_transformation {
                  priority = 0
                  type     = "NONE"
                }
              }
            }
            statement {
              byte_match_statement {
                positional_constraint = "CONTAINS"
                search_string         = "GoogleOther"

                field_to_match {
                  single_header {
                    name = "user-agent"
                  }
                }

                text_transformation {
                  priority = 0
                  type     = "NONE"
                }
              }
            }
            statement {
              byte_match_statement {
                positional_constraint = "CONTAINS"
                search_string         = "GPTBot"

                field_to_match {
                  single_header {
                    name = "user-agent"
                  }
                }

                text_transformation {
                  priority = 0
                  type     = "NONE"
                }
              }
            }
            statement {
              byte_match_statement {
                positional_constraint = "CONTAINS"
                search_string         = "PetalBot"

                field_to_match {
                  single_header {
                    name = "user-agent"
                  }
                }

                text_transformation {
                  priority = 0
                  type     = "NONE"
                }
              }
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "bot-user-agent-manual"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "apac-captcha-consent-block"
    priority = 8

    action {
      captcha {}
    }

    statement {
      and_statement {
        statement {
          geo_match_statement {
            country_codes = ["CN", "JP", "SG", "TW", "VN"]
          }
        }
        statement {
          not_statement {
            statement {
              size_constraint_statement {
                comparison_operator = "GT"
                size                = 0

                field_to_match {
                  cookies {
                    match_pattern {
                      included_cookies = ["CookieControl"]
                    }
                    match_scope       = "ALL"
                    oversize_handling = "MATCH"
                  }
                }

                text_transformation {
                  priority = 0
                  type     = "NONE"
                }
              }
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "apac-captcha-consent-block"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "latam-captcha-consent-block"
    priority = 9

    action {
      captcha {}
    }

    statement {
      and_statement {
        statement {
          geo_match_statement {
            country_codes = ["BR"]
          }
        }
        statement {
          not_statement {
            statement {
              size_constraint_statement {
                comparison_operator = "GT"
                size                = 0

                field_to_match {
                  cookies {
                    match_pattern {
                      included_cookies = ["CookieControl"]
                    }
                    match_scope       = "ALL"
                    oversize_handling = "MATCH"
                  }
                }

                text_transformation {
                  priority = 0
                  type     = "NONE"
                }
              }
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "latam-captcha-consent-block"
      sampled_requests_enabled   = true
    }
  }

  // Blocks /search requests whose User-Agent claims a Chrome major version
  // below 100 (released 2017-2022). Chrome auto-updates, so genuinely old
  // majors are vanishingly rare, and the 2026-07 flood rotates these strings
  // (a flat distribution across v60-77, with impossible pairings like Vista +
  // Chrome 76) and never attempts the JS challenge. Blocking here is free;
  // every challenge response the rule below serves instead is billed.
  dynamic "rule" {
    for_each = var.enable_search_legacy_ua_block ? [1] : []
    content {
      name     = "search-legacy-ua-block"
      priority = 10

      action {
        block {}
      }

      statement {
        and_statement {
          statement {
            byte_match_statement {
              positional_constraint = "STARTS_WITH"
              search_string         = "/search"

              field_to_match {
                uri_path {}
              }

              text_transformation {
                priority = 0
                type     = "NONE"
              }
            }
          }

          statement {
            regex_match_statement {
              regex_string = "Chrome/[0-9]{1,2}\\."

              field_to_match {
                single_header {
                  name = "user-agent"
                }
              }

              text_transformation {
                priority = 0
                type     = "NONE"
              }
            }
          }
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        sampled_requests_enabled   = true
        metric_name                = "search-legacy-ua-block-${var.namespace}"
      }
    }
  }

  // Blocks /search requests with no Accept-Language header, ahead of the
  // billed challenge. Every real browser sends Accept-Language on every page
  // navigation; the clients that omit it are crawlers and bots that cannot
  // solve the challenge anyway (measured 2026-07-08: 46% of challenged
  // traffic). Blocking here is free; each challenge response is billed.
  dynamic "rule" {
    for_each = var.enable_search_missing_lang_block ? [1] : []
    content {
      name     = "search-missing-lang-block"
      priority = 11

      action {
        block {}
      }

      statement {
        and_statement {
          statement {
            byte_match_statement {
              positional_constraint = "STARTS_WITH"
              search_string         = "/search"

              field_to_match {
                uri_path {}
              }

              text_transformation {
                priority = 0
                type     = "NONE"
              }
            }
          }

          statement {
            not_statement {
              statement {
                size_constraint_statement {
                  comparison_operator = "GT"
                  size                = 0

                  field_to_match {
                    single_header {
                      name = "accept-language"
                    }
                  }

                  text_transformation {
                    priority = 0
                    type     = "NONE"
                  }
                }
              }
            }
          }
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        sampled_requests_enabled   = true
        metric_name                = "search-missing-lang-block-${var.namespace}"
      }
    }
  }

  // Silently challenges clients that don't run JavaScript on /search pages,
  // which are expensive to render and effectively uncacheable. Real browsers
  // solve the challenge invisibly. Only the works search page is
  // noindex,nofollow, so this can affect crawling of the other /search pages.
  //
  // CAUTION: a challenge served to a fetch/XHR or asset request cannot render
  // its interstitial and breaks the page. Keep the scope to /search page URLs
  // only, and test any change on stage first.
  dynamic "rule" {
    for_each = var.enable_search_challenge ? [1] : []
    content {
      name     = "search-challenge"
      priority = 13

      action {
        challenge {}
      }

      challenge_config {
        immunity_time_property {
          immunity_time = var.search_challenge_immunity_seconds
        }
      }

      statement {
        byte_match_statement {
          positional_constraint = "STARTS_WITH"
          search_string         = "/search"

          field_to_match {
            uri_path {}
          }

          text_transformation {
            priority = 0
            type     = "NONE"
          }
        }
      }

      visibility_config {
        cloudwatch_metrics_enabled = true
        sampled_requests_enabled   = true
        metric_name                = "search-challenge-${var.namespace}"
      }
    }
  }

  rule {
    name     = "geo-rate-limit-USA"
    priority = 14

    action {
      block {
        custom_response {
          response_code = 429
        }
      }
    }

    statement {
      rate_based_statement {
        aggregate_key_type    = "CONSTANT"
        evaluation_window_sec = 60
        limit                 = 1750

        scope_down_statement {
          geo_match_statement {
            country_codes = [
              "US",
            ]
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "geo-rate-limit-USA-${var.namespace}"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "geo-rate-limit-APAC"
    priority = 15

    action {
      block {
        custom_response {
          response_code = 429
        }
      }
    }

    statement {
      rate_based_statement {
        aggregate_key_type    = "CONSTANT"
        evaluation_window_sec = 60
        limit                 = 250

        scope_down_statement {
          geo_match_statement {
            // We have seen significant bot traffic from these regions,
            // so we rate limit to a lower threshold.
            country_codes = [
              "CN",
              "SG",
              "HK",
              "VN",
            ]
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "geo-rate-limit-apac-${var.namespace}"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "geo-rate-limit-LATAM"
    priority = 16

    action {
      block {
        custom_response {
          response_code = 429
        }
      }
    }

    statement {
      rate_based_statement {
        aggregate_key_type    = "CONSTANT"
        evaluation_window_sec = 60
        limit                 = 200

        scope_down_statement {
          geo_match_statement {
            // We have seen significant bot traffic from these regions,
            // so we rate limit to a lower threshold.
            country_codes = [
              "BR",
            ]
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "geo-rate-limit-latam-${var.namespace}"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "blanket-rate-limiting"
    priority = 17

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = local.blanket_rate_limit
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-acl-rate-limit-${var.namespace}"
    }
  }

  rule {
    name     = "restrictive-rate-limiting"
    priority = 18

    action {
      block {}
    }

    statement {
      rate_based_statement {
        limit              = local.restrictive_rate_limit
        aggregate_key_type = "IP"

        scope_down_statement {
          regex_pattern_set_reference_statement {
            field_to_match {
              uri_path {}
            }

            arn = aws_wafv2_regex_pattern_set.restricted_urls.arn

            text_transformation {
              priority = 1
              type     = "URL_DECODE"
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-restrictive-rate-limit-${var.namespace}"
    }
  }

  // See: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-crs
  rule {
    name     = "core-rule-group"
    priority = 19

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-acl-core-${var.namespace}"
    }
  }

  // See: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-use-case.html#aws-managed-rule-groups-use-case-sql-db
  rule {
    name     = "sqli-rule-group"
    priority = 20

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesSQLiRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-acl-sqli-${var.namespace}"
    }
  }

  // See: https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-baseline.html#aws-managed-rule-groups-baseline-known-bad-inputs
  rule {
    name     = "known-bad-inputs-rule-group"
    priority = 21

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
        vendor_name = "AWS"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-acl-known-bad-inputs-${var.namespace}"
    }
  }

  rule {
    name     = "bot-control-rule-group"
    priority = 12

    // Because the Bot Control rules are quite aggressive, they block some useful bots
    // such as Updown. While we could add overrides for specific bots, we don"t want to have to
    // keep coming back here as we use different monitoring services, scripts, etc.
    //
    // Instead, we"re starting by disabling most of the more high-risk rules and retaining only the
    // ones like CategorySeo which we know cover the majority of our known-bad bot traffic.
    // Rules can be found here:
    // https://docs.aws.amazon.com/waf/latest/developerguide/aws-managed-rule-groups-bot.html
    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesBotControlRuleSet"
        vendor_name = "AWS"
        version     = "Version_3.1"

        managed_rule_group_configs {
          aws_managed_rules_bot_control_rule_set {
            inspection_level        = var.bot_control_inspection_level
            enable_machine_learning = var.bot_control_inspection_level == "TARGETED"
          }
        }

        // TARGETED is billed per request analysed at 10x the COMMON rate, so
        // it is only affordable scoped down to the /search pages it exists to
        // protect. The seo-user-agent-block rule replaces the group's
        // site-wide CategorySeo coverage while this scope-down is active.
        dynamic "scope_down_statement" {
          for_each = var.bot_control_inspection_level == "TARGETED" ? [1] : []
          content {
            byte_match_statement {
              positional_constraint = "STARTS_WITH"
              search_string         = "/search"

              field_to_match {
                uri_path {}
              }

              text_transformation {
                priority = 0
                type     = "NONE"
              }
            }
          }
        }

        dynamic "rule_action_override" {
          for_each = concat(
            local.bot_control_rule_no_block_list,
            var.bot_control_inspection_level == "TARGETED" ? local.bot_control_targeted_count_list : [],
          )
          content {
            name = rule_action_override.value
            action_to_use {
              count {}
            }
          }
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "weco-cloudfront-acl-bot-control-${var.namespace}"
    }
  }

  // Replaces Bot Control's site-wide CategorySeo blocking, which only covers
  // /search once the group is scoped down for targeted inspection.
  rule {
    name     = "seo-user-agent-block"
    priority = 22

    action {
      block {}
    }

    statement {
      regex_match_statement {
        regex_string = join("|", local.seo_block_user_agents)

        field_to_match {
          single_header {
            name = "user-agent"
          }
        }

        text_transformation {
          priority = 0
          type     = "NONE"
        }
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      sampled_requests_enabled   = true
      metric_name                = "seo-user-agent-block-${var.namespace}"
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    sampled_requests_enabled   = true
    metric_name                = "weco-cloudfront-acl-metric-${var.namespace}"
  }
}

resource "aws_wafv2_regex_pattern_set" "restricted_urls" {
  name  = "restricted-urls-${var.namespace}"
  scope = "CLOUDFRONT"

  dynamic "regular_expression" {
    for_each = local.restricted_path_regexes
    content {
      regex_string = regular_expression.value
    }
  }
}

resource "aws_wafv2_ip_set" "allowlist" {
  name        = "allowlist-${var.namespace}"
  description = "IPs that we do not apply managed WAF rules to"

  scope              = "CLOUDFRONT"
  ip_address_version = "IPV4"

  # These need to be CIDR blocks rather than plain addresses
  addresses = [for ip in local.ip_allowlist : "${ip}/32"]
}

resource "aws_wafv2_ip_set" "blocklist" {
  name        = "blocklist-${var.namespace}"
  description = "IPs blocked outright, an emergency lever for use during incidents"

  scope              = "CLOUDFRONT"
  ip_address_version = "IPV4"

  # Managed with `aws wafv2 update-ip-set` during incidents; terraform
  # ignores the contents so a routine apply cannot revert a live block.
  addresses = []

  lifecycle {
    ignore_changes = [addresses]
  }
}

resource "aws_wafv2_ip_set" "watchlist" {
  name        = "watchlist-${var.namespace}"
  description = "IPs that we do not apply managed WAF rules to, but we want to monitor"

  scope              = "CLOUDFRONT"
  ip_address_version = "IPV4"

  addresses = local.cidr_watchlist
}
