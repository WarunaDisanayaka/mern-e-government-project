const express = require("express");
const router = express.Router();
const certificationController = require("../controllers/certificationController");

router.post(
  "/request-certification",
  certificationController.createCertificationRequest
);

router.get(
  "/certification-requests/user/:userId",
  certificationController.getCertificationRequestsByUserId
);
router.get(
  "/certification-requests/division/:divisionId",
  certificationController.getCertificationRequestsByDivisionId
);

module.exports = router;
