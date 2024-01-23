'use client';
import CheckoutSteps from "@/components/CheckoutSteps";
import useCartService from "@/lib/hooks/useCartStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


function Form() {

    const router = useRouter();
    const { savePaymentMethod, shippingAddress, paymentMethod } = useCartService();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        savePaymentMethod(selectedPaymentMethod);
        router.push('/place-order');
    }

    useEffect(() => {
        if (!shippingAddress?.address) {
            return router.push('/shipping');
        }
        setSelectedPaymentMethod(paymentMethod || 'PayPal');

    }, [shippingAddress?.address, paymentMethod, router]);





    return (
        <div>
            <CheckoutSteps current={2} />

            <div className="max-w-sm mx-auto card bg-base-300 my-4">
                <div className="card-body">
                    <h1 className="card-title">
                        Payment Method

                    </h1>

                    <form onSubmit={handleSubmit}>
                        {['PayPal', 'Stripe', 'CashOnDelivery'].map((payment) => (
                            <div key={payment} >
                                <label htmlFor="paymentMethod" className="label cursor-pointer">
                                    <span className="label-text">
                                        {payment}
                                    </span>

                                    <input
                                        type="radio"
                                        className="radio radio-primary radio-lg"
                                        id="paymentMethod"
                                        value={payment}
                                        checked={selectedPaymentMethod === payment}
                                        onChange={(e) => setSelectedPaymentMethod(payment)}
                                    />
                                </label>

                            </div>
                        ))}
                        <div className="my-2">
                            <button
                                type="submit"
                                className="btn btn-primary w-full"
                            >
                                Next
                            </button>
                        </div>

                        <div className="my-2">
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="btn w-full my-2"
                            >
                                Back
                            </button>

                        </div>
                    </form>

                </div>

            </div>
        </div>
    )
}

export default Form