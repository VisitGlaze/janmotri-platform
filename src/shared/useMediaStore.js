import { create } from "zustand";
import { persist } from "zustand/middleware";

// Static Image imports
import oneLiter1Img from "../assets/images/1 liter-1.png";
import oneLiterImg from "../assets/images/1 liter.png";
import fifteenKgImg from "../assets/images/15 kg.png";
import fifteenLitersImg from "../assets/images/15 liters.png";
import fiveLitersImg from "../assets/images/5 liters.png";
import cleaningImg from "../assets/images/Cleaning.png";
import extractionImg from "../assets/images/Extraction.png";
import filteringImg from "../assets/images/Filtering.png";
import frameImg from "../assets/images/Frame 2085660915.png";
import peanutImg from "../assets/images/PeanutImg.png";
import selectionImg from "../assets/images/Selection.png";
import testingImg from "../assets/images/Testing.png";
import aboutUsHeroBgImg from "../assets/images/about us hero_background_image.png";
import blog1Img from "../assets/images/blog-1.png";
import blog2Img from "../assets/images/blog-2.png";
import blog3Img from "../assets/images/blog-3.png";
import burstImg from "../assets/images/burst.png";
import coldPressedImg from "../assets/images/cold-pressed.png";
import deliveryTruckImg from "../assets/images/delivery-truck.png";
import dividerImg from "../assets/images/divider.png";
import farmBgImg from "../assets/images/farm-bg.png";
import farmingImg from "../assets/images/farming.png";
import filtrationImg from "../assets/images/filtration.png";
import fssaiImg from "../assets/images/fssai.png";
import heroBgImg from "../assets/images/hero-bg.png";
import heroProductsImg from "../assets/images/hero-products.png";
import insta1Img from "../assets/images/insta-1.png";
import insta2Img from "../assets/images/insta-2.png";
import insta3Img from "../assets/images/insta-3.png";
import insta4Img from "../assets/images/insta-4.png";
import insta5Img from "../assets/images/insta-5.png";
import insta6Img from "../assets/images/insta-6.png";
import isoImg from "../assets/images/iso.png";
import journeyBannerImg from "../assets/images/journey-banner.png";
import journeyBgImg from "../assets/images/journey-bg.png";
import journeyBg2Img from "../assets/images/journey-bg_2.png";
import logoImg from "../assets/images/logo.png";
import makeInIndiaImg from "../assets/images/make-in-india.png";
import navbarWaveImg from "../assets/images/navbar-wave.png";
import packagingImg from "../assets/images/packaging.png";
import promiseOilImg from "../assets/images/promise-oil.png";
import purificationImg from "../assets/images/purification.png";
import whyBgImg from "../assets/images/why-bg.png";
import whyProductImg from "../assets/images/why-product.png";

