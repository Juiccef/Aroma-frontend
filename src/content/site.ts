/**
 * Merchant-editable storefront content. Everything here is configuration:
 * in a Hydrogen build these values move to shop metaobjects / theme
 * settings; in a Liquid theme they become section settings.
 *
 * Values marked NEEDS-REAL-VALUE are unknown publicly and must be filled
 * by the merchant before launch (see README "Flagged gaps").
 */

export const site = {
  name: 'AROMA',
  nameAr: 'أروما',
  tagline: 'Roastery & Confectionery',
  city: 'Duluth',
  region: 'Georgia',
  streetAddress: '3308 Peachtree Industrial Blvd #140',
  postalCode: '30096',
  liveDomain: 'https://www.aromaroastco.com',
  phone: '470-275-4469',
  phoneHref: 'tel:+14702754469',
  /** from the store's Google Business listing; update as new reviews come in */
  googleRating: { value: 5.0, count: 147 },
  mapsHref:
    'https://www.google.com/maps/search/?api=1&query=3308+Peachtree+Industrial+Blvd+%23140+Duluth+GA+30096',

  /** shop hours, Monday first; opens/closes are 24h HH:mm for the Store schema below */
  hours: [
    { day: 'Monday', label: '11 AM – 9 PM', opens: '11:00', closes: '21:00' },
    { day: 'Tuesday', label: '11 AM – 9 PM', opens: '11:00', closes: '21:00' },
    { day: 'Wednesday', label: '11 AM – 9 PM', opens: '11:00', closes: '21:00' },
    { day: 'Thursday', label: '11 AM – 9 PM', opens: '11:00', closes: '21:00' },
    { day: 'Friday', label: '11 AM – 11 PM', opens: '11:00', closes: '23:00' },
    { day: 'Saturday', label: '11 AM – 11 PM', opens: '11:00', closes: '23:00' },
    { day: 'Sunday', label: '11 AM – 9 PM', opens: '11:00', closes: '21:00' },
  ],

  /** merchant sets the real threshold; drives cart progress messaging */
  freeShippingThreshold: 59,

  social: {
    instagram: 'https://www.instagram.com/aromaroastco/' as string | null,
    facebook: 'https://www.facebook.com/share/1Dn5mPXA3F/?mibextid=wwXIfr' as string | null,
  },

  /** real list from the store's Shopify settings (meta.json ships_to_countries) */
  shipsTo: [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'New Zealand', 'Ireland',
    'Germany', 'France', 'Spain', 'Italy', 'Portugal', 'Netherlands', 'Belgium', 'Austria',
    'Switzerland', 'Denmark', 'Sweden', 'Norway', 'Finland', 'Poland', 'Czechia',
    'United Arab Emirates', 'Japan', 'South Korea', 'Hong Kong', 'Singapore', 'Malaysia',
  ],
}

/* ------------------------------ navigation ------------------------------ */

export interface NavLink {
  label: string
  to: string
}

export interface NavColumn {
  title: string
  links: NavLink[]
}

export interface NavItem {
  label: string
  labelAr: string
  to: string
  accent?: 'gold' | 'terracotta'
  columns?: NavColumn[]
  /** product handles shown as feature cards inside the mega panel */
  featured?: string[]
}

const c = (handle: string, tag?: string) =>
  tag ? `/collections/${handle}?tag=${tag}` : `/collections/${handle}`

