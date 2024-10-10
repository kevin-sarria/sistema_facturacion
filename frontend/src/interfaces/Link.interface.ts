import { CSSProperties, ReactNode } from "react";

export interface LinkStyleInterface extends CSSProperties {
    "&:hover"?: CSSProperties;
}

export interface LinkProps {
    children?: ReactNode;
    to: string;
    sx?: CSSProperties;
    style?: CSSProperties;
    isActiveLink?: boolean;
    stylesActiveLink?: LinkStyleInterface;
}