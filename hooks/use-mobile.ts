import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  const checkIsMobile = React.useCallback(() => {
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
  }, [])

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      checkIsMobile()
    }
    mql.addEventListener("change", onChange)
    
    // Set initial value only on first mount without triggering the warning
    // We do this by checking if it's undefined
    if (isMobile === undefined) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      checkIsMobile()
    }
    
    return () => mql.removeEventListener("change", onChange)
  }, [checkIsMobile, isMobile])

  return !!isMobile
}

