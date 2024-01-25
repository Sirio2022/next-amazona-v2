import OrderDetails from "./OrderDetails";

export function generateMetadata({ params }: { params: { id: string } }) {
    return {
        title: `Order ${params.id}`,
        description: `Order ${params.id} details`,
    }
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
    


    return (
        <OrderDetails
            orderId={params.id}
            paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
        />
    )
}