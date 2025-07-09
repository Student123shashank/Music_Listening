const router = require("express").Router();
const Subscription = require("../models/subscription");
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

// Improved calculateEndDate function with timezone consideration
function calculateEndDate(planType) {
    const now = new Date();
    let endDate;
    
    switch (planType) {
        case "monthly":
            endDate = new Date(now);
            endDate.setMonth(endDate.getMonth() + 1);
            return endDate;
        case "quarterly":
            endDate = new Date(now);
            endDate.setMonth(endDate.getMonth() + 3);
            return endDate;
        case "yearly":
            endDate = new Date(now);
            endDate.setFullYear(endDate.getFullYear() + 1);
            return endDate;
        default:
            throw new Error("Invalid plan type");
    }
}

// Create subscription with enhanced validation
router.post("/subscription/create", authenticateToken, async (req, res) => {
    try {
        const { userId, planType, amount } = req.body;

        // Validate required fields
        if (!userId || !planType || !amount) {
            return res.status(400).json({ 
                message: "Missing required fields: userId, planType, or amount" 
            });
        }

        // Validate plan type
        if (!["monthly", "quarterly", "yearly"].includes(planType)) {
            return res.status(400).json({ 
                message: "Invalid plan type. Must be monthly, quarterly, or yearly" 
            });
        }

        // Validate amount
        if (amount <= 0) {
            return res.status(400).json({ 
                message: "Amount must be greater than 0" 
            });
        }

        // Check if user exists
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check for existing active subscription
        const existingSub = await Subscription.findOne({ 
            user: userId, 
            status: "active",
            endDate: { $gt: new Date() }
        });

        if (existingSub) {
            return res.status(400).json({ 
                message: "User already has an active subscription",
                existingSubscription: existingSub
            });
        }

        // Create new subscription
        const endDate = calculateEndDate(planType);
        const newSub = new Subscription({
            user: userId,
            planType,
            amount,
            startDate: new Date(),
            endDate,
            status: "active"
        });

        const savedSub = await newSub.save();
        
        res.status(201).json({ 
            message: "Subscription created successfully",
            subscription: savedSub
        });

    } catch (err) {
        console.error("Subscription creation error:", {
            error: err.message,
            stack: err.stack,
            body: req.body
        });
        
        if (err.message.includes("Invalid plan type")) {
            return res.status(400).json({ message: err.message });
        }
        
        if (err.name === 'ValidationError') {
            return res.status(400).json({ 
                message: "Validation error",
                errors: Object.values(err.errors).map(e => e.message)
            });
        }
        
        res.status(500).json({ 
            message: "Failed to create subscription",
            error: err.message 
        });
    }
});

// Get user's subscription with improved population
router.get("/subscription/user/:userId", authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const subscription = await Subscription.findOne({ user: userId })
            .populate("user", "username email")
            .sort({ startDate: -1 })
            .lean();

        if (!subscription) {
            return res.status(404).json({ 
                message: "No subscription found for this user",
                hasSubscription: false
            });
        }

        res.status(200).json({
            message: "Subscription found",
            hasSubscription: true,
            subscription
        });

    } catch (err) {
        console.error("Subscription fetch error:", {
            error: err.message,
            stack: err.stack,
            params: req.params
        });
        res.status(500).json({ 
            message: "Failed to fetch subscription",
            error: err.message 
        });
    }
});

// Cancel subscription with status validation
router.put("/subscription/cancel/:id", authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ message: "Subscription ID is required" });
        }

        const subscription = await Subscription.findById(id);

        if (!subscription) {
            return res.status(404).json({ message: "Subscription not found" });
        }

        if (subscription.status !== "active") {
            return res.status(400).json({ 
                message: "Only active subscriptions can be cancelled",
                currentStatus: subscription.status
            });
        }

        subscription.status = "cancelled";
        subscription.cancelledAt = new Date();
        await subscription.save();

        res.status(200).json({ 
            message: "Subscription cancelled successfully",
            updatedSubscription: subscription
        });

    } catch (err) {
        console.error("Subscription cancellation error:", {
            error: err.message,
            stack: err.stack,
            params: req.params
        });
        res.status(500).json({ 
            message: "Failed to cancel subscription",
            error: err.message 
        });
    }
});

// Check subscription status with date validation
router.get("/subscription/status/:userId", authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        
        if (!userId) {
            return res.status(400).json({ message: "User ID is required" });
        }

        const subscription = await Subscription.findOne({ 
            user: userId 
        }).sort({ startDate: -1 });

        if (!subscription) {
            return res.status(200).json({ 
                active: false,
                message: "No subscription found"
            });
        }

        const now = new Date();
        const isActive = subscription.status === "active" && subscription.endDate > now;

        res.status(200).json({ 
            active: isActive,
            status: subscription.status,
            endDate: subscription.endDate,
            daysRemaining: isActive ? 
                Math.ceil((subscription.endDate - now) / (1000 * 60 * 60 * 24)) : 0
        });

    } catch (err) {
        console.error("Subscription status check error:", {
            error: err.message,
            stack: err.stack,
            params: req.params
        });
        res.status(500).json({ 
            message: "Failed to check subscription status",
            error: err.message 
        });
    }
});

// Get all subscriptions with pagination and filtering
router.get("/subscription/all", authenticateToken, async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const query = {};

        if (status) {
            query.status = status;
        }

        const subscriptions = await Subscription.find(query)
            .populate("user", "username email")
            .sort({ startDate: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const count = await Subscription.countDocuments(query);

        res.status(200).json({
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            subscriptions
        });

    } catch (err) {
        console.error("All subscriptions fetch error:", {
            error: err.message,
            stack: err.stack,
            query: req.query
        });
        res.status(500).json({ 
            message: "Failed to fetch subscriptions",
            error: err.message 
        });
    }
});

// Route to test if the subscription routes are working
router.get("/subscription/test", (req, res) => {
    res.status(200).json({ 
        message: "Subscription routes are working!",
        timestamp: new Date().toISOString()
    });
});


router.get("/subscription/total-subscriptions", async (req, res) => {
  try {
    const count = await Subscription.countDocuments();
    res.status(200).json({ status: "Success", count });
  } catch (err) {
    console.error("Error fetching subscription count:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


module.exports = router;