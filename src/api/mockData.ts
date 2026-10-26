import { Temple, Offering, Order } from '../types';

export const INITIAL_TEMPLES: Temple[] = [
  {
    id: 'sabarimala',
    name: 'Sabarimala Sree Dharma Sastha Temple',
    location: 'Pathanamthitta, Kerala',
    deity: 'Lord Ayyappa',
  },
  {
    id: 'ambalappuzha',
    name: 'Ambalappuzha Sree Krishna Swamy Temple',
    location: 'Alappuzha, Kerala',
    deity: 'Lord Krishna',
  },
  {
    id: 'ettumanoor',
    name: 'Ettumanoor Mahadeva Temple',
    location: 'Kottayam, Kerala',
    deity: 'Lord Shiva',
  },
];

export const INITIAL_OFFERINGS: Offering[] = [
  // Sabarimala
  {
    id: 'sab-1',
    templeId: 'sabarimala',
    name: 'Pushpanjali',
    price: 30,
    active: true,
    description: 'Floral offering with sacred Vedic mantras for general well-being and prosperity.',
  },
  {
    id: 'sab-2',
    templeId: 'sabarimala',
    name: 'Archana',
    price: 50,
    active: true,
    description: 'Chanting of holy names in the devotee’s name and birth star.',
  },
  {
    id: 'sab-3',
    templeId: 'sabarimala',
    name: 'Neyyabhishekam',
    price: 150,
    active: true,
    description: 'Sacred ghee bathing ritual offering dedicated to Lord Ayyappa.',
  },
  {
    id: 'sab-4',
    templeId: 'sabarimala',
    name: 'Aravana Payasam',
    price: 100,
    active: true,
    description: 'Traditional sanctified offering made of jaggery, red rice, and ghee.',
  },
  {
    id: 'sab-5',
    templeId: 'sabarimala',
    name: 'Appam Prasadam',
    price: 60,
    active: true,
    description: 'Crisp, sweet prasadam prepared with rice flour and jaggery.',
  },
  {
    id: 'sab-6',
    templeId: 'sabarimala',
    name: 'Ganapathi Homam',
    price: 250,
    active: true,
    description: 'Morning fire oblation to Lord Ganesha for overcoming all obstacles.',
  },
  {
    id: 'sab-7',
    templeId: 'sabarimala',
    name: 'Bhagya Sooktha Pushpanjali',
    price: 75,
    active: true,
    description: 'Recitation of auspicious Vedic hymns for good fortune.',
  },
  {
    id: 'sab-8',
    templeId: 'sabarimala',
    name: 'Ashtothara Archana',
    price: 80,
    active: true,
    description: 'Recitation of 108 auspicious names with bilva and lotus flowers.',
  },
  {
    id: 'sab-9',
    templeId: 'sabarimala',
    name: 'Udayasthamana Pooja',
    price: 5000,
    active: false, // Inactive offering to test filter
    description: 'Full-day pooja from sunrise to sunset (Advanced temple booking only).',
  },
  {
    id: 'sab-10',
    templeId: 'sabarimala',
    name: 'Kalasabhishekam (Seasonal)',
    price: 1200,
    active: false, // Inactive offering
    description: 'Special seasonal pot consecration ceremony.',
  },

  // Ambalappuzha
  {
    id: 'amb-1',
    templeId: 'ambalappuzha',
    name: 'Pushpanjali',
    price: 30,
    active: true,
    description: 'Devotional floral prayer offering to Parthasarathy.',
  },
  {
    id: 'amb-2',
    templeId: 'ambalappuzha',
    name: 'Archana',
    price: 50,
    active: true,
    description: 'Traditional archana with tulsi and flowers.',
  },
  {
    id: 'amb-3',
    templeId: 'ambalappuzha',
    name: 'Ambalappuzha Paalpayasam',
    price: 120,
    active: true,
    description: 'World-renowned sacred sweet milk porridge offering prepared with cow milk and sugar.',
  },
  {
    id: 'amb-4',
    templeId: 'ambalappuzha',
    name: 'Venna Charthu (Butter Decoration)',
    price: 200,
    active: true,
    description: 'Adorning the deity with consecrated fresh butter.',
  },
  {
    id: 'amb-5',
    templeId: 'ambalappuzha',
    name: 'Santhana Gopala Pooja',
    price: 350,
    active: true,
    description: 'Special prayer for children’s health and prospective parents.',
  },
  {
    id: 'amb-6',
    templeId: 'ambalappuzha',
    name: 'Bhagavatha Parayanam',
    price: 500,
    active: true,
    description: 'Devout recitation of Srimad Bhagavatam passages.',
  },
  {
    id: 'amb-7',
    templeId: 'ambalappuzha',
    name: 'Thrikayil Venta',
    price: 40,
    active: true,
    description: 'Butter offering placed directly on the deity’s holy palm.',
  },
  {
    id: 'amb-8',
    templeId: 'ambalappuzha',
    name: 'Vilakku Pooja',
    price: 150,
    active: true,
    description: 'Evening oil lamp illumination ceremony.',
  },
  {
    id: 'amb-9',
    templeId: 'ambalappuzha',
    name: 'Aayilyam Oottu (Annual)',
    price: 1000,
    active: false, // Inactive
    description: 'Annual feast offering available only during festival days.',
  },

  // Ettumanoor
  {
    id: 'ett-1',
    templeId: 'ettumanoor',
    name: 'Pushpanjali',
    price: 30,
    active: true,
    description: 'Lord Shiva pushpanjali using bilva leaves.',
  },
  {
    id: 'ett-2',
    templeId: 'ettumanoor',
    name: 'Archana',
    price: 50,
    active: true,
    description: 'Maha Rudra archana for health and peace of mind.',
  },
  {
    id: 'ett-3',
    templeId: 'ettumanoor',
    name: 'Dhara (Jaladhara)',
    price: 100,
    active: true,
    description: 'Continuous holy water pouring on the Shiva Lingam.',
  },
  {
    id: 'ett-4',
    templeId: 'ettumanoor',
    name: 'Mrithyunjaya Homam',
    price: 450,
    active: true,
    description: 'Sacred rite invoking Lord Shiva for longevity and relief from ailments.',
  },
  {
    id: 'ett-5',
    templeId: 'ettumanoor',
    name: 'Thulabharam',
    price: 300,
    active: true,
    description: 'Offering items weighing equal to the devotee.',
  },
  {
    id: 'ett-6',
    templeId: 'ettumanoor',
    name: 'Ksheeradhara (Milk Abhishekam)',
    price: 180,
    active: true,
    description: 'Pouring fresh cow milk over Shiva Lingam.',
  },
  {
    id: 'ett-7',
    templeId: 'ettumanoor',
    name: 'Vilwa Mala',
    price: 70,
    active: true,
    description: 'Garland made of sacred fresh Bilva leaves.',
  },
  {
    id: 'ett-8',
    templeId: 'ettumanoor',
    name: 'Shodasa Dravya Abhishekam',
    price: 2500,
    active: false, // Inactive
    description: 'Elaborate 16-sacred-ingredient abhishekam (special booking only).',
  },
];

