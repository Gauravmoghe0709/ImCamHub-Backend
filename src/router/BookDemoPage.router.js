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
// Public Book Demo Page API
// =====================================================
router.get("/book-demo-page", getPublicBookDemoPage);

// =====================================================
// Admin Book Demo Page APIs
// =====================================================

router.post("/admin/book-demo-page", protectedRoute, createBookDemoPage);
router.get("/admin/book-demo-page", protectedRoute, getBookDemoPageAdmin);
router.put("/admin/book-demo-page/:id", protectedRoute, updateBookDemoPage);
router.delete("/admin/book-demo-page/:id", protectedRoute, deleteBookDemoPage);

// =====================================================
// Book Demo Form APIs
// PUBLIC API
// =====================================================
router.post("/public/book-demo", createBookDemoForm);

// ==========================================
// ADMIN APIs
// ==========================================
router.get("/admin/book-demo", protectedRoute, getAllBookDemosForm);
router.get("/admin/book-demo/:id", protectedRoute, getBookDemoFormById);
router.patch("/admin/book-demo/:id/status", protectedRoute, updateBookDemoFormStatus);
router.delete("/admin/book-demo/:id", protectedRoute, deleteBookDemoForm);

// =====================================================
// Book Demo Page Sections — What to Expect
// =====================================================
router.get("/book-demo/what-to-expect", getPublicWhatToExpect);
router.post("/admin/book-demo/what-to-expect", protectedRoute, upload.single("image"), createWhatToExpect);
router.get("/admin/book-demo/what-to-expect", protectedRoute, getWhatToExpectAdmin);
router.put("/admin/book-demo/what-to-expect/:id", protectedRoute, upload.single("image"), updateWhatToExpect);
router.delete("/admin/book-demo/what-to-expect/:id", protectedRoute, deleteWhatToExpect);

// =====================================================
// Book Demo Page Sections — What Happens Next
// =====================================================
router.get("/book-demo/what-happens-next", getPublicWhatHappensNext);
router.post("/admin/book-demo/what-happens-next", protectedRoute, createWhatHappensNext);
router.get("/admin/book-demo/what-happens-next", protectedRoute, getWhatHappensNextAdmin);
router.put("/admin/book-demo/what-happens-next/:id", protectedRoute, updateWhatHappensNext);
router.delete("/admin/book-demo/what-happens-next/:id", protectedRoute, deleteWhatHappensNext);

// =====================================================
// Book Demo Page Sections — Testimonial
// =====================================================

router.get("/book-demo/testimonial", getPublicTestimonial);
router.post("/admin/book-demo/testimonial", protectedRoute, createTestimonial);
router.get("/admin/book-demo/testimonial", protectedRoute, getTestimonialAdmin);
router.put("/admin/book-demo/testimonial/:id", protectedRoute, updateTestimonial);
router.delete("/admin/book-demo/testimonial/:id", protectedRoute, deleteTestimonial);

module.exports = router;
