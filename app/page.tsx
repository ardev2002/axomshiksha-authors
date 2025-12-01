"use client";

import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, FileText, PenLine, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import { UserContext } from "@/components/custom/UserProvider";
import { use } from "react";
import { toast } from "sonner";

export default function HomePage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const sessionPromise = useContext(UserContext);
  const session = use(sessionPromise);

  // Auto-advance the carousel every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  const getIndices = () => {
    const prevIndex = (currentIndex - 1 + features.length) % features.length;
    const nextIndex = (currentIndex + 1) % features.length;
    return { prevIndex, currentIndex, nextIndex };
  };

  const { prevIndex, nextIndex } = getIndices();

  // Only show previous, current and next cards
  const visibleIndices = [prevIndex, currentIndex, nextIndex];

  const handleCTAClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      toast.error("Authentication Required", {
        description: "Please sign in to continue.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-background/90 to-background/70">
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-6"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-linear-to-r from-violet-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Axomshiksha
              </span>
              <span className="block mt-2 text-2xl md:text-3xl lg:text-4xl font-medium text-foreground/80">
                {Array.from("Content Management System").map((char, index, array) => {
                  const center = (array.length - 1) / 2;
                  const distanceFromCenter = Math.abs(index - center);
                  return (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.2,
                        delay: 0.3 + distanceFromCenter * 0.02,
                        ease: "easeOut",
                      }}
                      className="inline-block"
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  );
                })}
              </span>
            </h1>
          </motion.div>

          {/* Animated Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            Empowering educators with a powerful platform to create, manage, and publish
            educational content with ease.
          </motion.p>

          {/* Animated CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            className="flex justify-center gap-4"
          >
            <Button asChild size="lg" className="group">
              <Link 
                href="/dashboard" 
                className="flex items-center gap-2"
                onClick={handleCTAClick}
              >
                Get Started
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Features Section with Scroll Animations */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Powerful Features</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Everything you need to create engaging educational content
          </p>
        </motion.div>

        {/* Features display - carousel on desktop, stacked on mobile */}
        <div className="relative py-8">
          {/* Mobile view - stacked cards */}
          <div className="md:hidden space-y-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-accent rounded-xl p-6 flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Desktop view - carousel */}
          <div className="hidden md:flex justify-center items-center overflow-hidden">
            <motion.div
              layout
              className="relative w-full max-w-4xl bg-background/80 rounded-xl p-6 flex justify-center items-stretch"
            >
              <AnimatePresence initial={false} mode="popLayout">
                {visibleIndices.map((index) => {
                  const feature = features[index];
                  const isCurrent = index === currentIndex;

                  return (
                    <motion.div
                      key={feature.title}
                      layout
                      initial={{ opacity: 0, scale: 0.85, y: 20 }}
                      animate={{
                        opacity: isCurrent ? 1 : 0.7,
                        scale: isCurrent ? 1.08 : 0.95,
                        y: isCurrent ? -8 : 0,
                        filter: isCurrent ? "blur(0px)" : "blur(0.5px)",
                      }}
                      exit={{ opacity: 0, scale: 0.85, y: 20 }}
                      transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 26,
                      }}
                      whileHover={isCurrent ? { scale: 1.12 } : {}}
                      className={`mx-3 bg-card border ${
                        isCurrent ? "border-violet-500 shadow-xl" : "border-accent shadow-md"
                      } rounded-xl p-5 flex flex-col justify-between w-full max-w-sm`}
                    >
                      <div className="w-12 h-12 rounded-lg bg-violet-500/10 text-violet-500 flex items-center justify-center mb-4 self-center">
                        {feature.icon}
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold mb-2 text-center">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm text-center">
                        {feature.description}
                      </p>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Animated Stats Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="bg-linear-to-r from-violet-500/10 to-purple-500/10 rounded-2xl border border-violet-500/20 p-8 md:p-12">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="text-center mb-12"
            >
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Why Educators Love Axomshiksha
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Designed specifically for educational content creators
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="text-center"
                >
                  <div className="text-3xl md:text-4xl font-bold text-violet-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-foreground font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="container mx-auto px-4 py-16 md:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Ready to Transform Your Content Creation?
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Join thousands of educators who trust Axomshiksha to manage their educational content.
          </p>
          <Button asChild size="lg" className="group">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-2 mx-auto"
              onClick={handleCTAClick}
            >
              Start Creating
              <Sparkles className="w-4 h-4 transition-transform group-hover:rotate-12" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

const features = [
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Rich Content Editor",
    description: "Create engaging educational content with our intuitive MDX editor.",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Organized Structure",
    description: "Categorize content by class, subject, and chapter for easy navigation.",
  },
  {
    icon: <PenLine className="w-6 h-6" />,
    title: "Draft Management",
    description: "Save and manage drafts before publishing to perfection.",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Performance Analytics",
    description: "Track views, engagement, and performance of your content.",
  },
];

const stats = [
  { value: "10K+", label: "Active Educators" },
  { value: "50K+", label: "Published Articles" },
  { value: "99%", label: "Uptime Guarantee" },
];