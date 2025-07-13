// app/api/data/route.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


// export function useFetchItinerary({userId}:{userId:string}) {
//     return useQuery({
//       queryKey: ['itinerary', userId],
//       queryFn: async() =>{
//         const res = await axios.get('api/fetchItinerary?userId=' + userId)
//         return res.data
//       },
//       enabled: !!userId // Only run the query when userId is truthy
//     })
// }

export function useFetchItinerary({ userId }: { userId: string }) {
    return useQuery({
      queryKey: ['itinerary', userId],
      queryFn: async () => {
        try {
          const res = await axios.get('api/fetchItinerary?userId=' + userId);
          return res.data;
        } catch (error: any) {
          console.error('Error fetching itinerary:', error.message);
          throw error; // re-throw so React Query knows it failed
        }
      },
      enabled: !!userId, // Only run the query when userId is truthy
    });
  }