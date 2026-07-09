void *
__memmem (const void *haystack, size_t hs_len,
          const void *needle, size_t ne_len)
{
  const unsigned char *hs = (const unsigned char *) haystack;
  const unsigned char *ne = (const unsigned char *) needle;

  if (ne_len == 0)
    return (void *) hs;
  if (ne_len == 1)
    return (void *) memchr (hs, ne[0], hs_len);

  /* Ensure haystack length is >= needle length.  */
  if (hs_len < ne_len)
    return NULL;

  const unsigned char *end = hs + hs_len - ne_len;

  if (ne_len == 2)
    {
      uint32_t nw = ne[0] << 16 | ne[1], hw = hs[0] << 16 | hs[1];
      for (hs++; hs <= end && hw != nw; )
        hw = hw << 16 | *++hs;
      return hw == nw ? (void *)hs - 1 : NULL;
    }

  /* Use Two-Way algorithm for very long needles.  */
  if (__builtin_expect (ne_len > 256, 0))
    return two_way_long_needle (hs, hs_len, ne, ne_len);

  uint8_t shift[256];
  size_t tmp, shift1;
  size_t m1 = ne_len - 1;
  size_t offset = 0;

  memset (shift, 0, sizeof (shift));
  for (int i = 1; i < m1; i++)
    shift[hash2 (ne + i)] = i;
  /* Shift1 is the amount we can skip after matching the hash of the
     needle end but not the full needle.  */
  shift1 = m1 - shift[hash2 (ne + m1)];
  shift[hash2 (ne + m1)] = m1;

  for ( ; hs <= end; )
    {
      /* Skip past character pairs not in the needle.  */
      do
        {
          hs += m1;
          tmp = shift[hash2 (hs)];
        }
      while (tmp == 0 && hs <= end);

      /* If the match is not at the end of the needle, shift to the end
         and continue until we match the hash of the needle end.  */
      hs -= tmp;
      if (tmp < m1)
        continue;

      /* Hash of the last 2 characters matches.  If the needle is long,
         try to quickly filter out mismatches.  */
      if (m1 < 15 || memcmp (hs + offset, ne + offset, 8) == 0)
        {
          if (memcmp (hs, ne, m1) == 0)
            return (void *) hs;

          /* Adjust filter offset when it doesn't find the mismatch.  */
          offset = (offset >= 8 ? offset : m1) - 8;
        }

      /* Skip based on matching the hash of the needle end.  */
      hs += shift1;
    }
  return NULL;
}
libc_hidden_def (__memmem)
weak_alias (__memmem, memmem)
