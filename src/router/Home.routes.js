const express = require("express");
const upload = require("../middlewares/Upload");
const heroSectionUpload = require("../middlewares/HeroSectionUpload");
const protectedRoute = require("../middlewares/Authmiddleware");
const router = express.Router();
const {
  createheroSection,
  getAllheroSections,
  getheroSectionById,
  updateheroSection,
  deleteheroSection,
  toggleheroSectionStatus,
  getActiveheroSection,
} = require("../controllers/Home controllers/HeroSection.controller");
const {
  createPlatformSection,
  getPlatformSections,
  getPlatformSectionById,
  updatePlatformSection,
  deletePlatformSection,
  updatePlatformSectionStatus,
  getPublicPlatformSection,
} = require("../controllers/Home controllers/PlatformSection.controller");
const {
  createProblemSolutionSection,
  getAllProblemSolutionSections,
  getProblemSolutionSectionById,
  updateProblemSolutionSection,
  deleteProblemSolutionSection,
  toggleProblemSolutionSectionStatus,
  getActiveProblemSolutionSection,
} = require("../controllers/Home controllers/ProblemSolutionSection.controller");
const {
  createProblemSolutionComparison,
  getAllProblemSolutionComparisons,
  getProblemSolutionComparisonById,
  updateProblemSolutionComparison,
  deleteProblemSolutionComparison,
  toggleProblemSolutionComparisonStatus,
  getActiveProblemSolutionComparisons,
} = require("../controllers/Home controllers/ProblemSolutionComparison.controller");
const {
  createFeatureCard,
  getAllFeatureCards,
  getFeatureCardById,
  updateFeatureCard,
  deleteFeatureCard,
  getActiveFeatureCards,
} = require("../controllers/Home controllers/FeatureCard.controller");
const {
  getCaseManagementSection,
  adminGetCaseManagementSection,
  createCaseManagementSection,
  updateCaseManagementSection,
  deleteCaseManagementSection,
} = require("../controllers/Home controllers/caseManagementSectionController");
const {
  getActiveCaseManagementCards,
  adminGetAllCaseManagementCards,
  adminGetCaseManagementCardById,
  createCaseManagementCard,
  updateCaseManagementCard,
  deleteCaseManagementCard,
} = require("../controllers/Home controllers/caseManagementFeatureCardController");
const {
  getCoreModulesSection,
  adminGetCoreModulesSection,
  createCoreModulesSection,
  updateCoreModulesSection,
  deleteCoreModulesSection,
} = require("../controllers/Home controllers/caseModulesSectionController");
const {
  getActiveCoreModuleCards,
  adminGetAllCoreModuleCards,
  adminGetCoreModuleCardById,
  createCoreModuleCard,
  updateCoreModuleCard,
  deleteCoreModuleCard,
} = require("../controllers/Home controllers/caseModuleCardController");
const {
  getWhyImcamHubSection,
  adminGetWhyImcamHubSection,
  createWhyImcamHubSection,
  updateWhyImcamHubSection,
  deleteWhyImcamHubSection,
} = require("../controllers/Home controllers/whyImcamHubSectionController");
const {
  getActiveWhyImcamHubCards,
  adminGetAllWhyImcamHubCards,
  adminGetWhyImcamHubCardById,
  createWhyImcamHubCard,
  updateWhyImcamHubCard,
  deleteWhyImcamHubCard,
} = require("../controllers/Home controllers/whyImcamHubCardController");
const {
  publicGetFaqSection,
  adminGetFaqSection,
  createFaqSection,
  updateFaqSection,
  deleteFaqSection,
} = require("../controllers/Home controllers/faqSectionController");
const {
  adminGetAllFaqs,
  adminGetFaqById,
  createFaq,
  updateFaq,
  deleteFaq,
  publicGetFaqItems,
} = require("../controllers/Home controllers/faqController");
const {
  adminGetFaqCta,
  createFaqCta,
  updateFaqCta,
  deleteFaqCta,
  publicGetFaqCta,
} = require("../controllers/Home controllers/faqCtaController");
const {
  getPublicDemoCta,
  adminGetDemoCtaSections,
  createDemoCtaSection,
  updateDemoCtaSection,
  deleteDemoCtaSection,
} = require("../controllers/Home controllers/demoCtaSectionController");

// Public routes for hero section management
router.get("/public/home/herosection", getActiveheroSection);

// Admin routes for hero section management

