// ─────────────────────────────────────────────────────────────────
// Janmotri Oil Admin — Customers Module Data
// ─────────────────────────────────────────────────────────────────

export const CUSTOMER_STATUSES = ["All Customers", "Active Customers", "Pay Later Customers", "Customer Orders"];

export const initialCustomers = [
  {
    id: "CUST-4001",
    name: "Ramesh Patel",
    mobile: "+91 98250 12345",
    email: "ramesh.patel@gmail.com",
    totalOrders: 14,
    totalSpending: 28420,
    status: "Active",
    createdDate: "2025-10-12",
    address: {
      street: "A-402 Radhe Residency, near Kalavad Road",
      villageTaluka: "Mavdi",
      city: "Rajkot",
      state: "Gujarat",
      pinCode: "360005"
    },
    payLaterActive: true,
    payLaterLimit: 30000,
    payLaterBalance: 3176,
    orders: [
      { id: "JMT-ORD-8801", date: "2026-06-11", amount: 3176, status: "Pending", payment: "Pending" },
      { id: "JMT-ORD-8750", date: "2026-05-18", amount: 1850, status: "Delivered", payment: "Paid" },
      { id: "JMT-ORD-8699", date: "2026-04-02", amount: 5500, status: "Delivered", payment: "Paid" }
    ]
  },
  {
    id: "CUST-4002",
    name: "Suresh Bhai Shah",
    mobile: "+91 94262 98765",
    email: "suresh.shah@yahoo.com",
    totalOrders: 22,
    totalSpending: 89450,
    status: "Active",
    createdDate: "2025-08-04",
    address: {
      street: "Plot No. 12, GIDC Sector-4",
      villageTaluka: "Naroda",
      city: "Ahmedabad",
      state: "Gujarat",
      pinCode: "382430"
    },
    payLaterActive: true,
    payLaterLimit: 50000,
    payLaterBalance: 14612.5,
    orders: [
      { id: "JMT-ORD-8802", date: "2026-06-10", amount: 14612.5, status: "Processing", payment: "Paid" },
      { id: "JMT-ORD-8710", date: "2026-05-02", amount: 28500, status: "Delivered", payment: "Paid" }
    ]
  },
  {
    id: "CUST-4003",
    name: "Amit Patel",
    mobile: "+91 99099 22334",
    email: "amit.patel@rediffmail.com",
    totalOrders: 6,
    totalSpending: 12400,
    status: "Active",
    createdDate: "2026-01-15",
    address: {
      street: "Flat 101, Shanti Niketan Height, Adajan Road",
      villageTaluka: "Adajan",
      city: "Surat",
      state: "Gujarat",
      pinCode: "395009"
    },
    payLaterActive: false,
    payLaterLimit: 0,
    payLaterBalance: 0,
    orders: [
      { id: "JMT-ORD-8803", date: "2026-06-09", amount: 3473, status: "Shipped", payment: "Paid" }
    ]
  },
  {
    id: "CUST-4004",
    name: "Meena Joshi",
    mobile: "+91 97123 44556",
    email: "meena.joshi@gmail.com",
    totalOrders: 3,
    totalSpending: 4320,
    status: "Active",
    createdDate: "2026-03-20",
    address: {
      street: "Near Hanuman Mandir, Nana Mava Road",
      villageTaluka: "Nana Mava",
      city: "Rajkot",
      state: "Gujarat",
      pinCode: "360004"
    },
    payLaterActive: false,
    payLaterLimit: 0,
    payLaterBalance: 0,
    orders: [
      { id: "JMT-ORD-8804", date: "2026-06-08", amount: 1942.5, status: "Delivered", payment: "Paid" }
    ]
  },
  {
    id: "CUST-4005",
    name: "Vijay Gondalia",
    mobile: "+91 98795 33221",
    email: "vijay.gondalia@outlook.com",
    totalOrders: 8,
    totalSpending: 16800,
    status: "Suspended",
    createdDate: "2025-11-02",
    address: {
      street: "Shyam Vihar 3, block F, Waghodia Road",
      villageTaluka: "Waghodia",
      city: "Vadodara",
      state: "Gujarat",
      pinCode: "390019"
    },
    payLaterActive: false,
    payLaterLimit: 10000,
    payLaterBalance: 0,
    orders: [
      { id: "JMT-ORD-8805", date: "2026-06-07", amount: 3200, status: "Cancelled", payment: "Refunded" }
    ]
  },
  {
    id: "CUST-4006",
    name: "Dwarkadhish Agro",
    mobile: "+91 94090 99887",
    email: "info@dwarkadhish.in",
    totalOrders: 41,
    totalSpending: 243900,
    status: "Active",
    createdDate: "2025-05-10",
    address: {
      street: "GIDC Yard, Cabin No. 5",
      villageTaluka: "Gondal GIDC",
      city: "Gondal",
      state: "Gujarat",
      pinCode: "360311"
    },
    payLaterActive: true,
    payLaterLimit: 150000,
    payLaterBalance: 32000,
    orders: [
      { id: "JMT-ORD-8798", date: "2026-06-05", amount: 32000, status: "Delivered", payment: "Pending" }
    ]
  },
  {
    id: "CUST-4007",
    name: "Shreeji Distributors",
    mobile: "+91 90999 55667",
    email: "contact@shreejidist.com",
    totalOrders: 33,
    totalSpending: 185000,
    status: "Active",
    createdDate: "2025-07-22",
    address: {
      street: "Row House 3, Gokul Dham Colony",
      villageTaluka: "Akwada",
      city: "Bhavnagar",
      state: "Gujarat",
      pinCode: "364002"
    },
    payLaterActive: true,
    payLaterLimit: 100000,
    payLaterBalance: 28925,
    orders: [
      { id: "JMT-ORD-8785", date: "2026-06-08", amount: 28925, status: "Delivered", payment: "Pending" }
    ]
  }
];
