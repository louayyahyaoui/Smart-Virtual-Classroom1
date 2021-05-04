const express = require("express");
const router = express.Router();
const {
  getClass,
  addClass,
  updateClass,
  deleteClass,
  ClassByDateYear,
  ClassByLevel,
  addUserToClass,
  deleteAllClass,
  removeUserFromClass,
  getClassById,
  getUserByEmail,
} = require("../controllers/Class.js");
router.get("/", getClass);
router.get("/byyear/:id", ClassByDateYear);
router.get("/bylevel/:id", ClassByLevel);
router.post("/", addClass);
router.put("/:id", updateClass);
router.delete("/:id", deleteClass);
router.delete("/", deleteAllClass);
router.put("/:id/:email", addUserToClass);
router.put("/r/:id/:email", removeUserFromClass);
router.get("/email/:email", getUserByEmail);
router.get("/:_id", getClassById);
module.exports = router;
