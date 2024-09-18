import React, { useEffect, useState } from "react";
import { useCookies } from 'react-cookie';
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

import { addOrder, deleteOrder } from "../services/OrderServices";
import { fetchCsrfToken } from '../services/CsrfService';  
import { useUserContext } from "../contexts/UserContext";
import { useCartContext } from '../contexts/CartContext';

const ChackoutForm = ({ address }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [cookies, setCookie, removeCookie] = useCookies(['cart']);
    const [csrfToken, setCsrfToken] = useState('');

    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [allProductData, setAllProductData] = useState([]);
    const [orderId, setOrderId] = useState("");
    const { currentUser } = useUserContext();
    const { cart, setCart } = useCartContext();

    // Fetch CSRF token from service when component mounts
    useEffect(() => {
        const getCsrfToken = async () => {
            try {
                const token = await fetchCsrfToken();  // Use the CSRF service here
                setCsrfToken(token);
            } catch (error) {
                console.error("Failed to fetch CSRF token", error);
            }
        };
        getCsrfToken();
    }, []);

    useEffect(() => {
        if (!stripe) {
            return;
        }

        const clientSecret = new URLSearchParams(window.location.search).get(
            "payment_intent_client_secret"
        );

        if (!clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            switch (paymentIntent.status) {
                case "succeeded":
                    setMessage("Payment succeeded!");
                    break;
                case "processing":
                    setMessage("Your payment is processing.");
                    break;
                case "requires_payment_method":
                    setMessage("Your payment was not successful, please try again.");
                    break;
                default:
                    setMessage("Something went wrong.");
                    break;
            }
        });
    }, [stripe, cart]);

    useEffect(() => {
        setAllProductData(cart);
        const productArray = cart.map(product => product.id);
        setProducts(productArray);
    }, [cart, cookies]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setIsLoading(true);

        // Add CSRF token to the order creation request
        addOrder(products, currentUser, address, csrfToken)
            .then((result) => {
                setOrderId(result.newOrder._id);
            });

        setCart([]);
        removeCookie('cart', { path: '/' });

        const baseUrl = window.location.origin;
        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${baseUrl}/orders`,
            },
        });

        if (error) {
            setMessage(error.message);
            setCart(allProductData);
            setCookie('cart', allProductData, { path: '/' });
            deleteOrder(orderId);

        }

        setIsLoading(false);
    };

    return (
        <form id="payment-form" onSubmit={handleSubmit}>
            <PaymentElement id="payment-element" />
            <button disabled={isLoading || !stripe || !elements} id="submit">
                <span id="button-text">
                    {isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}
                </span>
            </button>
            {message && <div id="payment-message">{message}</div>}
        </form>
    );
}

export default ChackoutForm;