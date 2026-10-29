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
    <div className="flex flex-col items-center justify-center">
      <div
        className="
        flex flex-row items-center justify-center
        gap-0.5
        text-primary-dark
        rounded-full
        bg-background/70
        p-0
      "
      >
        {units.map((unit, index) => (
          <Fragment key={index}>
            <div
              className="
              flex flex-col items-center
              font-cormorant
              px-4
              py-1
            "
            >
              <span
                className="
                text-2xl leading-tight
                sm:text-1xl
                md:text-1.5xl
                lg:text-2xl
                xl:text-3xl
              "
              >
                {unit.value}
              </span>

              <span
                className="
                text-[8px]
                sm:text-[10px]
                md:text-xs
                lg:text-sm
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