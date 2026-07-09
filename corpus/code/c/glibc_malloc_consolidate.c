static void malloc_consolidate(mstate av)
{
  mfastbinptr*    fb;                 /* current fastbin being consolidated */
  mfastbinptr*    maxfb;              /* last fastbin (for loop control) */
  mchunkptr       p;                  /* current chunk being consolidated */
  mchunkptr       nextp;              /* next chunk to consolidate */
  mchunkptr       unsorted_bin;       /* bin header */
  mchunkptr       first_unsorted;     /* chunk to link to */

  /* These have same use as in free() */
  mchunkptr       nextchunk;
  INTERNAL_SIZE_T size;
  INTERNAL_SIZE_T nextsize;
  INTERNAL_SIZE_T prevsize;
  int             nextinuse;

  atomic_store_relaxed (&av->have_fastchunks, false);

  unsorted_bin = unsorted_chunks(av);

  /*
    Remove each chunk from fast bin and consolidate it, placing it
    then in unsorted bin. Among other reasons for doing this,
    placing in unsorted bin avoids needing to calculate actual bins
    until malloc is sure that chunks aren't immediately going to be
    reused anyway.
  */

  maxfb = &fastbin (av, NFASTBINS - 1);
  fb = &fastbin (av, 0);
  do {
    p = atomic_exchange_acquire (fb, NULL);
    if (p != NULL) {
      do {
        {
          if (__glibc_unlikely (misaligned_chunk (p)))
            malloc_printerr ("malloc_consolidate(): "
                             "unaligned fastbin chunk detected");

          unsigned int idx = fastbin_index (chunksize (p));
          if ((&fastbin (av, idx)) != fb)
            malloc_printerr ("malloc_consolidate(): invalid chunk size");
        }

        check_inuse_chunk(av, p);
        nextp = REVEAL_PTR (p->fd);

        /* Slightly streamlined version of consolidation code in free() */
        size = chunksize (p);
        nextchunk = chunk_at_offset(p, size);
        nextsize = chunksize(nextchunk);

        if (!prev_inuse(p)) {
          prevsize = prev_size (p);
          size += prevsize;
          p = chunk_at_offset(p, -((long) prevsize));
          if (__glibc_unlikely (chunksize(p) != prevsize))
            malloc_printerr ("corrupted size vs. prev_size in fastbins");
          unlink_chunk (av, p);
        }

        if (nextchunk != av->top) {
          nextinuse = inuse_bit_at_offset(nextchunk, nextsize);

          if (!nextinuse) {
            size += nextsize;
            unlink_chunk (av, nextchunk);
          } else
            clear_inuse_bit_at_offset(nextchunk, 0);

          first_unsorted = unsorted_bin->fd;
          unsorted_bin->fd = p;
          first_unsorted->bk = p;

          if (!in_smallbin_range (size)) {
            p->fd_nextsize = NULL;
            p->bk_nextsize = NULL;
          }

          set_head(p, size | PREV_INUSE);
          p->bk = unsorted_bin;
          p->fd = first_unsorted;
          set_foot(p, size);
        }

        else {
          size += nextsize;
          set_head(p, size | PREV_INUSE);
          av->top = p;
        }

      } while ( (p = nextp) != NULL);

    }
  } while (fb++ != maxfb);
}
