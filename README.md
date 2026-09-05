# Mihomo / OpenClash / SubStore 覆写规则

本仓库基于 `powerfullz/override-rules` 二次维护，主要面向 Mihomo / OpenClash 配置与 SubStore 覆写场景。

当前维护重点是：保持规则结构简单、减少无意义策略组，并针对中国大陆网络环境优化国内直连、静态资源、Steam、PT/BT/Tracker 与 VoWiFi 分流。

## 主要特性

- 使用 TypeScript 维护覆写逻辑，并由 GitHub Actions 构建 `convert.js` / `convert.min.js` 与 YAML 产物。
- 自动识别订阅中的国家/地区节点并生成对应策略组。
- 中国大陆域名与 CDN 优先直连，避免被通用静态资源规则提前捕获。
- 海外静态资源 / CDN 可单独进入「静态资源」策略组，便于选择代理、低倍率节点或直连。
- Steam 下载、PT/BT/Tracker、VoWiFi 保留独立策略组，默认直连，同时允许手动切换出口。
- Apple / Google / Microsoft 的中国可用域名优先直连，其余流量继续进入各自服务策略组。
- 支持 Tailscale 出站、链式代理、动态国家/地区分组与常用 GeoSite / GeoIP 分流。

## 使用方法

### 推荐：SubStore + OpenClash / Mihomo

`main` 分支只保存源码，不保存生成后的 `convert.min.js`。

当前最新构建由 GitHub Actions 自动发布到 `preview` 分支：

```text
https://raw.githubusercontent.com/heroixinu/override-rules/refs/heads/preview/convert.min.js
```

在支持 URL 参数的脚本环境中，可以通过 `#` 追加参数，例如：

```text
https://raw.githubusercontent.com/heroixinu/override-rules/refs/heads/preview/convert.min.js#full=true&grouptype=0&ipv6=true&regex=false
```

正式版本发布后，以 GitHub Releases 中的构建产物为准：

- https://github.com/heroixinu/override-rules/releases

### 支持的脚本参数

| 参数 | 说明 | 默认值 |
| --- | --- | --- |
| `grouptype` | 国家/地区组类型：`0=select`、`1=url-test`、`2=load-balance` | `1` |
| `ipv6` | 启用 IPv6 | `false` |
| `full` | 生成完整 Mihomo 配置 | `false` |
| `keepalive` | 启用 TCP Keep Alive | `false` |
| `fakeip` | 使用 `fake-ip` DNS 增强模式 | `true` |
| `quic` | 允许 UDP 443 / QUIC | `false` |
| `regex` | 国家/地区组使用 `include-all` + 正则动态筛选节点 | `false` |
| `tun` | 启用 TUN 配置 | `false` |
| `threshold` | 国家/地区节点数量低于该值时不生成对应分组 | `2` |

旧参数 `loadbalance=true` 仍兼容，等价于 `grouptype=2`。

## 当前分流策略

Mihomo 规则按顺序优先匹配，因此规则位置本身就是策略的一部分。当前核心顺序为：

```text
特殊场景
  ↓
中国域名优先直连
  ↓
静态资源 / 海外 CDN
  ↓
各海外服务策略组
  ↓
GFWList
  ↓
中国 IP 兜底直连
  ↓
Final
```

### 中国直连与策略组映射

