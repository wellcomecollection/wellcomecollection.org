## Purpose

To handle what resources a user is allowed to access based on their authentication and authorisation with [AWS Cognito](https://aws.amazon.com/cognito/).

The `Auth` component has a piece of state called `authState` that can be set to one of the following: `loggedIn`, `loggedOut`, `authorising` or `expired`.

We run `useEffect` with `authState` as a dependency and perform different operations depending on what `authState` has been set to at that point.

1. If it’s `loggedOut`, then we set:
   - A `codeVerifier` – which is a base64-encoded random string – and put this in `localStorage`.
   - A `codeChallenge`, which is hashed, base64-encoded version of the `codeVerifier`. This becomes part of the `loginUrl` we create.
   - Going to the `loginUrl`, we are sent to Cognito’s hosted UI and prompted to sign in with a username and password, then we’re redirected back to our app, with a `code` query parameter in the URL.
   - A `useEffect` that’s listening for the code query parameter will then update the `authState` to `authorising`.
2. When it’s then `authorising`:
   - We send the `code` parameter from Cognito, along with our `codeVerifier` (from `localStorage`) in a `POST` request to the authorisation endpoint.
   - If it’s successful, we are returned a `token` containing an `access_token`, an `id_token` and a `refresh_token` and we store this in `localStorage`.
   - We then set the `authState` to `loggedIn`.
3. When it’s `loggedIn` we don’t do anything
<!-- 4. When it’s expired we use the `refresh_token` that was sent with the original `access_token` in order to get a new `access_token` before doing a call to any protected resources. -->

The `Auth` component exposes a render prop, that receives the `authState`, the `loginUrl`, and the `token` in an object argument, then the consuming component can determine what to display to the user based on the values of these properties.

[Edit this on GitHub](https://github.com/wellcometrust/wellcomecollection.org/edit/master/catalogue/webapp/components/Auth/README.md)
