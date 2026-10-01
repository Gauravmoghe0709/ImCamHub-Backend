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
  createPlan,
  getPlans,
  getPlanById,
  updatePlan,
  deletePlan,
  getPublicPlans,
} = require("../controllers/PricingPage controllers/Plan");
const {
  createFeatureCategory,
  getFeatureCategories,
  getFeatureCategoryById,
  updateFeatureCategory,
  deleteFeatureCategory,
  getPublicFeatureCategories,
} = require("../controllers/PricingPage controllers/Features");
const {
  createCTA,
  getCTAs,
  getCTAById,
  updateCTA,
  deleteCTA,
  getPublicCTA,
} = require("../controllers/PricingPage controllers/CTA");
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
// PUBLIC PRICING PAGE ROUTES
// =====================================================
router.get("/pricing/plans", getPublicPlans);
router.get("/pricing/features", getPublicFeatureCategories);
router.get("/pricing/cta", getPublicCTA);

// =====================================================
// ADMIN PRICING PLANS ROUTES
// =====================================================
router.post("/admin/pricing/plans", protectedRoute, createPlan);

router.get("/admin/pricing/plans", protectedRoute, getPlans);
router.get("/admin/pricing/plans/:id", protectedRoute, getPlanById);
router.put("/admin/pricing/plans/:id", protectedRoute, updatePlan);
router.delete("/admin/pricing/plans/:id", protectedRoute, deletePlan);

// =====================================================
// ADMIN PRICING FEATURES ROUTES
// =====================================================

router.post("/admin/pricing/features", protectedRoute, createFeatureCategory);

router.get("/admin/pricing/features", protectedRoute, getFeatureCategories);
router.get("/admin/pricing/features/:id", protectedRoute, getFeatureCategoryById);
router.put("/admin/pricing/features/:id", protectedRoute, updateFeatureCategory);
router.delete("/admin/pricing/features/:id", protectedRoute, deleteFeatureCategory);

// =====================================================
// ADMIN PRICING CTA ROUTES
// =====================================================
router.post("/admin/pricing/cta", protectedRoute, createCTA);
router.get("/admin/pricing/cta", protectedRoute, getCTAs);
router.get("/admin/pricing/cta/:id", protectedRoute, getCTAById);
router.put("/admin/pricing/cta/:id", protectedRoute, updateCTA);
router.delete("/admin/pricing/cta/:id", protectedRoute, deleteCTA);

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
  "/admin/final-cta",
  protectedRoute,
  upload.single("backgroundImage"),
  createFinalCta
);

router.get(
  "/admin/final-cta",
  protectedRoute,
  getAllFinalCtas
);

router.get(
  "/admin/final-cta/:id",
  protectedRoute,
  getFinalCtaById
);

router.put(
  "/admin/final-cta/:id",
  protectedRoute,
  upload.single("backgroundImage"),
  updateFinalCta
);

router.delete(
  "/admin/final-cta/:id",
  protectedRoute,
  deleteFinalCta
);


module.exports = router;
