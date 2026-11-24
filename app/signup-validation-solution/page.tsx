"use client";

import { useRef, useState, type FormEvent } from "react";
import { fakeApi } from "@/lib/fake-api";

type Field = "username" | "email" | "password" | "confirm";
type Values = Record<Field, string>;
type Errors = Partial<Record<Field, string>>;

const FIELDS: Field[] = ["username", "email", "password", "confirm"];
const LABELS: Record<Field, string> = {
   username: "Username",
   email: "Email",
   password: "Password",
   confirm: "Confirm password",
};
const TYPES: Record<Field, string> = { username: "text", email: "text", password: "password", confirm: "password" };

// Pure, so the rules can be tested without rendering.
function validate(v: Values): Errors {
   const errors: Errors = {};
   if (!v.username) errors.username = "Username is required";
   else if (!/^\w{3,16}$/.test(v.username)) errors.username = "Username must be 3 to 16 letters, numbers or underscores";

   if (!v.email) errors.email = "Email is required";
   else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email)) errors.email = "Enter a valid email";

   if (!v.password) errors.password = "Password is required";
   else if (v.password.length < 8 || !/\d/.test(v.password))
      errors.password = "Password must be at least 8 characters and include a number";

   if (!v.confirm) errors.confirm = "Confirm your password";
   else if (v.confirm !== v.password) errors.confirm = "Passwords do not match";
   return errors;
}

type Check = { username: string; available: boolean };

export default function Page() {
   const [values, setValues] = useState<Values>({ username: "", email: "", password: "", confirm: "" });
   const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
   const [submitted, setSubmitted] = useState(false);
   const [check, setCheck] = useState<Check | null>(null);
   const [checking, setChecking] = useState(false);
   const [done, setDone] = useState(false);
   const [submitError, setSubmitError] = useState("");
   const [submitting, setSubmitting] = useState(false);
   const refs = useRef<Partial<Record<Field, HTMLInputElement | null>>>({});

   const errors = validate(values);
   // The availability result belongs to one username, so it is ignored once the value changes.
   const takenNow = check?.username === values.username && !check.available;
   if (!errors.username && takenNow) errors.username = "Username is taken";

   const visible = (field: Field) => (touched[field] || submitted ? errors[field] : undefined);

   async function checkUsername(username: string): Promise<boolean | null> {
      setChecking(true);
      try {
         const res = (await fakeApi.post("/check-username", { username })) as { available: boolean };
         setCheck({ username, available: res.available });
         return res.available;
      } catch {
         return null;
      } finally {
         setChecking(false);
      }
   }

   function handleBlur(field: Field) {
      setTouched((t) => ({ ...t, [field]: true }));
      if (field === "username" && !validate(values).username && check?.username !== values.username) {
         void checkUsername(values.username);
      }
   }

   async function handleSubmit(e: FormEvent) {
      e.preventDefault();
      setSubmitted(true);
      const current = validate(values);
      const first = FIELDS.find((f) => current[f]);
      if (first) {
         refs.current[first]?.focus();
         return;
      }
      const available = check?.username === values.username ? check.available : await checkUsername(values.username);
      if (available === false) {
         refs.current.username?.focus();
         return;
      }
      setSubmitting(true);
      setSubmitError("");
      try {
         await fakeApi.post("/signup", values);
         setDone(true);
      } catch (err) {
         setSubmitError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
         setSubmitting(false);
      }
   }

   if (done) {
      return (
         <main className="mx-auto w-full max-w-md px-4 py-10">
            <p>Account created</p>
         </main>
      );
   }

   return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
         <h1 className="mb-6">Create account</h1>
         <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
            {FIELDS.map((field) => {
               const message = visible(field);
               const errorId = `${field}-error`;
               return (
                  <div key={field} className="flex flex-col">
                     <label htmlFor={field} className="text-sm">
                        {LABELS[field]}
                     </label>
                     <input
                        id={field}
                        ref={(el) => {
                           refs.current[field] = el;
                        }}
                        type={TYPES[field]}
                        value={values[field]}
                        aria-invalid={message ? true : undefined}
                        aria-describedby={message ? errorId : undefined}
                        onChange={(e) => setValues((v) => ({ ...v, [field]: e.target.value }))}
                        onBlur={() => handleBlur(field)}
                        className={`rounded border px-2 py-1 ${message ? "border-red-600" : ""}`}
                     />
                     {message && (
                        <p id={errorId} className="text-sm text-red-600">
                           {message}
                        </p>
                     )}
                     {field === "username" && checking && <p className="text-sm opacity-70">Checking username...</p>}
                  </div>
               );
            })}
            {submitError && (
               <p role="alert" className="text-sm text-red-600">
                  {submitError}
               </p>
            )}
            <button type="submit" disabled={submitting}>
               Create account
            </button>
         </form>
      </main>
   );
}
