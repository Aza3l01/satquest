"use client";
import { useState } from "react";

const faqData = [
  { question: "Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit",
    answer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin posuere sem at interdum consectetur. In quis fermentum nibh. Morbi nunc turpis, pretium sed neque vel, suscipit rhoncus libero. Praesent aliquet venenatis ligula non dignissim. Sed quis vehicula mauris, ac pharetra lacus. Donec id leo id dui tempus feugiat sed non massa. Etiam at scelerisque felis. Nunc vulputate, diam non convallis convallis, tellus ex porta urna, non dignissim velit massa vel justo. Vestibulum purus sem, pellentesque nec aliquam nec, congue in eros. Aenean pharetra bibendum urna quis tincidunt. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus." },
  { question: "How do I play?",
    answer: "Guess the location based on satellite images and earn points!" },
  { question: "Is it free?",
    answer: "I mean...." },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-2/3 space-y-5">
      {faqData.map((item, index) => (
        <div key={index} className="w-full">
          <button 
            className="w-full text-left font-bold text-white pb-4 border-b border-gray-300 text-lg"
            onClick={() => toggleFAQ(index)}
          >
            {item.question}
          </button>
          {openIndex === index && <p className="mt-4 text-gray-200 text-lg">{item.answer}</p>}
        </div>
      ))}
    </div>
  );
}
