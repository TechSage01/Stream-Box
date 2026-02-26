import React from 'react';

const privacySections = [
  {
    title: "Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account,
    use our services, or contact us for support. This may include your name, email address,
    and any other information you choose to provide.`
  },
  {
    title: "How We Use Your Information",
    content: `We use the information we collect to provide, maintain, and improve our services,
    process transactions, send you technical notices and support messages, and respond
    to your comments and questions.`
  },
  {
    title: "Information Sharing",
    content: `We do not sell, trade, or otherwise transfer your personal information to third parties
    without your consent, except as described in this policy or as required by law.`
  },
  {
    title: "Data Security",
    content: `We implement appropriate security measures to protect your personal information against
    unauthorized access, alteration, disclosure, or destruction.`
  },
  {
    title: "Contact Us",
    content: `If you have any questions about this Privacy Policy, please contact us at
    streambox.ng@mbox.ng.`
  }
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-12 text-red-600">
          Privacy Policy
        </h1>

        {/* Privacy Sections */}
        <div className="bg-black p-8 rounded-xl shadow-lg space-y-8">
          {privacySections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-2xl font-semibold text-red-500">{idx + 1}. {section.title}</h2>
              <p className="text-gray-300 leading-relaxed">{section.content}</p>
            </section>
          ))}
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-gray-500 text-sm text-center">
          © 2024 StreamBox. All rights reserved. Your privacy is important to us. We do not store or upload
          any content; all rights belong to the original creators.
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;