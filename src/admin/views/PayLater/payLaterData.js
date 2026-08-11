// ─────────────────────────────────────────────────────────────────
// Janmotri Oil Admin — Upgraded Credit Management System Data
// ─────────────────────────────────────────────────────────────────

export const PAY_LATER_STATUSES = [
  "Pending Requests", 
  "Approved Requests", 
  "Rejected Requests", 
  "Overdue Payments", 
  "Payment History",
  "Collections",
  "Reports"
];

export const initialPayLater = [
  {
    id: "PL-ACC-1001",
    customerName: "Radhe Agro Industries",
    businessName: "Radhe Agro Pvt Ltd",
    mobile: "+91 98980 11223",
    email: "purchase@radheagro.in",
    customerType: "Corporate Customer",
    orderNumber: "JMT-ORD-8812",
    orderAmount: 18400,
    creditLimit: 50000,
    usedCredit: 18400,
    availableCredit: 31600,
    outstandingAmount: 18400,
    requestedDate: "2026-06-11",
    dueDate: "2026-07-11",
    status: "Pending Requests",
    remainingDays: 26,
    paymentTerms: "Full Pay Later",
    accountStatus: "Active",
    riskLevel: "Low",
    notes: "Regular wholesale order of oil tins. Prompt credit repayment history.",
    autoBlockLimit: true,
    autoBlockDueDate: true,
    allowTempExtension: false,
    orderHistory: [
      { id: "JMT-ORD-8812", date: "2026-06-11", items: "Groundnut Oil 15L x 5, Groundnut Oil 1L x 8", amount: 18400, status: "Pending Approval" },
      { id: "JMT-ORD-8704", date: "2026-05-02", items: "Groundnut Oil 15kg Tin x 10", amount: 33000, status: "Paid" }
    ],
    collections: [
      { id: "COL-101", date: "2026-07-11", amount: 18400, status: "Pending", type: "Full Settlement" }
    ],
    reminders: [
      { date: "2026-06-11", type: "Email", desc: "Credit request received & queued." }
    ],
    history: [
      { date: "2026-06-11", action: "Request Logged", desc: "Requested ₹18,400 under Corporate terms." }
    ]
  },
  {
    id: "PL-ACC-1002",
    customerName: "Jay Ambe Kirana",
    businessName: "Jay Ambe Kirana Store",
    mobile: "+91 97230 44556",
    email: "contact@jayambekirana.com",
    customerType: "Retail Customer",
    orderNumber: "JMT-ORD-8802",
    orderAmount: 14610,
    creditLimit: 25000,
    usedCredit: 14610,
    availableCredit: 10390,
    outstandingAmount: 14610,
    requestedDate: "2026-06-10",
    dueDate: "2026-07-10",
    status: "Approved Requests",
    remainingDays: 25,
    paymentTerms: "Partial Advance + Remaining Later",
    accountStatus: "Active",
    riskLevel: "Low",
    notes: "Retail vendor, partial payment processed on dispatch.",
    autoBlockLimit: true,
    autoBlockDueDate: false,
    allowTempExtension: true,
    orderHistory: [
      { id: "JMT-ORD-8802", date: "2026-06-10", items: "Groundnut Oil 5L x 10, Groundnut Oil 1L x 15", amount: 14610, status: "Active Credit" }
    ],
    collections: [
      { id: "COL-102", date: "2026-07-10", amount: 14610, status: "Upcoming", type: "Due Balance" }
    ],
    reminders: [],
    history: [
      { date: "2026-06-10", action: "Approved", desc: "Approved limit ₹25,000 with 30 days term." }
    ]
  },
  {
    id: "PL-ACC-1003",
    customerName: "Dwarkadhish Agro",
    businessName: "Dwarkadhish Trading Co.",
    mobile: "+91 94090 99887",
    email: "dwarka.agro@gmail.com",
    customerType: "Distributor",
    orderNumber: "JMT-ORD-8798",
    orderAmount: 32000,
    creditLimit: 30000,
    usedCredit: 32000,
    availableCredit: -2000,
    outstandingAmount: 32000,
    requestedDate: "2026-05-15",
    dueDate: "2026-06-14",
    status: "Overdue Payments",
    remainingDays: -1, // Overdue
    paymentTerms: "Full Pay Later",
    accountStatus: "Suspended",
    riskLevel: "High",
    notes: "Distributor account. Limit exceeded by ₹2,000. Customer unresponsive.",
    autoBlockLimit: true,
    autoBlockDueDate: true,
    allowTempExtension: false,
    orderHistory: [
      { id: "JMT-ORD-8798", date: "2026-05-15", items: "Groundnut Oil 15L x 8, Groundnut Oil Special Pack x 10", amount: 32000, status: "Overdue" }
    ],
    collections: [
      { id: "COL-103", date: "2026-06-14", amount: 32000, status: "Failed", type: "Overdue Collection" }
    ],
    reminders: [
      { date: "2026-06-07", type: "WhatsApp", desc: "Automatic 7 days prior warning sent." },
      { date: "2026-06-14", type: "SMS & Email", desc: "Due date collection alert dispatched." },
      { date: "2026-06-15", type: "WhatsApp", desc: "Manual overdue follow-up sent by Admin." }
    ],
    history: [
      { date: "2026-05-15", action: "Approved", desc: "Approved limit ₹30,000 with 30 days term." },
      { date: "2026-06-14", action: "Marked Overdue", desc: "System flagged payment deadline breach." }
    ]
  },
  {
    id: "PL-ACC-1004",
    customerName: "Shreeji Distributors",
    businessName: "Shreeji FMCG Sales Agency",
    mobile: "+91 90999 55667",
    email: "shreejidist@rediffmail.com",
    customerType: "Distributor",
    orderNumber: "JMT-ORD-8785",
    orderAmount: 28900,
    creditLimit: 100000,
    usedCredit: 28900,
    availableCredit: 71100,
    outstandingAmount: 28900,
    requestedDate: "2026-06-08",
    dueDate: "2026-07-08",
    status: "Approved Requests",
    remainingDays: 23,
    paymentTerms: "Monthly Billing",
    accountStatus: "Active",
    riskLevel: "Low",
    notes: "High credit limit partner with clean transaction ledger history.",
    autoBlockLimit: true,
    autoBlockDueDate: true,
    allowTempExtension: true,
    orderHistory: [
      { id: "JMT-ORD-8785", date: "2026-06-08", items: "Groundnut Oil 15kg Tin x 5, Groundnut Oil 5L x 10", amount: 28900, status: "Active Credit" }
    ],
    collections: [
      { id: "COL-104", date: "2026-07-08", amount: 28900, status: "Upcoming", type: "Billing Cycle" }
    ],
    reminders: [],
    history: [
      { date: "2026-06-08", action: "Approved", desc: "Approved automatically based on corporate parameters." }
    ]
  },
  {
    id: "PL-ACC-1005",
    customerName: "Ambika General Store",
    businessName: "Ambika Retail Provisions",
    mobile: "+91 98244 88776",
    email: "ambikaprovisions@yahoo.com",
    customerType: "Retail Customer",
    orderNumber: "JMT-ORD-8809",
    orderAmount: 8500,
    creditLimit: 10000,
    usedCredit: 0,
    availableCredit: 10000,
    outstandingAmount: 0,
    requestedDate: "2026-06-02",
    dueDate: null,
    status: "Rejected Requests",
    remainingDays: null,
    paymentTerms: "Full Pay Later",
    accountStatus: "Blocked",
    riskLevel: "High",
    notes: "New account, requested direct credit line but rejected due to poor retail credit score check.",
    autoBlockLimit: true,
    autoBlockDueDate: true,
    allowTempExtension: false,
    rejectReason: "Insufficient credit history and small initial order.",
    orderHistory: [
      { id: "JMT-ORD-8809", date: "2026-06-02", items: "Groundnut Oil 1L x 30, Groundnut Oil Special Pack x 2", amount: 8300, status: "Rejected" }
    ],
    collections: [],
    reminders: [],
    history: [
      { date: "2026-06-03", action: "Rejected", desc: "Rejected due to credit scorecard score." }
    ]
  },
  {
    id: "PL-ACC-1006",
    customerName: "Krishna Oil Depot",
    businessName: "Krishna Edibles Rajkot",
    mobile: "+91 94220 11224",
    email: "krishnaoildepot@gmail.com",
    customerType: "Wholesale Customer",
    orderNumber: "JMT-ORD-8711",
    orderAmount: 42000,
    creditLimit: 50000,
    usedCredit: 0,
    availableCredit: 50000,
    outstandingAmount: 0,
    requestedDate: "2026-05-01",
    dueDate: "2026-06-01",
    status: "Payment History",
    remainingDays: 0,
    paymentTerms: "Full Pay Later",
    accountStatus: "Active",
    riskLevel: "Low",
    notes: "Paid in full via Bank Transfer.",
    autoBlockLimit: true,
    autoBlockDueDate: true,
    allowTempExtension: true,
    paidDate: "2026-05-28",
    paidAmount: 42000,
    orderHistory: [
      { id: "JMT-ORD-8711", date: "2026-05-01", items: "Groundnut Oil 15L x 10, Groundnut Oil 15kg Tin x 2", amount: 42000, status: "Paid In Full" }
    ],
    collections: [
      { id: "COL-105", date: "2026-05-28", amount: 42000, status: "Collected", type: "Bank Transfer UTR-88123" }
    ],
    reminders: [
      { date: "2026-05-25", type: "Email", desc: "Repayment schedule reminder." }
    ],
    history: [
      { date: "2026-05-01", action: "Approved", desc: "Approved with 30 days term." },
      { date: "2026-05-28", action: "Paid In Full", desc: "₹42,000 received. Account cleared." }
    ]
  },
  {
    id: "PL-ACC-1007",
    customerName: "Hitesh Provision Store",
    businessName: "Hitesh Provision Store",
    mobile: "+91 99799 12365",
    email: "hiteshstore@gmail.com",
    customerType: "Retail Customer",
    orderNumber: "JMT-ORD-8799",
    orderAmount: 6400,
    creditLimit: 15000,
    usedCredit: 6400,
    availableCredit: 8600,
    outstandingAmount: 6400,
    requestedDate: "2026-06-11",
    dueDate: "2026-07-11",
    status: "Pending Requests",
    remainingDays: 26,
    paymentTerms: "Full Pay Later",
    accountStatus: "Active",
    riskLevel: "Medium",
    notes: "Requested standard 30 day credit for retail expansion stock.",
    autoBlockLimit: false,
    autoBlockDueDate: false,
    allowTempExtension: true,
    orderHistory: [
      { id: "JMT-ORD-8799", date: "2026-06-11", items: "Groundnut Oil 5L x 5, Groundnut Oil 1L x 5", amount: 6400, status: "Pending Approval" }
    ],
    collections: [
      { id: "COL-106", date: "2026-07-11", amount: 6400, status: "Pending", type: "Retail Ledger Balance" }
    ],
    reminders: [],
    history: [
      { date: "2026-06-11", action: "Request Logged", desc: "Initial retail request logged." }
    ]
  },
  {
    id: "PL-ACC-1008",
    customerName: "Maruti Foods & Beverage",
    businessName: "Maruti Foods Pvt Ltd",
    mobile: "+91 91732 66778",
    email: "accounts@marutifoods.co.in",
    customerType: "Corporate Customer",
    orderNumber: "JMT-ORD-8740",
    orderAmount: 18500,
    creditLimit: 20000,
    usedCredit: 18500,
    availableCredit: 1500,
    outstandingAmount: 18500,
    requestedDate: "2026-05-10",
    dueDate: "2026-06-10",
    status: "Overdue Payments",
    remainingDays: -5,
    paymentTerms: "Installment Plan",
    accountStatus: "Active",
    riskLevel: "Medium",
    notes: "Bulk catering client. Slight delay in final authorization.",
    autoBlockLimit: true,
    autoBlockDueDate: false,
    allowTempExtension: true,
    orderHistory: [
      { id: "JMT-ORD-8740", date: "2026-05-10", items: "Groundnut Oil 15L x 5, Groundnut Oil 5L x 2", amount: 18500, status: "Overdue" }
    ],
    collections: [
      { id: "COL-107", date: "2026-06-10", amount: 18500, status: "Pending", type: "Scheduled Installment" }
    ],
    reminders: [
      { date: "2026-06-10", type: "Email", desc: "Overdue collection notice sent." }
    ],
    history: [
      { date: "2026-05-11", action: "Approved", desc: "Credit limit verified & approved." }
    ]
  }
];

