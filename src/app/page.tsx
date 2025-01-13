import dynamic from 'next/dynamic'

// Create a client component for IndexPage
const IndexPage = dynamic(
    () => import('@/components/saber/IndexPage'),
    { 
        loading: () => (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse">Loading...</div>
            </div>
        )
    }
)

export default function Page() {
    return <IndexPage />
}