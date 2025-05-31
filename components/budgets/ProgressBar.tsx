"use client"

import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"

export default function ProgressBar({percentage}: {percentage: number}) {
  return (
    <div className="flex justity-center p-10">
        <CircularProgressbar 
            value={percentage}
            styles={buildStyles({
                pathColor: percentage>= 80 ? '#DC2626' : "#F59E0B",
                trailColor: "#e1e1e1",
                textColor: percentage>= 80 ? '#DC2626' :"#F59E0B",
                textSize: 8
            })}
            text={`${percentage}% Gastado`}
        />
    </div>
  )
}
