import * as motion  from "motion/react-client";
import BreadCrumb from "@/components/custom/BreadCrumb";
import { Home, Info, Target, Users, Heart, Zap } from "lucide-react";

export default function AboutPage() {
  const values = [
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Accessibility",
      description: "We believe education should be accessible to all, regardless of technical expertise or resources."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Innovation",
      description: "We continuously evolve our platform to incorporate the latest educational technologies and methodologies."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community",
      description: "We foster a collaborative environment where educators can share knowledge and learn from each other."
    },
    {
      icon: <Target className="w-6 h-6" />,
      title: "Quality",
      description: "We're committed to providing tools that help educators create the highest quality educational content."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4">
        <BreadCrumb
          paths={[
            { icon: <Home size={16} />, path: "/", title: "Home" },
            { icon: <Info size={16} />, path: "/about", title: "About" },
          ]}
        />
        
        <div className="mx-auto my-6">
          <div className="bg-card border border-accent rounded-xl p-6 md:p-8 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
              About Axomshiksha
            </h1>
            
            <div className="prose prose-invert max-w-none">
              <p className="text-muted-foreground mb-6">
                Empowering educators with modern tools for creating and managing educational content.
              </p>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  Our Mission
                </h2>
                <p className="mb-4 text-foreground">
                  At Axomshiksha, we believe that quality education should be accessible to everyone. Our mission is to provide educators with powerful, intuitive tools that make creating, managing, and publishing educational content easier than ever before.
                </p>
                <p className="text-foreground">
                  We're dedicated to bridging the gap between traditional teaching methods and modern digital tools, enabling educators to reach more students and create more engaging learning experiences.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  What We Offer
                </h2>
                <p className="mb-4 text-foreground">
                  Our platform provides educators with a comprehensive content management system specifically designed for educational purposes:
                </p>
                <ul className="list-disc pl-6 mb-4 text-foreground">
                  <li>Intuitive MDX editor for rich content creation</li>
                  <li>Organized structure by class, subject, and chapter</li>
                  <li>Draft management system for content review</li>
                  <li>Performance analytics to track content engagement</li>
                  <li>Responsive design that works on all devices</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  Our Values
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {values.map((value, index) => (
                    <motion.div
                      key={value.title}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="bg-background/50 p-4 rounded-lg border border-accent hover:border-violet-500/50 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-md bg-violet-500/10 text-violet-500">
                          {value.icon}
                        </div>
                        <h3 className="font-semibold text-foreground">{value.title}</h3>
                      </div>
                      <p className="text-foreground/80 text-sm">
                        {value.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>
              
              <section>
                <h2 className="text-xl font-semibold mb-4 text-foreground">
                  Join Our Community
                </h2>
                <p className="text-foreground">
                  Thousands of educators are already using Axomshiksha to enhance their teaching. Join our community today and discover how our platform can transform your educational content creation process.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}