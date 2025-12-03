# Restricted Access Authentication Flow

## Overview

This document explains how the authentication flow works for staff members with restricted access permissions (role = `userIsStaffWithRestricted`) when viewing restricted items in the IIIF viewer.

## Background

### IIIF Auth 2.0 Interaction Patterns

The IIIF Authorization Flow API 2.0 specification describes three interaction patterns:

- **Active** - Used for our clickthrough flow, could also be used for login prompts
- **External** - Used for restricted items requiring pre-existing authorization
- **Kiosk** - Not relevant to our implementation

### External interaction pattern for Restricted Items

We use the **external** interaction pattern for restricted items rather than the active interaction pattern because:

1. We don't want to present most users with a login when they either don't have an account or their account doesn't grant access to restricted items
2. This is the preferred behavior if the IIIF manifest is loaded into a third-party viewer

### Deviation from Standard Behavior

According to the IIIF spec, with the external access service:

> "The user is expected to have already acquired the authorizing aspect, and no access service will be used."

And:

> "There is no access service. Any URI specified in the id property must be ignored."
> "The client must immediately use the related access token service..."

**However**, in our implementation there IS an access service provided by the `id` of the external service, and we DO use it. This is necessary because logging in via Auth0 is a separate system and doesn't provide the DLCS authorizing cookie we need.

#### Probe Service

The IIIF spec recommends querying the Probe service with the access token to determine if the user has access. However, since the probe service only returns a 200 status without additional information, we simply use the presence of the `accessToken` as the condition for loading images.

## Authentication Flow for Staff with Restricted Access

### 1. Initial Check

When a user is logged in with `userIsStaffWithRestricted` role and visits an items page containing a IIIF presentation manifest with restricted items, the authentication flow automatically begins.

### 2. Automatic Popup Opens

**Prerequisites for the popup to open:**

1. User has `userIsStaffWithRestricted` role
2. An external auth service exists in the manifest (`authServices?.external`)
3. The popup hasn't already been opened this session (`hasOpenedAuthPopup` ref)

**What happens:**

1. A new window opens automatically to the auth service URL specified in the external service's `id` property (only once per page load, tracked by `hasOpenedAuthPopup` ref)
2. URL format: `https://iiif.wellcomecollection.org/auth/v2/access/restrictedlogin?origin={current_origin}`
3. **First time:** User is prompted to log in again, which provides the necessary DLCS authorizing cookie
4. **Subsequent visits:** Window opens and closes automatically without user interaction (as long as the login is still valid)
5. **Authentication sets a `dlcs-auth2-2` cookie** - this cookie:
   - Is set by the DLCS auth service
   - Has a default 10-minute expiry
   - Gets extended each time the browser requests protected images
   - Is automatically sent with subsequent image requests to prove authentication
   - Persists across page loads until it expires
6. When the popup closes, an `unload` event triggers
7. The `reloadAuthIframe` function is called to refresh the hidden auth iframe

**Note:** This popup may be blocked by browser popup blockers since it's not triggered by a direct user action. Users may need to allow popups for the site.

### 3. Hidden Iframe Token Exchange

Once the `dlcs-auth2-2` cookie is set, the flow works the same way as clickthrough authentication. The page includes a hidden iframe that communicates with the token service.

**The iframe:**

- Loads the token service URL (e.g., `https://iiif.wellcomecollection.org/token?messageId={workId}&origin={origin}`)
- Is hidden from view (`display: none`)
- Uses the `dlcs-auth2-2` cookie (set during popup authentication) to authenticate with the token service
- After successful authentication, receives an access token from the service
- Sends the token back to the parent window via `postMessage`

### 4. Receiving the Access Token

The page listens for messages from the iframe

### 5. Using the Token

We use the presence of the access token as the condition for loading images, rather than querying the Probe service (which only returns a 200 status without additional information).

### 6. Reloading Authentication

The `reloadAuthIframe` function can be called to refresh the auth state:

This is called when:

- The auth popup closes (after user authenticates and the `dlcs-auth2-2` cookie is set)
- An image fails to load (in case the `dlcs-auth2-2` cookie expired or became invalid)
