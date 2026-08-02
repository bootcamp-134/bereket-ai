import type { Metadata } from "next";
import { BereketPrototype } from "@/components/bereket-prototype";

export const metadata: Metadata = {
  title: "Sprint 1 Mock Demo",
  description:
    "Bereket AI ürün fikrini sabit mock veriyle gösteren ilk web prototipi.",
};

export default function SprintOneDemoPage() {
  return <BereketPrototype />;
}
