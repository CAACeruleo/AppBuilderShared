import Icon from "@AppBuilderShared/components/ui/Icon";
import {
	ActionIcon,
	Collapse,
	MantineThemeComponent,
	Paper,
	useProps,
} from "@mantine/core";
import React, {useMemo, useState} from "react";
import classes from "./FloatingWidget.module.css";

export interface FloatingWidgetStyleProps {
	/** Background color with transparency support */
	background?: string;
	/** Drop shadow intensity */
	shadow?: string;
	/** Border radius */
	radius?: string;
	/** Enable collapse/minimize functionality */
	enableCollapse?: boolean;
	/** Enable close functionality */
	enableClose?: boolean;
	/** Enable backdrop blur effect */
	backdropBlur?: boolean;
	/** Padding inside the widget */
	padding?: string;
	/** Maximum width */
	maxWidth?: string | number;
	/** Maximum height */
	maxHeight?: string | number;
	/** Z-index for layering */
	zIndex?: number;
	/** Auto-hide on small screens */
	responsiveHide?: boolean;
}

interface FloatingWidgetProps extends Partial<FloatingWidgetStyleProps> {
	/** Widget content */
	children?: React.ReactNode;
	/** Widget title (shown in header if collapse enabled) */
	title?: string;
	/** Initial collapsed state */
	defaultCollapsed?: boolean;
	/** Callback when widget is closed */
	onClose?: () => void;
	/** Callback when collapse state changes */
	onCollapseChange?: (collapsed: boolean) => void;
	/** Custom class name */
	className?: string;
}

const defaultStyleProps: FloatingWidgetStyleProps = {
	background: "rgba(255, 255, 255, 0.9)",
	shadow: "md",
	radius: "lg",
	enableCollapse: false,
	enableClose: false,
	backdropBlur: false,
	padding: "md",
	maxWidth: "400px",
	maxHeight: "600px",
	zIndex: 100,
	responsiveHide: false,
};

export function FloatingWidgetThemeProps(
	props: Partial<FloatingWidgetStyleProps>,
): MantineThemeComponent {
	return {
		defaultProps: props,
	};
}

export default function FloatingWidget(props: FloatingWidgetProps) {
	const {
		children,
		title,
		defaultCollapsed = false,
		onClose,
		onCollapseChange,
		className,
		...rest
	} = props;

	const {
		background,
		shadow,
		radius,
		enableCollapse,
		enableClose,
		backdropBlur,
		padding,
		maxWidth,
		maxHeight,
		zIndex,
		responsiveHide,
	} = useProps("FloatingWidget", defaultStyleProps, rest);

	const [collapsed, setCollapsed] = useState(defaultCollapsed);

	const handleCollapseToggle = () => {
		const newCollapsed = !collapsed;
		setCollapsed(newCollapsed);
		onCollapseChange?.(newCollapsed);
	};

	const handleClose = () => {
		onClose?.();
	};

	const containerStyle: React.CSSProperties = useMemo(
		() => ({
			backgroundColor: background,
			backdropFilter: backdropBlur ? "blur(8px)" : undefined,
			maxWidth,
			maxHeight: collapsed ? "auto" : maxHeight,
			zIndex,
			display: "flex",
			flexDirection: "column",
		}),
		[background, backdropBlur, maxWidth, maxHeight, collapsed, zIndex],
	);

	const showHeader = enableCollapse || enableClose || title;

	const collapseStyle = useMemo(
		() =>
			collapsed
				? {}
				: {
						flex: 1,
						display: "flex",
						flexDirection: "column" as const,
					},
		[collapsed],
	);

	const contentStyle = useMemo(
		() => ({
			padding: showHeader
				? padding
				: `0 ${padding} ${padding} ${padding}`,
			flex: 1,
			display: "flex",
			flexDirection: "column" as const,
			minHeight: 0,
		}),
		[showHeader, padding],
	);

	return (
		<Paper
			className={`${classes.floatingWidget} ${responsiveHide ? classes.responsiveHide : ""} ${className || ""}`}
			shadow={shadow}
			radius={radius}
			style={containerStyle}
			withBorder
		>
			{showHeader && (
				<div className={classes.floatingWidgetHeader}>
					{title && (
						<div className={classes.floatingWidgetTitle}>
							{title}
						</div>
					)}
					<div className={classes.floatingWidgetControls}>
						{enableCollapse && (
							<ActionIcon
								variant="subtle"
								size="sm"
								onClick={handleCollapseToggle}
								aria-label={
									collapsed
										? "Expand widget"
										: "Collapse widget"
								}
							>
								<Icon
									iconType={
										collapsed
											? "tabler:plus"
											: "tabler:minus"
									}
									size={16}
								/>
							</ActionIcon>
						)}
						{enableClose && (
							<ActionIcon
								variant="subtle"
								size="sm"
								onClick={handleClose}
								aria-label="Close widget"
							>
								<Icon iconType="tabler:x" size={16} />
							</ActionIcon>
						)}
					</div>
				</div>
			)}

			<Collapse in={!collapsed} style={collapseStyle}>
				<div
					className={classes.floatingWidgetContent}
					style={contentStyle}
				>
					{children}
				</div>
			</Collapse>
		</Paper>
	);
}
