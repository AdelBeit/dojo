"use client";

import { CodeInput } from "./CodeInput";

export default function Page() {
   return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
         <h1 className="mb-6">Code input</h1>
         <div className="flex flex-col gap-6">
            <CodeInput onComplete={(code) => console.log("complete", code)} />
            <CodeInput length={6} onComplete={(code) => console.log("complete", code)} />
         </div>
      </main>
   );
}
