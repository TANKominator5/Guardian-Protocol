import supabase from "../supabase/client.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-Error.js";

// 📝 Log a new event
export const logEvent = asyncHandler(async (req, res) => {
  const { entity_id, event_type, source, location_id, details } = req.body;

  const { data, error } = await supabase
    .from("events")
    .insert([{ entity_id, event_type, source, location_id, details }])
    .select();

  if (error) throw createError(400, "Failed to log event");

  res.status(201).json({ success: true, data: data[0] });
});

// 🕒 Get entity timeline
export const getEntityTimeline = asyncHandler(async (req, res) => {
  const { entity_id } = req.params;

  const { data, error } = await supabase
    .from("events")
    .select("*, locations(name)")
    .eq("entity_id", entity_id)
    .order("timestamp", { ascending: false });

  if (error) throw createError(400, "Failed to fetch timeline");

  res.status(200).json({ success: true, count: data.length, data });
});
