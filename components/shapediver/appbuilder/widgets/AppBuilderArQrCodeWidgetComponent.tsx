import {AppBuilderContainerContext} from "@AppBuilderShared/context/AppBuilderContext";
import {useViewportId} from "@AppBuilderShared/hooks/shapediver/viewer/useViewportId";
import {useShapeDiverStoreViewport} from "@AppBuilderShared/store/useShapeDiverStoreViewport";
import {IAppBuilderWidgetPropsArQrCode} from "@AppBuilderShared/types/shapediver/appbuilder";
import {
	ActionIcon,
	Button,
	Group,
	Loader,
	MantineStyleProp,
	MantineThemeComponent,
	Paper,
	PaperProps,
	Text,
	Title,
	useProps,
} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import React, {useCallback, useContext, useEffect, useState} from "react";
import {useShallow} from "zustand/react/shallow";
import Icon from "@AppBuilderShared/components/ui/Icon";

type StyleProps = PaperProps;

const defaultStyleProps: Partial<StyleProps> = {
	p: "md",
	shadow: "sm",
	radius: "md",
};

type AppBuilderArQrCodeWidgetThemePropsType = Partial<StyleProps>;

export function AppBuilderArQrCodeWidgetThemeProps(
	props: AppBuilderArQrCodeWidgetThemePropsType,
): MantineThemeComponent {
	return {
		defaultProps: props,
	};
}

interface AppBuilderArQrCodeWidgetComponentProps
	extends IAppBuilderWidgetPropsArQrCode,
		AppBuilderArQrCodeWidgetThemePropsType {
	namespace: string;
}

export default function AppBuilderArQrCodeWidgetComponent(
	props: AppBuilderArQrCodeWidgetComponentProps,
) {
	const {
		namespace,
		size = 200,
		title = "View in AR",
		instructions = "Scan this QR code with your phone to view in AR",
		hideOnMobile = true,
		...rest
	} = props;

	const themeProps = useProps(
		"AppBuilderArQrCodeWidgetComponent",
		defaultStyleProps,
		rest,
	);

	const context = useContext(AppBuilderContainerContext);
	const {viewportId: defaultViewportId} = useViewportId();
	const viewportId = namespace ? `${namespace}#${defaultViewportId}` : defaultViewportId;
	
	const viewport = useShapeDiverStoreViewport(
		useShallow((state) => state.viewports[viewportId]),
	);

	const [arLink, setArLink] = useState<string>("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string>("");
	const [isDismissed, setIsDismissed] = useState(false);

	// Mobile detection
	const isMobile = useMediaQuery("(max-width: 768px)");

	// Check localStorage for dismissal state
	useEffect(() => {
		const dismissKey = `arQrDismissed:${namespace || 'default'}`;
		const dismissed = localStorage.getItem(dismissKey) === 'true';
		setIsDismissed(dismissed);
	}, [namespace]);

	// Generate QR code when component mounts
	const generateQrCode = useCallback(async () => {
		if (!viewport) return;
		
		setIsLoading(true);
		setError("");
		
		try {
			const link = await viewport.createArSessionLink();
			setArLink(link);
		} catch (e: any) {
			console.error("Error generating AR QR code:", e);
			setError("Could not generate AR code");
		} finally {
			setIsLoading(false);
		}
	}, [viewport]);

	// Auto-generate QR code on mount if AR is available
	useEffect(() => {
		if (viewport?.enableAR && !isDismissed) {
			generateQrCode();
		}
	}, [viewport?.enableAR, isDismissed, generateQrCode]);

	// Copy link to clipboard
	const copyLink = useCallback(async () => {
		if (!arLink) return;
		
		try {
			await navigator.clipboard.writeText(arLink);
			// Could add a toast notification here
		} catch (e) {
			console.error("Failed to copy link:", e);
		}
	}, [arLink]);

	// Dismiss widget and persist in localStorage
	const dismissWidget = useCallback(() => {
		const dismissKey = `arQrDismissed:${namespace || 'default'}`;
		localStorage.setItem(dismissKey, 'true');
		setIsDismissed(true);
	}, [namespace]);

	// Hide on mobile if configured
	if (hideOnMobile && isMobile) {
		return null;
	}

	// Hide if dismissed
	if (isDismissed) {
		return null;
	}

	// AR not available state
	if (!viewport?.enableAR) {
		return (
			<Paper {...themeProps}>
				<Group justify="space-between" align="center">
					<Text size="sm" c="dimmed">
						AR not available for this model
					</Text>
					<ActionIcon
						variant="subtle"
						size="sm"
						onClick={dismissWidget}
						aria-label="Dismiss AR widget"
					>
						<Icon iconType="tabler:x" />
					</ActionIcon>
				</Group>
			</Paper>
		);
	}

	const styleProps: MantineStyleProp = {};
	if (context.orientation === "horizontal") {
		styleProps.height = "100%";
	} else if (context.orientation === "vertical") {
		styleProps.overflowX = "auto";
	}

	return (
		<Paper {...themeProps} style={styleProps}>
			<Group justify="space-between" align="flex-start" mb="sm">
				<Title order={4}>{title}</Title>
				<ActionIcon
					variant="subtle"
					size="sm"
					onClick={dismissWidget}
					aria-label="Dismiss AR widget"
				>
					<Icon iconType="tabler:x" />
				</ActionIcon>
			</Group>

			{error ? (
				<div role="alert" aria-live="polite">
					<Text c="red" mb="sm">
						{error}
					</Text>
					<Button 
						variant="light" 
						size="sm" 
						onClick={generateQrCode}
						disabled={isLoading}
					>
						Retry
					</Button>
				</div>
			) : (
				<>
					<Text size="sm" c="dimmed" mb="md">
						{instructions}
					</Text>

					{isLoading ? (
						<Group justify="center" p="lg">
							<Loader size="sm" />
							<Text size="sm" aria-live="polite">
								Generating AR code...
							</Text>
						</Group>
					) : arLink ? (
						<>
							<Group justify="center" mb="md">
								<img
									src={arLink}
									width={size}
									height={size}
									alt="AR QR code"
									style={{ border: "1px solid #e0e0e0", borderRadius: "8px" }}
								/>
							</Group>

							<Group justify="center" gap="xs">
								<Button
									variant="light"
									size="xs"
									leftSection={<Icon iconType="tabler:copy" />}
									onClick={copyLink}
									aria-label="Copy AR link"
								>
									Copy link
								</Button>
								<Button
									variant="light"
									size="xs"
									leftSection={<Icon iconType="tabler:refresh" />}
									onClick={generateQrCode}
									disabled={isLoading}
									aria-label="Refresh QR code"
								>
									Refresh
								</Button>
							</Group>
						</>
					) : null}
				</>
			)}
		</Paper>
	);
}