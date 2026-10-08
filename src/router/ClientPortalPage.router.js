const express = require("express");

const upload = require("../middlewares/Upload");

const protectedRoute = require("../middlewares/Authmiddleware");

const router = express.Router();

const {
  getPublicClientPortalHero,
  getAllClientPortalHeroes,
  getClientPortalHeroById,
  createClientPortalHero,
  updateClientPortalHero,
  deleteClientPortalHero,
  toggleClientPortalHeroStatus,
} = require("../controllers/ClientPortal Controllers/ClientPortalHero.controllers");

const {
  getPublicClientPortalContent,
  getAllClientPortalContent,
  getClientPortalContentById,
  createClientPortalContent,
  updateClientPortalContent,
  deleteClientPortalContent,
  toggleClientPortalContentStatus,
} = require("../controllers/ClientPortal controllers/ClientPortalContent.controller");

const {
  getPublicClientPortalDailyWorkflow,
  getAllClientPortalDailyWorkflow,
  getClientPortalDailyWorkflowById,
  createClientPortalDailyWorkflow,
  updateClientPortalDailyWorkflow,
  deleteClientPortalDailyWorkflow,
  toggleClientPortalDailyWorkflowStatus,
} = require("../controllers/ClientPortal controllers/ClientPortalDailyWorkflow.controller");

const {
  getClientPortalHeader,
  createClientPortalHeader,
  updateClientPortalHeader,
  deleteClientPortalHeader,
} = require("../controllers/ClientPortal controllers/ClientPortalHeader.controller");

const {
  getAllClientPortalCards,
  adminGetAllClientPortalCards,
  getClientPortalCardById,
  createClientPortalCard,
  updateClientPortalCard,
  deleteClientPortalCard,
} = require("../controllers/ClientPortal controllers/ClientPortalCard.controller");

const {
  getPublicClientPortalFaqHeader,
  getClientPortalFaqHeader,
  createClientPortalFaqHeader,
  updateClientPortalFaqHeader,
  deleteClientPortalFaqHeader,
} = require("../controllers/ClientPortal controllers/ClientPortalFaqHeader.controller");

const {
  getPublicClientPortalFaqs,
  getAllClientPortalFaqs,
  getClientPortalFaqById,
  createClientPortalFaq,
  updateClientPortalFaq,
  deleteClientPortalFaq,
} = require("../controllers/ClientPortal controllers/ClientPortalFaq.controller");

const {
  getClientPortalCta,
  createClientPortalCta,
  getAllClientPortalCtas,
  getClientPortalCtaById,
  updateClientPortalCta,
  deleteClientPortalCta,
  toggleClientPortalCtaStatus,
} = require("../controllers/ClientPortal controllers/ClientPortalCta.controller");


// =====================================================
// Admin Dashboard Hero — Public Route
// =====================================================

router.get(
  "/public/clientportal-hero",
  getPublicClientPortalHero
);


// =====================================================
// Admin Dashboard Hero — Admin Routes
// =====================================================

router.post(
  "/admin/clientportal/hero",
  protectedRoute,
  upload.single("clientportalImage"),
  createClientPortalHero
);

router.get(
  "/admin/clientportal/hero",
  protectedRoute,
  getAllClientPortalHeroes
);

router.get(
  "/admin/clientportal/hero/:id",
  protectedRoute,
  getClientPortalHeroById
);

router.put(
  "/admin/clientportal/hero/:id",
  protectedRoute,
  upload.single("clientportalImage"),
  updateClientPortalHero
);

router.delete(
  "/admin/clientportal/hero/:id",
  protectedRoute,
  deleteClientPortalHero
);

router.patch(
  "/admin/clientportal/hero/:id/status",
  protectedRoute,
  toggleClientPortalHeroStatus
);


// =====================================================
// Client Portal Content — Public Route
// =====================================================

router.get(
  "/ClientPortal",
  getPublicClientPortalContent
);


// =====================================================
// Client Portal Daily Workflow — Public Route
// =====================================================

router.get(
  "/ClientPortal/day-in-the-life",
  getPublicClientPortalDailyWorkflow
);


// =====================================================
// Client Portal Daily Workflow — Admin Routes
// =====================================================

router.post(
  "/admin/ClientPortal/day-in-the-life",
  protectedRoute,
  upload.single("section_image"),
  createClientPortalDailyWorkflow
);

router.get(
  "/admin/ClientPortal/day-in-the-life",
  protectedRoute,
  getAllClientPortalDailyWorkflow
);

router.get(
  "/admin/ClientPortal/day-in-the-life/:id",
  protectedRoute,
  getClientPortalDailyWorkflowById
);

router.put(
  "/admin/ClientPortal/day-in-the-life/:id",
  protectedRoute,
  upload.single("section_image"),
  updateClientPortalDailyWorkflow
);

router.delete(
  "/admin/ClientPortal/day-in-the-life/:id",
  protectedRoute,
  deleteClientPortalDailyWorkflow
);

router.patch(
  "/admin/ClientPortal/day-in-the-life/:id/status",
  protectedRoute,
  toggleClientPortalDailyWorkflowStatus
);