export const navigation: NavItem[] = [
  {
    label: 'Nuts & Seeds',
    labelAr: 'مكسرات وبزورات',
    to: c('nuts-seeds'),
    columns: [
      {
        title: 'Roasted in-house',
        links: [
          { label: 'Mixed Nuts', to: c('nuts-seeds', 'mixed-nuts') },
          { label: 'Pistachios', to: c('nuts-seeds', 'pistachios') },
          { label: 'Cashews', to: c('nuts-seeds', 'cashews') },
          { label: 'Almonds', to: c('nuts-seeds', 'almonds') },
          { label: 'Hazelnuts & Pecans', to: c('nuts-seeds', 'hazelnuts-pecans') },
          { label: 'Peanuts', to: c('nuts-seeds', 'peanuts') },
        ],
      },
      {
        title: 'Seeds & crunch',
        links: [
          { label: 'Seeds & Kernels', to: c('nuts-seeds', 'seeds') },
          { label: 'Crunchy Mixes', to: c('nuts-seeds', 'crunchy-mixes') },
          { label: 'Roasted Legumes', to: c('nuts-seeds', 'roasted-legumes') },
          { label: 'Shop all Nuts & Seeds', to: c('nuts-seeds') },
        ],
      },
    ],
    featured: ['pistachios-salted', 'mixed-nuts-with-seeds'],
  },
  {
    label: 'Sweets & Snacks',
    labelAr: 'حلويات وسناكات',
    to: c('snacks'),
    columns: [
      {
        title: 'From the sweets counter',
        links: [
          { label: 'Arabic Sweets', to: c('snacks', 'arabic-sweets') },
          { label: 'Turkish Delights & Dried Fruits', to: c('turkish') },
          { label: 'Specialty Chocolates', to: c('cjhoci') },
          { label: 'Gummies & Candies', to: c('gummy') },
        ],
      },
      {
        title: 'The snack aisle',
        links: [
          { label: 'Chocolate Bars', to: c('snacks', 'chocolate-bars') },
          { label: 'Biscuits & Wafers', to: c('snacks', 'biscuits-wafers') },
          { label: 'Chips & Crisps', to: c('snacks', 'chips-crisps') },
          { label: 'Candy', to: c('snacks', 'candy') },
          { label: 'Shop all Snacks', to: c('snacks') },
        ],
      },
    ],
    featured: ['mamool-w-pistachio', 'mixed-turkish-delights'],
  },
  {
    label: 'Coffee & Tea',
    labelAr: 'قهوة وشاي',
    to: c('coffee'),
    columns: [
      {
        title: 'Brew like home',
        links: [
          { label: 'House Roast', to: c('coffee', 'house-roast') },
          { label: 'With Cardamom', to: c('coffee', 'cardamom-coffee') },
          { label: 'Karak & Chai', to: c('coffee', 'karak-chai') },
          { label: 'Instant', to: c('coffee', 'instant') },
          { label: 'Shop all Coffee & Tea', to: c('coffee') },
        ],
      },
    ],
    featured: ['coffee-mixed-with-cardamom', 'karak-tea-original'],
  },
  {
    label: 'Spices & Herbs',
    labelAr: 'بهارات وأعشاب',
    to: c('spices-herbs'),
    columns: [
      {
        title: 'The spice wall',
        links: [
          { label: 'Zaatar', to: c('spices-herbs', 'zaatar') },
          { label: 'Spice Blends', to: c('spices-herbs', 'spice-blends') },
          { label: 'Single Spices', to: c('spices-herbs', 'single-spices') },
        ],
      },
      {
        title: 'Steep & simmer',
        links: [
          { label: 'Herbs & Teas', to: c('spices-herbs', 'herbs-teas') },
          { label: 'Premium Pantry', to: c('spices-herbs', 'premium-pantry') },
          { label: 'Shop all Spices & Herbs', to: c('spices-herbs') },
        ],
      },
    ],
    featured: ['zatar-palestinian', 'saffron'],
  },
  { label: 'Drinks', labelAr: 'مشروبات', to: c('exotic-drinks') },
  { label: 'Gifting Guide', labelAr: 'دليل الهدايا', to: '/pages/gifting' },
  { label: 'Best Sellers', labelAr: 'الأكثر مبيعاً', to: c('best-sellers'), accent: 'gold' },
  { label: 'New & Trending', labelAr: 'جديد ورائج', to: c('new-trending'), accent: 'terracotta' },
]

/* --------------------------- merchandising ---------------------------- */

/**
 * Curated rails. On live Shopify these become automated/manual collections
 * (best sellers via sales sort, under-10 via price condition); the
 * virtual handles below map 1:1 to collections the merchant creates.
 */
export const merchandising = {
  bestSellers: [
    'pistachios-salted',
    'mixed-nuts-with-seeds',
    'watermelon-seeds-salted',
    'cashews-mix',
    'abu-nugta-palestinian-seeds',
    'egyptian-seeds',
    'almonds-smoked',
    'pecans-honey-roasted-1',
    'mixed-chocolates',
    'mixed-turkish-delights',
    'coffee-mixed-with-cardamom',
    'mamool-w-pistachio',
  ],
  trending: [
    'karak-tea-original',
    'nestle-damak-ala-milk-with-pistachio-copy',
    'mixed-gummies',
    'nutella-biscuits',
    'saffron',
    'freez-lychee',
    'popping-fruit-fruit-jellies-jungle',
    'kinder-bueno-mini',
    'chai-adan-with-ginger',
    'blu-watermelon',
  ],
  underPrice: 10,
}

