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

interface BookingConfirmationProps {
  customerName: string;
  className: string;
  classDate: string;
  startTime: string;
  durationMin: number;
  instructorName: string;
  amountHuf: number | null;
  paymentType: "stripe" | "pass";
  bookingId: string;
}

export default function BookingConfirmation({
  customerName,
  className,
  classDate,
  startTime,
  durationMin,
  instructorName,
  amountHuf,
  paymentType,
  bookingId,
}: BookingConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>
        Foglalásod megerősítve – {className}, {classDate} {startTime}
      </Preview>
      <Body style={body}>
        <Container style={container}>
          <Heading style={heading}>Nagomi Pilates</Heading>
          <Hr style={hr} />

          <Text style={greeting}>Kedves {customerName},</Text>

          <Text style={paragraph}>
            Foglalásod sikeresen megerősítettük. Várunk szeretettel!
          </Text>

          <Section style={detailsBox}>
            <Text style={detailLabel}>Óra</Text>
            <Text style={detailValue}>{className}</Text>

            <Text style={detailLabel}>Időpont</Text>
            <Text style={detailValue}>
              {classDate}, {startTime} ({durationMin} perc)
            </Text>

            <Text style={detailLabel}>Oktató</Text>
            <Text style={detailValue}>{instructorName}</Text>

            <Text style={detailLabel}>Fizetés</Text>
            <Text style={detailValue}>
              {paymentType === "pass"
                ? "Bérletből felhasználva"
                : `${amountHuf?.toLocaleString("hu-HU")} Ft – bankkártyával fizetve`}
            </Text>

            <Text style={detailLabel}>Foglalás azonosító</Text>
            <Text style={detailValue}>{bookingId.slice(0, 8).toUpperCase()}</Text>
          </Section>

          <Section style={locationBox}>
            <Text style={detailLabel}>Helyszín</Text>
            <Text style={detailValue}>
              Nagomi Pilates Studio
              <br />
              Debrecen-Józsa, Deák Ferenc utca 2.
            </Text>
          </Section>

          <Text style={paragraph}>
            Kérjük, érkezz legalább 10 perccel az óra kezdete előtt.
            Hozz magaddal kényelmes sportruházatot és zoknit.
          </Text>

          <Text style={smallText}>
            Ha le szeretnéd mondani a foglalásod, kérjük vedd fel velünk a
            kapcsolatot az info@nagomipilates.hu címen.
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

const hr = {
  borderColor: "#9A836330",
  margin: "24px 0",
};

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

const detailsBox = {
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  padding: "20px 24px",
  margin: "0 0 16px",
};

const locationBox = {
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  padding: "20px 24px",
  margin: "0 0 24px",
};

const detailLabel = {
  fontSize: "10px",
  letterSpacing: "0.15em",
  textTransform: "uppercase" as const,
  color: "#9A8363",
  fontWeight: "600" as const,
  margin: "12px 0 2px",
};

const detailValue = {
  fontSize: "14px",
  color: "#2B2A20",
  fontWeight: "500" as const,
  margin: "0 0 4px",
  lineHeight: "1.4",
};

const smallText = {
  fontSize: "12px",
  color: "#2B2A2080",
  lineHeight: "1.5",
  margin: "0 0 16px",
};

const footer = {
  fontSize: "11px",
  color: "#2B2A2060",
  textAlign: "center" as const,
  margin: "0",
};
