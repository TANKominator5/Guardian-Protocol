import supabase from "../supabase/client.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-Error.js";

// 📊 Get confidence scores for an entity
export const getEntityConfidenceScores = asyncHandler(async (req, res) => {
  const { entity_id } = req.params;

  const { data, error } = await supabase
    .from("confidence_scores")
    .select("*")
    .eq("entity_id", entity_id)
    .order("calculated_at", { ascending: false });

  if (error) throw new ApiError(400, "Failed to fetch confidence scores");

  res.status(200).json({ success: true, count: data.length, data });
});

// 📍 Get activity by location and time range
export const getLocationActivity = asyncHandler(async (req, res) => {
  const { location_id, start_time, end_time } = req.query;

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("location_id", location_id)
    .gte("timestamp", start_time)
    .lte("timestamp", end_time)
    .order("timestamp", { ascending: true });

  if (error) throw new ApiError(400, "Failed to fetch location activity");

  res.status(200).json({ success: true, count: data.length, data });
});

// 📅 Generate daily activity report
export const generateDailyReport = asyncHandler(async (req, res) => {
  const { date } = req.query;

  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59);

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .gte("timestamp", startOfDay.toISOString())
    .lte("timestamp", endOfDay.toISOString());

  if (error) throw new ApiError(400, "Failed to generate report");

  res.status(200).json({
    success: true,
    date,
    total_events: data.length,
    data,
  });
});
