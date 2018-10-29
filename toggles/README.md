# Weco Toggles

We currently use [Unlesash](https://github.com/Unleash/unleash) to manage our
feature toggles.

The code is currently in
[another repo](https://github.com/wellcometrust/feature-flags) to make it
easier to deploy from Heroku.

The API is currently hosted under https://weco-feature-flags.herokuapp.com.

# A/B Testing
To create an A/B test, follow these steps:

* Create a toggle in Unleash
* Add the ABTest Strategy to the toggle
* Set the amount you want to the control / test. If you set the amount to 80,
  there will be an 80% chance they're in the test
* Add the code to your server app:
  ```JS
    [switchName]: isEnabled(switchName, {
      isUserEnabled: userEnabledToggles[switchName] === true
    })
  ```
* Deploy

If you'd like to force yourself into a tests, we have the
`toggle={switchName}:true` querystring parameter. To un-force yourself from the
test, use `toggle={switchName}:false`. This won't exclude you, but will make
sure you're rolling dice as to whether you're getting the feature or not again.

# TODO
- [ ] Move code over to this repo
- [ ] Move service over to AWS
- [ ] Serve from toggles.wellcomecollection.org
