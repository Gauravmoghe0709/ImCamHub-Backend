const express = require("express");
const upload = require("../middlewares/Upload");
const protectedRoute = require("../middlewares/Authmiddleware");

const router = express.Router()
const {
  getPublicCaseworkerPortalHero,
  getAllCaseworkerPortalHeroes,
  getCaseworkerPortalHeroById,
  createCaseworkerPortalHero,
  updateCaseworkerPortalHero,
  deleteCaseworkerPortalHero,
  toggleCaseworkerPortalHeroStatus,
} = require("../controllers/CaseworkerPortal controllers/CaseworkerPortalHero.controllers");
const {
  getPublicCaseworkerPortalContent,
  getAllCaseworkerPortalContent,
  getCaseworkerPortalContentById,
  createCaseworkerPortalContent,
  updateCaseworkerPortalContent,
  deleteCaseworkerPortalContent,
  toggleCaseworkerPortalContentStatus,
} = require("../controllers/CaseworkerPortal controllers/CaseworkerPortalContent.controller");
const {
  getPublicCaseworkerDailyWorkflow,
  getAllCaseworkerDailyWorkflow,
  getCaseworkerDailyWorkflowById,
  createCaseworkerDailyWorkflow,
  updateCaseworkerDailyWorkflow,
  deleteCaseworkerDailyWorkflow,
  toggleCaseworkerDailyWorkflowStatus,
} = require("../controllers/CaseworkerPortal controllers/CaseworkerDailyWorkflow.controller");
const {
  getCaseworkerPortalHeader,
  createCaseworkerPortalHeader,
  updateCaseworkerPortalHeader,
  deleteCaseworkerPortalHeader,
} = require("../controllers/CaseworkerPortal controllers/CaseworkerPortalHeader.controller");

const {
  getAllCaseworkerPortalCards,
  adminGetAllCaseworkerPortalCards,
  getCaseworkerPortalCardById,
  createCaseworkerPortalCard,
  updateCaseworkerPortalCard,
  deleteCaseworkerPortalCard,
} = require("../controllers/CaseworkerPortal controllers/CaseworkerPortalCard.controller");

const {
  getPublicCaseworkerPortalFaqHeader,
  getCaseworkerPortalFaqHeader,
  createCaseworkerPortalFaqHeader,
  updateCaseworkerPortalFaqHeader,
  deleteCaseworkerPortalFaqHeader,
} = require("../controllers/CaseworkerPortal controllers/CaseworkerPortalFaqHeader.controller");

const {
  getPublicCaseworkerPortalFaqs,
  getAllCaseworkerPortalFaqs,
  getCaseworkerPortalFaqById,
  createCaseworkerPortalFaq,
  updateCaseworkerPortalFaq,
  deleteCaseworkerPortalFaq,
} = require("../controllers/CaseworkerPortal controllers/CaseworkerPortalFaq.controller");

const {
  getCaseworkerPortalCta,
  createCaseworkerPortalCta,
  getAllCaseworkerPortalCtas,
  getCaseworkerPortalCtaById,
  updateCaseworkerPortalCta,
  deleteCaseworkerPortalCta,
  toggleCaseworkerPortalCtaStatus,
} = require("../controllers/CaseworkerPortal controllers/CaseworkerPortalCta.controller");



// =====================================================
// Admin Dashboard Hero — Public Route
// =====================================================
router.get("/public/admin-dashboard-hero", getPublicCaseworkerPortalHero);

// =====================================================
// Admin Dashboard Hero — Admin Routes
router.post(
  "/admin/dashboard/hero",
  protectedRoute,
  upload.single("dashboardImage"),
  createCaseworkerPortalHero
);

router.get(
  "/admin/dashboard/hero",
  protectedRoute,
  getAllCaseworkerPortalHeroes
);

router.get(
  "/admin/dashboard/hero/:id",
  protectedRoute,
  getCaseworkerPortalHeroById
);

router.put(
  "/admin/dashboard/hero/:id",
  protectedRoute,
  upload.single("dashboardImage"),
  updateCaseworkerPortalHero
);

router.delete(
  "/admin/dashboard/hero/:id",
  protectedRoute,
  deleteCaseworkerPortalHero
);

router.patch(
  "/admin/dashboard/hero/:id/status",
  protectedRoute,
  toggleCaseworkerPortalHeroStatus
);


// =====================================================
// Caseworker Portal Content — Public Route
// =====================================================
router.get("/caseworker-portal", getPublicCaseworkerPortalContent);

// =====================================================
// Caseworker Portal Content — Admin Routes
// =====================================================
router.post(
  "/admin/caseworker-portal",
  protectedRoute,
  upload.single("hero_image"),
  createCaseworkerPortalContent
);

router.get(
  "/admin/caseworker-portal",
  protectedRoute,
  getAllCaseworkerPortalContent
);

router.get(
  "/admin/caseworker-portal/:id",
  protectedRoute,
  getCaseworkerPortalContentById
);

router.put(
  "/admin/caseworker-portal/:id",
  protectedRoute,
  upload.single("hero_image"),
  updateCaseworkerPortalContent
);

router.delete(
  "/admin/caseworker-portal/:id",
  protectedRoute,
  deleteCaseworkerPortalContent
);

router.patch(
  "/admin/caseworker-portal/:id/status",
  protectedRoute,
  toggleCaseworkerPortalContentStatus
);

