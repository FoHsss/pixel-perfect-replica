import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const Privacy = () => (
  <Layout>
    <div className="py-20 md:py-32">
      <div className="container max-w-2xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-6">Privacy Policy</h1>
          <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-medium text-foreground mb-3">Information We Collect</h2>
            <p>We collect information you provide directly, such as your name, email address, and shipping details when making a purchase or contacting us.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-medium text-foreground mb-3">How We Use Your Information</h2>
            <p>Your information is used solely to fulfill orders, communicate about your purchases, and improve our service. We never sell your personal data to third parties.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-medium text-foreground mb-3">Data Security</h2>
            <p>We implement industry-standard security measures to protect your personal information. All transactions are encrypted and processed securely.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-medium text-foreground mb-3">Contact Us</h2>
            <p>If you have questions about this policy, please reach out at <a href="mailto:hello@eluro.co" className="text-foreground underline underline-offset-4">hello@eluro.co</a></p>
          </section>
        </motion.div>
      </div>
    </div>
  </Layout>
);

export default Privacy;
