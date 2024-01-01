/*
  Recursively traverse todo parent-child relationship until 
  the root todo is found. Dependencies: todoId.
*/
export const GET_ROOT_PARENT_TODO_QUERY = `
WITH RECURSIVE parent_cte AS (
  SELECT
    id,
    title,
    completed,
    frozen,
    "createdAt",
    "updatedAt",
    "parentId",
    "ownerId"
  FROM
    todos
  WHERE
    id = $1

  UNION ALL

  SELECT
    t.id,
    t.title,
    t.completed,
    t.frozen,
    t."createdAt",
    t."updatedAt",
    t."parentId",
    t."ownerId"
  FROM
    todos t
    INNER JOIN parent_cte pte ON t.id = pte."parentId"
)
SELECT * FROM parent_cte WHERE "parentId" IS NULL;`;
