static Array extmark_to_array(MTPair extmark, bool id, bool add_dict, bool hl_name, Arena *arena)
{
  MTKey start = extmark.start;
  Array rv = arena_array(arena, 4);
  if (id) {
    ADD_C(rv, INTEGER_OBJ((Integer)start.id));
  }
  ADD_C(rv, INTEGER_OBJ(start.pos.row));
  ADD_C(rv, INTEGER_OBJ(start.pos.col));

  if (add_dict) {
    // TODO(bfredl): coding the size like this is a bit fragile.
    // We want ArrayOf(Dict(set_extmark)) as the return type..
    Dict dict = arena_dict(arena, ARRAY_SIZE(set_extmark_table));

    PUT_C(dict, "ns_id", INTEGER_OBJ((Integer)start.ns));

    PUT_C(dict, "right_gravity", BOOLEAN_OBJ(mt_right(start)));

    if (mt_paired(start)) {
      PUT_C(dict, "end_row", INTEGER_OBJ(extmark.end_pos.row));
      PUT_C(dict, "end_col", INTEGER_OBJ(extmark.end_pos.col));
      PUT_C(dict, "end_right_gravity", BOOLEAN_OBJ(extmark.end_right_gravity));
    }

    if (mt_no_undo(start)) {
      PUT_C(dict, "undo_restore", BOOLEAN_OBJ(false));
    }

    if (mt_invalidate(start)) {
      PUT_C(dict, "invalidate", BOOLEAN_OBJ(true));
    }
    if (mt_invalid(start)) {
      PUT_C(dict, "invalid", BOOLEAN_OBJ(true));
    }

    decor_to_dict_legacy(&dict, mt_decor(start), hl_name, arena);

    ADD_C(rv, DICT_OBJ(dict));
  }

  return rv;
}
