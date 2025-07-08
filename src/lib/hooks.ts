// app/api/data/route.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { NextResponse } from 'next/server';
import { use } from 'react';

export function useFetchItinerary({userId}:{userId:string}) {
    return useQuery({
      queryKey: ['itinerary', userId],
      queryFn: async() =>{
        const res = await axios.get('/api/fetchItinerary?userId=' + userId)
        return res.data
      },
      enabled: !!userId // Only run the query when userId is truthy
    })
}