const express = require("express");
const upload = require("../middlewares/Upload");
const protectedRoute = require("../middlewares/Authmiddleware");

const {
  getPublicFooterLogo,
  getFooterLogo,
  createFooterLogo,
  updateFooterLogo,
  deleteFooterLogo,
} = require("../controllers/Footer controllers/FooterLogoController");

const {
  getPublicFooterProduct,
  getFooterProduct,
  createFooterProduct,
  updateFooterProduct,
  deleteFooterProduct,
} = require("../controllers/Footer controllers/FooterProductController");

const {
  getPublicFooterCompany,
  getFooterCompany,
  createFooterCompany,
  updateFooterCompany,
  deleteFooterCompany,
} = require("../controllers/Footer controllers/FooterCompanyController");

const {
  getPublicFooterContact,
  getFooterContact,
  createFooterContact,
  updateFooterContact,
  deleteFooterContact,
} = require("../controllers/Footer controllers/FooterContactController");

const router = express.Router();

// =====================================================
// Footer Logo — Public Route
// =====================================================
router.get("/footer/logo", getPublicFooterLogo);

// =====================================================
// Footer Logo — Admin Routes
// =====================================================
router.get("/admin/footer/logo", protectedRoute, getFooterLogo);
router.post(
  "/admin/footer/logo",
  protectedRoute,
  upload.single("logo"),
  createFooterLogo
);
router.put(
  "/admin/footer/logo/:id",
  protectedRoute,
  upload.single("logo"),
  updateFooterLogo
);
router.delete("/admin/footer/logo/:id", protectedRoute, deleteFooterLogo);

// =====================================================
// Footer Product — Public Route
// =====================================================
router.get("/footer/product", getPublicFooterProduct);

// =====================================================
// Footer Product — Admin Routes
// =====================================================
router.get("/admin/footer/product", protectedRoute, getFooterProduct);
router.post("/admin/footer/product", protectedRoute, createFooterProduct);
router.put("/admin/footer/product/:id", protectedRoute, updateFooterProduct);
router.delete("/admin/footer/product/:id", protectedRoute, deleteFooterProduct);

// =====================================================
// Footer Company — Public Route
// =====================================================
router.get("/footer/company", getPublicFooterCompany);

// =====================================================
// Footer Company — Admin Routes
// =====================================================
router.get("/admin/footer/company", protectedRoute, getFooterCompany);
router.post("/admin/footer/company", protectedRoute, createFooterCompany);
router.put("/admin/footer/company/:id", protectedRoute, updateFooterCompany);
router.delete("/admin/footer/company/:id", protectedRoute, deleteFooterCompany);

// =====================================================
// Footer Contact — Public Route
// =====================================================
router.get("/footer/contact", getPublicFooterContact);

// =====================================================
// Footer Contact — Admin Routes
// =====================================================
router.get("/admin/footer/contact", protectedRoute, getFooterContact);
router.post("/admin/footer/contact", protectedRoute, createFooterContact);
router.put("/admin/footer/contact/:id", protectedRoute, updateFooterContact);
router.delete("/admin/footer/contact/:id", protectedRoute, deleteFooterContact);

module.exports = router;
