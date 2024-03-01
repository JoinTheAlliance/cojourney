import React from "react"
import { Button, Card, Divider, Flex, Group, Text } from "@mantine/core"
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { Image, Trash, Upload, X } from "react-feather"
import { showNotification } from "@mantine/notifications"

interface IUploadProfileImage {
  image: File | null
  avatar_url?: string | null
  setImage: React.Dispatch<React.SetStateAction<File | null>>
  setImageUrl?: React.Dispatch<React.SetStateAction<string | null>>
}

const UploadProfileImage = ({
  image,
  setImage,
  avatar_url,
  setImageUrl
}: IUploadProfileImage): JSX.Element => {
  const imageUpload = (): JSX.Element => {
    return (
      <Dropzone
        accept={IMAGE_MIME_TYPE}
        maxSize={3 * 1024 ** 2}
        multiple={false}
        onDrop={(files): void => {
          setImage(files[0] as File)
        }}
        onReject={(): void => {
          showNotification({
            title: "Invalid image.",
            message: "Images need to be less than 5MB"
          })
        }}
      >
        <Group
          position="center"
          spacing="xl"
          style={{ minHeight: 120, pointerEvents: "none" }}
        >
          <Dropzone.Accept>
            <Upload size={50} />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <X size={50} />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <Image size={50} />
          </Dropzone.Idle>

          <div>
            <Text
              inline
              size="xl"
            >
              Drag images here or click to select files
            </Text>
          </div>
        </Group>
      </Dropzone>
    )
  }

  const imageUploaded = (): JSX.Element => {
    const imagePreviewCard = (src: string): JSX.Element => {
      return (
        <Card withBorder>
          <img
            alt="Uploaded Profile"
            src={src}
          />
          <Divider
            mb={10}
            mt={10}
          />
          <Flex justify="end">
            <Button
              color="red"
              leftIcon={<Trash size={16} />}
              onClick={(): void => {
                setImage(null)
                if (setImageUrl) setImageUrl(null)
              }}
              variant="outline"
            >
              Remove image
            </Button>
          </Flex>
        </Card>
      )
    }

    // Adding the date at the end will fool the idiot browser into thinking its a new image
    // preventing the fucking browser from cashing the image.
    if (avatar_url) return imagePreviewCard(`${avatar_url}?${Date.now()}`)

    if (!image) {
      return (
        <Card withBorder>
          <p>
            There was an error loading your image, please try selecting it
            again. If the error persists your image might be in the wrong format
          </p>
        </Card>
      )
    }

    const uploadedImageGeneratedUrl = URL.createObjectURL(image)

    return imagePreviewCard(uploadedImageGeneratedUrl)
  }

  const returnCorrectComponent = (): JSX.Element => {
    if (image || avatar_url) return imageUploaded()

    return imageUpload()
  }

  return (
    <>
      {returnCorrectComponent()}
      <Text
        color="dimmed"
        size={12}
      />
    </>
  )
}

export default UploadProfileImage
