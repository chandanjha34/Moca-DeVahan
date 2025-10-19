import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: "Is my vehicle data secured on the NFT blockchain?",
    answer: "Yes, ownership and details are cryptographically secured and only updatable by verified dealers or owners.",
    color: "#fff700" // neon yellow
  },
  {
    question: "Can I transfer my vehicle NFT?",
    answer: "Absolutely! You can transfer the NFT to a new owner, and the vehicle registry updates instantly on blockchain.",
    color: "#00ffe7" // neon blue
  },
  {
    question: "What happens to my previous vehicle records?",
    answer: "All previous ownership and history are securely stored and viewable in the NFT’s complete audit trail.",
    color: "#fff700"
  },
  {
    question: "How do I prove NFT vehicle ownership?",
    answer: "Your blockchain wallet address acts as proof. Ownership can be validated in-app and on chain explorers.",
    color: "#00ffe7"
  },
  {
    question: "How do I update insurance or service history?",
    answer: "Authorized service centers and insurance providers can add entries via our NFT registry portal.",
    color: "#fff700"
  },
  {
    question: "Where can I find and download my vehicle certificate?",
    answer: "You can access and download your certified NFT vehicle documents directly from your dashboard.",
    color: "#00ffe7"
  }
];

function FAQSection() {
  const [open, setOpen] = useState(Array(faqs.length).fill(false));

  const handleToggle = (idx: number) =>
    setOpen(open => open.map((o, i) => (i === idx ? !o : o)));

  return (
    <div id="faq" className="faq max-w-4xl mx-auto mt-32 mb-8 px-4 py-10 rounded-xl bg-white/5 border border-white/15 shadow-lg backdrop-blur-lg">
      <h2
        className="text-4xl font-bold mb-8 flex items-center gap-2"
        style={{ color: "#00ffe7" }}
      >
        <HelpCircle className="w-24 h-24" style={{ color: "#00ffe7" }} />
        Frequently Asked Questions
      </h2>

      <div className="space-y-8">
        {faqs.map((faq, idx) => (
          <div
            key={faq.question}
            className={`rounded-lg border transition-all ${
              open[idx]
                ? "border-white/30 bg-white/7"
                : "border-white/15 bg-transparent"
            }`}
          >
            {/* Question */}
            <button
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none text-2xl font-semibold"
              style={{ color: faq.color }}
              onClick={() => handleToggle(idx)}
            >
              <span>{faq.question}</span>
              {open[idx] ? (
                <ChevronUp className="w-10 h-10" style={{ color: "#fff700" }} />
              ) : (
                <ChevronDown className="w-10 h-10" style={{ color: "#00ffe7" }} />
              )}
            </button>

            {/* Answer */}
            {open[idx] && (
              <div className="px-8 pb-8 text-white/80 text-lg font-normal leading-relaxed mt-5">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQSection;
