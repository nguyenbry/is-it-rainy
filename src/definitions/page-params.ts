import { z } from "zod";

const weatherReportPageParamsSchema = z.object({
  query: z.string().min(1),
  country: z.string().optional(),
});

type weatherReportPageParamsSchema = z.infer<
  typeof weatherReportPageParamsSchema
>;

export { weatherReportPageParamsSchema };
