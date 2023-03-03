import { Aside, Menu } from "@blueupcode/components"
import { Component, createRef, forwardRef } from "react"
import { withRouter } from "next/router"
import SimpleBar from "simplebar"
import Link from "next/link"

class AsideBodyComponent extends Component {
  constructor(props) {
    super(props)
    const { states, submenuActive } = this.setInitialState()

    // Set initial data
    this.linkRefs = []
    this.submenuRefs = []
    this.state = states
    this.submenuActive = submenuActive
    this.bodyRef = createRef()
  }

  setInitialState = () => {
    let states = {}
    const submenuActive = []

    // Loop the ASIDE_MENU object tree
    this.props.AsideMenu.forEach((menu, index1) => {
      // Check whether the node has child
      if (menu.children && menu.children.length>0) {
        // Add data to states variables
        states = this.addDataToObject(states, [index1], {
          active: true,
          height: "auto",
          hasChild: true
        })

        // Loop the second level child node
        menu.children.forEach((menu, index2) => {
          // Check whether the node has child
          if (menu.children && menu.children.length>0) {
            // Add data to states variables
            states = this.addDataToObject(states, [index1, index2], {
              active: true,
              height: "auto",
              hasChild: true
            })

            // Loop the third level child node
            menu.children.forEach((menu, index3) => {
              // Add data to states variables
              states = this.addDataToObject(states, [index1, index2, index3], {
                active: menu.uri === this.props.router.pathname,
                hasChild: false
              })

              // Add data to submenuActive variables
              if (menu.uri === this.props.router.pathname) {
                submenuActive.push([index1, index2].join(","))
                submenuActive.push([index1].join(","))
              }
            })
          } else {
            // Add data to states variables

            states = this.addDataToObject(states, [index1, index2], {
              active: menu.uri === this.props.router.pathname,
              hasChild: false
            })

            // Add data to submenuActive variables
            if (menu.uri === this.props.router.pathname) {
              submenuActive.push([index1].join(","))
            }
          }
        })
      } else {
        // Add data to states variables
        states = this.addDataToObject(states, [index1], {
          active: menu.uri === this.props.router.pathname,
          hasChild: false
        })
      }
    })
    return { states, submenuActive }
  }

  componentDidUpdate(prevProps) {
    if(prevProps.AsideMenu != this.props.AsideMenu )
    {
      let { states, submenuActive } = this.setInitialState()
      this.submenuActive = submenuActive
      this.setState(states)
      if(this.submenuRefs!=null)
      {
        this.submenuRefs.forEach((submenu) => {
          if (submenu != null) {
            const selfRoute = submenu.getAttribute("data-route").split(",")
            if (this.submenuActive.includes(selfRoute.join(","))) {
              states[selfRoute].active = true
            } 
            else if(states[selfRoute]!=null) {
              states[selfRoute].active = false
            }
            
          }
        })
      }
    }
  }

  handleLinkClick = (selfRoute, parentRoute) => {
    const states = this.state

    // Check whether the link has child
    if (states[selfRoute].hasChild) {
      // Toggle active state
      states[selfRoute].active = !states[selfRoute].active
    } else {
      // Deactivate all links
      for (const selfRoute in states) {
        if (!states[selfRoute].hasChild) {
          states[selfRoute].active = false
        }
      }

      // Activate clicked link
      states[selfRoute].active = true
    }

    this.setState(states)
  }

  addDataToObject = (object, identifier, value) => {
    return {
      ...object,
      [identifier]: value
    }
  }

