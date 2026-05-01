const products = [
    {
        id: "1",
        name: "Sculptural Lounge",
        category: "Furniture",
        price: 1240.00,
        img: "https://images.unsplash.com/photo-1567016546367-c27a0d56712e?auto=format&fit=crop&q=80&w=800",
        desc: "A masterful fusion of form and comfort. This lounge features organically curved contours wrapped in premium tailored fabric. Designed to be a striking centerpiece in any modern living space."
    },
    {
        id: "2",
        name: "Task Luminaire",
        category: "Lighting",
        price: 420.00,
        img: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800",
        desc: "Precision engineering meets architectural elegance. This directed lighting solution offers adaptable pivoting and multi-level brightness control for intense focus."
    },
    {
        id: "3",
        name: "Terra Vessel Set",
        category: "Decor",
        price: 185.00,
        img: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&q=80&w=800",
        desc: "Hand-thrown pottery finished with a brutalist matte glaze. Perfect for housing sculptural botanicals or standing elegantly on their own."
    },
    {
        id: "4",
        name: "Velvet Modular",
        category: "Furniture",
        price: 3850.00,
        img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
        desc: "Total modularity uncompromised by deep comfort. Upholstered in performance velvet with high-density foam for a resilient, sinking softness."
    },
    {
        id: "5",
        name: "Concrete Side Table",
        category: "Decor",
        price: 210.00,
        img: "https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&q=80&w=800",
        desc: "Molded from architectural-grade lightweight concrete. This table juxtaposes a heavy, industrial appearance with delicate geometric fluting."
    },
    {
        id: "6",
        name: "Linen Occasional Chair",
        category: "Furniture",
        price: 850.00,
        img: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&q=80&w=800",
        desc: "A relaxed, low-profile silhouette draped in breathable Belgian linen. Its solid ash wood frame offers structural warmth and lasting durability."
    },
    {
        id: "7",
        name: "Bauhaus Print Collection",
        category: "Art",
        price: 150.00,
        img: "https://images.unsplash.com/photo-1544457070-4cd773b4d71e?auto=format&fit=crop&q=80&w=800",
        desc: "A triptych of geometrically profound prints inspired by mid-century brutalism. Printed on archival 300gsm cotton rag."
    },
    {
        id: "8",
        name: "Brass Pendant Light",
        category: "Lighting",
        price: 320.00,
        img: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
        desc: "Spun from raw brass, this pendant casts a warm, focused ambient glow. Its surface will gracefully patina over time, telling the story of your home."
    }
];

function formatPrice(price) {
    return '$' + parseFloat(price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}
