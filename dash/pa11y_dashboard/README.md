# Pa11y Dashboard Docker Container

### Your Automated Accessibility Testing Pal

**Use [Pa11y Dashboard][] to run tests, save results, and monitor the accessibility of your web projects.** Pa11y Dashboard takes the power of the [Pa11y Project][] and puts it in your browser. This project makes it easy to get started with your own instance of Pa11y Dashboard, by handling all the dependencies and setup with Docker. 

## Getting Started

Make sure you [have Docker installed][docker]. Clone or download this repository to your local machine, open up terminal, and then `cd docker-pa11y`. 

From there, run `docker-compose -f compose/docker-compose.yml up` to begin building the Docker containers. 

Once you see terminal output from `web_1` and `database_1`, Pa11y Dashboard should be ready to go. Navigate to [http://localhost:8000][localhost] in your browser, and you should see the Pa11y Dashboard welcome screen.

[pa11y dashboard]: https://github.com/pa11y/dashboard
[pa11y project]: http://pa11y.org/
[docker]: https://www.docker.com/products/docker
[localhost]: http://localhost:8000