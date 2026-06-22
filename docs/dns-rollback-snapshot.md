# DNS Rollback Snapshot — `dobroizlo.com.ua`

> **Purpose:** Pre-cutover record of the AWS Route 53 hosted zone for
> `dobroizlo.com.ua`, captured before the S3+CloudFront → Netlify DNS migration.
> If the cutover (Hugo issue #48) goes wrong, restore the two changed records to
> the values below. Tracked under Hugo issue #47 and ComixDistro epic
> `euroteamoutreach/comix_distro#707` §5.

**Captured:** 2026-06-22 (launch day), byte-exact via AWS CLI
**Hosted zone:** `dobroizlo.com.ua` — Public hosted zone
**Hosted zone ID:** `Z1791ZGC5CZWXJ`
**Record count:** 7
**Capture command:** `aws route53 list-resource-record-sets --hosted-zone-id Z1791ZGC5CZWXJ --output json --profile eto`

**Name servers (delegation — do not change):**

```text
ns-415.awsdns-51.com
ns-905.awsdns-49.net
ns-1708.awsdns-21.co.uk
ns-1451.awsdns-53.org
```

## Full record set (pre-cutover)

| Record name | Type | Alias | Value / Route traffic to | TTL |
|---|---|---|---|---|
| `dobroizlo.com.ua` | A | Yes | `d3gx05y2tzbdxy.cloudfront.net.` (CloudFront, zone `Z2FDTNDATAQYW2`) | – (alias) |
| `dobroizlo.com.ua` | NS | No | the four `awsdns` name servers above | 172800 |
| `dobroizlo.com.ua` | SOA | No | `ns-415.awsdns-51.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400` | 900 |
| `_a2c46b92373e81a01f9db6b1398bb4d6.dobroizlo.com.ua` | CNAME | No | `_403ab3ebf995a33c7b4924330b502cc7.acm-validations.aws.` (ACM cert validation) | 300 |
| `app.dobroizlo.com.ua` | A | No | `66.241.125.40` (Fly.io) | 300 |
| `app.dobroizlo.com.ua` | AAAA | No | `2a09:8280:1::d3:8f4d:0` (Fly.io) | 300 |
| `www.dobroizlo.com.ua` | A | Yes | `d3gx05y2tzbdxy.cloudfront.net.` (CloudFront, zone `Z2FDTNDATAQYW2`) | – (alias) |

## What the cutover changes

Only **two** records are modified at cutover (Hugo #48):

- `dobroizlo.com.ua` (apex) — repoint from the CloudFront alias to Netlify.
- `www.dobroizlo.com.ua` — repoint from the CloudFront alias to Netlify.

## What must NOT be touched

- `app.dobroizlo.com.ua` **A** (`66.241.125.40`) and **AAAA** (`2a09:8280:1::d3:8f4d:0`) — Fly.io / ComixDistro. Protecting these is an explicit requirement of epic #707 §5.
- `dobroizlo.com.ua` **NS** and **SOA** — zone delegation.
- `_a2c46b92373e81a01f9db6b1398bb4d6.dobroizlo.com.ua` **CNAME** — ACM cert validation for the current CloudFront cert; leave in place for rollback safety.

## Notes affecting the cutover

- **No TTL pre-lowering needed.** The apex and `www` are Route 53 **alias** records to CloudFront, which have no editable TTL and resolve at CloudFront's ~60s. There is no high static TTL to lower, so the usual 24–48h wait before cutover does not apply here.
- **No email impact.** This zone has no MX or TXT records — mail runs on `euroteamoutreach.org`. The cutover cannot affect magic-link delivery or notifications.

## Rollback procedure

If the site fails to serve correctly from Netlify after cutover, restore the two
changed records to their pre-cutover **alias-to-CloudFront** state. Each is an
`A` record with:

- **Alias:** Yes
- **Alias target DNS name:** `d3gx05y2tzbdxy.cloudfront.net.`
- **Alias target hosted zone ID:** `Z2FDTNDATAQYW2` (CloudFront's fixed zone ID)
- **Evaluate target health:** No

Records to restore: `dobroizlo.com.ua` (apex) and `www.dobroizlo.com.ua`.
Because the records resolve at ~60s, rollback propagates within roughly a minute.
Leave the `app.`, NS, SOA, and ACM-validation records as they are.

## Appendix — byte-exact capture

```json
{
    "ResourceRecordSets": [
        {
            "Name": "dobroizlo.com.ua.",
            "Type": "A",
            "AliasTarget": {
                "HostedZoneId": "Z2FDTNDATAQYW2",
                "DNSName": "d3gx05y2tzbdxy.cloudfront.net.",
                "EvaluateTargetHealth": false
            }
        },
        {
            "Name": "dobroizlo.com.ua.",
            "Type": "NS",
            "TTL": 172800,
            "ResourceRecords": [
                { "Value": "ns-415.awsdns-51.com." },
                { "Value": "ns-905.awsdns-49.net." },
                { "Value": "ns-1708.awsdns-21.co.uk." },
                { "Value": "ns-1451.awsdns-53.org." }
            ]
        },
        {
            "Name": "dobroizlo.com.ua.",
            "Type": "SOA",
            "TTL": 900,
            "ResourceRecords": [
                { "Value": "ns-415.awsdns-51.com. awsdns-hostmaster.amazon.com. 1 7200 900 1209600 86400" }
            ]
        },
        {
            "Name": "_a2c46b92373e81a01f9db6b1398bb4d6.dobroizlo.com.ua.",
            "Type": "CNAME",
            "TTL": 300,
            "ResourceRecords": [
                { "Value": "_403ab3ebf995a33c7b4924330b502cc7.acm-validations.aws." }
            ]
        },
        {
            "Name": "app.dobroizlo.com.ua.",
            "Type": "A",
            "TTL": 300,
            "ResourceRecords": [
                { "Value": "66.241.125.40" }
            ]
        },
        {
            "Name": "app.dobroizlo.com.ua.",
            "Type": "AAAA",
            "TTL": 300,
            "ResourceRecords": [
                { "Value": "2a09:8280:1::d3:8f4d:0" }
            ]
        },
        {
            "Name": "www.dobroizlo.com.ua.",
            "Type": "A",
            "AliasTarget": {
                "HostedZoneId": "Z2FDTNDATAQYW2",
                "DNSName": "d3gx05y2tzbdxy.cloudfront.net.",
                "EvaluateTargetHealth": false
            }
        }
    ]
}
```
