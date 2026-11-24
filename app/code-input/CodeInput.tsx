"use client";

type Props = {
   length?: number;
   onComplete?: (code: string) => void;
};

export function CodeInput({ length = 4, onComplete }: Props) {
   void length;
   void onComplete;
   // TODO: your code goes here
   return <div />;
}
