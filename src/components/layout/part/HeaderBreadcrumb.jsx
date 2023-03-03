import { Breadcrumb } from "@blueupcode/components"
import { forwardRef } from "react"
import { connect } from "react-redux"
import * as FeatherIcon from "react-feather"
import Link from "next/link"

function HeaderBreadcrumb(props) {
  const BreadcrumbItem = forwardRef((props, ref) => (
    <Breadcrumb.Item {...props} innerRef={ref} />
  ))

  return (
    <Breadcrumb>
      {/* {props.breadcrumb.map((data, index) => {
        const { link, text } = data
        const Icon = index === 0 ? () => <FeatherIcon.Home /> : false

        if (link) {
          return (
            <Link key={index} href={link} passHref>
              <BreadcrumbItem icon={Icon ? <Icon /> : false}>
                {text}
              </BreadcrumbItem>
            </Link>
          )
        } else {
          return (
            <Breadcrumb.Item key={index} icon={Icon ? <Icon /> : false}>
              {text}
            </Breadcrumb.Item>
          )
        }
      })} */}
    </Breadcrumb>
  )
}

function mapStateToProps(state) {
  return {
    breadcrumb: state.breadcrumb
  }
}

export default connect(mapStateToProps)(HeaderBreadcrumb)
