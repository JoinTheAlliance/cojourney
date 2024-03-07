import React, { useState } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import useGlobalStore from "../../../store/useGlobalStore";
import {
	Button,
	Container,
	Text,
	Checkbox,
	Flex,
	Box,
	ScrollArea,
} from "@mantine/core";
import useRootStyles from "../useRootStyles";

type Props = {};

const TermsOfService = () => {
	return (
		<Container size="md" p={"xxl"}>
			<section style={{ marginBottom: "1.5rem" }}>
				<Text size="xl" weight={500} style={{ marginBottom: "1rem" }}>
					Acceptance of Terms
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					These Terms of Service ("Terms") form an agreement between you
					("User", "you") and Cojourney Corporation ("Cojourney", "Company",
					"we", "us"). They apply to the website available at cojourney.chat
					(the "Website"), and the Cojourney mobile application (the "App"),
					collectively referred to as the "Services."
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					By accessing or using the Services, you agree to these Terms. If you
					do not understand or agree, please refrain from using the Services.
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					If the Services are used on behalf of an entity, "you" also includes
					that entity, with the assurance that you are an authorized
					representative with the authority to bind the entity to these Terms.
				</Text>
				<Text weight={500} style={{ marginBottom: "1rem" }}>
					NOTE: THESE TERMS INCLUDE AN ARBITRATION CLAUSE AND A WAIVER OF CLASS
					ACTION RIGHTS.
				</Text>
			</section>

			<section style={{ marginBottom: "1.5rem" }}>
				<Text size="xl" weight={500} style={{ marginBottom: "1rem" }}>
					Registration and Account Management
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					You must provide accurate and complete information when creating an //
					account. If you are under 18, or an EU citizen or resident under 16,
					// you are not permitted to use the Services.
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					You are responsible for all activities under your account and
					maintaining its confidentiality. Notify us immediately at{" "}
					<a
						href="mailto:support@cojourney.chat"
						className="text-blue-600 hover:underline"
					>
						support@cojourney.chat
					</a>{" "}
					of any unauthorized use.
				</Text>
			</section>

			{/* User Conduct and Content */}
			<section style={{ marginBottom: "1.5rem" }}>
				<Text size="xl" weight={500} style={{ marginBottom: "1rem" }}>
					User Conduct and Content
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					You are solely responsible for your conduct and any content you submit
					to the Services. Do not upload content that infringes rights, contains
					harmful code, or engages in unlawful or objectionable activities.
				</Text>
			</section>

			{/* Intellectual Property Rights */}
			<section style={{ marginBottom: "1.5rem" }}>
				<Text size="xl" weight={500} style={{ marginBottom: "1rem" }}>
					Intellectual Property Rights
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					You retain ownership of content you submit but grant Cojourney a broad
					license to use that content. Cojourney trademarks must not be used
					without prior consent.
				</Text>
			</section>

			{/* Third-Party Services */}
			<section style={{ marginBottom: "1.5rem" }}>
				<Text size="xl" weight={500} style={{ marginBottom: "1rem" }}>
					Third-Party Services
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					We are not liable for third-party services or content accessed through
					the Services.
				</Text>
			</section>

			{/* Indemnification */}
			<section style={{ marginBottom: "1.5rem" }}>
				<Text size="xl" weight={500} style={{ marginBottom: "1rem" }}>
					Indemnification
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					You agree to indemnify and hold harmless Cojourney from any claims
					arising from your use of the Services.
				</Text>
			</section>

			{/* Disclaimer of Warranty */}
			<section style={{ marginBottom: "1.5rem" }}>
				<Text size="xl" weight={500} style={{ marginBottom: "1rem" }}>
					Disclaimer of Warranty
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					The Services are provided "as is" without any warranties. Cojourney
					disclaims all warranties, express or implied.
				</Text>
			</section>

			{/* Limitation of Liability */}
			<section style={{ marginBottom: "1.5rem" }}>
				<Text size="xl" weight={500} style={{ marginBottom: "1rem" }}>
					Limitation of Liability
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					Cojourney's liability is limited under these Terms. You may not claim
					punitive or incidental damages.
				</Text>
			</section>

			{/* Dispute Resolution */}
			<section style={{ marginBottom: "1.5rem" }}>
				<Text size="xl" weight={500} style={{ marginBottom: "1rem" }}>
					Dispute Resolution
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					Disputes will be resolved through binding arbitration, and you waive
					the right to participate in class actions.
				</Text>
			</section>

			{/* Termination */}
			<section style={{ marginBottom: "1.5rem" }}>
				<Text size="xl" weight={500} style={{ marginBottom: "1rem" }}>
					Termination
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					Cojourney may terminate or suspend your access to the Services for any
					reason, including inactivity or violation of these Terms.
				</Text>
			</section>

			{/* General Provisions */}
			<section style={{ marginBottom: "1.5rem" }}>
				<Text size="xl" weight={500} style={{ marginBottom: "1rem" }}>
					General Provisions
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					These Terms constitute the entire agreement between you and Cojourney
					and are governed by the laws of California, USA.
				</Text>
			</section>

			{/* Contact Information */}
			<section style={{ marginBottom: "1.5rem" }}>
				<Text size="xl" weight={500} style={{ marginBottom: "1rem" }}>
					Contact Information
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					Questions or comments about the Services can be directed to{" "}
					<a
						href="mailto:support@cojourney.chat"
						className="text-blue-600 hover:underline"
					>
						support@cojourney.chat
					</a>
					.
				</Text>
			</section>
			<section style={{ marginBottom: "1.5rem" }}>
				<Text size="xl" weight={500} style={{ marginBottom: "1rem" }}>
					Changes to Terms
				</Text>
				<Text style={{ marginBottom: "1rem" }}>
					We reserve the right to modify these Terms at any time. By continuing
					to use the Services, you agree to accept such modifications.
				</Text>
			</section>
		</Container>
	);
};

