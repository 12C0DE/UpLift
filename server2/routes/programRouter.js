const express = require("express");
const router = express.Router();
const Program = require("../models/Program");

//get all programs
router.get("/", async (req, res) => {
  try {
    const programs = await Program.find();
    res.json(programs);
  } catch (err) {
    res.json({ message: err });
  }
});

router.get("/all/:uid", async (req, res) => {
  try {
    const programs = await Program.find({ uid: req.params.uid });
    res.json(programs);
  } catch (err) {}
});

//get specific program
router.get("/:_id", async (req, res) => {
  try {
    const oneProgram = await Program.findById(req.params._id);
    res.json(oneProgram);
  } catch (err) {
    res.json({ message: err });
  }
});

//create program
router.post("/", async (req, res) => {
  const programPost = new Program({
    programName: req.body.programName,
    uid: req.body.uid,
    workouts: req.body.workouts
  });

  const savedProgram = await programPost.save();
  try {
    res.json(savedProgram);
  } catch (err) {
    res.json({ message: err });
  }
});

module.exports = router;