export interface ProductMixOption {
  label: string
  choices: string[]
  specialRequests: boolean
}

/**
 * "Select Your Mix" + special-requests fields the old theme exposed via the
 * Easify Product Options app. That app only runs inside Shopify's own theme
 * rendering, so it's invisible to the Storefront API — this is the same
 * choice list, transcribed from the live (still-published) old theme, keyed
 * by product handle. Selection + notes are sent as cart line attributes on
 * add-to-cart, so they land on the real Shopify order the same way.
 */
export const productMixOptions: Record<string, ProductMixOption> = {
  'mixed-chocolates': {
    label: 'Select Your Mix',
    choices: [
      'All Chocolates Mix',
      'Dark Chocolate Mix',
      'Milk Chocolate Mix',
      'Pistachio Mix',
      'Hazelnut Mix',
      'Almond Mix',
      'Date Mix',
    ],
    specialRequests: true,
  },
  'mixed-gummies': {
    label: 'Select Your Mix',
    choices: [
      'All Gummies Mix',
      'Sour Mix',
      'Fruity Mix',
      'Licorice Mix',
      'CocaCola Mix',
      'Rainbow Mix',
      'Red Mix',
      'Blue Mix',
    ],
    specialRequests: true,
  },
}

export interface VirtualCollection {
  handle: string
  title: string
  titleAr: string
  description: string
}

export const virtualCollections: VirtualCollection[] = [
  {
    handle: 'best-sellers',
    title: 'Best Sellers',
    titleAr: 'الأكثر مبيعاً',
    description: 'The jars we refill the most: house-roasted nuts, seeds for long evenings, and sweets that never make it to the shelf.',
  },
  {
    handle: 'new-trending',
    title: 'New & Trending',
    titleAr: 'جديد ورائج',
    description: 'Fresh arrivals and the flavors everyone keeps asking for, from karak to pistachio chocolate.',
  },
  {
    handle: 'under-10',
    title: 'Under $10',
    titleAr: 'أقل من ١٠ دولارات',
    description: 'Small prices, big cravings. Stock the pantry or try something new without thinking twice.',
  },
]

/** Arabic labels for the real Shopify collections (display metafields on live store) */
export const collectionArabic: Record<string, string> = {
  coffee: 'قهوة وشاي',
  'exotic-drinks': 'مشروبات',
  gummy: 'جيلي وسكاكر',
  'nuts-seeds': 'مكسرات وبزورات',
  snacks: 'سناكات',
  cjhoci: 'شوكولاتة فاخرة',
  'spices-herbs': 'بهارات وأعشاب',
  turkish: 'راحة وفواكه مجففة',
}

/** editorial blurbs for collection tiles/headers (merchant copy, not product data) */
export const collectionCopy: Record<string, string> = {
  coffee: 'Ground fresh with cardamom, or ready for karak on the stove.',
  'exotic-drinks': 'Juices, malts and fizzy things from every corner shop you miss.',
  gummy: 'Chewy, fruity and halal: the pick-n-mix counter, boxed up.',
  'nuts-seeds': 'Roasted in small batches and seasoned by hand, every single week.',
  snacks: 'Chips, wafers, chocolate bars and the sweets of every childhood.',
  cjhoci: 'Chocolates worth wrapping, filled and finished by hand.',
  'spices-herbs': 'Zaatar, sumac, saffron and blends measured the old way.',
  turkish: 'Rose-dusted delights and sun-dried fruit, cut fresh off the block.',
}

/**
 * Real in-store photography (plus, for coffee/spices-herbs, a couple of
 * free-license Unsplash stock photos where no in-store shot was available),
 * used until the merchant uploads each of these as the collection's own
 * image in Shopify Admin (at which point the live Storefront API image
 * takes over automatically and this override is unused — see
 * CategoryGrid.tsx). `turkish` intentionally overrides an existing
 * AI-generated placeholder from the live store with a real photo.
 */
