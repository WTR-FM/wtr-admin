import React from 'react';
import styled, { createGlobalStyle, ThemeProvider } from 'styled-components';
import { useSelector } from 'react-redux';
import { theme } from '@adminjs/design-system';
import {
  Box,
  H5,
  H2,
  Label,
  Input,
  FormGroup,
  Button,
  Text,
  MessageBox,
  themeGet,
} from '@adminjs/design-system';
import { useTranslation, ReduxState } from 'adminjs';

const GlobalStyle = createGlobalStyle`
  html, body, #app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

const Wrapper = styled(Box)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

const StyledLogo = styled.img`
  max-width: 200px;
  margin: ${themeGet('space', 'md')} 0;
`;

export type LoginProps = {
  message?: string;
  action: string;
};

export const Login: React.FC<LoginProps> = (props) => {
  const { action, message } = props;
  const { translateButton, translateProperty } = useTranslation();
  const branding = useSelector((state: ReduxState) => state.branding);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Wrapper flex variant="grey">
        <Box bg="white" height="440px" flex boxShadow="login" width={[1, 2 / 3, 'auto']}>
          <Box
            bg="primary100"
            color="white"
            p="x3"
            width="380px"
            flexGrow={0}
            display={['none', 'none', 'block']}
            position="relative"
          >
            <H2 fontWeight="lighter">WELCOME</H2>
            <Text fontWeight="lighter" mt="default">
              Please login to manage contests, users, and platform settings
            </Text>
            <Text fontSize="sm" mt="md">
              Elevating music experiences through technology
            </Text>
            <H5 marginBottom="xxl">
              {branding.logo ? <StyledLogo src={branding.logo} alt={branding.companyName} /> : branding.companyName}
            </H5>
          </Box>
          <Box as="form" action={action} method="POST" p="x3" flexGrow={1} width={['100%', '100%', '480px']}>
            <H5 marginBottom="xxl"></H5>
            {message && (
              <MessageBox
                my="lg"
                message={message.split(' ').length > 1 ? message : message}
                variant="danger"
              />
            )}
            <FormGroup>
              <Label required>{translateProperty('email')}</Label>
              <Input name="email" placeholder={translateProperty('email')} />
            </FormGroup>
            <FormGroup>
              <Label required>{translateProperty('password')}</Label>
              <Input
                type="password"
                name="password"
                placeholder={translateProperty('password')}
                autoComplete="new-password"
              />
            </FormGroup>
            <Text mt="xl" textAlign="center">
              <Button variant="primary" style={{
    backgroundColor: '#1a23db',
    color: 'white',
    border: 'none',
  }}>{translateButton('login')}</Button>
            </Text>
          </Box>
        </Box>

        {/* Custom footer instead of MadeWithLove */}
        <Box mt="xxl">
          <Text fontSize="sm" textAlign="center" color="grey60">
            © 2025 WTR. All rights reserved.
          </Text>
        </Box>
      </Wrapper>
    </ThemeProvider>
  );
};

export default Login;
