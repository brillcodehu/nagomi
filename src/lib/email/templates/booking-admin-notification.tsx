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

interface BookingAdminNotificationProps {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  className: string;
  classDate: string;
  startTime: string;
  instructorName: string;
  paymentType: "stripe" | "pass";
  amountHuf: number | null;
  bookedSpots: number;
  maxSpots: number;
}

export default function BookingAdminNotification({
  customerName,
  customerEmail,
  customerPhone,
  className,
  classDate,
  startTime,
  instructorName,
  paymentType,
  amountHuf,
  bookedSpots,
  maxSpots,
}: BookingAdminNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Új foglalás: {customerName} – {className} ({classDate})
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Új foglalás érkezett</Heading>
          <Hr style={hr} />

          <Section style={box}>
            <Text style={label}>Ügyfél</Text>
            <Text style={value}>{customerName}</Text>
            <Text style={sub}>
              {customerEmail} | {customerPhone}
            </Text>

            <Text style={label}>Óra</Text>
            <Text style={value}>
              {className} – {classDate} {startTime}
            </Text>
            <Text style={sub}>Oktató: {instructorName}</Text>

            <Text style={label}>Fizetés</Text>
            <Text style={value}>
              {paymentType === "pass"
                ? "Bérletből"
                : `${amountHuf?.toLocaleString("hu-HU")} Ft (kártya)`}
            </Text>

            <Text style={label}>Foglaltság</Text>
            <Text style={value}>
              {bookedSpots}/{maxSpots} hely foglalt
            </Text>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>Nagomi Pilates – Admin értesítés</Text>
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
  maxWidth: "480px",
  margin: "0 auto",
  padding: "32px 20px",
};

const heading = {
  fontSize: "18px",
  fontWeight: "600" as const,
  color: "#2B2A20",
  margin: "0 0 16px",
};

const hr = { borderColor: "#9A836330", margin: "20px 0" };

const box = {
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  padding: "20px 24px",
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
};

const sub = {
  fontSize: "12px",
  color: "#2B2A2080",
  margin: "2px 0 0",
};

const footer = {
  fontSize: "11px",
  color: "#2B2A2060",
  textAlign: "center" as const,
  margin: "0",
};
