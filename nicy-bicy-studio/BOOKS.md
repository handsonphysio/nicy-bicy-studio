# Published book collection

Amazon author page: https://www.amazon.ca/stores/Nicy-Bicy-Studio/author/B0HQRHGWWR

Verified on November 16, 2026. Paperback is the primary edition for every book. Hardcover options are inside the book-details dialog, with a separate link to the selected edition.

| Book | Paperback ASIN | Hardcover ASIN | Pages |
| --- | --- | --- | --- |
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

## Upcoming Premium Preschool Series

The owner requested Learn How to Write Workbook as an upcoming Amazon launch. Its verified subtitle is Pen Control, Letters, Shapes & Numbers, for ages 3–5, with 96 color pages. The existing November 16, 2026 marketing kit confirms approved cover A and the latest interior. No launch date or ASIN has been supplied, so this feature says Coming soon on Amazon and links to the studio's author page rather than a fictional product listing.

The website reuses the existing marketing kit files without changing the artwork or footage:

| Website asset in `dist/assets/preschool/` | Original marketing-kit file |
| --- | --- |
| `workbook-promo.mp4` | `videos/01-landscape-book-tour-1920x1080.mp4` |
| `workbook-promo-poster.jpg` | `videos/01-landscape-book-tour-1920x1080-poster.jpg` |
| `workbook-promo.vtt` | `videos/on-screen-text.vtt` |
| `pen-control.jpg` | `amazon-a-plus/02a-pen-control-600x600.jpg` |
| `stroke-guide.jpg` | `amazon-a-plus/02b-stroke-guide-600x600.jpg` |
| `count-and-write.jpg` | `amazon-a-plus/02c-count-and-write-600x600.jpg` |

The original 20-second landscape tour includes the approved cover, actual workbook page previews, on-screen text, and original instrumental music. It plays only on visitor request and has optional English captions. The feature does not claim that the workbook is already on sale.
