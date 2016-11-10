We use Nginx to proxy to our application so that we can make sure we're developing on `https`.

# Requirements

- nginx with `http/2`

  brew install --with-http2 nginx

# Run

  ./setup.sh

You should now be able to access the site on [https://dev-wellcomecollection.org](https://dev-wellcomecollection.org).