// Helper to generate 50 seed orders
const DEVOTEES = [
  { name: 'Manoj Ramakrishnan', phone: '9847012345', star: 'Rohini' },
  { name: 'Ananya Pillai', phone: '9847023456', star: 'Thiruvathira (Ardra)' },
  { name: 'Gopika Namboothiri', phone: '9447034567', star: 'Aswathy (Ashwini)' },
  { name: 'Siddharth Menon', phone: '9895045678', star: 'Karthika (Krittika)' },
  { name: 'Lakshmi Nair', phone: '9744056789', star: 'Makayiram (Mrigashira)' },
  { name: 'Arjun Varma', phone: '9496067890', star: 'Punartham (Punarvasu)' },
  { name: 'Radhika Kartha', phone: '9446078901', star: 'Pooyam (Pushya)' },
  { name: 'Vishnu Das', phone: '9846089012', star: 'Ayilyam (Ashlesha)' },
  { name: 'Deepa Kurup', phone: '9745090123', star: 'Makam (Magha)' },
  { name: 'Sreekanth Panicker', phone: '9895101234', star: 'Pooram (Purva Phalguni)' },
  { name: 'Meera Unnithan', phone: '9447112345', star: 'Uthram (Uttara Phalguni)' },
  { name: 'Hari Govind', phone: '9847123456', star: 'Atham (Hasta)' },
  { name: 'Aparna Warrier', phone: '9496134567', star: 'Chithira (Chitra)' },
  { name: 'Karthik S', phone: '9744145678', star: 'Chothi (Swati)' },
  { name: 'Parvathy Raj', phone: '9895156789', star: 'Vishakham (Vishakha)' },
];

function generateSeedOrders(): Order[] {
  const orders: Order[] = [];
  const temples = INITIAL_TEMPLES;
  const activeOfferings = INITIAL_OFFERINGS.filter(o => o.active);

  // Generate 50 realistic orders over the last 15 days and next 15 days
  const baseDate = new Date('2026-10-26T10:00:00Z');

  for (let i = 1; i <= 50; i++) {
    const devotee = DEVOTEES[(i - 1) % DEVOTEES.length];
    const temple = temples[(i - 1) % temples.length];
    const templeOfferings = activeOfferings.filter(o => o.templeId === temple.id);

    // Pick 1 to 3 items
    const numItems = (i % 3) + 1;
    const items = [];
    let total = 0;

    for (let j = 0; j < numItems; j++) {
      const offering = templeOfferings[(i + j) % templeOfferings.length];
      const qty = ((i + j) % 2) + 1;
      items.push({
        offeringId: offering.id,
        offeringName: offering.name,
        price: offering.price,
        quantity: qty,
      });
      total += offering.price * qty;
    }

    // Offset days: -10 days to +15 days
    const dayOffset = (i % 25) - 10;
    const orderDate = new Date(baseDate);
    orderDate.setDate(orderDate.getDate() + dayOffset);
    const dateStr = orderDate.toISOString().split('T')[0];

    // Status: ~10% cancelled
    const isCancelled = i % 8 === 0;

    orders.push({
      id: `order-${1000 + i}`,
      orderNumber: `TDB-2026-${(1000 + i).toString()}`,
      templeId: temple.id,
      templeName: temple.name,
      devoteeName: devotee.name,
      phoneNumber: devotee.phone,
      nakshatra: devotee.star,
      date: dateStr,
      items,
      totalAmount: total,
      status: isCancelled ? 'CANCELLED' : 'CONFIRMED',
      createdAt: new Date(baseDate.getTime() - (50 - i) * 3600000 * 6).toISOString(),
    });
  }

  return orders;
}

export const INITIAL_ORDERS: Order[] = generateSeedOrders();
