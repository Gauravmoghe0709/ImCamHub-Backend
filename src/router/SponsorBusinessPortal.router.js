const express = require("express");
const upload = require("../middlewares/Upload");
const protectedRoute = require("../middlewares/Authmiddleware");

const router = express.Router()
const {
  getPublicSponsorBusinessHero,
  getAllSponsorBusinessHeroes,
  getSponsorBusinessHeroById,
  createSponsorBusinessHero,
  updateSponsorBusinessHero,
  deleteSponsorBusinessHero,
  toggleSponsorBusinessHeroStatus,
} = require("../controllers/SponsorBusiness Controllers/SponsorBusinessHero.controllers");
const {
  getPublicSponsorBusinessContent,
  getAllSponsorBusinessContent,
  getSponsorBusinessContentById,
  createSponsorBusinessContent,
  updateSponsorBusinessContent,
  deleteSponsorBusinessContent,
  toggleSponsorBusinessContentStatus,
} = require("../controllers/SponsorBusiness controllers/SponsorBusinessContent.controller");

const {
  getSponsorBusinessHeader,
  createSponsorBusinessHeader,
  updateSponsorBusinessHeader,
  deleteSponsorBusinessHeader,
} = require("../controllers/SponsorBusiness controllers/SponsorBusinessHeader.controller");

const {
  getAllSponsorBusinessCards,
  adminGetAllSponsorBusinessCards,
  getSponsorBusinessCardById,
  createSponsorBusinessCard,
  updateSponsorBusinessCard,
  deleteSponsorBusinessCard,
} = require("../controllers/SponsorBusiness controllers/SponsorBusinessCard.controller");

const {
  getPublicSponsorBusinessFaqHeader,
  getSponsorBusinessFaqHeader,
  createSponsorBusinessFaqHeader,
  updateSponsorBusinessFaqHeader,
  deleteSponsorBusinessFaqHeader,
} = require("../controllers/SponsorBusiness controllers/SponsorBusinessFaqHeader.controller");

const {
  getPublicSponsorBusinessFaqs,
  getAllSponsorBusinessFaqs,
  getSponsorBusinessFaqById,
  createSponsorBusinessFaq,
  updateSponsorBusinessFaq,
  deleteSponsorBusinessFaq,
} = require("../controllers/SponsorBusiness controllers/SponsorBusinessFaq.controller");

const {
  getSponsorBusinessCta,
  createSponsorBusinessCta,
  getAllSponsorBusinessCtas,
  getSponsorBusinessCtaById,
  updateSponsorBusinessCta,
  deleteSponsorBusinessCta,
  toggleSponsorBusinessCtaStatus,
} = require("../controllers/SponsorBusiness controllers/SponsorBusinessCta.controller");



// =====================================================
// Admin Dashboard Hero — Public Route
// =====================================================
router.get("/public/admin-dashboard-hero", getPublicSponsorBusinessHero);

// =====================================================
// Admin Dashboard Hero — Admin Routes
router.post(
  "/admin/dashboard/hero",
  protectedRoute,
  upload.single("dashboardImage"),
  createSponsorBusinessHero
);

router.get(
  "/admin/dashboard/hero",
  protectedRoute,
  getAllSponsorBusinessHeroes
);

router.get(
  "/admin/dashboard/hero/:id",
  protectedRoute,
  getSponsorBusinessHeroById
);

router.put(
  "/admin/dashboard/hero/:id",
  protectedRoute,
  upload.single("dashboardImage"),
  updateSponsorBusinessHero
);

router.delete(
  "/admin/dashboard/hero/:id",
  protectedRoute,
  deleteSponsorBusinessHero
);

router.patch(
  "/admin/dashboard/hero/:id/status",
  protectedRoute,
  toggleSponsorBusinessHeroStatus
);


// =====================================================
// Client Portal Content — Public Route
// =====================================================
router.get("/SponsorBusiness", getPublicSponsorBusinessContent);

// =====================================================
// Client Portal Content — Admin Routes
// =====================================================
router.post(
  "/admin/SponsorBusiness",
  protectedRoute,
  upload.single("hero_image"),
  createSponsorBusinessContent
);

router.get(
  "/admin/SponsorBusiness",
  protectedRoute,
  getAllSponsorBusinessContent
);

router.get(
  "/admin/SponsorBusiness/:id",
  protectedRoute,
  getSponsorBusinessContentById
);

