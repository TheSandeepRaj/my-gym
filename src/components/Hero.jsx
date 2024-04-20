import React from "react";
import Button from "./Button";

export default function Hero() {
  return (
    <div className="min-h-screen flex flex-col gap-10 items-center justify-center text-center max-w-[800px] w-full mx-auto p-4">
      <div className="flex flex-col gap-4">
        <p className="text-base font-light uppercase tracking-wider text-muted">
          IT'S TIME TO GET
        </p>
        <h1 className="uppercase font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl">
          My <span className="text-primary">Gym</span>
        </h1>
      </div>
      <p className="text-sm md:text-base font-light">
        I fully acknowledge that I may become{" "}
        <span className="text-primary font-medium">exceptionally strong</span>{" "}
        and willingly accept the challenges of transforming into a dedicated{" "}
        <span className="text-primary font-medium">fitness enthusiast</span>,
        whose presence commands respect and whose commitment is unwavering.
      </p>

      <Button
        func={() => {
          window.location.href = "#generate";
        }}
        text={"Accept & Begin"}
      />
    </div>
  );
}
