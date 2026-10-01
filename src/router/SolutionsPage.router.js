const express = require("express");
const upload = require("../middlewares/Upload");
const protectedRoute = require("../middlewares/Authmiddleware");

const router = express.Router();

const {
  getPublicSolutionsPageSections,
  createSolutionsPageSection,
  getAllSolutionsPageSections,
  getSolutionsPageSectionById,
  updateSolutionsPageSection,
  deleteSolutionsPageSection,
  toggleSolutionsPageSectionStatus,
} = require("../controllers/SolutionsPage controllers/SolutionsPageSection.controller");

const {
  getPublicSolutionsHeader,
  getAdminSolutionsHeader,
  createSolutionsHeader,
  updateSolutionsHeader,
  deleteSolutionsHeader,
  toggleSolutionsHeaderStatus,
} = require("../controllers/SolutionsPage controllers/SolutionsHeader.controller");

const {
  getPublicSolutionsCards,
  getAdminSolutionsCards,
  getSolutionsCardById,
  createSolutionsCard,
  updateSolutionsCard,
  deleteSolutionsCard,
  toggleSolutionsCardStatus,
} = require("../controllers/SolutionsPage controllers/SolutionsFeatureCard.controller");

const {
  getOurSolutionsHeader,
  createOurSolutionsHeader,
  getAllOurSolutionsHeaders,
  getOurSolutionsHeaderById,
  updateOurSolutionsHeader,
  deleteOurSolutionsHeader,
  toggleOurSolutionsHeaderStatus,
} = require("../controllers/SolutionsPage controllers/OurSolutionsHeader.controller");

const {
  getOurSolutionsCards,
  createOurSolutionsCard,
  getAllOurSolutionsCards,
  getOurSolutionsCardById,
  updateOurSolutionsCard,
  deleteOurSolutionsCard,
  toggleOurSolutionsCardStatus,
} = require("../controllers/SolutionsPage controllers/OurSolutionsCards.controller");

const {
  getHowItWorksHeader,
  createHowItWorksHeader,
  getAdminHowItWorksHeaders,
  updateHowItWorksHeader,
  deleteHowItWorksHeader,
} = require("../controllers/SolutionsPage controllers/HowItWorksHeaderController");

const {
  getHowItWorksProcesses,
  createHowItWorksProcess,
  getAdminHowItWorksProcesses,
  getHowItWorksProcessById,
  updateHowItWorksProcess,
  deleteHowItWorksProcess,
} = require("../controllers/SolutionsPage controllers/HowItWorksProcessController");

const {
  getPublicFinalCta,
  createFinalCta,
  getAllFinalCtas,
  getFinalCtaById,
  updateFinalCta,
  deleteFinalCta,
} = require("../controllers/SolutionsPage controllers/FinalCtaController");

// =====================================================
// Solutions Page — Public Route
// =====================================================
router.get("/solutions-page", getPublicSolutionsPageSections);

// =====================================================
// Solutions Page — Admin Routes
// =====================================================
router.post(
  "/admin/solutions-page",
  protectedRoute,
  upload.single("backgroundImage"),
  createSolutionsPageSection
);

router.get("/admin/solutions-page", protectedRoute, getAllSolutionsPageSections);

router.get(
  "/admin/solutions-page/:id",
  protectedRoute,
  getSolutionsPageSectionById
);

router.put(
  "/admin/solutions-page/:id",
  protectedRoute,
  upload.single("backgroundImage"),
  updateSolutionsPageSection
);

router.delete(
  "/admin/solutions-page/:id",
  protectedRoute,
  deleteSolutionsPageSection
);

router.patch(
  "/admin/solutions-page/:id/status",
  protectedRoute,
  toggleSolutionsPageSectionStatus
);

// =====================================================
// Solutions Header — Public Route
// =====================================================
router.get("/solutions/header", getPublicSolutionsHeader);

// =====================================================
// Solutions Header — Admin Routes
// =====================================================
router.get("/admin/solutions/header", protectedRoute, getAdminSolutionsHeader);

router.post(
  "/admin/solutions/header",
  protectedRoute,
  createSolutionsHeader
);

router.put(
  "/admin/solutions/header/:id",
  protectedRoute,
  updateSolutionsHeader
);

router.delete(
  "/admin/solutions/header/:id",
  protectedRoute,
  deleteSolutionsHeader
);