router.post(
  "/admin/home/herosection",
  protectedRoute,
  heroSectionUpload.fields([
    { name: "dashboardImage", maxCount: 1 },
    { name: "heroVideo", maxCount: 1 },
  ]),
  createheroSection
);
router.get("/admin/home/herosection", protectedRoute, getAllheroSections);
router.get("/admin/home/herosection/:id", protectedRoute, getheroSectionById);
router.put(
  "/admin/home/herosection/:id",
  protectedRoute,
  heroSectionUpload.fields([
    { name: "dashboardImage", maxCount: 1 },
    { name: "heroVideo", maxCount: 1 },
  ]),
  updateheroSection
);
router.delete("/admin/home/herosection/:id", protectedRoute, deleteheroSection);
router.patch("/admin/home/herosection/:id/status", protectedRoute, toggleheroSectionStatus);

// =====================================================
// Homepage Platform Section APIs
// =====================================================
router.get("/public/home/platform-section", getPublicPlatformSection);

router.post(
  "/admin/home/platform-section",
  protectedRoute,
  upload.single("dashboardImage"),
  createPlatformSection
);
router.get("/admin/home/platform-section", protectedRoute, getPlatformSections);
router.get("/admin/home/platform-section/:id", protectedRoute, getPlatformSectionById);
router.put(
  "/admin/home/platform-section/:id",
  protectedRoute,
  upload.single("dashboardImage"),
  updatePlatformSection
);
router.delete("/admin/home/platform-section/:id", protectedRoute, deletePlatformSection);
router.patch(
  "/admin/home/platform-section/:id/status",
  protectedRoute,
  updatePlatformSectionStatus
);

// =====================================================
// Homepage Problem vs Solution APIs
// =====================================================
router.get("/home/problem-solution-section", getActiveProblemSolutionSection);
 
// Admin routes for problem solution section management
router.post(
  "/admin/home/problem-solution-section",
  protectedRoute,
  createProblemSolutionSection
);
router.get(
  "/admin/home/problem-solution-section",
  protectedRoute,
  getAllProblemSolutionSections
);
router.get(
  "/admin/home/problem-solution-section/:id",
  protectedRoute,
  getProblemSolutionSectionById
);
router.put(
  "/admin/home/problem-solution-section/:id",
  protectedRoute,
  updateProblemSolutionSection
);
router.delete(
  "/admin/home/problem-solution-section/:id",
  protectedRoute,
  deleteProblemSolutionSection
);
router.patch(
  "/admin/home/problem-solution-section/:id/status",
  protectedRoute,
  toggleProblemSolutionSectionStatus
);

// =====================================================
// Homepage Problem vs Solution Comparison APIs
// =====================================================
// Public route to get active problem solution comparisons
router.get(
  "/home/problem-solution-comparison",
  getActiveProblemSolutionComparisons
);

 // Admin routes for problem solution comparison management
router.post(
  "/admin/home/problem-solution-comparison",
  protectedRoute,
  createProblemSolutionComparison
);
router.get(
  "/admin/home/problem-solution-comparison",
  protectedRoute,
  getAllProblemSolutionComparisons
);
router.get(
  "/admin/home/problem-solution-comparison/:id",
  protectedRoute,
  getProblemSolutionComparisonById
);
router.put(
  "/admin/home/problem-solution-comparison/:id",
  protectedRoute,
  updateProblemSolutionComparison
);
router.delete(
  "/admin/home/problem-solution-comparison/:id",
  protectedRoute,
  deleteProblemSolutionComparison
);
router.patch(
  "/admin/home/problem-solution-comparison/:id/status",
  protectedRoute,
  toggleProblemSolutionComparisonStatus
);

// =====================================================
// Homepage Feature Cards APIs
// =====================================================
router.get("/home/feature-cards", getActiveFeatureCards);

router.post(
  "/admin/home/feature-cards",
  protectedRoute,
  createFeatureCard
);
router.get(
  "/admin/home/feature-cards",
  protectedRoute,
  getAllFeatureCards
);
router.get(
  "/admin/home/feature-cards/:id",
  protectedRoute,
  getFeatureCardById
);
router.put(
  "/admin/home/feature-cards/:id",
  protectedRoute,
  updateFeatureCard
);
router.delete(
  "/admin/home/feature-cards/:id",
  protectedRoute,
  deleteFeatureCard
);
// =====================================================
// Case Management Section APIs
// =====================================================


// Public routes
router.get("/case-management", getCaseManagementSection);
router.get("/case-management/cards", getActiveCaseManagementCards);

// Admin routes — section
router.get("/admin/case-management", protectedRoute, adminGetCaseManagementSection);
router.post("/admin/case-management", protectedRoute, createCaseManagementSection);
router.put("/admin/case-management/:id", protectedRoute, updateCaseManagementSection);
router.delete("/admin/case-management/:id", protectedRoute, deleteCaseManagementSection);

