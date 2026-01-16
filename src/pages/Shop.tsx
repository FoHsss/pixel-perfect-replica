import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { useShopifyProducts } from "@/hooks/useShopifyProducts";

const Shop = () => {
  const { products, isLoading, error } = useShopifyProducts(20);

  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Collection</p>
            <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground">Shop All</h1>
          </motion.div>

          {isLoading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>}
          {error && <div className="text-center py-20"><p className="text-muted-foreground">{error}</p></div>}
          {!isLoading && !error && products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg mb-4">No products found</p>
              <p className="text-sm text-muted-foreground">Tell me what product you'd like to create and I'll add it to your store.</p>
            </div>
          )}
          {!isLoading && !error && products.length > 0 && (
            <div className="grid gap-8 max-w-lg mx-auto">
              {products.map((product, index) => {
                const { node } = product;
                const image = node.images.edges[0]?.node;
                const price = node.priceRange.minVariantPrice;
                return (
                  <motion.div key={node.id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} transition={{ duration: 0.6, delay: index * 0.1 }}>
                    <Link to={`/product/${node.handle}`} className="block product-card bg-secondary rounded-xl overflow-hidden">
                      <div className="aspect-square bg-secondary p-8 flex items-center justify-center">
                        {image ? <img src={image.url} alt={image.altText || node.title} className="w-full h-full object-contain transition-transform duration-500 hover:scale-105" /> : <div className="w-full h-full flex items-center justify-center text-muted-foreground">No image</div>}
                      </div>
                      <div className="p-6">
                        <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">{node.options?.[0]?.values?.[0] || 'Premium'}</p>
                        <h3 className="font-display text-lg font-medium text-foreground mb-2">{node.title}</h3>
                        <p className="text-muted-foreground">{price.currencyCode} {parseFloat(price.amount).toFixed(2)}</p>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Shop;
