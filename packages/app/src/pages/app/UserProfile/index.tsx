import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  Container,
  Flex,
  Grid,
  Group,
  Input,
  Paper,
  Select,
  Text,
  Button,
  useMantineTheme,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { type Database } from "../../../../types/database.types";
import useRoomStyles from "../Room/useRoomStyles";
import ProfileHeader from "../../../components/ProfileHeader";
import UserAvatar from "../../../components/UserAvatar";
import UploadProfileImage from "../../../components/RegisterUser/helpers/UploadProfileImage.tsx/UploadProfileImage";
import { showNotification } from "@mantine/notifications";
import useGlobalStore from "../../../store/useGlobalStore";

export default function Profile() {
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const supabase = useSupabaseClient<Database>();
  const { classes: roomClasses } = useRoomStyles();
  const theme = useMantineTheme();
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const { user, setUser, clearState } = useGlobalStore();
  const [location, setLocation] = useState("");
  const [settingLocation, setSettingLocation] = useState(false);
  const [age, setAge] = useState(26);
  const [pronouns, setPronouns] = useState("He/Him");

  const saveLocation = async (newLocation: string) => {
    const oldLocation = location;
    setLocation(newLocation);

    if (oldLocation !== newLocation) {
      await supabase
        .from("accounts")
        .update({
          location: newLocation,
        })
        .eq("id", user.uid as string);

      setUser({
        ...user,
        location: newLocation,
      });
    }
  };

  const saveAge = async (newAge: number) => {
    const oldAge = age;
    setAge(newAge);

    if (oldAge != newAge) {
      const newDetails = user.details ? { ...user.details } : {};
      newDetails.age = newAge;

      await supabase
        .from("accounts")
        .update({
          details: newDetails,
        })
        .eq("id", user.uid);

      setUser({
        ...user,
        details: newDetails,
      });
    }
  };

  const savePronouns = async (newPronouns: string) => {
    const oldPronouns = pronouns;
    setPronouns(newPronouns);

    if (oldPronouns != newPronouns) {
      const newDetails = user.details ? { ...user.details } : {};
      newDetails.pronouns = newPronouns;

      await supabase
        .from("accounts")
        .update({
          details: newDetails,
        })
        .eq("id", user.uid);

      setUser({
        ...user,
        details: newDetails,
      });
    }
  };

  const getAutoLocation = async () => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setSettingLocation(true);

        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const resp = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&accept-language=en`
        );
        const data = await resp.json();
        const country = data.address.country;
        const province = data.address.province;
        saveLocation(`${province}, ${country}`);
        setSettingLocation(false);
      },
      (error) => {
        alert(error.message);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  useEffect(() => {
    console.log("user:", user);
    const location = user.location;
    const age = user.age;
    const pronouns = user.pronouns;
    if (location) {
      setLocation(location);
    } else {
      getAutoLocation();
    }
    if (age) {
      setAge(age);
    }
    if (pronouns) {
      setPronouns(pronouns);
    }
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    clearState();
    navigate("/");
  };

  const uploadImage = async (imgFile: File): Promise<void> => {
    if (!user.uid) return;
    setUploading(true);
    const targetImage = profileImage || imgFile;

    const { data: imageUploadData, error: imageUploadError } =
      await supabase.storage
        .from("profile-images")
        .upload(
          `${user.uid}-${new Date().getTime()}/profile.png`,
          targetImage,
          {
            cacheControl: "0",
            upsert: true,
          }
        );

    if (imageUploadError) {
      setUploading(false);
      showNotification({
        title: "Error",
        message: "Unexpected error",
      });
      return;
    }

    const existingImage = user.avatar_url?.split(
      "profile-images/"
    )[1] as string;
    if (existingImage) {
      supabase.storage.from("profile-images").remove([existingImage]);
    }

    const { data: imageUrlData } = supabase.storage
      .from("profile-images")
      .getPublicUrl(imageUploadData.path);

    const IMAGE_URL = imageUrlData.publicUrl;

    await supabase
      .from("accounts")
      .update({
        avatar_url: IMAGE_URL,
      })
      .eq("id", user.uid);

    setUser({
      ...user,
      avatar_url: IMAGE_URL,
    });
    setProfileImage(null);
    setUploading(false);
  };

  const back = () => {
    navigate("/");
  };

  return (
    <div>
      <div className={roomClasses.headerContainer}>
        <ProfileHeader title={"My Account"} />
      </div>
      <div
        className={roomClasses.messagesContainer}
        style={{
          alignItems: "center",
          display: "flex",
        }}
      >
        <Paper
          shadow="xs"
          radius="lg"
          p="xl"
          w={"100%"}
          mx={isMobile ? "0" : "8xl"}
        >
          <Container maw={"100%"} p={"xxl"} style={{}}>
            <UserAvatar src={user.avatar_url || ""} online={true} size="lg" />
            <Text
              align="center"
              size="xl"
              color={theme.colors.gray[4]}
              mt={"xl"}
              weight={"500"}
            >
              {user.name}
            </Text>

            <Flex direction="column" gap={16}>
              <Input.Wrapper style={{ color: "white" }}>
                <label>Location</label>
                <Input
                  value={location}
                  onChange={(e) => {
                    saveLocation(e.target.value as string);
                  }}
                  // p={"sm"}
                  styles={{
                    input: {
                      padding: "1.5rem",
                      border: "1px solid #232627",
                      borderRadius: "0.8rem",
                      backgroundColor: "#141414",
                      color: "white",
                    },
                  }}
                />
                <br />
                <Button
                  fullWidth
                  variant="transparent"
                  size="md"
                  onClick={getAutoLocation}
                  disabled={settingLocation}
                >
                  <Text color={theme.white}>Get Location</Text>
                </Button>
              </Input.Wrapper>
              <Grid gutter={"xs"}>
                <Grid.Col span={6}>
                  <Input.Wrapper style={{ color: theme.white }}>
                    <label>Age</label>
                    <Input
                      placeholder="Your Age"
                      value={age}
                      onChange={(e) => {
                        saveAge(Number(e.target.value));
                      }}
                      type="Number"
                      styles={{
                        input: {
                          border: "none",
                          backgroundColor: "#232627",
                          padding: "1.5rem 1rem",
                          color: "white",
                        },
                      }}
                      style={{ marginRight: "1rem" }}
                    />
                  </Input.Wrapper>
                </Grid.Col>
                <Grid.Col span={6}>
                  <Paper bg={"transparent"} style={{ color: "white" }}>
                    <label>Pronouns</label>
                    <Select
                      value={pronouns}
                      onChange={savePronouns}
                      styles={{
                        input: {
                          border: "none",
                          backgroundColor: "#232627",
                          padding: "1.5rem 1rem",
                          color: "white",
                        },
                      }}
                      data={[
                        { value: "He/Him", label: "He/Him" },
                        { value: "She/Her", label: "She/Her" },
                      ]}
                    />
                  </Paper>
                </Grid.Col>
              </Grid>
              <Input.Wrapper style={{ color: "white" }}>
                <label>Profile Picture</label>
                <UploadProfileImage
                  image={profileImage}
                  setImage={(e: React.SetStateAction<File | null>) => {
                    setProfileImage(e as File);
                    if (e) uploadImage(e as File);
                  }}
                />
              </Input.Wrapper>
            </Flex>
          </Container>
          <Group
            mb={"lg"}
            mt={"4xl"}
            style={{
              gap: theme.spacing.xs,
            }}
          >
            <Button
              loading={uploading}
              fullWidth
              variant="transparent"
              size="md"
              onClick={async () => {
                if (profileImage) await uploadImage(profileImage);
              }}
              disabled={!profileImage}
            >
              <Text color={theme.white}>Update</Text>
            </Button>
            {isMobile && (
              <Button fullWidth variant="transparent" size="md" onClick={back}>
                <Text color={theme.white}>Back</Text>
              </Button>
            )}
            <Button fullWidth variant="transparent" size="md" onClick={signOut}>
              <Text color={theme.colors.red[8]}>Logout</Text>
            </Button>
          </Group>
        </Paper>
      </div>
    </div>
  );
}
