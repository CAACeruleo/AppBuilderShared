import {
	MantineSpacing,
	MantineThemeComponent,
	ScrollArea,
	ScrollAreaProps,
	Stack,
	StyleProp,
	useProps,
} from "@mantine/core";
import React from "react";

interface Props {
	children?: React.ReactNode;
}

interface StyleProps {
	/** padding */
	p: StyleProp<MantineSpacing>;
	/** Enable scrollable content */
	scrollable?: boolean;
	/** Maximum height before scrolling */
	maxHeight?: string | number;
	/** ScrollArea props */
	scrollAreaProps?: ScrollAreaProps;
}

const defaultStyleProps: StyleProps = {
	p: "xs",
	scrollable: false,
	maxHeight: "80vh",
};

type AppBuilderVerticalContainerThemePropsType = Partial<StyleProps>;

export function AppBuilderVerticalContainerThemeProps(
	props: AppBuilderVerticalContainerThemePropsType,
): MantineThemeComponent {
	return {
		defaultProps: props,
	};
}

/**
 * Vertical container for AppBuilder
 * @param props
 * @returns
 */
export default function AppBuilderVerticalContainer(
	props: Props & Partial<StyleProps>,
) {
	const {children, scrollable, maxHeight, scrollAreaProps, ...rest} =
		useProps("AppBuilderVerticalContainer", defaultStyleProps, props);

	const content = <Stack {...rest}>{children}</Stack>;

	if (scrollable) {
		return (
			<ScrollArea
				style={{
					height: "100%",
					maxHeight,
					flex: 1,
					minHeight: 0,
				}}
				scrollbarSize={8}
				scrollHideDelay={1000}
				{...scrollAreaProps}
			>
				{content}
			</ScrollArea>
		);
	}

	return content;
}
