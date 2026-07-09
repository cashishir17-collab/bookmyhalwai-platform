import { NextResponse } from "next/server";

type ContactPayload = {
  businessName?: string;
  ownerName?: string;
  email?: string;
  phone?: string;
  city?: string;
  message?: string;
};

function normalize(input: unknown) {
  return typeof input === "string" ? input.trim() : "";
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone: string) {
  return /^\+?[0-9\s()-]{7,20}$/.test(phone);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ContactPayload;

    const payload: Required<ContactPayload> = {
      businessName: normalize(body.businessName),
      ownerName: normalize(body.ownerName),
      email: normalize(body.email),
      phone: normalize(body.phone),
      city: normalize(body.city),
      message: normalize(body.message),
    };

    if (Object.values(payload).some((value) => !value)) {
      return NextResponse.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    if (!isValidEmail(payload.email)) {
      return NextResponse.json(
        { message: "Please provide a valid email address." },
        { status: 400 },
      );
    }

    if (!isValidPhone(payload.phone)) {
      return NextResponse.json(
        { message: "Please provide a valid phone number." },
        { status: 400 },
      );
    }

    // Temporary contact capture until the final outbound support workflow is connected.
    console.log("CONTACT_ENQUIRY_RECEIVED", {
      businessName: payload.businessName,
      ownerName: payload.ownerName,
      email: payload.email,
      phone: payload.phone,
      city: payload.city,
      message: payload.message,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your enquiry has been received. Our team will contact you shortly.",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("CONTACT_ROUTE_ERROR", error);
    return NextResponse.json(
      { message: "Unable to send message right now. Please try again shortly." },
      { status: 500 },
    );
  }
}