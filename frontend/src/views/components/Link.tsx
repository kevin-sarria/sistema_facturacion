import { CSSProperties, useEffect, useState } from "react";
import { LinkProps, LinkStyleInterface } from "../../interfaces";
import { Link as ReactRouterLink, useLocation } from "react-router-dom";
import { Link as ChakraLink } from "@chakra-ui/react";

const activeLinkPropertysDefect: LinkStyleInterface = {
  backgroundColor: 'blue.400',
  color: 'white',
  "&:hover": {
    backgroundColor: 'none',
    textDecoration: 'none'
  }
}

export const Link = ({ to, children, sx, style, isActiveLink, stylesActiveLink }: LinkProps) => {
  
  const { pathname } = useLocation();
  
  const styles = (): CSSProperties => {
  
    if(isActiveLink && to === pathname && !stylesActiveLink) {
      return {
        ...sx,
        ...style,
        ...activeLinkPropertysDefect
      }
    } else if(isActiveLink && to === pathname && stylesActiveLink ) {
      return {
        ...sx,
        ...style,
        ...stylesActiveLink
      }
    }
  
    return {
      ...sx,
      ...style
    }
  }

  return (
    <ChakraLink
        as={ReactRouterLink}
        to={to}
        sx={{ ...styles() }}
    >
        { children }
    </ChakraLink>
  )
}
