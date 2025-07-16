
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { createHashRouter, RouterProvider, Outlet, useLocation, useParams, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, CartProvider, useAuth, useCart } from './contexts';
import { Layout, ProductCard, ProductCarousel, QuantitySelector } from './components';
import { products as allProducts } from './data';
import { Product, CartItem, Order, Address, PaymentMethod, User } from './types';
import { CredentialResponse } from 'google-one-tap';
import { GoogleGenAI } from '@google/genai';

declare global {
  interface Window {
    google: any;
  }
}

// --- AI Email Confirmation Modal ---
const EmailPreviewModal = ({ htmlContent, onClose, isLoading }: { htmlContent: string; onClose: () => void; isLoading: boolean; }) => (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full relative">
            <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
            <h2 className="text-2xl font-bold text-brand-dark-green mb-4">
                {isLoading ? "Generating Confirmation..." : "Confirmation Email Sent!"}
            </h2>
            {isLoading ? (
                <div className="flex justify-center items-center h-48">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-brand-green"></div>
                </div>
            ) : (
                <div className="bg-gray-100 p-4 rounded-md border max-h-[60vh] overflow-y-auto">
                    <p className="text-sm text-gray-600 mb-2">This is a preview of the email sent to your address.</p>
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>
            )}
        </div>
    </div>
);


