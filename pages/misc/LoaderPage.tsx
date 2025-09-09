import {
    Center,
    Image,
    Loader,
    LoaderProps,
    MantineSize,
    MantineThemeComponent,
    useProps,
} from "@mantine/core";
import React from "react";

interface Props {
	/** error message */
	children?: React.ReactNode;
}

interface StyleProps {
    /**
     * Type of the loader
     * @see https://mantine.dev/core/loader/?t=props
     */
    type: string;
    /**
     * Size of the loader
     * @see https://mantine.dev/core/loader/?t=props
     */
    size: number | MantineSize;
    /**
     * Show spinner instead of logo
     */
    showSpinner?: boolean;
    /**
     * Milliseconds per full rotation
     */
    spinDuration?: number;
}

const defaultStyleProps: StyleProps = {
    type: "oval",
    size: "md",
    showSpinner: false,
    spinDuration: 1600,
};

type LoaderPageThemePropsType = Partial<StyleProps>;

export function LoaderPageThemeProps(
	props: LoaderPageThemePropsType,
): MantineThemeComponent {
	return {
		defaultProps: props,
	};
}

/**
 * Full screen alert page
 *
 * @returns
 */
export default function LoaderPage(props: Props & LoaderProps & { logoSrc?: string }) {
    const {children, logoSrc = "/loading-logo.svg", ...rest} = props as any;
    const restDefault = useProps("LoaderPage", defaultStyleProps, rest) as StyleProps & LoaderProps;

    // Fallback: allow forcing original spinner
    if (restDefault.showSpinner) {
        return (
            <Center w="100vw" h="100vh">
                <Loader {...restDefault}>{children}</Loader>
            </Center>
        );
    }

    // Size mapping for the logo image
    const sizeMap: Record<string, number> = { xs: 64, sm: 96, md: 128, lg: 176, xl: 224 };
    const px = typeof restDefault.size === "number" ? restDefault.size : (sizeMap[restDefault.size ?? "md"] ?? 128);

    // 3D horizontal rotation using CSS keyframes
    const spinAnimationStyle = {
        transformStyle: "preserve-3d" as const,
        animation: `spin-y ${restDefault.spinDuration}ms linear infinite`,
    };

    // Inject CSS keyframes
    React.useEffect(() => {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = `
            @keyframes spin-y {
                0% { transform: rotateY(0deg); }
                100% { transform: rotateY(360deg); }
            }
        `;
        document.head.appendChild(styleSheet);
        return () => {
            document.head.removeChild(styleSheet);
        };
    }, []);

    return (
        <Center w="100vw" h="100vh" style={{ perspective: 900 }}>
            <Image
                src={logoSrc}
                alt="Loading"
                w={px}
                h={px}
                fit="contain"
                style={spinAnimationStyle}
            />
            {children}
        </Center>
    );
}
