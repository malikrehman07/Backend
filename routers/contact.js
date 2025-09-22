// routes/contact.js
const express = require("express");
const router = express.Router();
const Contact = require("../models/contact");
const Newsletter = require("../models/newsletter");
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

// POST -> add new contact message
router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        if (!name || !email || !message) {
            return res.status(400).json({ message: "All fields required", isError: true });
        }

        const newMessage = new Contact({ name, email, message });
        await newMessage.save();

        // Mail to User (confirmation)
        const userMsg = {
            from: "GiveHope <contact@malikrehman.xyz>",
            to: email,
            subject: "Thanks for contacting GiveHope 🎉",
            html: `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Email</title>
      <style>
        body { font-family: Arial, Helvetica, sans-serif; background-color: #f4f6f8; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 30px auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: #111827; color: #ffffff; padding: 20px; text-align: center; }
        .header h1 { margin: 0; font-size: 22px; }
        .content { padding: 25px; color: #333333; line-height: 1.6; }
        .content h2 { color: #111827; margin-top: 0; }
        .btn { display: inline-block; margin-top: 20px; padding: 12px 20px; background: #247c67; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; }
        .footer { background: #f4f6f8; color: #666666; font-size: 13px; text-align: center; padding: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>GiveHope</h1>
        </div>
        <div class="content">
          <h2>Hi ${name},</h2>
          <p>
            Thank you for reaching out! We’ve received your message and our team will get back to you shortly.  
            Your request is important to us, and we aim to reply within 24 hours.
          </p>
          <a href="https://malikrehman.xyz" class="btn  ">Visit Website</a>
        </div>
        <div class="footer">
          © 2025Malik Rehman. All rights reserved.  
          <br />
          <a href="https://malikrehman.xyz/unsubscribe">Unsubscribe</a>
        </div>
      </div>
    </body>
  </html>
  `,
        };

        // Mail to Admin (so you get the user’s message)
        const adminMsg = {
            from: "Contact <contact@malikrehman.xyz>", // replace with custom sender if you verified your domain
            to: "contact@malikrehman.xyz",
            subject: `New Contact Form Message from ${name}`,
            html: `<h2>New Contact Form Submission</h2>
                   <p><b>Name:</b> ${name}</p>
                   <p><b>Email:</b> ${email}</p>
                   <p><b>Message:</b></p>
                   <blockquote>${message}</blockquote>`
        };

        // Send both emails
        await resend.emails.send(userMsg);
        await resend.emails.send(adminMsg);

        res.status(201).json({ message: "Message sent successfully", isError: false });
    } catch (err) {
        console.error("Contact form error:", err);
        res.status(500).json({ message: "Something went wrong", isError: true });
    }
});


// Subscribe API
router.post("/subscribe", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }

        const existing = await Newsletter.findOne({ email });
        if (existing) {
            return res.status(400).json({ success: false, message: "Email already subscribed" });
        }

        const subscriber = new Newsletter({ email });
        await subscriber.save();

        // ✅ Send email via Resend
        await resend.emails.send({
            from: "GiveHope <contact@malikrehman.xyz>", // must be a verified domain in Resend
            to: email,
            subject: "Welcome to Our Newsletter 🎉",
            html: `
                <h2>Welcome!</h2>
                <p>Thank you for subscribing to our newsletter. 🎉</p>
                <p>You'll now stay updated with our latest offers and news.</p>
            `,
        });

        return res.json({ success: true, message: "Subscribed successfully and email sent!" });
    } catch (error) {
        console.error("Error in subscription:", error.message || error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});


module.exports = router;
