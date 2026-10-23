"use client";

import { Fragment } from "react";
import { useCountdown } from "../hooks/useCountdown";

export function Countdown() {
  const { months, days, hours, minutes, seconds } = useCountdown(
    "2027-01-09T16:00:00-04:00"
  );

  const units = [
    { value: months, label: "M" },
    { value: days, label: "D" },
    { value: hours, label: "H" },
    { value: minutes, label: "M" },
    { value: seconds, label: "S" },
  ];

  return (
    <div className="flex flex-col items-center justify-center px-6">
      <div
        className="
        flex flex-row items-center justify-center
        gap-1.5
        text-primary-dark
        sm:gap-2
        md:gap-2
        rounded-full
        bg-background/70
      "
      >
        {units.map((unit, index) => (
          <Fragment key={index}>
            <div
              className="
              flex flex-col items-center
              font-cormorant
              min-w-[2.5rem]
              sm:min-w-[3rem]
              md:min-w-[3.5rem]
            "
            >
              <span
                className="
                text-2xl leading-tight
                sm:text-3xl
                md:text-4xl
                lg:text-4xl
              "
              >
                {unit.value}
              </span>

              <span
                className="
                text-xs
                sm:text-sm
                md:text-base
                lg:text-lg
              "
              >
                {unit.label}
              </span>
            </div>

            {index < units.length - 1 && (
              <span
                className="
                text-xl font-bold
                sm:text-2xl
                md:text-3xl
                lg:text-2xl
                -mt-3
              "
                aria-hidden="true"
              >
                :
              </span>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}