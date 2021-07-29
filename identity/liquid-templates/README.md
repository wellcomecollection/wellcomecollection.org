# Auth0 Universal Login customization

We use the Auth0 universal-login to customize aspects of our login page.

## Login page template

https://auth0.com/docs/universal-login/new-experience/universal-login-page-templates

```
curl --request PUT \
  --url 'https://stage.account.wellcomecollection.org/api/v2/branding/templates/universal-login' \
  --header 'authorization: Bearer MGMT_API_ACCESS_TOKEN' \
  --header 'content-type: text/html' \
  --data @template.html
```

## Text customization

https://auth0.com/docs/universal-login/new-experience/text-customization-new-universal-login

### Updated login prompt

https://auth0.com/docs/universal-login/prompt-login

```
curl --request PUT \
  --url 'https://stage.account.wellcomecollection.org/api/v2/prompts/login/custom-text/en' \
  --header 'authorization: Bearer MGMT_API_ACCESS_TOKEN' \
  --header 'content-type: application/json' \
  --data '{ "login": {
    "pageTitle": "Log in to Wellcome Library",
    "description": " ",
    "buttonText": "Log in"
  }
}'
```

### Forgotten password

https://auth0.com/docs/universal-login/prompt-reset-password#screen-reset-password-request

```
curl --request PUT \
  --url 'https://stage.account.wellcomecollection.org/api/v2/prompts/reset-password/custom-text/en' \
  --header 'authorization: Bearer MGMT_API_ACCESS_TOKEN' \
  --header 'content-type: application/json' \
  --data '{ "reset-password-request": {
    "pageTitle": "Forgotten password",
    "descriptionEmail": "Enter the email address you use to log in. We’ll send you a link to reset your password.",
    "buttonText": "Send password reset"
  }
}'
```

### Forgotten password submitted

https://auth0.com/docs/universal-login/prompt-reset-password#screen-reset-password-request

```
curl --request PUT \
  --url 'https://stage.account.wellcomecollection.org/api/v2/prompts/reset-password/custom-text/en' \
  --header 'authorization: Bearer MGMT_API_ACCESS_TOKEN' \
  --header 'content-type: application/json' \
  --data '{ "reset-password-email": {
    "pageTitle": "Forgotten password",
    "emailDescription": "If the email address you entered has been found on our system, we will send you an email with instructions on how to reset your password. Please ensure to check your junk/spam folder."
  }
}'
```

### Reset password

https://auth0.com/docs/universal-login/prompt-reset-password#screen-reset-password-request

```
curl --request PUT \
  --url 'https://stage.account.wellcomecollection.org/api/v2/prompts/reset-password/custom-text/en' \
  --header 'authorization: Bearer MGMT_API_ACCESS_TOKEN' \
  --header 'content-type: application/json' \
  --data '{ "reset-password": {
    "pageTitle": "Reset password",
    "passwordPlaceholder": "Create new password",
    "description": "To protect your account, make sure your password contains: One lowercase character, one uppercase character, one number, 8 characters minimum."
  }
}'
```

### Reset password confirmed

https://auth0.com/docs/universal-login/prompt-reset-password#screen-reset-password-request

```
curl --request PUT \
  --url 'https://stage.account.wellcomecollection.org/api/v2/prompts/reset-password/custom-text/en' \
  --header 'authorization: Bearer MGMT_API_ACCESS_TOKEN' \
  --header 'content-type: application/json' \
  --data '{ "reset-password-success": {
    "pageTitle": "Password reset",
    "description": "Your password has been reset. Please sign in using your new password."
  }
}'
```

### E-mail verified

https://auth0.com/docs/universal-login/prompt-email-verification

Note: Maximum character limit is 200

```
curl --request PUT \
  --url 'https://stage.account.wellcomecollection.org/api/v2/prompts/email-verification/custom-text/en' \
  --header 'authorization: Bearer MGMT_API_ACCESS_TOKEN' \
  --header 'content-type: application/json' \
  --data '{ "email-verification-result": {
    "verifiedDescription": "Thank you for verifying your email address. The library team will review your application and will confirm your membership within the next 72 hours. In the meantime, you can browse through our digital collections or sign in to your account below. Reminder: you will need to email a form of personal identification (ID) and proof of address to the Library team in order to confirm your details."
  }
}'
```
