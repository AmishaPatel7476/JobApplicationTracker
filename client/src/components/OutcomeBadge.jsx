import { Badge } from "@mantine/core";

function OutcomeBadge({ outcome }) {
  const getColor = () => {
    switch (outcome) {
      case "Passed":
        return "green";
      case "Failed":
        return "red";
      case "Pending":
        return "yellow";
      default:
        return "gray";
    }
  };

  return (
    <Badge color={getColor()} variant="light">
      {outcome}
    </Badge>
  );
}

export default OutcomeBadge;