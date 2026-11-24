"use client";

import { Tooltip } from "./Tooltip";

export default function Page() {
   return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
         <h1 className="mb-6">Tooltip</h1>
         <div className="flex gap-6 pt-10">
            <Tooltip content="Save your work">
               <button type="button">Save</button>
            </Tooltip>
            <Tooltip content="Opens the help page" placement="bottom" delayMs={300}>
               <a href="#help">Help</a>
            </Tooltip>
         </div>
      </main>
   );
}
