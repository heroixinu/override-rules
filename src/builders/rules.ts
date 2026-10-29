/**
 * 路由规则构建：保留本 Fork 的规则和优先级；上游 2.9.x 的声明式 Rule Provider 类型检查仍生效。
 * 特别保留：OpenCode 优先匹配、VoWiFi 分流、国内直连、不全局阻断 UDP/443。
 */
import { PROXY_GROUPS } from "../catalog/group-names";
import { ruleSet } from "../catalog/rule-sets";
import { isNotNull } from "../utils/primitives";

export interface BuildRulesInput {
    quicEnabled: boolean;
    hasTailscale: boolean;
}

export function buildRules({ quicEnabled: _quicEnabled, hasTailscale }: BuildRulesInput): string[] {
    return [
        hasTailscale ? `IP-CIDR,100.64.0.0/10,${PROXY_GROUPS.TAILSCALE},no-resolve` : null,
        hasTailscale ? `IP-CIDR,fd7a:115c:a1e0::/48,${PROXY_GROUPS.TAILSCALE},no-resolve` : null,
        hasTailscale ? `DOMAIN-SUFFIX,ts.net,${PROXY_GROUPS.TAILSCALE}` : null,
        `GEOIP,private,DIRECT,no-resolve`,
        `DOMAIN-SUFFIX,opencode.ai,${PROXY_GROUPS.OPENCODE}`,
        ruleSet("RegionDetection", PROXY_GROUPS.REGION_DETECTION),
        ruleSet("BlockHttpDNS", PROXY_GROUPS.HTTPDNS),
        ruleSet("ADBlock", PROXY_GROUPS.AD_BLOCK),
        ruleSet("AdditionalFilter", PROXY_GROUPS.AD_BLOCK),
        ruleSet("SogouInput", PROXY_GROUPS.SOGOU_INPUT),
        ruleSet("Speedtest", PROXY_GROUPS.NETWORK_TEST),
        ruleSet("Developer", PROXY_GROUPS.DEVELOPER),
        ruleSet("PayPal", PROXY_GROUPS.PAYMENT_ECOMMERCE),
        ruleSet("Amazon", PROXY_GROUPS.PAYMENT_ECOMMERCE),
        ruleSet("eBay", PROXY_GROUPS.PAYMENT_ECOMMERCE),
        ruleSet("Shopify", PROXY_GROUPS.PAYMENT_ECOMMERCE),
        ruleSet("OneDrive", PROXY_GROUPS.ONEDRIVE),
        ruleSet("Bing", PROXY_GROUPS.BING_COPILOT),
        ruleSet("SteamFix", PROXY_GROUPS.STEAM_DOWNLOAD),
        `GEOSITE,steam@cn,${PROXY_GROUPS.STEAM_DOWNLOAD}`,
        `GEOSITE,category-pt,${PROXY_GROUPS.PT_BT_TRACKER}`,
        `GEOSITE,category-public-tracker,${PROXY_GROUPS.PT_BT_TRACKER}`,
        ruleSet("VoWiFi", PROXY_GROUPS.VOWIFI),
        ruleSet("VoWiFiCarriers", PROXY_GROUPS.VOWIFI),
        ruleSet("Game", PROXY_GROUPS.GAME_SERVICE),
        `GEOSITE,apple@cn,DIRECT`,
        `GEOSITE,microsoft@cn,DIRECT`,
        `GEOSITE,cn,DIRECT`,
        ruleSet("StaticResources", PROXY_GROUPS.STATIC_RESOURCES),
        ruleSet("CDNResources", PROXY_GROUPS.STATIC_RESOURCES),
        ruleSet("AdditionalCDNResources", PROXY_GROUPS.STATIC_RESOURCES),
        `GEOSITE,category-cryptocurrency,${PROXY_GROUPS.CRYPTO}`,
        `GEOSITE,category-finance,${PROXY_GROUPS.FINANCE}`,
        `GEOSITE,category-ai-!cn,${PROXY_GROUPS.AI_SERVICE}`,
        `GEOSITE,bilibili,${PROXY_GROUPS.BILIBILI}`,
        `GEOSITE,youtube,${PROXY_GROUPS.YOUTUBE}`,
        `GEOSITE,telegram,${PROXY_GROUPS.TELEGRAM}`,
        `GEOIP,telegram,${PROXY_GROUPS.TELEGRAM},no-resolve`,
        `GEOSITE,xbox,${PROXY_GROUPS.XBOX}`,
        `GEOSITE,github,${PROXY_GROUPS.GITHUB}`,
        `GEOSITE,netflix,${PROXY_GROUPS.NETFLIX}`,
        `GEOIP,netflix,${PROXY_GROUPS.NETFLIX},no-resolve`,
        `GEOSITE,spotify,${PROXY_GROUPS.SPOTIFY}`,
        `GEOSITE,pikpak,${PROXY_GROUPS.PIKPAK}`,
        `GEOSITE,twitter,${PROXY_GROUPS.TWITTER}`,
        ruleSet("Weibo", PROXY_GROUPS.WEIBO),
        ruleSet("TikTok", PROXY_GROUPS.TIKTOK),
        `GEOSITE,steam,${PROXY_GROUPS.SELECT}`,
        ruleSet("GoogleFCM", "DIRECT"),
        `GEOSITE,apple,${PROXY_GROUPS.APPLE}`,
        `GEOSITE,microsoft,${PROXY_GROUPS.MICROSOFT}`,
        `GEOSITE,google,${PROXY_GROUPS.GOOGLE}`,
        ruleSet("GFWList", PROXY_GROUPS.SELECT),
        `GEOIP,cn,DIRECT`,
        `MATCH,${PROXY_GROUPS.FINAL}`,
    ].filter(isNotNull);
}