export const collectionImageOverrides: Record<string, string> = {
  'exotic-drinks': '/media/collection-exotic-drinks.jpg',
  snacks: '/media/collection-snacks.jpg',
  turkish: '/media/collection-turkish.jpg',
  // stock (Unsplash License, free commercial use): no in-store shot available
  coffee: '/media/collection-coffee.jpg',
  'spices-herbs': '/media/collection-spices.jpg',
}

/**
 * Hero-only image swap, keyed by product handle. The products themselves
 * keep their real (merchant-uploaded, plain white studio background)
 * photo everywhere else — product cards, collection grids, the product
 * page — this only swaps what the homepage hero shows, since a flat
 * white product shot reads poorly against the hero's dark backdrop.
 */
export const heroImageOverrides: Record<string, string> = {
  'pistachios-salted': '/media/hero-pistachios.jpg',
  'mixed-chocolates': '/media/hero-chocolates.jpg',
  'mixed-turkish-delights': '/media/hero-turkish-delight.jpg',
  'coffee-mixed-with-cardamom': '/media/product-coffee-cardamom.jpg',
  'karak-tea-original': '/media/product-karak-tea.jpg',
}

/* ------------------------------ occasions ------------------------------ */

export const occasions = [
  { label: 'Eid & Ramadan', labelAr: 'العيد ورمضان' },
  { label: 'Weddings', labelAr: 'أعراس' },
  { label: 'Graduations', labelAr: 'تخرج' },
  { label: 'New Baby', labelAr: 'مواليد' },
  { label: 'Corporate', labelAr: 'شركات' },
]

/* -------------------------------- reviews ------------------------------- */

/**
 * Real 5-star Google reviews for the Duluth store, transcribed verbatim
 * (trimmed to the most quotable sentences where the original review ran
 * long) — replace with a live Google Reviews / Judge.me feed at launch.
 */