// Helper to construct seed media items
const seedMediaItems = [
  { id: "M-1001", name: "1 liter.png", category: "Products", imageUrl: oneLiterImg, uploadDate: "2026-06-01", fileSize: "149 KB", resolution: "1000x1000" },
  { id: "M-1002", name: "1 liter-1.png", category: "Products", imageUrl: oneLiter1Img, uploadDate: "2026-06-01", fileSize: "155 KB", resolution: "1000x1000" },
  { id: "M-1003", name: "5 liters.png", category: "Products", imageUrl: fiveLitersImg, uploadDate: "2026-06-01", fileSize: "207 KB", resolution: "1000x1000" },
  { id: "M-1004", name: "15 liters.png", category: "Products", imageUrl: fifteenLitersImg, uploadDate: "2026-05-30", fileSize: "213 KB", resolution: "1000x1000" },
  { id: "M-1005", name: "15 kg.png", category: "Products", imageUrl: fifteenKgImg, uploadDate: "2026-06-05", fileSize: "255 KB", resolution: "1000x1000" },
  { id: "M-1006", name: "promise-oil.png", category: "Products", imageUrl: promiseOilImg, uploadDate: "2026-06-06", fileSize: "523 KB", resolution: "1200x1200" },
  { id: "M-1007", name: "hero-bg.png", category: "Banners", imageUrl: heroBgImg, uploadDate: "2026-05-15", fileSize: "5.4 MB", resolution: "1920x1080" },
  { id: "M-1008", name: "journey-banner.png", category: "Banners", imageUrl: journeyBannerImg, uploadDate: "2026-05-20", fileSize: "1.9 MB", resolution: "1600x600" },
  { id: "M-1009", name: "Cleaning.png", category: "Gallery", imageUrl: cleaningImg, uploadDate: "2026-06-02", fileSize: "1.9 MB", resolution: "1200x800" },
  { id: "M-1010", name: "Extraction.png", category: "Gallery", imageUrl: extractionImg, uploadDate: "2026-06-02", fileSize: "2.5 MB", resolution: "1200x800" },
  { id: "M-1011", name: "Filtering.png", category: "Gallery", imageUrl: filteringImg, uploadDate: "2026-06-02", fileSize: "2.6 MB", resolution: "1200x800" },
  { id: "M-1012", name: "Selection.png", category: "Gallery", imageUrl: selectionImg, uploadDate: "2026-06-02", fileSize: "3.5 MB", resolution: "1200x800" },
  { id: "M-1013", name: "Testing.png", category: "Gallery", imageUrl: testingImg, uploadDate: "2026-06-02", fileSize: "2.2 MB", resolution: "1200x800" },
  { id: "M-1014", name: "about us hero_background_image.png", category: "About Us", imageUrl: aboutUsHeroBgImg, uploadDate: "2026-05-18", fileSize: "4.3 MB", resolution: "1920x1080" },
  { id: "M-1015", name: "journey-bg.png", category: "About Us", imageUrl: journeyBgImg, uploadDate: "2026-05-18", fileSize: "741 KB", resolution: "1000x600" },
  { id: "M-1016", name: "journey-bg_2.png", category: "About Us", imageUrl: journeyBg2Img, uploadDate: "2026-05-19", fileSize: "396 KB", resolution: "1000x600" },
  { id: "M-1017", name: "farm-bg.png", category: "About Us", imageUrl: farmBgImg, uploadDate: "2026-05-20", fileSize: "2.3 MB", resolution: "1200x800" },
  { id: "M-1018", name: "insta-1.png", category: "Instagram", imageUrl: insta1Img, uploadDate: "2026-06-05", fileSize: "260 KB", resolution: "800x800" },
  { id: "M-1019", name: "insta-2.png", category: "Instagram", imageUrl: insta2Img, uploadDate: "2026-06-05", fileSize: "292 KB", resolution: "800x800" },
  { id: "M-1020", name: "insta-3.png", category: "Instagram", imageUrl: insta3Img, uploadDate: "2026-06-05", fileSize: "252 KB", resolution: "800x800" },
  { id: "M-1021", name: "insta-4.png", category: "Instagram", imageUrl: insta4Img, uploadDate: "2026-06-05", fileSize: "181 KB", resolution: "800x800" },
  { id: "M-1022", name: "insta-5.png", category: "Instagram", imageUrl: insta5Img, uploadDate: "2026-06-05", fileSize: "232 KB", resolution: "800x800" },
  { id: "M-1023", name: "insta-6.png", category: "Instagram", imageUrl: insta6Img, uploadDate: "2026-06-05", fileSize: "207 KB", resolution: "800x800" },
  { id: "M-1024", name: "blog-1.png", category: "Blog", imageUrl: blog1Img, uploadDate: "2026-06-07", fileSize: "660 KB", resolution: "800x500" },
  { id: "M-1025", name: "blog-2.png", category: "Blog", imageUrl: blog2Img, uploadDate: "2026-06-08", fileSize: "976 KB", resolution: "800x500" },
  { id: "M-1026", name: "blog-3.png", category: "Blog", imageUrl: blog3Img, uploadDate: "2026-06-09", fileSize: "762 KB", resolution: "800x500" },
  { id: "M-1027", name: "logo.png", category: "Other", imageUrl: logoImg, uploadDate: "2026-05-10", fileSize: "31 KB", resolution: "300x100" },
  { id: "M-1028", name: "fssai.png", category: "Other", imageUrl: fssaiImg, uploadDate: "2026-05-10", fileSize: "13 KB", resolution: "150x80" },
  { id: "M-1029", name: "iso.png", category: "Other", imageUrl: isoImg, uploadDate: "2026-05-10", fileSize: "13 KB", resolution: "100x100" },
  { id: "M-1030", name: "make-in-india.png", category: "Other", imageUrl: makeInIndiaImg, uploadDate: "2026-05-10", fileSize: "22 KB", resolution: "200x100" },
  { id: "M-1031", name: "navbar-wave.png", category: "Other", imageUrl: navbarWaveImg, uploadDate: "2026-05-10", fileSize: "56 KB", resolution: "1920x50" },
  { id: "M-1032", name: "peanut.png", category: "Other", imageUrl: peanutImg, uploadDate: "2026-05-10", fileSize: "145 KB", resolution: "300x300" },
  { id: "M-1033", name: "burst.png", category: "Other", imageUrl: burstImg, uploadDate: "2026-05-10", fileSize: "13 KB", resolution: "100x100" },
  { id: "M-1034", name: "divider.png", category: "Other", imageUrl: dividerImg, uploadDate: "2026-05-10", fileSize: "25 KB", resolution: "400x40" }
];

