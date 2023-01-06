import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "../components/Button";
import CheckoutProduct from "../components/CheckoutProduct";
import Header from "../components/Header";
import Stripe from "stripe";
import {
    selectBasketItems,
    selectBasketItemsTotalAmount,
} from "../redux/basketSlice";
import Currency from "react-currency-formatter";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/outline";
import { fetchPostJSON } from "../utils/api-helpers";
import getStripe from "../utils/get-stripe";

const Checkout = () => {
    const router = useRouter();
    const items = useSelector(selectBasketItems);
    const basketTotal = useSelector(selectBasketItemsTotalAmount);
    const [loading, setLoading] = useState(false);
    const [groupedItemsInBasket, setGroupedItemsInBasket] = useState(
        {} as { [key: string]: Product[] }
    );

    useEffect(() => {
        const groupedItems = items.reduce((results, item) => {
            (results[item._id] = results[item._id] || []).push(item);
            return results;
        }, {} as { [key: string]: Product[] });
        setGroupedItemsInBasket(groupedItems);
    }, [items]);

    //checkout function
    const createCheckOutSession = async () => {
        setLoading(true);
        const checkoutSession: Stripe.Checkout.Session = await fetchPostJSON(
            "/api/checkout_sessions",
            {
                items: items,
            }
        );
        //internal Server Error
        if ((checkoutSession as any).statusCode == 500) {
            console.error((checkoutSession as any).message);
            return;
        }
        //Redirect to Checkout
        const stripe = await getStripe();
        const { error } = await stripe!.redirectToCheckout({
            //Make the id field from the Checkout session creation API response
            //available to this file, so you can provide it as parameter here
            //instead of the {{CHECKOUT_SESSION_ID}} placeholder
            sessionId: checkoutSession.id,
        });
        //If 'redirectToCheckout fails due to a browser or network
        //error, display the localized error message to your customer
        //using `error.message`
        console.warn(error.message);
        setLoading(false);
    };

    return (
        <div className="min-h-screen overflow-hidden bg-[#E7ECEE]">
            <Head>
                <title>Bag-Apple</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className="mx-auto max-w-5xl pb-24">
                <div className="px-5 ">
                    <h1>
                        {items.length > 0
                            ? "Review your bag."
                            : "Your bag is empty."}
                    </h1>
                    <p className="my-4">Free delivery and free returns</p>
                    {items.length === 0 && (
                        <Button
                            title="Continue Shopping"
                            onClick={() => router.push("/")}
                        />
                    )}
                </div>
                {items.length > 0 && (
                    <div className="mx-5 md:mx-8">
                        {Object.entries(groupedItemsInBasket).map(
                            ([key, items]) => (
                                <CheckoutProduct
                                    key={key}
                                    items={items}
                                    id={key}
                                />
                            )
                        )}
                        <div className="my-12 mt-6 ml-auto max-w-3xl">
                            <div className="divide-y divide-gray-300">
                                <div className="pb-4">
                                    <div className="flex justify-between">
                                        <p>SubToal</p>
                                        <p>
                                            <Currency
                                                quantity={basketTotal}
                                                currency="USD"
                                            />
                                        </p>
                                    </div>
                                    <div className="flex justify-between">
                                        <p>Shipping</p>
                                        <p>FREE</p>
                                    </div>
                                    <div className="flex justify-between">
                                        <div className="flex flex-col gap-xl-1 lg:flex-row">
                                            Estimated tax for: {}
                                            <p className="flex cursor-pointer items-end text-blue-500 hover:underline">
                                                Enter Zip Code
                                                <ChevronDownIcon className="h-6 w-6" />
                                            </p>
                                        </div>
                                        <p>$</p>
                                    </div>
                                </div>
                                <div className="flex justify-between pt-4 text-xl font-semibold">
                                    <h4>Total</h4>
                                    <h4>
                                        <Currency
                                            quantity={basketTotal}
                                            currency="USD"
                                        />
                                    </h4>
                                </div>
                            </div>
                            <div className="my-14 space-y-4">
                                <h4 className="text-xl font-semibold">
                                    How would you like to checkout ?
                                </h4>
                                <div className="flex flex-col gap-4 md:flex-row">
                                    <div className="order-2 flex flex-1 items-center rounded-xl bg-gray-200 p-8 py-12 text-center ">
                                        <h4 className="mb-4 flex flex-col text-xl font-semibold">
                                            <span>Pay Monthly</span>
                                            <span>With Apple Card</span>
                                            <span>
                                                $283/mo. at 0% APR
                                                <sup className="-top-1"></sup>
                                            </span>
                                        </h4>
                                        <Button title="Check Out with Apple Card Monthy Installments" />
                                        <p className="mt-2 mx-w-[240px] text-[13px]">
                                            $0.00 due today, which includes
                                            applicable full-price items, down
                                            payment, shipping, and taxes
                                        </p>
                                    </div>
                                    <div className="flex flex-1 flex-col items-center space-y-8 rounded-xl bg-gray-200 p-8 py-12 md:order-2">
                                        <h4 className="mb-4 flex flex-col text-xl font-semibold">
                                            Pay in Full
                                            <span>
                                                <Currency
                                                    quantity={basketTotal}
                                                    currency="USD"
                                                />
                                            </span>
                                        </h4>
                                        <Button
                                            loading={loading}
                                            title="check out"
                                            width="w-full"
                                            onClick={createCheckOutSession}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Checkout;
