import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const About = () => (
  <Layout>
    <div className="py-20 md:py-32">
      <div className="container max-w-2xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Our Story</p>
          <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground">About Eluro</h1>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-8 text-muted-foreground leading-relaxed">
          <p>Eluro was born from a simple belief: the things we choose to keep should be worth keeping. In a world of endless options, we curate what matters—products made with intention, built to last.</p>
          <p>Every piece in our collection is thoughtfully chosen. We work with artisans who share our dedication to quality, selecting materials that age beautifully and designs that transcend trends.</p>
          <p>We don't believe in urgency tactics or fleeting sales. Our approach is calm, considered, and centered on trust. When you choose Eluro, you're choosing something meant to be part of your life for years to come.</p>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="pt-8 border-t border-border mt-12">
            <p className="text-center font-display text-lg text-foreground">Thoughtfully chosen.</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  </Layout>
);

export default About;
