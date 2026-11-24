"use client";

import { useState, type FormEvent } from "react";
import { decode, encode, hasDigit, isValidEncoded } from "./rle";

type EncodeResult = { input: string; output: string };

export default function Page() {
   // Encode form
   const [encodeInput, setEncodeInput] = useState("");
   const [encodeResult, setEncodeResult] = useState<EncodeResult | null>(null);
   const [encodeError, setEncodeError] = useState("");
   // Decode form
   const [decodeInput, setDecodeInput] = useState("");
   const [decoded, setDecoded] = useState("");
   const [decodeError, setDecodeError] = useState("");

   function handleEncode(e: FormEvent) {
      e.preventDefault();
      if (hasDigit(encodeInput)) {
         setEncodeError("Input must not contain digits");
         setEncodeResult(null);
         return;
      }
      setEncodeError("");
      setEncodeResult({ input: encodeInput, output: encode(encodeInput) });
   }

   function handleDecode(e: FormEvent) {
      e.preventDefault();
      if (!isValidEncoded(decodeInput)) {
         setDecodeError("Invalid encoded string");
         setDecoded("");
         return;
      }
      setDecodeError("");
      setDecoded(decode(decodeInput));
   }

   function sendToDecoder() {
      if (!encodeResult) return;
      setDecodeInput(encodeResult.output);
      setDecoded("");
      setDecodeError("");
   }

   // Derived, not stored: it is a function of the last successful encode.
   const roundTripOk =
      encodeResult !== null && encodeResult.input !== "" && decode(encodeResult.output) === encodeResult.input;

   return (
      <main className="mx-auto flex w-full max-w-md flex-col gap-8 px-4 py-10">
         <h1>Encode and decode</h1>

         <form aria-label="Encode" onSubmit={handleEncode} className="flex flex-col gap-3">
            <label className="flex flex-col text-sm">
               Text to encode
               <input
                  value={encodeInput}
                  onChange={(e) => setEncodeInput(e.target.value)}
                  className="rounded border px-2 py-1"
               />
            </label>
            <button type="submit">Encode</button>
            <label className="flex flex-col text-sm">
               Encoded result
               <input readOnly value={encodeResult?.output ?? ""} className="rounded border bg-gray-50 px-2 py-1" />
            </label>
            {roundTripOk && <p className="text-sm text-green-700">Round trip OK</p>}
            {encodeResult && !encodeError && (
               <button type="button" onClick={sendToDecoder}>
                  Send to decoder
               </button>
            )}
            {encodeError && (
               <p role="alert" className="text-sm text-red-600">
                  {encodeError}
               </p>
            )}
         </form>

         <form aria-label="Decode" onSubmit={handleDecode} className="flex flex-col gap-3">
            <label className="flex flex-col text-sm">
               Text to decode
               <input
                  value={decodeInput}
                  onChange={(e) => setDecodeInput(e.target.value)}
                  className="rounded border px-2 py-1"
               />
            </label>
            <button type="submit">Decode</button>
            <label className="flex flex-col text-sm">
               Decoded result
               <input readOnly value={decoded} className="rounded border bg-gray-50 px-2 py-1" />
            </label>
            {decodeError && (
               <p role="alert" className="text-sm text-red-600">
                  {decodeError}
               </p>
            )}
         </form>
      </main>
   );
}