export const useMediaStore = create(
  persist(
    (set, get) => ({
      mediaItems: seedMediaItems,
      imageMappings: {},

      // Actions
      addMedia: (item) => set((state) => {
        const nextNum = Math.max(...state.mediaItems.map(m => parseInt(m.id.split("-")[1], 10) || 1000)) + 1;
        const newId = `M-${nextNum}`;
        const newItem = {
          id: newId,
          uploadDate: new Date().toISOString().split("T")[0],
          fileSize: "N/A",
          resolution: "1000x1000",
          ...item
        };
        return {
          mediaItems: [newItem, ...state.mediaItems]
        };
      }),

      deleteMedia: (id) => set((state) => {
        // Clean up mappings if the deleted image was mapped
        const deletedItem = state.mediaItems.find(m => m.id === id);
        const updatedMappings = { ...state.imageMappings };
        if (deletedItem) {
          Object.keys(updatedMappings).forEach(key => {
            if (updatedMappings[key] === deletedItem.imageUrl) {
              delete updatedMappings[key];
            }
          });
        }
        return {
          mediaItems: state.mediaItems.filter(m => m.id !== id),
          imageMappings: updatedMappings
        };
      }),

      updateMedia: (id, updatedFields) => set((state) => {
        const updatedItems = state.mediaItems.map(m => {
          if (m.id === id) {
            // If imageUrl changes, we should also update mappings referencing the old imageUrl
            if (updatedFields.imageUrl && m.imageUrl !== updatedFields.imageUrl) {
              setTimeout(() => {
                set((nestedState) => {
                  const mappings = { ...nestedState.imageMappings };
                  Object.keys(mappings).forEach(key => {
                    if (mappings[key] === m.imageUrl) {
                      mappings[key] = updatedFields.imageUrl;
                    }
                  });
                  return { imageMappings: mappings };
                });
              }, 0);
            }
            return { ...m, ...updatedFields };
          }
          return m;
        });
        return { mediaItems: updatedItems };
      }),

      updateMapping: (key, imageUrl) => set((state) => ({
        imageMappings: {
          ...state.imageMappings,
          [key]: imageUrl
        }
      })),

      getMediaByCategory: (category) => {
        const items = get().mediaItems;
        if (category === "All") return items;
        return items.filter(m => m.category === category);
      }
    }),
    {
      name: "janmotri-media-storage",
      partialize: (state) => ({
        // We only persist the mediaItems that are user-uploaded (not the static bundle references) and mapping config.
        // But for convenience, let's persist the full state since indexDB/localStorage size is okay for base64 strings.
        mediaItems: state.mediaItems,
        imageMappings: state.imageMappings
      })
    }
  )
);
