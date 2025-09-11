import AppBuilderWidgetsComponent from "@AppBuilderShared/components/shapediver/appbuilder/widgets/AppBuilderWidgetsComponent";
import TabsComponent, {
	ITabsComponentProps,
} from "@AppBuilderShared/components/ui/TabsComponent";
import {IAppBuilderTab} from "@AppBuilderShared/types/shapediver/appbuilder";
import {useProps} from "@mantine/core";
import React, {useMemo} from "react";

interface Props {
	/**
	 * Default session namespace to use for parameter and export references that do
	 * not specify a session namespace.
	 */
	namespace: string;
	/** The tabs to display. */
	tabs: IAppBuilderTab[] | undefined;
}

export default function AppBuilderTabsComponent({namespace, tabs}: Props) {
	if (!tabs || tabs.length === 0) {
		return <></>;
	}

	// Get theme props for TabsComponent
	const themeProps = useProps("TabsComponent", {}, {});

	const tabProps: ITabsComponentProps = useMemo(() => {
		return {
			defaultValue: tabs[0].name,
			tabs: tabs.map((tab) => {
				return {
					name: tab.name,
					icon: tab.icon,
					tooltip: tab.tooltip,
					children: [
						<AppBuilderWidgetsComponent
							key={0}
							namespace={namespace}
							widgets={tab.widgets}
						/>,
					],
				};
			}),
			...themeProps, // Apply theme properties
		};
	}, [namespace, tabs, themeProps]);

	return <TabsComponent {...tabProps} />;
}
