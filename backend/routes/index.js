const router = require("express").Router();
const getRouter = require("./getRoutes");
const postRouter = require("./postRoutes");

router.use("/", getRouter);
router.use("/", postRouter);

module.exports = router;