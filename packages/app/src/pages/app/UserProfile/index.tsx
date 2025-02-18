import {
	Button,
	Container,
	Flex,
	Grid,
	Group,
	Paper,
	Select,
	Text,
	useMantineTheme
} from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import React, { useState } from "react"
import { CountryDropdown, RegionDropdown } from "react-country-region-selector"
import { useNavigate } from "react-router-dom"
import { type Database, type Json } from "../../../../types/database.types"
import UserAvatar from "../../../components/UserAvatar"
import useGlobalStore from "../../../store/useGlobalStore"
import MainLayout from "../MainLayout.tsx"
import useRoomStyles from "./index.styles"

export default function Profile () {
	const navigate = useNavigate()
	const supabase = useSupabaseClient<Database>()
	const { classes } = useRoomStyles()
	const theme = useMantineTheme()
	const [uploading, setUploading] = useState<boolean>(false)
	const { user, setUser, clearState } = useGlobalStore()
	const [location, setLocation] = useState("")
	const [country, setCountry] = useState("Canada")
	const [region, setRegion] = useState("Ontario")
	const [age, setAge] = useState(26)
	const [pronouns, setPronouns] = useState("He/Him")

	const saveAge = async (newAge: number) => {
		const oldAge = age
		setAge(newAge)

		if (oldAge !== newAge) {
			const newDetails = user.details ? { ...user.details } : {}
			newDetails.age = newAge

			await supabase
				.from("accounts")
				.update({
					details: newDetails as Json
				})
				.eq("id", user.uid!)

			setUser({
				...user,
				details: newDetails
			})
		}
	}

	const savePronouns = async (newPronouns: string) => {
		const oldPronouns = pronouns
		setPronouns(newPronouns)

		if (oldPronouns !== newPronouns) {
			if (oldPronouns !== newPronouns) {
				const newDetails = user.details ? { ...(user.details ?? {}) } : {}
				newDetails.pronouns = newPronouns

				await supabase
					.from("accounts")
					.update({
						details: newDetails as Json
					})
					.eq("id", user.uid!)

				setUser({
					...user,
					details: newDetails
				})
			}
		}
	}

	const saveLocation = async (newLocation: string) => {
		const oldLocation = location
		setLocation(newLocation)

		if (oldLocation !== newLocation) {
			await supabase
				.from("accounts")
				.update({
					location: newLocation
				})
				.eq("id", user.uid!)

			setUser({
				...user,
				location: newLocation
			})
		}
	}

	const signOut = async () => {
		await supabase.auth.signOut()
		clearState()
		navigate("/")
	}

	const uploadImage = async (imgFile: File): Promise<void> => {
		if (!user.uid) return
		setUploading(true)
		const targetImage = imgFile

		const { data: imageUploadData, error: imageUploadError } =
			await supabase.storage
				.from("profile-images")
				.upload(
					`${user.uid}-${new Date().getTime()}/profile.png`,
					targetImage,
					{
						cacheControl: "0",
						upsert: true
					}
				)

		if (imageUploadError) {
			setUploading(false)
			showNotification({
				title: "Error",
				message: "Unexpected error"
			})
			return
		}

		const existingImage = user.avatar_url?.split("profile-images/")[1]
		if (existingImage) {
			supabase.storage.from("profile-images").remove([existingImage])
		}

		const { data: imageUrlData } = supabase.storage
			.from("profile-images")
			.getPublicUrl(imageUploadData.path)

		const IMAGE_URL = imageUrlData.publicUrl

		await supabase
			.from("accounts")
			.update({
				avatar_url: IMAGE_URL
			})
			.eq("id", user.uid)

		setUser({
			...user,
			avatar_url: IMAGE_URL
		})
		setUploading(false)
	}

	const openImagePicker = () => {
		if (uploading) {
			return
		}

		const input = document.createElement("input")
		input.type = "file"
		input.accept = "image/*"
		input.onchange = (e) => {
			const files = (e.target as HTMLInputElement).files
			if (files) {
				uploadImage(files[0])
			}
		}
		input.click()
	}

	return (
		<MainLayout title={"My Account"}>
			<div
				className={classes.profile_container}
				style={{
					alignItems: "center",
					display: "flex"
				}}
			>
				{/* <Paper shadow="xs" radius="lg" p="xl" w={"100%"} mx={"0"}> */}
				<Container maw={"100%"} p={"xxl"} style={{}}>
					<div onClick={openImagePicker}>
						<UserAvatar src={user.avatar_url || ""} online={true} size="lg" />
					</div>
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
						<label>Location</label>
						<Grid gutter={"xs"}>
							<Grid.Col span={6}>
								<label>Country </label>
								<CountryDropdown
									value={country}
									onChange={(val) => {
										setCountry(val)
										saveLocation(`${val}, ${region}`)
									}}
									classes={classes.select}
								/>
							</Grid.Col>
							<Grid.Col span={6}>
								<Paper bg={"transparent"} style={{ color: "white" }}>
									<label>State</label>
									<RegionDropdown
										country={country}
										value={region}
										onChange={(val) => {
											setRegion(val)
											saveLocation(`${country}, ${val}`)
										}}
										classes={classes.select}
									/>
								</Paper>
							</Grid.Col>
						</Grid>
						<Grid gutter={"xs"}>
							<Grid.Col span={6}>
								<Paper bg={"transparent"} style={{ color: "white" }}>
									<label>Age</label>
									<select
										value={age}
										onChange={async (e) => {
											await saveAge(parseInt(e.target.value))
										}}
										style={{
											backgroundColor: "#232627",
											color: "white",
											padding: "1rem 1rem",
											border: "none",
											borderRadius: "10px",
											marginRight: "1rem",
											width: "100%",
											WebkitAppearance: "none"
										}}
									>
										{[...Array(83)].map((_, index) => (
											<option key={index + 18} value={index + 18}>
												{index + 18}
											</option>
										))}
									</select>
								</Paper>
							</Grid.Col>
							<Grid.Col span={6}>
								<Paper bg={"transparent"} style={{ color: "white" }}>
									<label>Pronouns</label>
									<Select
										placeholder="He/Him"
										value={pronouns}
										onChange={(value) => {
											savePronouns(value!)
										}}
										styles={{
											input: {
												border: "none",
												backgroundColor: "#232627",
												padding: "1.5rem 1rem",
												color: "white"
											}
										}}
										data={[
											{ value: "He/Him", label: "He/Him" },
											{ value: "She/Her", label: "She/Her" },
											{ value: "Non-Binary", label: "Non-Binary" }
										]}
									/>
								</Paper>
							</Grid.Col>
						</Grid>
					</Flex>
				</Container>
				<Group
					mb={"lg"}
					mt={"4xl"}
					style={{
						gap: theme.spacing.xs
					}}
				>
					<Button fullWidth variant="transparent" size="md" onClick={signOut}>
						<Text className={classes.logoutButton}>Logout</Text>
					</Button>
				</Group>
				{/* </Paper> */}
			</div>
		</MainLayout>
	)
}
