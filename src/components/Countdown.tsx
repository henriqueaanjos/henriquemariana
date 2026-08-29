'use client'

import { Fragment } from "react"
import { useCountdown } from "../hooks/useCountdown"


export function Countdown() {
    const { months, days, hours, minutes, seconds } = useCountdown('2027-01-09T16:00:00-04:00')
    const units = [
        { value: months, label: 'M' },
        { value: days, label: 'D' },
        { value: hours, label: 'H' },
        { value: minutes, label: 'M' },
        { value: seconds, label: 'S' },
    ]

    return (
        <div className="flex flex-row items-center gap-3 text-primary-dark">
            {units.map((unit, index) => (
                <Fragment key={index}>
                    <div className="flex flex-col items-center font-cormorant">
                        <span className="text-3xl">{unit.value}</span>
                        <span className="text-lg">{unit.label}</span>
                    </div>
                    {index < units.length - 1 && (
                        <span className="text-3xl font-bold">:</span>
                    )}
                </Fragment>
            ))}
        </div>
    )
}