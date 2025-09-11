import AppBuilderContainerWrapper from "@AppBuilderShared/pages/templates/AppBuilderContainerWrapper";
import FloatingWidget from "@AppBuilderShared/components/shapediver/ui/FloatingWidget";
import { IAppBuilderTemplatePageProps } from "@AppBuilderShared/types/pages/appbuildertemplates";
import { createGridLayout } from "@AppBuilderShared/utils/misc/layout";
import { MantineThemeComponent, useProps } from "@mantine/core";
import React, { useEffect, useState } from "react";
import classes from "./AppBuilderOverlayGridTemplatePage.module.css";

export interface OverlayGridTemplateStyleProps {
    /** Global widget background color with transparency */
    widgetBackground?: string;
    /** Global widget shadow */
    widgetShadow?: string;
    /** Global widget border radius */
    widgetRadius?: string;
    /** Enable collapse functionality for all widgets */
    enableCollapse?: boolean;
    /** Enable close functionality for all widgets */
    enableClose?: boolean;
    /** Enable backdrop blur effect */
    backdropBlur?: boolean;
    /** Widget padding */
    widgetPadding?: string;
    /** Auto-hide widgets on small screens */
    responsiveHide?: boolean;
    /** Number of grid columns */
    columns?: number;
    /** Number of grid rows */
    rows?: number;
    /** Number of columns for left container */
    leftColumns?: number;
    /** Number of columns for right container */
    rightColumns?: number;
    /** Number of rows for top container */
    topRows?: number;
    /** Number of rows for bottom container */
    bottomRows?: number;
    /** Shall the top container use the full width? */
    topFullWidth?: boolean;
    /** Shall the bottom container use the full width? */
    bottomFullWidth?: boolean;
    /** Gap between grid areas */
    gridGap?: string;
}

const defaultStyleProps: OverlayGridTemplateStyleProps = {
    widgetBackground: "rgba(255, 255, 255, 0.9)",
    widgetShadow: "md",
    widgetRadius: "lg",
    enableCollapse: false,
    enableClose: false,
    backdropBlur: false,
    widgetPadding: "md",
    responsiveHide: false,
    columns: 4,
    rows: 4,
    leftColumns: 1,
    rightColumns: 1,
    topRows: 1,
    bottomRows: 1,
    topFullWidth: false,
    bottomFullWidth: false,
    gridGap: "20px",
};

type AppBuilderOverlayGridTemplatePageThemePropsType = Partial<OverlayGridTemplateStyleProps>;

export function AppBuilderOverlayGridTemplatePageThemeProps(
    props: AppBuilderOverlayGridTemplatePageThemePropsType,
): MantineThemeComponent {
    return {
        defaultProps: props,
    };
}

/**
 * Grid-based overlay template page for AppBuilder with full-screen 3D viewer and grid-positioned floating widgets
 */
export default function AppBuilderOverlayGridTemplatePage(
    props: IAppBuilderTemplatePageProps & Partial<OverlayGridTemplateStyleProps>,
) {
    const {
        top = undefined,
        left = undefined,
        children = undefined,
        right = undefined,
        bottom = undefined,
    } = props;

    // Style properties
    const {
        widgetBackground,
        widgetShadow,
        widgetRadius,
        enableCollapse,
        enableClose,
        backdropBlur,
        widgetPadding,
        responsiveHide,
        columns,
        rows,
        leftColumns,
        rightColumns,
        topRows,
        bottomRows,
        topFullWidth,
        bottomFullWidth,
        gridGap,
    } = useProps("AppBuilderOverlayGridTemplatePage", defaultStyleProps, props);

    const [gridStyle, setGridStyle] = useState<React.CSSProperties>({
        gap: gridGap,
        ...createGridLayout({
            hasTop: !!top,
            hasLeft: !!left,
            hasRight: !!right,
            hasBottom: !!bottom,
            rows,
            columns,
            topRows,
            leftColumns,
            rightColumns,
            bottomRows,
            topFullWidth,
            bottomFullWidth,
        }),
    });

    useEffect(() => {
        setGridStyle({
            gap: gridGap,
            ...createGridLayout({
                hasTop: !!top,
                hasLeft: !!left,
                hasRight: !!right,
                hasBottom: !!bottom,
                rows,
                columns,
                topRows,
                leftColumns,
                rightColumns,
                bottomRows,
                topFullWidth,
                bottomFullWidth,
            }),
        });
    }, [
        left,
        right,
        bottom,
        top,
        columns,
        rows,
        leftColumns,
        rightColumns,
        topRows,
        bottomRows,
        topFullWidth,
        bottomFullWidth,
        gridGap,
    ]);

    // Widget props to pass to all floating widgets
    const commonWidgetProps = {
        background: widgetBackground,
        shadow: widgetShadow,
        radius: widgetRadius,
        enableCollapse,
        enableClose,
        backdropBlur,
        padding: widgetPadding,
        responsiveHide,
    };

    return (
        <div className={classes.overlayGridTemplatePage}>
            {/* Full-screen 3D viewer container */}
            <section className={classes.overlayGridTemplateMain}>
                {children || <></>}
            </section>

            {/* Grid overlay for widgets */}
            <div 
                className={classes.overlayGridContainer}
                style={gridStyle}
            >
                {/* Top floating widget */}
                {top && (
                    <section className={classes.overlayGridTop}>
                        <FloatingWidget
                            {...commonWidgetProps}
                            title="Top Panel"
                            className={classes.gridWidget}
                        >
                            <AppBuilderContainerWrapper name="top">
                                {top.node}
                            </AppBuilderContainerWrapper>
                        </FloatingWidget>
                    </section>
                )}

                {/* Left floating widget */}
                {left && (
                    <section className={classes.overlayGridLeft}>
                        <FloatingWidget
                            {...commonWidgetProps}
                            title="Left Panel"
                            className={classes.gridWidget}
                        >
                            <AppBuilderContainerWrapper name="left">
                                {left.node}
                            </AppBuilderContainerWrapper>
                        </FloatingWidget>
                    </section>
                )}

                {/* Right floating widget */}
                {right && (
                    <section className={classes.overlayGridRight}>
                        <FloatingWidget
                            {...commonWidgetProps}
                            title="Right Panel"
                            className={classes.gridWidget}
                        >
                            <AppBuilderContainerWrapper name="right">
                                {right.node}
                            </AppBuilderContainerWrapper>
                        </FloatingWidget>
                    </section>
                )}

                {/* Bottom floating widget */}
                {bottom && (
                    <section className={classes.overlayGridBottom}>
                        <FloatingWidget
                            {...commonWidgetProps}
                            title="Bottom Panel"
                            className={classes.gridWidget}
                        >
                            <AppBuilderContainerWrapper name="bottom">
                                {bottom.node}
                            </AppBuilderContainerWrapper>
                        </FloatingWidget>
                    </section>
                )}
            </div>
        </div>
    );
}