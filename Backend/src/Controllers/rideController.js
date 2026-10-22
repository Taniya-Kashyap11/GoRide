const Ride =require("../Models/Ride.js");  
const createRide=async(req,res)=>{
 try {
    const {
      pickup,
      destination,
      rideType,
      distanceKm,
      durationMinutes,
      fare,
    } = req.body;

    if (
      !pickup?.address ||
      !destination?.address ||
      !pickup?.coordinates ||
      !destination?.coordinates ||
      !rideType ||
      distanceKm == null ||
      durationMinutes == null ||
      fare == null
    ) {
      return res.status(400).json({
        message: "Please provide all required ride details.",
      });
    }

    const validRideTypes = ["economy", "comfort", "premium", "xl"];

    if (!validRideTypes.includes(rideType)) {
      return res.status(400).json({
        message: "Invalid ride type.",
      });
    }

    const numbers = [
      pickup.coordinates.lat,
      pickup.coordinates.lon,
      destination.coordinates.lat,
      destination.coordinates.lon,
      distanceKm,
      durationMinutes,
      fare,
    ];

    if (
      !numbers.every(Number.isFinite) ||
      distanceKm <= 0 ||
      durationMinutes < 0 ||
      fare < 0
    ) {
      return res.status(400).json({
        message: "Invalid coordinates or ride estimates.",
      });
    }

    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const ride = await Ride.create({
      user: userId,
      pickup,
      destination,
      rideType,
      distanceKm,
      durationMinutes,
      fare,
    });
    const io = req.app.get("io");

io.emit("newRideAvailable", {
  rideId: ride._id.toString(),
});
    return res.status(201).json({
      message: "Ride booked successfully.",
      ride,
    });
  } catch (error) {
    console.error("Ride booking error:", error);

    return res.status(500).json({
      message: "Unable to book ride.",
    });
  }
}
const getRides= async (req, res) => {
  try {
    const rides = await Ride.find({
      captain: req.captain._id,
      status: { $in: ["accepted", "ongoing"] },
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Captain rides fetched successfully",
      rides,
    });
  } catch (error) {
    console.error("Captain rides error:", error);

    return res.status(500).json({
      message: "Unable to fetch captain rides",
    });
  }
}

const cancelRide=async (req, res) => {
  try {
    const ride = await Ride.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found.",
      });
    }

    if (ride.status !== "pending") {
      return res.status(400).json({
        message: "Only pending rides can be cancelled.",
      });
    }

    ride.status = "cancelled";
    await ride.save();

    return res.status(200).json({
      message: "Ride cancelled successfully.",
      ride,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ride ID.",
      });
    }

    console.error("Cancel ride error:", error);

    return res.status(500).json({
      message: "Unable to cancel ride.",
    });
  }
}
const acceptRide=async (req, res) => {
  try {
    const ride = await Ride.findOneAndUpdate(
      {
        _id: req.params.id,
        status: "pending",
        captain: null,
      },
      {
        $set: {
          captain: req.captain._id,
          status: "accepted",
        },
      },
      {
        new: true,
        runValidators: true,
      }
    ).populate("user", "firstName lastName email");
    const io = req.app.get("io");

io.emit("rideStatusChanged", {
  rideId: ride._id.toString(),
  status: ride.status,
});

    if (!ride) {
      return res.status(409).json({
        message: "This ride is no longer available.",
      });
    }

    return res.status(200).json({
      message: "Ride accepted successfully",
      ride,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({
        message: "Invalid ride ID",
      });
    }

    console.error("Accept ride error:", error);

    return res.status(500).json({
      message: "Unable to accept ride",
    });
  }
}
const assignRide=async (req, res) => {
  try {
    const rides = await Ride.find({
      captain: req.captain._id,
    })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Captain rides fetched successfully",
      rides,
    });
  } catch (error) {
    console.error("Captain rides error:", error);

    return res.status(500).json({
      message: "Unable to fetch captain rides",
    });
  }
}
const availableRides=async (req, res) => {
  try {
    console.log("Available routes");
    const rides = await Ride.find({
      status: "pending",
      captain: null,
    })
      .populate("user", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "Available rides fetched successfully",
      rides,
    });
  } catch (error) {
    console.error("Available rides error:", error);

    return res.status(500).json({
      message: "Unable to fetch available rides",
    });
  }
}
const startAcceptedRide=async (req, res) => {
  try {
    const ride = await Ride.findOneAndUpdate(
      {
        _id: req.params.id,
        captain: req.captain._id,
        status: "accepted",
      },
      {
        $set: { status: "ongoing" },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!ride) {
      return res.status(409).json({
        message:
          "Ride not found, not assigned to you, or not accepted.",
      });
    }
    const io = req.app.get("io");

io.emit("rideStatusChanged", {
  rideId: ride._id.toString(),
  status: ride.status,
});
    return res.status(200).json({
      message: "Ride started successfully.",
      ride,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ride ID." });
    }

    console.error("Start ride error:", error);
    return res.status(500).json({
      message: "Unable to start ride.",
    });
  }
}
const completeOngoingRide=async (req, res) => {
  try {
    const ride = await Ride.findOneAndUpdate(
      {
        _id: req.params.id,
        captain: req.captain._id,
        status: "ongoing",
      },
      {
        $set: { status: "completed" },
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!ride) {
      return res.status(409).json({
        message:
          "Ride not found, not assigned to you, or not ongoing.",
      });
    }
    const io = req.app.get("io");

io.emit("rideStatusChanged", {
  rideId: ride._id.toString(),
  status: ride.status,
});
    return res.status(200).json({
      message: "Ride completed successfully.",
      ride,
    });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid ride ID." });
    }

    console.error("Complete ride error:", error);
    return res.status(500).json({
      message: "Unable to complete ride.",
    });
  }

}
  const getUserRides = async (req, res) => {
  try {
    console.log("Get user rides");
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        message: "Authentication required.",
      });
    }

    const rides = await Ride.find({
      user: userId,
    })
      .populate("captain", "firstName lastName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      message: "User rides fetched successfully.",
      count: rides.length,
      rides,
    });
  } catch (error) {
    console.error("User rides error:", error);

    return res.status(500).json({
      message: "Unable to fetch user rides.",
    });
  }
};
module.exports={
  createRide,
  getRides,
  cancelRide,
  acceptRide,
  assignRide,
  availableRides,
  startAcceptedRide,
  completeOngoingRide,
  getUserRides,
}


