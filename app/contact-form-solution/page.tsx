"use client";

import { useRef, useState, type FormEvent } from "react";
import { fakeApi } from "@/lib/fake-api";

type Values = { name: string; email: string; message: string };
type Errors = Partial<Record<keyof Values, string>>;
type Status = "idle" | "sending" | "success" | "error";

const MAX_MESSAGE = 500;
const EMPTY: Values = { name: "", email: "", message: "" };

function validate(v: Values): Errors {
   const errors: Errors = {};
   if (!v.name.trim()) errors.name = "Name is required";
   if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = "Enter a valid email";
   if (v.message.trim().length < 10) errors.message = "Message must be at least 10 characters";
   return errors;
}

export default function Page() {
   const [values, setValues] = useState<Values>(EMPTY);
   const [errors, setErrors] = useState<Errors>({});
   const [status, setStatus] = useState<Status>("idle");
   const [error, setError] = useState("");
   // A ref blocks a second submit in the same tick, before the disabled button has re-rendered.
   const inFlight = useRef(false);

   function setField(field: keyof Values, value: string) {
      setValues((v) => ({ ...v, [field]: value }));
      setErrors((e) => ({ ...e, [field]: undefined }));
   }

   async function handleSubmit(e: FormEvent) {
      e.preventDefault();
      if (inFlight.current) return;
      const found = validate(values);
      setErrors(found);
      if (Object.keys(found).length > 0) return;

      inFlight.current = true;
      setStatus("sending");
      setError("");
      try {
         await fakeApi.post("/contact", values);
         setValues(EMPTY);
         setStatus("success");
      } catch (err) {
         setError(err instanceof Error ? err.message : "Something went wrong");
         setStatus("error");
      } finally {
         inFlight.current = false;
      }
   }

   const sending = status === "sending";

   return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
         <h1 className="mb-6">Contact us</h1>

         {status === "success" && (
            <p role="status" className="mb-4 text-green-700">
               Thanks, we got your message
            </p>
         )}
         {status === "error" && (
            <p role="alert" className="mb-4 text-red-600">
               {error}
            </p>
         )}

         <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col">
               <label htmlFor="name" className="text-sm">
                  Name
               </label>
               <input
                  id="name"
                  value={values.name}
                  onChange={(e) => setField("name", e.target.value)}
                  className="rounded border px-2 py-1"
               />
               {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
            </div>

            <div className="flex flex-col">
               <label htmlFor="email" className="text-sm">
                  Email
               </label>
               <input
                  id="email"
                  value={values.email}
                  onChange={(e) => setField("email", e.target.value)}
                  className="rounded border px-2 py-1"
               />
               {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
            </div>

            <div className="flex flex-col">
               <label htmlFor="message" className="text-sm">
                  Message
               </label>
               <textarea
                  id="message"
                  rows={5}
                  maxLength={MAX_MESSAGE}
                  value={values.message}
                  onChange={(e) => setField("message", e.target.value)}
                  className="rounded border px-2 py-1"
               />
               <div className="flex justify-between text-sm">
                  <span className="text-red-600">{errors.message}</span>
                  <span className="opacity-70">
                     {values.message.length}/{MAX_MESSAGE}
                  </span>
               </div>
            </div>

            <button type="submit" disabled={sending}>
               {sending ? "Sending..." : "Send"}
            </button>
         </form>
      </main>
   );
}
