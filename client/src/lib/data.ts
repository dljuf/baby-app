// TinyTasteSteps - Sample Data
// Design: Scandinavian Warmth - Terracotta, Sage, Butter palette
// This file contains placeholder recipe data that will be replaced with real content later

export interface Recipe {
  id: string;
  name: string;
  ageRange: string;
  ageMin: number;
  category: Category;
  foodType: FoodType;
  description: string;
  ingredients: string[];
  preparation: string;
  note?: string;
  image: string;
  isFavorite?: boolean;
}

export type Category = 'dorucak' | 'rucak' | 'vecera';
export type FoodType = 'vocne' | 'povrtne' | 'zitarice' | 'mesne';
export type AgeFilter = '6-8' | '8-10' | '10-12' | 'all';

export interface Tip {
  id: string;
  title: string;
  content: string;
  color: 'terracotta' | 'sage' | 'butter' | 'warm';
}

export const categories = [
  { id: 'all', label: 'Svi recepti', icon: '🍽️' },
  { id: 'dorucak', label: 'Doručak', icon: '🌅' },
  { id: 'rucak', label: 'Ručak', icon: '☀️' },
  { id: 'vecera', label: 'Večera', icon: '🌙' },
  { id: 'vocne', label: 'Voćne', icon: '🍎' },
  { id: 'povrtne', label: 'Povrtne', icon: '🥕' },
] as const;

export const ageFilters: { id: AgeFilter; label: string }[] = [
  { id: '6-8', label: '6-8 mjeseci' },
  { id: '8-10', label: '8-10 mjeseci' },
  { id: '10-12', label: '10-12 mjeseci' },
];

export const ageStages = [
  { id: '6-8', label: '6-8 mj', emoji: '👶', color: 'bg-terracotta-light' },
  { id: '8-10', label: '8-10 mj', emoji: '🧒', color: 'bg-sage-light' },
  { id: '10-12', label: '10-12 mj', emoji: '👧', color: 'bg-butter' },
  { id: 'all', label: 'Svi', emoji: '⭐', color: 'bg-primary/20' },
];

// Placeholder recipes - to be replaced with real content
export const sampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Kaša od jabuke i kruške 6+',
    ageRange: '6-8',
    ageMin: 6,
    category: 'dorucak',
    foodType: 'vocne',
    description: 'Nježna voćna kaša savršena za prve zalogaje vaše bebe. Kombinacija slatke jabuke i sočne kruške pruža blag i prirodno sladak ukus.',
    ingredients: ['1 jabuka', '1 kruška', '2 kašike vode'],
    preparation: 'Ogulite i narežite jabuku i krušku na kockice. Kuhajte na laganoj vatri sa vodom dok voće ne omekša (oko 10 minuta). Izblendajte do glatke teksture.',
    note: 'Možete dodati malo cimeta za starije bebe (8+ mjeseci).',
    image: 'https://images.unsplash.com/photo-1568909344668-6f14a07b56a0?w=400&h=400&fit=crop',
  },
  {
    id: '2',
    name: 'Pire od bundeve i mrkve 6+',
    ageRange: '6-8',
    ageMin: 6,
    category: 'rucak',
    foodType: 'povrtne',
    description: 'Kremasti pire bogat beta-karotenom, idealan za jačanje imuniteta vaše bebe.',
    ingredients: ['100g bundeve', '1 mrkva', '1 kašika maslinovog ulja'],
    preparation: 'Ogulite i narežite bundevu i mrkvu. Kuhajte na pari 15 minuta. Izblendajte sa maslinovim uljem do željene gustoće.',
    note: 'Bundeva je odličan izvor vitamina A.',
    image: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=400&h=400&fit=crop',
  },
  {
    id: '3',
    name: 'Zobena kaša sa bananom 7+',
    ageRange: '6-8',
    ageMin: 7,
    category: 'dorucak',
    foodType: 'zitarice',
    description: 'Hranjiva zobena kaša obogaćena prirodnom slatkoćom banane.',
    ingredients: ['3 kašike zobenih pahuljica', '1/2 banane', '150ml vode ili mlijeka'],
    preparation: 'Skuhajte zobene pahuljice u vodi ili mlijeku. Izgnječite bananu i umiješajte u kašu. Ostavite da se malo ohladi.',
    image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=400&h=400&fit=crop',
  },
  {
    id: '4',
    name: 'Pire od graška i krompira 8+',
    ageRange: '8-10',
    ageMin: 8,
    category: 'rucak',
    foodType: 'povrtne',
    description: 'Bogat izvor proteina i vlakana, savršen za rastući organizam.',
    ingredients: ['100g graška', '1 manji krompir', '1 kašika maslaca'],
    preparation: 'Skuhajte krompir i grašak dok ne omekšaju. Ocijedite i izblendajte sa maslacem do glatke teksture.',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop',
  },
  {
    id: '5',
    name: 'Piletina sa povrćem 9+',
    ageRange: '8-10',
    ageMin: 9,
    category: 'vecera',
    foodType: 'mesne',
    description: 'Kompletni obrok sa proteinima i vitaminima za aktivne bebe.',
    ingredients: ['50g pilećih prsa', '1 mrkva', '1 mali krompir', 'Malo peršuna'],
    preparation: 'Skuhajte piletinu i povrće zajedno u malo vode. Izblendajte do željene teksture. Dodajte malo peršuna.',
    note: 'Piletina je odličan izvor proteina za bebe.',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=400&fit=crop',
  },
  {
    id: '6',
    name: 'Palačinke od banane 10+',
    ageRange: '10-12',
    ageMin: 10,
    category: 'dorucak',
    foodType: 'vocne',
    description: 'Meke palačinke bez šećera, savršene za male prstiće.',
    ingredients: ['1 banana', '1 jaje', '3 kašike brašna', 'Malo ulja za pečenje'],
    preparation: 'Izgnječite bananu, dodajte jaje i brašno. Miješajte dok ne dobijete glatko tijesto. Pecite male palačinke na ulju.',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=400&fit=crop',
  },
  {
    id: '7',
    name: 'Rižoto sa tikvicama 10+',
    ageRange: '10-12',
    ageMin: 10,
    category: 'rucak',
    foodType: 'povrtne',
    description: 'Kremasti rižoto sa svježim tikvicama, bogat teksturama za starije bebe.',
    ingredients: ['50g riže', '1 mala tikvica', '1 kašika maslinovog ulja', 'Malo parmezana'],
    preparation: 'Kuhajte rižu prema uputstvu. Naribajte tikvicu i propržite na ulju. Umiješajte u rižu sa malo parmezana.',
    image: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=400&fit=crop',
  },
  {
    id: '8',
    name: 'Voćni smoothie 11+',
    ageRange: '10-12',
    ageMin: 11,
    category: 'dorucak',
    foodType: 'vocne',
    description: 'Osvježavajući voćni napitak pun vitamina za energičan dan.',
    ingredients: ['1/2 banane', 'Šaka jagoda', '100ml jogurta', 'Malo meda'],
    preparation: 'Stavite sve sastojke u blender i miksajte dok ne dobijete glatku smjesu. Poslužite odmah.',
    note: 'Med koristite samo za bebe starije od 12 mjeseci.',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&h=400&fit=crop',
  },
];

