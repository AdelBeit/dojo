"use client";

import { useReducer } from "react";
import { fakeApi } from "@/lib/fake-api";

type Values = { name: string; email: string; street: string; city: string; postalCode: string };
type Field = keyof Values;
type Status = "idle" | "submitting" | "success" | "error";

type State = {
   step: 0 | 1 | 2;
   values: Values;
   touched: Partial<Record<Field, boolean>>;
   status: Status;
   error: string;
};

type Action =
   | { type: "change"; field: Field; value: string }
   | { type: "blur"; field: Field }
   | { type: "next" }
   | { type: "back" }
   | { type: "submitting" }
   | { type: "success" }
   | { type: "failure"; error: string };

const initialState: State = {
   step: 0,
   values: { name: "", email: "", street: "", city: "", postalCode: "" },
   touched: {},
   status: "idle",
   error: "",
};

const STEP_TITLES = ["Basic info", "Address", "Confirm"];
const STEP_FIELDS: Field[][] = [
   ["name", "email"],
   ["street", "city", "postalCode"],
];
const LABELS: Record<Field, string> = {
   name: "Full name",
   email: "Email",
   street: "Street",
   city: "City",
   postalCode: "Postal code",
};

// Pure and framework free, so it can be tested without rendering.
function validate(field: Field, value: string): string | null {
   switch (field) {
      case "name":
         return value.trim() ? null : "Name is required";
      case "email":
         return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : "Enter a valid email";
      case "street":
         return value.trim() ? null : "Street is required";
      case "city":
         return value.trim() ? null : "City is required";
      case "postalCode":
         return /^\d{5}$/.test(value) ? null : "Postal code must be 5 digits";
   }
}

function reducer(state: State, action: Action): State {
   switch (action.type) {
      case "change":
         return { ...state, values: { ...state.values, [action.field]: action.value } };
      case "blur":
         return { ...state, touched: { ...state.touched, [action.field]: true } };
      case "next":
         return { ...state, step: Math.min(state.step + 1, 2) as State["step"] };
      case "back":
         return { ...state, step: Math.max(state.step - 1, 0) as State["step"], status: "idle", error: "" };
      case "submitting":
         return { ...state, status: "submitting", error: "" };
      case "success":
         return { ...state, status: "success" };
      case "failure":
         return { ...state, status: "error", error: action.error };
   }
}

export default function Page() {
   const [state, dispatch] = useReducer(reducer, initialState);
   const { step, values, touched, status, error } = state;

   if (status === "success") {
      return (
         <main className="mx-auto w-full max-w-md px-4 py-10">
            <p>Submission received</p>
         </main>
      );
   }

   const fields = step < 2 ? STEP_FIELDS[step] : [];
   const stepIsValid = fields.every((f) => validate(f, values[f]) === null);
   const submitting = status === "submitting";

   async function submit() {
      if (submitting) return;
      dispatch({ type: "submitting" });
      try {
         await fakeApi.post("/signup", values);
         dispatch({ type: "success" });
      } catch (e) {
         dispatch({ type: "failure", error: e instanceof Error ? e.message : "Something went wrong" });
      }
   }

   return (
      <main className="mx-auto w-full max-w-md px-4 py-10">
         <h1 className="mb-2">Sign up</h1>
         <p className="mb-1 text-sm opacity-70">Step {step + 1} of 3</p>
         <h2 className="mb-4 font-semibold">{STEP_TITLES[step]}</h2>

         {fields.map((field) => {
            const message = touched[field] ? validate(field, values[field]) : null;
            return (
               <div key={field} className="mb-3 flex flex-col">
                  <label className="flex flex-col text-sm">
                     {LABELS[field]}
                     <input
                        value={values[field]}
                        onChange={(e) => dispatch({ type: "change", field, value: e.target.value })}
                        onBlur={() => dispatch({ type: "blur", field })}
                        className="rounded border px-2 py-1"
                     />
                  </label>
                  {message && <p className="text-sm text-red-600">{message}</p>}
               </div>
            );
         })}

         {step === 2 && (
            <dl className="mb-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
               {(Object.keys(LABELS) as Field[]).map((field) => (
                  <div key={field} className="contents">
                     <dt className="opacity-70">{LABELS[field]}</dt>
                     <dd>{values[field]}</dd>
                  </div>
               ))}
            </dl>
         )}

         {status === "error" && (
            <p role="alert" className="mb-3 text-sm text-red-600">
               {error}
            </p>
         )}

         <div className="flex gap-2">
            {step > 0 && (
               <button type="button" disabled={submitting} onClick={() => dispatch({ type: "back" })}>
                  Back
               </button>
            )}
            {step < 2 ? (
               <button type="button" disabled={!stepIsValid} onClick={() => dispatch({ type: "next" })}>
                  Next
               </button>
            ) : (
               <button type="button" disabled={submitting} onClick={submit}>
                  {submitting ? "Submitting..." : "Submit"}
               </button>
            )}
         </div>
      </main>
   );
}
