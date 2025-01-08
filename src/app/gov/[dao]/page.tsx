import { redirect } from 'next/navigation'

export default function Page({ params }: { params: { dao: string } }) {
    if (!params.dao) {
        redirect('/gov/sbr/overview')
    }
    redirect(`/gov/${params.dao}/overview`)
}