import connectDB from "@/lib/mongodb";
import Admin from "@/models/Admin";
import Contact from "@/models/contact";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const POST = async (req: Request) => {
  try {
    await connectDB();

    // Extracting data from the request body
    const { name, email, subject, message } = await req.json();

    // Validating the input fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Creating a new contact entry in the database
    const contact = await Contact.create({ name, email, subject, message });

    // Sending email notification
    await sendEmail({ name, email, subject, message });

    // Responding with the created contact data
    return NextResponse.json(contact);
  } catch (error) {
    console.error("Error processing the request:", error);
    return NextResponse.json(
      { error: "Internal Server Error." },
      { status: 500 }
    );
  }
};

const sendEmail = async ({ name, email, subject, message }: { name: string; email: string; subject: string; message: string }) => {
  try {
    // Configuring the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const admin = await Admin.findOne();
    if (!admin || !admin.email) {
      throw new Error("Admin email not found.");
    }

    // Email options
    const mailOptions = {
      from: email, // Sender's email address from the request
      to: admin.email, // Admin or recipient email
      subject: `New Contact Form Submission: ${subject}`,
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
              <h2 style="color: #555;">New Contact Form Submission</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <p style="margin-left: 20px;">${message}</p>
              <hr style="border: 1px solid #ddd; margin: 20px 0;">
              <p style="font-size: 12px; color: #777;">This email was sent from your website contact form.</p>
            </div>`
    };

    // Sending the email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email.");
  }
};

