
import React, { useState, useEffect, ReactNode } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useCart } from './contexts';
import { useAuth } from './contexts';
import { Product } from './types';

// --- Icons ---

const SeedIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
        <path d="M12 4c-2.93 0-5.54 1.6-6.9 4.02.32-.02.65-.02.98-.02 1.89 0 3.63.55 5.04 1.51C12.44 7.6 14.28 6 16.5 6c.35 0 .69.03 1.02.08C16.48 4.71 14.39 4 12 4z"/>
    </svg>
);

const CartIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.831a1.5 1.5 0 00-1.423-2.102H5.117M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c.51 0 .962-.343 1.087-.835l1.823-6.831a1.5 1.5 0 00-1.423-2.102H5.117" />
    </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

const ChevronLeftIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

// --- Layout Components ---

export const Navbar = () => {
    const { itemCount } = useCart();
    const { isAuthenticated } = useAuth();
    const navLinkClasses = "text-gray-700 hover:text-brand-green transition-colors duration-200";
    const activeLinkClasses = "text-brand-green font-semibold";

    return (
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 shadow-sm">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <SeedIcon className="h-8 w-8 text-brand-dark-green"/>
                        <span className="text-2xl font-bold text-brand-dark-green tracking-tight">Seed Haven</span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-8">
                        <NavLink to="/" className={({ isActive }) => isActive ? `${activeLinkClasses} ${navLinkClasses}` : navLinkClasses}>Home</NavLink>
                        <NavLink to="/products" className={({ isActive }) => isActive ? `${activeLinkClasses} ${navLinkClasses}` : navLinkClasses}>Products</NavLink>
                        <NavLink to="/about" className={({ isActive }) => isActive ? `${activeLinkClasses} ${navLinkClasses}` : navLinkClasses}>About Us</NavLink>
                    </div>
                    <div className="flex items-center space-x-4">
                        <NavLink to={isAuthenticated ? "/profile" : "/auth"} className={navLinkClasses}>
                            <UserIcon className="h-6 w-6"/>
                        </NavLink>
                        <NavLink to="/cart" className={`${navLinkClasses} relative`}>
                            <CartIcon className="h-6 w-6"/>
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-brand-green text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{itemCount}</span>
                            )}
                        </NavLink>
                    </div>
                </div>
            </nav>
        </header>
    );
};

export const Footer = () => (
    <footer className="bg-brand-dark-green text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4">Seed Haven</h3>
                    <p className="text-gray-300">Sustainable seeds for a brighter future.</p>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2">
                        <li><Link to="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                        <li><Link to="/products" className="text-gray-300 hover:text-white">Products</Link></li>
                        <li><Link to="#" className="text-gray-300 hover:text-white">FAQ</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Policies</h3>
                    <ul className="space-y-2">
                        <li><Link to="#" className="text-gray-300 hover:text-white">Privacy Policy</Link></li>
                        <li><Link to="#" className="text-gray-300 hover:text-white">Terms of Service</Link></li>
                        <li><Link to="#" className="text-gray-300 hover:text-white">Shipping Policy</Link></li>
                    </ul>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4">Contact</h3>
                    <p className="text-gray-300">contact@seedhaven.dev</p>
                </div>
            </div>
            <div className="mt-8 pt-8 border-t border-green-800 text-center text-gray-400">
                &copy; {new Date().getFullYear()} Seed Haven. All Rights Reserved.
            </div>
        </div>
    </footer>
);

export const Layout = ({ children }: { children: ReactNode }) => (
    <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
    </div>
);

// --- Product Components ---

export const ProductCard = ({ product }: { product: Product }) => {
    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleQuickAdd = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        addToCart(product, 1);
    };
    
    return (
        <Link to={`/products/${product.id}`} className="group block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className="relative">
                <img src={product.image} alt={product.name} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-black/10"></div>
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{product.name}</h3>
                <p className="text-sm text-gray-500">{product.description}</p>
                <div className="flex justify-between items-center mt-4">
                    <p className="text-xl font-bold text-brand-dark-green">${product.price.toFixed(2)}</p>
                    <button onClick={handleQuickAdd} className="bg-brand-pale-green text-brand-dark-green px-3 py-1 rounded-full text-sm font-semibold hover:bg-brand-light-green transition-colors">
                        Quick Add
                    </button>
                </div>
            </div>
        </Link>
    );
};


export const ProductCarousel = ({ products, title }: { products: Product[], title: string }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const prev = () => {
        setCurrentIndex((curr) => (curr === 0 ? products.length - 1 : curr - 1));
    };

    const next = () => {
        setCurrentIndex((curr) => (curr === products.length - 1 ? 0 : curr + 1));
    };
    
    return (
        <div className="relative w-full">
            <h2 className="text-3xl font-bold text-center mb-8 text-brand-dark-green">{title}</h2>
            <div className="overflow-hidden relative">
                 <div className="flex transition-transform ease-out duration-500" style={{ transform: `translateX(-${currentIndex * 100 / 3}%)`}}>
                    {products.map((p: Product) => <div key={p.id} className="w-full md:w-1/3 flex-shrink-0 px-2"><ProductCard product={p} /></div>)}
                </div>
            </div>
             <button onClick={prev} className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md hover:bg-white">
                <ChevronLeftIcon className="h-6 w-6 text-brand-dark-green" />
            </button>
            <button onClick={next} className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white/70 rounded-full p-2 shadow-md hover:bg-white">
                <ChevronRightIcon className="h-6 w-6 text-brand-dark-green" />
            </button>
        </div>
    );
};


// --- Form Components ---

export const QuantitySelector = ({ quantity, onDecrease, onIncrease }: { quantity: number, onDecrease: () => void, onIncrease: () => void }) => (
    <div className="flex items-center border border-gray-300 rounded-md">
        <button onClick={onDecrease} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-l-md">-</button>
        <span className="px-4 py-1 font-semibold text-gray-800">{quantity}</span>
        <button onClick={onIncrease} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-r-md">+</button>
    </div>
);