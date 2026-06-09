REPLACE-ME folder
=================
Drop real photos here (engagement photos, venue shots, the draft artwork).

Suggested files and where they're used:
- og-image.png        -> social link preview (update og:image in index.html)
- hero-photo.jpg      -> optional photo under the hero arch
- venue.jpg           -> Our Day section

Tips for photos:
- Export JPGs around 1600px wide for full-width use; ~800px for cards.
- Use loading="lazy" on any <img> below the fold, e.g.:
    <img src="assets/images/venue.jpg"
         srcset="assets/images/venue-800.jpg 800w, assets/images/venue-1600.jpg 1600w"
         sizes="(min-width: 760px) 50vw, 100vw"
         alt="Inside Salvage One" loading="lazy" />