function Index({}: Props) {
	const [oldEnough, setOldEnough] = useState(false);
	const [agree, setAgree] = useState(false);
	const { user } = useGlobalStore();
	const session = useSession();
	const supabase = useSupabaseClient();
	const { classes } = useRootStyles();

	const completeAgreement = async () => {
		await supabase.from("users").update({ signed_tos: true }).eq("id", user.id);
		// Your completeAgreement function logic
	};

	return (
		<section style={{ marginBottom: "5rem" }}>
			<div className={classes.header}>
				<h3>COJOURNEY</h3>
			</div>
			<Box mt={"5rem"} component="div">
				<h1
					style={{
						fontSize: "1.75rem",
						fontWeight: "bold",
						textAlign: "center",
						marginTop: "1.5rem",
						marginBottom: "1.5rem",
					}}
				>
					Terms of Service
				</h1>
			</Box>

			<ScrollArea
				// size="md"
				p={"lg"}
				maw={"90%"}
				mx={"auto"}
				mah={"400px"}
				mb={"1rem"}
				style={{
					overflowY: "auto",
					padding: "15px",
					backgroundColor: "rgba(255, 255, 255, 0.1)",
					borderRadius: "10px",
				}}
			>
				<TermsOfService />
			</ScrollArea>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					padding: "0 2rem",
					margin: "2rem 0",
				}}
			>
				<Flex gap="md" justify="center" align="center" direction="row">
					<Text size="lg" style={{ color: "white", textAlign: "center" }}>
						I agree that I am at least 18 years of age.
					</Text>
					<Checkbox
						checked={oldEnough}
						onChange={() => {
							setOldEnough(!oldEnough);
						}}
						style={{ marginLeft: "0.5rem" }}
					/>
				</Flex>
				<Flex gap="md" justify="center" align="center" direction="row">
					<Text size="lg" style={{ color: "white", textAlign: "center" }}>
						I agree to the terms of service
					</Text>
					<Checkbox
						checked={agree}
						onChange={() => {
							setAgree(!agree);
						}}
						style={{ marginLeft: "0.5rem" }}
					/>
				</Flex>
				<Flex gap="md" justify="center" align="center" direction="row">
					<Button
						onClick={() => {
							completeAgreement();
						}}
						variant="outline"
						color="gray"
						disabled={!agree || !oldEnough}
						style={{
							alignSelf: "center",
							marginTop: "1rem",
							opacity: agree && oldEnough ? 1 : 0.5,
						}}
					>
						Complete
					</Button>
				</Flex>
			</div>
		</section>
	);
}

export default Index;
