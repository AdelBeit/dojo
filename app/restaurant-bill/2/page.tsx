"use client";

import { ItemCard } from "./ItemCard";
// ## 1.2
// Same page, but the data now lives at `GET /api/items?limit=60`. Get it before you render. Show something while you wait. If the page goes away before the response arrives, the late response must not update it, and the request shouldn't be left running.
export default function Page() {
   // TODO: your code goes here
   return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
         <h1 className="mb-6">Restaurant bills</h1>
         <div className="flex flex-col gap-3">
            {/* TODO: your code goes here */}
         </div>
      </main>
   )
}
