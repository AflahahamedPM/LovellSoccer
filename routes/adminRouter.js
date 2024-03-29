const express = require("express");
const router = express.Router();
const adminController = require("../controller/adminController");
const adminSession = require("../middleware/adminSession");
const adminDashboardController = require("../controller/adminDashboardController");
const adminProductController = require("../controller/adminProductController");
const adminCategoryController = require("../controller/adminCategoryController");
const adminCustomerManagement = require("../controller/adminCustomerManagement");
const adminBrandController = require("../controller/adminBrandController");
const adminCouponController = require("../controller/adminCouponController");
const adminOrderController = require("../controller/adminOrderController");
const adminBannerController = require("../controller/adminBannerController")
const adminCancelRequestController = require("../controller/adminCancelRequestController")
const upload = require("../utilities/imageProcessor");

router.get("/login", adminController.loginPage);

router.post("/login", adminController.adminVerification);

// Dashboard
router
  .get("/dashboard", adminSession, adminDashboardController.view)
  .put("/dashboard", adminSession, adminDashboardController.chartData);

router.get(
  "/chart/:id",
  adminSession,
  adminDashboardController.customChartData
);
// Products
router
  .get("/productManagement", adminSession, adminProductController.viewProducts)
  .post(
    "/productManagement",
    adminSession,
    upload.fields([
      { name: "frontImage", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 3 },
    ]),
    adminProductController.addProducts
  );

// product edit

router
  .get(
    "/productManagement/:id",
    adminSession,
    adminProductController.showEditProduct
  )
  .post(
    "/productManagement/:id",
    adminSession,
    upload.fields([
      { name: "frontImage", maxCount: 1 },
      { name: "thumbnail", maxCount: 1 },
      { name: "images", maxCount: 3 },
    ]),
    adminProductController.saveEditProduct
  );

// change listing
router.patch(
  "/productManagement/changeListing/:id",
  adminSession,
  adminProductController.changeListing
);
// category
router
  .get("/categories", adminSession, adminCategoryController.listCategory)
  .post("/categories", adminSession, adminCategoryController.addCategory);

//   category edit
router
  .get(
    "/categories/:id",
    adminSession,
    adminCategoryController.showEditCategory
  )
  .post(
    "/categories/:id",
    adminSession,
    adminCategoryController.saveEditCategory
  );

//   brands
router
  .get("/brands", adminSession, adminBrandController.listBrand)
  .post("/brands", adminSession, adminBrandController.addBrand);

// brand edit
router
  .get("/brands/:id", adminSession, adminBrandController.showEditBrand)
  .post("/brands/:id", adminSession, adminBrandController.saveEditBrand);

// Customers
router
  .get("/customerManagement", adminSession, adminCustomerManagement.getAllUsers)
  .patch(
    "/customerManagement",
    adminSession,
    adminCustomerManagement.updateBan
  );

// coupon
router
  .get("/couponManagement", adminSession, adminCouponController.getCouponPage)
  .post("/couponManagement", adminSession, adminCouponController.addNewCoupon);

router.get(
  "/couponManagement/changeActivity",
  adminSession,
  adminCouponController.changeCouponActivity
);

// order

router
  .get("/orders", adminSession, adminOrderController.showAdminOrderPage)
  .get("/orders/:id", adminSession, adminOrderController.orderDetails);

// banner
router
.get('/bannerManagement',adminSession,adminBannerController.getBannerPage)
.post('/bannerManagement',adminSession,upload.single('bannerImage'),adminBannerController.addNewBanner)
.patch('/bannerManagement',adminSession,adminBannerController.changeBannerActivity)
.delete('/bannerManagement',adminSession,adminBannerController.deleteBanner)

// cacnel request
router
.get('/cancelRequests',adminSession,adminCancelRequestController.getAllCancelRequests)
.patch('/cancelRequests',adminSession,adminCancelRequestController.acceptCancelRequest)

module.exports = router;
