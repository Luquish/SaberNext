import dynamic from 'next/dynamic'

// Importar dinámicamente para evitar problemas de hidratación
const IndexPage = dynamic(
    () => import('@/components/saber/IndexPage'),
    { 
        ssr: false,
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