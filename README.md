# Sayali & Shubham wedding invitation

Open `index.html` in a browser to view the invitation. Keep `styles.css`, `config.js`, `app.js`, and the `assets` folder beside it.

## Updating details

`config.js` is the single edit point for names, qualifications, family names, event dates and times, meal placeholders, contact numbers, venue links, photo choices, and optional music.

The selected JPGs are in `assets/originals/` and are exact copies of the supplied photographs. The site uses CSS for sizing and framing and keeps the original aspect ratios.

The invitation is from the bride's Sonawane family. There is no RSVP form; guests can contact the family directly by phone or WhatsApp using the contact links.

The optional music player uses the family-supplied `assets/music/mangal-rang-ramayana.mp3`. The audio file is kept unchanged, and the page attempts to start playback on load. Some browsers block sound until a guest interacts with the page; if that happens, the first tap or key press anywhere on the invitation starts the music. Play, Stop, and Mute controls are available. Replace `music.src` and `music.label` in `config.js` to use a different track.

The venue address and Google Maps embed are based on the Samartha Lawns venue listing. Replace `venue.directionsUrl` and `venue.embedUrl` in `config.js` if the family provides a different verified pin.
