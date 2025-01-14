'use client'

import { redirect } from 'next/navigation'
import { useParams } from 'next/navigation'

export default function Page() {
    const params = useParams()
    const dao = params.dao
    console.log(dao)
    if (!dao) {
        redirect('/gov/sbr/overview')
    }
    redirect(`/gov/${dao}/overview`)
}
