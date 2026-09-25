# Shopify connection handoff

The reference build is wired for the connected Shopify store domain `keb5k1-ud.myshopify.com`.

The browser intentionally contains no Admin API credential.

To turn demo mode into live catalog mode, provide a public Storefront API token through the deployment's environment/configuration process and populate `ren-reference/shopify-config.js`. Do not commit a private/Admin token.

The current build uses a fixture fallback so the site remains demonstrable before the Storefront credential is available.
