const express = require("express");

const protectedRoute = require("../middlewares/Authmiddleware");
const upload = require("../middlewares/Upload");

const router = express.Router();

const {
  createBookDemoPage,
  getBookDemoPageAdmin,
  updateBookDemoPage,
  deleteBookDemoPage,
  getPublicBookDemoPage,
} = require("../controllers/BookDemoPage controllers/BookDemoPage.controller");

const {
  createBookDemoForm,
  getAllBookDemosForm,
  getBookDemoFormById,
  updateBookDemoFormStatus,
  deleteBookDemoForm,
} = require("../controllers/BookDemoPage controllers/BookDemoForm.controller");

const {
  createWhatToExpect,
  getWhatToExpectAdmin,
  updateWhatToExpect,
  deleteWhatToExpect,
  getPublicWhatToExpect,
} = require("../controllers/BookDemoPage controllers/WhatToExpect.controller");

const {
  createWhatHappensNext,
  getWhatHappensNextAdmin,
  updateWhatHappensNext,
  deleteWhatHappensNext,
  getPublicWhatHappensNext,
} = require("../controllers/BookDemoPage controllers/WhatHappensNext.controller");

const {
  createTestimonial,
  getTestimonialAdmin,
  updateTestimonial,
  deleteTestimonial,
  getPublicTestimonial,
} = require("../controllers/BookDemoPage controllers/BookDemoTestimonial.controller");

// =====================================================
// Book Demo Page — Public Route
// =====================================================

router.get("/book-demo-page", getPublicBookDemoPage);

// =====================================================
// Book Demo Page — Admin Routes
// =====================================================

router.post(
  "/admin/book-demo-page",
  protectedRoute,
  createBookDemoPage
);

router.get(
  "/admin/book-demo-page",
  protectedRoute,
  getBookDemoPageAdmin
);

router.put(
  "/admin/book-demo-page/:id",
  protectedRoute,
  updateBookDemoPage
);

router.delete(
  "/admin/book-demo-page/:id",
  protectedRoute,
  deleteBookDemoPage
);

// =====================================================
// Book Demo Form — Public Route
// =====================================================

router.post(
  "/public/book-demo",
  createBookDemoForm
);

// =====================================================
// Book Demo — What to Expect — Public Route
// =====================================================

router.get(
  "/book-demo/what-to-expect",
  getPublicWhatToExpect
);

// =====================================================
// Book Demo — What to Expect — Admin Routes
// =====================================================

router.post(
  "/admin/book-demo/what-to-expect",
  protectedRoute,
  upload.single("image"),
  createWhatToExpect
);

router.get(
  "/admin/book-demo/what-to-expect",
  protectedRoute,
  getWhatToExpectAdmin
);

router.put(
  "/admin/book-demo/what-to-expect/:id",
  protectedRoute,
  upload.single("image"),
  updateWhatToExpect
);

router.delete(
  "/admin/book-demo/what-to-expect/:id",
  protectedRoute,
  deleteWhatToExpect
);

// =====================================================
// Book Demo — What Happens Next — Public Route
// =====================================================

router.get(
  "/book-demo/what-happens-next",
  getPublicWhatHappensNext
);

// =====================================================
// Book Demo — What Happens Next — Admin Routes
// =====================================================

router.post(
  "/admin/book-demo/what-happens-next",
  protectedRoute,
  createWhatHappensNext
);

router.get(
  "/admin/book-demo/what-happens-next",
  protectedRoute,
  getWhatHappensNextAdmin
);

router.put(
  "/admin/book-demo/what-happens-next/:id",
  protectedRoute,
  updateWhatHappensNext
);

router.delete(
  "/admin/book-demo/what-happens-next/:id",
  protectedRoute,
  deleteWhatHappensNext
);

// =====================================================
// Book Demo — Testimonial — Public Route
// =====================================================

router.get(
  "/book-demo/testimonial",
  getPublicTestimonial
);

// =====================================================
// Book Demo — Testimonial — Admin Routes
// =====================================================

router.post(
  "/admin/book-demo/testimonial",
  protectedRoute,
  createTestimonial
);

router.get(
  "/admin/book-demo/testimonial",
  protectedRoute,
  getTestimonialAdmin
);

router.put(
  "/admin/book-demo/testimonial/:id",
  protectedRoute,
  updateTestimonial
);

router.delete(
  "/admin/book-demo/testimonial/:id",
  protectedRoute,
  deleteTestimonial
);

// =====================================================
// Book Demo Form — Admin Routes
// =====================================================

// GET all enquiries
router.get(
  "/admin/book-demo",
  protectedRoute,
  getAllBookDemosForm
);

// GET enquiry by ID
// Keep this route AFTER all specific /admin/book-demo/... routes
router.get(
  "/admin/book-demo/:id",
  protectedRoute,
  getBookDemoFormById
);

// UPDATE enquiry status
router.patch(
  "/admin/book-demo/:id/status",
  protectedRoute,
  updateBookDemoFormStatus
);

// DELETE enquiry
router.delete(
  "/admin/book-demo/:id",
  protectedRoute,
  deleteBookDemoForm
);

module.exports = router;