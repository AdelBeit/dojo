"use client";

import { ItemList } from "./ItemList";
import { Providers } from "./providers";
// ## 1.9
// The tab now has hundreds of items: `GET /api/items?d=slow` with no limit. Make the input box search them by name, add a paid/unpaid filter, and let the user sort by price or name. Typing must still feel instant.

function Bills() {
   // TODO: your code goes here
   return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
         <h1 className="mb-6">Restaurant bills</h1>
         <div className="flex flex-col gap-3">
            <input placeholder="search items" className="w-full" />
            {/* TODO: your code goes here */}
            <ItemList />
         </div>
      </main>
   );
}

export default function Page() {
   return (
      <Providers>
         <Bills />
      </Providers>
   );
}
