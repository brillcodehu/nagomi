import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface BookingCancellationProps {
  customerName: string;
  className: string;
  classDate: string;
  startTime: string;
  refundInfo: string;
}

export default function BookingCancellation({
  customerName,
  className,
  classDate,
  startTime,
  refundInfo,
}: BookingCancellationProps) {
  return (
    <Html>
      <Head />
      <Preview>Foglalásod lemondva – {className}</Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Nagomi Pilates</Heading>
          <Hr style={hr} />

          <Text style={greeting}>Kedves {customerName},</Text>

          <Text style={paragraph}>
            Az alábbi foglalásod sikeresen lemondtuk.
          </Text>

          <Section style={box}>
            <Text style={label}>Lemondott óra</Text>
            <Text style={value}>
              {className} – {classDate} {startTime}
            </Text>

            <Text style={label}>Visszatérítés</Text>
            <Text style={value}>{refundInfo}</Text>
          </Section>

          <Text style={paragraph}>
            Ha kérdésed van, keresd fel stúdiónkat az info@nagomipilates.hu
            email címen.
          </Text>

          <Hr style={hr} />
          <Text style={footer}>
            Nagomi Pilates Studio | Debrecen-Józsa, Deák Ferenc utca 2.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const body = {
  backgroundColor: "#F5F0E8",
  fontFamily: "Inter, -apple-system, BlinkMacSystemFont, sans-serif",
};

const container = {
  maxWidth: "520px",
  margin: "0 auto",
  padding: "40px 24px",
};

const heading = {
  fontSize: "20px",
  fontWeight: "600" as const,
  color: "#2B2A20",
  letterSpacing: "0.1em",
  textAlign: "center" as const,
  margin: "0 0 24px",
};

const hr = { borderColor: "#9A836330", margin: "24px 0" };

const greeting = {
  fontSize: "15px",
  color: "#2B2A20",
  margin: "0 0 8px",
};

const paragraph = {
  fontSize: "14px",
  lineHeight: "1.6",
  color: "#2B2A20CC",
  margin: "0 0 24px",
};

const box = {
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  padding: "20px 24px",
  margin: "0 0 24px",
};

const label = {
  fontSize: "10px",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "#9A8363",
  fontWeight: "600" as const,
  margin: "12px 0 2px",
};

const value = {
  fontSize: "14px",
  color: "#2B2A20",
  fontWeight: "500" as const,
  margin: "0",
  lineHeight: "1.4",
};

const footer = {
  fontSize: "11px",
  color: "#2B2A2060",
  textAlign: "center" as const,
  margin: "0",
};
