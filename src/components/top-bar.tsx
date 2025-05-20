import { Box, H2, H5 } from "@adminjs/design-system";
import { CurrentAdmin } from "adminjs";
import React, { FC } from "react";
import LogoutButton from "./logout-button.js";

/**
 * Header element with custom logout button
 */
type Props = {
  /** Currently logged in admin */
  currentAdmin?: CurrentAdmin;
};

const TopBar: FC<Props> = (props) => {
  const { currentAdmin } = props;

  return (
    <Box
      height="navbarHeight"
      flex
      alignItems="center"
      colorVariant="white"
      py="sm"
      px="xxl"
    >
      <Box flex flexGrow={1}>
        <H2 color="grey100">WTR Admin Panel</H2>
      </Box>
      <Box flex alignItems="center">
        {currentAdmin && (
          <Box>
            <H5 mr="default">{currentAdmin.email}</H5>
          </Box>
        )}
        <LogoutButton />
      </Box>
    </Box>
  );
};

export default TopBar;