export const tips: Tip[] = [
  {
    id: '1',
    title: 'Dob bebe: 6-8 mjeseci',
    content: 'Počnite sa jednostavnim pireima od jednog sastojka. Uvodite novo povrće i voće postepeno, čekajući 3-5 dana između novih namirnica kako biste pratili moguće alergijske reakcije.',
    color: 'sage',
  },
  {
    id: '2',
    title: 'Dob bebe: 8-10 mjeseci',
    content: 'Nastaviti dojenje ili hranjenje mlijekom za dojenčad. Uvoditi mekše teksture hrane (pire, pasirano). Uvoditi meso (piletina, puretina, teletina) i mahunarke (grašak, bob, leća).',
    color: 'terracotta',
  },
  {
    id: '3',
    title: 'Dob bebe: 10-12 mjeseci',
    content: 'Nastaviti s raznolikijom prehranom, uključujući voće, povrće, meso, mahunarke, žitarice. Može se uvoditi jaje (početi s žumanjkom). Može se uvoditi riba (pažljivo pratiti reakciju bebe).',
    color: 'butter',
  },
  {
    id: '4',
    title: 'Hranite bebu sjedeći',
    content: 'Osigurajte da beba sjedi uspravno dok jede kako bi se izbjegle gušenje i druge komplikacije. Koristite posebne stolice za hranjenje koje podržavaju bebinu kičmu.',
    color: 'warm',
  },
  {
    id: '5',
    title: 'Prilagođavanje teksture',
    content: 'Kako vaša beba raste, postepeno povećavajte teksturu hrane kako biste potakli žvakanje i razvoj. Od glatkih pirea prelazite na grubo pasirano, pa na mekane komade.',
    color: 'sage',
  },
  {
    id: '6',
    title: 'Sezonske raznolikosti',
    content: 'Izaberite voće i povrće koje je u sezoni kako biste dobili maksimalnu svježinu i ukus. Sezonska hrana je bogatija nutrijentima i povoljnija za budžet.',
    color: 'terracotta',
  },
  {
    id: '7',
    title: 'Hidratacija je važna',
    content: 'Nudite bebi vodu između obroka, posebno u toplijim mjesecima. Koristite malu šolju umjesto bočice kako biste poticali razvoj motorike.',
    color: 'butter',
  },
];

// Category images mapping
export const categoryImages: Record<string, string> = {
  all: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663282475495/kCoWuRFEGw8ixCjsQeNy2z/hero-banner_c71febb2.jpg',
  dorucak: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663282475495/kCoWuRFEGw8ixCjsQeNy2z/category-breakfast_bbf46261.jpg',
  rucak: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663282475495/kCoWuRFEGw8ixCjsQeNy2z/category-lunch_d0b6572b.jpg',
  vecera: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663282475495/kCoWuRFEGw8ixCjsQeNy2z/category-dinner_579702f2.jpg',
  vocne: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663282475495/kCoWuRFEGw8ixCjsQeNy2z/category-fruit_83d3b467.jpg',
  povrtne: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663282475495/kCoWuRFEGw8ixCjsQeNy2z/category-lunch_d0b6572b.jpg',
};

export const heroBannerUrl = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663282475495/kCoWuRFEGw8ixCjsQeNy2z/hero-banner_c71febb2.jpg';