// =====================================================
// Caseworker Daily Workflow — Public Route
// =====================================================
router.get("/caseworker-portal/day-in-the-life", getPublicCaseworkerDailyWorkflow);

// =====================================================
// Caseworker Daily Workflow — Admin Routes
// =====================================================
router.post(
  "/admin/caseworker-portal/day-in-the-life",
  protectedRoute,
  upload.single("section_image"),
  createCaseworkerDailyWorkflow
);

router.get(
  "/admin/caseworker-portal/day-in-the-life",
  protectedRoute,
  getAllCaseworkerDailyWorkflow
);

router.get(
  "/admin/caseworker-portal/day-in-the-life/:id",
  protectedRoute,
  getCaseworkerDailyWorkflowById
);

router.put(
  "/admin/caseworker-portal/day-in-the-life/:id",
  protectedRoute,
  upload.single("section_image"),
  updateCaseworkerDailyWorkflow
);

router.delete(
  "/admin/caseworker-portal/day-in-the-life/:id",
  protectedRoute,
  deleteCaseworkerDailyWorkflow
);

router.patch(
  "/admin/caseworker-portal/day-in-the-life/:id/status",
  protectedRoute,
  toggleCaseworkerDailyWorkflowStatus
);


// =====================================================
// Caseworker Portal Header — Public Route
// =====================================================
router.get("/caseworker-portal/header", getCaseworkerPortalHeader);

// =====================================================
// Caseworker Portal Header — Admin Routes
// =====================================================
router.get("/admin/caseworker-portal/header", protectedRoute, getCaseworkerPortalHeader);
router.post("/admin/caseworker-portal/header", protectedRoute, createCaseworkerPortalHeader);
router.put("/admin/caseworker-portal/header/:id", protectedRoute, updateCaseworkerPortalHeader);
router.delete("/admin/caseworker-portal/header/:id", protectedRoute, deleteCaseworkerPortalHeader);

// =====================================================
// Caseworker Portal Cards — Public Route
// =====================================================
router.get("/caseworker-portal/cards", getAllCaseworkerPortalCards);

// =====================================================
// Caseworker Portal Cards — Admin Routes
// =====================================================
router.get("/admin/caseworker-portal/cards", protectedRoute, adminGetAllCaseworkerPortalCards);
router.get("/admin/caseworker-portal/cards/:id", protectedRoute, getCaseworkerPortalCardById);
router.post("/admin/caseworker-portal/cards", protectedRoute, createCaseworkerPortalCard);
router.put("/admin/caseworker-portal/cards/:id", protectedRoute, updateCaseworkerPortalCard);
router.delete("/admin/caseworker-portal/cards/:id", protectedRoute, deleteCaseworkerPortalCard);

// =====================================================
// Caseworker Portal FAQ Header — Public Route
// =====================================================
router.get("/caseworker-portal/faq-header", getPublicCaseworkerPortalFaqHeader);

// =====================================================
// Caseworker Portal FAQ Header — Admin Routes
// =====================================================
router.get("/admin/caseworker-portal/faq-header", protectedRoute, getCaseworkerPortalFaqHeader);
router.post("/admin/caseworker-portal/faq-header", protectedRoute, createCaseworkerPortalFaqHeader);
router.put("/admin/caseworker-portal/faq-header/:id", protectedRoute, updateCaseworkerPortalFaqHeader);
router.delete("/admin/caseworker-portal/faq-header/:id", protectedRoute, deleteCaseworkerPortalFaqHeader);

// =====================================================
// Caseworker Portal FAQ Items — Public Route
// =====================================================
router.get("/caseworker-portal/faqs", getPublicCaseworkerPortalFaqs);

// =====================================================
// Caseworker Portal FAQ Items — Admin Routes
// =====================================================
router.get("/admin/caseworker-portal/faqs", protectedRoute, getAllCaseworkerPortalFaqs);
router.get("/admin/caseworker-portal/faqs/:id", protectedRoute, getCaseworkerPortalFaqById);
router.post("/admin/caseworker-portal/faqs", protectedRoute, createCaseworkerPortalFaq);
router.put("/admin/caseworker-portal/faqs/:id", protectedRoute, updateCaseworkerPortalFaq);
router.delete("/admin/caseworker-portal/faqs/:id", protectedRoute, deleteCaseworkerPortalFaq);

// =====================================================
// Caseworker Portal CTA — Public Route
// =====================================================
router.get("/caseworker-portal/cta", getCaseworkerPortalCta);

// =====================================================
// Caseworker Portal CTA — Admin Routes
// =====================================================
router.post(
  "/admin/caseworker-portal/cta",
  protectedRoute,
  createCaseworkerPortalCta
);

router.get(
  "/admin/caseworker-portal/cta",
  protectedRoute,
  getAllCaseworkerPortalCtas
);

router.get(
  "/admin/caseworker-portal/cta/:id",
  protectedRoute,
  getCaseworkerPortalCtaById
);

router.put(
  "/admin/caseworker-portal/cta/:id",
  protectedRoute,
  updateCaseworkerPortalCta
);

router.delete(
  "/admin/caseworker-portal/cta/:id",
  protectedRoute,
  deleteCaseworkerPortalCta
);

router.patch(
  "/admin/caseworker-portal/cta/:id/status",
  protectedRoute,
  toggleCaseworkerPortalCtaStatus
);

module.exports = router;