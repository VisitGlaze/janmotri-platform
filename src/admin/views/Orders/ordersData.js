// ─────────────────────────────────────────────────────────────────
// Janmotri Oil Admin — Orders Module Data
// ─────────────────────────────────────────────────────────────────

export const ORDER_STATUSES = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"];

export const initialOrders = [
  {
    id: "JMT-ORD-8801",
    date: "2026-06-11",
    time: "10:15 AM",
    status: "Pending",
    paymentStatus: "Pending",
    paymentMethod: "UPI",
    transactionId: "TXN983274612984",
    customer: {
      name: "Ramesh Patel",
      mobile: "+91 98250 12345",
      email: "ramesh.patel@gmail.com",
      status: "Active"
    },
    shippingAddress: {
      street: "A-402 Radhe Residency, near Kalavad Road",
      villageTaluka: "Mavdi",
      city: "Rajkot",
      state: "Gujarat",
      pinCode: "360005"
    },
    items: [
      { id: "p1", name: "Groundnut Oil 15L", sku: "JMT-GNO-15L", price: 3300, qty: 1, batchNo: "B-2026-05-30", mfgDate: "2026-05-30", expDate: "2027-05-29" },
      { id: "p2", name: "Groundnut Oil 1L", sku: "JMT-GNO-1L", price: 240, qty: 2, batchNo: "B-2026-06-01", mfgDate: "2026-06-01", expDate: "2027-05-31" }
    ],
    timeline: [
      { status: "Placed", title: "Order Placed", time: "2026-06-11 10:15 AM", desc: "Order successfully submitted by customer via WebApp." },
      { status: "Pending", title: "Awaiting Verification", time: "2026-06-11 10:18 AM", desc: "Payment check initiated for UPI Transaction ID." }
    ],
    totals: {
      subtotal: 3780,
      gst: 189,
      delivery: 0,
      discount: 100,
      grandTotal: 3869
    }
  },
  {
    id: "JMT-ORD-8802",
    date: "2026-06-10",
    time: "03:45 PM",
    status: "Processing",
    paymentStatus: "Paid",
    paymentMethod: "Pay Later",
    transactionId: "PL-CRED-7703",
    customer: {
      name: "Suresh Bhai Shah",
      mobile: "+91 94262 98765",
      email: "suresh.shah@yahoo.com",
      status: "Active"
    },
    shippingAddress: {
      street: "Plot No. 12, GIDC Sector-4",
      villageTaluka: "Naroda",
      city: "Ahmedabad",
      state: "Gujarat",
      pinCode: "382430"
    },
    items: [
      { id: "p3", name: "Groundnut Oil 15kg Tin", sku: "JMT-GNO-15K", price: 3300, qty: 5, batchNo: "B-2026-06-05", mfgDate: "2026-06-05", expDate: "2027-06-04" }
    ],
    timeline: [
      { status: "Placed", title: "Order Placed", time: "2026-06-10 03:45 PM", desc: "Order submitted using Pay Later credit agreement." },
      { status: "Pending", title: "Credit Checked & Approved", time: "2026-06-10 04:00 PM", desc: "Admin verified ledger and approved transaction line." },
      { status: "Processing", title: "Sent to Warehouse", time: "2026-06-11 08:30 AM", desc: "Allocated to Ahmedabad Hub warehouse for packaging." }
    ],
    totals: {
      subtotal: 16500,
      gst: 825,
      delivery: 150,
      discount: 500,
      grandTotal: 16975
    }
  },
  {
    id: "JMT-ORD-8803",
    date: "2026-06-09",
    time: "11:20 AM",
    status: "Shipped",
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    transactionId: "TXN773291244012",
    customer: {
      name: "Amit Patel",
      mobile: "+91 99099 22334",
      email: "amit.patel@rediffmail.com",
      status: "Active"
    },
    shippingAddress: {
      street: "Flat 101, Shanti Niketan Height, Adajan Road",
      villageTaluka: "Adajan",
      city: "Surat",
      state: "Gujarat",
      pinCode: "395009"
    },
    items: [
      { id: "p4", name: "Groundnut Oil 5L", sku: "JMT-GNO-5L", price: 1100, qty: 3, batchNo: "B-2026-06-02", mfgDate: "2026-06-02", expDate: "2027-06-01" },
      { id: "p5", name: "Groundnut Oil Special Pack", sku: "JMT-GNO-SP", price: 550, qty: 1, batchNo: "B-2026-06-06", mfgDate: "2026-06-06", expDate: "2027-06-05" }
    ],
    timeline: [
      { status: "Placed", title: "Order Placed", time: "2026-06-09 11:20 AM", desc: "Submitted by client." },
      { status: "Pending", title: "Payment Verified", time: "2026-06-09 11:35 AM", desc: "UPI merchant account confirmed receipt of ₹3800." },
      { status: "Processing", title: "Packaging Completed", time: "2026-06-09 04:30 PM", desc: "Packed into corrugated boxes at Surat Depot." },
      { status: "Shipped", title: "Dispatched via Ekart", time: "2026-06-10 10:00 AM", desc: "Tracking number: EKT-983172834. Courier transit active." }
    ],
    totals: {
      subtotal: 3850,
      gst: 192.5,
      delivery: 120,
      discount: 28,
      grandTotal: 4134.5
    }
  },
  {
    id: "JMT-ORD-8804",
    date: "2026-06-08",
    time: "01:10 PM",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "COD",
    transactionId: "COD-CASH-8834",
    customer: {
      name: "Meena Joshi",
      mobile: "+91 97123 44556",
      email: "meena.joshi@gmail.com",
      status: "Active"
    },
    shippingAddress: {
      street: "Near Hanuman Mandir, Nana Mava Road",
      villageTaluka: "Nana Mava",
      city: "Rajkot",
      state: "Gujarat",
      pinCode: "360004"
    },
    items: [
      { id: "p1", name: "Groundnut Oil 1L", sku: "JMT-GNO-1L", price: 240, qty: 10, batchNo: "B-2026-06-01", mfgDate: "2026-06-01", expDate: "2027-05-31" }
    ],
    timeline: [
      { status: "Placed", title: "Order Placed", time: "2026-06-08 01:10 PM", desc: "Submitted by client via COD mode." },
      { status: "Pending", title: "Confirmed by Phone call", time: "2026-06-08 02:15 PM", desc: "Agent verified location and delivery slot." },
      { status: "Processing", title: "Packed & Ready", time: "2026-06-08 05:00 PM", desc: "Boxed and tagged at Rajkot Warehouse." },
      { status: "Shipped", title: "Out for Delivery", time: "2026-06-09 09:00 AM", desc: "Assigned to delivery agent Ravi Kumar." },
      { status: "Delivered", title: "Delivered Successfully", time: "2026-06-09 02:45 PM", desc: "Cash collected at doorstep. Order finalized." }
    ],
    totals: {
      subtotal: 2400,
      gst: 120,
      delivery: 50,
      discount: 0,
      grandTotal: 2570
    }
  },
  {
    id: "JMT-ORD-8805",
    date: "2026-06-07",
    time: "09:00 AM",
    status: "Cancelled",
    paymentStatus: "Refunded",
    paymentMethod: "UPI",
    transactionId: "TXN773281098412",
    customer: {
      name: "Vijay Gondalia",
      mobile: "+91 98795 33221",
      email: "vijay.gondalia@outlook.com",
      status: "Active"
    },
    shippingAddress: {
      street: "Shyam Vihar 3, block F, Waghodia Road",
      villageTaluka: "Waghodia",
      city: "Vadodara",
      state: "Gujarat",
      pinCode: "390019"
    },
    items: [
      { id: "p6", name: "Groundnut Oil Special Pack", sku: "JMT-GNO-SP", price: 550, qty: 2, batchNo: "B-2026-06-06", mfgDate: "2026-06-06", expDate: "2027-06-05" }
    ],
    timeline: [
      { status: "Placed", title: "Order Placed", time: "2026-06-07 09:00 AM", desc: "Client paid ₹1200 via UPI." },
      { status: "Pending", title: "Payment Verified", time: "2026-06-07 09:12 AM", desc: "Merchant bank confirmed." },
      { status: "Cancelled", title: "Cancelled by Client", time: "2026-06-07 11:30 AM", desc: "Reason: Accidental order placement. Customer requested refund." },
      { status: "Refunded", title: "Refund Initiated & Paid", time: "2026-06-08 10:15 AM", desc: "Refunded ₹1200 back to UPI ID. UTR: REF-983192083" }
    ],
    totals: {
      subtotal: 1100,
      gst: 55,
      delivery: 82,
      discount: 200,
      grandTotal: 1037
    }
  },
  {
    id: "JMT-ORD-8806",
    date: "2026-06-11",
    time: "11:00 AM",
    status: "Pending",
    paymentStatus: "Unpaid",
    paymentMethod: "COD",
    transactionId: "N/A",
    customer: {
      name: "Tushar Trivedi",
      mobile: "+91 99241 55667",
      email: "tushart@gmail.com",
      status: "Active"
    },
    shippingAddress: {
      street: "Row House 3, Gokul Dham Colony",
      villageTaluka: "Akwada",
      city: "Bhavnagar",
      state: "Gujarat",
      pinCode: "364002"
    },
    items: [
      { id: "p2", name: "Groundnut Oil 1L", sku: "JMT-GNO-1L", price: 240, qty: 12, batchNo: "B-2026-06-01", mfgDate: "2026-06-01", expDate: "2027-05-31" }
    ],
    timeline: [
      { status: "Placed", title: "Order Placed", time: "2026-06-11 11:00 AM", desc: "COD Order waiting verification." }
    ],
    totals: {
      subtotal: 2880,
      gst: 144,
      delivery: 100,
      discount: 150,
      grandTotal: 2974
    }
  },
  {
    id: "JMT-ORD-8807",
    date: "2026-06-10",
    time: "10:12 AM",
    status: "Processing",
    paymentStatus: "Paid",
    paymentMethod: "UPI",
    transactionId: "TXN983274612441",
    customer: {
      name: "Harish Vasoya",
      mobile: "+91 90990 66778",
      email: "h.vasoya@gmail.com",
      status: "Active"
    },
    shippingAddress: {
      street: "50-Jeevan Prabha, Mavdi Plot",
      villageTaluka: "Mavdi",
      city: "Rajkot",
      state: "Gujarat",
      pinCode: "360004"
    },
    items: [
      { id: "p3", name: "Groundnut Oil 1L", sku: "JMT-GNO-1L", price: 240, qty: 24, batchNo: "B-2026-06-01", mfgDate: "2026-06-01", expDate: "2027-05-31" }
    ],
    timeline: [
      { status: "Placed", title: "Order Placed", time: "2026-06-10 10:12 AM", desc: "Submitted." },
      { status: "Pending", title: "Payment Verified", time: "2026-06-10 10:30 AM", desc: "UPI verified." },
      { status: "Processing", title: "Packing In Progress", time: "2026-06-10 02:00 PM", desc: "Assembling units from Rack A-01 at Rajkot." }
    ],
    totals: {
      subtotal: 5760,
      gst: 288,
      delivery: 0,
      discount: 120,
      grandTotal: 5928
    }
  },
  {
    id: "JMT-ORD-8808",
    date: "2026-06-08",
    time: "02:15 PM",
    status: "Delivered",
    paymentStatus: "Paid",
    paymentMethod: "Pay Later",
    transactionId: "PL-CRED-7701",
    customer: {
      name: "Gopal Krishna Agro",
      mobile: "+91 94084 11223",
      email: "orders@gopalagro.in",
      status: "Active"
    },
    shippingAddress: {
      street: "GIDC Yard, Cabin No. 5",
      villageTaluka: "Gondal GIDC",
      city: "Gondal",
      state: "Gujarat",
      pinCode: "360311"
    },
    items: [
      { id: "p3", name: "Groundnut Oil 15kg Tin", sku: "JMT-GNO-15K", price: 3300, qty: 10, batchNo: "B-2026-03-01", mfgDate: "2026-03-01", expDate: "2027-03-01" }
    ],
    timeline: [
      { status: "Placed", title: "Order Placed", time: "2026-06-08 02:15 PM", desc: "Bulk Order placed via credit line." },
      { status: "Pending", title: "Admin Approved", time: "2026-06-08 03:00 PM", desc: "Checked Gondal warehouse credit availability." },
      { status: "Processing", title: "Ready for Dispatch", time: "2026-06-08 05:00 PM", desc: "10 Tins verified and loaded." },
      { status: "Shipped", title: "Shipped via Private Truck", time: "2026-06-09 08:00 AM", desc: "Dispatched directly." },
      { status: "Delivered", title: "Delivered & Signed", time: "2026-06-09 11:30 AM", desc: "Store invoice signed. 30 days due window active." }
    ],
    totals: {
      subtotal: 33000,
      gst: 1650,
      delivery: 0,
      discount: 1000,
      grandTotal: 33650
    }
  }
];

export const getOrderSummary = (orders) => {
  const total = orders.length;
  const pending = orders.filter((o) => o.status === "Pending").length;
  const processing = orders.filter((o) => o.status === "Processing").length;
  const shipped = orders.filter((o) => o.status === "Shipped").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;
  const cancelled = orders.filter((o) => o.status === "Cancelled").length;
  
  const totalRevenue = orders
    .filter((o) => o.status === "Delivered" || o.status === "Shipped" || o.status === "Processing")
    .reduce((sum, o) => sum + o.totals.grandTotal, 0);

  return { total, pending, processing, shipped, delivered, cancelled, totalRevenue };
};
