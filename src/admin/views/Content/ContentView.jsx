import React, { useState, useMemo } from "react";
import { useAdminStore } from "../../../shared/useAdminStore";
import { useMediaStore } from "../../../shared/useMediaStore";
import { imageConfig } from "../../../shared/imageConfig";
import "./ContentView.scss";

const SECTION_OPTIONS = [
  { id: "hero", label: "Homepage Hero", icon: "pi-home" },
  { id: "story", label: "About Story & Journey", icon: "pi-info-circle" },
  { id: "process", label: "Process Steps", icon: "pi-list" },
  { id: "gallery", label: "Gallery Grid", icon: "pi-images" },
  { id: "instagram", label: "Instagram Feed", icon: "pi-instagram" }
];

const ContentView = () => {
  const faqs = useAdminStore((state) => state.faqs);
  const addFaq = useAdminStore((state) => state.addFaq);
  const editFaq = useAdminStore((state) => state.editFaq);
  const deleteFaq = useAdminStore((state) => state.deleteFaq);
  const toggleFaqActive = useAdminStore((state) => state.toggleFaqActive);

  // Zustand Media Store
  const imageMappings = useMediaStore((state) => state.imageMappings);
  const updateMapping = useMediaStore((state) => state.updateMapping);
  const mediaItems = useMediaStore((state) => state.mediaItems);

  const [activeTab, setActiveTab] = useState("faq");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // FAQ Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentFaq, setCurrentFaq] = useState(null);

  // Form inputs
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("Order And Delivery");
  const [displayOrder, setDisplayOrder] = useState(1);

  // Page Content Settings States
  const [activeSection, setActiveSection] = useState("hero");
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [pickingKey, setPickingKey] = useState("");
  const [pickingCategory, setPickingCategory] = useState("All");
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // Safe Image Resolver
  const resolveImage = (key) => {
    if (imageMappings && imageMappings[key]) {
      return imageMappings[key];
    }
    const fallback = imageConfig[key];
    return fallback ? fallback.en : "";
  };

  // Filtered Media items for selection
  const filteredPickerItems = useMemo(() => {
    if (pickingCategory === "All") return mediaItems;
    return mediaItems.filter((m) => m.category === pickingCategory);
  }, [mediaItems, pickingCategory]);

  const triggerMediaPicker = (key, category) => {
    setPickingKey(key);
    setPickingCategory(category);
    setShowMediaPicker(true);
  };

  const handleSelectMedia = (imageUrl) => {
    if (pickingKey) {
      updateMapping(pickingKey, imageUrl);
      showToast(`Successfully updated section image map: ${pickingKey}`);
    }
    setShowMediaPicker(false);
    setPickingKey("");
  };

  // FAQ Filters & Sorting
  const sortedFilteredFaqs = useMemo(() => {
    let list = [...faqs];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (f) =>
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "All") {
      list = list.filter((f) => f.category === categoryFilter);
    }

    if (statusFilter !== "All") {
      const isActive = statusFilter === "Active";
      list = list.filter((f) => f.active === isActive);
    }

    list.sort((a, b) => {
      if (a.category !== b.category) {
        return a.category.localeCompare(b.category);
      }
      return (Number(a.displayOrder) || 0) - (Number(b.displayOrder) || 0);
    });

    return list;
  }, [faqs, search, categoryFilter, statusFilter]);

  const openEditFaq = (faq) => {
    setCurrentFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setCategory(faq.category);
    setDisplayOrder(faq.displayOrder || 1);
    setShowEditModal(true);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) return;

    addFaq({
      question,
      answer,
      category,
      displayOrder: Number(displayOrder) || 1
    });

    setQuestion("");
    setAnswer("");
    setCategory("Order And Delivery");
    setDisplayOrder(1);
    setShowAddModal(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!currentFaq || !question.trim() || !answer.trim()) return;

    editFaq({
      id: currentFaq.id,
      question,
      answer,
      category,
      displayOrder: Number(displayOrder) || 1
    });

    setShowEditModal(false);
    setCurrentFaq(null);
  };

  const handleDeleteFaq = (id) => {
    if (window.confirm("Are you sure you want to delete this FAQ? This will remove it from the public page immediately.")) {
      deleteFaq(id);
    }
  };

  return (
    <div className="admin-view-container content-root">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Content Management</h1>
          <p className="admin-page-subtitle">Configure website FAQ accordion lists and dynamic visual layout sections.</p>
        </div>
      </div>

      {/* Sticky Action Header */}
      <div className="admin-sticky-action-bar">
        {/* Tabs */}
        <div className="content-tabs-nav" style={{ margin: 0 }}>
          <button
            className={`content-tab-btn ${activeTab === "faq" ? "is-active" : ""}`}
            onClick={() => setActiveTab("faq")}
          >
            <i className="pi pi-question-circle mr-2" /> FAQ Manager
          </button>
          <button
            className={`content-tab-btn ${activeTab === "pages" ? "is-active" : ""}`}
            onClick={() => setActiveTab("pages")}
          >
            <i className="pi pi-file-edit mr-2" /> Website Content Manager
          </button>
        </div>

        {/* FAQ Filters Toolbar */}
        {activeTab === "faq" && (
          <div className="widget-card content-toolbar">
            <div className="toolbar-flex">
              <div className="search-wrap">
                <i className="pi pi-search search-icon" />
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search FAQ questions..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="filters-row">
                <div className="filter-group">
                  <label>Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="toolbar-select"
                  >
                    <option value="All">All Categories</option>
                    <option value="Order And Delivery">Order And Delivery</option>
                    <option value="Product And Quality">Product And Quality</option>
                    <option value="Payment And Refunds">Payment And Refunds</option>
                    <option value="Purity And Quality">Purity And Quality</option>
                  </select>
                </div>
                <div className="filter-group">
                  <label>Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="toolbar-select"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Active">Active only</option>
                    <option value="Inactive">Inactive only</option>
                  </select>
                </div>
                <button className="admin-action-btn" onClick={() => setShowAddModal(true)} style={{ whiteSpace: 'nowrap', marginLeft: '12px' }}>
                  <i className="pi pi-plus mr-2" /> Add FAQ
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {activeTab === "pages" ? (
        /* Website Content Configurator */
        <div className="website-content-layout">
          {/* Section Sidebar Navigation */}
          <div className="widget-card section-nav-card">
            <div className="widget-header">
              <h3>Web Sections</h3>
            </div>
            <div className="widget-body nav-list">
              {SECTION_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  className={`section-nav-btn ${activeSection === opt.id ? "is-active" : ""}`}
                  onClick={() => setActiveSection(opt.id)}
                >
                  <i className={`pi ${opt.icon} mr-2`} />
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Section Configurator Workspace */}
          <div className="section-workspace">
            {activeSection === "hero" && (
              <div className="widget-card config-card">
                <div className="widget-header">
                  <h3>Homepage Hero Assets</h3>
                </div>
                <div className="widget-body config-fields">
                  <div className="config-item">
                    <div className="config-item-meta">
                      <strong>Hero Section Banner Background</strong>
                      <span>Displays as the primary full-width parallax background on the homepage hero.</span>
                    </div>
                    <div className="config-image-preview">
                      <img src={resolveImage("heroBg")} alt="Hero Background" />
                      <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => triggerMediaPicker("heroBg", "Banners")}>
                        <i className="pi pi-image mr-1" /> Choose from Library
                      </button>
                    </div>
                  </div>

                  <div className="config-item">
                    <div className="config-item-meta">
                      <strong>Hero Products Showcase Foreground</strong>
                      <span>The transparent multi-size products cluster shown in the right hand column of the hero.</span>
                    </div>
                    <div className="config-image-preview">
                      <img src={resolveImage("heroProducts")} alt="Hero Products" />
                      <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => triggerMediaPicker("heroProducts", "Products")}>
                        <i className="pi pi-image mr-1" /> Choose from Library
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "story" && (
              <div className="widget-card config-card">
                <div className="widget-header">
                  <h3>About Story &amp; Journey Assets</h3>
                </div>
                <div className="widget-body config-fields">
                  <div className="config-item">
                    <div className="config-item-meta">
                      <strong>About Page Header Background</strong>
                      <span>The full-bleed premium background at the top of the About Us layout.</span>
                    </div>
                    <div className="config-image-preview">
                      <img src={resolveImage("aboutUsHeroBg")} alt="About Us Hero Background" />
                      <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => triggerMediaPicker("aboutUsHeroBg", "About Us")}>
                        <i className="pi pi-image mr-1" /> Choose from Library
                      </button>
                    </div>
                  </div>

                  <div className="config-item">
                    <div className="config-item-meta">
                      <strong>Our Journey Legacy Banner</strong>
                      <span>Wide horizontal graphic illustrating the legacy of cold-press wood Ghani.</span>
                    </div>
                    <div className="config-image-preview">
                      <img src={resolveImage("journeyBanner")} alt="Journey Legacy Banner" />
                      <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => triggerMediaPicker("journeyBanner", "Banners")}>
                        <i className="pi pi-image mr-1" /> Choose from Library
                      </button>
                    </div>
                  </div>

                  <div className="config-item">
                    <div className="config-item-meta">
                      <strong>CTA Contact Background</strong>
                      <span>Scenic landscape background shown behind the CTA block at the bottom of pages.</span>
                    </div>
                    <div className="config-image-preview">
                      <img src={resolveImage("farmBg")} alt="CTA Background" />
                      <button className="pm-btn pm-btn-ghost pm-btn-sm" onClick={() => triggerMediaPicker("farmBg", "About Us")}>
                        <i className="pi pi-image mr-1" /> Choose from Library
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "process" && (
              <div className="widget-card config-card">
                <div className="widget-header">
                  <h3>6-Step Cold-Pressing Process Icons</h3>
                </div>
                <div className="widget-body config-fields grid-style">
                  {[
                    { key: "selection", label: "Step 1: Seed Selection" },
                    { key: "cleaning", label: "Step 2: Purification" },
                    { key: "extraction", label: "Step 3: Lakdi Ghani" },
                    { key: "filtering", label: "Step 4: Filtration" },
                    { key: "promiseOil", label: "Step 5: Quality Check" },
                    { key: "deliveryTruck", label: "Step 6: Packaging" }
                  ].map((step, idx) => (
                    <div key={idx} className="config-item-grid-box">
                      <div className="box-preview">
                        <img src={resolveImage(step.key)} alt={step.label} />
                      </div>
                      <span className="box-label">{step.label}</span>
                      <button className="pm-btn pm-btn-ghost pm-btn-sm btn-full" onClick={() => triggerMediaPicker(step.key, "Gallery")}>
                        <i className="pi pi-image mr-1" /> Replace Image
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "gallery" && (
              <div className="widget-card config-card">
                <div className="widget-header">
                  <h3>About Gallery Grid Slots</h3>
                </div>
                <div className="widget-body config-fields grid-style">
                  {[
                    { key: "fiveLiters", label: "Slot 1 (Product display)" },
                    { key: "fifteenKg", label: "Slot 2 (Institutional tin)" },
                    { key: "farmBg", label: "Slot 3 (Local farm scenery)" },
                    { key: "extraction", label: "Slot 4 (Traditional ghani)" },
                    { key: "cleaning", label: "Slot 5 (Peanuts sorting)" },
                    { key: "promiseOil", label: "Slot 6 (Purity verification)" }
                  ].map((slot, idx) => (
                    <div key={idx} className="config-item-grid-box">
                      <div className="box-preview">
                        <img src={resolveImage(slot.key)} alt={slot.label} />
                      </div>
                      <span className="box-label">{slot.label}</span>
                      <button className="pm-btn pm-btn-ghost pm-btn-sm btn-full" onClick={() => triggerMediaPicker(slot.key, "Gallery")}>
                        <i className="pi pi-image mr-1" /> Replace Image
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === "instagram" && (
              <div className="widget-card config-card">
                <div className="widget-header">
                  <h3>Instagram Section Feed Posts</h3>
                </div>
                <div className="widget-body config-fields grid-style">
                  {[
                    { key: "insta1", label: "Feed Post Slot 1" },
                    { key: "insta2", label: "Feed Post Slot 2" },
                    { key: "insta3", label: "Feed Post Slot 3" },
                    { key: "insta4", label: "Feed Post Slot 4" },
                    { key: "insta5", label: "Feed Post Slot 5" },
                    { key: "insta6", label: "Feed Post Slot 6" }
                  ].map((post, idx) => (
                    <div key={idx} className="config-item-grid-box">
                      <div className="box-preview">
                        <img src={resolveImage(post.key)} alt={post.label} />
                      </div>
                      <span className="box-label">{post.label}</span>
                      <button className="pm-btn pm-btn-ghost pm-btn-sm btn-full" onClick={() => triggerMediaPicker(post.key, "Instagram")}>
                        <i className="pi pi-image mr-1" /> Replace Image
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* FAQ manager */
        <>
          <div className="widget-card content-table-card">
            <div className="content-table-header">
              <span className="content-table-title">
                FAQ Entries List <span className="count-chip">{sortedFilteredFaqs.length}</span>
              </span>
            </div>
            <div className="table-responsive">
              <table className="content-table">
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>Order</th>
                    <th style={{ width: "160px" }}>Category</th>
                    <th>Question</th>
                    <th>Answer Summary</th>
                    <th style={{ width: "100px" }}>Status</th>
                    <th style={{ width: "120px" }} className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedFilteredFaqs.map((faq) => (
                    <tr key={faq.id} className="content-table-row">
                      <td>
                        <span className="order-badge">{faq.displayOrder}</span>
                      </td>
                      <td>
                        <span className="category-tag">{faq.category}</span>
                      </td>
                      <td className="font-semibold text-dark">{faq.question}</td>
                      <td className="text-muted text-truncate">{faq.answer}</td>
                      <td>
                        <button
                          className={`status-toggle-btn ${faq.active ? "active" : "inactive"}`}
                          title={faq.active ? "Click to Deactivate" : "Click to Activate"}
                          onClick={() => toggleFaqActive(faq.id)}
                        >
                          {faq.active ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="text-right">
                        <div className="actions-flex">
                          <button className="row-action-btn edit" onClick={() => openEditFaq(faq)}>
                            <i className="pi pi-pencil" />
                          </button>
                          <button className="row-action-btn delete" onClick={() => handleDeleteFaq(faq.id)}>
                            <i className="pi pi-trash" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {sortedFilteredFaqs.length === 0 && (
              <div className="content-empty">
                <i className="pi pi-question-circle" />
                <p>No FAQ entries matching the search filters.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── Add FAQ Modal ── */}
      {showAddModal && (
        <div className="content-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="content-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="content-modal-hdr">
              <h3>Create New FAQ</h3>
              <button className="content-modal-close" onClick={() => setShowAddModal(false)}>
                <i className="pi pi-times" />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="content-modal-form">
              <div className="form-group">
                <label>FAQ Question *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter question text..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>FAQ Answer *</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Enter detailed response..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="modal-textarea"
                />
              </div>
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="modal-select"
                  >
                    <option value="Order And Delivery">Order And Delivery</option>
                    <option value="Product And Quality">Product And Quality</option>
                    <option value="Payment And Refunds">Payment And Refunds</option>
                    <option value="Purity And Quality">Purity And Quality</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Display Order *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Math.max(1, Number(e.target.value)))}
                  />
                </div>
              </div>
              <div className="content-modal-footer">
                <button type="button" className="content-modal-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="content-modal-submit">Create FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Edit FAQ Modal ── */}
      {showEditModal && currentFaq && (
        <div className="content-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="content-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="content-modal-hdr">
              <h3>Edit FAQ — {currentFaq.id}</h3>
              <button className="content-modal-close" onClick={() => setShowEditModal(false)}>
                <i className="pi pi-times" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="content-modal-form">
              <div className="form-group">
                <label>FAQ Question *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter question text..."
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>FAQ Answer *</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Enter detailed response..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="modal-textarea"
                />
              </div>
              <div className="form-row">
                <div className="form-group flex-2">
                  <label>Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="modal-select"
                  >
                    <option value="Order And Delivery">Order And Delivery</option>
                    <option value="Product And Quality">Product And Quality</option>
                    <option value="Payment And Refunds">Payment And Refunds</option>
                    <option value="Purity And Quality">Purity And Quality</option>
                  </select>
                </div>
                <div className="form-group flex-1">
                  <label>Display Order *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={displayOrder}
                    onChange={(e) => setDisplayOrder(Math.max(1, Number(e.target.value)))}
                  />
                </div>
              </div>
              <div className="content-modal-footer">
                <button type="button" className="content-modal-cancel" onClick={() => { setShowEditModal(false); setCurrentFaq(null); }}>Cancel</button>
                <button type="submit" className="content-modal-submit">Save FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Media Selection Modal for Content Slots ── */}
      {showMediaPicker && (
        <div className="content-modal-overlay" style={{ zIndex: 10000 }} onClick={() => setShowMediaPicker(false)}>
          <div className="content-modal-box" style={{ maxWidth: '650px', width: '90%', padding: '24px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(0,0,0,0.05)', paddingBottom: '12px' }}>
              <h3 style={{ margin: 0, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '1.05rem', fontWeight: 800 }}>
                Choose Image from Library ({pickingCategory})
              </h3>
              <button
                type="button"
                onClick={() => setShowMediaPicker(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#94a3b8' }}
              >
                <i className="pi pi-times" />
              </button>
            </div>
            
            {filteredPickerItems.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#94a3b8', padding: '24px', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}>
                No images found in the Media Library for category "{pickingCategory}". Please upload files under this category first.
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '14px', maxHeight: '350px', overflowY: 'auto', padding: '4px' }}>
                {filteredPickerItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectMedia(item.imageUrl)}
                    style={{
                      border: '1.5px solid rgba(0,0,0,0.06)',
                      borderRadius: '10px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      aspectRatio: '1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f8fafc',
                      padding: '8px',
                      transition: 'all 0.2s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#d32f2f'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <img src={item.imageUrl} alt={item.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  </div>
                ))}
              </div>
            )}
            
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid rgba(0,0,0,0.05)', paddingTop: '12px' }}>
              <button
                type="button"
                className="content-modal-cancel"
                onClick={() => setShowMediaPicker(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="med-feedback-toast" style={{ position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)', background: '#0f172a', color: '#fff', padding: '12px 24px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)', zIndex: 99999, fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.8rem', fontWeight: 700 }}>
          <i className="pi pi-check-circle" style={{ color: '#22c55e' }} />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default ContentView;
