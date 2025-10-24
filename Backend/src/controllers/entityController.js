import supabase from "../supabase/client.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-Error.js";


//get all entities
export const getEntities = asyncHandler(async (req, res) => {
  const { query, status, limit = 50, offset = 0 } = req.query;

  let baseQuery = supabase
    .from("entry")
    .select(`
      entry_id,
      user_id,
      status,
      last_seen,
      location,
      profiles (
        id,
        full_name,
        department,
        course,
        roll_no
      )
    `)
    .range(Number(offset), Number(offset) + Number(limit) - 1);

  // 🔹 Optional: filter by status
  if (status) {
    baseQuery = baseQuery.eq("status", status);
  }

  // 🔹 Optional: search by user full_name or roll_no
  if (query) {
    baseQuery = baseQuery.ilike("profiles.full_name", `%${query}%`);
  }

  const { data, error } = await baseQuery;

  if (error) {
    console.error("Error fetching entities:", error);
    throw new ApiError(500, "Database query failed");
  }

  res.status(200).json({
    success: true,
    count: data.length,
    data
  });
});

// 🧭 Get entity by ID
export const getEntityById = asyncHandler(async (req, res) => {
  const { id } = req.params; // This is the user_id

  if (!id) {
    throw new ApiError(400, "User ID is required");
  }

  const { data, error } = await supabase
    .from("entry")
    .select(`
      entry_id,
      user_id,
      status,
      last_seen,
      location,
      profiles (
        id,
        full_name,
        department,
        course,
        roll_no,
        gender,
        current_year,
        current_semester,
        room_id
      )
    `)
    .eq("user_id", id)
    .maybeSingle(); // allows null if not found without throwing an error

  if (error) {
    console.error("Error fetching entity:", error);
    throw new ApiError(500, "Database query failed");
  }

  if (!data) {
    throw new ApiError(404, "Entity not found for this user ID");
  }

  res.status(200).json({
    success: true,
    data
  });
});

// 🔍 Search entities by name, ID, or other fields
export const searchEntities = asyncHandler(async (req, res) => {
  const { query, limit = 50, offset = 0 } = req.query;

  if (!query || query.trim() === "") {
    return res.status(200).json({
      success: true,
      count: 0,
      data: [],
    });
  }

  const cleanQuery = query.toString().trim();

  const { data, error } = await supabase
    .from("entry")
    .select(`
      entry_id,
      user_id,
      status,
      last_seen,
      location,
      profiles (
        id,
        full_name,
        department,
        course,
        roll_no
      )
    `)
    .or(
      `
      profiles.full_name.ilike.%${cleanQuery}%,
      profiles.roll_no.ilike.%${cleanQuery}%,
      status.ilike.%${cleanQuery}%
      `
    )
    .range(Number(offset), Number(offset) + Number(limit) - 1)
    .order("last_seen", { ascending: false });

  if (error) {
    console.error("Search error:", error);
    throw new ApiError(500, "Database query failed");
  }

  res.status(200).json({
    success: true,
    count: data?.length || 0,
    data: data || [],
  });
});


// ⚙️ Update entity status
export const updateEntityStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!id) {
    throw new ApiError(400, "Entity ID is required");
  }

  if (!status) {
    throw new ApiError(400, "Status is required");
  }

  // Validate status against allowed values
  const validStatuses = ['ACTIVE', 'MISSING', 'AT_RISK', 'INACTIVE'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, `Invalid status. Must be one of: ${validStatuses.join(', ')}`);
  }

  const { data: existingEntity } = await supabase
    .from('entry')
    .select('user_id')
    .eq('user_id', id)
    .single();

  if (!existingEntity) {
    throw new ApiError(404, 'Entity not found');
  }

  const { data, error } = await supabase
    .from('entry')
    .update({ 
      status,
      updated_at: new Date().toISOString() 
    })
    .eq('user_id', id)
    .select()
    .single();

  if (error) {
    console.error('Update error:', error);
    throw new ApiError(500, 'Failed to update entity status');
  }

  // Log the status change event
  await supabase
    .from('events')
    .insert([{
      entity_id: id,
      event_type: 'STATUS_CHANGE',
      source: 'SYSTEM',
      details: { 
        previous_status: existingEntity.status, 
        new_status: status 
      }
    }]);

  res.status(200).json({ 
    success: true, 
    data 
  });
});
