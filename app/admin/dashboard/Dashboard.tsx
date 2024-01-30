'use client';

import Link from "next/link";
import { Bar, Doughnut, Line } from "react-chartjs-2";
import useSWR from "swr";
import { formatoMoneda } from "@/lib/utils";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    BarElement,
    ArcElement
} from 'chart.js';
import exp from "constants";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend,
    BarElement,
    ArcElement
);

export const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        title: {
            display: true,
            text: 'Chart.js Bar Chart'
        }
    }
};

const Dashboard = () => {
    const { data: summary, error } = useSWR('/api/orders/summary', async (url) => {
        const res = await fetch(url);
        return res.json();
    });

    if (error) return error.message;
    if (!summary) return 'Loading...';

    const salesData = {
        labels: summary.salesData.map((d: { _id: string }) => d._id),
        datasets: [
            {
                label: 'Sales',
                data: summary.salesData.map((d: { totalSales: number }) => d.totalSales),
                fill: true,
                backgroundColor: 'rgb(53, 162, 235)',
                borderColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],
    };

    const ordersData = {
        labels: summary.salesData.map((d: { _id: string }) => d._id),
        datasets: [
            {
                label: 'Orders',
                data: summary.salesData.map((d: { totalOrders: number }) => d.totalOrders),
                fill: true,
                backgroundColor: 'rgb(53, 162, 235)',
                borderColor: 'rgba(53, 162, 235, 0.5)',
            },
        ],

    };

    const usersData = {
        labels: summary.usersData.map((d: { _id: string }) => d._id),
        datasets: [
            {
                label: 'Users',
                data: summary.usersData.map((d: { totalUsers: number }) => d.totalUsers),
                fill: true,
                backgroundColor: 'rgb(53, 162, 235)',
                borderColor: 'rgb(53, 162, 235, 0.5)',
            },
        ],
    };

    const productsData = {
        labels: summary.productsData.map((d: { _id: string }) => d._id),
        datasets: [
            {
                label: 'Category',
                data: summary.productsData.map((d: { totalProducts: number }) => d.totalProducts),
                fill: true,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235,0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235,0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                ]
            },
        ],
    };

    return (
        <div>
            <div className="my-4 stats inline-grid md:flex shadow stats-vertical md:stats-horizontal">
                <div className="stat">
                    <div className="stat-title">
                        Sales
                    </div>
                    <div className="stat-value text-primary">
                        {formatoMoneda(summary.ordersPrice)}
                    </div>

                    <div className="stat-desc">

                        <Link
                            href='/admin/orders'

                        >
                            View sales
                        </Link>
                    </div>

                </div>

                <div className="stat">
                    <div className="stat-title">
                        Orders
                    </div>
                    <div className="stat-value text-primary">
                        {summary.ordersCount}
                    </div>

                    <div className="stat-desc">

                        <Link
                            href='/admin/orders'

                        >
                            View orders
                        </Link>
                    </div>
                </div>

                <div className="stat">
                    <div className="stat-title">
                        Products
                    </div>
                    <div className="stat-value text-primary">
                        {summary.productsCount}
                    </div>

                    <div className="stat-desc">

                        <Link
                            href='/admin/products'

                        >
                            View products
                        </Link>
                    </div>
                </div>

                <div className="stat">
                    <div className="stat-title">
                        Users
                    </div>
                    <div className="stat-value text-primary">
                        {summary.usersCount}
                    </div>

                    <div className="stat-desc">

                        <Link
                            href='/admin/users'

                        >
                            View users
                        </Link>
                    </div>
                </div>

            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <h2 className="text-xl py-2">
                        Sales Report
                    </h2>
                    <Line data={salesData} />
                </div>
                <div>
                    <h2 className="text-xl py-2">
                        Orders Report
                    </h2>
                    <Bar data={ordersData} />
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                <div>
                    <h2 className="text-xl py-2">
                        Products Report
                    </h2>
                    <div className="flex items-center justify-center h-80 w-96"> {' '}

                        <Doughnut data={productsData} />
                    </div>
                </div>

                <div>
                    <h2 className="text-xl py-2">
                        Users Report
                    </h2>
                    <div className="text-xl py-2">

                        <Bar data={usersData} />
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Dashboard;