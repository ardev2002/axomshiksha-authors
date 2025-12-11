"use cache"
import BreadCrumb from "@/components/custom/BreadCrumb";
import { Home, Mail, Phone } from "lucide-react";
import Link from "next/link";
import * as motion from "motion/react-client";
export default async function ContactPage() {
  const contactMethods = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email Support",
      detail: "support@axomshiksha.com",
      method: "email",
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Phone",
      detail: "+919954765021",
      method: "phone",
    },
  ];

  const officeHours = [
    { day: "Monday - Friday", hours: "9:00 AM - 6:00 PM IST" },
    { day: "Saturday", hours: "10:00 AM - 2:00 PM IST" },
    { day: "Sunday", hours: "Closed" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <BreadCrumb
          paths={[
            { icon: <Home size={16} />, path: "/", title: "Home" },
            { icon: <Mail size={16} />, path: "/contact", title: "Contact" },
          ]}
        />

        <div className="mx-auto my-6">
          <div className="bg-card border border-accent rounded-xl p-6 md:p-8 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              Contact Us
            </h1>

            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground mb-8">
                We'd love to hear from you. Reach out to us through any of the
                following channels.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-foreground">
                    Get in Touch
                  </h2>
                  <p className="mb-6 text-foreground">
                    Have questions about our platform, need support, or want to
                    provide feedback? Our team is here to help.
                  </p>

                  <div className="space-y-4">
                    {contactMethods.map((method, index) => (
                      <motion.div
                        key={method.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-start"
                      >
                        <div className="p-2 rounded-md bg-violet-500/10 text-violet-500 mt-1 mr-3 shrink-0">
                          {method.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">
                            {method.title}
                          </h3>
                          <p className="text-foreground/80">
                            <a
                              href={`${
                                method.method == "email" ? "mailto" : "tel"
                              }:${method.detail}`}
                            >
                              {method.detail}
                            </a>
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-xl font-semibold mb-4 text-foreground">
                    Office Hours
                  </h2>
                  <div className="bg-background/50 p-4 rounded-lg border border-accent mb-6">
                    <p className="font-medium text-foreground mb-3">
                      Customer Support
                    </p>
                    {officeHours.map((schedule) => (
                      <div
                        key={schedule.day}
                        className="flex justify-between mb-1"
                      >
                        <span className="text-foreground/80">
                          {schedule.day}:
                        </span>
                        <span className="text-foreground/80">
                          {schedule.hours}
                        </span>
                      </div>
                    ))}
                  </div>

                  <h2 className="text-xl font-semibold mb-4 text-foreground">
                    Feedback
                  </h2>
                  <p className="mb-4 text-foreground">
                    We value your feedback and suggestions. Help us improve our
                    platform by sharing your thoughts.
                  </p>
                  <p className="text-foreground">
                    For feature requests or product feedback, please email us at
                    feedback@axomshiksha.com
                  </p>
                </div>
              </div>

              <div className="mt-12 pt-8 border-t border-accent">
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  Frequently Asked Questions
                </h2>
                <p className="mb-4 text-foreground">
                  Before reaching out, you might find answers to your questions
                  in our FAQ section.
                </p>
                <p className="text-foreground">
                  Visit our{" "}
                  <Link href="/faq" className="text-violet-400 hover:underline">
                    FAQ page
                  </Link>{" "}
                  for common questions about account setup, content creation,
                  and platform features.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
