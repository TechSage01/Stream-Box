import React from 'react';

const sections = [
  {
    title: "Acceptance of Terms",
    content: `By accessing and using StreamBox, you accept and agree to be bound by the terms
    and provisions of this agreement. If you do not agree, please do not use this service.`
  },
  {
    title: "Use License",
    content: `Permission is granted to temporarily use StreamBox for personal, non-commercial
    transitory viewing only. This is a license, not a transfer of title, and you may not:`,
    list: [
      "Modify or copy the materials",
      "Use the materials for any commercial purpose or for any public display",
      "Attempt to decompile or reverse engineer any software contained on StreamBox",
      "Remove any copyright or other proprietary notations from the materials"
    ]
  },
  {
    title: "User Responsibilities",
    content: `You are responsible for maintaining the confidentiality of your account and password.
    You agree to accept responsibility for all activities that occur under your account or password.
    You must not use StreamBox for any illegal or unauthorized purpose.`
  },
  {
    title: "Content",
    content: `Our service allows you to access various entertainment content. We do not host or
    store any content on our servers. All content is provided by third-party sources.`
  },
  {
    title: "Termination",
    content: `We may terminate or suspend your account and access to StreamBox immediately,
    without prior notice or liability, for any reason whatsoever, including if you breach the Terms.`
  },
  {
    title: "Contact Information",
    content: `If you have any questions about these Terms, please contact us at streambox.ng@mbox.ng.`
  }
];

const UserAgreement = () => {
  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Title */}
        <h1 className="text-4xl font-bold text-center mb-12 text-red-600">
          User Agreement
        </h1>

        {/* Agreement Content */}
        <div className="bg-black p-8 rounded-xl shadow-lg space-y-8">
          {sections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="text-2xl font-semibold text-red-500">{idx + 1}. {section.title}</h2>
              <p className="text-gray-300 leading-relaxed">{section.content}</p>
              {section.list && (
                <ul className="list-disc list-inside ml-5 mt-2 text-gray-300 space-y-1">
                  {section.list.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-gray-500 text-sm text-center">
          © 2024 StreamBox. All rights reserved. This User Agreement outlines your responsibilities 
          and our obligations. We do not store or upload any content; all rights belong to original creators.
        </p>
      </div>
    </div>
  );
};

export default UserAgreement;