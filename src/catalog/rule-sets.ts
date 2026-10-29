/**
 * Rule Provider（外部规则集）注册表。
 *
 * 规则集名称同时作为 `rules` 中 `RULE-SET,<name>,<target>` 的键，
 * 通过 `RuleSetKey` 类型约束，改名时 `builders/rules.ts` 会在编译期报错，避免静默失效。
 */

import { CDN_URL } from "./endpoints";
import type { RuleProvider } from "../types/clash";

export const ruleSets = {
    ADBlock: {
        type: "http",
        behavior: "domain",
        format: "yaml",
        interval: 86400,
        url: `${CDN_URL}/gh/217heidai/adblockfilters@main/rules/adblockmihomolite.yaml`,
        path: "./ruleset/ADBlock.yaml",
    },
    SogouInput: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: "https://ruleset.skk.moe/Clash/non_ip/sogouinput.txt",
        path: "./ruleset/SogouInput.txt",
    },
    StaticResources: {
        type: "http",
        behavior: "domain",
        format: "text",
        interval: 86400,
        url: "https://ruleset.skk.moe/Clash/domainset/cdn.txt",
        path: "./ruleset/StaticResources.txt",
    },
    CDNResources: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: "https://ruleset.skk.moe/Clash/non_ip/cdn.txt",
        path: "./ruleset/CDNResources.txt",
    },
    TikTok: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/TikTok.list`,
        path: "./ruleset/TikTok.list",
    },
    EHentai: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/EHentai.list`,
        path: "./ruleset/EHentai.list",
    },
    SteamFix: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/SteamFix.list`,
        path: "./ruleset/SteamFix.list",
    },
    GoogleFCM: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/FirebaseCloudMessaging.list`,
        path: "./ruleset/FirebaseCloudMessaging.list",
    },
    AdditionalFilter: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/AdditionalFilter.list`,
        path: "./ruleset/AdditionalFilter.list",
    },
    AdditionalCDNResources: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/heroixinu/override-rules@main/ruleset/AdditionalCDNResources.list`,
        path: "./ruleset/AdditionalCDNResources.list",
    },
    Weibo: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/powerfullz/override-rules@master/ruleset/Weibo.list`,
        path: "./ruleset/Weibo.list",
    },
    GFWList: {
        type: "http",
        behavior: "domain",
        format: "yaml",
        interval: 86400,
        url: "https://cdn.jsdelivr.net/gh/Loyalsoldier/clash-rules@release/gfw.txt",
        path: "./ruleset/GFWList.yaml",
    },
    RegionDetection: {
        type: "http",
        behavior: "domain",
        format: "yaml",
        interval: 86400,
        url: "https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/category-ip-geo-detect.yaml",
        path: "./ruleset/RegionDetection.yaml",
    },
    Speedtest: {
        type: "http",
        behavior: "classical",
        format: "yaml",
        interval: 86400,
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Speedtest/Speedtest.yaml",
        path: "./ruleset/Speedtest.yaml",
    },
    Developer: {
        type: "http",
        behavior: "classical",
        format: "yaml",
        interval: 86400,
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Developer/Developer.yaml",
        path: "./ruleset/Developer.yaml",
    },
    Game: {
        type: "http",
        behavior: "classical",
        format: "yaml",
        interval: 86400,
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Game/Game.yaml",
        path: "./ruleset/Game.yaml",
    },
    BlockHttpDNS: {
        type: "http",
        behavior: "classical",
        format: "yaml",
        interval: 86400,
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/BlockHttpDNS/BlockHttpDNS.yaml",
        path: "./ruleset/BlockHttpDNS.yaml",
    },
    PayPal: {
        type: "http",
        behavior: "classical",
        format: "yaml",
        interval: 86400,
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/PayPal/PayPal.yaml",
        path: "./ruleset/PayPal.yaml",
    },
    Amazon: {
        type: "http",
        behavior: "classical",
        format: "yaml",
        interval: 86400,
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Amazon/Amazon.yaml",
        path: "./ruleset/Amazon.yaml",
    },
    eBay: {
        type: "http",
        behavior: "classical",
        format: "yaml",
        interval: 86400,
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/eBay/eBay.yaml",
        path: "./ruleset/eBay.yaml",
    },
    Shopify: {
        type: "http",
        behavior: "classical",
        format: "yaml",
        interval: 86400,
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Shopify/Shopify.yaml",
        path: "./ruleset/Shopify.yaml",
    },
    OneDrive: {
        type: "http",
        behavior: "classical",
        format: "yaml",
        interval: 86400,
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/OneDrive/OneDrive.yaml",
        path: "./ruleset/OneDrive.yaml",
    },
    Bing: {
        type: "http",
        behavior: "classical",
        format: "yaml",
        interval: 86400,
        url: "https://raw.githubusercontent.com/blackmatrix7/ios_rule_script/master/rule/Clash/Bing/Bing.yaml",
        path: "./ruleset/Bing.yaml",
    },
    VoWiFi: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: `${CDN_URL}/gh/heroixinu/override-rules@main/ruleset/VoWiFi.list`,
        path: "./ruleset/VoWiFi.list",
    },
    VoWiFiCarriers: {
        type: "http",
        behavior: "classical",
        format: "text",
        interval: 86400,
        url: "https://raw.githubusercontent.com/CMJ781/Loon/main/vowifi-country-rules.yaml",
        path: "./ruleset/VoWiFiCarriers.list",
    },
} satisfies Record<string, RuleProvider>;

/** 所有合法的规则集名称。 */
export type RuleSetKey = keyof typeof ruleSets;

/**
 * 生成一条 `RULE-SET` 规则。
 * @param key - 规则集名称，必须是已注册的 `RuleSetKey`
 * @param target - 命中的目标策略组或动作（DIRECT/REJECT 等）
 */
export function ruleSet(key: RuleSetKey, target: string): string {
    return `RULE-SET,${key},${target}`;
}
