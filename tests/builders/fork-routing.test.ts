import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildDns } from "../../src/builders/dns";
import { buildRules } from "../../src/builders/rules";
import { buildTunConfig } from "../../src/builders/tun";
import { PROXY_GROUPS } from "../../src/catalog/group-names";
import { ruleSets } from "../../src/catalog/rule-sets";
import { serviceGroups } from "../../src/catalog/service-groups";

const CUSTOM_GROUPS = [
    PROXY_GROUPS.NETWORK_TEST,
    PROXY_GROUPS.REGION_DETECTION,
    PROXY_GROUPS.DEVELOPER,
    PROXY_GROUPS.GAME_SERVICE,
    PROXY_GROUPS.HTTPDNS,
    PROXY_GROUPS.PAYMENT_ECOMMERCE,
    PROXY_GROUPS.OPENCODE,
    PROXY_GROUPS.ONEDRIVE,
    PROXY_GROUPS.BING_COPILOT,
    PROXY_GROUPS.STEAM_DOWNLOAD,
    PROXY_GROUPS.PT_BT_TRACKER,
    PROXY_GROUPS.VOWIFI,
];

describe("Fork 定制回归", () => {
    it("保留全部定制服务组，OpenCode 在 AI服务 之前", () => {
        const names = serviceGroups.map((group) => group.name);
        for (const name of CUSTOM_GROUPS) assert.ok(names.includes(name), name);
        assert.ok(names.indexOf(PROXY_GROUPS.OPENCODE) < names.indexOf(PROXY_GROUPS.AI_SERVICE));
    });

    it("OpenCode 规则在开发者及 AI 总规则前", () => {
        const rules = buildRules({ quicEnabled: false, hasTailscale: false });
        const openCode = rules.indexOf("DOMAIN-SUFFIX,opencode.ai,OpenCode");
        const developer = rules.indexOf("RULE-SET,Developer,开发者服务");
        const ai = rules.indexOf("GEOSITE,category-ai-!cn,AI服务");
        assert.ok(openCode >= 0 && openCode < developer && openCode < ai);
    });

    it("没有全局 UDP443 拦截，保留中国直连与 VoWiFi 专用规则", () => {
        const rules = buildRules({ quicEnabled: false, hasTailscale: false });
        assert.ok(!rules.some((r) => r.startsWith("AND,((DST-PORT,443)")));
        for (const rule of [
            "GEOSITE,cn,DIRECT",
            "GEOSITE,apple@cn,DIRECT",
            "RULE-SET,VoWiFi,VoWiFi/WiFi Calling",
            "RULE-SET,RegionDetection,地区检测",
        ]) {
            assert.ok(rules.includes(rule), rule);
        }
    });

    it("规则集全部存在于注册表且保留本地差异", () => {
        const rules = buildRules({ quicEnabled: false, hasTailscale: false });
        for (const rule of rules) {
            if (!rule.startsWith("RULE-SET,")) continue;
            assert.ok(rule.split(",")[1] in ruleSets, rule);
        }
        for (const key of ["VoWiFi", "VoWiFiCarriers", "RegionDetection", "Developer", "OneDrive"]) {
            assert.ok(key in ruleSets, key);
        }
        assert.ok(ruleSets.AdditionalCDNResources.url.includes("heroixinu/override-rules"));
    });

    it("保留 DNS 禁用 H3 和 gvisor TUN 栈", () => {
        assert.equal(buildDns({ fakeIPEnabled: true, ipv6Enabled: false })["prefer-h3"], false);
        assert.equal(buildTunConfig(true, false).stack, "gvisor");
    });
});
