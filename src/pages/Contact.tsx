import { useState } from "react";
import { motion } from "framer-motion";
import Layout from "@/components/Layout";
import { toast } from "sonner";

const Contact = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast.success("Message sent. We'll be in touch soon.");
    setFormData({ name: "", email: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <div className="py-20 md:py-32">
        <div className="container max-w-md mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-6">Get in Touch</h1>
            <p className="text-muted-foreground leading-relaxed">Questions about an order, or simply want to say hello? We'd love to hear from you.</p>
          </motion.div>
          <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="input-calm" placeholder="Your name" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="input-calm" placeholder="your@email.com" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">Message</label>
              <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className="input-calm resize-none" placeholder="How can we help?" />
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-cta disabled:opacity-60">{isSubmitting ? "Sending..." : "Send Message"}</button>
          </motion.form>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
