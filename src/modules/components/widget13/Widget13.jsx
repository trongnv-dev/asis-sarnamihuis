import { createBasicComponent } from "../utils"
import Widget13Avatar from "./Widget13Avatar"
import Widget13Title from "./Widget13Title"
import Widget13Subtitle from "./Widget13Subtitle"

const Widget13 = createBasicComponent("div", "widget13", "Widget13")

Widget13.Avatar = Widget13Avatar
Widget13.Title = Widget13Title
Widget13.Subtitle = Widget13Subtitle

export default Widget13
