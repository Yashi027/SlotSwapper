import express from "express";
import Event from "../models/Event.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create
router.post("/", protect, async (req, res) => {
  const { title, startTime, endTime } = req.body;
  const event = await Event.create({ owner: req.user._id, title, startTime, endTime });
  res.json(event);
});

// My events
router.get("/mine", protect, async (req, res) => {
  const events = await Event.find({ owner: req.user._id }).sort({ startTime: 1 });
  res.json(events);
});

// Update
router.put("/:id", protect, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event || event.owner.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });
  Object.assign(event, req.body);
  await event.save();
  res.json(event);
});

// Delete
router.delete("/:id", protect, async (req, res) => {
  const event = await Event.findById(req.params.id);
  if (!event || event.owner.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });
  await event.deleteOne();
  res.json({ success: true });
});

export default router;
