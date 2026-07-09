// ASCII lower-to-upper case translation, language independent.
void vim_strup(char *p)
  FUNC_ATTR_NONNULL_ALL
{
  uint8_t c;
  while ((c = (uint8_t)(*p)) != NUL) {
    *p++ = (char)(uint8_t)(c < 'a' || c > 'z' ? c : c - 0x20);
  }
}

// strcpy plus vim_strup.
void vim_strcpy_up(char *restrict dst, const char *restrict src)
  FUNC_ATTR_NONNULL_ALL
{
  uint8_t c;
  while ((c = (uint8_t)(*src++)) != NUL) {
    *dst++ = (char)(uint8_t)(c < 'a' || c > 'z' ? c : c - 0x20);
  }
  *dst = NUL;
}

// strncpy (NUL-terminated) plus vim_strup.
void vim_strncpy_up(char *restrict dst, const char *restrict src, size_t n)
  FUNC_ATTR_NONNULL_ALL
{
  uint8_t c;
  while (n-- && (c = (uint8_t)(*src++)) != NUL) {
    *dst++ = (char)(uint8_t)(c < 'a' || c > 'z' ? c : c - 0x20);
  }
  *dst = NUL;
}

// memcpy (does not NUL-terminate) plus vim_strup.
void vim_memcpy_up(char *restrict dst, const char *restrict src, size_t n)
  FUNC_ATTR_NONNULL_ALL
{
  uint8_t c;
  while (n--) {
    c = (uint8_t)(*src++);
    *dst++ = (char)(uint8_t)(c < 'a' || c > 'z' ? c : c - 0x20);
  }
}
