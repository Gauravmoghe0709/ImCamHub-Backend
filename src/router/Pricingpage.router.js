const express = require("express");
const upload = require("../middlewares/Upload");
const protectedRoute = require("../middlewares/Authmiddleware");
const {
  createPricingPage,
  getPricingPageAdmin,
  updatePricingPage,
  deletePricingPage,
  getPublicPricingPage,
} = require("../controllers/PricingPage controllers/PricingPage.controller");
 const {
  createPricingCard,
  getAllPricingCards,
  getPricingCardById,
  updatePricingCard,
  deletePricingCard,
  getPublicPricingCards,
  getPublicPricingCardById,
  addCategory,
  updateCategory,
  deleteCategory,
  addFeature,
  removeFeature,
} = require("../controllers/PricingPage controllers/PricingCard.controller");
const {
  createPricingPageHeader,
  getPricingPageHeader,
  updatePricingPageHeader,
  deletePricingPageHeader,
  getPublicPricingPageHeader,
} = require("../controllers/PricingPage controllers/PricingPageHeader.controller");
const {
  createPricingPageFaq,
  getPricingPageFaqs,
  getPricingPageFaqById,
  updatePricingPageFaq,
  deletePricingPageFaq,
  getPublicPricingPageFaqs,
} = require("../controllers/PricingPage controllers/PricingPageFaq.controller");
const {
  getPublicFinalCta,
  createFinalCta,
  getAllFinalCtas,
  getFinalCtaById,
  updateFinalCta,
  deleteFinalCta,
} = require("../controllers/PricingPage controllers/PricingpageFinalCtaController");


const router = express.Router();

// =====================================================
// Public Pricing Page API
// =====================================================
router.get("/pricing-page", getPublicPricingPage);

// =====================================================
// Admin Pricing Page APIs
// =====================================================

router.post(
  "/admin/pricing-page",
  protectedRoute,
  upload.single("image"),
  createPricingPage
);

router.get("/admin/pricing-page", protectedRoute, getPricingPageAdmin);

router.put(
  "/admin/pricing-page/:id",
  protectedRoute,
  upload.single("image"),
  updatePricingPage
);

router.delete("/admin/pricing-page/:id", protectedRoute, deletePricingPage);

// =====================================================
// Public Pricing Cards API
// =====================================================
router.get("/public/pricing", getPublicPricingCards);
router.get("/public/pricing/:id", getPublicPricingCardById);

// =====================================================
// Admin Pricing Cards APIs
// =====================================================
router.post("/admin/pricing", protectedRoute, createPricingCard);
router.get("/admin/pricing", protectedRoute, getAllPricingCards);
router.get("/admin/pricing/:id", protectedRoute, getPricingCardById);
router.put("/admin/pricing/:id", protectedRoute, updatePricingCard);
router.delete("/admin/pricing/:id", protectedRoute, deletePricingCard);

// =====================================================
// Admin Pricing Card Categories APIs
// =====================================================
router.post("/admin/pricing/:id/categories", protectedRoute, addCategory);
router.put("/admin/pricing/:id/categories/:categoryId", protectedRoute, updateCategory);
router.delete("/admin/pricing/:id/categories/:categoryId", protectedRoute, deleteCategory);

// =====================================================
// Admin Pricing Card Category Features APIs
// =====================================================
router.post("/admin/pricing/:id/categories/:categoryId/features", protectedRoute, addFeature);
router.delete("/admin/pricing/:id/categories/:categoryId/features/:featureIndex", protectedRoute, removeFeature);

// =====================================================
// Public FAQ Header API
// =====================================================
router.get("/pricing-page/faq-header", getPublicPricingPageHeader);

// =====================================================
// Public FAQs API
// =====================================================
router.get("/pricing-page/faqs", getPublicPricingPageFaqs);

// =====================================================
// Admin FAQ Header APIs
// =====================================================
router.post(
  "/admin/pricing-page/faq-header",
  protectedRoute,
  createPricingPageHeader
);

router.get("/admin/pricing-page/faq-header", protectedRoute, getPricingPageHeader);

router.put(
  "/admin/pricing-page/faq-header/:id",
  protectedRoute,
  updatePricingPageHeader
);
router.delete("/admin/pricing-page/faq-header/:id", protectedRoute, deletePricingPageHeader);

// =====================================================
// Admin FAQs APIs
// =====================================================

router.post(
  "/admin/pricing-page/faqs",
  protectedRoute,
  createPricingPageFaq
);

router.get("/admin/pricing-page/faqs", protectedRoute, getPricingPageFaqs);

router.get("/admin/pricing-page/faqs/:id", protectedRoute, getPricingPageFaqById);

router.put(
  "/admin/pricing-page/faqs/:id",
  protectedRoute,
  updatePricingPageFaq
);
router.delete("/admin/pricing-page/faqs/:id", protectedRoute, deletePricingPageFaq);


// =====================================================
// Final CTA — Public Route
// =====================================================
router.get("/final-cta", getPublicFinalCta);

// =====================================================
// Final CTA — Admin Routes
// =====================================================
router.post(
  "/admin/pricing-page/cta",
  protectedRoute,
  upload.single("backgroundImage"),
  createFinalCta
);

router.get(
  "/admin/pricing-page/cta",
  protectedRoute,
  getAllFinalCtas
);

router.get(
  "/admin/pricing-page/cta/:id",
  protectedRoute,
  getFinalCtaById
);

router.put(
  "/admin/pricing-page/cta/:id",
  protectedRoute,
  upload.single("backgroundImage"),
  updateFinalCta
);

router.delete(
  "/admin/pricing-page/cta/:id",
  protectedRoute,
  deleteFinalCta
);


module.exports = router;