  componentDidMount() {
    const states = this.state

    // Loop submenu elements to set height and collapse it
    this.submenuRefs.forEach((submenu) => {
      // Get submenu route
      const selfRoute = submenu.getAttribute("data-route").split(",")

      // Set element height
      states[selfRoute].height = submenu.offsetHeight

      // Check whether submenu elements is active
      if (this.submenuActive.includes(selfRoute.join(","))) {
        states[selfRoute].active = true
      } else {
        states[selfRoute].active = false
      }
    })

    // Loop submenu elements to fix height data
    this.submenuRefs.forEach((submenu) => {
      // Get submenu parent route
      const parentRoute = submenu.getAttribute("data-route").split(",")
      parentRoute.pop()

      // Check whether the submenu has parents
      if (parentRoute.length > 0) {
        const selfheight = submenu.offsetHeight
        const parentHeight = states[parentRoute].height

        // Fix the element height
        states[parentRoute].height = parentHeight - selfheight
      }
    })

    this.setState(states, () => {
      // Initialize custom scrollbar
      new SimpleBar(this.bodyRef.current)
    })
  }

render() {
    return (
      <Aside.Body innerRef={this.bodyRef}>
        <Menu>
          {/* Loop ASIDE_MENU object tree */}
          {this.props.AsideMenu.map((menu, index1) => {
            // Set all variables needed
            const Icon = menu.icon
            const parentRoute = []
            const selfRoute = [index1]
            const hasChild = Boolean(menu.children && menu.children.length>0)
            const state = this.state[selfRoute]

            // Check whether the node is a section
            return menu.section ? (
              <Menu.Section key={index1}>{menu.name || menu.key}</Menu.Section>
            ) : (
              <Menu.Item key={index1}>
                <AsideBodyMenuLink
                  key={index1}
                  data-level={0}
                  data-route={selfRoute}
                  link={menu.uri}
                  icon={Icon ? <span className="material-icons">{Icon}</span> : false}
                  addon={menu.addon}
                  bullet={menu.bullet}
                  active={state?.active}
                  hasChild={hasChild}
                  onClick={() => this.handleLinkClick(selfRoute, parentRoute)}
                  innerRef={(ref) => this.linkRefs.push(ref)}
                >
                  {menu.name || menu.key}
                </AsideBodyMenuLink>
                {/* Check whether the node has child */}
                {hasChild ? (
                  <Menu.Submenu
                    data-level={0}
                    data-route={selfRoute}
                    active={state?.active}
                    height={state.height}
                    innerRef={(ref) => this.submenuRefs.push(ref)}
                  >
                    {/* Loop the second level ASIDE_MENU object tree */}
                    {menu.children.map((menu, index2) => {
                      // Set all variables needed
                      const Icon = menu.icon
                      const parentRoute = [index1]
                      const selfRoute = [index1, index2]
                      const hasChild = Boolean(menu.children && menu.children.length>0)
                      const state = this.state[selfRoute]

                      return (
                        <Menu.Item key={index2}>
                          <AsideBodyMenuLink
                            key={index2}
                            data-route={selfRoute}
                            data-level={1}
                            link={menu.uri}
                            icon={Icon ? <span className="material-icons">{Icon}</span> : false}
                            addon={menu.addon}
                            bullet={menu.bullet}
                            active={state?.active}
                            hasChild={hasChild}
                            onClick={() =>
                              this.handleLinkClick(selfRoute, parentRoute)
                            }
                            innerRef={(ref) => this.linkRefs.push(ref)}
                          >
                            {menu.name || menu.key}
                          </AsideBodyMenuLink>
                          {/* Check whether the node has child */}
                          {hasChild ? (
                            <Menu.Submenu
                              data-level={1}
                              data-route={selfRoute}
                              active={state?.active}
                              height={state.height}
                              innerRef={(ref) => this.submenuRefs.push(ref)}
                            >
                              {/* Loop the third level ASIDE_MENU object tree */}
                              {menu.children.map((menu, index3) => {
                                // Set all variables needed
                                const Icon = menu.icon
                                const parentRoute = [index1, index2]
                                const selfRoute = [index1, index2, index3]
                                const hasChild = Boolean(menu.children && menu.children.length>0)
                                const state = this.state[selfRoute]

                                return (
                                  <Menu.Item key={index3}>
                                    <AsideBodyMenuLink
                                      key={index3}
                                      data-route={selfRoute}
                                      data-level={2}
                                      link={menu.uri}
                                      icon={Icon ? <span className="material-icons">{Icon}</span> : false}
                                      addon={menu.addon}
                                      bullet={menu.bullet}
                                      active={state?.active}
                                      hasChild={hasChild}
                                      onClick={() =>
                                        this.handleLinkClick(
                                          selfRoute,
                                          parentRoute
                                        )
                                      }
                                      innerRef={(ref) =>
                                        this.linkRefs.push(ref)
                                      }
                                    >
                                      {menu.name || menu.key}
                                    </AsideBodyMenuLink>
                                  </Menu.Item>
                                )
                              })}
                            </Menu.Submenu>
                          ) : null}
                        </Menu.Item>
                      )
                    })}
                  </Menu.Submenu>
                ) : null}
              </Menu.Item>
            )
          })}
        </Menu>
      </Aside.Body>
    )
  }
}

function AsideBodyMenuLink(props) {
  const { hasChild, link, ...attributes } = props
  const MenuLink = forwardRef((props, ref) => (
    <Menu.Link {...props} innerRef={ref} />
  ))

  return hasChild ? (
    <Menu.Link tag="button" {...attributes} caret toggle />
  ) : (
    <Link href={link} passHref>
      <MenuLink {...attributes} />
    </Link>
  )
}

export default withRouter(AsideBodyComponent)
