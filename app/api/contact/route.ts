import { NextRequest, NextResponse } from 'next/server';
import emailjs from '@emailjs/nodejs';

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, type, subject, message } = await request.json();

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Initialize EmailJS
    emailjs.init({
      publicKey: process.env.EMAILJS_PUBLIC_KEY!,
      privateKey: process.env.EMAILJS_PRIVATE_KEY!,
    });

    // Template parameters
    const templateParams = {
      from_name: name,
      from_email: email,
      from_phone: phone || '연락처 미제공',
      inquiry_type: getInquiryTypeText(type),
      subject: subject,
      message: message,
      to_email: process.env.GALLERY_EMAIL || 'space458seoul@gmail.com',
    };

    // Send email
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID!,
      process.env.EMAILJS_TEMPLATE_ID!,
      templateParams
    );

    console.log('Email sent successfully:', response);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to send email' },
      { status: 500 }
    );
  }
}

function getInquiryTypeText(type: string): string {
  switch (type) {
    case 'general': return '일반 문의';
    case 'exhibition': return '전시 관련';
    case 'rental': return '대관 문의';
    case 'collaboration': return '협업 제안';
    case 'workshop': return '워크숍 문의';
    case 'press': return '언론 문의';
    default: return type;
  }
}