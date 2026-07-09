int check_opt_wim(void)
{
  uint8_t new_wim_flags[4];
  int i;
  int idx = 0;

  for (i = 0; i < 4; i++) {
    new_wim_flags[i] = 0;
  }

  for (char *p = p_wim; *p; p++) {
    // Note: Keep this in sync with opt_wim_values.
    for (i = 0; ASCII_ISALPHA(p[i]); i++) {}
    if (p[i] != NUL && p[i] != ',' && p[i] != ':') {
      return FAIL;
    }
    if (i == 7 && strncmp(p, "longest", 7) == 0) {
      new_wim_flags[idx] |= kOptWimFlagLongest;
    } else if (i == 4 && strncmp(p, "full", 4) == 0) {
      new_wim_flags[idx] |= kOptWimFlagFull;
    } else if (i == 4 && strncmp(p, "list", 4) == 0) {
      new_wim_flags[idx] |= kOptWimFlagList;
    } else if (i == 8 && strncmp(p, "lastused", 8) == 0) {
      new_wim_flags[idx] |= kOptWimFlagLastused;
    } else if (i == 8 && strncmp(p, "noselect", 8) == 0) {
      new_wim_flags[idx] |= kOptWimFlagNoselect;
    } else if (i == 8 && strncmp(p, "noinsert", 8) == 0) {
      new_wim_flags[idx] |= kOptWimFlagNoinsert;
    } else {
      return FAIL;
    }
    p += i;
    if (*p == NUL) {
      break;
    }
    if (*p == ',') {
      if (idx == 3) {
        return FAIL;
      }
      idx++;
    }
  }

  // fill remaining entries with last flag
  while (idx < 3) {
    new_wim_flags[idx + 1] = new_wim_flags[idx];
    idx++;
  }

  // only when there are no errors, wim_flags[] is changed
  for (i = 0; i < 4; i++) {
    wim_flags[i] = new_wim_flags[i];
  }
  return OK;
}
