const express = require("express");
const upload = require("../middlewares/Upload");
const protectedRoute = require("../middlewares/Authmiddleware");
const {
  getPublicAdminDashboardHero,
  getAllAdminDashboardHeroes,
  getAdminDashboardHeroById,
  createAdminDashboardHero,
  updateAdminDashboardHero,
  deleteAdminDashboardHero,
  toggleAdminDashboardHeroStatus,
} = require("../controllers/AdminDashboard controllers/AdminDashboardHero.controller");
const {
  getPublicAdminDashboardIntro,
  getAllAdminDashboardIntros,
  getAdminDashboardIntroById,
  createAdminDashboardIntro,
  updateAdminDashboardIntro,
  deleteAdminDashboardIntro,
  toggleAdminDashboardIntroStatus,
} = require("../controllers/AdminDashboard controllers/AdminDashboardIntro.controller");
const {
  getPublicAdminDashboardFeaturesHeader,
  getPublicAdminDashboardFeatureCards,
  getPublicAdminDashboardFeaturesSection,
  getAdminDashboardFeaturesHeader,
  createAdminDashboardFeaturesHeader,
  updateAdminDashboardFeaturesHeader,
  deleteAdminDashboardFeaturesHeader,
  getAllAdminDashboardFeatureCards,
  getAdminDashboardFeatureCardById,
  createAdminDashboardFeatureCard,
  updateAdminDashboardFeatureCard,
  deleteAdminDashboardFeatureCard,
} = require("../controllers/AdminDashboard controllers/AdminDashboardFeatures.controller");
const {
  getFaqHeader,
  createFaqHeader,
  updateFaqHeader,
  deleteFaqHeader,
} = require("../controllers/AdminDashboard controllers/faqHeaderController");
const {
  getFaqs,
  getFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
} = require("../controllers/AdminDashboard controllers/faqController");
const {
  getFeaturePageCta,
  getAllFeaturePageCtas,
  getFeaturePageCtaById,
  createFeaturePageCta,
  updateFeaturePageCta,
  deleteFeaturePageCta,
} = require("../controllers/AdminDashboard controllers/featurePageCtaController");
const router = express.Router();

// =====================================================
// Admin Dashboard Hero — Public Route
// =====================================================
router.get("/public/admin-dashboard-hero", getPublicAdminDashboardHero);

// =====================================================
// Admin Dashboard Hero — Admin Routes
router.post(
  "/admin/dashboard/hero",
  protectedRoute,
  upload.single("dashboardImage"),
  createAdminDashboardHero
);

router.get(
  "/admin/dashboard/hero",
  protectedRoute,
  getAllAdminDashboardHeroes
);

router.get(
  "/admin/dashboard/hero/:id",
  protectedRoute,
  getAdminDashboardHeroById
);

router.put(
  "/admin/dashboard/hero/:id",
  protectedRoute,
  upload.single("dashboardImage"),
  updateAdminDashboardHero
);

router.delete(
  "/admin/dashboard/hero/:id",
  protectedRoute,
  deleteAdminDashboardHero
);

router.patch(
  "/admin/dashboard/hero/:id/status",
  protectedRoute,
  toggleAdminDashboardHeroStatus
);

// =====================================================
// Admin Dashboard Intro — Public Route
// =====================================================


router.get("/admin-dashboard/intro", getPublicAdminDashboardIntro);

// =====================================================
// Admin Dashboard Intro — Admin Routes
// =====================================================
router.post(
  "/admin/dashboard/intro",
  protectedRoute,
  upload.single("image"),
  createAdminDashboardIntro
);

router.get("/admin/dashboard/intro", protectedRoute, getAllAdminDashboardIntros);

router.get("/admin/dashboard/intro/:id", protectedRoute, getAdminDashboardIntroById);

router.put(
  "/admin/dashboard/intro/:id",
  protectedRoute,
  upload.single("image"),
  updateAdminDashboardIntro
);

router.delete("/admin/dashboard/intro/:id", protectedRoute, deleteAdminDashboardIntro);

router.patch(
  "/admin/dashboard/intro/:id/status",
  protectedRoute,
  toggleAdminDashboardIntroStatus
);

// =====================================================
// Admin Dashboard Features — Public Routes
// =====================================================
router.get("/admin-dashboard/features/header", getPublicAdminDashboardFeaturesHeader);
router.get("/admin-dashboard/features", getPublicAdminDashboardFeatureCards);
router.get("/admin-dashboard/features-section", getPublicAdminDashboardFeaturesSection);

// =====================================================
// Admin Dashboard Features — Admin Header Routes
// =====================================================
router.get("/admin/dashboard/features/header", protectedRoute, getAdminDashboardFeaturesHeader);
router.post("/admin/dashboard/features/header", protectedRoute, createAdminDashboardFeaturesHeader);
router.put("/admin/dashboard/features/header/:id", protectedRoute, updateAdminDashboardFeaturesHeader);
router.delete("/admin/dashboard/features/header/:id", protectedRoute, deleteAdminDashboardFeaturesHeader);

// =====================================================
// Admin Dashboard Features — Admin Card Routes
// =====================================================
router.get("/admin/dashboard/features/cards", protectedRoute, getAllAdminDashboardFeatureCards);
router.get("/admin/dashboard/features/cards/:id", protectedRoute, getAdminDashboardFeatureCardById);
router.post("/admin/dashboard/features/cards", protectedRoute, createAdminDashboardFeatureCard);
router.put("/admin/dashboard/features/cards/:id", protectedRoute, updateAdminDashboardFeatureCard);
router.delete("/admin/dashboard/features/cards/:id", protectedRoute, deleteAdminDashboardFeatureCard);

// =====================================================
// Admin Dashboard FAQ — Public Routes
// =====================================================
router.get("/admin-dashboard/faq/header", getFaqHeader);
router.get("/admin-dashboard/faq", getFaqs);

// =====================================================
// Admin Dashboard FAQ — Admin Header Routes
// =====================================================
router.get("/admin/dashboard/faq/header", protectedRoute, getFaqHeader);
router.post("/admin/dashboard/faq/header", protectedRoute, createFaqHeader);
router.put("/admin/dashboard/faq/header/:id", protectedRoute, updateFaqHeader);
router.delete("/admin/dashboard/faq/header/:id", protectedRoute, deleteFaqHeader);

// =====================================================
// Admin Dashboard FAQ — Admin FAQ Routes
// =====================================================
router.get("/admin/dashboard/faq", protectedRoute, getFaqs);
router.get("/admin/dashboard/faq/:id", protectedRoute, getFaqById);
router.post("/admin/dashboard/faq", protectedRoute, createFaq);
router.put("/admin/dashboard/faq/:id", protectedRoute, updateFaq);
router.delete("/admin/dashboard/faq/:id", protectedRoute, deleteFaq);


// =====================================================
// Feature Page CTA — Public Route
// =====================================================
router.get("/admin-dashboard/cta", getFeaturePageCta);

// =====================================================
// Feature Page CTA — Admin Routes
// =====================================================
router.get("/admin/admin-dashboard/cta", protectedRoute, getAllFeaturePageCtas);
router.get("/admin/admin-dashboard/cta/:id", protectedRoute, getFeaturePageCtaById);
router.post("/admin/admin-dashboard/cta", protectedRoute, createFeaturePageCta);
router.put("/admin/admin-dashboard/cta/:id", protectedRoute, updateFeaturePageCta);
router.delete("/admin/admin-dashboard/cta/:id", protectedRoute, deleteFeaturePageCta);

module.exports = router;
