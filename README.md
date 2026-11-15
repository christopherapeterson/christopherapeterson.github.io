# No Average Agency

The public site at [noaverage.agency](https://noaverage.agency/) is served by GitHub Pages from `main`. The `webflow-redesign` branch contains the redesign from the [Webflow draft](https://no-average-agency.webflow.io/).

The homepage, six service pages in `services/`, and four case studies in `projects/` are static HTML. Run `python3 -m http.server 8000` from the repository root and visit `http://localhost:8000/`. The shared styles are in `css/agency.css` and `css/design.webflow.css`. The optional 3D contact background loads its Spline runtime from jsDelivr.

The separate Vercel project is `no-average-agency-preview`. When the redesign is approved, merging this branch into `main` publishes it on the existing GitHub Pages domain. The repo's `CNAME` already points there.
