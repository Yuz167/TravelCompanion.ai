"use client";
import React, { useLayoutEffect, useRef, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Itinerary from "@/components/Itinerary";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useFetchItinerary } from "@/lib/hooks";
import { Activity, ItineraryType, PlanActivity } from "@/lib/interfaces";
import ImageGenerator from "@/components/ImageGenerator";

gsap.registerPlugin(ScrollTrigger);

const calculateDeltaXY = ({
  containerRect,
  targetRect,
}: {
  containerRect: DOMRect;
  targetRect: DOMRect;
}) => {
  const containerX = containerRect.left + containerRect.width / 2;
  const containerY = containerRect.top + containerRect.height / 2;

  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;

  return {
    deltaX: containerX - targetX,
    deltaY: containerY - targetY,
  };
};
const ProfilePage = () => {
  const { user } = useUser();
  const userId = user?.id;
  const [selectedItinerary, setSelectedItinerary] = useState<number>(
    typeof window !== 'undefined' && localStorage.getItem('selectedItinerary')
      ? parseInt(localStorage.getItem('selectedItinerary')!, 10)
      : 0
  );
  const { data, isFetching } = useFetchItinerary({ userId: userId ?? "" });
  const timeRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const titleRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const descriptionRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const imageRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const divRefs = useRef<(HTMLDivElement | null)[][]>([]);
  const timelines = useRef<gsap.core.Timeline[]>([]);

  const [refsReady, setRefsReady] = useState<boolean>(false);

  useLayoutEffect(() => {
    if (!data || !refsReady) return;

    const containerRect = containerRef.current?.getBoundingClientRect();
    const timeRect = timeRefs.current[0][0]?.getBoundingClientRect();
    const titleRect = titleRefs.current[0][0]?.getBoundingClientRect();
    const descriptionRect =
      descriptionRefs.current[0][0]?.getBoundingClientRect();
    const imageRect = imageRefs.current[0][0]?.getBoundingClientRect();

    divRefs.current.forEach(
      (row: (HTMLDivElement | null)[], rowIndex: number) => {
        row.forEach((div: HTMLDivElement | null, colIndex: number) => {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: div,
              scroller: scrollRef.current, // custom scrollable parent
              start: "top top+=80", // trigger when top of div hits top of container
              toggleActions: "play none none none",
              scrub: true, // optional: links animation to scroll
              pin: true,
            },
          });
          
          tl.from(timeRefs.current[rowIndex][colIndex], {
            x: calculateDeltaXY({
              containerRect: containerRect!,
              targetRect: timeRect!,
            }).deltaX,
            y: calculateDeltaXY({
              containerRect: containerRect!,
              targetRect: timeRect!,
            }).deltaY,
            opacity: 0,
            duration: 5,
            ease: "power4.out",
          })
            .from(
              titleRefs.current[rowIndex][colIndex],
              {
                x: calculateDeltaXY({
                  containerRect: containerRect!,
                  targetRect: titleRect!,
                }).deltaX,
                y: calculateDeltaXY({
                  containerRect: containerRect!,
                  targetRect: titleRect!,
                }).deltaY,
                opacity: 0,
                duration: 5,
                ease: "power4.out",
              },
              "<"
            )
            .from(
              descriptionRefs.current[rowIndex][colIndex],
              {
                x: calculateDeltaXY({
                  containerRect: containerRect!,
                  targetRect: descriptionRect!,
                }).deltaX,
                y: calculateDeltaXY({
                  containerRect: containerRect!,
                  targetRect: descriptionRect!,
                }).deltaY,
                opacity: 0,
                duration: 5,
                ease: "power4.out",
              },
              "<"
            )
            .from(
              imageRefs.current[rowIndex][colIndex],
              {
                x: calculateDeltaXY({
                  containerRect: containerRect!,
                  targetRect: imageRect!,
                }).deltaX,
                y: calculateDeltaXY({
                  containerRect: containerRect!,
                  targetRect: imageRect!,
                }).deltaY,
                duration: 5,
                ease: "power4.out",
              },
              "<"
            );

          timelines.current.push(tl);
        });
      }
    );

    return () => {
      timelines.current.forEach((tl) => {
        tl.scrollTrigger?.kill();
        tl.kill();
      });
      timelines.current = [];
    };
  }, [data, refsReady]);

  if (isFetching || !data)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen py-2.5 relative">
      <img className='absolute top-0 left-0 w-full h-full object-cover' src={'/profile-bg.jpg'} />
      <div className='absolute top-0 left-0 w-full h-full bg-white/60' />
      <div className="container mx-auto space-y-6">
        <div className="border border-gray-500 flex flex-col gap-5 relative px-6 py-4">
          <div className="border-t border-l border-red-500 aspect-square w-3 absolute top-0 left-0" />
          <div className="border-b border-l border-red-500 aspect-square w-3 absolute bottom-0 left-0" />
          <div className="border-t border-r border-red-500 aspect-square w-3 absolute top-0 right-0" />
          <div className="border-b border-r border-red-500 aspect-square w-3 absolute bottom-0 right-0" />

          <div className="flex items-center gap-5">
            <div className="h-12 w-12 relative">
              <img
                src={user?.imageUrl}
                alt="profile"
                className="w-full h-full object-contain rounded-sm"
              />
              <span className="absolute h-2 w-2 bottom-0 right-0 bg-green-500 rounded-full"></span>
            </div>
            <div className="flex flex-col flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-black">{user?.firstName}</h2>
                <div className="border border-black flex items-center px-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
                  <span className="text-black text-[10px]">
                    USER ACTIVE
                  </span>
                </div>
              </div>
              <hr className="border-black border-t-1 " />
              <p className="opacity-50 text-xs text-black">
                {user?.emailAddresses[0].emailAddress}
              </p>
            </div>
          </div>
        </div>

        <div className="border border-gray-500 px-6 py-4 relative flex flex-col gap-4">
          <div className="border-t border-l border-red-500 aspect-square w-3 absolute top-0 left-0" />
          <div className="border-b border-l border-red-500 aspect-square w-3 absolute bottom-0 left-0" />
          <div className="border-t border-r border-red-500 aspect-square w-3 absolute top-0 right-0" />
          <div className="border-b border-r border-red-500 aspect-square w-3 absolute bottom-0 right-0" />

          <h2 className="font-semibold">
            <span className="text-black">Your Personalized Itineraries</span>
          </h2>
          <div className="flex gap-3 overflow-x-scroll hide-scrollbar">
            {data.itinerary.map((item: ItineraryType, index: number) => {
              if (index === selectedItinerary) {
                return (
                  <Itinerary
                    key={index}
                    index={index}
                    isSelected={true}
                    isActive={true}
                    title={item.title}
                  />
                );
              }
              return (
                <Itinerary
                  key={index}
                  index={index}
                  isSelected={false}
                  isActive={false}
                  title={item.title}
                />
              );
            })}
          </div>
        </div>

        <div
          ref={containerRef}
          className="border border-gray-500 relative py-6"
        >
          
          <div ref={scrollRef} className="max-h-[600px] overflow-y-scroll">
            {data.itinerary[selectedItinerary].plan.map(
              (plan: PlanActivity) => (
                <div key={plan.day}>
                  <h1 className="text-2xl text-black font-bold font-serif sticky top-0 pl-12 z-20">
                    {"Day " + plan.day}
                  </h1>
                  {plan.activities.map((activity: Activity, index: number) => (
                    <div
                      key={index}
                      ref={(el) => {
                        if (!divRefs.current[plan.day - 1]) {
                          divRefs.current[plan.day - 1] = [];
                        }
                        divRefs.current[plan.day - 1][index] = el;
                      }}
                      className="md:max-w-4xl mx-auto max-w-sm space-y-20 py-5 min-h-[300px]"
                    >
                      <div
                        ref={(el) => {
                          if (!imageRefs.current[plan.day - 1]) {
                            imageRefs.current[plan.day - 1] = [];
                          }
                          imageRefs.current[plan.day - 1][index] = el;
                        }}
                        className="w-90 h-90 rotate-10 border border-amber-500  ml-5 mb-2 mt-3 float-right"
                      >
                        <ImageGenerator location={activity.site} />
                      </div>
                      <h1
                        ref={(el) => {
                          if (!timeRefs.current[plan.day - 1]) {
                            timeRefs.current[plan.day - 1] = [];
                          }
                          timeRefs.current[plan.day - 1][index] = el;
                        }}
                        className="text-2xl font-bold w-fit text-black font-mono"
                      >
                        {activity.time}
                      </h1>
                      <h2
                        ref={(el) => {
                          if (!titleRefs.current[plan.day - 1]) {
                            titleRefs.current[plan.day - 1] = [];
                          }
                          titleRefs.current[plan.day - 1][index] = el;
                        }}
                        className="text-4xl font-semibold w-fit text-black"
                      >
                        {activity.site}
                      </h2>
                      <p
                        ref={(el) => {
                          if (!descriptionRefs.current[plan.day - 1]) {
                            descriptionRefs.current[plan.day - 1] = [];
                          }
                          descriptionRefs.current[plan.day - 1][index] = el;
                          setRefsReady(true);
                        }}
                        className="text-2xl w-fit text-black"
                      >
                        {activity.description}
                      </p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
