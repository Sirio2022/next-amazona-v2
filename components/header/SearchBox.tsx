'use client'

import { useSearchParams } from 'next/navigation'
import useSWR from 'swr'

export const SearchBox = () => {
    const searchParams = useSearchParams()
    const q = searchParams.get('q') || ''
    const category = searchParams.get('category') || 'all'

    const { data: categories, error } = useSWR('/api/products/categories', async (url) => {
        const response = await fetch(url)
        return response.json()
    })

    if (error) return error.message
    if (!categories) return 'Loading...'

    return (
        <form action='/search' method='GET'>
            <div className='join'>
                <select name="category" defaultValue={category} className='join-item select select-bordered'>
                    <option value='all'>All</option>
                    {categories.map((category: string) => (
                        <option key={category}>{category}</option>
                    ))}
                </select>

                <input type='text' name='q' defaultValue={q} placeholder='Search...' className='join-item input input-bordered' />
                <button
                    className='join-item btn'
                >
                    Search
                </button>
            </div>
        </form>
    )
}