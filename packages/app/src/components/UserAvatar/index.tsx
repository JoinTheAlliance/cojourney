import { Avatar, Group, LoadingOverlay } from "@mantine/core"
import React from "react"

const UserAvatar = ({
  src,
  online,
  size = "sm",
  loading
}: {
  src: string
  online: boolean
  size?: string
  loading?: boolean
}) => {
  return (
    <>
      {size === "lg" ? (
        <Group position="center">
          <div style={{ position: "relative", cursor: "pointer" }}>
            <LoadingOverlay
              // @ts-expect-error
             visible={loading}
              zIndex={500}
              radius="50%"
              loaderProps={{ color: "green", type: "bars" }}
            />
            <Avatar
              src={src}
              radius="50%"
              style={{
                width: "10rem",
                height: "10rem"
              }}
            />
            <div
              style={{
                width: "30px",
                height: "30px",
                borderRadius: "50%",
                backgroundColor: online ? "green" : "gray",
                position: "absolute",
                right: "0",
                bottom: "0",
                border: "2px solid white",
                transform: "translate(-25%, -25%)",
                zIndex: "501"
              }}
            />
          </div>
        </Group>
      ) : (
        <Group position="center">
            <div style={{ position: "relative", cursor: "pointer" }}>
               <LoadingOverlay
              // @ts-expect-error
             visible={loading}
              zIndex={500}
              radius="50%"
              loaderProps={{ color: "green", type: "bars" }}
            />
            <Avatar src={src} size="md" radius="50%" />
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: online ? "green" : "gray",
                position: "absolute",
                right: "0",
                bottom: "0",
                border: "1px solid white",
                  transform: "translate(20%, 0%)",
                zIndex: "501"
              }}
            />
          </div>
        </Group>
      )}
    </>
  )
}

export default UserAvatar