export const reviews = [
  {
    quote:
      "Without a doubt the best coffee house and roastery I've visited in the U.S. The aroma when you walk in is incredible and instantly reminded me of back home.",
    author: 'Ameer Salame',
    rating: 5,
  },
  {
    quote:
      'Thee Aroma definitely took me back to the holy land of Jerusalem. Spectacular coffee smell when you first step in, variety of fresh nuts available, over 50 kinds of halal gummy bears and the biggest surprise (my most favorite) fresh Turkish delights.',
    author: 'Layth Abu Alia',
    rating: 5,
  },
  {
    quote:
      'Stopped by here for their soft opening over the weekend and honestly loved it. They have a huge selection of roasted nuts and everything I tried tasted super fresh. The chocolates were really good too — ended up buying way more than I planned.',
    author: 'Adam Warrayat',
    rating: 5,
  },
  {
    quote:
      'Honestly, I\'m so happy I found this place! Everything was so beautiful and nostalgic, they have so many chocolates and treats that I literally grew up eating, plus so many Arabic products that are hard to find in one place. The whole place has such a cozy, welcoming vibe, and you can tell they put so much love into it.',
    author: 'D A',
    rating: 5,
  },
  {
    quote:
      'Visited today and the two gentlemen inside were friendly and generous with samples including the amazing Turkish coffee. They spent time explaining things and weren\'t rushed. Sampled plenty of nuts and a pistachio caramel chocolate.',
    author: 'Stephanie Rollins',
    rating: 5,
  },
  {
    quote:
      'Went to the soft opening and had a wonderful experience. You are immediately welcomed and offered samples. The staff was knowledgeable and ready to serve. The prices are insanely good, especially with some of the items being rare finds!',
    author: 'Ashley Young',
    rating: 5,
  },
  {
    quote:
      'This place has fantastic coffee, delicious desserts, and freshly roasted nuts. Everything tastes fresh and high quality, and the staff is friendly and welcoming.',
    author: 'Tomas Regassa',
    rating: 5,
  },
  {
    quote:
      'It\'s amazing, it\'s the land of the sweet, also if you looking for a good quality of Arabic coffee it\'s here. I highly recommend it.',
    author: 'Ammar Azez',
    rating: 5,
  },
  {
    quote:
      'Awesome spot with variety of quality chocolates, nuts and candy… and all Halal! The service was amazing and the guys here let us sample anything we wanted before buying.',
    author: 'Miki Feyisa',
    rating: 5,
  },
  {
    quote:
      'Everything in here is so good. They have so much variety from Turkish delights to nuts to chocolates, anything you can think of. And everything tastes good and fresh.',
    author: 'Waleed Abdallah',
    rating: 5,
  },
  {
    quote:
      'A must visit new place! My son went there last night and brought home some of their products. Everything was fresh, delicious, and packaged really well.',
    author: 'Emad Sabbah',
    rating: 5,
  },
  {
    quote:
      'Really gorgeous interior! The guy working there was really nice and helpful! We got to try their Turkish coffee and it tasted really good! Would definitely recommend swinging by for unique candies and chocolates for party favors, events, and a nice treat!',
    author: 'Julie Cao',
    rating: 5,
  },
  {
    quote:
      'This place has a little bit of everything. Great coffee, tons of sweet treats, pastries, and snacks, plus really friendly service. You can tell they put a lot of thought into what they offer.',
    author: 'Natalie Yousif',
    rating: 5,
  },
  {
    quote:
      'This place brought something that was needed in Georgia. This place is very unique and brings a lot of nostalgia. Everything tasted amazing, and prices were very fair.',
    author: 'Khalid Mustafa',
    rating: 5,
  },
  {
    quote:
      'Awesome new business with unique Turkish / Jordanian candies and other sweets. Amazing nuts collection and great coffee beans. So glad we have a spot like this in Gwinnett.',
    author: 'Nick Preston',
    rating: 5,
  },
  {
    quote:
      'Absolutely amazing roasted nuts and coffee! Everything tastes fresh, high quality, and full of flavor. The staff are super friendly and the place smells incredible the moment you walk in.',
    author: 'Sulaiman Alhomsi',
    rating: 5,
  },
  {
    quote:
      '10000/10. They have a great selection of halal gummies, chocolates, and sweets. The gummies are so good and taste just like the ones in the Middle East.',
    author: 'Almaas',
    rating: 5,
  },
  {
    quote:
      'Very unique and beautiful store. Definitely stop by for a cool new experience and try something. We grabbed some halal candy and chocolate, pretty good.',
    author: 'Mindy Su',
    rating: 5,
  },
  {
    quote:
      'Amazing experience!! Very welcoming owners and staff gave us free coffee as soon as we walked in!!',
    author: 'Hazim Mallak',
    rating: 5,
  },
  {
    quote:
      'Aroma has a beautiful assortment of chocolates and nuts, and delicious coffee!!',
    author: 'Serene Hawasli',
    rating: 5,
  },
  {
    quote:
      'Walking in the store brings me to a ease of mind, new and familiar feelings. I felt welcomed and I will surely come back here. Highly recommended.',
    author: 'Adrian Villalon',
    rating: 5,
  },
]

/* --------------------------------- FAQ ---------------------------------- */

export const faqs = [
  {
    q: 'How fresh are the roasted nuts and seeds?',
    a: 'We roast and season nuts and seeds in-house in small batches every week, so what ships to you was on the roaster days ago, not months. Coffee is ground to order.',
  },
  {
    q: 'How does buying by weight work?',
    a: 'Most roasted items are sold by weight. Pick a size on the product page (quarter pound, half pound, or pound) and the price updates. If you want a custom amount or a mixed selection, message us before ordering.',
  },
  {
    q: 'Do you ship outside the United States?',
    a: `Yes. We currently ship to ${site.shipsTo.length} countries including Canada, the UK, Australia and the UAE. Duties and customs fees for international orders are the responsibility of the recipient.`,
  },
  {
    q: 'Are your products halal?',
    a: 'A large part of our range, including nuts, seeds, spices, coffee, and most imported sweets, is halal-suitable. Because sourcing varies by brand for candies and gummies, message us about a specific item and we will confirm before you order.',
  },
  {
    q: 'Can you build a custom tray or gift box?',
    a: 'Absolutely. Trays for Eid, weddings, graduations and corporate gifts are our favorite thing to make. Send us your budget and the occasion through the contact page and we will put something together.',
  },
  {
    q: 'Do you offer wholesale?',
    a: 'We supply cafés, restaurants and markets with roasted nuts, spices and coffee. Reach out through the contact page with your quantities and we will send wholesale pricing.',
  },
]
