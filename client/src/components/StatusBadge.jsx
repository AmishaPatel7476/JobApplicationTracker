import { Badge } from "@mantine/core";

function StatusBadge({ status }) {
  const getColor = () => {
    switch (status) {
      case "Applied":
        return "blue";
      case "Under Review":
        return "cyan";
      case "Interview Scheduled":
        return "yellow";
      case "Offered":
        return "green";
      case "Accepted":
        return "teal";
      case "Rejected":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Badge color={getColor()} variant="light">
      {status}
    </Badge>
  );
}

export default StatusBadge;