import express from "express";
import Event from "../models/Event.js";
import SwapRequest from "../models/SwapRequest.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/swappable", protect, async (req, res) => {
  try {
    const events = await Event.find({
      status: "SWAPPABLE",
      owner: { $ne: req.user._id },
    }).populate("owner", "name");

    res.json(events);
  } catch (err) {
    console.error("❌ Error fetching swappable slots:", err);
    res.status(500).json({ message: "Server error while fetching swappable slots" });
  }
});


router.post("/request", protect, async (req, res) => {
  try {
    const { mySlotId, theirSlotId } = req.body;

    const mySlot = await Event.findById(mySlotId);
    const theirSlot = await Event.findById(theirSlotId).populate("owner", "name email");

    if (!mySlot || !theirSlot)
      return res.status(404).json({ message: "One or both slots not found" });

    if (!mySlot.owner)
      return res.status(400).json({ message: "Your slot has no owner" });

    if (!theirSlot.owner)
      return res.status(400).json({ message: "Target slot has no owner" });

    if (mySlot.owner.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You don't own this slot" });

    if (mySlot.status !== "SWAPPABLE" || theirSlot.status !== "SWAPPABLE")
      return res
        .status(400)
        .json({ message: "One or both slots are not available for swapping" });

    const existing = await SwapRequest.findOne({
      requester: req.user._id,
      responder: theirSlot.owner._id,
      mySlot: mySlot._id,
      theirSlot: theirSlot._id,
      status: "PENDING",
    });

    if (existing)
      return res
        .status(400)
        .json({ message: "A pending swap request already exists" });

    const newSwap = await SwapRequest.create({
      requester: req.user._id,
      responder: theirSlot.owner._id,
      mySlot: mySlot._id,
      theirSlot: theirSlot._id,
    });

    mySlot.status = "SWAP_PENDING";
    theirSlot.status = "SWAP_PENDING";
    await mySlot.save();
    await theirSlot.save();

    const populatedSwap = await SwapRequest.findById(newSwap._id)
      .populate("requester", "name email")
      .populate("responder", "name email")
      .populate("mySlot", "title startTime endTime")
      .populate("theirSlot", "title startTime endTime");

    res.status(201).json(populatedSwap);
  } catch (err) {
    console.error("🔥 Error creating swap request:", err);
    res.status(500).json({
      message: "Server error while creating swap request",
      error: err.message,
    });
  }
});


router.post("/respond/:id", protect, async (req, res) => {
  try {
    const { accept } = req.body;

    const swap = await SwapRequest.findById(req.params.id)
      .populate({
        path: "mySlot",
        populate: { path: "owner", select: "_id name email" },
      })
      .populate({
        path: "theirSlot",
        populate: { path: "owner", select: "_id name email" },
      });

    if (!swap)
      return res.status(404).json({ message: "Swap request not found" });

    if (swap.responder.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Not authorized to respond" });

    if (swap.status !== "PENDING")
      return res.status(400).json({ message: "Request already processed" });

    if (!swap.mySlot || !swap.theirSlot)
      return res
        .status(404)
        .json({ message: "One or both slots no longer exist" });

    // Ensure owners are available
    if (!swap.mySlot.owner || !swap.theirSlot.owner)
      return res.status(400).json({ message: "Slot owners missing" });

    if (accept) {
      // Swap ownership
      const tempOwner = swap.mySlot.owner._id;
      swap.mySlot.owner = swap.theirSlot.owner._id;
      swap.theirSlot.owner = tempOwner;

      swap.mySlot.status = "BUSY";
      swap.theirSlot.status = "BUSY";
      swap.status = "ACCEPTED";
    } else {
      swap.status = "REJECTED";
      swap.mySlot.status = "SWAPPABLE";
      swap.theirSlot.status = "SWAPPABLE";
    }

    await swap.mySlot.save();
    await swap.theirSlot.save();
    await swap.save();

    const updated = await swap
      .populate("requester", "name email")
      .populate("responder", "name email")
      .populate("mySlot", "title startTime endTime")
      .populate("theirSlot", "title startTime endTime");

    res.json(updated);
  } catch (err) {
    console.error("🔥 Error responding to swap:", err);
    res.status(500).json({
      message: "Server error while responding to swap",
      error: err.message,
    });
  }
});

/**
 * ================================
 *  GET /api/swap/requests
 *  Fetch all incoming & outgoing swap requests
 * ================================
 */
router.get("/requests", protect, async (req, res) => {
  try {
    const incoming = await SwapRequest.find({ responder: req.user._id })
      .populate("requester", "name email")
      .populate("mySlot", "title startTime endTime")
      .populate("theirSlot", "title startTime endTime")
      .sort({ createdAt: -1 });

    const outgoing = await SwapRequest.find({ requester: req.user._id })
      .populate("responder", "name email")
      .populate("mySlot", "title startTime endTime")
      .populate("theirSlot", "title startTime endTime")
      .sort({ createdAt: -1 });

    res.json({ incoming, outgoing });
  } catch (err) {
    console.error("🔥 Error fetching swap requests:", err);
    res.status(500).json({ message: "Server error while fetching swap requests" });
  }
});

export default router;