// =====================================================
// Client Portal Header — Public Route
// =====================================================

router.get(
  "/ClientPortal/header",
  getClientPortalHeader
);


// =====================================================
// Client Portal Header — Admin Routes
// =====================================================

router.post(
  "/admin/ClientPortal/header",
  protectedRoute,
  createClientPortalHeader
);

router.get(
  "/admin/ClientPortal/header",
  protectedRoute,
  getClientPortalHeader
);

router.put(
  "/admin/ClientPortal/header/:id",
  protectedRoute,
  updateClientPortalHeader
);

router.delete(
  "/admin/ClientPortal/header/:id",
  protectedRoute,
  deleteClientPortalHeader
);


// =====================================================
// Client Portal Cards — Public Route
// =====================================================

router.get(
  "/ClientPortal/cards",
  getAllClientPortalCards
);


// =====================================================
// Client Portal Cards — Admin Routes
// =====================================================

router.post(
  "/admin/ClientPortal/cards",
  protectedRoute,
  createClientPortalCard
);

router.get(
  "/admin/ClientPortal/cards",
  protectedRoute,
  adminGetAllClientPortalCards
);

router.get(
  "/admin/ClientPortal/cards/:id",
  protectedRoute,
  getClientPortalCardById
);

router.put(
  "/admin/ClientPortal/cards/:id",
  protectedRoute,
  updateClientPortalCard
);

router.delete(
  "/admin/ClientPortal/cards/:id",
  protectedRoute,
  deleteClientPortalCard
);


// =====================================================
// Client Portal FAQ Header — Public Route
// =====================================================

router.get(
  "/ClientPortal/faq-header",
  getPublicClientPortalFaqHeader
);


// =====================================================
// Client Portal FAQ Header — Admin Routes
// =====================================================

router.post(
  "/admin/ClientPortal/faq-header",
  protectedRoute,
  createClientPortalFaqHeader
);

router.get(
  "/admin/ClientPortal/faq-header",
  protectedRoute,
  getClientPortalFaqHeader
);

router.put(
  "/admin/ClientPortal/faq-header/:id",
  protectedRoute,
  updateClientPortalFaqHeader
);

router.delete(
  "/admin/ClientPortal/faq-header/:id",
  protectedRoute,
  deleteClientPortalFaqHeader
);


// =====================================================
// Client Portal FAQ Items — Public Route
// =====================================================

router.get(
  "/ClientPortal/faqs",
  getPublicClientPortalFaqs
);


// =====================================================
// Client Portal FAQ Items — Admin Routes
// =====================================================

router.post(
  "/admin/ClientPortal/faqs",
  protectedRoute,
  createClientPortalFaq
);

router.get(
  "/admin/ClientPortal/faqs",
  protectedRoute,
  getAllClientPortalFaqs
);

router.get(
  "/admin/ClientPortal/faqs/:id",
  protectedRoute,
  getClientPortalFaqById
);

router.put(
  "/admin/ClientPortal/faqs/:id",
  protectedRoute,
  updateClientPortalFaq
);

router.delete(
  "/admin/ClientPortal/faqs/:id",
  protectedRoute,
  deleteClientPortalFaq
);


// =====================================================
// Client Portal CTA — Public Route
// =====================================================

router.get(
  "/ClientPortal/cta",
  getClientPortalCta
);


// =====================================================
// Client Portal CTA — Admin Routes
// =====================================================

router.post(
  "/admin/ClientPortal/cta",
  protectedRoute,
  createClientPortalCta
);

router.get(
  "/admin/ClientPortal/cta",
  protectedRoute,
  getAllClientPortalCtas
);

router.get(
  "/admin/ClientPortal/cta/:id",
  protectedRoute,
  getClientPortalCtaById
);

router.put(
  "/admin/ClientPortal/cta/:id",
  protectedRoute,
  updateClientPortalCta
);

router.delete(
  "/admin/ClientPortal/cta/:id",
  protectedRoute,
  deleteClientPortalCta
);

router.patch(
  "/admin/ClientPortal/cta/:id/status",
  protectedRoute,
  toggleClientPortalCtaStatus
);


// =====================================================
// Client Portal Content — Admin Routes
// GENERIC /:id MUST BE AFTER SPECIFIC ROUTES
// =====================================================

router.post(
  "/admin/ClientPortal",
  protectedRoute,
  upload.single("hero_image"),
  createClientPortalContent
);

router.get(
  "/admin/ClientPortal",
  protectedRoute,
  getAllClientPortalContent
);

router.get(
  "/admin/ClientPortal/:id",
  protectedRoute,
  getClientPortalContentById
);

router.put(
  "/admin/ClientPortal/:id",
  protectedRoute,
  upload.single("hero_image"),
  updateClientPortalContent
);

router.delete(
  "/admin/ClientPortal/:id",
  protectedRoute,
  deleteClientPortalContent
);

router.patch(
  "/admin/ClientPortal/:id/status",
  protectedRoute,
  toggleClientPortalContentStatus
);


module.exports = router;