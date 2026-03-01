import { Request, Response } from "express";
import User from "../models/User";

export const matchUsers = async (req: Request, res: Response) => {
  try {
    const { focusArea, skillLevel } = req.query;
    const currentUserId = req.user!.id;
    const currentUser = await User.findById(currentUserId);

    const users = await User.find({
      focusArea,
      skillLevel,
      _id: { $ne: currentUserId, $nin: currentUser?.buddies || [] },
    }).select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Matching failed" });
  }
};

export const getBuddiesList = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user!.id;
    const currentUser = await User.findById(currentUserId);
    const buddiesIdList = currentUser?.buddies || [];

    const buddiesList = await User.find({ _id: { $in: buddiesIdList } }).select(
      "username avatar -_id",
    );

    res.json(
      buddiesList.map((buddy) => ({
        username: buddy.username,
        avatar: buddy.avatar,
      })),
    );
  } catch (error) {
    res.status(500).json({ message: "Matching failed" });
  }
};

export const connectBuddy = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user!.id;
    const { buddyUsername } = req.body;

    const currentUser = await User.findById(currentUserId);
    const buddy = await User.findOne({ username: buddyUsername });

    if (!buddy) return res.status(404).json({ message: "Buddy not found" });

    if (!currentUser?.buddies.includes(buddy._id)) {
      currentUser?.buddies.push(buddy._id);
      await currentUser?.save();
    }
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }
    if (!buddy.buddies.includes(currentUser._id)) {
      buddy.buddies.push(currentUser._id);
      await buddy.save();
    }

    res.json({ message: `Connected with ${buddyUsername}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Connection failed" });
  }
};
