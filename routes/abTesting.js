const express = require("express");
const router = express.Router();
const path = require("path");

const getClientIp = (req) => {
  return (
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.ip
  );
};

// Route to handle home page routing
router.get("/home", (req, res) => {
  let assignedPage = req.cookies["assignedPage"];
  let visitInfo = req.cookies["visitInfo"];
  const clientIp = getClientIp(req);
  const timestamp = new Date().toISOString();

  if (!assignedPage) {
    const newVisitInfo = {
      ip: clientIp,
      timestamp: timestamp,
    };
    assignedPage = Math.random() < 0.5 ? "A" : "B";
    visitInfo = [newVisitInfo];
    res.cookie("assignedPage", assignedPage, { maxAge: 24 * 60 * 60 * 1000 }); // Cookie valid for 1 day
    // res.cookie("visitInfo", JSON.stringify(visitInfo), {
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
  }

  const filePath =
    assignedPage === "A"
      ? path.join(__dirname, "../public/homepageA.html")
      : path.join(__dirname, "../public/homepageB.html");

  res.sendFile(filePath);
});

router.post("/track", (req, res) => {
  const { version, buttonId, timestamp } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  let visitInfo = req.cookies["visitInfo"];
  if (!visitInfo) {
    const newVisitInfo = {
      version,
      buttonId,
      timestamp,
      ip,
    };
    visitInfo = [newVisitInfo];
    console.log(newVisitInfo);
    res.cookie("visitInfo", JSON.stringify(visitInfo), {
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  res.status(200).send({ success: true });
});

module.exports = router;
