import Feedback from "../models/Feedback.js";
import mongoose from "mongoose";
import User from "../models/User.js";
import SwapModel from "../models/SwapModel.js";

const addingFeedback = async (req, res) => {
    try {
        const swap_id = req.params.id;
        const raterId = req.userId;
        
        const {rating, feedback} = req.body;
        const swapObjectId = new mongoose.Types.ObjectId(swap_id);
        
        const swap = await SwapModel.find({_id: swapObjectId});
        if (!swap) return res.json(404).json({Success: false, message: "Swap not found"});

        let rateeId;
        if (swap[0].requesterId.toString() == raterId) {
            rateeId = swap[0].receiverId;
        } else {
            rateeId = swap[0].requesterId
        }

        swap[0].feedbackGiven = true;
        swap[0].feedback.rating = rating;
        swap[0].feedback.comment = feedback;
        
        await swap[0].save()
        console.log("saved successfully")

        const newFeedback = new Feedback({
            swapId: swapObjectId,
            raterId: new mongoose.Types.ObjectId(raterId),
            rateeId,
            rating,
            comment: feedback,
        })

        const isSavedFeedback = await newFeedback.save()

        const ratee = await User.findById(rateeId)
        const prevAvg = ratee.rating.avg;
        const prevCount = ratee.rating.count;

        const newCount = prevCount + 1;
        const newAvg = (prevAvg * prevCount + rating) / newCount

        ratee.rating.avg = newAvg;
        ratee.rating.count = newCount;

        await ratee.save();
        res.status(201).json({Success: true, message: "Feedback submitted", newFeedback})

    } catch (error) {
        res.status(500).json({Success: false, message: error.message})
    }
}

export {addingFeedback}