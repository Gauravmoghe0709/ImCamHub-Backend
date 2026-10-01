const express = require("express")
const cookieparser = require("cookie-parser")
const HomeRoutes = require("./router/home.routes")
const AdminDashboardPageRoutes = require("./router/AdminDashboardPage.router")
const CaseworkerPortalpageRoutes = require("./router/CaseworkerPortalpage.router")
const ClientPortalPageRoutes = require("./router/ClientPortalPage.router")
const SponsorBusinessRoutes = require("./router/SponsorBusinessPortal.router")
const SolutionsPageRoutes = require("./router/SolutionsPage.router")
const PricingPageRoutes = require("./router/Pricingpage.router")
const BookDemoPageRoutes = require("./router/BookDemoPage.router")
const FooterRoutes = require("./router/Footer")

const app = express()

app.use(express.json())
app.use(cookieparser())


app.use("/api", HomeRoutes)
app.use("/api", AdminDashboardPageRoutes)
app.use("/api", CaseworkerPortalpageRoutes)
app.use("/api", ClientPortalPageRoutes)
app.use("/api", SponsorBusinessRoutes)
app.use("/api", SolutionsPageRoutes)
app.use("/api", PricingPageRoutes)
app.use("/api", BookDemoPageRoutes)
app.use("/api", FooterRoutes)

module.exports = app