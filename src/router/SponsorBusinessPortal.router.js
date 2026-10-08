const express = require("express");

const upload = require("../middlewares/Upload");

const protectedRoute = require("../middlewares/Authmiddleware");

const router = express.Router();

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
// Sponsor Business Hero — Public Route
// =====================================================

router.get(
  "/public/sponsorbusiness-hero",
  getPublicSponsorBusinessHero
);

// =====================================================
// Sponsor Business Hero — Admin Routes
// =====================================================

router.post(
  "/admin/sponsorbusiness/hero",
  protectedRoute,
  upload.single("dashboardImage"),
  createSponsorBusinessHero
);

router.get(
  "/admin/sponsorbusiness/hero",
  protectedRoute,
  getAllSponsorBusinessHeroes
);

router.get(
  "/admin/sponsorbusiness/hero/:id",
  protectedRoute,
  getSponsorBusinessHeroById
);

router.put(
  "/admin/sponsorbusiness/hero/:id",
  protectedRoute,
  upload.single("dashboardImage"),
  updateSponsorBusinessHero
);

router.delete(
  "/admin/sponsorbusiness/hero/:id",
  protectedRoute,
  deleteSponsorBusinessHero
);

router.patch(
  "/admin/sponsorbusiness/hero/:id/status",
  protectedRoute,
  toggleSponsorBusinessHeroStatus
);

// =====================================================
// Sponsor Business Content — Public Route
// =====================================================

router.get(
  "/SponsorBusiness",
  getPublicSponsorBusinessContent
);

// =====================================================
// Sponsor Business Daily Workflow — Public Route
// =====================================================
// Client Portal mein Daily Workflow hai.
// Sponsor Business mein Daily Workflow controller nahi diya gaya,
// isliye yahan koi Daily Workflow route nahi add kiya gaya.

// =====================================================
// Sponsor Business Header — Public Route
// =====================================================

router.get(
  "/SponsorBusiness/header",
  getSponsorBusinessHeader
);

// =====================================================
// Sponsor Business Header — Admin Routes
// =====================================================

router.post(
  "/admin/SponsorBusiness/header",
  protectedRoute,
  createSponsorBusinessHeader
);

router.get(
  "/admin/SponsorBusiness/header",
  protectedRoute,
  getSponsorBusinessHeader
);

router.put(
  "/admin/SponsorBusiness/header/:id",
  protectedRoute,
  updateSponsorBusinessHeader
);

router.delete(
  "/admin/SponsorBusiness/header/:id",
  protectedRoute,
  deleteSponsorBusinessHeader
);

// =====================================================
// Sponsor Business Cards — Public Route
// =====================================================

router.get(
  "/SponsorBusiness/cards",
  getAllSponsorBusinessCards
);

// =====================================================
// Sponsor Business Cards — Admin Routes
// =====================================================

router.post(
  "/admin/SponsorBusiness/cards",
  protectedRoute,
  createSponsorBusinessCard
);

router.get(
  "/admin/SponsorBusiness/cards",
  protectedRoute,
  adminGetAllSponsorBusinessCards
);

router.get(
  "/admin/SponsorBusiness/cards/:id",
  protectedRoute,
  getSponsorBusinessCardById
);

router.put(
  "/admin/SponsorBusiness/cards/:id",
  protectedRoute,
  updateSponsorBusinessCard
);

router.delete(
  "/admin/SponsorBusiness/cards/:id",
  protectedRoute,
  deleteSponsorBusinessCard
);

// =====================================================
// Sponsor Business FAQ Header — Public Route
// =====================================================

router.get(
  "/SponsorBusiness/faq-header",
  getPublicSponsorBusinessFaqHeader
);

// =====================================================
// Sponsor Business FAQ Header — Admin Routes
// =====================================================

router.post(
  "/admin/SponsorBusiness/faq-header",
  protectedRoute,
  createSponsorBusinessFaqHeader
);

router.get(
  "/admin/SponsorBusiness/faq-header",
  protectedRoute,
  getSponsorBusinessFaqHeader
);

router.put(
  "/admin/SponsorBusiness/faq-header/:id",
  protectedRoute,
  updateSponsorBusinessFaqHeader
);

router.delete(
  "/admin/SponsorBusiness/faq-header/:id",
  protectedRoute,
  deleteSponsorBusinessFaqHeader
);

// =====================================================
// Sponsor Business FAQ Items — Public Route
// =====================================================

router.get(
  "/SponsorBusiness/faqs",
  getPublicSponsorBusinessFaqs
);

// =====================================================
// Sponsor Business FAQ Items — Admin Routes
// =====================================================

router.post(
  "/admin/SponsorBusiness/faqs",
  protectedRoute,
  createSponsorBusinessFaq
);

router.get(
  "/admin/SponsorBusiness/faqs",
  protectedRoute,
  getAllSponsorBusinessFaqs
);

router.get(
  "/admin/SponsorBusiness/faqs/:id",
  protectedRoute,
  getSponsorBusinessFaqById
);

router.put(
  "/admin/SponsorBusiness/faqs/:id",
  protectedRoute,
  updateSponsorBusinessFaq
);

router.delete(
  "/admin/SponsorBusiness/faqs/:id",
  protectedRoute,
  deleteSponsorBusinessFaq
);

// =====================================================
// Sponsor Business CTA — Public Route
// =====================================================

router.get(
  "/SponsorBusiness/cta",
  getSponsorBusinessCta
);

// =====================================================
// Sponsor Business CTA — Admin Routes
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

// =====================================================
// Sponsor Business Content — Admin Routes
// GENERIC /:id MUST BE AFTER SPECIFIC ROUTES
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

module.exports = router;