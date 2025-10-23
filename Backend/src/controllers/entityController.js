import supabase from "../supabase/client.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api-Error.js";

// 🧭 Get entity by ID
export const getEntityById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new ApiError(400, "Entity ID is required");
  }

  const { data, error } = await supabase
    .from("entities")
    .select(`
      *,
      devices:devices(*),
      access_cards:access_cards(*)
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching entity:", error);
    throw new ApiError(404, "Entity not found");
  }

  if (!data) {
    throw new ApiError(404, "Entity not found");
  }

  res.status(200).json({ 
    success: true, 
    data 
  });
});

// 🔍 Search entities by name, ID, or other fields
export const searchEntities = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(200).json({ 
      success: true, 
      count: 0, 
      data: [] 
    });
  }

  // Clean the query to prevent SQL injection
  const cleanQuery = query.toString().trim();
  
  try {
    // Search in multiple fields using OR conditions
    const { data, error, count } = await supabase
      .from('entities')
      .select('*', { count: 'exact' })
      .or(`primary_name.ilike.%${cleanQuery}%,aliases.cs.{"${cleanQuery}"}`)
      .order('last_seen', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Search error:', error);
      throw new ApiError(500, 'Failed to perform search');
    }

    res.status(200).json({
      success: true,
      count: count || 0,
      data: data || []
    });
  } catch (error) {
    console.error('Search exception:', error);
    throw new ApiError(500, 'An error occurred during search');
  }
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
    .from('entities')
    .select('id')
    .eq('id', id)
    .single();

  if (!existingEntity) {
    throw new ApiError(404, 'Entity not found');
  }

  const { data, error } = await supabase
    .from('entities')
    .update({ 
      status,
      updated_at: new Date().toISOString() 
    })
    .eq('id', id)
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
