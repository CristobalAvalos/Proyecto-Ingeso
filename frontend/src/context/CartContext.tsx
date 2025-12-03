import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// --- Interfaces ---

// 1. Agregamos 'price' opcional aquí para recibirlo del Catálogo
interface Game {
    id: number;
    name: string;
    cover?: {
        id: number;
        url: string;
    };
    total_rating?: number;
    price?: number; // <--- Importante para recibir el precio del catálogo
}

// Cómo se ve un item DENTRO del carrito
export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
    coverUrl?: string;
}

// Qué funciones y datos provee nuestro contexto
interface CartContextType {
    cartItems: CartItem[];
    addToCart: (game: Game) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    itemCount: number;
}

// --- Creación del Contexto ---
const CartContext = createContext<CartContextType>(null!);

export const useCart = () => {
    return useContext(CartContext);
};

// --- Provider ---
interface CartProviderProps {
    children: ReactNode;
}

const CART_STORAGE_KEY = 'cartItems';

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
    
    // 1. INICIALIZAR ESTADO
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        try {
            const localData = localStorage.getItem(CART_STORAGE_KEY);
            return localData ? JSON.parse(localData) : [];
        } catch (error) {
            console.warn("No se pudo cargar el carrito del localStorage:", error);
            return [];
        }
    });

    // 2. GUARDAR ESTADO
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
        } catch (error) {
            console.warn("No se pudo guardar el carrito en localStorage:", error);
        }
    }, [cartItems]);

    // --- Lógica del Carrito ---

    const addToCart = (game: Game) => {
        // LÓGICA DE PRECIO CORREGIDA:
        // Si el juego trae precio (del catálogo), úsalo. 
        // Si no, usa el cálculo de respaldo (rating / 5) o 29.99 por defecto.
        const finalPrice = game.price 
            ? game.price 
            : (game.total_rating ? Math.round(game.total_rating / 5) : 29.99);

        setCartItems(prevItems => {
            const existingItem = prevItems.find(item => item.id === game.id);

            if (existingItem) {
                return prevItems.map(item =>
                    item.id === game.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                const newItem: CartItem = {
                    id: game.id,
                    name: game.name,
                    price: finalPrice, // Guardamos el precio correcto
                    quantity: 1,
                    coverUrl: game.cover?.url?.replace('t_thumb', 't_cover_small') 
                };
                return [...prevItems, newItem];
            }
        });
        console.log(`🛒 ${game.name} añadido por US$${finalPrice}!`);
    };

    const removeFromCart = (id: number) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const updateQuantity = (id: number, quantity: number) => {
        const newQuantity = Math.max(1, quantity);
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantity: newQuantity } : item
            )
        );
    };

    const clearCart = () => {
        setCartItems([]); 
    };

    const itemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};