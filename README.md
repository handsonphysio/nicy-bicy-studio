# NICY BICY STUDIO

A responsive, dependency-free bookshop website built with HTML, CSS, and JavaScript.

## Preview locally

Use Node.js 22 or later:

```sh
cd nicy-bicy-studio
npm run preview
```

Open [http://localhost:4173](http://localhost:4173). Set the `PORT` environment variable to use another port. No package installation is needed.

## Update the shop

- Edit `nicy-bicy-studio/dist/catalog.js` for the book collection and shop settings.
- Edit `nicy-bicy-studio/dist/index.html`, `styles.css`, and `app.js` for content, appearance, and interactions.
- Keep cover artwork in `nicy-bicy-studio/dist/assets/` and use relative asset paths.

The collection features three published Nicy Bicy Studio coloring books. Paperback is the primary format; verified hardcover listings are available inside each book's format options. Purchase buttons open the correct Amazon.ca edition, where Amazon handles current prices, availability, payment, and delivery. The site uses the updated covers supplied by the owner. The upcoming Premium Preschool Series features Learn How to Write Workbook using its existing promo video and preview graphics. See `nicy-bicy-studio/BOOKS.md` for edition identifiers and asset sources.

## Publish with GitHub Pages

The deployment workflow checks JavaScript and publishes `nicy-bicy-studio/dist` on pushes to `main`. It can also run manually from the repository's Actions tab.

1. Push this repository to [handsonphysio/nicy-bicy-studio](https://github.com/handsonphysio/nicy-bicy-studio).
2. In **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
3. Check the **Deploy to GitHub Pages** workflow. Its completed deployment displays the live URL.

The expected project address is `https://handsonphysio.github.io/nicy-bicy-studio/` after a successful deployment. See [GitHub's publishing guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site) for repository requirements.

Run the same syntax checks locally with `npm run check` from `nicy-bicy-studio`.
