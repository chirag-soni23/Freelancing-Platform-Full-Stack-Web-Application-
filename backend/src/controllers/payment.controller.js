import Stripe from "stripe";
import db from "../models/index.js";
import ApiError, { successResponse } from "../utils/apiResponse.js";
import { StatusCodes } from "../config/index.js";
import dotenv from "dotenv";

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// create payment session
export const createPayment = async (req, res, next) => {
  try {
    const { bidId } = req.params;

    const bid = await db.Bid.findOne({
      where: {
        id: bidId,
        status: "accepted",
      },
      include: [
        {
          model: db.Job,
          as: "job",
        },
      ],
    });

    if (!bid) {
      throw ApiError.NOTFOUND("Accepted bid not found");
    }

    // check existing payment
    const existingPayment = await db.Payment.findOne({
      where: {
        bidId: bid.id,
      },
    });

    if (existingPayment) {
      if (existingPayment.status === "paid") {
        throw ApiError.BADREQUEST("Payment already completed");
      }

      // Pending payment hai
      const session = await stripe.checkout.sessions.retrieve(
        existingPayment.stripeSessionId,
      );

      return successResponse(res, StatusCodes.OK, {
        message: "Continue existing payment",
        url: session.url,
      });
    }

    if (existingPayment) {
      if (existingPayment.status === "paid") {
        throw ApiError.BADREQUEST("Payment already completed");
      }

      throw ApiError.BADREQUEST(
        "Payment already initiated. Complete the existing payment.",
      );
    }

    // delivery period check
    if (bid.acceptedAt) {
      const unlockDate = new Date(bid.acceptedAt);

      unlockDate.setDate(unlockDate.getDate() + bid.deliveryDays);

      if (new Date() < unlockDate) {
        throw ApiError.BADREQUEST(
          `Payment available after ${unlockDate.toLocaleDateString()}`,
        );
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      line_items: [
        {
          quantity: 1,

          price_data: {
            currency: bid.currency.toLowerCase(),

            product_data: {
              name: bid.job.title,
            },

            unit_amount: Math.round(bid.amount * 100),
          },
        },
      ],

      metadata: {
        bidId: bid.id,
        jobId: bid.jobId,
        clientId: bid.clientId,
        freelancerId: bid.freelancerId,
      },

      success_url: `${process.env.CLIENT_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}&jobId=${bid.jobId}`,

      cancel_url: `${process.env.CLIENT_URL}/payment-cancel`,
    });

    const payment = await db.Payment.create({
      stripeSessionId: session.id,

      amount: bid.amount,

      currency: bid.currency,

      status: "pending",

      bidId: bid.id,

      jobId: bid.jobId,

      clientId: bid.clientId,

      freelancerId: bid.freelancerId,
    });

    return successResponse(res, StatusCodes.OK, {
      message: "Payment session created",

      url: session.url,

      data: payment,
    });
  } catch (error) {
    console.log("CREATE PAYMENT ERROR:", error);
    next(error);
  }
};

// stripe webhook
export const stripeWebhook = async (req, res) => {
  try {
    console.log("================================");
    console.log("STRIPE WEBHOOK RECEIVED");
    console.log("================================");

    const signature = req.headers["stripe-signature"];

    const event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );

    console.log("Event Type:", event.type);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      console.log("Checkout Session Completed:", session.id);

      const payment = await db.Payment.findOne({
        where: {
          stripeSessionId: session.id,
        },
      });

      if (payment) {
        payment.status = "paid";
        payment.paidAt = new Date();
        payment.stripePaymentIntentId = session.payment_intent;

        await payment.save();

        // If complete the payment the job is closed
        await db.Job.update(
          {
            paymentStatus: "paid",
            projectStatus: "completed",
            status: "closed",
            completedAt: new Date(),
          },
          {
            where: {
              id: payment.jobId,
            },
          },
        );

        console.log("Payment Updated Successfully");

        console.log({
          paymentId: payment.id,
          bidId: payment.bidId,
          jobId: payment.jobId,
          amount: payment.amount,
          currency: payment.currency,
          status: payment.status,
        });
      }
    }

    return res.status(200).json({
      received: true,
    });
  } catch (error) {
    console.log("WEBHOOK ERROR:", error.message);

    return res.status(400).json({
      error: error.message,
    });
  }
};

// payment status
export const getPaymentStatus = async (req, res, next) => {
  try {
    const { bidId } = req.params;

    const payment = await db.Payment.findOne({
      where: {
        bidId,
      },

      include: [
        {
          model: db.Bid,
          as: "bid",
        },

        {
          model: db.Job,
          as: "job",
        },

        {
          model: db.User,
          as: "client",
          attributes: ["id", "name", "email"],
        },

        {
          model: db.User,
          as: "freelancer",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    if (!payment) {
      throw ApiError.NOTFOUND("Payment not found");
    }

    return successResponse(res, StatusCodes.OK, {
      message: "Payment fetched successfully",

      data: payment,
    });
  } catch (error) {
    next(error);
  }
};

// my payments
export const getMyPayments = async (req, res, next) => {
  try {
    const payments = await db.Payment.findAll({
      where:
        req.user.role === "client"
          ? {
              clientId: req.user.id,
            }
          : {
              freelancerId: req.user.id,
            },

      include: [
        {
          model: db.Job,
          as: "job",
          attributes: ["id", "title"],
        },
      ],

      order: [["createdAt", "DESC"]],
    });

    return successResponse(res, StatusCodes.OK, {
      message: "Payments fetched successfully",

      data: payments,
    });
  } catch (error) {
    next(error);
  }
};
