# Connect nicybicy.com

Prepared instructions for `handsonphysio/nicy-bicy-studio`; this document does not confirm deployment or DNS changes.

## GitHub first

1. Create the repository and publish the supplied workflow. In **repository Settings → Pages → Build and deployment**, select **GitHub Actions**.
2. Recommended: in **GitHub account Settings → Pages**, add and verify `nicybicy.com`. Add the exact TXT host and verification value GitHub supplies at your DNS provider; keep that record after verification. No verification code is included here.
3. In **repository Settings → Pages → Custom domain**, save `nicybicy.com` **before** pointing website DNS to GitHub. Actions deployments ignore a `CNAME` file; configure the domain in these settings.

Source: [GitHub custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).

## Namecheap DNS

Open **Domain List → Manage** beside `nicybicy.com`, then **Advanced DNS → Host Records**. These controls apply when Namecheap BasicDNS, PremiumDNS, or FreeDNS hosts DNS; otherwise edit records at your active DNS provider.

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| A | `@` | `185.199.108.153` | Automatic |
| A | `@` | `185.199.109.153` | Automatic |
| A | `@` | `185.199.110.153` | Automatic |
| A | `@` | `185.199.111.153` | Automatic |
| CNAME | `www` | `handsonphysio.github.io` | Automatic |

Replace conflicting parking, redirect, A, AAAA, or CNAME website records for `@` and `www`; preserve unrelated MX, TXT, and email records. The `www` value has no protocol or repository path. Save changes.

Source: [Namecheap’s GitHub Pages guide](https://www.namecheap.com/support/knowledgebase/article.aspx/9645/2208/how-do-i-link-my-domain-to-github-pages/).

## Confirm the connection

Allow up to 24 hours for propagation and certificate availability. Return to repository **Settings → Pages**, check DNS, and enable **Enforce HTTPS** when available. Verify both `https://nicybicy.com` and `https://www.nicybicy.com`; the latter should redirect to the apex domain. Also confirm the Pages deployment succeeded in **Actions**.

Source: [GitHub custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
