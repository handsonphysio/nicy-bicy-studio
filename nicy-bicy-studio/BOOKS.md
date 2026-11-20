# Published book collection

Amazon author page: https://www.amazon.ca/stores/Nicy-Bicy-Studio/author/B0HQRHGWWR

Verified on November 16, 2026. Paperback is the primary edition for every book. Hardcover options are inside the book-details dialog, with a separate link to the selected edition.

| Book | Paperback ASIN | Hardcover ASIN | Pages |
| --- | --- | --- | --- |
| Learn How to Write Workbook | B0HS5Q51V3 | No verified listing | 120 |
| Bold & Easy Cozy Coloring Book | B0HQJ2YHVJ | B0HQRL6N3P | 112 |
| Bold & Easy Amazing Animals Coloring Book | B0HQVP8HQW | B0HQNN6TQ3 | 116 |
| Bold & Easy Animal Travel Coloring Book | B0HQKH3ZPV | Not linked on the current Amazon.ca listing | 116 |

No static prices or stock claims are stored. Amazon displays those at the time of purchase. Links have no added affiliate tracking.

## Updated cover artwork

The owner explicitly supplied these updated paperback cover PDFs from the `KDP_English_Updated_2026_11_11` production package:

- `Amazing_Animals_EN_Paperback_Cover_116p.pdf`
- `Cozy_Colouring_EN_Paperback_Cover_112p.pdf`
- `Travel_Edition_EN_Paperback_Cover_116p.pdf`

Their front trim panels were rendered at 120 DPI with Poppler using the package's verified front-panel geometry. The source PDFs were not changed. Website files are `assets/books/animals-new.png`, `cozy-new.png`, and `travel-new.png`. The updated paperback artwork is shown for each book; Amazon may display earlier previews, and the site explains that distinction.

To add another format, add its verified edition URL and metadata to the book's `variants` array in `dist/catalog.js`. Do not create duplicate cards or guess an ASIN. Paperback remains the first/default format. Categories and filters are generated from the catalog.

## Available Premium Preschool Series

Learn How to Write Workbook is now available in paperback at https://www.amazon.ca/dp/B0HS5Q51V3. Verified on November 20, 2026 through the studio's Amazon author page and the product listing: Letters, Shapes and Numbers with Pen control; 120 pages; English; ages 3–5; published November 18, 2026; ISBN 9798143751064; 8.5 × 11 inches. No hardcover or Kindle link is invented. Current prices and delivery remain on Amazon.

The published 120-page edition supersedes the earlier 96-page preview. The website uses the owner's existing marketing-kit-120-pages assets, with approved cover A unchanged. The corresponding landscape tour, poster, and three A+ graphics replace the earlier promo references. English captions were updated to the 120-page count. Original source files were not altered.

| Website asset | Existing source |
| --- | --- |
| `assets/books/learn-how-to-write.png` | `learn-how-to-write/cover-choices/A-colorful-first-steps.png` |
| `assets/preschool/workbook-promo-120.mp4` | `marketing-kit-120-pages/videos/01-landscape-book-tour-1920x1080.mp4` |
| `assets/preschool/workbook-promo-120-poster.jpg` | Matching 120-page landscape poster |
| `assets/preschool/pen-control-120.jpg` | `marketing-kit-120-pages/amazon-a-plus/02a-pen-control-600x600.jpg` |
| `assets/preschool/stroke-guide-120.jpg` | `marketing-kit-120-pages/amazon-a-plus/02b-stroke-guide-600x600.jpg` |
| `assets/preschool/count-and-write-120.jpg` | `marketing-kit-120-pages/amazon-a-plus/02c-count-and-write-600x600.jpg` |

The feature is available at `#preschool`; a legacy `#upcoming` anchor remains for earlier shared links. The workbook is also the first card in the searchable collection, with paperback as default.
