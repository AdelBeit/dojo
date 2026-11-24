"use client";

import type { ReactElement } from "react";

type Props = {
   content: string;
   children: ReactElement;
   placement?: "top" | "bottom";
   delayMs?: number;
   onOpenChange?: (open: boolean) => void;
};

export function Tooltip({ children }: Props) {
   // TODO: your code goes here
   return children;
}
