import {
LineChart,
Line,
XAxis,
YAxis,
Tooltip,
ResponsiveContainer
} from "recharts"

interface Props {
data: any[]
}

export default function TrafficChart({ data }: Props){

return(

<div className="h-[300px]">

<ResponsiveContainer width="100%" height="100%">

<LineChart data={data}>

<XAxis dataKey="time"/>

<YAxis/>

<Tooltip/>

<Line
type="monotone"
dataKey="download"
stroke="#3b82f6"
strokeWidth={2}
/>

<Line
type="monotone"
dataKey="upload"
stroke="#10b981"
strokeWidth={2}
/>

</LineChart>

</ResponsiveContainer>

</div>

)

}