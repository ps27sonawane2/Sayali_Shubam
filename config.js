/*
  Wedding content configuration.
  Edit names, family details, timings, contact numbers, venue links,
  and music here. Keep phone digits as supplied; the WhatsApp number uses the
  India country prefix only for the wa.me URL.
*/
window.WEDDING_CONFIG = {
  timezone: "Asia/Kolkata",
  couple: {
    bride: {
      name: "Sayali Sonawane",
      firstName: "Sayali",
      qualification: "B.E. (Electrical), M.Tech",
      parentLine: "Sangeeta & Sanjay Bhikaji Sonawane",
      parentLabel: "Daughter of"
    },
    groom: {
      name: "Shubham Maskar",
      firstName: "Shubham",
      qualification: "B.E. (Computer), MBA (Marketing)",
      parentLine: "Nanda & Nivrutti Damodar Maskar",
      parentLabel: "Son of"
    },
    displayNames: "Sayali & Shubham"
  },
  events: {
    weddingDate: "4 January 2027",
    weddingIso: "2027-01-04T12:40:00+05:30",
    haldi: {
      day: "Sunday",
      date: "3 January 2027",
      time: "2:00 PM",
      title: "Haldi Ceremony",
      note: "Marigold moments, happy faces and blessings all around."
    },
    wedding: {
      day: "Monday",
      date: "4 January 2027",
      time: "12:40 PM",
      title: "Wedding Ceremony",
      note: "A day of promises, traditions and togetherness."
    }
  },
  meals: {
    lunchTime: "Timing to be announced.",
    lunchNote: "Good food tastes even better with good company.",
    dinnerTime: "Timing to be announced.",
    dinnerNote: "An evening to celebrate, laugh and make memories."
  },
  families: {
    invitingFamily: "The Sonawane Family",
    invitation: "With immense joy and the blessings of our elders, the Sonawane family cordially invites you and your family to celebrate the wedding of our beloved Sayali with Shubham. Our happiness feels even more complete when shared with you. Your presence and blessings will make this celebration truly special.",
    closing: "Cordially invited with love",
    footer: "The Sonawane Family"
  },
  venue: {
    name: "Samartha Lawns",
    address: "Samartha Lawns, S No 317, Kanalda Road, near KC Park, Mahavir Nagar, Jalgaon, Maharashtra 425001, India",
    searchQuery: "Samartha Lawns, Plot No 317/1, in front of KC Park, Kanalda Road, Mahavir Nagar, Jalgaon, Maharashtra 425001, India",
    /* Exact plot and landmark from the Samartha Lawns address listing. */
    directionsUrl: "https://www.google.com/maps/dir/?api=1&destination=Samartha+Lawns%2C+Plot+No+317%2F1%2C+in+front+of+KC+Park%2C+Kanalda+Road%2C+Mahavir+Nagar%2C+Jalgaon%2C+Maharashtra+425001%2C+India",
    embedUrl: "https://maps.google.com/maps?output=embed&q=Samartha+Lawns%2C+Plot+No+317%2F1%2C+in+front+of+KC+Park%2C+Kanalda+Road%2C+Mahavir+Nagar%2C+Jalgaon%2C+Maharashtra+425001%2C+India&z=18"
  },
  contacts: [
    { name: "Sanjay Sonawane", phone: "9422563637", whatsapp: "919422563637" },
    { name: "Prathamesh Sanjay Sonawane", phone: "9322314614", whatsapp: "919322314614" }
  ],
  photos: {
    hero: { src: "assets/originals/DSC08702.JPG", alt: "Sayali and Shubham sharing a quiet moment together in their traditional wedding attire" },
    bride: { src: "assets/originals/DSC08646.JPG", alt: "Sayali in her emerald green and gold saree with traditional jewellery" },
    groom: { src: "assets/originals/DSC09589.JPG", alt: "Shubham in a dark traditional outfit, standing in the garden" },
    story: { src: "assets/originals/DSC08604.JPG", alt: "Sayali smiling as Shubham leans close beside her" },
    family: { src: "assets/originals/DSC09194.JPG", alt: "Sayali and Shubham with members of the bride's family in a formal portrait" },
    closing: { src: "assets/originals/DSC09513.JPG", alt: "Sayali and Shubham holding hands during an outdoor portrait" },
    gallery: [
      { src: "assets/originals/DSC08755.JPG", alt: "Sayali and Shubham reaching for each other during an outdoor portrait", caption: "A little joy in every step" },
      { src: "assets/originals/DSC08634.JPG", alt: "Sayali smiling in her green and gold saree beside a garden wall", caption: "In the garden" },
      { src: "assets/originals/DSC08810.JPG", alt: "Sayali seated in her wedding saree on a decorated ceremonial chair", caption: "In her bridal finery" },
      { src: "assets/originals/DSC09059.JPG", alt: "Sayali and Shubham seated together during their celebration", caption: "A celebration together" },
      { src: "assets/originals/DSC08911.JPG", alt: "Shubham seated in traditional attire with hands joined", caption: "Shubham, surrounded by blessings" }
    ]
  },
  storyLine: "Some moments become memories. Some become forever.",
  music: {
    src: "assets/music/mangal-rang-ramayana.mp3",
    label: "Mangal Rang"
  }
};
