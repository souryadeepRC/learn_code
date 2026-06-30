import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from 'react-email';

interface ResetPasswordEmailProps {
  resetLink: string;
}

export default function ResetPasswordEmail({
  resetLink,
}: ResetPasswordEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={heading}>Reset Your Password</Text>
            <Text style={text}>
              We received a request to reset the password for your account.
              Click the button below to set a new password.
            </Text>
            <Button style={button} href={resetLink} target="_blank">
              Reset Password
            </Button>
            <Text style={text}>
              If you didn't request a password reset, you can safely ignore this
              email. Your password will remain unchanged.
            </Text>
            <Text style={text}>This link is valid for 1 hour.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f4f9f6',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
};

const section = {
  backgroundColor: '#ffffff',
  padding: '24px',
  borderRadius: '8px',
  border: '1px solid #2b8a56',
};

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '600',
  color: '#091710',
  padding: '17px 0 0',
};

const text = {
  color: '#4a6658',
  fontSize: '15px',
  lineHeight: '1.4',
};

const button = {
  backgroundColor: '#0b6e4f',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '15px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  width: '100%',
  padding: '14px 0',
  marginTop: '20px',
  marginBottom: '20px',
};