// Admin routes — feature cards
router.get("/admin/case-management/cards", protectedRoute, adminGetAllCaseManagementCards);
router.get("/admin/case-management/cards/:id", protectedRoute, adminGetCaseManagementCardById);
router.post("/admin/case-management/cards", protectedRoute, createCaseManagementCard);
router.put("/admin/case-management/cards/:id", protectedRoute, updateCaseManagementCard);
router.delete("/admin/case-management/cards/:id", protectedRoute, deleteCaseManagementCard);

// =====================================================
// Core Modules Section APIs
// =====================================================


// Public routes
router.get("/core-modules", getCoreModulesSection);
router.get("/core-modules/cards", getActiveCoreModuleCards);

// Admin routes — section
router.get("/admin/core-modules", protectedRoute, adminGetCoreModulesSection);
router.post("/admin/core-modules", protectedRoute, createCoreModulesSection);
router.put("/admin/core-modules/:id", protectedRoute, updateCoreModulesSection);
router.delete("/admin/core-modules/:id", protectedRoute, deleteCoreModulesSection);

// Admin routes — module cards
router.get("/admin/core-modules/cards", protectedRoute, adminGetAllCoreModuleCards);
router.get("/admin/core-modules/cards/:id", protectedRoute, adminGetCoreModuleCardById);
router.post("/admin/core-modules/cards", protectedRoute, createCoreModuleCard);
router.put("/admin/core-modules/cards/:id", protectedRoute, updateCoreModuleCard);
router.delete("/admin/core-modules/cards/:id", protectedRoute, deleteCoreModuleCard);

// =====================================================
// Why ImCam Hub Section APIs
// =====================================================

// Public routes
router.get("/why-imcam-hub", getWhyImcamHubSection);
router.get("/why-imcam-hub/cards", getActiveWhyImcamHubCards);

// Admin routes — section
router.get("/admin/why-imcam-hub", protectedRoute, adminGetWhyImcamHubSection);
router.post("/admin/why-imcam-hub", protectedRoute, createWhyImcamHubSection);
router.put("/admin/why-imcam-hub/:id", protectedRoute, updateWhyImcamHubSection);
router.delete("/admin/why-imcam-hub/:id", protectedRoute, deleteWhyImcamHubSection);

// Admin routes — cards
router.get("/admin/why-imcam-hub/cards", protectedRoute, adminGetAllWhyImcamHubCards);
router.get("/admin/why-imcam-hub/cards/:id", protectedRoute, adminGetWhyImcamHubCardById);
router.post("/admin/why-imcam-hub/cards", protectedRoute, createWhyImcamHubCard);
router.put("/admin/why-imcam-hub/cards/:id", protectedRoute, updateWhyImcamHubCard);
router.delete("/admin/why-imcam-hub/cards/:id", protectedRoute, deleteWhyImcamHubCard);

// =====================================================
// FAQ Section APIs
// =====================================================

// Public route — combined section + active FAQs + CTA

// Public routes — separate FAQ endpoints
router.get("/faq/section", publicGetFaqSection);
router.get("/faq/items", publicGetFaqItems);
router.get("/faq/cta", publicGetFaqCta);

// Admin routes — section
router.get("/admin/faq", protectedRoute, adminGetFaqSection);
router.post("/admin/faq", protectedRoute, createFaqSection);
router.put("/admin/faq/:id", protectedRoute, updateFaqSection);
router.delete("/admin/faq/:id", protectedRoute, deleteFaqSection);

// Admin routes — FAQ items
router.get("/admin/faq/items", protectedRoute, adminGetAllFaqs);
router.get("/admin/faq/items/:id", protectedRoute, adminGetFaqById);
router.post("/admin/faq/items", protectedRoute, createFaq);
router.put("/admin/faq/items/:id", protectedRoute, updateFaq);
router.delete("/admin/faq/items/:id", protectedRoute, deleteFaq);

// Admin routes — CTA card
router.get("/admin/faq/cta", protectedRoute, adminGetFaqCta);
router.post("/admin/faq/cta", protectedRoute, createFaqCta);
router.put("/admin/faq/cta/:id", protectedRoute, updateFaqCta);
router.delete("/admin/faq/cta/:id", protectedRoute, deleteFaqCta);

// =====================================================
// Demo CTA Section APIs
// =====================================================

// Public route
router.get("/demo-cta", getPublicDemoCta);

// Admin routes
router.get("/admin/demo-cta", protectedRoute, adminGetDemoCtaSections);
router.post(
  "/admin/demo-cta",
  protectedRoute,
  upload.single("backgroundImage"),
  createDemoCtaSection
);
router.put(
  "/admin/demo-cta/:id",
  protectedRoute,
  upload.single("backgroundImage"),
  updateDemoCtaSection
);
router.delete("/admin/demo-cta/:id", protectedRoute, deleteDemoCtaSection);

module.exports = router;
