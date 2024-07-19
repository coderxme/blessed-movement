// import Activity from "./activity/Activity"
import "./CommandCenterStyle.css"
import IncidentMap from "./incidentMap/IncidentMap"
export default function CommandCenter() {
  return (
    <div className="commandCenterContainer">
      <h1 className="title">Command Center</h1>
      <IncidentMap />
      {/* <Activity /> */}
    </div>
  )
}
