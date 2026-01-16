import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";

const Index = () => {
  const { products, isLoading } = useShopifyProducts(4);

  return (
    <Layout>
      <section className="min-h-[90vh] flex flex-col justify-center px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-xs uppercase tracking-widest text-muted-foreground mb-6">
            Thoughtfully Chosen
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="font-display text-4xl md:text-6xl lg:text-7xl font-medium text-foreground mb-6 text-balance leading-tight">
            Crafted with care,<br />made to last
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg md:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Premium leather goods designed for the moments that matter. Simple, beautiful, enduring.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
            <Link to="/shop" className="inline-block btn-cta px-10 py-4 text-center">Explore Collection</Link>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-32">
        <div className="container">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
            <h2 className="font-display text-2xl md:text-3xl font-medium text-foreground">Featured</h2>
          </motion.div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>
          ) : products.length === 0 ? (
            <div className="text-center py-12"><p className="text-muted-foreground">No products yet</p></div>
          ) : (
            <div className="grid gap-8 max-w-lg mx-auto">
              {products.slice(0, 2).map((product, index) => {
                const { node } = product;
                const image = node.images.edges[0]?.node;
                const price = node.priceRange.minVariantPrice;
                return (
                  <motion.div key={node.id} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, delay: index * 0.15 }}>
                    <Link to={`/product/${node.handle}`} className="block product-card bg-secondary rounded-2xl overflow-hidden group">
                      <div className="aspect-square bg-secondary p-12 flex items-center justify-center">
                        {image ? <img src={image.url} alt={image.altText || node.title} className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>}
                      </div>
                      <div className="p-6 text-center">
                        <h3 className="font-display text-xl font-medium text-foreground mb-2">{node.title}</h3>
                        <p className="text-muted-foreground">{price.currencyCode} {parseFloat(price.amount).toFixed(2)}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-20 border-t border-border">
        <div className="container max-w-2xl mx-auto text-center">
          <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-muted-foreground leading-relaxed">
            We believe in slow fashion and timeless design. Every piece is made to accompany you for years, not seasons.
          </motion.p>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
