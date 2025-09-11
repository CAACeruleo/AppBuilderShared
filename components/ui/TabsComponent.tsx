import Icon, {IconType} from "@AppBuilderShared/components/ui/Icon";
import TooltipWrapper from "@AppBuilderShared/components/ui/TooltipWrapper";
import {
	BoxProps,
	ScrollArea,
	ScrollAreaProps,
	Stack,
	Tabs,
} from "@mantine/core";
import React, {ReactElement, useEffect, useMemo, useRef, useState} from "react";

interface PropsTab extends BoxProps {
	/** Name (value) of tab. */
	name: string;
	/** Optional icon of tab. */
	icon?: IconType;
	/** Children of tab. */
	children: ReactElement[];
	/** Optional tooltip to show when hovering the tab. */
	tooltip?: string;
}

export interface ITabsComponentProps extends BoxProps {
	/** Value of default tab. */
	defaultValue: string;
	/** The tabs. */
	tabs: PropsTab[];
	/** Enable vertical scrolling in tab panels */
	scrollableContent?: boolean;
	/** Maximum height for tab content before scrolling */
	contentMaxHeight?: string | number;
	/** Fill available height in container and scroll when content exceeds */
	fillAvailableHeight?: boolean;
	/** Scroll area styling options */
	scrollAreaProps?: ScrollAreaProps;
}

export default function TabsComponent({
	defaultValue,
	tabs,
	scrollableContent = false,
	contentMaxHeight = "400px",
	fillAvailableHeight = false,
	scrollAreaProps,
	...rest
}: ITabsComponentProps) {
	const [activeTab, setActiveTab] = useState<string | null>(defaultValue);
	// keepMounted=false prop unmount the tab when it is not active
	const activeTabsHistory = useRef(new Set<string>([defaultValue]));
	const tabNames = tabs.map((tab) => tab.name);
	const handleActiveTabChange = (value: string | null) => {
		setActiveTab(value);
		if (value) {
			activeTabsHistory.current.add(value);
		}
	};

	useEffect(() => {
		if (!activeTab || !tabNames.includes(activeTab)) {
			if (tabNames.includes(defaultValue)) {
				setActiveTab(defaultValue);
			} else {
				setActiveTab(tabNames[0]);
			}
		}
	}, [tabNames.join(""), defaultValue]);

	// Memoized styles for performance
	const tabsStyle = useMemo(
		() =>
			fillAvailableHeight
				? {
						display: "flex",
						flexDirection: "column" as const,
						height: "100%",
						...rest.style,
					}
				: rest.style,
		[fillAvailableHeight, rest.style],
	);

	const tabsPanelStyle = useMemo(
		() =>
			fillAvailableHeight
				? {
						flex: 1,
						display: "flex",
						flexDirection: "column" as const,
						minHeight: 0, // Important for flex children to shrink
					}
				: {},
		[fillAvailableHeight],
	);

	const scrollAreaStyle = useMemo(
		() =>
			fillAvailableHeight
				? {
						flex: 1,
						minHeight: 0,
						height: "100%",
					}
				: {},
		[fillAvailableHeight],
	);

	return tabs.length === 0 ? (
		<></>
	) : (
		<Tabs
			{...rest}
			value={activeTab}
			onChange={handleActiveTabChange}
			style={tabsStyle}
		>
			<Tabs.List>
				{tabs.map((tab, index) => {
					const tabsTab = (
						<Tabs.Tab
							key={index}
							value={tab.name}
							leftSection={
								tab.icon ? (
									<Icon iconType={tab.icon} />
								) : undefined
							}
						>
							{tab.name}
						</Tabs.Tab>
					);

					return tab.tooltip ? (
						<TooltipWrapper key={index} label={tab.tooltip}>
							{tabsTab}
						</TooltipWrapper>
					) : (
						tabsTab
					);
				})}
			</Tabs.List>
			{tabs.map((tab, index) => {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const {name, icon, children, ...rest} = tab;

				const content = <Stack>{children}</Stack>;

				return (
					<Tabs.Panel
						{...rest}
						key={index}
						value={name}
						style={tabsPanelStyle}
					>
						{activeTabsHistory.current.has(name) &&
							(scrollableContent ? (
								<ScrollArea
									h={
										fillAvailableHeight
											? "100%"
											: contentMaxHeight
									}
									scrollbarSize={8}
									scrollHideDelay={1000}
									style={scrollAreaStyle}
									{...scrollAreaProps}
								>
									{content}
								</ScrollArea>
							) : (
								content
							))}
					</Tabs.Panel>
				);
			})}
		</Tabs>
	);
}
