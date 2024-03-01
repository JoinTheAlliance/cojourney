import { Text, useMantineTheme } from "@mantine/core"
import React from "react"
import useRoomHeaderStyles from "./useProfileHeaderStyles"
import useGlobalStore from "../../store/useGlobalStore"

const ProfileHeader = ({ title }: { title: string }): JSX.Element => {
  const { classes } = useRoomHeaderStyles()

  const theme = useMantineTheme()

  return (
    <div style={{ zIndex: "9999" }}>
      <div className={classes.container}>
        <Text weight={700} size={""} color={theme.white}>
          {title}
        </Text>
      </div>
    </div>
  )
}

export default ProfileHeader
