import AppBuilderContainerWrapper from "@AppBuilderShared/pages/templates/AppBuilderContainerWrapper";
import FloatingWidget from "@AppBuilderShared/components/shapediver/ui/FloatingWidget";
import ViewportOverlayWrapper from "@AppBuilderShared/components/shapediver/viewport/ViewportOverlayWrapper";
import { OverlayPosition } from "@AppBuilderShared/components/shapediver/ui/OverlayWrapper";
import { IAppBuilderTemplatePageProps } from "@AppBuilderShared/types/pages/appbuildertemplates";
import { MantineThemeComponent, useProps } from "@mantine/core";
import React from "react";
import classes from "./AppBuilderOverlayTemplatePage.module.css";

export interface OverlayTemplateStyleProps {
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
    /** Maximum widget width */
    widgetMaxWidth?: string | number;
    /** Maximum widget height */
    widgetMaxHeight?: string | number;
    /** Auto-hide widgets on small screens */
    responsiveHide?: boolean;
    /** Default positions for each container */
    topPosition?: string;
    leftPosition?: string;
    rightPosition?: string;
    bottomPosition?: string;
    /** Offsets from edges */
    topOffset?: string;
    leftOffset?: string;
    rightOffset?: string;
    bottomOffset?: string;
}

const defaultStyleProps: OverlayTemplateStyleProps = {
    widgetBackground: "rgba(255, 255, 255, 0.9)",
    widgetShadow: "md",
    widgetRadius: "lg",
    enableCollapse: false,
    enableClose: false,
    backdropBlur: false,
    widgetPadding: "md",
    widgetMaxWidth: "400px",
    widgetMaxHeight: "600px",
    responsiveHide: false,
    topPosition: OverlayPosition.TOP_MIDDLE,
    leftPosition: OverlayPosition.TOP_LEFT,
    rightPosition: OverlayPosition.TOP_RIGHT,
    bottomPosition: OverlayPosition.BOTTOM_MIDDLE,
    topOffset: "20px",
    leftOffset: "20px",
    rightOffset: "20px",
    bottomOffset: "20px",
};

type AppBuilderOverlayTemplatePageThemePropsType = Partial<OverlayTemplateStyleProps>;

export function AppBuilderOverlayTemplatePageThemeProps(
    props: AppBuilderOverlayTemplatePageThemePropsType,
): MantineThemeComponent {
    return {
        defaultProps: props,
    };
}

/**
 * Overlay template page for AppBuilder with full-screen 3D viewer and floating widgets
 */
export default function AppBuilderOverlayTemplatePage(
    props: IAppBuilderTemplatePageProps & Partial<OverlayTemplateStyleProps>,
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
        widgetMaxWidth,
        widgetMaxHeight,
        responsiveHide,
        topPosition,
        leftPosition,
        rightPosition,
        bottomPosition,
        topOffset,
        leftOffset,
        rightOffset,
        bottomOffset,
    } = useProps("AppBuilderOverlayTemplatePage", defaultStyleProps, props);

    // Widget props to pass to all floating widgets
    const commonWidgetProps = {
        background: widgetBackground,
        shadow: widgetShadow,
        radius: widgetRadius,
        enableCollapse,
        enableClose,
        backdropBlur,
        padding: widgetPadding,
        maxWidth: widgetMaxWidth,
        maxHeight: widgetMaxHeight,
        responsiveHide,
    };

    return (
        <div className={classes.overlayTemplatePage}>
            {/* Full-screen 3D viewer container */}
            <section className={classes.overlayTemplateMain}>
                {children || <></>}
            </section>

            {/* Top floating widget */}
            {top && (
                <ViewportOverlayWrapper
                    position={topPosition as any}
                    offset={topOffset}
                >
                    <FloatingWidget
                        {...commonWidgetProps}
                        title="Top Panel"
                    >
                        <AppBuilderContainerWrapper name="top">
                            {top.node}
                        </AppBuilderContainerWrapper>
                    </FloatingWidget>
                </ViewportOverlayWrapper>
            )}

            {/* Left floating widget */}
            {left && (
                <ViewportOverlayWrapper
                    position={leftPosition as any}
                    offset={leftOffset}
                >
                    <FloatingWidget
                        {...commonWidgetProps}
                        title="Left Panel"
                    >
                        <AppBuilderContainerWrapper name="left">
                            {left.node}
                        </AppBuilderContainerWrapper>
                    </FloatingWidget>
                </ViewportOverlayWrapper>
            )}

            {/* Right floating widget */}
            {right && (
                <ViewportOverlayWrapper
                    position={rightPosition as any}
                    offset={rightOffset}
                >
                    <FloatingWidget
                        {...commonWidgetProps}
                        title="Right Panel"
                    >
                        <AppBuilderContainerWrapper name="right">
                            {right.node}
                        </AppBuilderContainerWrapper>
                    </FloatingWidget>
                </ViewportOverlayWrapper>
            )}

            {/* Bottom floating widget */}
            {bottom && (
                <ViewportOverlayWrapper
                    position={bottomPosition as any}
                    offset={bottomOffset}
                >
                    <FloatingWidget
                        {...commonWidgetProps}
                        title="Bottom Panel"
                    >
                        <AppBuilderContainerWrapper name="bottom">
                            {bottom.node}
                        </AppBuilderContainerWrapper>
                    </FloatingWidget>
                </ViewportOverlayWrapper>
            )}
        </div>
    );
}