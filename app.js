(() => {
  "use strict";

  const config = window.WEDDING_CONFIG;
  if (!config) return;

  // Thin reading progress cue, updated once per animation frame while scrolling.
  const progressIndicator = document.getElementById("scroll-progress");
  let progressFrame = 0;
  const updateProgress = () => {
    if (!progressIndicator || progressFrame) return;
    progressFrame = window.requestAnimationFrame(() => {
      progressFrame = 0;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      progressIndicator.style.setProperty("--scroll-progress", progress);
    });
  };
  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  const readPath = (object, path) => path.split(".").reduce((value, key) => value?.[key], object);

  document.querySelectorAll("[data-config]").forEach((element) => {
    const value = readPath(config, element.dataset.config);
    if (value !== undefined && value !== null) element.textContent = value;
  });

  document.title = `${config.couple.bride.name} & ${config.couple.groom.name} — Wedding Invitation`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = `Join ${config.couple.bride.name} and ${config.couple.groom.name} for their wedding celebrations in Jalgaon on ${config.events.haldi.date} and ${config.events.wedding.date}.`;

  document.querySelectorAll("[data-photo]").forEach((image) => {
    const photo = config.photos[image.dataset.photo];
    if (!photo) return;
    image.src = photo.src;
    image.alt = photo.alt;
  });

  const galleryPhotos = config.photos.gallery;
  const galleryCards = [...document.querySelectorAll("#gallery-grid .gallery-item")];
  galleryCards.forEach((card, index) => {
    const photo = galleryPhotos[index];
    if (!photo) {
      card.remove();
      return;
    }
    const image = card.querySelector("img");
    const button = card.querySelector(".gallery-open");
    image.src = photo.src;
    image.alt = photo.alt;
    card.querySelector("figcaption").textContent = photo.caption;
    button.setAttribute("aria-label", `Enlarge photograph ${index + 1}: ${photo.caption}`);
    button.dataset.photoIndex = String(index);
  });

  // Maps opens with the verified listing address. Replace the editable URL with
  // the family's preferred pin if they provide a more precise location.
  const mapsSearch = document.getElementById("maps-search");
  mapsSearch.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(config.venue.searchQuery)}`;
  const directions = document.getElementById("directions-link");
  if (config.venue.directionsUrl) {
    directions.href = config.venue.directionsUrl;
    directions.removeAttribute("aria-disabled");
    directions.removeAttribute("tabindex");
    directions.classList.remove("is-disabled");
  }
  const map = document.getElementById("venue-map");
  if (config.venue.embedUrl) {
    map.src = config.venue.embedUrl;
    map.hidden = false;
    document.getElementById("map-placeholder").hidden = true;
    document.getElementById("map-confirmation").hidden = true;
  }

  config.contacts.forEach((contact, index) => {
    document.querySelectorAll(`[data-contact-name="${index}"]`).forEach((element) => { element.textContent = contact.name; });
    document.querySelectorAll(`[data-contact-phone="${index}"]`).forEach((element) => {
      element.textContent = contact.phone;
      element.href = `tel:+91${contact.phone}`;
      element.setAttribute("aria-label", `Call ${contact.name} at ${contact.phone}`);
    });
    document.querySelectorAll(`[data-contact-whatsapp="${index}"]`).forEach((element) => {
      element.href = `https://wa.me/${contact.whatsapp}`;
      element.setAttribute("aria-label", `Message ${contact.name} on WhatsApp`);
    });
  });
  document.getElementById("copy-address").addEventListener("click", async () => {
    const status = document.getElementById("copy-status");
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(config.venue.address);
      } else {
        const field = document.createElement("textarea");
        field.value = config.venue.address;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.append(field);
        field.select();
        const copied = document.execCommand("copy");
        field.remove();
        if (!copied) throw new Error("Copy was not available");
      }
      status.textContent = "Address copied.";
    } catch {
      status.textContent = "Copy was unavailable. You can select the address above.";
    }
  });

  // Accurate live countdown. The explicit UTC offset represents 12:40 PM IST.
  const eventTimestamp = new Date(config.events.weddingIso).getTime();
  const countdown = document.querySelector(".countdown");
  const countdownEnded = document.getElementById("countdown-ended");
  const countdownFields = {
    days: document.getElementById("count-days"),
    hours: document.getElementById("count-hours"),
    minutes: document.getElementById("count-minutes"),
    seconds: document.getElementById("count-seconds")
  };
  let countdownInterval = null;
  const updateCountdown = () => {
    const remaining = eventTimestamp - Date.now();
    if (remaining <= 0) {
      countdown.hidden = true;
      countdownEnded.hidden = false;
      window.clearInterval(countdownInterval);
      return;
    }
    const seconds = Math.floor(remaining / 1000);
    const values = {
      days: Math.floor(seconds / 86400),
      hours: Math.floor((seconds % 86400) / 3600),
      minutes: Math.floor((seconds % 3600) / 60),
      seconds: seconds % 60
    };
    Object.entries(values).forEach(([key, value]) => { countdownFields[key].textContent = String(value).padStart(2, "0"); });
  };
  updateCountdown();
  if (!countdownEnded.hidden) countdownInterval = null;
  else countdownInterval = window.setInterval(updateCountdown, 1000);

  // Opening invitation; Skip Intro and repeat visits remain easy to use.
  const intro = document.getElementById("intro-screen");
  const header = document.getElementById("site-header");
  const main = document.getElementById("main-content");
  const footer = document.querySelector(".site-footer");
  const introButtons = [document.getElementById("skip-intro"), document.getElementById("open-invitation"), document.getElementById("open-invitation-link")];
  let introOpen = false;
  try { introOpen = sessionStorage.getItem("sayali-shubham-invitation-opened") === "true"; } catch { /* Session storage may be unavailable. */ }
  if (!introOpen) {
    intro.classList.add("is-active");
    intro.setAttribute("aria-hidden", "false");
    document.body.classList.add("intro-locked");
    [header, main, footer].forEach((element) => { element.inert = true; });
    document.getElementById("skip-intro").focus({ preventScroll: true });
  } else {
    document.body.classList.add("invitation-visible");
  }
  const closeIntro = (animate) => {
    if (!intro.classList.contains("is-active")) return;
    document.body.classList.add("invite-opening");
    try { sessionStorage.setItem("sayali-shubham-invitation-opened", "true"); } catch { /* Continue without persistence. */ }
    const finish = () => {
      intro.classList.remove("is-active", "is-leaving");
      intro.setAttribute("aria-hidden", "true");
      document.body.classList.remove("intro-locked", "invite-opening");
      document.body.classList.add("invitation-visible");
      [header, main, footer].forEach((element) => { element.inert = false; });
      header.querySelector("a").focus({ preventScroll: true });
    };
    if (animate) {
      intro.classList.add("is-leaving");
      window.setTimeout(finish, window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 80 : 650);
    } else {
      finish();
    }
  };
  document.getElementById("skip-intro").addEventListener("click", () => closeIntro(false));
  document.getElementById("open-invitation").addEventListener("click", () => closeIntro(true));
  document.getElementById("open-invitation-link").addEventListener("click", () => closeIntro(true));
  intro.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;
    const focusable = introButtons.filter((button) => !button.disabled);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  document.querySelectorAll(".mobile-menu a").forEach((link) => link.addEventListener("click", () => { link.closest("details").open = false; }));

  // Cinematic clips pause offscreen to avoid needless decoding and resume in view.
  const filmVideos = [...document.querySelectorAll(".film-video")];
  const filmToggle = document.getElementById("film-toggle");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let filmPausedByGuest = reducedMotion;
  const updateFilmToggle = () => {
    if (!filmToggle) return;
    filmToggle.textContent = filmPausedByGuest ? "Play film  ▶" : "Pause film  Ⅱ";
    filmToggle.setAttribute("aria-pressed", String(filmPausedByGuest));
  };
  const syncFilmPlayback = () => {
    filmVideos.forEach((video) => {
      if (filmPausedByGuest || document.visibilityState === "hidden") {
        video.pause();
      } else if (video.getBoundingClientRect().bottom > 0 && video.getBoundingClientRect().top < window.innerHeight) {
        video.play().catch(() => { /* Posters remain available if autoplay is unavailable. */ });
      }
    });
  };
  filmToggle?.addEventListener("click", () => {
    filmPausedByGuest = !filmPausedByGuest;
    updateFilmToggle();
    syncFilmPlayback();
  });
  window.addEventListener("scroll", syncFilmPlayback, { passive: true });
  document.addEventListener("visibilitychange", syncFilmPlayback);
  updateFilmToggle();
  if (reducedMotion) filmVideos.forEach((video) => video.removeAttribute("autoplay"));
  window.requestAnimationFrame(syncFilmPlayback);

  // Keep the mobile film carousel centered, touch-scrollable, and easy to navigate.
  const filmReel = document.querySelector(".film-reel");
  const filmSlides = filmReel ? [...filmReel.querySelectorAll(".film-frame")] : [];
  const filmSlideStatus = document.getElementById("film-slide-status");
  const filmPrevious = document.getElementById("film-prev");
  const filmNext = document.getElementById("film-next");
  if (filmReel && filmSlides.length && filmSlideStatus && filmPrevious && filmNext) {
    let activeFilmSlide = 0;
    let filmScrollFrame = 0;
    if (window.matchMedia("(max-width: 980px)").matches) filmReel.scrollLeft = 0;
    const updateFilmSlideStatus = () => {
      filmScrollFrame = 0;
      const reelCenter = filmReel.getBoundingClientRect().left + filmReel.clientWidth / 2;
      activeFilmSlide = filmSlides.reduce((closest, slide, index) => {
        const rect = slide.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - reelCenter);
        const closestRect = filmSlides[closest].getBoundingClientRect();
        return distance < Math.abs(closestRect.left + closestRect.width / 2 - reelCenter) ? index : closest;
      }, 0);
      filmSlideStatus.textContent = `${String(activeFilmSlide + 1).padStart(2, "0")} / ${String(filmSlides.length).padStart(2, "0")}`;
    };
    const scheduleFilmSlideStatus = () => {
      if (!filmScrollFrame) filmScrollFrame = window.requestAnimationFrame(updateFilmSlideStatus);
    };
    const moveFilmSlide = (direction) => {
      activeFilmSlide = (activeFilmSlide + direction + filmSlides.length) % filmSlides.length;
      const reelRect = filmReel.getBoundingClientRect();
      const slideRect = filmSlides[activeFilmSlide].getBoundingClientRect();
      const targetLeft = filmReel.scrollLeft + slideRect.left - reelRect.left - (filmReel.clientWidth - slideRect.width) / 2;
      filmReel.scrollTo({ left: targetLeft, behavior: reducedMotion ? "auto" : "smooth" });
      scheduleFilmSlideStatus();
    };
    filmReel.addEventListener("scroll", scheduleFilmSlideStatus, { passive: true });
    window.addEventListener("resize", scheduleFilmSlideStatus, { passive: true });
    filmPrevious.addEventListener("click", () => moveFilmSlide(-1));
    filmNext.addEventListener("click", () => moveFilmSlide(1));
    updateFilmSlideStatus();
  }

  // Subtle reveals; all content remains visible if IntersectionObserver is absent.
  const revealItems = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        if (entry.target.classList.contains("timeline-event")) entry.target.closest(".event-timeline")?.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    document.querySelector(".event-timeline")?.classList.add("is-visible");
  }

  // Accessible lightbox: buttons, arrow keys, Escape, and swipe on touch screens.
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightbox-image");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const lightboxCount = document.getElementById("lightbox-count");
  let activePhoto = 0;
  const renderLightbox = () => {
    const photo = galleryPhotos[activePhoto];
    lightboxImage.src = photo.src;
    lightboxImage.alt = photo.alt;
    lightboxCaption.textContent = photo.caption;
    lightboxCount.textContent = `${String(activePhoto + 1).padStart(2, "0")} / ${String(galleryPhotos.length).padStart(2, "0")}`;
  };
  galleryCards.forEach((card) => card.querySelector(".gallery-open")?.addEventListener("click", (event) => {
    activePhoto = Number(event.currentTarget.dataset.photoIndex) || 0;
    renderLightbox();
    lightbox.showModal();
    document.getElementById("lightbox-close").focus({ preventScroll: true });
  }));
  const moveLightbox = (direction) => {
    activePhoto = (activePhoto + direction + galleryPhotos.length) % galleryPhotos.length;
    renderLightbox();
  };
  document.getElementById("lightbox-close").addEventListener("click", () => lightbox.close());
  document.getElementById("lightbox-prev").addEventListener("click", () => moveLightbox(-1));
  document.getElementById("lightbox-next").addEventListener("click", () => moveLightbox(1));
  lightbox.addEventListener("click", (event) => { if (event.target === lightbox) lightbox.close(); });
  lightbox.addEventListener("keydown", (event) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); moveLightbox(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); moveLightbox(1); }
  });
  let touchStartX = 0;
  lightbox.addEventListener("pointerdown", (event) => { touchStartX = event.clientX; });
  lightbox.addEventListener("pointerup", (event) => {
    const delta = event.clientX - touchStartX;
    if (Math.abs(delta) < 55 || event.pointerType === "mouse") return;
    moveLightbox(delta < 0 ? 1 : -1);
  });

  // Try to start the family-supplied music on page load; browsers may require a tap.
  const audio = document.getElementById("background-audio");
  const musicButtons = [document.getElementById("music-play"), document.getElementById("music-pause"), document.getElementById("music-mute")];
  const musicNote = document.getElementById("music-note");
  if (config.music.src) {
    audio.src = config.music.src;
    audio.loop = true;
    audio.autoplay = true;
    audio.preload = "auto";
    musicButtons.forEach((button) => { button.disabled = false; });
    musicNote.textContent = "Starting Mangal Rang…";
    let manuallyStopped = false;
    const credit = document.getElementById("music-credit");
    if (credit && config.music.credit && config.music.sourceUrl) {
      const sourceLink = document.createElement("a");
      sourceLink.href = config.music.sourceUrl;
      sourceLink.target = "_blank";
      sourceLink.rel = "noopener noreferrer";
      sourceLink.textContent = config.music.credit;
      credit.append(sourceLink);
    }
    const startMusic = async () => {
      try {
        await audio.play();
        document.body.classList.add("music-playing");
        musicNote.textContent = "Music is playing.";
      } catch {
        document.body.classList.remove("music-playing");
        musicNote.textContent = "Your browser blocked autoplay. Tap anywhere to start Mangal Rang.";
      }
    };
    const tryStartFromGesture = (event) => {
      const target = event.target;
      if (manuallyStopped || (target instanceof Element && target.closest(".music-controls"))) return;
      window.removeEventListener("pointerdown", tryStartFromGesture, true);
      window.removeEventListener("keydown", tryStartFromGesture, true);
      startMusic();
    };
    window.addEventListener("pointerdown", tryStartFromGesture, true);
    window.addEventListener("keydown", tryStartFromGesture, true);
    musicButtons[0].addEventListener("click", () => { manuallyStopped = false; startMusic(); });
    musicButtons[1].addEventListener("click", () => {
      manuallyStopped = true;
      audio.pause();
      audio.currentTime = 0;
      document.body.classList.remove("music-playing");
      musicNote.textContent = "Music stopped.";
    });
    audio.addEventListener("ended", () => {
      if (audio.loop) return;
      document.body.classList.remove("music-playing");
      musicNote.textContent = "Mangal Rang has ended.";
    });
    musicButtons[2].addEventListener("click", (event) => {
      audio.muted = !audio.muted;
      event.currentTarget.textContent = audio.muted ? "Unmute" : "Mute";
      event.currentTarget.setAttribute("aria-pressed", String(audio.muted));
      event.currentTarget.setAttribute("aria-label", audio.muted ? "Unmute background music" : "Mute background music");
    });
    startMusic();
  }
})();
