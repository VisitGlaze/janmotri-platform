import React, { useState, useMemo, useRef } from "react";
import { useMediaStore } from "../../../shared/useMediaStore";
import "./MediaLibraryView.scss";

const CATEGORIES = ["All", "Products", "Banners", "Gallery", "About Us", "Instagram", "Blog", "Other"];

const MediaLibraryView = () => {
  const mediaItems = useMediaStore((state) => state.mediaItems);
  const addMedia = useMediaStore((state) => state.addMedia);
  const deleteMedia = useMediaStore((state) => state.deleteMedia);
  const updateMedia = useMediaStore((state) => state.updateMedia);

  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  
  // Drag and Drop state
  const [dragging, setDragging] = useState(false);
  const [uploadCategory, setUploadCategory] = useState("Products");
  
  // Toast notifications state
  const [toastMessage, setToastMessage] = useState("");
  
  const fileInputRef = useRef(null);
  const replaceInputRef = useRef(null);
  const replacingIdRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  // ── File Upload Handlers ──
  const handleFiles = (files, category) => {
    let count = 0;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target.result;
        
        // Determine resolution
        const img = new Image();
        img.onload = () => {
          const resolution = `${img.width}x${img.height}`;
          const sizeStr = file.size > 1024 * 1024 
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
            : `${Math.round(file.size / 1024)} KB`;
            
          addMedia({
            name: file.name,
            category: category,
            imageUrl: dataUrl,
            fileSize: sizeStr,
            resolution: resolution
          });
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
      count++;
    });
    if (count > 0) {
      showToast(`Successfully uploaded ${count} image(s).`);
    }
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const onDragLeave = () => {
    setDragging(false);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files, uploadCategory);
  };

  const triggerBrowse = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleBrowseSelect = (e) => {
    handleFiles(e.target.files, uploadCategory);
    e.target.value = ""; // Reset file select input
  };

  // ── Hover Actions ──
  const handleCopyUrl = (item, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(item.imageUrl)
      .then(() => showToast(`Link copied: ${item.name}`))
      .catch(() => showToast("Failed to copy link."));
  };

  const handleDownload = (item, e) => {
    e.stopPropagation();
    const link = document.createElement("a");
    link.href = item.imageUrl;
    link.download = item.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Downloading: ${item.name}`);
  };

  const triggerReplace = (item, e) => {
    e.stopPropagation();
    replacingIdRef.current = item.id;
    if (replaceInputRef.current) {
      replaceInputRef.current.click();
    }
  };

  const handleReplaceSelect = (e) => {
    const file = e.target.files[0];
    const id = replacingIdRef.current;
    if (file && id) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        const img = new Image();
        img.onload = () => {
          const resolution = `${img.width}x${img.height}`;
          const sizeStr = file.size > 1024 * 1024 
            ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
            : `${Math.round(file.size / 1024)} KB`;
            
          updateMedia(id, {
            name: file.name,
            imageUrl: dataUrl,
            fileSize: sizeStr,
            resolution: resolution
          });
          showToast(`Replaced image: ${file.name}`);
          // If drawer is open with this item, update it
          setSelectedItem(prev => prev && prev.id === id ? { ...prev, name: file.name, imageUrl: dataUrl, fileSize: sizeStr, resolution: resolution } : prev);
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    }
    e.target.value = ""; // Reset input
    replacingIdRef.current = null;
  };

  const handleDeleteItem = (item, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to permanently delete "${item.name}" from your media assets?`)) {
      deleteMedia(item.id);
      showToast(`Deleted asset: ${item.name}`);
      if (selectedItem?.id === item.id) {
        setSelectedItem(null);
      }
    }
  };

  // ── Filters & Search ──
  const filteredItems = useMemo(() => {
    let items = [...mediaItems];
    if (activeCategory !== "All") {
      items = items.filter(m => m.category === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      items = items.filter(m => m.name.toLowerCase().includes(q));
    }
    return items;
  }, [mediaItems, activeCategory, search]);

  const activeSelectedDetails = useMemo(() => {
    if (!selectedItem) return null;
    return mediaItems.find(m => m.id === selectedItem.id) || selectedItem;
  }, [mediaItems, selectedItem]);

  const handleUpdateDetails = (fields) => {
    if (!selectedItem) return;
    updateMedia(selectedItem.id, fields);
    showToast("Media details updated.");
  };

  return (
    <div className="admin-view-container med-root">
      {/* Header */}
      <div className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Media &amp; Asset Library</h1>
          <p className="admin-page-subtitle">Upload, manage, and replace visual assets, banners, and product catalog files across the store.</p>
        </div>
      </div>

      {/* Sticky Action and Filtering Bar */}
      <div className="admin-sticky-action-bar">
        {/* Category Filters */}
        <div className="med-categories-nav">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`med-category-btn ${activeCategory === cat ? "is-active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Toolbar Controls */}
        <div className="widget-card med-toolbar">
          <div className="med-search-wrap">
            <i className="pi pi-search search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search images by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="med-upload-settings" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div className="upload-cat-picker" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569' }}>Category:</label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="toolbar-select"
                style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              >
                {CATEGORIES.filter(c => c !== "All").map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <button className="admin-action-btn" onClick={triggerBrowse}>
              <i className="pi pi-upload mr-2" /> Upload Media
            </button>
            {/* Secret Inputs */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              multiple
              accept="image/*"
              onChange={handleBrowseSelect}
            />
            <input
              type="file"
              ref={replaceInputRef}
              style={{ display: "none" }}
              accept="image/*"
              onChange={handleReplaceSelect}
            />
          </div>
        </div>
      </div>

      {/* Media Main Workspace */}
      <div className={`med-workspace-layout ${activeSelectedDetails ? "drawer-open" : ""}`}>
        
        {/* Upload Zone & Grid Pane */}
        <div className="med-content-pane">
          {/* Drag and Drop Zone */}
          <div
            className={`med-drop-zone ${dragging ? "is-dragging" : ""}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={triggerBrowse}
          >
            <div className="drop-zone-content">
              <i className="pi pi-images drop-icon" />
              <h3>Drag &amp; Drop visual assets here</h3>
              <p>Supports PNG, JPG, JPEG, and WebP formats. Files will automatically upload to the <strong>{uploadCategory}</strong> category.</p>
              <button className="browse-btn" type="button">Or browse local files</button>
            </div>
          </div>

          {/* Media Grid */}
          <div className="widget-card med-grid-card">
            <div className="widget-header">
              <h3>Stored Media Items ({filteredItems.length})</h3>
            </div>
            <div className="widget-body">
              {filteredItems.length === 0 ? (
                <div className="med-empty-state">
                  <i className="pi pi-image empty-icon" />
                  <p>No media files found matching the search query or category filter.</p>
                </div>
              ) : (
                <div className="med-grid">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      className={`med-item-card ${activeSelectedDetails?.id === item.id ? "is-selected" : ""}`}
                      onClick={() => setSelectedItem(item)}
                    >
                      {/* Image Frame */}
                      <div className="med-thumbnail-frame">
                        <img src={item.imageUrl} alt={item.name} loading="lazy" />
                        
                        {/* Hover Overlay Actions */}
                        <div className="med-card-overlay">
                          <button className="overlay-act-btn preview" title="Preview Large" onClick={(e) => { e.stopPropagation(); setPreviewItem(item); }}>
                            <i className="pi pi-eye" />
                          </button>
                          <button className="overlay-act-btn link" title="Copy URL" onClick={(e) => handleCopyUrl(item, e)}>
                            <i className="pi pi-link" />
                          </button>
                          <button className="overlay-act-btn download" title="Download" onClick={(e) => handleDownload(item, e)}>
                            <i className="pi pi-download" />
                          </button>
                          <button className="overlay-act-btn replace" title="Replace File" onClick={(e) => triggerReplace(item, e)}>
                            <i className="pi pi-refresh" />
                          </button>
                          <button className="overlay-act-btn delete" title="Delete" onClick={(e) => handleDeleteItem(item, e)}>
                            <i className="pi pi-trash" />
                          </button>
                        </div>
                      </div>

                      {/* Details Strip */}
                      <div className="med-card-details">
                        <span className="med-card-name" title={item.name}>{item.name}</span>
                        <div className="med-card-meta">
                          <span className="med-meta-cat">{item.category}</span>
                          <span className="med-meta-date">{item.uploadDate}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Detail Side Drawer */}
        {activeSelectedDetails && (
          <div className="med-detail-drawer">
            <div className="drawer-hdr">
              <h3>Asset Details</h3>
              <button className="drawer-close-btn" onClick={() => setSelectedItem(null)}>
                <i className="pi pi-times" />
              </button>
            </div>
            
            <div className="drawer-preview-frame">
              <img src={activeSelectedDetails.imageUrl} alt={activeSelectedDetails.name} />
            </div>

            <div className="drawer-details-form">
              <div className="detail-group">
                <label>File ID</label>
                <input type="text" readOnly value={activeSelectedDetails.id} className="drawer-input-readonly" />
              </div>
              <div className="detail-group">
                <label>File Name</label>
                <input
                  type="text"
                  value={activeSelectedDetails.name}
                  onChange={(e) => handleUpdateDetails({ name: e.target.value })}
                  className="drawer-input"
                />
              </div>
              <div className="detail-group">
                <label>Category</label>
                <select
                  value={activeSelectedDetails.category}
                  onChange={(e) => handleUpdateDetails({ category: e.target.value })}
                  className="drawer-select"
                >
                  {CATEGORIES.filter(c => c !== "All").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              
              <div className="detail-meta-grid">
                <div className="meta-tile">
                  <span className="tile-lbl">File Size</span>
                  <strong className="tile-val">{activeSelectedDetails.fileSize}</strong>
                </div>
                <div className="meta-tile">
                  <span className="tile-lbl">Resolution</span>
                  <strong className="tile-val">{activeSelectedDetails.resolution}</strong>
                </div>
                <div className="meta-tile">
                  <span className="tile-lbl">Upload Date</span>
                  <strong className="tile-val">{activeSelectedDetails.uploadDate}</strong>
                </div>
              </div>

              <div className="drawer-actions-strip">
                <button className="drawer-action-btn copy-btn" onClick={(e) => handleCopyUrl(activeSelectedDetails, e)}>
                  <i className="pi pi-copy mr-2" /> Copy Data URL
                </button>
                <button className="drawer-action-btn replace-btn" onClick={(e) => triggerReplace(activeSelectedDetails, e)}>
                  <i className="pi pi-refresh mr-2" /> Replace Image
                </button>
                <button className="drawer-action-btn delete-btn" onClick={(e) => handleDeleteItem(activeSelectedDetails, e)}>
                  <i className="pi pi-trash mr-2" /> Delete Asset
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Preview Modal */}
      {previewItem && (
        <div className="med-lightbox-overlay" onClick={() => setPreviewItem(null)}>
          <div className="med-lightbox-box" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-hdr">
              <h3>{previewItem.name}</h3>
              <button className="lightbox-close" onClick={() => setPreviewItem(null)}>
                <i className="pi pi-times" />
              </button>
            </div>
            <div className="lightbox-image-wrap">
              <img src={previewItem.imageUrl} alt={previewItem.name} />
            </div>
            <div className="lightbox-footer">
              <span>Category: <strong>{previewItem.category}</strong></span>
              <span>Size: <strong>{previewItem.fileSize}</strong></span>
              <span>Resolution: <strong>{previewItem.resolution}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Floating Clipboard/Feedback Toast */}
      {toastMessage && (
        <div className="med-feedback-toast">
          <i className="pi pi-check-circle toast-icon" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default MediaLibraryView;
