# Shopify connection handoff

The reference build is prepared for a Shopify Storefront API connection, but the public repository does **not** establish that any specific Shopify store belongs to Ren or to this project.

The browser intentionally contains no Admin API credential.

To turn demo mode into live catalog mode for an authorized store, provide a public Storefront API token through the deployment's environment/configuration process and populate `ren-reference/shopify-config.js`. Do not commit a private/Admin token.

The current build uses a fixture fallback so the site remains demonstrable before an authorized Storefront credential is available.

**Provenance note:** the previously documented store domain `keb5k1-ud.myshopify.com` has been removed from this public handoff because its ownership/relationship to the project has not been established in the repository record.