// --- Custom Pack Builder ---
const CustomPackBuilder = ({ onClose }: { onClose: () => void }) => {
    const [whiteSeeds, setWhiteSeeds] = useState(10);
    const [blackSeeds, setBlackSeeds] = useState(10);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    const whitePrice = allProducts.find(p => p.type === 'white')?.price || 1.5;
    const blackPrice = allProducts.find(p => p.type === 'black')?.price || 1.75;
    const totalPrice = (whiteSeeds * whitePrice) + (blackSeeds * blackPrice);
    
    const customProductBase: Product = {
      id: 'custom', name: 'Custom Seed Pack', type: 'custom', price: totalPrice,
      description: `${whiteSeeds} White, ${blackSeeds} Black`,
      longDescription: `A custom-built pack containing ${whiteSeeds} white seeds and ${blackSeeds} black seeds, selected by you.`,
      image: 'https://picsum.photos/id/30/800/600',
      rating: 5, reviewCount: 0, stock: 1000, origin: 'Your Imagination', growthEnvironment: 'Mixed'
    };

    const handleAddToCart = () => {
        addToCart(
            {...customProductBase, price: totalPrice}, 
            1, 
            { white: whiteSeeds, black: blackSeeds }
        );
        onClose();
        navigate('/cart');
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-2xl w-full relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
                <h2 className="text-3xl font-bold text-brand-dark-green mb-6">Create Your Custom Pack</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    <div>
                        <div className="mb-6">
                            <label className="block text-lg font-semibold mb-2">White Seeds</label>
                            <input type="range" min="0" max="50" value={whiteSeeds} onChange={(e) => setWhiteSeeds(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-green"/>
                            <div className="text-center mt-2 text-xl font-bold">{whiteSeeds}</div>
                        </div>
                        <div>
                            <label className="block text-lg font-semibold mb-2">Black Seeds</label>
                            <input type="range" min="0" max="50" value={blackSeeds} onChange={(e) => setBlackSeeds(parseInt(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-dark-green"/>
                            <div className="text-center mt-2 text-xl font-bold">{blackSeeds}</div>
                        </div>
                    </div>
                    <div className="text-center bg-brand-pale-green p-6 rounded-lg">
                        <h3 className="text-xl font-semibold text-brand-dark-green">Your Pack</h3>
                        <div className="my-4 flex justify-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-400"></div>
                                <span className="font-bold text-lg">x {whiteSeeds}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 rounded-full bg-gray-800 border-2 border-gray-900"></div>
                                <span className="font-bold text-lg">x {blackSeeds}</span>
                            </div>
                        </div>
                        <div className="mt-6">
                            <p className="text-2xl font-extrabold text-brand-dark-green">${totalPrice.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
                <div className="mt-8 text-center">
                    <button onClick={handleAddToCart} disabled={totalPrice === 0} className="bg-brand-green text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-dark-green transition-colors duration-300 disabled:bg-gray-400">Add Custom Pack to Cart</button>
                </div>
            </div>
        </div>
    );
};

// --- Pages ---

const HomePage = () => (
    <div>
        {/* Hero Section */}
        <section className="relative h-[60vh] bg-brand-dark-green text-white flex items-center justify-center">
            <img src="https://picsum.photos/seed/123/1600/900" alt="Lush garden background" className="absolute inset-0 w-full h-full object-cover opacity-30"/>
            <div className="relative z-10 text-center p-4">
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">Grow a Better World</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-200">Sustainable, high-quality seeds for your home, school, and community garden.</p>
                <Link to="/products" className="mt-8 inline-block bg-brand-green hover:bg-white hover:text-brand-green text-white font-bold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105">
                    Shop All Seeds
                </Link>
            </div>
        </section>

        {/* Featured Products */}
        <section className="py-16 bg-brand-bg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <ProductCarousel products={allProducts.slice(0, 5)} title="Featured Products" />
            </div>
        </section>

        {/* Promotional Banners */}
        <section className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                    <h2 className="text-4xl font-bold text-brand-dark-green">Customize Your Perfect Pack</h2>
                    <p className="mt-4 text-lg text-gray-600">Don't see the mix you want? Build your own custom seed pack with any ratio of black and white seeds. Your garden, your rules.</p>
                    <Link to="/products#custom-builder" className="mt-6 inline-block bg-brand-dark-green text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-green transition-colors">
                        Start Building
                    </Link>
                </div>
                <div>
                    <img src="https://picsum.photos/id/1015/800/600" alt="Hands mixing seeds" className="rounded-lg shadow-lg" />
                </div>
            </div>
        </section>
    </div>
);

const AboutPage = () => (
    <div className="bg-white py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-extrabold text-brand-dark-green">Our Story</h1>
                <p className="mt-4 text-xl text-gray-600">Planting seeds of education and sustainability.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
                <div>
                    <h2 className="text-3xl font-bold text-brand-dark-green mb-4">Our Mission</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                        At Seed Haven, we believe that gardening is more than just a hobby—it's a powerful educational tool. Our mission is to provide the highest quality seeds while supporting educational growth in communities. A portion of every sale contributes to establishing and maintaining gardens in local schools. We empower students to learn about nature, sustainability, and the joy of seeing something grow from their own efforts.
                    </p>
                </div>
                <img src="https://picsum.photos/seed/456/800/600" alt="Children planting in a school garden" className="rounded-lg shadow-xl"/>
            </div>
             <div className="grid md:grid-cols-2 gap-12 items-center">
                <img src="https://picsum.photos/seed/789/800/600" alt="Close-up of pristine seeds" className="rounded-lg shadow-xl order-last md:order-first"/>
                 <div>
                    <h2 className="text-3xl font-bold text-brand-dark-green mb-4">Quality & Customization</h2>
                    <p className="text-lg text-gray-700 leading-relaxed">
                       We source only the finest seeds, ensuring high germination rates and robust plants. Our unique black and white seeds are selected for their beauty and resilience. We understand that every gardener is unique, which is why we pioneered the first fully customizable seed pack builder. You have the freedom to create the perfect mix for your aesthetic and gardening goals.
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const ProductsPage = () => {
    const [filteredProducts, setFilteredProducts] = useState(allProducts);
    const [filter, setFilter] = useState('all');
    const [sort, setSort] = useState('popularity');
    const [isBuilderOpen, setIsBuilderOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if(location.hash === '#custom-builder') {
            setIsBuilderOpen(true);
        }
    }, [location]);

    useEffect(() => {
        let newProducts = [...allProducts];
        // Filter
        if (filter !== 'all') {
            newProducts = newProducts.filter(p => p.type === filter || (filter === 'mixed' && p.type === 'mixed'));
        }
        // Sort
        if (sort === 'price-asc') {
            newProducts.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-desc') {
            newProducts.sort((a, b) => b.price - a.price);
        } else if (sort === 'rating') {
            newProducts.sort((a, b) => b.rating - a.rating);
        } else { // Popularity (default)
             newProducts.sort((a, b) => b.reviewCount - a.reviewCount);
        }
        setFilteredProducts(newProducts);
    }, [filter, sort]);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {isBuilderOpen && <CustomPackBuilder onClose={() => setIsBuilderOpen(false)}/>}
            <div className="text-center mb-8">
                <h1 className="text-4xl font-extrabold text-brand-dark-green">Our Collection</h1>
                <p className="mt-2 text-lg text-gray-600">Find the perfect seeds for your next project.</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-md mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <label htmlFor="filter" className="font-semibold">Filter by:</label>
                    <select id="filter" value={filter} onChange={(e) => setFilter(e.target.value)} className="border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green">
                        <option value="all">All Types</option>
                        <option value="white">White</option>
                        <option value="black">Black</option>
                        <option value="mixed">Mixed Packs</option>
                    </select>
                </div>
                <div className="flex items-center gap-4">
                    <label htmlFor="sort" className="font-semibold">Sort by:</label>
                    <select id="sort" value={sort} onChange={(e) => setSort(e.target.value)} className="border-gray-300 rounded-md shadow-sm focus:ring-brand-green focus:border-brand-green">
                        <option value="popularity">Popularity</option>
                        <option value="rating">Best Rated</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {/* Custom Pack Builder Card */}
                 <div onClick={() => setIsBuilderOpen(true)} className="group block bg-gradient-to-br from-brand-green to-brand-dark-green rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer flex flex-col items-center justify-center p-8 text-white text-center min-h-[340px]">
                    <h3 className="text-2xl font-bold">Build Your Own Pack</h3>
                    <p className="mt-2">Total creative freedom.</p>
                    <div className="mt-4 bg-white/20 text-white font-bold py-2 px-4 rounded-full group-hover:bg-white group-hover:text-brand-dark-green transition-colors">
                        Start Building
                    </div>
                </div>
                {filteredProducts.map((p: Product) => <ProductCard key={p.id} product={p} />)}
            </div>
        </div>
    );
};

const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const product = allProducts.find(p => p.id === id);
    const [quantity, setQuantity] = useState(1);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    if (!product) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl">Product not found</h1>
                <Link to="/products" className="text-brand-green hover:underline mt-4 inline-block">Back to Products</Link>
            </div>
        );
    }
    
    const relatedProducts = allProducts.filter(p => p.type === product.type && p.id !== product.id).slice(0, 4);

    const handleAddToCart = () => {
        addToCart(product, quantity);
        navigate('/cart');
    };

    return (
        <div className="bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div>
                        <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-lg object-cover aspect-square"/>
                    </div>
                    <div>
                        <h1 className="text-4xl font-extrabold text-brand-dark-green tracking-tight">{product.name}</h1>
                        <div className="mt-4 flex items-center">
                            <span className="text-3xl font-bold text-brand-green">${product.price.toFixed(2)}</span>
                            <div className="ml-4 border-l pl-4 text-gray-500">
                                <span>{product.rating} ★</span>
                                <span className="ml-2">({product.reviewCount} reviews)</span>
                            </div>
                        </div>
                        <p className="mt-6 text-lg text-gray-700 leading-relaxed">{product.longDescription}</p>
                        <div className="mt-8 flex items-center space-x-4">
                            <QuantitySelector 
                                quantity={quantity} 
                                onIncrease={() => setQuantity(q => q + 1)} 
                                onDecrease={() => setQuantity(q => Math.max(1, q - 1))} 
                            />
                            <button onClick={handleAddToCart} className="flex-1 bg-brand-green text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-dark-green transition-colors">Add to Cart</button>
                        </div>
                        <div className="mt-8 border-t pt-6">
                            <h3 className="text-lg font-semibold text-gray-800">Details</h3>
                            <ul className="mt-2 space-y-2 text-gray-600">
                                <li><strong>Origin:</strong> {product.origin}</li>
                                <li><strong>Growth Environment:</strong> {product.growthEnvironment}</li>
                                {product.type === 'mixed' && <li className="text-brand-green font-semibold">✓ Supports School Gardens</li>}
                            </ul>
                        </div>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <h2 className="text-3xl font-bold text-center mb-8 text-brand-dark-green">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {relatedProducts.map((p: Product) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, totalPrice, itemCount } = useCart();
    const navigate = useNavigate();

    const CartRow = ({ item }: { item: CartItem }) => (
         <div className="flex items-center py-4 border-b">
            <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-md"/>
            <div className="ml-4 flex-grow">
                <h3 className="font-semibold text-lg">{item.name}</h3>
                <p className="text-sm text-gray-500">{item.description}</p>
                {item.type === 'custom' && (
                    <p className="text-sm text-gray-500">
                        ({item.customComposition?.white} White, {item.customComposition?.black} Black)
                    </p>
                )}
                <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:underline text-sm mt-1">Remove</button>
            </div>
            <div className="w-32">
                <QuantitySelector quantity={item.quantity} onIncrease={() => updateQuantity(item.id, item.quantity + 1)} onDecrease={() => updateQuantity(item.id, item.quantity - 1)} />
            </div>
            <div className="w-24 text-right font-semibold text-lg">
                ${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    );

    if (itemCount === 0) {
        return (
            <div className="text-center py-20 container mx-auto">
                <h1 className="text-3xl font-bold">Your Cart is Empty</h1>
                <Link to="/products" className="mt-6 inline-block bg-brand-green text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-dark-green transition-colors">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    const shipping = 5.00;
    const tax = totalPrice * 0.08;
    const finalTotal = totalPrice + shipping + tax;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-extrabold text-brand-dark-green mb-8">Shopping Cart</h1>
            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    {cartItems.map((item: CartItem) => <CartRow key={item.id} item={item}/>)}
                </div>
                <div className="lg:col-span-1">
                    <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                        <h2 className="text-2xl font-bold border-b pb-4">Order Summary</h2>
                        <div className="py-4 space-y-2">
                            <div className="flex justify-between">
                                <span>Subtotal ({itemCount} items)</span>
                                <span>${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Shipping</span>
                                <span>${shipping.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                        </div>
                        <div className="border-t pt-4 flex justify-between font-bold text-xl">
                            <span>Total</span>
                            <span>${finalTotal.toFixed(2)}</span>
                        </div>
                        <button onClick={() => navigate('/checkout')} className="mt-6 w-full bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-brand-dark-green transition-colors">
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const CheckoutPage = () => {
    const [step, setStep] = useState(1);
    const { totalPrice, clearCart, itemCount, cartItems } = useCart();
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [emailContent, setEmailContent] = useState('');
    const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);
    
    useEffect(() => {
        if(itemCount === 0 && !isGeneratingEmail) {
            navigate('/');
        }
    }, [itemCount, navigate, isGeneratingEmail]);

    const generateEmailConfirmation = async (order: Order, user: User) => {
        // This is a placeholder for a real API key which should be in a secure environment
        const API_KEY = process.env.API_KEY;
        if (!API_KEY) {
            console.error("API_KEY is not set. Cannot generate email.");
            return `
                <h1>Order Confirmed!</h1>
                <p>Thank you for your order, ${user.name}.</p>
                <p>Order ID: ${order.id}</p>
                <p>Total: $${order.total.toFixed(2)}</p>
                <p>(Email generation is disabled as API key is missing)</p>
            `;
        }

        const ai = new GoogleGenAI({ apiKey: API_KEY });
        const itemsList = order.items.map(item => `- ${item.quantity} x ${item.name}`).join('\n');
        const prompt = `
            You are an e-commerce assistant for a store called "Seed Haven". 
            Generate a professional and friendly HTML email body for an order confirmation.
            
            User Name: ${user.name}
            Order ID: ${order.id}
            Order Date: ${order.date}
            Total Price: $${order.total.toFixed(2)}
            
            Items:
            ${itemsList}

            The email should have:
            1. A clear subject line like "Your Seed Haven Order is Confirmed!".
            2. A warm thank you message.
            3. A summary of the order details.
            4. A friendly closing message, looking forward to their gardening journey.
            
            Use inline CSS for styling. Make the main heading (h1) use the color #064e3b. Do not include <html>, <head>, or <body> tags.
            Start with an <h1> tag for the subject.
        `;
        
        try {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
            });
            return response.text;
        } catch (error) {
            console.error("Error generating email:", error);
            return `<h1>Error generating email.</h1><p>Your order ${order.id} is confirmed.</p>`;
        }
    };

    const handleOrderPlacement = async () => {
        if (!user) {
            alert("You must be logged in to place an order.");
            navigate('/auth');
            return;
        }

        setIsGeneratingEmail(true);

        const shipping = 5.00;
        const tax = totalPrice * 0.08;
        const finalTotal = totalPrice + shipping + tax;

        const newOrder: Order = {
            id: `order-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            status: 'Processing',
            items: cartItems,
            total: finalTotal,
        };

        const updatedUser: User = {
            ...user,
            orders: [newOrder, ...user.orders],
        };

        updateUser(updatedUser);
        clearCart();
        
        const generatedHtml = await generateEmailConfirmation(newOrder, user);
        setEmailContent(generatedHtml);
        setIsGeneratingEmail(false);
    };
    
    const shipping = 5.00;
    const tax = totalPrice * 0.08;
    const finalTotal = totalPrice + shipping + tax;

    if (emailContent || isGeneratingEmail) {
        return <EmailPreviewModal 
                    isLoading={isGeneratingEmail} 
                    htmlContent={emailContent} 
                    onClose={() => { setEmailContent(''); navigate('/profile'); }} 
                />
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 <h1 className="text-4xl font-extrabold text-brand-dark-green mb-8 text-center">Checkout</h1>
                 <div className="max-w-4xl mx-auto grid lg:grid-cols-5 gap-8">
                     <div className="lg:col-span-3">
                         <div className="bg-white p-8 rounded-lg shadow-md">
                            {/* Steps */}
                            <div className="mb-8">
                                <div className="flex items-center">
                                    <div className={`flex items-center ${step >= 1 ? 'text-brand-green font-bold' : 'text-gray-500'}`}>1. Shipping</div>
                                    <div className={`flex-auto border-t-2 mx-4 ${step >= 2 ? 'border-brand-green' : 'border-gray-300'}`}></div>
                                    <div className={`flex items-center ${step >= 2 ? 'text-brand-green font-bold' : 'text-gray-500'}`}>2. Payment</div>
                                    <div className={`flex-auto border-t-2 mx-4 ${step >= 3 ? 'border-brand-green' : 'border-gray-300'}`}></div>
                                    <div className={`flex items-center ${step >= 3 ? 'text-brand-green font-bold' : 'text-gray-500'}`}>3. Review</div>
                                </div>
                            </div>

                            {/* Forms */}
                            {step === 1 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Shipping Information</h2>
                                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(2); }}>
                                        <input type="text" placeholder="Full Name" required className="w-full p-2 border rounded focus:ring-brand-green focus:border-brand-green"/>
                                        <input type="text" placeholder="Address" required className="w-full p-2 border rounded focus:ring-brand-green focus:border-brand-green"/>
                                        <input type="text" placeholder="City" required className="w-full p-2 border rounded focus:ring-brand-green focus:border-brand-green"/>
                                        <input type="text" placeholder="State / Province" required className="w-full p-2 border rounded focus:ring-brand-green focus:border-brand-green"/>
                                        <input type="text" placeholder="Zip / Postal Code" required className="w-full p-2 border rounded focus:ring-brand-green focus:border-brand-green"/>
                                        <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-brand-dark-green">Continue to Payment</button>
                                    </form>
                                </div>
                            )}
                            {step === 2 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                                     <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setStep(3); }}>
                                        <input type="text" placeholder="Card Number" required className="w-full p-2 border rounded focus:ring-brand-green focus:border-brand-green"/>
                                        <input type="text" placeholder="Name on Card" required className="w-full p-2 border rounded focus:ring-brand-green focus:border-brand-green"/>
                                        <div className="flex gap-4">
                                            <input type="text" placeholder="MM / YY" required className="w-1/2 p-2 border rounded focus:ring-brand-green focus:border-brand-green"/>
                                            <input type="text" placeholder="CVC" required className="w-1/2 p-2 border rounded focus:ring-brand-green focus:border-brand-green"/>
                                        </div>
                                        <div className="flex gap-4">
                                            <button type="button" onClick={() => setStep(1)} className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300">Back to Shipping</button>
                                            <button type="submit" className="w-full bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-brand-dark-green">Review Order</button>
                                        </div>
                                    </form>
                                </div>
                            )}
                            {step === 3 && (
                                <div>
                                    <h2 className="text-2xl font-bold mb-4">Review Order</h2>
                                    <p className="mb-4">Please review your order details before placing your order.</p>
                                    <div className="flex gap-4">
                                        <button onClick={() => setStep(2)} className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300">Back to Payment</button>
                                        <button onClick={handleOrderPlacement} className="w-full bg-brand-green text-white font-bold py-3 rounded-lg hover:bg-brand-dark-green">Place Order</button>
                                    </div>
                                </div>
                            )}
                         </div>
                     </div>
                     <div className="lg:col-span-2">
                        <div className="bg-white p-6 rounded-lg shadow-md sticky top-24">
                           <h3 className="text-xl font-bold border-b pb-3">Your Order</h3>
                            <div className="py-4 space-y-2">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>${shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-500">
                                    <span>Tax</span>
                                    <span>${tax.toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="border-t pt-4 flex justify-between font-bold text-lg">
                                <span>Total</span>
                                <span>${finalTotal.toFixed(2)}</span>
                            </div>
                        </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};


const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const { login, signup, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const googleButton = useRef(null);

    useEffect(() => {
        if (!window.google || !googleButton.current) {
            return;
        }

        const handleGoogleSignIn = (response: CredentialResponse) => {
            loginWithGoogle(response);
            navigate('/profile');
        };

        const clientId = document.querySelector('meta[name="google-client-id"]')?.getAttribute('content');
        if (!clientId || clientId.startsWith('YOUR_GOOGLE_CLIENT_ID')) {
            console.error("Google Client ID is not configured in index.html");
            return;
        }

        window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleGoogleSignIn,
        });

        window.google.accounts.id.renderButton(
            googleButton.current,
            { theme: 'outline', size: 'large', width: '100%' }
        );

    }, [loginWithGoogle, navigate]);


    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const elements = e.currentTarget.elements;
        const email = (elements.namedItem('email') as HTMLInputElement).value;
        const password = (elements.namedItem('password') as HTMLInputElement).value;

        if (isLogin) {
            if (login(email, password)) {
                navigate('/profile');
            }
        } else {
            const name = (elements.namedItem('name') as HTMLInputElement).value;
            const confirmPassword = (elements.namedItem('confirm-password') as HTMLInputElement).value;

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }
            if (signup(name, email, password)) {
                navigate('/profile');
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh] bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <div>
                    <h2 className="text-3xl font-extrabold text-center text-brand-dark-green">
                        {isLogin ? 'Sign in to your account' : 'Create a new account'}
                    </h2>
                    <p className="mt-2 text-sm text-center text-gray-600">
                        Or{' '}
                        <button onClick={() => setIsLogin(!isLogin)} className="font-medium text-brand-green hover:text-brand-dark-green">
                            {isLogin ? 'create an account' : 'sign in instead'}
                        </button>
                    </p>
                </div>
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                         {!isLogin && (
                             <div>
                                <input id="name" name="name" type="text" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm" placeholder="Full Name" />
                            </div>
                        )}
                        <div>
                            <input id="email" name="email" type="email" autoComplete="email" required className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isLogin ? 'rounded-t-md' : ''} focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm`} placeholder="Email address" />
                        </div>
                        <div>
                            <input id="password" name="password" type="password" required className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 ${isLogin ? 'rounded-b-md' : ''} ${!isLogin ? '' : 'rounded-b-md'} focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm`} placeholder="Password" />
                        </div>
                        {!isLogin && (
                             <div>
                                <input id="confirm-password" name="confirm-password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-brand-green focus:border-brand-green focus:z-10 sm:text-sm" placeholder="Confirm Password" />
                            </div>
                        )}
                    </div>
                    {isLogin && (
                        <div className="flex items-center justify-end">
                            <div className="text-sm">
                                <a href="#" className="font-medium text-brand-green hover:text-brand-dark-green">Forgot your password?</a>
                            </div>
                        </div>
                    )}
                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-green hover:bg-brand-dark-green focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition-colors">
                            {isLogin ? 'Sign in' : 'Sign up'}
                        </button>
                    </div>
                </form>
                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">Or continue with</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
                 <div ref={googleButton} className="flex justify-center"></div>
            </div>
        </div>
    );
};

const ProfilePage = () => {
    const { user, logout, isAuthenticated, updateUser } = useAuth();
    const [activeTab, setActiveTab] = useState('profile');
    const [paymentType, setPaymentType] = useState<'Credit Card' | 'Checking Account'>('Credit Card');
    const navigate = useNavigate();

    useEffect(() => {
        if(!isAuthenticated) {
            navigate('/auth');
        }
    }, [isAuthenticated, navigate]);
    
    if(!user) return null;

    const TabButton = ({ id, label }: { id: string, label: string}) => (
        <button onClick={() => setActiveTab(id)} className={`w-full text-left px-4 py-2 text-sm font-medium rounded-md ${activeTab === id ? 'bg-brand-green text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
            {label}
        </button>
    );
    
    const handleAddAddress = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const newAddress: Address = {
            id: `addr-${Date.now()}`,
            street: (form.elements.namedItem('street') as HTMLInputElement).value,
            city: (form.elements.namedItem('city')as HTMLInputElement).value,
            state: (form.elements.namedItem('state') as HTMLInputElement).value,
            zip: (form.elements.namedItem('zip') as HTMLInputElement).value,
            country: 'USA'
        };
        updateUser({...user, addresses: [...user.addresses, newAddress]});
        form.reset();
    };
    
    const handleAddPayment = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        let newPayment: PaymentMethod;
        
        if(paymentType === 'Credit Card') {
            const cardNumber = (form.elements.namedItem('cardNumber') as HTMLInputElement).value;
            newPayment = {
                id: `pm-${Date.now()}`,
                type: 'Credit Card',
                last4: cardNumber.slice(-4),
                expiry: (form.elements.namedItem('expiry') as HTMLInputElement).value
            };
        } else {
             const accountNumber = (form.elements.namedItem('accountNumber') as HTMLInputElement).value;
             newPayment = {
                id: `pm-${Date.now()}`,
                type: 'Checking Account',
                accountLast4: accountNumber.slice(-4),
                routingNumber: (form.elements.namedItem('routingNumber') as HTMLInputElement).value
            };
        }
        
        updateUser({...user, paymentMethods: [...user.paymentMethods, newPayment]});
        form.reset();
    };

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                 <h1 className="text-4xl font-extrabold text-brand-dark-green">Welcome, {user.name}</h1>
                 <button onClick={() => { logout(); navigate('/'); }} className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">Logout</button>
            </div>
           
            <div className="grid md:grid-cols-4 gap-8">
                <div className="md:col-span-1">
                    <div className="bg-white p-4 rounded-lg shadow-md flex flex-col space-y-2">
                        <TabButton id="profile" label="Profile Info" />
                        <TabButton id="orders" label="Order History" />
                        <TabButton id="addresses" label="Saved Addresses" />
                        <TabButton id="payment" label="Payment Methods" />
                    </div>
                </div>
                <div className="md:col-span-3">
                    <div className="bg-white p-8 rounded-lg shadow-md min-h-[400px]">
                        {activeTab === 'profile' && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Profile Information</h2>
                                <div className="space-y-2">
                                    <p><strong>Name:</strong> {user.name}</p>
                                    <p><strong>Email:</strong> {user.email}</p>
                                </div>
                            </div>
                        )}
                        {activeTab === 'orders' && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Order History</h2>
                                <div className="space-y-4">
                                {user.orders.length === 0 ? <p>You have no past orders.</p> : user.orders.map((order: Order) => (
                                    <div key={order.id} className="border p-4 rounded-md">
                                        <div className="flex justify-between flex-wrap gap-2">
                                            <p><strong>Order ID:</strong> {order.id}</p>
                                            <p><strong>Date:</strong> {order.date}</p>
                                            <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
                                            <span className={`px-2 py-1 text-xs rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{order.status}</span>
                                        </div>
                                         <div className="mt-2 text-sm text-gray-600">
                                            Items: {order.items.map(i => `${i.quantity} x ${i.name}`).join(', ')}
                                        </div>
                                    </div>
                                ))}
                                </div>
                            </div>
                        )}
                        {activeTab === 'addresses' && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Saved Addresses</h2>
                                 <div className="space-y-4 mb-8">
                                    {user.addresses.length === 0 ? <p>No saved addresses.</p> : user.addresses.map((addr: Address) => (
                                        <div key={addr.id} className="border p-4 rounded-md">
                                            <p>{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                                        </div>
                                    ))}
                                </div>
                                <form onSubmit={handleAddAddress} className="space-y-4 border-t pt-6">
                                     <h3 className="text-xl font-bold">Add New Address</h3>
                                     <input name="street" placeholder="Street" required className="w-full p-2 border rounded"/>
                                     <input name="city" placeholder="City" required className="w-full p-2 border rounded"/>
                                     <input name="state" placeholder="State" required className="w-full p-2 border rounded"/>
                                     <input name="zip" placeholder="Zip Code" required className="w-full p-2 border rounded"/>
                                     <button type="submit" className="bg-brand-green text-white px-4 py-2 rounded-md hover:bg-brand-dark-green">Save Address</button>
                                </form>
                            </div>
                        )}
                        {activeTab === 'payment' && (
                             <div>
                                <h2 className="text-2xl font-bold mb-4">Payment Methods</h2>
                                <div className="space-y-4 mb-8">
                                    {user.paymentMethods.length === 0 ? <p>No saved payment methods.</p> : user.paymentMethods.map((pm: PaymentMethod) => (
                                        <div key={pm.id} className="border p-4 rounded-md">
                                            {pm.type === 'Credit Card' ? (
                                                <>
                                                    <p><strong>Credit Card</strong> ending in {pm.last4}</p>
                                                    <p>Expires: {pm.expiry}</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p><strong>Checking Account</strong> ending in {pm.accountLast4}</p>
                                                    <p>Routing: •••••{pm.routingNumber.slice(-4)}</p>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                                 <form onSubmit={handleAddPayment} className="space-y-4 border-t pt-6">
                                     <h3 className="text-xl font-bold">Add New Payment Method</h3>
                                      <div>
                                        <select value={paymentType} onChange={(e) => setPaymentType(e.target.value as any)} className="w-full p-2 border rounded mb-4">
                                            <option>Credit Card</option>
                                            <option>Checking Account</option>
                                        </select>
                                    </div>
                                    {paymentType === 'Credit Card' ? (
                                        <>
                                             <input name="cardNumber" placeholder="Card Number" type="text" pattern="[0-9]{13,16}" title="Enter a valid card number" required className="w-full p-2 border rounded"/>
                                             <input name="expiry" placeholder="MM/YY" type="text" pattern="(0[1-9]|1[0-2])\/?([0-9]{2})" title="Enter date as MM/YY" required className="w-full p-2 border rounded"/>
                                        </>
                                    ) : (
                                        <>
                                            <input name="routingNumber" placeholder="Routing Number" type="text" pattern="[0-9]{9}" title="Enter a 9-digit routing number" required className="w-full p-2 border rounded"/>
                                            <input name="accountNumber" placeholder="Account Number" type="text" pattern="[0-9]{8,17}" title="Enter a valid account number" required className="w-full p-2 border rounded"/>
                                        </>
                                    )}
                                     <button type="submit" className="bg-brand-green text-white px-4 py-2 rounded-md hover:bg-brand-dark-green">Save Payment Method</button>
                                 </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Router Setup ---

const AppRoutes = () => (
    <Layout>
        <Outlet />
    </Layout>
);

const router = createHashRouter([
    {
        element: <AppRoutes />,
        children: [
            { path: '/', element: <HomePage /> },
            { path: '/about', element: <AboutPage /> },
            { path: '/products', element: <ProductsPage /> },
            { path: '/products/:id', element: <ProductDetailPage /> },
            { path: '/cart', element: <CartPage /> },
            { path: '/checkout', element: <CheckoutPage /> },
            { path: '/auth', element: <AuthPage /> },
            { path: '/profile', element: <ProfilePage /> },
            { path: '*', element: <HomePage /> } // Fallback to home
        ],
    },
]);

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <RouterProvider router={router} />
      </CartProvider>
    </AuthProvider>
  );
}

export default App;