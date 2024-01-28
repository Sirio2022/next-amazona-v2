'use client'

import useLayoutService from "@/lib/hooks/useLayout"

const DrawerButton = () => {
    const { drawerOpen, toggleDrawer } = useLayoutService()


    return (
        <input
            type="checkbox"
            id="my-drawer"
            className="drawer-toggle"
            checked={drawerOpen}
            onChange={toggleDrawer}
        />
    )
}

export default DrawerButton
