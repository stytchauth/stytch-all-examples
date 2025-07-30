// Import the CSS as a side effect - this will be included when anyone imports from this package
import "../dist/styles.css";

// Export the card components
export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

// Export the utility function
export { cn } from "../lib/utils";
