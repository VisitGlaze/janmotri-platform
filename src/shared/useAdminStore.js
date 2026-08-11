import { create } from "zustand";
import { initialCustomers } from "../admin/views/Customers/customersData";
import { initialOrders } from "../admin/views/Orders/ordersData";
import { initialBatches, generateBatchNumber } from "../admin/views/BatchManagement/batchData";
import { initialInventory, initialHistory } from "../admin/views/Inventory/inventoryData";
import { initialPayLater } from "../admin/views/PayLater/payLaterData";

// Seed Reviews Data
const initialReviews = [
  {
    id: "REV-1001",
    customerName: "Nilesh Patel",
    productName: "Groundnut Oil 1L",
    rating: 5,
    message: "Best wood ghani oil. Very premium aroma and purity. Highly recommended for daily cooking.",
    date: "2026-06-10",
    status: "Approved"
  },
  {
    id: "REV-1002",
    customerName: "Sandip G.",
    productName: "Groundnut Oil 5L",
    rating: 4,
    message: "Quality is awesome, but delivery took 3 days in Rajkot. Overall satisfied with the product purity.",
    date: "2026-06-09",
    status: "Approved"
  },
  {
    id: "REV-1003",
    customerName: "Shreeji Caterers",
    productName: "Groundnut Oil 15kg Tin",
    rating: 5,
    message: "Using 15kg tins for bulk frying at our catering events. Oil does not burn easily and foods absorb less oil.",
    date: "2026-06-11",
    status: "Pending"
  },
  {
    id: "REV-1004",
    customerName: "Bijal Shah",
    productName: "Groundnut Oil 15L",
    rating: 2,
    message: "Jerry can was slightly dented on arrival, please improve secondary packaging for delivery.",
    date: "2026-06-08",
    status: "Pending"
  },
  {
    id: "REV-1005",
    customerName: "Karan Joshi",
    productName: "Groundnut Oil Special Pack",
    rating: 5,
    message: "Best box gift pack. The golden presentation was a hit for Diwali corporate gifting.",
    date: "2026-06-06",
    status: "Approved"
  },
  {
    id: "REV-1006",
    customerName: "Spam Bot",
    productName: "Groundnut Oil 1L",
    rating: 1,
    message: "Get cheap crypto now at freecrypto-spam-url.com! Instant payouts guaranteed.",
    date: "2026-06-05",
    status: "Rejected"
  }
];

// Seed Messages Data
const initialMessages = [
  {
    id: "MSG-2001",
    customerName: "Hasmukh Bhai",
    mobile: "+91 98982 11223",
    email: "hasmukh.patel@yahoo.com",
    subject: "Wholesale dealership inquiry for Bhavnagar district",
    message: "Hello, we want to purchase Janmotri Groundnut Oil 15L Jerry Cans in bulk (approx. 200 cans per month) for our retail chain. Please share your wholesale rate card.",
    date: "2026-06-11",
    status: "New"
  },
  {
    id: "MSG-2002",
    customerName: "Dharmesh Shah",
    mobile: "+91 94260 55667",
    email: "d.shah@gmail.com",
    subject: "Is your oil double filtered or raw?",
    message: "Hello Janmotri Team, is your peanut oil cold-pressed and raw, or is it chemically refined? We are looking for 100% natural wood ghani output.",
    date: "2026-06-10",
    status: "Read"
  },
  {
    id: "MSG-2003",
    customerName: "Meena Joshi",
    mobile: "+91 97123 44556",
    email: "meena.joshi@gmail.com",
    subject: "Refund status on cancelled order #JMT-ORD-8805",
    message: "Hello, I cancelled my order yesterday. The app shows refund initiated, but it is not credited to my UPI account yet. Please check.",
    date: "2026-06-09",
    status: "Replied",
    replyText: "Hello Meena, the refund has been processed from our side. It typically takes 2-3 business days for banks to settle UPI refunds. Thank you for your patience."
  },
  {
    id: "MSG-2004",
    customerName: "Vikram Gondalia",
    mobile: "+91 90990 11220",
    email: "v.gondalia@outlook.com",
    subject: "Sponsorship for Rajkot Agro Expo 2026",
    message: "Dear Sir, we invite Janmotri Foods to sponsor the upcoming Agro exhibition. Please find the attached deck for branding slots.",
    date: "2026-06-05",
    status: "Archived"
  },
  {
    id: "MSG-2005",
    customerName: "Sneha Vyas",
    mobile: "+91 99241 88990",
    email: "sneha.vyas@gmail.com",
    subject: "Job opening in quality assurance lab",
    message: "Hello, I recently completed my M.Sc in Food Technology and saw your Bhavnagar refinery expansion. Are there active vacancies?",
    date: "2026-06-11",
    status: "New"
  }
];

