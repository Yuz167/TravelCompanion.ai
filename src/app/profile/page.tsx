 "use client";
 import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
 import { useUser } from "@clerk/nextjs";
import Itinerary from '@/components/Itinerary';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFetchItinerary } from '@/lib/hooks';
import { Activity, ItineraryType, PlanActivity } from '@/lib/interfaces';
import ImageGenerator from '@/components/ImageGenerator';

gsap.registerPlugin(ScrollTrigger);
 
 const calculateDeltaXY = ({containerRect, targetRect}:{containerRect:DOMRect, targetRect:DOMRect}) =>{
  const containerX = containerRect.left + containerRect.width/2;
  const containerY = containerRect.top + containerRect.height/2;

  const targetX = targetRect.left + targetRect.width/2;
  const targetY = targetRect.top + targetRect.height/2;

  return {
    deltaX: containerX - targetX,
    deltaY: containerY - targetY
  }
 }
 const ProfilePage = () => {
  const { user } = useUser();
  const [selectedItinerary, setSelectedItinerary] = useState<number>(0);
  const {data, isFetching} = useFetchItinerary({userId:user?.id!})
  const timeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descriptionRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const divRefs = useRef<(HTMLDivElement | null)[]>([]);

  useLayoutEffect(()=>{
    if(!data) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    const timeRect = timeRefs.current[0]?.getBoundingClientRect();
    const titleRect = titleRefs.current[0]?.getBoundingClientRect();
    const descriptionRect = descriptionRefs.current[0]?.getBoundingClientRect();
    const imageRect = imageRefs.current[0]?.getBoundingClientRect();
    const timelines = useRef<gsap.core.Timeline[]>([]);

    divRefs.current.forEach((div:HTMLDivElement|null, index:number)=>{
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: div,
          scroller: scrollRef.current,           // custom scrollable parent
          start: "top top",              // trigger when top of div hits top of container
          toggleActions: "play none none none",
          scrub: true, // optional: links animation to scroll
          pin: true
        },
      });
  
      tl.from(timeRefs.current[index], {
        x: calculateDeltaXY({containerRect: containerRect!, targetRect: timeRect!}).deltaX,
        y: calculateDeltaXY({containerRect: containerRect!, targetRect: timeRect!}).deltaY,
        opacity: 0,
        duration: 5,
        ease: "power4.out"
      }).from(titleRefs.current[index], {
        x: calculateDeltaXY({containerRect: containerRect!, targetRect: titleRect!}).deltaX,
        y: calculateDeltaXY({containerRect: containerRect!, targetRect: titleRect!}).deltaY,
        opacity: 0,
        duration: 5,
        ease: "power4.out"
      }, "<").from(descriptionRefs.current[index], {
        x: calculateDeltaXY({containerRect: containerRect!, targetRect: descriptionRect!}).deltaX,
        y: calculateDeltaXY({containerRect: containerRect!, targetRect: descriptionRect!}).deltaY,
        opacity: 0,
        duration: 5,
        ease: "power4.out"
      }, "<").from(imageRefs.current[index], {
        x: calculateDeltaXY({containerRect: containerRect!, targetRect: imageRect!}).deltaX,
        y: calculateDeltaXY({containerRect: containerRect!, targetRect: imageRect!}).deltaY,
        duration: 5,
        ease: "power4.out"
      }, "<");

      timelines.current.push(tl);
    })

    return (()=>{
      timelines.current.forEach((tl)=>{
        tl.scrollTrigger?.kill();
        tl.kill();
      })
      timelines.current = [];
    })
  },[data])

  if (isFetching || !data) return <div className='w-full h-screen flex items-center justify-center'>Loading...</div>

  return (
    <div className='border border-white py-2.5'>
      <div className='container mx-auto space-y-6'>
        <div className='border border-gray-500 flex flex-col gap-5 relative px-6 py-4'>
            <div className='border-t border-l border-red-500 aspect-square w-3 absolute top-0 left-0'/>
            <div className='border-b border-l border-red-500 aspect-square w-3 absolute bottom-0 left-0'/>
            <div className='border-t border-r border-red-500 aspect-square w-3 absolute top-0 right-0'/>
            <div className='border-b border-r border-red-500 aspect-square w-3 absolute bottom-0 right-0'/>

            <div className='flex items-center gap-5'>
                <div className='h-12 w-12 relative'>
                  <img src={user?.imageUrl} alt="profile" className="w-full h-full object-contain rounded-sm"/>
                  <span className='absolute h-2 w-2 bottom-0 right-0 bg-green-500 rounded-full'></span>
                </div>
                <div className='flex flex-col flex-1 space-y-1'>
                  <div className='flex items-center justify-between'>
                    <h2 className='font-bold'>{user?.firstName}</h2>
                    <div className='border border-amber-500 flex items-center px-2'>
                      <span className='w-2 h-2 rounded-full bg-amber-500 mr-2'/>
                      <span className='text-amber-500 text-[10px]'>USER ACTIVE</span>
                    </div>
                  </div>
                  <hr className="border-amber-500 border-t-1 " />
                  <p className='opacity-50 text-xs'>{user?.emailAddresses[0].emailAddress}</p>
                </div>
            </div>
        </div>

        <div className='border border-gray-500 px-6 py-4 relative flex flex-col gap-4'>
            <div className='border-t border-l border-red-500 aspect-square w-3 absolute top-0 left-0'/>
            <div className='border-b border-l border-red-500 aspect-square w-3 absolute bottom-0 left-0'/>
            <div className='border-t border-r border-red-500 aspect-square w-3 absolute top-0 right-0'/>
            <div className='border-b border-r border-red-500 aspect-square w-3 absolute bottom-0 right-0'/>

            <h2 className='font-semibold'><span className='text-amber-500'>Your</span> Personalized Itineraries</h2>
            <div className='flex gap-3 overflow-x-scroll hide-scrollbar'>
              {data.itinerary.map((item:ItineraryType, index:number) => {
                if (index === selectedItinerary) {
                  return (
                    <Itinerary key={index} index={index} isSelected={true} isActive={true} setSelectedItinerary={setSelectedItinerary} title={item.title}/>
                  )
                }
                return (
                  <Itinerary key={index} index={index} isSelected={false} isActive={false} setSelectedItinerary={setSelectedItinerary} title={item.title}/>
                )
              })} 
            </div>
        </div>

        <div ref={containerRef} className='border border-gray-500 relative py-6'>
          <div className='h-20 bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl absolute top-0 w-full z-10' />
          <div ref={scrollRef} className='max-h-[600px] overflow-y-scroll'>
            {data.itinerary[selectedItinerary].plan.map((plan:PlanActivity, index:number) => (
              <div>
                <h1 className='text-2xl font-bold sticky top-0 pl-12 z-20'>{'Day ' + plan.day}</h1>
                {plan.activities.map((activity:Activity, index:number) =>  (
                    <div ref={(el) => {divRefs.current[index] = el}} className='md:max-w-4xl mx-auto max-w-sm space-y-20 py-5'>
                      <div ref={(el) => {imageRefs.current[index] = el}} className='w-90 h-90 rotate-10 border border-amber-500 float-right ml-5 mb-2 mt-3'>
                        <ImageGenerator location={activity.site}/>
                      </div>
                      <h1 ref={(el) => {timeRefs.current[index] = el}} className='text-2xl font-bold w-fit'>{activity.time}</h1>
                      <h2 ref={(el) => {titleRefs.current[index] = el}} className='text-4xl font-semibold w-fit'>{activity.site}</h2>
                      <p ref={(el) => {descriptionRefs.current[index] = el}} className="text-2xl w-fit">
                        {activity.description}
                      </p>
                    </div>
                  )
                )}
              </div>
            ))} 
          </div>
        </div>
      </div>
    </div>
  )
 }
 
 export default ProfilePage