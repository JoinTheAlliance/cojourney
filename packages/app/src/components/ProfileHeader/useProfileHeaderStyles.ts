import { createStyles } from "@mantine/core"

const useRoomHeaderStyles = createStyles((theme) => ({
  container: {
    padding: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },

  headerLeft: {
    display: "flex",
    alignItems: "center"
  },

  participants: {
    cursor: "pointer"
  }
}))

export default useRoomHeaderStyles
