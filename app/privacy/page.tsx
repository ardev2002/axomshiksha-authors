"use client";

import BreadCrumb from "@/components/custom/BreadCrumb";
import { Home, Shield, Eye, Lock, Share2, Database, UserCheck, Cookie, Users, Mail } from "lucide-react";
import { motion } from "motion/react";

export default function PrivacyPolicyPage() {
  const privacySections = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "Information We Collect",
      content: "We collect information you provide directly to us when you create an account, use our services, or communicate with us. This may include:",
      list: [
        "Name and email address",
        "Profile information (such as profile picture)",
        "Content you create, upload, or share through our services",
        "Communications between you and Axomshiksha"
      ]
    },
    {
      icon: <Lock className="w-5 h-5" />,
      title: "How We Use Information",
      content: "We use the information we collect to provide, maintain, and improve our services, including to:",
      list: [
        "Create and maintain your account",
        "Enable you to share content and connect with other users",
        "Provide customer support",
        "Send you technical notices and updates",
        "Protect the rights and safety of our users and third parties"
      ]
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      title: "Information Sharing and Disclosure",
      content: "We do not share, sell, rent, or trade your personal information with third parties for their commercial purposes. We may share information in the following circumstances:",
      list: [
        "With your consent",
        "To comply with legal obligations",
        "To protect rights, property, and safety of Axomshiksha, our users, or others",
        "With service providers who perform services on our behalf"
      ]
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Data Security",
      content: "We implement appropriate technical and organizational measures to protect the security of your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure."
    },
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: "Data Retention",
      content: "We retain your information for as long as necessary to provide our services and for legitimate business purposes, including to comply with our legal obligations, resolve disputes, and enforce our agreements."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Your Rights",
      content: "Depending on your location, you may have certain rights regarding your personal information, including:",
      list: [
        "The right to access, update, or delete your information",
        "The right to object to processing of your information",
        "The right to data portability",
        "Rights regarding automated decision-making"
      ]
    },
    {
      icon: <Cookie className="w-5 h-5" />,
      title: "Cookies and Tracking Technologies",
      content: "We use cookies and similar tracking technologies to track activity on our services and store certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent."
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Children's Privacy",
      content: "Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13. If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information."
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Contact Us",
      content: "If you have any questions about this Privacy Policy, please contact us at privacy@axomshiksha.com."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <BreadCrumb
          paths={[
            { icon: <Home size={16} />, path: "/", title: "Home" },
            { icon: <Shield size={16} />, path: "/privacy", title: "Privacy Policy" },
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
              Privacy Policy
            </motion.h1>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="prose prose-invert max-w-none"
            >
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-muted-foreground mb-6"
              >
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </motion.p>
              
              {privacySections.map((section, index) => (
                <motion.section 
                  key={section.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="mb-8"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 rounded-md bg-violet-500/10 text-violet-500 mt-1 shrink-0">
                      {section.icon}
                    </div>
                    <motion.h2 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="text-xl font-semibold text-foreground"
                    >
                      {index + 1}. {section.title}
                    </motion.h2>
                  </div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="text-foreground mb-3 pl-10"
                  >
                    {section.content}
                  </motion.p>
                  {section.list && (
                    <motion.ul 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      className="list-disc pl-16 mb-4 text-foreground"
                    >
                      {section.list.map((item, itemIndex) => (
                        <motion.li 
                          key={itemIndex}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.8 + index * 0.1 + itemIndex * 0.05 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  )}
                </motion.section>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}