router.patch(
  "/admin/solutions/header/:id/status",
  protectedRoute,
  toggleSolutionsHeaderStatus
);

// =====================================================
// Solutions Cards — Public Route
// =====================================================
router.get("/solutions/cards", getPublicSolutionsCards);

// =====================================================
// Solutions Cards — Admin Routes
// =====================================================
router.get(
  "/admin/solutions/cards",
  protectedRoute,
  getAdminSolutionsCards
);

router.get(
  "/admin/solutions/cards/:id",
  protectedRoute,
  getSolutionsCardById
);

router.post(
  "/admin/solutions/cards",
  protectedRoute,
  upload.single("image"),
  createSolutionsCard
);

router.put(
  "/admin/solutions/cards/:id",
  protectedRoute,
  upload.single("image"),
  updateSolutionsCard
);

router.delete(
  "/admin/solutions/cards/:id",
  protectedRoute,
  deleteSolutionsCard
);

router.patch(
  "/admin/solutions/cards/:id/status",
  protectedRoute,
  toggleSolutionsCardStatus
);

// =====================================================
// Our Solutions Header — Public Route
// =====================================================
router.get("/solutions/our-header", getOurSolutionsHeader);

// =====================================================
// Our Solutions Header — Admin Routes
// =====================================================
router.post(
  "/admin/solutions/our-header",
  protectedRoute,
  createOurSolutionsHeader
);

router.get(
  "/admin/solutions/our-header",
  protectedRoute,
  getAllOurSolutionsHeaders
);

router.get(
  "/admin/solutions/our-header/:id",
  protectedRoute,
  getOurSolutionsHeaderById
);

router.put(
  "/admin/solutions/our-header/:id",
  protectedRoute,
  updateOurSolutionsHeader
);

router.delete(
  "/admin/solutions/our-header/:id",
  protectedRoute,
  deleteOurSolutionsHeader
);

router.patch(
  "/admin/solutions/our-header/:id/status",
  protectedRoute,
  toggleOurSolutionsHeaderStatus
);

// =====================================================
// Our Solutions Cards — Public Route
// =====================================================
router.get("/solutions/our-cards", getOurSolutionsCards);

// =====================================================
// Our Solutions Cards — Admin Routes
// =====================================================
router.post(
  "/admin/solutions/our-cards",
  protectedRoute,
  createOurSolutionsCard
);

router.get(
  "/admin/solutions/our-cards",
  protectedRoute,
  getAllOurSolutionsCards
);

router.get(
  "/admin/solutions/our-cards/:id",
  protectedRoute,
  getOurSolutionsCardById
);

router.put(
  "/admin/solutions/our-cards/:id",
  protectedRoute,
  updateOurSolutionsCard
);

router.delete(
  "/admin/solutions/our-cards/:id",
  protectedRoute,
  deleteOurSolutionsCard
);

router.patch(
  "/admin/solutions/our-cards/:id/status",
  protectedRoute,
  toggleOurSolutionsCardStatus
);

// =====================================================
// How It Works Header — Public Route
// =====================================================
router.get("/how-it-works/header", getHowItWorksHeader);

// =====================================================
// How It Works Header — Admin Routes
// =====================================================
router.post(
  "/admin/how-it-works/header",
  protectedRoute,
  createHowItWorksHeader
);

router.get(
  "/admin/how-it-works/header",
  protectedRoute,
  getAdminHowItWorksHeaders
);

router.put(
  "/admin/how-it-works/header/:id",
  protectedRoute,
  updateHowItWorksHeader
);

router.delete(
  "/admin/how-it-works/header/:id",
  protectedRoute,
  deleteHowItWorksHeader
);

// =====================================================
// How It Works Process — Public Route
// =====================================================
router.get("/how-it-works/process", getHowItWorksProcesses);

// =====================================================
// How It Works Process — Admin Routes
// =====================================================
router.post(
  "/admin/how-it-works/process",
  protectedRoute,
  createHowItWorksProcess
);

router.get(
  "/admin/how-it-works/process",
  protectedRoute,
  getAdminHowItWorksProcesses
);

router.get(
  "/admin/how-it-works/process/:id",
  protectedRoute,
  getHowItWorksProcessById
);

router.put(
  "/admin/how-it-works/process/:id",
  protectedRoute,
  updateHowItWorksProcess
);

router.delete(
  "/admin/how-it-works/process/:id",
  protectedRoute,
  deleteHowItWorksProcess
);

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