| 策略组 / 行为 | 实际匹配规则 | 说明 |
| --- | --- | --- |
| **中国域名直连** | `GEOSITE,google@cn`、`GEOSITE,apple@cn`、`GEOSITE,microsoft@cn`、`GEOSITE,cn` | 全部 `DIRECT`，优先于通用静态资源规则。 |
| **中国 IP 直连** | `GEOIP,cn` | 域名规则之后的 IP 层兜底。 |
| **Steam下载代理** | `RULE-SET,SteamFix` + `GEOSITE,steam@cn` | 默认直连，可手动切换代理或地区节点。 |
| **PT/BT/Tracker** | `GEOSITE,category-pt` + `GEOSITE,category-public-tracker` | 私有 PT 与公共 Tracker 统一进入该组，默认直连。 |
| **VoWiFi/WiFi Calling** | `RULE-SET,VoWiFi` | 当前主要匹配 ePDG 域名，默认直连，可按运营商网络情况切换出口。 |
| **静态资源** | `RULE-SET,StaticResources` + `RULE-SET,CDNResources` + `RULE-SET,AdditionalCDNResources` | 中国域名/CDN 已提前直连，剩余海外 CDN / 静态资源进入该组。 |
| **苹果服务** | `GEOSITE,apple` | `apple@cn` 已提前直连，其余 Apple 流量进入该组。 |
| **谷歌服务** | `GEOSITE,google` | `google@cn` 已提前直连，其余 Google 流量进入该组。 |
| **微软服务** | `GEOSITE,microsoft` | `microsoft@cn` 已提前直连，其余 Microsoft 流量进入该组。 |
| **Telegram** | `GEOSITE,telegram` + `GEOIP,telegram` | 同时覆盖域名和直接 IP 连接。 |
| **Netflix** | `GEOSITE,netflix` + `GEOIP,netflix` | 同时覆盖域名和直接 IP 连接。 |
| **选择代理** | `GEOSITE,steam`（未被 `steam@cn` 命中的部分）+ `RULE-SET,GFWList` | Steam 其余流量与 GFWList 流量进入通用代理选择。 |
| **Final** | `MATCH` | 前述规则均未命中的最终兜底。 |

### 静态资源

「静态资源」组用于图片、视频、音频、字体、JS、CSS、对象存储以及常见 CDN 流量。

当前规则会先执行中国直连层，因此中国大陆域名和可识别的国内 CDN 优先 `DIRECT`；未命中中国规则的 Cloudflare、Akamai、Fastly 等海外 CDN / 静态资源才会继续进入「静态资源」策略组。

这样可以把国内 CDN 保持本地直连，同时仍允许海外静态资源使用代理、低倍率节点或其它出口。

### Steam 下载

Steam 下载相关流量优先于中国直连层：

```text
RULE-SET,SteamFix → Steam下载代理
GEOSITE,steam@cn → Steam下载代理
```

其它 Steam 流量：

```text
GEOSITE,steam → 选择代理
```

### PT / BT / Tracker

当前使用：

```text
GEOSITE,category-pt → PT/BT/Tracker
GEOSITE,category-public-tracker → PT/BT/Tracker
```

该策略主要覆盖 PT 站点与 Tracker 域名，不用于识别全部 DHT / PEX / Peer IP 流量。

### VoWiFi / WiFi Calling

当前 `VoWiFi` Rule Provider 主要通过 ePDG 域名识别 Wi-Fi Calling 流量，并进入「VoWiFi/WiFi Calling」策略组。

该组默认 `DIRECT`，如果某个运营商或当前网络环境需要代理，可以手动切换出口。

## 其它功能

### 链式代理

订阅中存在带 `dialer-proxy: "前置代理"` 的自建节点时，脚本会自动生成「前置代理」和「落地节点」相关策略组。

### Tailscale

检测到 `tailscale` 类型节点时，会生成对应 Tailscale 策略组及相关分流配置。

示例：

```yaml
proxies:
  - name: "Tailscale出口"
    type: tailscale
    auth-key: tskey-auth-xxxxxxxx
    control-url: https://controlplane.tailscale.com
    ephemeral: true
    udp: true
```

注意节点名称不要直接使用 `Tailscale`，避免与策略组重名。

## 构建与发布

- `main`：源码分支，不保存自动生成产物。
- `preview`：由 `main` 变更自动构建并强制更新，适合测试当前最新规则。
- 正式版本：通过 `src-vX.Y.Z` 源码 Tag 触发 Release 工作流，并生成对应 GitHub Release 与版本产物。

本 README 不依赖第三方 CDN 链接，避免文档链接与实际发布状态不一致。

## 自定义与贡献

- 自定义规则与策略组：[`docs/HOW_TO_CUSTOMISE.md`](docs/HOW_TO_CUSTOMISE.md)
- 贡献指南：[`docs/HOW_TO_CONTRIBUTE.md`](docs/HOW_TO_CONTRIBUTE.md)
- AI Agent 约定：[`AGENTS.md`](AGENTS.md)

## 上游

本仓库基于 [powerfullz/override-rules](https://github.com/powerfullz/override-rules) 二次维护。感谢原项目及其依赖规则项目的工作。