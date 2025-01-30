import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onError: (error) => {
      toast.error(error.message ?? "Something went wrong");
    },
  }),
  queryCache: new QueryCache({
    onError: (error) => toast.error(error.message ?? "Something went wrong"),
  }),
});

export default queryClient;
