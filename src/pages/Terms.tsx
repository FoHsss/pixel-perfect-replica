import { motion } from "framer-motion";
import Layout from "@/components/Layout";

const Terms = () => (
  <Layout>
    <div className="py-20 md:py-32">
      <div className="container max-w-2xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-12">
          <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-6">Terms of Service</h1>
          <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="space-y-8 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-medium text-foreground mb-3">Orders & Payments</h2>
            <p>All orders are subject to availability. Prices are listed in USD and include applicable taxes. Payment is processed securely at checkout.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-medium text-foreground mb-3">Shipping</h2>
            <p>We offer free shipping on all orders. Items are handcrafted within 2-3 business days and delivered within 5-7 business days to most destinations.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-medium text-foreground mb-3">Returns & Exchanges</h2>
            <p>We accept returns within 30 days of delivery. Items must be unworn and in original condition. Contact us to initiate a return and receive your prepaid shipping label.</p>
          </section>
          <section>
            <h2 className="font-display text-lg font-medium text-foreground mb-3">Contact</h2>
            <p>For any questions regarding these terms, please contact us at <a href="mailto:hello@eluro.co" className="text-foreground underline underline-offset-4">hello@eluro.co</a></p>
          </section>
        </motion.div>
      </div>
    </div>
  </Layout>
);

export default Terms;
