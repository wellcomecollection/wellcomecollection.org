We use Nginx to proxy to our application so that we can make sure we're developing on `https`.

# Requirements

- nginx with `http/2`

  brew install --with-http2 nginx

# Run

* `./setup.sh`
* Add `127.0.0.1 next.dev-wellcomecollection.org` to your `/etc/hosts`
* Make sure `include /usr/local/etc/nginx/sites-enabled/*;` is included in your `nginx.conf` 

You should now be able to access the site on [https://next.dev-wellcomecollection.org](https://next.dev-wellcomecollection.org).