// Seed FAQs Data (Extracted from FAQ PDF)
const initialFaqs = [
  { id: "FAQ-1", category: "Product And Quality", question: "What is Janmotri Groundnut Oil?", answer: "Janmotri Groundnut Oil is a premium-quality edible oil made from carefully selected groundnuts. It is processed under strict quality standards to deliver a rich aroma, natural taste, and excellent cooking performance for everyday use.", active: true, displayOrder: 1 },
  { id: "FAQ-2", category: "Product And Quality", question: "Is Janmotri Groundnut Oil 100% Pure?", answer: "Yes. Janmotri Groundnut Oil is made using premium-quality G-20 grade groundnuts, carefully selected for their superior quality and natural flavour", active: true, displayOrder: 2 },
  { id: "FAQ-3", category: "Product And Quality", question: "Is Janmotri Groundnut Oil Filtered ?", answer: "Yes. Janmotri Groundnut Oil is Double Filtered , ensuring high purity, consistent quality, and excellent taste for everyday cooking.", active: true, displayOrder: 3 },
  { id: "FAQ-4", category: "Purity And Quality", question: "What Is the Shelf Life of Janmotri Groundnut Oil?", answer: "The shelf life is clearly mentioned on the product packaging. For the best quality and freshness, consume the product before the \"Best Before\" date and store it in a cool, dry place away from direct sunlight.", active: true, displayOrder: 4 },
  { id: "FAQ-5", category: "Product And Quality", question: "Is Janmotri Oil Cold-Pressed or Wood-Pressed?", answer: "Please refer to the product label or description for the specific manufacturing method. If you purchase our Cold-Pressed or Wood-Pressed variant, it will be clearly indicated on the packaging.", active: true, displayOrder: 5 },
  { id: "FAQ-6", category: "Order And Delivery", question: "What Are the Delivery Charges? Do You Deliver Across India?", answer: "Yes. We deliver to most locations across India through trusted courier partners.\n• Shipping charges, if applicable, are displayed during checkout before payment.\n• We also offer promotional free shipping on selected products and orders from time to time.", active: true, displayOrder: 6 },
  { id: "FAQ-7", category: "Purity And Quality", question: "Is Janmotri Groundnut Oil Tested Before Packaging?", answer: "Yes. Every production batch undergoes quality inspections before packaging to ensure it meets our internal quality and food safety standards.", active: true, displayOrder: 7 },
  { id: "FAQ-8", category: "Purity And Quality", question: "How Does Janmotri Oil Ensure Product Quality?", answer: "Quality is our highest priority. We follow strict quality control measures at every stage—from sourcing premium-quality groundnuts to processing, packaging, and final inspection—to ensure every product meets our quality standards.", active: true, displayOrder: 8 },
  { id: "FAQ-9", category: "Purity And Quality", question: "How Does Janmotri Oil Maintain Consistency?", answer: "We maintain consistency through standardized manufacturing processes, regular quality inspections, and hygienic packaging practices. This helps ensure that every batch delivers the same trusted quality and taste.", active: true, displayOrder: 9 },
  { id: "FAQ-10", category: "Purity And Quality", question: "Do You Continuously Improve Product Quality?", answer: "Yes. We continuously review and improve our sourcing, manufacturing, packaging, and quality control processes. Customer feedback and ongoing quality evaluations help us enhance our products and maintain high standards.", active: true, displayOrder: 10 },
  { id: "FAQ-11", category: "Product And Quality", question: "Is Janmotri Groundnut Oil Suitable for Everyday Cooking?", answer: "Yes. Janmotri Groundnut Oil is suitable for a variety of cooking methods, including frying, sautéing, and everyday Indian cooking. It is designed to provide consistent performance and great taste.", active: true, displayOrder: 11 },
  { id: "FAQ-12", category: "Purity And Quality", question: "How Should I Store Janmotri Groundnut Oil?", answer: "Store the oil in a cool, dry place away from direct sunlight. Keep the container tightly closed after every use to help maintain its freshness and quality.", active: true, displayOrder: 12 },
  { id: "FAQ-13", category: "Payment And Refunds", question: "How Can I Contact Janmotri Oil?", answer: "If you have any questions or need assistance, you can contact us:\nEmail: banirathod@outlook.com\nPhone: +91 82000 56139\nOur customer support team will be happy to assist you.", active: true, displayOrder: 13 },
  { id: "FAQ-14", category: "Product And Quality", question: "What Makes Janmotri Oil Special?", answer: "Janmotri Groundnut Oil stands out for its premium G-20 groundnuts, Double Filtered & Refined process, high purity, consistent quality, rich natural taste, and strict quality control. Every bottle is carefully processed and hygienically packed to deliver trusted quality for everyday cooking.", active: true, displayOrder: 14 }
];

