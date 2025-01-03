import { useQuery } from '@tanstack/react-query';
import { fetchNullableWithSessionCache } from '@/utils/saber/fetch';

export default function useFeaturedPools() {
    return useQuery({
        queryKey: ['featuredPools'],
        staleTime: 1000 * 60,
        queryFn: async () => {
            const swaps = await fetchNullableWithSessionCache<
                readonly string[]
            >(
                'https://raw.githubusercontent.com/saberdao/info/main/featuredPools.json',
            );

            if (!swaps) {
                throw Error('Could not find file');
            }

            return swaps;
        },
    });
}