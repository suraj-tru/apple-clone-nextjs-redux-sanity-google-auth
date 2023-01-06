import { CheckIcon } from "@heroicons/react/outline";
import { Session } from "inspector";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

const success = () => {
    const router = useRouter();
    const { session_id } = router.query;
    const { data: session } = useSession();
    return (
        <div>
            <Head>
                <title>Thank you! - Apple</title>
            </Head>
            <header className="mx-auto max-w-xl">
                <Link href="/">
                    <div className="relative ml-4 h-16 w-8 cursor-pointer transition lg:hidden">
                        <Image
                            src="https://rb.gy/vsvv2o"
                            height={20}
                            width={20}
                            alt="img"
                        />
                    </div>
                </Link>
            </header>
            <main className="">
                <section className="order-2 mx-auto max-w-xl pb-12 lg:mx-0 lg:mx-w-none lg:pr-16 lg:pt-16 xl:pl-16 2xl:pl-44">
                    <Link href={"/"}>
                        <div className="relative mi-14 hidden h-24 cursor-pointer transitioin lg:inline-flex">
                            <Image
                                src="https://rb.gy/vsvv2o"
                                height={20}
                                width={20}
                                alt="img"
                            />
                        </div>
                    </Link>
                    <div className="my-8 ml-14 flex space-x-4 lg:ml-14 xl:ml-0">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-black">
                            <CheckIcon className="h-8 w-8" />
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">
                                Order #{session_id?.slice(-5)}
                            </p>
                            <h4 className="text-lg">
                                Thank you :
                                {session ? session.user?.name : "Guest"}
                            </h4>
                        </div>
                    </div>
                    <div className="mx-4 divide-y divide-gray-300 rounded-md border border-gray-300 p-4 lg:ml-14">
                        <div className="space-y-2 pb-3">
                            <p>Your order is confirmed</p>
                            <p className="text-sm text-gray-600">
                                We've accepted your order, and we are getting it
                                ready. Come back to this page for udpdats on
                                your shippment status.
                            </p>
                        </div>
                        <div className="pt-3 text-sm">
                            <p className="font-medium text-gray-600">
                                Other tracking number:
                            </p>
                            <p>CNB21441622</p>
                        </div>
                    </div>
                    <div className="mx-4 divide-y divide-gray-300 rounded-md border border-gray-300 p-4 lg:ml-14">
                        <p>Order Updates</p>
                        <p className="text-sm text-gray-600">
                            you'll get shipping and delivery updates by email
                            and text.
                        </p>
                    </div>
                    <div>
                        <p className="hidden lg:inline">
                            Need help? Contact Us
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default success;