// Initial Company Details
const initialCompanyDetails = {
  brandName: "Janmotri Oil & Foods",
  email: "info@janmotrioil.com",
  phone: "+91 98765 43210",
  address: "Plot No. 1, Radhamani Park, Near Matrudham Temple, Akwada, Bhavnagar - 364002, Gujarat, India",
  gstin: "24AAAAC1234A1Z1"
};

export const useAdminStore = create((set) => ({
  reviews: initialReviews,
  messages: initialMessages,
  customers: initialCustomers,
  orders: initialOrders,
  batches: initialBatches,
  inventory: initialInventory,
  inventoryHistory: initialHistory,
  faqs: initialFaqs,
  companyDetails: initialCompanyDetails,
  payLater: initialPayLater,

  // --- REVIEWS ACTIONS ---
  addReview: (review) => set((state) => ({
    reviews: [
      {
        id: `REV-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        status: "Pending",
        ...review
      },
      ...state.reviews
    ]
  })),
  approveReview: (id) => set((state) => ({
    reviews: state.reviews.map((r) => r.id === id ? { ...r, status: "Approved" } : r)
  })),
  rejectReview: (id) => set((state) => ({
    reviews: state.reviews.map((r) => r.id === id ? { ...r, status: "Rejected" } : r)
  })),
  hideReview: (id) => set((state) => ({
    reviews: state.reviews.map((r) => r.id === id ? { ...r, status: "Hidden" } : r)
  })),
  deleteReview: (id) => set((state) => ({
    reviews: state.reviews.filter((r) => r.id !== id)
  })),
  bulkUpdateReviewsStatus: (ids, status) => set((state) => ({
    reviews: state.reviews.map((r) => ids.includes(r.id) ? { ...r, status } : r)
  })),
  bulkDeleteReviews: (ids) => set((state) => ({
    reviews: state.reviews.filter((r) => !ids.includes(r.id))
  })),

  // --- MESSAGES ACTIONS ---
  addMessage: (msg) => set((state) => ({
    messages: [
      {
        id: `MSG-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        status: "New",
        ...msg
      },
      ...state.messages
    ]
  })),
  markMessageAsRead: (id) => set((state) => ({
    messages: state.messages.map((m) => m.id === id && m.status === "New" ? { ...m, status: "Read" } : m)
  })),
  markMessageAsUnread: (id) => set((state) => ({
    messages: state.messages.map((m) => m.id === id && (m.status === "Read" || m.status === "Replied") ? { ...m, status: "New" } : m)
  })),
  replyToMessage: (id, replyText) => set((state) => ({
    messages: state.messages.map((m) => m.id === id ? { ...m, status: "Replied", replyText } : m)
  })),
  archiveMessage: (id) => set((state) => ({
    messages: state.messages.map((m) => m.id === id ? { ...m, status: "Archived" } : m)
  })),
  deleteMessage: (id) => set((state) => ({
    messages: state.messages.filter((m) => m.id !== id)
  })),
  bulkUpdateMessagesStatus: (ids, status) => set((state) => ({
    messages: state.messages.map((m) => ids.includes(m.id) ? { ...m, status } : m)
  })),
  bulkDeleteMessages: (ids) => set((state) => ({
    messages: state.messages.filter((m) => !ids.includes(m.id))
  })),

  // --- CUSTOMER ACTIONS ---
  addCustomer: (cust) => set((state) => {
    const nextNum = Math.max(...state.customers.map(c => parseInt(c.id.split("-")[1], 10))) + 1;
    const newId = `CUST-${nextNum}`;
    const today = new Date().toISOString().split("T")[0];
    return {
      customers: [
        ...state.customers,
        {
          id: newId,
          totalOrders: 0,
          totalSpending: 0,
          status: "Active",
          createdDate: today,
          payLaterActive: false,
          payLaterLimit: 0,
          payLaterBalance: 0,
          orders: [],
          ...cust
        }
      ]
    };
  }),
  toggleCustomerStatus: (id) => set((state) => ({
    customers: state.customers.map((c) =>
      c.id === id ? { ...c, status: c.status === "Active" ? "Suspended" : "Active" } : c
    )
  })),
  updateCustomerLimit: (id, limit) => set((state) => ({
    customers: state.customers.map((c) =>
      c.id === id ? { ...c, payLaterLimit: Number(limit) } : c
    )
  })),

  // --- PAY LATER ACTIONS ---
  addPayLaterCustomer: (cust) => set((state) => {
    const nextNum = Math.max(...state.payLater.map(r => parseInt(r.id.split("-")[2], 10) || 1000)) + 1;
    const newId = `PL-ACC-${nextNum}`;
    const today = new Date().toISOString().split("T")[0];

    // Sync to customers list
    const updatedCustomers = state.customers.map(c => {
      if (c.mobile === cust.mobile) {
        return {
          ...c,
          payLaterActive: cust.status === "Active" || cust.status === "Approved Requests" || cust.status === "Active Credit",
          payLaterLimit: Number(cust.creditLimit) || 0,
          payLaterBalance: 0
        };
      }
      return c;
    });

    const newRecord = {
      id: newId,
      customerName: cust.customerName,
      businessName: cust.businessName || cust.customerName,
      mobile: cust.mobile,
      email: cust.email || "N/A",
      customerType: cust.customerType || "Retail Customer",
      orderNumber: "—",
      orderAmount: 0,
      creditLimit: Number(cust.creditLimit) || 20000,
      usedCredit: 0,
      availableCredit: Number(cust.creditLimit) || 20000,
      outstandingAmount: 0,
      requestedDate: today,
      dueDate: null,
      status: cust.status || "Pending Requests",
      remainingDays: null,
      paymentTerms: cust.paymentTerms || "Full Pay Later",
      accountStatus: cust.accountStatus || "Active",
      notes: cust.notes || "",
      autoBlockLimit: true,
      autoBlockDueDate: true,
      allowTempExtension: false,
      orderHistory: [],
      collections: [],
      reminders: [],
      history: [
        { date: today, action: "Account Registered", desc: `Pay Later account created under terms: ${cust.paymentTerms}.` }
      ]
    };

    return {
      payLater: [...state.payLater, newRecord],
      customers: updatedCustomers
    };
  }),

  approvePayLaterRequest: (id, limit, terms) => set((state) => {
    const today = new Date().toISOString().split("T")[0];
    const updatedPayLater = state.payLater.map(r => {
      if (r.id === id) {
        setTimeout(() => {
          set(nestedState => ({
            customers: nestedState.customers.map(c =>
              c.mobile === r.mobile ? { ...c, payLaterActive: true, payLaterLimit: Number(limit) } : c
            )
          }));
        }, 0);

        return {
          ...r,
          status: "Approved Requests",
          creditLimit: Number(limit),
          availableCredit: Number(limit) - r.usedCredit,
          dueDate: r.dueDate || new Date(Date.now() + Number(terms) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          history: [
            ...r.history,
            { date: today, action: "Request Approved", desc: `Approved credit limit set to ₹${Number(limit).toLocaleString("en-IN")} with ${terms} days terms.` }
          ]
        };
      }
      return r;
    });

    return { payLater: updatedPayLater };
  }),

  rejectPayLaterRequest: (id, reason) => set((state) => {
    const today = new Date().toISOString().split("T")[0];
    const updatedPayLater = state.payLater.map(r => {
      if (r.id === id) {
        setTimeout(() => {
          set(nestedState => ({
            customers: nestedState.customers.map(c =>
              c.mobile === r.mobile ? { ...c, payLaterActive: false, payLaterLimit: 0, payLaterBalance: 0 } : c
            )
          }));
        }, 0);

        return {
          ...r,
          status: "Rejected Requests",
          accountStatus: "Blocked",
          rejectReason: reason,
          history: [
            ...r.history,
            { date: today, action: "Request Rejected", desc: `Rejected. Reason: ${reason}` }
          ]
        };
      }
      return r;
    });

    return { payLater: updatedPayLater };
  }),

  receivePayLaterRepayment: (id, amount, paymentMode, paymentRef) => set((state) => {
    const today = new Date().toISOString().split("T")[0];
    const amt = Number(amount);

    const updatedPayLater = state.payLater.map(r => {
      if (r.id === id) {
        const remainingOutstanding = Math.max(0, r.outstandingAmount - amt);
        const isFullPayment = remainingOutstanding === 0;
        const newStatus = isFullPayment ? "Payment History" : r.status;

        setTimeout(() => {
          set(nestedState => ({
            customers: nestedState.customers.map(c =>
              c.mobile === r.mobile ? { ...c, payLaterBalance: remainingOutstanding } : c
            )
          }));
        }, 0);

        return {
          ...r,
          status: newStatus,
          usedCredit: Math.max(0, r.usedCredit - amt),
          availableCredit: Math.min(r.creditLimit, r.availableCredit + amt),
          outstandingAmount: remainingOutstanding,
          paidDate: today,
          remainingDays: isFullPayment ? 0 : r.remainingDays,
          collections: r.collections ? r.collections.map(c => {
            if (c.status === "Pending" || c.status === "Upcoming") {
              return { ...c, status: isFullPayment ? "Collected" : "Pending", desc: `Paid partial ₹${amt} via ${paymentMode}` };
            }
            return c;
          }) : [],
          history: [
            ...r.history,
            { date: today, action: isFullPayment ? "Paid In Full" : "Partial Payment", desc: `Received ₹${amt} via ${paymentMode}. Ref: ${paymentRef || "N/A"}` }
          ]
        };
      }
      return r;
    });

    return { payLater: updatedPayLater };
  }),

  // --- ORDER ACTIONS ---
  addOrder: (ord) => {
    let createdOrder = null;
    set((state) => {
      // Generate order ID
      const nextNum = Math.max(...state.orders.map(o => parseInt(o.id.split("-")[2], 10))) + 1;
      const orderId = `JMT-ORD-${nextNum}`;
      const today = new Date().toISOString().split("T")[0];
      const nowTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

      const fullOrder = {
        id: orderId,
        date: today,
        time: nowTime,
        status: "Pending",
        paymentStatus: ord.paymentMethod === "Pay Later" || ord.paymentMethod === "COD" || ord.paymentMethod === "Pending" ? "Pending" : "Paid",
        timeline: [
          { status: "Placed", title: "Order Placed", time: `${today} ${nowTime}`, desc: `Order created manually by Admin via counter sales.` }
        ],
        ...ord
      };

      createdOrder = fullOrder;

      // 1. Update Customer Totals & Order History
      const updatedCustomers = state.customers.map((c) => {
        // Match customer name and phone
        if (c.name === ord.customer.name && c.mobile === ord.customer.mobile) {
          const updatedOrders = [
            {
              id: orderId,
              date: today,
              amount: ord.totals.grandTotal,
              status: "Pending",
              payment: fullOrder.paymentStatus
            },
            ...c.orders
          ];
          const newBalance = ord.paymentMethod === "Pay Later" ? c.payLaterBalance + ord.totals.grandTotal : c.payLaterBalance;
          return {
            ...c,
            totalOrders: c.totalOrders + 1,
            totalSpending: c.totalSpending + ord.totals.grandTotal,
            payLaterBalance: newBalance,
            orders: updatedOrders
          };
        }
        return c;
      });

      // 2. Subtract quantities from Batches
      const updatedBatches = state.batches.map((batch) => {
        const ordItem = ord.items.find(item => item.batchNo === batch.batchNo && item.name === batch.product);
        if (ordItem) {
          return {
            ...batch,
            soldQty: batch.soldQty + ordItem.qty,
            availableQty: Math.max(0, batch.availableQty - ordItem.qty)
          };
        }
        return batch;
      });

      // 3. Subtract quantities from Inventory & Create history logs
      const newLogs = [];
      const updatedInventory = state.inventory.map((inv) => {
        // Find order item matching this inventory SKU
        const ordItem = ord.items.find(item => item.sku === inv.sku);
        if (ordItem) {
          newLogs.push({
            id: `TXN-${8822 + state.inventoryHistory.length + newLogs.length}`,
            date: today,
            time: nowTime,
            type: "Stock Out",
            sku: inv.sku,
            name: inv.name,
            qty: ordItem.qty,
            balance: Math.max(0, inv.currentStock - ordItem.qty),
            warehouse: inv.warehouse,
            reason: `Sales Order #${orderId}`,
            user: "Admin User",
            batchNo: ordItem.batchNo
          });
          return {
            ...inv,
            currentStock: Math.max(0, inv.currentStock - ordItem.qty),
            availableStock: Math.max(0, inv.availableStock - ordItem.qty),
            totalValue: Math.max(0, inv.currentStock - ordItem.qty) * inv.unitCost,
            lastUpdated: today,
            lastStockOut: today
          };
        }
        return inv;
      });

      // 4. Update Pay Later account records if payment method is "Pay Later"
      let updatedPayLater = state.payLater || [];
      if (ord.paymentMethod === "Pay Later") {
        const matchExists = updatedPayLater.some(r => r.mobile === ord.customer.mobile);

        if (matchExists) {
          updatedPayLater = updatedPayLater.map((r) => {
            if (r.mobile === ord.customer.mobile) {
              const newOutstanding = r.outstandingAmount + ord.totals.grandTotal;
              return {
                ...r,
                usedCredit: r.usedCredit + ord.totals.grandTotal,
                availableCredit: Math.max(0, r.availableCredit - ord.totals.grandTotal),
                outstandingAmount: newOutstanding,
                orderHistory: [
                  { id: orderId, date: today, items: ord.items.map(i => `${i.name} x ${i.qty}`).join(", "), amount: ord.totals.grandTotal, status: "Active Credit" },
                  ...r.orderHistory
                ],
                history: [
                  ...r.history,
                  { date: today, action: "Order Charged", desc: `Order #${orderId} of ₹${ord.totals.grandTotal.toLocaleString("en-IN")} charged to credit line.` }
                ]
              };
            }
            return r;
          });
        } else {
          const nextPLNum = Math.max(...updatedPayLater.map(r => parseInt(r.id.split("-")[2], 10) || 1000)) + 1;
          const newPLId = `PL-ACC-${nextPLNum}`;
          const dueDate = new Date();
          dueDate.setDate(dueDate.getDate() + 30);
          const dueDateStr = dueDate.toISOString().slice(0, 10);

          const newPLRecord = {
            id: newPLId,
            customerName: ord.customer.name,
            businessName: ord.customer.name,
            mobile: ord.customer.mobile,
            email: ord.customer.email || "N/A",
            customerType: "Retail Customer",
            orderNumber: orderId,
            orderAmount: ord.totals.grandTotal,
            creditLimit: 30000,
            usedCredit: ord.totals.grandTotal,
            availableCredit: 30000 - ord.totals.grandTotal,
            outstandingAmount: ord.totals.grandTotal,
            requestedDate: today,
            dueDate: dueDateStr,
            status: "Approved Requests",
            remainingDays: 30,
            paymentTerms: "Full Pay Later",
            accountStatus: "Active",
            notes: "Auto-created on first Pay Later order.",
            autoBlockLimit: true,
            autoBlockDueDate: true,
            allowTempExtension: false,
            orderHistory: [
              { id: orderId, date: today, items: ord.items.map(i => `${i.name} x ${i.qty}`).join(", "), amount: ord.totals.grandTotal, status: "Active Credit" }
            ],
            collections: [
              { id: `COL-${Date.now()}`, date: dueDateStr, amount: ord.totals.grandTotal, status: "Pending", type: "Ledger Balance" }
            ],
            reminders: [],
            history: [
              { date: today, action: "Account Registered", desc: "Pay Later account automatically approved upon checkout." },
              { date: today, action: "Order Charged", desc: `Charged ₹${ord.totals.grandTotal.toLocaleString("en-IN")} to new credit line.` }
            ]
          };
          updatedPayLater = [...updatedPayLater, newPLRecord];
        }
      }

      return {
        orders: [fullOrder, ...state.orders],
        customers: updatedCustomers,
        batches: updatedBatches,
        inventory: updatedInventory,
        inventoryHistory: [...newLogs, ...state.inventoryHistory],
        payLater: updatedPayLater
      };
    });
    return createdOrder;
  },

  updateOrderStatus: (id, status) => set((state) => {
    const today = new Date().toISOString().slice(0, 10);
    const nowTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    return {
      orders: state.orders.map((o) => {
        if (o.id === id) {
          const updatedTimeline = [
            ...o.timeline,
            {
              status: status,
              title: `Status set to ${status}`,
              time: `${today} ${nowTime}`,
              desc: `Updated by Admin to ${status}.`
            }
          ];

          let newPaymentStatus = o.paymentStatus;
          if (status === "Delivered" && (o.paymentMethod === "COD" || o.paymentMethod === "Pay Later")) {
            newPaymentStatus = "Paid";
          } else if (status === "Cancelled" && o.paymentStatus === "Paid") {
            newPaymentStatus = "Refunded";
          }

          // If the order is cancelled, we should RELEASE/RESTORE inventory and batch stock!
          let adjustedBatches = state.batches;
          let adjustedInventory = state.inventory;
          let adjustedHistory = state.inventoryHistory;

          if (status === "Cancelled" && o.status !== "Cancelled") {
            // Revert batch quantities
            adjustedBatches = state.batches.map((batch) => {
              const ordItem = o.items.find(item => item.batchNo === batch.batchNo && item.name === batch.product);
              if (ordItem) {
                return {
                  ...batch,
                  soldQty: Math.max(0, batch.soldQty - ordItem.qty),
                  availableQty: batch.availableQty + ordItem.qty
                };
              }
              return batch;
            });

            // Revert inventory levels and add releases to log
            const revertLogs = [];
            adjustedInventory = state.inventory.map((inv) => {
              const ordItem = o.items.find(item => item.sku === inv.sku);
              if (ordItem) {
                revertLogs.push({
                  id: `TXN-${8822 + state.inventoryHistory.length + revertLogs.length}`,
                  date: today,
                  time: nowTime,
                  type: "Released",
                  sku: inv.sku,
                  name: inv.name,
                  qty: ordItem.qty,
                  balance: inv.currentStock + ordItem.qty,
                  warehouse: inv.warehouse,
                  reason: `Released from Cancelled Order #${id}`,
                  user: "Admin System",
                  batchNo: ordItem.batchNo
                });
                return {
                  ...inv,
                  currentStock: inv.currentStock + ordItem.qty,
                  availableStock: inv.availableStock + ordItem.qty,
                  totalValue: (inv.currentStock + ordItem.qty) * inv.unitCost,
                  lastUpdated: today
                };
              }
              return inv;
            });
            adjustedHistory = [...revertLogs, ...state.inventoryHistory];

            // Revert customer spending if order was cancelled
            set((nestedState) => {
              const updatedCustomers = nestedState.customers.map((c) => {
                if (c.name === o.customer.name && c.mobile === o.customer.mobile) {
                  // Deduct order amount from totalSpending and adjust payLaterBalance if needed
                  const isPayLater = o.paymentMethod === "Pay Later";
                  const newBalance = isPayLater ? Math.max(0, c.payLaterBalance - o.totals.grandTotal) : c.payLaterBalance;
                  return {
                    ...c,
                    totalSpending: Math.max(0, c.totalSpending - o.totals.grandTotal),
                    payLaterBalance: newBalance,
                    orders: c.orders.map(co => co.id === id ? { ...co, status: "Cancelled", payment: newPaymentStatus } : co)
                  };
                }
                return c;
              });
              return { customers: updatedCustomers };
            });
          }

          // If the order becomes delivered, check if we need to update customer order records status
          if (status === "Delivered") {
            set((nestedState) => {
              const updatedCustomers = nestedState.customers.map((c) => {
                if (c.name === o.customer.name && c.mobile === o.customer.mobile) {
                  return {
                    ...c,
                    orders: c.orders.map(co => co.id === id ? { ...co, status: "Delivered", payment: newPaymentStatus } : co)
                  };
                }
                return c;
              });
              return { customers: updatedCustomers };
            });
          }

          // Trigger state update
          if (status === "Cancelled" && o.status !== "Cancelled") {
            setTimeout(() => {
              set({ batches: adjustedBatches, inventory: adjustedInventory, inventoryHistory: adjustedHistory });
            }, 0);
          }

          return {
            ...o,
            status: status,
            paymentStatus: newPaymentStatus,
            timeline: updatedTimeline
          };
        }
        return o;
      })
    };
  }),

  // --- BATCHES ACTIONS ---
  addBatch: (batch) => set((state) => {
    const today = new Date().toISOString().split("T")[0];
    const nowTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });

    // Auto-generate batch number if empty or not JMO style
    const autoBatchNo = generateBatchNumber(state.batches);
    const finalBatchNo = batch.batchNo && batch.batchNo.trim() ? batch.batchNo : autoBatchNo;

    const nextBatchNum = state.batches.length + 1;
    const batchId = `B${String(nextBatchNum).padStart(3, "0")}`;

    const newBatch = {
      id: batchId,
      batchNo: finalBatchNo,
      soldQty: 0,
      availableQty: Number(batch.producedQty),
      labTestStatus: batch.labTestStatus || "Passed",
      status: "Active",
      ...batch,
    };

    // Find SKU of product
    const skuMap = {
      "Groundnut Oil 1L": "JMT-GNO-1L",
      "Groundnut Oil 5L": "JMT-GNO-5L",
      "Groundnut Oil 15L": "JMT-GNO-15L",
      "Groundnut Oil 15kg Tin": "JMT-GNO-15K",
      "Groundnut Oil Special Pack": "JMT-GNO-SP"
    };
    const sku = skuMap[batch.product] || "JMT-GNO-1L";

    // Update Inventory
    const updatedInventory = state.inventory.map((inv) => {
      if (inv.sku === sku) {
        return {
          ...inv,
          currentStock: inv.currentStock + Number(batch.producedQty),
          availableStock: inv.availableStock + Number(batch.producedQty),
          totalValue: (inv.currentStock + Number(batch.producedQty)) * inv.unitCost,
          lastUpdated: today,
          lastStockIn: today,
          batchNo: finalBatchNo
        };
      }
      return inv;
    });

    const targetInv = state.inventory.find(inv => inv.sku === sku);
    const currentStockVal = targetInv ? targetInv.currentStock : 0;

    const stockLog = {
      id: `TXN-${8822 + state.inventoryHistory.length}`,
      date: today,
      time: nowTime,
      type: "Stock In",
      sku: sku,
      name: batch.product,
      qty: Number(batch.producedQty),
      balance: currentStockVal + Number(batch.producedQty),
      warehouse: batch.warehouse || "Rajkot Main",
      reason: `Production Batch #${finalBatchNo}`,
      user: "Production System",
      batchNo: finalBatchNo
    };

    return {
      batches: [newBatch, ...state.batches],
      inventory: updatedInventory,
      inventoryHistory: [stockLog, ...state.inventoryHistory]
    };
  }),
  recallBatch: (id) => set((state) => ({
    batches: state.batches.map((b) => b.id === id ? { ...b, status: "Recalled" } : b)
  })),
  updateBatch: (id, updated) => set((state) => ({
    batches: state.batches.map((b) => b.id === id ? { ...b, ...updated } : b)
  })),

  // --- FAQ ACTIONS ---
  addFaq: (faq) => set((state) => ({
    faqs: [
      ...state.faqs,
      {
        id: `FAQ-${Date.now()}`,
        active: true,
        ...faq
      }
    ]
  })),
  editFaq: (updatedFaq) => set((state) => ({
    faqs: state.faqs.map((f) => f.id === updatedFaq.id ? { ...f, ...updatedFaq } : f)
  })),
  deleteFaq: (id) => set((state) => ({
    faqs: state.faqs.filter((f) => f.id !== id)
  })),
  toggleFaqActive: (id) => set((state) => ({
    faqs: state.faqs.map((f) => f.id === id ? { ...f, active: !f.active } : f)
  })),

  // --- INVENTORY ACTIONS ---
  stockIn: ({ sku, qty, batchNo, warehouse, notes, supplier }) => set((state) => {
    const today = new Date().toISOString().slice(0, 10);
    const nowTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const targetItem = state.inventory.find(i => i.sku === sku);

    const updatedInventory = state.inventory.map((i) =>
      i.sku === sku
        ? {
          ...i,
          currentStock: i.currentStock + qty,
          availableStock: i.availableStock + qty,
          totalValue: (i.currentStock + qty) * i.unitCost,
          batchNo,
          warehouse,
          lastUpdated: today,
          lastStockIn: today
        }
        : i
    );

    const log = {
      id: `TXN-${8822 + state.inventoryHistory.length}`,
      date: today,
      time: nowTime,
      type: "Stock In",
      sku,
      name: targetItem ? targetItem.name : "Groundnut Oil",
      qty,
      balance: (targetItem ? targetItem.currentStock : 0) + qty,
      warehouse,
      reason: supplier ? `Purchase from ${supplier}` : notes || "Manual Stock In",
      user: "Admin User",
      batchNo
    };

    return {
      inventory: updatedInventory,
      inventoryHistory: [log, ...state.inventoryHistory]
    };
  }),

  stockOut: ({ sku, qty, reason, refNo, warehouse }) => set((state) => {
    const today = new Date().toISOString().slice(0, 10);
    const nowTime = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
    const targetItem = state.inventory.find(i => i.sku === sku);

    const updatedInventory = state.inventory.map((i) =>
      i.sku === sku
        ? {
          ...i,
          currentStock: Math.max(0, i.currentStock - qty),
          availableStock: Math.max(0, i.availableStock - qty),
          totalValue: Math.max(0, i.currentStock - qty) * i.unitCost,
          lastUpdated: today,
          lastStockOut: today
        }
        : i
    );

    const log = {
      id: `TXN-${8822 + state.inventoryHistory.length}`,
      date: today,
      time: nowTime,
      type: "Stock Out",
      sku,
      name: targetItem ? targetItem.name : "Groundnut Oil",
      qty,
      balance: Math.max(0, (targetItem ? targetItem.currentStock : 0) - qty),
      warehouse,
      reason: refNo ? `${reason} ${refNo}` : reason,
      user: "Admin User",
      batchNo: targetItem ? targetItem.batchNo : "—"
    };

    return {
      inventory: updatedInventory,
      inventoryHistory: [log, ...state.inventoryHistory]
    };
  }),

  // --- SETTINGS ACTIONS ---
  updateCompanyDetails: (details) => set((state) => ({
    companyDetails: {
      ...state.companyDetails,
      ...details
    }
  }))
}));
