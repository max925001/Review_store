import pool from '../src/config/database.js';

async function check() {
  try {
    const res = await pool.query(`
      SELECT
          i.relname as index_name,
          a.attname as column_name,
          ix.indisunique as is_unique
      FROM
          pg_class t,
          pg_class i,
          pg_index ix,
          pg_attribute a
      WHERE
          t.oid = ix.indrelid
          and i.oid = ix.indexrelid
          and a.attrelid = t.oid
          and a.attnum = ANY(ix.indkey)
          and t.relname = 'ratings';
    `);
    console.log("Indexes on ratings:", res.rows);
  } catch (err) {
    console.error("Error inspecting database:", err);
  } finally {
    await pool.end();
  }
}

check();
