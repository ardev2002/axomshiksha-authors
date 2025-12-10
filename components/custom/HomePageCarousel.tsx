"use client";

import { motion, AnimatePresence } from "motion/react";
import { BookOpen, FileText, PenLine, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

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

export default function HomePageCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);

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

    return (
        <>
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
                                className={`mx-3 bg-card border ${isCurrent ? "border-violet-500 shadow-xl" : "border-accent shadow-md"
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
        </>
    )
}
