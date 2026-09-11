import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "./styles.css";

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 3000, retryDelay: 100 } } });
createRoot(document.getElementById("root")).render(<QueryClientProvider client={queryClient}><App /></QueryClientProvider>);
