"use client";

import BreadCrumb from "@/components/custom/BreadCrumb";
import { Home, HelpCircle, User, FileText, Settings, Shield, Mail, Clock } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      category: "Content Creation",
      icon: <FileText className="w-5 h-5" />,
      questions: [
        {
          question: "What file formats can I upload?",
          answer: "You can upload images in JPG, PNG, and GIF formats. For documents, we support PDF, DOC, and DOCX files. Video files can be uploaded in MP4, MOV, and AVI formats. All files must be under 50MB in size."
        },
        {
          question: "How do I organize my content?",
          answer: "Our platform allows you to organize content by class, subject, and chapter. When creating a new post, you'll be prompted to select or create these categories. You can also use tags to further organize your content for easier searching."
        },
        {
          question: "Can I schedule posts to publish later?",
          answer: "Yes, you can schedule posts to publish at a later date and time. When creating or editing a post, look for the 'Schedule' option in the publishing settings. Select your desired date and time, and the post will automatically publish at that time."
        }
      ]
    },
    {
      category: "Platform Features",
      icon: <Settings className="w-5 h-5" />,
      questions: [
        {
          question: "How do I track my content's performance?",
          answer: "Our analytics dashboard provides detailed insights into your content's performance. You can view metrics such as views, engagement, and audience demographics. Access this information by navigating to the 'Analytics' section in your dashboard."
        },
        {
          question: "Can I collaborate with other educators?",
          answer: "Yes, you can invite other educators to collaborate on your content. In the post editor, click on the 'Share' button and enter their email addresses. You can set their permission levels as viewers, editors, or administrators."
        },
        {
          question: "Is there a mobile app available?",
          answer: "While we don't have a dedicated mobile app yet, our platform is fully responsive and works seamlessly on mobile devices. You can access all features through your mobile browser with the same experience as on desktop."
        }
      ]
    },
    {
      category: "Privacy & Security",
      icon: <Shield className="w-5 h-5" />,
      questions: [
        {
          question: "How is my data protected?",
          answer: "We take data security seriously. All data is encrypted both in transit and at rest using industry-standard encryption protocols. We regularly audit our systems for vulnerabilities and follow best practices for data protection."
        },
        {
          question: "Who can see my content?",
          answer: "By default, your content is private and only visible to you. You can choose to make individual posts public when publishing them. You can also share specific posts with selected users or groups."
        },
        {
          question: "Do you share my information with third parties?",
          answer: "We do not sell, rent, or share your personal information with third parties for their marketing purposes. We may share anonymized, aggregated data for research purposes, but never personally identifiable information."
        }
      ]
    },
    {
      category: "Support & Contact",
      icon: <Mail className="w-5 h-5" />,
      questions: [
        {
          question: "How do I contact support?",
          answer: "You can reach our support team by emailing support@axomshiksha.com or by using the contact form on our Contact page. Our support hours are Monday through Friday, 9 AM to 6 PM IST."
        },
        {
          question: "How long does it take to get a response?",
          answer: "We aim to respond to all support inquiries within 24 hours during business days. For urgent issues, please indicate the urgency in your message, and we'll prioritize your request accordingly."
        },
        {
          question: "Do you offer training or tutorials?",
          answer: "Yes, we provide comprehensive tutorials and guides in our Help Center. We also offer live webinars and workshops periodically. Check our Events page for upcoming training sessions."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <BreadCrumb
          paths={[
            { icon: <Home size={16} />, path: "/", title: "Home" },
            { icon: <HelpCircle size={16} />, path: "/faq", title: "FAQ" },
          ]}
        />
        
        <div className="mx-auto my-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-accent rounded-xl p-6 md:p-8 shadow-sm"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl md:text-4xl font-bold mb-6 text-foreground"
            >
              Frequently Asked Questions
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground mb-8"
            >
              Find answers to common questions about using our platform. If you can't find what you're looking for, 
              please <a href="/contact" className="text-violet-400 hover:underline">contact our support team</a>.
            </motion.p>

            <div className="space-y-6">
              {faqData.map((category, categoryIndex) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 + categoryIndex * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-md bg-violet-500/10 text-violet-500">
                      {category.icon}
                    </div>
                    <h2 className="text-xl font-semibold text-foreground">
                      {category.category}
                    </h2>
                  </div>
                  
                  <div className="space-y-4 pl-2">
                    {category.questions.map((faq, index) => {
                      const globalIndex = categoryIndex * 10 + index;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: 0.4 + categoryIndex * 0.1 + index * 0.05 }}
                          className="border border-accent rounded-lg overflow-hidden"
                        >
                          <button
                            className="flex justify-between items-center w-full p-4 text-left bg-background/50 hover:bg-background/80 transition-colors"
                            onClick={() => toggleAccordion(globalIndex)}
                          >
                            <span className="font-medium text-foreground">{faq.question}</span>
                            <svg
                              className={`w-5 h-5 text-muted-foreground transition-transform duration-300 ${
                                openIndex === globalIndex ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>
                          
                          <motion.div
                            initial={false}
                            animate={{
                              height: openIndex === globalIndex ? 'auto' : 0,
                              opacity: openIndex === globalIndex ? 1 : 0,
                            }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="p-4 bg-background/30 border-t border-accent">
                              <p className="text-foreground/90">{faq.answer}</p>
                            </div>
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.0 }}
              className="mt-12 pt-8 border-t border-accent"
            >
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-violet-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Still have questions?</h3>
                  <p className="text-foreground/80 mb-3">
                    If you can't find the answer you're looking for, please get in touch with our support team.
                  </p>
                  <p className="text-foreground/80">
                    Our support hours are <span className="font-medium">Monday to Friday, 9 AM to 6 PM IST</span>.
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}