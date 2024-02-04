export const isProd = () => {
  if (!import.meta.env.NODE_ENV || import.meta.env.NODE_ENV === "development") {
    return false;
  }

  return true;
};

export default {
  avatarPlaceholder: (seed: string | number) => {
    return `https://api.dicebear.com/6.x/micah/svg?seed=${seed}`;
  },
  supabaseUrl: "https://pronvzrzfwsptkojvudd.supabase.co",
  supabaseAnonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByb252enJ6ZndzcHRrb2p2dWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4NTYwNDcsImV4cCI6MjAyMjQzMjA0N30.I6_-XrqssUb2SWYg5DjsUqSodNS3_RPoET3-aPdqywM",
    posthogApiKey: "phc_zI9MsoTRSrvQoMSHj2lEdlzXN51nbOrdpS5ZUmWGWuU",
};