router.put(
  "/admin/SponsorBusiness/:id",
  protectedRoute,
  upload.single("hero_image"),
  updateSponsorBusinessContent
);

router.delete(
  "/admin/SponsorBusiness/:id",
  protectedRoute,
  deleteSponsorBusinessContent
);

router.patch(
  "/admin/SponsorBusiness/:id/status",
  protectedRoute,
  toggleSponsorBusinessContentStatus
);


// =====================================================
// Client Portal Header — Public Route
// =====================================================
router.get("/SponsorBusiness/header", getSponsorBusinessHeader);

// =====================================================
// Client Portal Header — Admin Routes
// =====================================================
router.get("/admin/SponsorBusiness/header", protectedRoute, getSponsorBusinessHeader);
router.post("/admin/SponsorBusiness/header", protectedRoute, createSponsorBusinessHeader);
router.put("/admin/SponsorBusiness/header/:id", protectedRoute, updateSponsorBusinessHeader);
router.delete("/admin/SponsorBusiness/header/:id", protectedRoute, deleteSponsorBusinessHeader);

// =====================================================
// Client Portal Cards — Public Route
// =====================================================
router.get("/SponsorBusiness/cards", getAllSponsorBusinessCards);

// =====================================================
// Client Portal Cards — Admin Routes
// =====================================================
router.get("/admin/SponsorBusiness/cards", protectedRoute, adminGetAllSponsorBusinessCards);
router.get("/admin/SponsorBusiness/cards/:id", protectedRoute, getSponsorBusinessCardById);
router.post("/admin/SponsorBusiness/cards", protectedRoute, createSponsorBusinessCard);
router.put("/admin/SponsorBusiness/cards/:id", protectedRoute, updateSponsorBusinessCard);
router.delete("/admin/SponsorBusiness/cards/:id", protectedRoute, deleteSponsorBusinessCard);

// =====================================================
// Client Portal FAQ Header — Public Route
// =====================================================
router.get("/SponsorBusiness/faq-header", getPublicSponsorBusinessFaqHeader);

// =====================================================
// Client Portal FAQ Header — Admin Routes
// =====================================================
router.get("/admin/SponsorBusiness/faq-header", protectedRoute, getSponsorBusinessFaqHeader);
router.post("/admin/SponsorBusiness/faq-header", protectedRoute, createSponsorBusinessFaqHeader);
router.put("/admin/SponsorBusiness/faq-header/:id", protectedRoute, updateSponsorBusinessFaqHeader);
router.delete("/admin/SponsorBusiness/faq-header/:id", protectedRoute, deleteSponsorBusinessFaqHeader);

// =====================================================
// Client Portal FAQ Items — Public Route
// =====================================================
router.get("/SponsorBusiness/faqs", getPublicSponsorBusinessFaqs);

// =====================================================
// Client Portal FAQ Items — Admin Routes
// =====================================================
router.get("/admin/SponsorBusiness/faqs", protectedRoute, getAllSponsorBusinessFaqs);
router.get("/admin/SponsorBusiness/faqs/:id", protectedRoute, getSponsorBusinessFaqById);
router.post("/admin/SponsorBusiness/faqs", protectedRoute, createSponsorBusinessFaq);
router.put("/admin/SponsorBusiness/faqs/:id", protectedRoute, updateSponsorBusinessFaq);
router.delete("/admin/SponsorBusiness/faqs/:id", protectedRoute, deleteSponsorBusinessFaq);

// =====================================================
// Client Portal CTA — Public Route
// =====================================================
router.get("/SponsorBusiness/cta", getSponsorBusinessCta);

// =====================================================
// Client Portal CTA — Admin Routes
// =====================================================
router.post(
  "/admin/SponsorBusiness/cta",
  protectedRoute,
  createSponsorBusinessCta
);

router.get(
  "/admin/SponsorBusiness/cta",
  protectedRoute,
  getAllSponsorBusinessCtas
);

router.get(
  "/admin/SponsorBusiness/cta/:id",
  protectedRoute,
  getSponsorBusinessCtaById
);

router.put(
  "/admin/SponsorBusiness/cta/:id",
  protectedRoute,
  updateSponsorBusinessCta
);

router.delete(
  "/admin/SponsorBusiness/cta/:id",
  protectedRoute,
  deleteSponsorBusinessCta
);

router.patch(
  "/admin/SponsorBusiness/cta/:id/status",
  protectedRoute,
  toggleSponsorBusinessCtaStatus
);

module.exports = router;