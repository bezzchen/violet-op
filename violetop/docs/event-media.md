# Event media archive

Reviewed October 12, 2026. The Events page links to `/media` and four individual `/media/[slug]` collections. The former Gen.G event detail URL redirects to its completed-event collection.

## Sources

The school collection is [VIOLET OP Media Assets](https://drive.google.com/drive/folders/1Qhc6vZNwqlLP5GAyH5uI5-cXo0a4K8Tn). Event dates and descriptions were cross-checked with the past chats **Create 3 VOP community collages**, **Refine Gen.G event opening**, and **Draft thank-you email to Laurie**. The latter confirms that the Gen.G event took place at Palladium on October 9. Arnold Hur's title is CEO.

| Event | Photos | Videos / reels | Posters | Source |
| --- | ---: | ---: | ---: | --- |
| Gen.G fireside chat, October 9 | 67 | 27 | 0 | [Album](https://drive.google.com/drive/folders/1kcrBwLDgHmYb5rPW3QxRJxDk7lhP11PF) |
| LEVEL UP! VALORANT, September 20 | 37 | 42 | 0 | [Album](https://drive.google.com/drive/folders/1fNa6t8xGgbT948JzjHFH-RGT4NlxdTXE) |
| LEVEL UP! League of Legends, September 13 | 12 | 27 | 0 | [Album](https://drive.google.com/drive/folders/1MR3fpChyKVCCEZfnLOSNvl9ADxIrhkNf) |
| VCT Americas Watch Party, September 6 | 108 | 67 | 7 | [Album](https://drive.google.com/drive/folders/1MOQIqtZA3OaRIRZNGBdZHo0yJpBQaOnM) |

Seven exact duplicate VCT photographs had already been identified in the September portfolio; each is displayed only once. The VALORANT source folder contained five photos and twenty videos added since that portfolio, and these are included. AI-assisted collage designs and internal planning documents are not represented as event photography.

## Assets and maintenance

- `app/data/pastEvents.ts` contains the completed-event metadata and cover images.
- `app/data/eventMedia.json` lists every media item and its original Drive source URL. The detail route only sends the selected event's records to the browser.
- Photographs and posters have local WebP display files (up to 1920 pixels) and 640-pixel thumbnails in `public/images/media`. They contain no source EXIF metadata. Full originals remain linked from the viewer.
- The gallery initially renders 24 items, with more available on demand. Videos load a single Drive preview only after a visitor opens one; closing the viewer removes playback.
- All 163 video/reel preview URLs were checked without authentication on October 12. Public Drive availability is an external dependency; each viewer also has an original link. Source sharing permissions were not changed.
- To add an event, add its metadata, optimized images, and media records. It will appear in the archive cards and receive a generated detail route. Add an entry in `eventPhotos.ts` if it should also appear in the carousel.
- Events lists now use the same New York date-based upcoming filter as the homepage, so completed scheduled events are not advertised as upcoming.

Validation: production build, existing 37 tests, targeted lint, source/asset integrity checks, public video link checks, and browser checks of galleries, Gen.G reel playback, and mobile layout.
