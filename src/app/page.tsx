import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { getCurrentTrack } from "@/lib/spotify"
import HomeClient from "./HomeClient"
import { getNewYearContent } from "@/lib/content"
import NewYearPopup from "@/components/newyear/Popup"

export default async function HomePage() {
  // Move data fetching to server component
  const initialTrack = await getCurrentTrack()
  
  return (
    <Suspense 
      fallback={
        <div className="my-8 flex flex-col items-center justify-center mx-auto max-w-7xl space-y-12 px-4 opacity-60">
          <Skeleton className="w-full h-[200px]" />
        </div>
      }
    >
      <HomeClient initialTrack={initialTrack} />
      {/* <NewYearPopup /> */}
    </Suspense>
  )
}