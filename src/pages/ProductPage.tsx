import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import { useShopifyProduct } from "@/hooks/useShopifyProducts";
import { useCartStore } from "@/stores/cartStore";
import { useState } from "react";
import { toast } from "sonner";

const ProductPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { product, isLoading, error } = useShopifyProduct(slug);
  const { addItem, isLoading: isAddingToCart } = useCartStore();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  if (isLoading) {
    return <Layout><div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div></Layout>;
  }

  if (error || !product) {
    return <Layout><div className="flex items-center justify-center min-h-[60vh]"><p className="text-muted-foreground">Product not found</p></div></Layout>;
  }

  const selectedVariant = product.variants.edges[selectedVariantIndex]?.node;
  const mainImage = product.images.edges[0]?.node;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;
    await addItem({
      variantId: selectedVariant.id,
      quantity: 1,
      product: { node: product },
      selectedOptions: selectedVariant.selectedOptions,
      price: selectedVariant.price,
    });
    toast.success("Added to cart!");
  };

  return (
    <Layout>
      <div className="py-12 md:py-20">
        <div className="container max-w-4xl">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="aspect-square bg-secondary rounded-2xl p-8 flex items-center justify-center">
              {mainImage ? <img src={mainImage.url} alt={mainImage.altText || product.title} className="w-full h-full object-contain" /> : <div className="text-muted-foreground">No image</div>}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="flex flex-col">
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">Eluro</p>
              <h1 className="font-display text-3xl md:text-4xl font-medium text-foreground mb-4">{product.title}</h1>
              <p className="text-2xl text-foreground mb-6">
                {selectedVariant?.price.currencyCode} {parseFloat(selectedVariant?.price.amount || "0").toFixed(2)}
              </p>

              {product.variants.edges.length > 1 && (
                <div className="mb-6">
                  <p className="text-sm font-medium mb-3">Select variant</p>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.edges.map((variant, index) => (
                      <button key={variant.node.id} onClick={() => setSelectedVariantIndex(index)} className={`px-4 py-2 rounded-lg border transition-colors ${selectedVariantIndex === index ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}>
                        {variant.node.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={handleAddToCart} disabled={isAddingToCart || !selectedVariant?.availableForSale} className="btn-cta mb-6">
                {isAddingToCart ? "Adding..." : selectedVariant?.availableForSale ? "Add to Cart" : "Sold Out"}
              </button>

              <div className="prose prose-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: product.descriptionHtml || product.description }} />
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductPage;
