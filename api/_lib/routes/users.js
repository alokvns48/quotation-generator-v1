const express = require("express");
const { verifyToken, requireOwner } = require("../middleware/auth");
const {
  listUsers,
  inviteUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

router.use(verifyToken, requireOwner);
router.get("/", listUsers);
router.post("/invite", inviteUser);
router.delete("/:id", deleteUser);

module.exports = router;
