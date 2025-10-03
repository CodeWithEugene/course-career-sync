import { motion } from "framer-motion";
import { Upload, Brain, Award, Share2 } from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Your Coursework",
    description: "Simply upload your unit notes, syllabus, or course materials in PDF, DOCX, or TXT format.",
    color: "primary"
  },
  {
    icon: Brain,
    title: "AI-Powered Analysis",
    description: "Our AI extracts learning outcomes and maps them to industry-recognized skills and competencies.",
    color: "secondary"
  },
  {
    icon: Award,
    title: "Earn Verified Badges",
    description: "Receive skill badges that represent your learning achievements and career readiness.",
    color: "accent"
  },
  {
    icon: Share2,
    title: "Share Your Portfolio",
    description: "Create a shareable skill portfolio to showcase your capabilities to employers and universities.",
    color: "primary"
  }
];

export const Features = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            How SkillSync Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to transform your academic achievements into career opportunities
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-border"
              >
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-4`}>
                  <Icon className={`w-7 h-7 text-${feature.color}`} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};