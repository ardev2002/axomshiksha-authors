"use client";

import BreadCrumb from "@/components/custom/BreadCrumb";
import { Home, FileText, ShieldCheck, User, FileEdit, Ban, AlertTriangle, Edit3 } from "lucide-react";
import { motion } from "motion/react";

export default function TermsConditionsPage() {
  const terms = [
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Acceptance of Terms",
      content: "By accessing or using the Axomshiksha platform (\"Service\"), you agree to be bound by these Terms & Conditions (\"Terms\"). If you disagree with any part of these terms, you may not access the Service."
    },
    {
      icon: <FileEdit className="w-5 h-5" />,
      title: "Description of Service",
      content: "Axomshiksha is a content management system designed for educational purposes. Our Service allows educators to create, manage, and publish educational content."
    },
    {
      icon: <User className="w-5 h-5" />,
      title: "User Accounts",
      content: "When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password."
    },
    {
      icon: <ShieldCheck className="w-5 h-5" />,
      title: "Intellectual Property",
      content: "The Service and its original content, features, and functionality are and will remain the exclusive property of Axomshiksha and its licensors. The Service is protected by copyright, trademark, and other laws of both the India and foreign countries."
    },
    {
      icon: <FileEdit className="w-5 h-5" />,
      title: "Content Ownership",
      content: "You retain ownership of any intellectual property rights that you hold in content you submit to the Service. By submitting, posting, or displaying Content on or through the Service, you grant Axomshiksha a worldwide, non-exclusive, royalty-free license to use, copy, reproduce, process, adapt, modify, publish, transmit, display and distribute such Content."
    },
    {
      icon: <Ban className="w-5 h-5" />,
      title: "Termination",
      content: "We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms."
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Limitation of Liability",
      content: "In no event shall Axomshiksha, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service."
    },
    {
      icon: <Edit3 className="w-5 h-5" />,
      title: "Changes to Terms",
      content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion."
    },
    {
      icon: <User className="w-5 h-5" />,
      title: "Contact Us",
      content: "If you have any questions about these Terms, please contact us at support@axomshiksha.com."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <BreadCrumb
          paths={[
            { icon: <Home size={16} />, path: "/", title: "Home" },
            { icon: <FileText size={16} />, path: "/terms-conditions", title: "Terms & Conditions" },
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
              Terms & Conditions
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
              
              {terms.map((term, index) => (
                <motion.section 
                  key={term.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                  className="mb-8"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-2 rounded-md bg-violet-500/10 text-violet-500 mt-1 shrink-0">
                      {term.icon}
                    </div>
                    <motion.h2 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                      className="text-xl font-semibold text-foreground"
                    >
                      {index + 1}. {term.title}
                    </motion.h2>
                  </div>
                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                    className="text-foreground pl-10"
                  >
                    {term.content}
                  </motion.p>
                </motion.section>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}