export const getPayLaterSummary = (records) => {
  const totalCreditCustomers = records.length;
  
  const totalCreditIssued = records
    .filter((r) => r.status !== "Rejected Requests")
    .reduce((sum, r) => sum + (r.creditLimit || 0), 0);

  const outstandingAmount = records
    .filter((r) => r.status === "Approved Requests" || r.status === "Overdue Payments" || r.status === "Pending Requests")
    .reduce((sum, r) => sum + r.outstandingAmount, 0);

  const overdueAmount = records
    .filter((r) => r.status === "Overdue Payments")
    .reduce((sum, r) => sum + r.outstandingAmount, 0);

  const monthlyCollection = records
    .filter((r) => r.status === "Payment History" || r.paidAmount > 0)
    .reduce((sum, r) => sum + (r.paidAmount || 0), 0);

  const recoveryRate = outstandingAmount + monthlyCollection > 0
    ? Math.round((monthlyCollection / (outstandingAmount + monthlyCollection)) * 100)
    : 100;

  const activeCreditAccounts = records.filter(
    (r) => r.status === "Approved Requests" || r.status === "Overdue Payments"
  ).length;

  const highRiskCustomers = records.filter(
    (r) => r.riskLevel === "High" && r.status !== "Rejected Requests"
  ).length;

  return {
    totalCreditCustomers,
    totalCreditIssued,
    outstandingAmount,
    overdueAmount,
    monthlyCollection,
    recoveryRate,
    activeCreditAccounts,
    highRiskCustomers
  };
};
