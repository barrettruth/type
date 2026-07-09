export const codeSnippets = [
  {
    "language": "c",
    "name": "c/glibc_malloc_consolidate.c",
    "code": "static void malloc_consolidate(mstate av)\n{\n  mfastbinptr*    fb;                 /* current fastbin being consolidated */\n  mfastbinptr*    maxfb;              /* last fastbin (for loop control) */\n  mchunkptr       p;                  /* current chunk being consolidated */\n  mchunkptr       nextp;              /* next chunk to consolidate */\n  mchunkptr       unsorted_bin;       /* bin header */\n  mchunkptr       first_unsorted;     /* chunk to link to */\n\n  /* These have same use as in free() */\n  mchunkptr       nextchunk;\n  INTERNAL_SIZE_T size;\n  INTERNAL_SIZE_T nextsize;\n  INTERNAL_SIZE_T prevsize;\n  int             nextinuse;\n\n  atomic_store_relaxed (&av->have_fastchunks, false);\n\n  unsorted_bin = unsorted_chunks(av);\n\n  /*\n    Remove each chunk from fast bin and consolidate it, placing it\n    then in unsorted bin. Among other reasons for doing this,\n    placing in unsorted bin avoids needing to calculate actual bins\n    until malloc is sure that chunks aren't immediately going to be\n    reused anyway.\n  */\n\n  maxfb = &fastbin (av, NFASTBINS - 1);\n  fb = &fastbin (av, 0);\n  do {\n    p = atomic_exchange_acquire (fb, NULL);\n    if (p != NULL) {\n      do {\n        {\n          if (__glibc_unlikely (misaligned_chunk (p)))\n            malloc_printerr (\"malloc_consolidate(): \"\n                             \"unaligned fastbin chunk detected\");\n\n          unsigned int idx = fastbin_index (chunksize (p));\n          if ((&fastbin (av, idx)) != fb)\n            malloc_printerr (\"malloc_consolidate(): invalid chunk size\");\n        }\n\n        check_inuse_chunk(av, p);\n        nextp = REVEAL_PTR (p->fd);\n\n        /* Slightly streamlined version of consolidation code in free() */\n        size = chunksize (p);\n        nextchunk = chunk_at_offset(p, size);\n        nextsize = chunksize(nextchunk);\n\n        if (!prev_inuse(p)) {\n          prevsize = prev_size (p);\n          size += prevsize;\n          p = chunk_at_offset(p, -((long) prevsize));\n          if (__glibc_unlikely (chunksize(p) != prevsize))\n            malloc_printerr (\"corrupted size vs. prev_size in fastbins\");\n          unlink_chunk (av, p);\n        }\n\n        if (nextchunk != av->top) {\n          nextinuse = inuse_bit_at_offset(nextchunk, nextsize);\n\n          if (!nextinuse) {\n            size += nextsize;\n            unlink_chunk (av, nextchunk);\n          } else\n            clear_inuse_bit_at_offset(nextchunk, 0);\n\n          first_unsorted = unsorted_bin->fd;\n          unsorted_bin->fd = p;\n          first_unsorted->bk = p;\n\n          if (!in_smallbin_range (size)) {\n            p->fd_nextsize = NULL;\n            p->bk_nextsize = NULL;\n          }\n\n          set_head(p, size | PREV_INUSE);\n          p->bk = unsorted_bin;\n          p->fd = first_unsorted;\n          set_foot(p, size);\n        }\n\n        else {\n          size += nextsize;\n          set_head(p, size | PREV_INUSE);\n          av->top = p;\n        }\n\n      } while ( (p = nextp) != NULL);\n\n    }\n  } while (fb++ != maxfb);\n}",
    "spans": [
      {
        "start": 0,
        "end": 6,
        "className": "syntax-keyword"
      },
      {
        "start": 7,
        "end": 11,
        "className": "syntax-type"
      },
      {
        "start": 12,
        "end": 30,
        "className": "syntax-function"
      },
      {
        "start": 31,
        "end": 37,
        "className": "syntax-type"
      },
      {
        "start": 38,
        "end": 40,
        "className": "syntax-variable"
      },
      {
        "start": 46,
        "end": 57,
        "className": "syntax-type"
      },
      {
        "start": 57,
        "end": 58,
        "className": "syntax-operator"
      },
      {
        "start": 62,
        "end": 64,
        "className": "syntax-variable"
      },
      {
        "start": 82,
        "end": 122,
        "className": "syntax-comment"
      },
      {
        "start": 125,
        "end": 136,
        "className": "syntax-type"
      },
      {
        "start": 136,
        "end": 137,
        "className": "syntax-operator"
      },
      {
        "start": 141,
        "end": 146,
        "className": "syntax-variable"
      },
      {
        "start": 161,
        "end": 198,
        "className": "syntax-comment"
      },
      {
        "start": 201,
        "end": 210,
        "className": "syntax-type"
      },
      {
        "start": 217,
        "end": 218,
        "className": "syntax-variable"
      },
      {
        "start": 237,
        "end": 275,
        "className": "syntax-comment"
      },
      {
        "start": 278,
        "end": 287,
        "className": "syntax-type"
      },
      {
        "start": 294,
        "end": 299,
        "className": "syntax-variable"
      },
      {
        "start": 314,
        "end": 345,
        "className": "syntax-comment"
      },
      {
        "start": 348,
        "end": 357,
        "className": "syntax-type"
      },
      {
        "start": 364,
        "end": 376,
        "className": "syntax-variable"
      },
      {
        "start": 384,
        "end": 400,
        "className": "syntax-comment"
      },
      {
        "start": 403,
        "end": 412,
        "className": "syntax-type"
      },
      {
        "start": 419,
        "end": 433,
        "className": "syntax-variable"
      },
      {
        "start": 439,
        "end": 461,
        "className": "syntax-comment"
      },
      {
        "start": 465,
        "end": 503,
        "className": "syntax-comment"
      },
      {
        "start": 506,
        "end": 515,
        "className": "syntax-type"
      },
      {
        "start": 522,
        "end": 531,
        "className": "syntax-variable"
      },
      {
        "start": 535,
        "end": 550,
        "className": "syntax-type"
      },
      {
        "start": 551,
        "end": 555,
        "className": "syntax-variable"
      },
      {
        "start": 559,
        "end": 574,
        "className": "syntax-type"
      },
      {
        "start": 575,
        "end": 583,
        "className": "syntax-variable"
      },
      {
        "start": 587,
        "end": 602,
        "className": "syntax-type"
      },
      {
        "start": 603,
        "end": 611,
        "className": "syntax-variable"
      },
      {
        "start": 615,
        "end": 618,
        "className": "syntax-type"
      },
      {
        "start": 631,
        "end": 640,
        "className": "syntax-variable"
      },
      {
        "start": 645,
        "end": 665,
        "className": "syntax-function"
      },
      {
        "start": 667,
        "end": 668,
        "className": "syntax-operator"
      },
      {
        "start": 668,
        "end": 670,
        "className": "syntax-variable"
      },
      {
        "start": 670,
        "end": 672,
        "className": "syntax-operator"
      },
      {
        "start": 672,
        "end": 687,
        "className": "syntax-property"
      },
      {
        "start": 700,
        "end": 712,
        "className": "syntax-variable"
      },
      {
        "start": 713,
        "end": 714,
        "className": "syntax-operator"
      },
      {
        "start": 715,
        "end": 730,
        "className": "syntax-function"
      },
      {
        "start": 731,
        "end": 733,
        "className": "syntax-variable"
      },
      {
        "start": 739,
        "end": 741,
        "className": "syntax-comment"
      },
      {
        "start": 742,
        "end": 808,
        "className": "syntax-comment"
      },
      {
        "start": 809,
        "end": 870,
        "className": "syntax-comment"
      },
      {
        "start": 871,
        "end": 938,
        "className": "syntax-comment"
      },
      {
        "start": 939,
        "end": 1006,
        "className": "syntax-comment"
      },
      {
        "start": 1007,
        "end": 1025,
        "className": "syntax-comment"
      },
      {
        "start": 1026,
        "end": 1030,
        "className": "syntax-comment"
      },
      {
        "start": 1034,
        "end": 1039,
        "className": "syntax-variable"
      },
      {
        "start": 1040,
        "end": 1041,
        "className": "syntax-operator"
      },
      {
        "start": 1042,
        "end": 1043,
        "className": "syntax-operator"
      },
      {
        "start": 1043,
        "end": 1050,
        "className": "syntax-function"
      },
      {
        "start": 1052,
        "end": 1054,
        "className": "syntax-variable"
      },
      {
        "start": 1056,
        "end": 1065,
        "className": "syntax-constant"
      },
      {
        "start": 1066,
        "end": 1067,
        "className": "syntax-operator"
      },
      {
        "start": 1068,
        "end": 1069,
        "className": "syntax-number"
      },
      {
        "start": 1074,
        "end": 1076,
        "className": "syntax-variable"
      },
      {
        "start": 1077,
        "end": 1078,
        "className": "syntax-operator"
      },
      {
        "start": 1079,
        "end": 1080,
        "className": "syntax-operator"
      },
      {
        "start": 1080,
        "end": 1087,
        "className": "syntax-function"
      },
      {
        "start": 1089,
        "end": 1091,
        "className": "syntax-variable"
      },
      {
        "start": 1093,
        "end": 1094,
        "className": "syntax-number"
      },
      {
        "start": 1099,
        "end": 1101,
        "className": "syntax-keyword"
      },
      {
        "start": 1108,
        "end": 1109,
        "className": "syntax-variable"
      },
      {
        "start": 1110,
        "end": 1111,
        "className": "syntax-operator"
      },
      {
        "start": 1112,
        "end": 1135,
        "className": "syntax-function"
      },
      {
        "start": 1137,
        "end": 1139,
        "className": "syntax-variable"
      },
      {
        "start": 1141,
        "end": 1145,
        "className": "syntax-constant"
      },
      {
        "start": 1152,
        "end": 1154,
        "className": "syntax-keyword"
      },
      {
        "start": 1156,
        "end": 1157,
        "className": "syntax-variable"
      },
      {
        "start": 1158,
        "end": 1160,
        "className": "syntax-operator"
      },
      {
        "start": 1161,
        "end": 1165,
        "className": "syntax-constant"
      },
      {
        "start": 1175,
        "end": 1177,
        "className": "syntax-keyword"
      },
      {
        "start": 1200,
        "end": 1202,
        "className": "syntax-keyword"
      },
      {
        "start": 1204,
        "end": 1220,
        "className": "syntax-function"
      },
      {
        "start": 1222,
        "end": 1238,
        "className": "syntax-function"
      },
      {
        "start": 1240,
        "end": 1241,
        "className": "syntax-variable"
      },
      {
        "start": 1257,
        "end": 1272,
        "className": "syntax-function"
      },
      {
        "start": 1274,
        "end": 1298,
        "className": "syntax-string"
      },
      {
        "start": 1328,
        "end": 1362,
        "className": "syntax-string"
      },
      {
        "start": 1376,
        "end": 1388,
        "className": "syntax-type"
      },
      {
        "start": 1389,
        "end": 1392,
        "className": "syntax-variable"
      },
      {
        "start": 1393,
        "end": 1394,
        "className": "syntax-operator"
      },
      {
        "start": 1395,
        "end": 1408,
        "className": "syntax-function"
      },
      {
        "start": 1410,
        "end": 1419,
        "className": "syntax-function"
      },
      {
        "start": 1421,
        "end": 1422,
        "className": "syntax-variable"
      },
      {
        "start": 1436,
        "end": 1438,
        "className": "syntax-keyword"
      },
      {
        "start": 1441,
        "end": 1442,
        "className": "syntax-operator"
      },
      {
        "start": 1442,
        "end": 1449,
        "className": "syntax-function"
      },
      {
        "start": 1451,
        "end": 1453,
        "className": "syntax-variable"
      },
      {
        "start": 1455,
        "end": 1458,
        "className": "syntax-variable"
      },
      {
        "start": 1461,
        "end": 1463,
        "className": "syntax-operator"
      },
      {
        "start": 1464,
        "end": 1466,
        "className": "syntax-variable"
      },
      {
        "start": 1480,
        "end": 1495,
        "className": "syntax-function"
      },
      {
        "start": 1497,
        "end": 1539,
        "className": "syntax-string"
      },
      {
        "start": 1561,
        "end": 1578,
        "className": "syntax-function"
      },
      {
        "start": 1579,
        "end": 1581,
        "className": "syntax-variable"
      },
      {
        "start": 1583,
        "end": 1584,
        "className": "syntax-variable"
      },
      {
        "start": 1595,
        "end": 1600,
        "className": "syntax-variable"
      },
      {
        "start": 1601,
        "end": 1602,
        "className": "syntax-operator"
      },
      {
        "start": 1603,
        "end": 1613,
        "className": "syntax-function"
      },
      {
        "start": 1615,
        "end": 1616,
        "className": "syntax-variable"
      },
      {
        "start": 1616,
        "end": 1618,
        "className": "syntax-operator"
      },
      {
        "start": 1618,
        "end": 1620,
        "className": "syntax-property"
      },
      {
        "start": 1632,
        "end": 1698,
        "className": "syntax-comment"
      },
      {
        "start": 1707,
        "end": 1711,
        "className": "syntax-variable"
      },
      {
        "start": 1712,
        "end": 1713,
        "className": "syntax-operator"
      },
      {
        "start": 1714,
        "end": 1723,
        "className": "syntax-function"
      },
      {
        "start": 1725,
        "end": 1726,
        "className": "syntax-variable"
      },
      {
        "start": 1737,
        "end": 1746,
        "className": "syntax-variable"
      },
      {
        "start": 1747,
        "end": 1748,
        "className": "syntax-operator"
      },
      {
        "start": 1749,
        "end": 1764,
        "className": "syntax-function"
      },
      {
        "start": 1765,
        "end": 1766,
        "className": "syntax-variable"
      },
      {
        "start": 1768,
        "end": 1772,
        "className": "syntax-variable"
      },
      {
        "start": 1783,
        "end": 1791,
        "className": "syntax-variable"
      },
      {
        "start": 1792,
        "end": 1793,
        "className": "syntax-operator"
      },
      {
        "start": 1794,
        "end": 1803,
        "className": "syntax-function"
      },
      {
        "start": 1804,
        "end": 1813,
        "className": "syntax-variable"
      },
      {
        "start": 1825,
        "end": 1827,
        "className": "syntax-keyword"
      },
      {
        "start": 1830,
        "end": 1840,
        "className": "syntax-function"
      },
      {
        "start": 1841,
        "end": 1842,
        "className": "syntax-variable"
      },
      {
        "start": 1857,
        "end": 1865,
        "className": "syntax-variable"
      },
      {
        "start": 1866,
        "end": 1867,
        "className": "syntax-operator"
      },
      {
        "start": 1868,
        "end": 1877,
        "className": "syntax-function"
      },
      {
        "start": 1879,
        "end": 1880,
        "className": "syntax-variable"
      },
      {
        "start": 1893,
        "end": 1897,
        "className": "syntax-variable"
      },
      {
        "start": 1898,
        "end": 1900,
        "className": "syntax-operator"
      },
      {
        "start": 1901,
        "end": 1909,
        "className": "syntax-variable"
      },
      {
        "start": 1921,
        "end": 1922,
        "className": "syntax-variable"
      },
      {
        "start": 1923,
        "end": 1924,
        "className": "syntax-operator"
      },
      {
        "start": 1925,
        "end": 1940,
        "className": "syntax-function"
      },
      {
        "start": 1941,
        "end": 1942,
        "className": "syntax-variable"
      },
      {
        "start": 1944,
        "end": 1945,
        "className": "syntax-operator"
      },
      {
        "start": 1947,
        "end": 1951,
        "className": "syntax-type"
      },
      {
        "start": 1953,
        "end": 1961,
        "className": "syntax-variable"
      },
      {
        "start": 1975,
        "end": 1977,
        "className": "syntax-keyword"
      },
      {
        "start": 1979,
        "end": 1995,
        "className": "syntax-function"
      },
      {
        "start": 1997,
        "end": 2006,
        "className": "syntax-function"
      },
      {
        "start": 2007,
        "end": 2008,
        "className": "syntax-variable"
      },
      {
        "start": 2010,
        "end": 2012,
        "className": "syntax-operator"
      },
      {
        "start": 2013,
        "end": 2021,
        "className": "syntax-variable"
      },
      {
        "start": 2036,
        "end": 2051,
        "className": "syntax-function"
      },
      {
        "start": 2053,
        "end": 2095,
        "className": "syntax-string"
      },
      {
        "start": 2108,
        "end": 2120,
        "className": "syntax-function"
      },
      {
        "start": 2122,
        "end": 2124,
        "className": "syntax-variable"
      },
      {
        "start": 2126,
        "end": 2127,
        "className": "syntax-variable"
      },
      {
        "start": 2149,
        "end": 2151,
        "className": "syntax-keyword"
      },
      {
        "start": 2153,
        "end": 2162,
        "className": "syntax-variable"
      },
      {
        "start": 2163,
        "end": 2165,
        "className": "syntax-operator"
      },
      {
        "start": 2166,
        "end": 2168,
        "className": "syntax-variable"
      },
      {
        "start": 2168,
        "end": 2170,
        "className": "syntax-operator"
      },
      {
        "start": 2170,
        "end": 2173,
        "className": "syntax-property"
      },
      {
        "start": 2187,
        "end": 2196,
        "className": "syntax-variable"
      },
      {
        "start": 2197,
        "end": 2198,
        "className": "syntax-operator"
      },
      {
        "start": 2199,
        "end": 2218,
        "className": "syntax-function"
      },
      {
        "start": 2219,
        "end": 2228,
        "className": "syntax-variable"
      },
      {
        "start": 2230,
        "end": 2238,
        "className": "syntax-variable"
      },
      {
        "start": 2252,
        "end": 2254,
        "className": "syntax-keyword"
      },
      {
        "start": 2257,
        "end": 2266,
        "className": "syntax-variable"
      },
      {
        "start": 2282,
        "end": 2286,
        "className": "syntax-variable"
      },
      {
        "start": 2287,
        "end": 2289,
        "className": "syntax-operator"
      },
      {
        "start": 2290,
        "end": 2298,
        "className": "syntax-variable"
      },
      {
        "start": 2312,
        "end": 2324,
        "className": "syntax-function"
      },
      {
        "start": 2326,
        "end": 2328,
        "className": "syntax-variable"
      },
      {
        "start": 2330,
        "end": 2339,
        "className": "syntax-variable"
      },
      {
        "start": 2354,
        "end": 2358,
        "className": "syntax-keyword"
      },
      {
        "start": 2371,
        "end": 2396,
        "className": "syntax-function"
      },
      {
        "start": 2397,
        "end": 2406,
        "className": "syntax-variable"
      },
      {
        "start": 2408,
        "end": 2409,
        "className": "syntax-number"
      },
      {
        "start": 2423,
        "end": 2437,
        "className": "syntax-variable"
      },
      {
        "start": 2438,
        "end": 2439,
        "className": "syntax-operator"
      },
      {
        "start": 2440,
        "end": 2452,
        "className": "syntax-variable"
      },
      {
        "start": 2452,
        "end": 2454,
        "className": "syntax-operator"
      },
      {
        "start": 2454,
        "end": 2456,
        "className": "syntax-property"
      },
      {
        "start": 2468,
        "end": 2480,
        "className": "syntax-variable"
      },
      {
        "start": 2480,
        "end": 2482,
        "className": "syntax-operator"
      },
      {
        "start": 2482,
        "end": 2484,
        "className": "syntax-property"
      },
      {
        "start": 2485,
        "end": 2486,
        "className": "syntax-operator"
      },
      {
        "start": 2487,
        "end": 2488,
        "className": "syntax-variable"
      },
      {
        "start": 2500,
        "end": 2514,
        "className": "syntax-variable"
      },
      {
        "start": 2514,
        "end": 2516,
        "className": "syntax-operator"
      },
      {
        "start": 2516,
        "end": 2518,
        "className": "syntax-property"
      },
      {
        "start": 2519,
        "end": 2520,
        "className": "syntax-operator"
      },
      {
        "start": 2521,
        "end": 2522,
        "className": "syntax-variable"
      },
      {
        "start": 2535,
        "end": 2537,
        "className": "syntax-keyword"
      },
      {
        "start": 2540,
        "end": 2557,
        "className": "syntax-function"
      },
      {
        "start": 2559,
        "end": 2563,
        "className": "syntax-variable"
      },
      {
        "start": 2580,
        "end": 2581,
        "className": "syntax-variable"
      },
      {
        "start": 2581,
        "end": 2583,
        "className": "syntax-operator"
      },
      {
        "start": 2583,
        "end": 2594,
        "className": "syntax-property"
      },
      {
        "start": 2595,
        "end": 2596,
        "className": "syntax-operator"
      },
      {
        "start": 2597,
        "end": 2601,
        "className": "syntax-constant"
      },
      {
        "start": 2615,
        "end": 2616,
        "className": "syntax-variable"
      },
      {
        "start": 2616,
        "end": 2618,
        "className": "syntax-operator"
      },
      {
        "start": 2618,
        "end": 2629,
        "className": "syntax-property"
      },
      {
        "start": 2630,
        "end": 2631,
        "className": "syntax-operator"
      },
      {
        "start": 2632,
        "end": 2636,
        "className": "syntax-constant"
      },
      {
        "start": 2661,
        "end": 2669,
        "className": "syntax-function"
      },
      {
        "start": 2670,
        "end": 2671,
        "className": "syntax-variable"
      },
      {
        "start": 2673,
        "end": 2677,
        "className": "syntax-variable"
      },
      {
        "start": 2680,
        "end": 2690,
        "className": "syntax-constant"
      },
      {
        "start": 2703,
        "end": 2704,
        "className": "syntax-variable"
      },
      {
        "start": 2704,
        "end": 2706,
        "className": "syntax-operator"
      },
      {
        "start": 2706,
        "end": 2708,
        "className": "syntax-property"
      },
      {
        "start": 2709,
        "end": 2710,
        "className": "syntax-operator"
      },
      {
        "start": 2711,
        "end": 2723,
        "className": "syntax-variable"
      },
      {
        "start": 2735,
        "end": 2736,
        "className": "syntax-variable"
      },
      {
        "start": 2736,
        "end": 2738,
        "className": "syntax-operator"
      },
      {
        "start": 2738,
        "end": 2740,
        "className": "syntax-property"
      },
      {
        "start": 2741,
        "end": 2742,
        "className": "syntax-operator"
      },
      {
        "start": 2743,
        "end": 2757,
        "className": "syntax-variable"
      },
      {
        "start": 2769,
        "end": 2777,
        "className": "syntax-function"
      },
      {
        "start": 2778,
        "end": 2779,
        "className": "syntax-variable"
      },
      {
        "start": 2781,
        "end": 2785,
        "className": "syntax-variable"
      },
      {
        "start": 2807,
        "end": 2811,
        "className": "syntax-keyword"
      },
      {
        "start": 2824,
        "end": 2828,
        "className": "syntax-variable"
      },
      {
        "start": 2829,
        "end": 2831,
        "className": "syntax-operator"
      },
      {
        "start": 2832,
        "end": 2840,
        "className": "syntax-variable"
      },
      {
        "start": 2852,
        "end": 2860,
        "className": "syntax-function"
      },
      {
        "start": 2861,
        "end": 2862,
        "className": "syntax-variable"
      },
      {
        "start": 2864,
        "end": 2868,
        "className": "syntax-variable"
      },
      {
        "start": 2871,
        "end": 2881,
        "className": "syntax-constant"
      },
      {
        "start": 2894,
        "end": 2896,
        "className": "syntax-variable"
      },
      {
        "start": 2896,
        "end": 2898,
        "className": "syntax-operator"
      },
      {
        "start": 2898,
        "end": 2901,
        "className": "syntax-property"
      },
      {
        "start": 2902,
        "end": 2903,
        "className": "syntax-operator"
      },
      {
        "start": 2904,
        "end": 2905,
        "className": "syntax-variable"
      },
      {
        "start": 2926,
        "end": 2931,
        "className": "syntax-keyword"
      },
      {
        "start": 2935,
        "end": 2936,
        "className": "syntax-variable"
      },
      {
        "start": 2937,
        "end": 2938,
        "className": "syntax-operator"
      },
      {
        "start": 2939,
        "end": 2944,
        "className": "syntax-variable"
      },
      {
        "start": 2946,
        "end": 2948,
        "className": "syntax-operator"
      },
      {
        "start": 2949,
        "end": 2953,
        "className": "syntax-constant"
      },
      {
        "start": 2967,
        "end": 2972,
        "className": "syntax-keyword"
      },
      {
        "start": 2974,
        "end": 2976,
        "className": "syntax-variable"
      },
      {
        "start": 2976,
        "end": 2978,
        "className": "syntax-operator"
      },
      {
        "start": 2979,
        "end": 2981,
        "className": "syntax-operator"
      },
      {
        "start": 2982,
        "end": 2987,
        "className": "syntax-variable"
      }
    ]
  },
  {
    "language": "c",
    "name": "c/glibc_memmem.c",
    "code": "void *\n__memmem (const void *haystack, size_t hs_len,\n          const void *needle, size_t ne_len)\n{\n  const unsigned char *hs = (const unsigned char *) haystack;\n  const unsigned char *ne = (const unsigned char *) needle;\n\n  if (ne_len == 0)\n    return (void *) hs;\n  if (ne_len == 1)\n    return (void *) memchr (hs, ne[0], hs_len);\n\n  /* Ensure haystack length is >= needle length.  */\n  if (hs_len < ne_len)\n    return NULL;\n\n  const unsigned char *end = hs + hs_len - ne_len;\n\n  if (ne_len == 2)\n    {\n      uint32_t nw = ne[0] << 16 | ne[1], hw = hs[0] << 16 | hs[1];\n      for (hs++; hs <= end && hw != nw; )\n        hw = hw << 16 | *++hs;\n      return hw == nw ? (void *)hs - 1 : NULL;\n    }\n\n  /* Use Two-Way algorithm for very long needles.  */\n  if (__builtin_expect (ne_len > 256, 0))\n    return two_way_long_needle (hs, hs_len, ne, ne_len);\n\n  uint8_t shift[256];\n  size_t tmp, shift1;\n  size_t m1 = ne_len - 1;\n  size_t offset = 0;\n\n  memset (shift, 0, sizeof (shift));\n  for (int i = 1; i < m1; i++)\n    shift[hash2 (ne + i)] = i;\n  /* Shift1 is the amount we can skip after matching the hash of the\n     needle end but not the full needle.  */\n  shift1 = m1 - shift[hash2 (ne + m1)];\n  shift[hash2 (ne + m1)] = m1;\n\n  for ( ; hs <= end; )\n    {\n      /* Skip past character pairs not in the needle.  */\n      do\n        {\n          hs += m1;\n          tmp = shift[hash2 (hs)];\n        }\n      while (tmp == 0 && hs <= end);\n\n      /* If the match is not at the end of the needle, shift to the end\n         and continue until we match the hash of the needle end.  */\n      hs -= tmp;\n      if (tmp < m1)\n        continue;\n\n      /* Hash of the last 2 characters matches.  If the needle is long,\n         try to quickly filter out mismatches.  */\n      if (m1 < 15 || memcmp (hs + offset, ne + offset, 8) == 0)\n        {\n          if (memcmp (hs, ne, m1) == 0)\n            return (void *) hs;\n\n          /* Adjust filter offset when it doesn't find the mismatch.  */\n          offset = (offset >= 8 ? offset : m1) - 8;\n        }\n\n      /* Skip based on matching the hash of the needle end.  */\n      hs += shift1;\n    }\n  return NULL;\n}\nlibc_hidden_def (__memmem)\nweak_alias (__memmem, memmem)",
    "spans": [
      {
        "start": 0,
        "end": 4,
        "className": "syntax-type"
      },
      {
        "start": 5,
        "end": 6,
        "className": "syntax-operator"
      },
      {
        "start": 7,
        "end": 15,
        "className": "syntax-function"
      },
      {
        "start": 17,
        "end": 22,
        "className": "syntax-keyword"
      },
      {
        "start": 23,
        "end": 27,
        "className": "syntax-type"
      },
      {
        "start": 28,
        "end": 29,
        "className": "syntax-operator"
      },
      {
        "start": 29,
        "end": 37,
        "className": "syntax-variable"
      },
      {
        "start": 39,
        "end": 45,
        "className": "syntax-type"
      },
      {
        "start": 46,
        "end": 52,
        "className": "syntax-variable"
      },
      {
        "start": 64,
        "end": 69,
        "className": "syntax-keyword"
      },
      {
        "start": 70,
        "end": 74,
        "className": "syntax-type"
      },
      {
        "start": 75,
        "end": 76,
        "className": "syntax-operator"
      },
      {
        "start": 76,
        "end": 82,
        "className": "syntax-variable"
      },
      {
        "start": 84,
        "end": 90,
        "className": "syntax-type"
      },
      {
        "start": 91,
        "end": 97,
        "className": "syntax-variable"
      },
      {
        "start": 103,
        "end": 108,
        "className": "syntax-keyword"
      },
      {
        "start": 109,
        "end": 122,
        "className": "syntax-type"
      },
      {
        "start": 123,
        "end": 124,
        "className": "syntax-operator"
      },
      {
        "start": 124,
        "end": 126,
        "className": "syntax-variable"
      },
      {
        "start": 127,
        "end": 128,
        "className": "syntax-operator"
      },
      {
        "start": 130,
        "end": 135,
        "className": "syntax-keyword"
      },
      {
        "start": 136,
        "end": 149,
        "className": "syntax-type"
      },
      {
        "start": 150,
        "end": 151,
        "className": "syntax-operator"
      },
      {
        "start": 153,
        "end": 161,
        "className": "syntax-variable"
      },
      {
        "start": 165,
        "end": 170,
        "className": "syntax-keyword"
      },
      {
        "start": 171,
        "end": 184,
        "className": "syntax-type"
      },
      {
        "start": 185,
        "end": 186,
        "className": "syntax-operator"
      },
      {
        "start": 186,
        "end": 188,
        "className": "syntax-variable"
      },
      {
        "start": 189,
        "end": 190,
        "className": "syntax-operator"
      },
      {
        "start": 192,
        "end": 197,
        "className": "syntax-keyword"
      },
      {
        "start": 198,
        "end": 211,
        "className": "syntax-type"
      },
      {
        "start": 212,
        "end": 213,
        "className": "syntax-operator"
      },
      {
        "start": 215,
        "end": 221,
        "className": "syntax-variable"
      },
      {
        "start": 226,
        "end": 228,
        "className": "syntax-keyword"
      },
      {
        "start": 230,
        "end": 236,
        "className": "syntax-variable"
      },
      {
        "start": 237,
        "end": 239,
        "className": "syntax-operator"
      },
      {
        "start": 240,
        "end": 241,
        "className": "syntax-number"
      },
      {
        "start": 247,
        "end": 253,
        "className": "syntax-keyword"
      },
      {
        "start": 255,
        "end": 259,
        "className": "syntax-type"
      },
      {
        "start": 260,
        "end": 261,
        "className": "syntax-operator"
      },
      {
        "start": 263,
        "end": 265,
        "className": "syntax-variable"
      },
      {
        "start": 269,
        "end": 271,
        "className": "syntax-keyword"
      },
      {
        "start": 273,
        "end": 279,
        "className": "syntax-variable"
      },
      {
        "start": 280,
        "end": 282,
        "className": "syntax-operator"
      },
      {
        "start": 283,
        "end": 284,
        "className": "syntax-number"
      },
      {
        "start": 290,
        "end": 296,
        "className": "syntax-keyword"
      },
      {
        "start": 298,
        "end": 302,
        "className": "syntax-type"
      },
      {
        "start": 303,
        "end": 304,
        "className": "syntax-operator"
      },
      {
        "start": 306,
        "end": 312,
        "className": "syntax-function"
      },
      {
        "start": 314,
        "end": 316,
        "className": "syntax-variable"
      },
      {
        "start": 318,
        "end": 320,
        "className": "syntax-variable"
      },
      {
        "start": 321,
        "end": 322,
        "className": "syntax-number"
      },
      {
        "start": 325,
        "end": 331,
        "className": "syntax-variable"
      },
      {
        "start": 337,
        "end": 387,
        "className": "syntax-comment"
      },
      {
        "start": 390,
        "end": 392,
        "className": "syntax-keyword"
      },
      {
        "start": 394,
        "end": 400,
        "className": "syntax-variable"
      },
      {
        "start": 401,
        "end": 402,
        "className": "syntax-operator"
      },
      {
        "start": 403,
        "end": 409,
        "className": "syntax-variable"
      },
      {
        "start": 415,
        "end": 421,
        "className": "syntax-keyword"
      },
      {
        "start": 422,
        "end": 426,
        "className": "syntax-constant"
      },
      {
        "start": 431,
        "end": 436,
        "className": "syntax-keyword"
      },
      {
        "start": 437,
        "end": 450,
        "className": "syntax-type"
      },
      {
        "start": 451,
        "end": 452,
        "className": "syntax-operator"
      },
      {
        "start": 452,
        "end": 455,
        "className": "syntax-variable"
      },
      {
        "start": 456,
        "end": 457,
        "className": "syntax-operator"
      },
      {
        "start": 458,
        "end": 460,
        "className": "syntax-variable"
      },
      {
        "start": 461,
        "end": 462,
        "className": "syntax-operator"
      },
      {
        "start": 463,
        "end": 469,
        "className": "syntax-variable"
      },
      {
        "start": 470,
        "end": 471,
        "className": "syntax-operator"
      },
      {
        "start": 472,
        "end": 478,
        "className": "syntax-variable"
      },
      {
        "start": 483,
        "end": 485,
        "className": "syntax-keyword"
      },
      {
        "start": 487,
        "end": 493,
        "className": "syntax-variable"
      },
      {
        "start": 494,
        "end": 496,
        "className": "syntax-operator"
      },
      {
        "start": 497,
        "end": 498,
        "className": "syntax-number"
      },
      {
        "start": 512,
        "end": 520,
        "className": "syntax-type"
      },
      {
        "start": 521,
        "end": 523,
        "className": "syntax-variable"
      },
      {
        "start": 524,
        "end": 525,
        "className": "syntax-operator"
      },
      {
        "start": 526,
        "end": 528,
        "className": "syntax-variable"
      },
      {
        "start": 529,
        "end": 530,
        "className": "syntax-number"
      },
      {
        "start": 535,
        "end": 537,
        "className": "syntax-number"
      },
      {
        "start": 540,
        "end": 542,
        "className": "syntax-variable"
      },
      {
        "start": 543,
        "end": 544,
        "className": "syntax-number"
      },
      {
        "start": 547,
        "end": 549,
        "className": "syntax-variable"
      },
      {
        "start": 550,
        "end": 551,
        "className": "syntax-operator"
      },
      {
        "start": 552,
        "end": 554,
        "className": "syntax-variable"
      },
      {
        "start": 555,
        "end": 556,
        "className": "syntax-number"
      },
      {
        "start": 561,
        "end": 563,
        "className": "syntax-number"
      },
      {
        "start": 566,
        "end": 568,
        "className": "syntax-variable"
      },
      {
        "start": 569,
        "end": 570,
        "className": "syntax-number"
      },
      {
        "start": 579,
        "end": 582,
        "className": "syntax-keyword"
      },
      {
        "start": 584,
        "end": 586,
        "className": "syntax-variable"
      },
      {
        "start": 586,
        "end": 588,
        "className": "syntax-operator"
      },
      {
        "start": 590,
        "end": 592,
        "className": "syntax-variable"
      },
      {
        "start": 596,
        "end": 599,
        "className": "syntax-variable"
      },
      {
        "start": 600,
        "end": 602,
        "className": "syntax-operator"
      },
      {
        "start": 603,
        "end": 605,
        "className": "syntax-variable"
      },
      {
        "start": 606,
        "end": 608,
        "className": "syntax-operator"
      },
      {
        "start": 609,
        "end": 611,
        "className": "syntax-variable"
      },
      {
        "start": 623,
        "end": 625,
        "className": "syntax-variable"
      },
      {
        "start": 626,
        "end": 627,
        "className": "syntax-operator"
      },
      {
        "start": 628,
        "end": 630,
        "className": "syntax-variable"
      },
      {
        "start": 634,
        "end": 636,
        "className": "syntax-number"
      },
      {
        "start": 639,
        "end": 642,
        "className": "syntax-operator"
      },
      {
        "start": 642,
        "end": 644,
        "className": "syntax-variable"
      },
      {
        "start": 652,
        "end": 658,
        "className": "syntax-keyword"
      },
      {
        "start": 659,
        "end": 661,
        "className": "syntax-variable"
      },
      {
        "start": 662,
        "end": 664,
        "className": "syntax-operator"
      },
      {
        "start": 665,
        "end": 667,
        "className": "syntax-variable"
      },
      {
        "start": 671,
        "end": 675,
        "className": "syntax-type"
      },
      {
        "start": 676,
        "end": 677,
        "className": "syntax-operator"
      },
      {
        "start": 678,
        "end": 680,
        "className": "syntax-variable"
      },
      {
        "start": 681,
        "end": 682,
        "className": "syntax-operator"
      },
      {
        "start": 683,
        "end": 684,
        "className": "syntax-number"
      },
      {
        "start": 687,
        "end": 691,
        "className": "syntax-constant"
      },
      {
        "start": 702,
        "end": 753,
        "className": "syntax-comment"
      },
      {
        "start": 756,
        "end": 758,
        "className": "syntax-keyword"
      },
      {
        "start": 760,
        "end": 776,
        "className": "syntax-function"
      },
      {
        "start": 778,
        "end": 784,
        "className": "syntax-variable"
      },
      {
        "start": 785,
        "end": 786,
        "className": "syntax-operator"
      },
      {
        "start": 787,
        "end": 790,
        "className": "syntax-number"
      },
      {
        "start": 792,
        "end": 793,
        "className": "syntax-number"
      },
      {
        "start": 800,
        "end": 806,
        "className": "syntax-keyword"
      },
      {
        "start": 807,
        "end": 826,
        "className": "syntax-function"
      },
      {
        "start": 828,
        "end": 830,
        "className": "syntax-variable"
      },
      {
        "start": 832,
        "end": 838,
        "className": "syntax-variable"
      },
      {
        "start": 840,
        "end": 842,
        "className": "syntax-variable"
      },
      {
        "start": 844,
        "end": 850,
        "className": "syntax-variable"
      },
      {
        "start": 856,
        "end": 863,
        "className": "syntax-type"
      },
      {
        "start": 864,
        "end": 869,
        "className": "syntax-variable"
      },
      {
        "start": 870,
        "end": 873,
        "className": "syntax-number"
      },
      {
        "start": 878,
        "end": 884,
        "className": "syntax-type"
      },
      {
        "start": 885,
        "end": 888,
        "className": "syntax-variable"
      },
      {
        "start": 890,
        "end": 896,
        "className": "syntax-variable"
      },
      {
        "start": 900,
        "end": 906,
        "className": "syntax-type"
      },
      {
        "start": 907,
        "end": 909,
        "className": "syntax-variable"
      },
      {
        "start": 910,
        "end": 911,
        "className": "syntax-operator"
      },
      {
        "start": 912,
        "end": 918,
        "className": "syntax-variable"
      },
      {
        "start": 919,
        "end": 920,
        "className": "syntax-operator"
      },
      {
        "start": 921,
        "end": 922,
        "className": "syntax-number"
      },
      {
        "start": 926,
        "end": 932,
        "className": "syntax-type"
      },
      {
        "start": 933,
        "end": 939,
        "className": "syntax-variable"
      },
      {
        "start": 940,
        "end": 941,
        "className": "syntax-operator"
      },
      {
        "start": 942,
        "end": 943,
        "className": "syntax-number"
      },
      {
        "start": 948,
        "end": 954,
        "className": "syntax-function"
      },
      {
        "start": 956,
        "end": 961,
        "className": "syntax-variable"
      },
      {
        "start": 963,
        "end": 964,
        "className": "syntax-number"
      },
      {
        "start": 966,
        "end": 972,
        "className": "syntax-keyword"
      },
      {
        "start": 974,
        "end": 979,
        "className": "syntax-variable"
      },
      {
        "start": 985,
        "end": 988,
        "className": "syntax-keyword"
      },
      {
        "start": 990,
        "end": 993,
        "className": "syntax-type"
      },
      {
        "start": 994,
        "end": 995,
        "className": "syntax-variable"
      },
      {
        "start": 996,
        "end": 997,
        "className": "syntax-operator"
      },
      {
        "start": 998,
        "end": 999,
        "className": "syntax-number"
      },
      {
        "start": 1001,
        "end": 1002,
        "className": "syntax-variable"
      },
      {
        "start": 1003,
        "end": 1004,
        "className": "syntax-operator"
      },
      {
        "start": 1005,
        "end": 1007,
        "className": "syntax-variable"
      },
      {
        "start": 1009,
        "end": 1010,
        "className": "syntax-variable"
      },
      {
        "start": 1010,
        "end": 1012,
        "className": "syntax-operator"
      },
      {
        "start": 1018,
        "end": 1023,
        "className": "syntax-variable"
      },
      {
        "start": 1024,
        "end": 1029,
        "className": "syntax-function"
      },
      {
        "start": 1031,
        "end": 1033,
        "className": "syntax-variable"
      },
      {
        "start": 1034,
        "end": 1035,
        "className": "syntax-operator"
      },
      {
        "start": 1036,
        "end": 1037,
        "className": "syntax-variable"
      },
      {
        "start": 1040,
        "end": 1041,
        "className": "syntax-operator"
      },
      {
        "start": 1042,
        "end": 1043,
        "className": "syntax-variable"
      },
      {
        "start": 1047,
        "end": 1113,
        "className": "syntax-comment"
      },
      {
        "start": 1114,
        "end": 1158,
        "className": "syntax-comment"
      },
      {
        "start": 1161,
        "end": 1167,
        "className": "syntax-variable"
      },
      {
        "start": 1168,
        "end": 1169,
        "className": "syntax-operator"
      },
      {
        "start": 1170,
        "end": 1172,
        "className": "syntax-variable"
      },
      {
        "start": 1173,
        "end": 1174,
        "className": "syntax-operator"
      },
      {
        "start": 1175,
        "end": 1180,
        "className": "syntax-variable"
      },
      {
        "start": 1181,
        "end": 1186,
        "className": "syntax-function"
      },
      {
        "start": 1188,
        "end": 1190,
        "className": "syntax-variable"
      },
      {
        "start": 1191,
        "end": 1192,
        "className": "syntax-operator"
      },
      {
        "start": 1193,
        "end": 1195,
        "className": "syntax-variable"
      },
      {
        "start": 1201,
        "end": 1206,
        "className": "syntax-variable"
      },
      {
        "start": 1207,
        "end": 1212,
        "className": "syntax-function"
      },
      {
        "start": 1214,
        "end": 1216,
        "className": "syntax-variable"
      },
      {
        "start": 1217,
        "end": 1218,
        "className": "syntax-operator"
      },
      {
        "start": 1219,
        "end": 1221,
        "className": "syntax-variable"
      },
      {
        "start": 1224,
        "end": 1225,
        "className": "syntax-operator"
      },
      {
        "start": 1226,
        "end": 1228,
        "className": "syntax-variable"
      },
      {
        "start": 1233,
        "end": 1236,
        "className": "syntax-keyword"
      },
      {
        "start": 1241,
        "end": 1243,
        "className": "syntax-variable"
      },
      {
        "start": 1247,
        "end": 1250,
        "className": "syntax-variable"
      },
      {
        "start": 1266,
        "end": 1317,
        "className": "syntax-comment"
      },
      {
        "start": 1324,
        "end": 1326,
        "className": "syntax-keyword"
      },
      {
        "start": 1347,
        "end": 1349,
        "className": "syntax-variable"
      },
      {
        "start": 1350,
        "end": 1352,
        "className": "syntax-operator"
      },
      {
        "start": 1353,
        "end": 1355,
        "className": "syntax-variable"
      },
      {
        "start": 1367,
        "end": 1370,
        "className": "syntax-variable"
      },
      {
        "start": 1371,
        "end": 1372,
        "className": "syntax-operator"
      },
      {
        "start": 1373,
        "end": 1378,
        "className": "syntax-variable"
      },
      {
        "start": 1379,
        "end": 1384,
        "className": "syntax-function"
      },
      {
        "start": 1386,
        "end": 1388,
        "className": "syntax-variable"
      },
      {
        "start": 1408,
        "end": 1413,
        "className": "syntax-keyword"
      },
      {
        "start": 1415,
        "end": 1418,
        "className": "syntax-variable"
      },
      {
        "start": 1419,
        "end": 1421,
        "className": "syntax-operator"
      },
      {
        "start": 1422,
        "end": 1423,
        "className": "syntax-number"
      },
      {
        "start": 1424,
        "end": 1426,
        "className": "syntax-operator"
      },
      {
        "start": 1427,
        "end": 1429,
        "className": "syntax-variable"
      },
      {
        "start": 1433,
        "end": 1436,
        "className": "syntax-variable"
      },
      {
        "start": 1446,
        "end": 1511,
        "className": "syntax-comment"
      },
      {
        "start": 1512,
        "end": 1580,
        "className": "syntax-comment"
      },
      {
        "start": 1587,
        "end": 1589,
        "className": "syntax-variable"
      },
      {
        "start": 1590,
        "end": 1592,
        "className": "syntax-operator"
      },
      {
        "start": 1593,
        "end": 1596,
        "className": "syntax-variable"
      },
      {
        "start": 1604,
        "end": 1606,
        "className": "syntax-keyword"
      },
      {
        "start": 1608,
        "end": 1611,
        "className": "syntax-variable"
      },
      {
        "start": 1612,
        "end": 1613,
        "className": "syntax-operator"
      },
      {
        "start": 1614,
        "end": 1616,
        "className": "syntax-variable"
      },
      {
        "start": 1626,
        "end": 1634,
        "className": "syntax-keyword"
      },
      {
        "start": 1643,
        "end": 1708,
        "className": "syntax-comment"
      },
      {
        "start": 1709,
        "end": 1759,
        "className": "syntax-comment"
      },
      {
        "start": 1766,
        "end": 1768,
        "className": "syntax-keyword"
      },
      {
        "start": 1770,
        "end": 1772,
        "className": "syntax-variable"
      },
      {
        "start": 1773,
        "end": 1774,
        "className": "syntax-operator"
      },
      {
        "start": 1775,
        "end": 1777,
        "className": "syntax-number"
      },
      {
        "start": 1778,
        "end": 1780,
        "className": "syntax-operator"
      },
      {
        "start": 1781,
        "end": 1787,
        "className": "syntax-function"
      },
      {
        "start": 1789,
        "end": 1791,
        "className": "syntax-variable"
      },
      {
        "start": 1792,
        "end": 1793,
        "className": "syntax-operator"
      },
      {
        "start": 1794,
        "end": 1800,
        "className": "syntax-variable"
      },
      {
        "start": 1802,
        "end": 1804,
        "className": "syntax-variable"
      },
      {
        "start": 1805,
        "end": 1806,
        "className": "syntax-operator"
      },
      {
        "start": 1807,
        "end": 1813,
        "className": "syntax-variable"
      },
      {
        "start": 1815,
        "end": 1816,
        "className": "syntax-number"
      },
      {
        "start": 1818,
        "end": 1820,
        "className": "syntax-operator"
      },
      {
        "start": 1821,
        "end": 1822,
        "className": "syntax-number"
      },
      {
        "start": 1844,
        "end": 1846,
        "className": "syntax-keyword"
      },
      {
        "start": 1848,
        "end": 1854,
        "className": "syntax-function"
      },
      {
        "start": 1856,
        "end": 1858,
        "className": "syntax-variable"
      },
      {
        "start": 1860,
        "end": 1862,
        "className": "syntax-variable"
      },
      {
        "start": 1864,
        "end": 1866,
        "className": "syntax-variable"
      },
      {
        "start": 1868,
        "end": 1870,
        "className": "syntax-operator"
      },
      {
        "start": 1871,
        "end": 1872,
        "className": "syntax-number"
      },
      {
        "start": 1886,
        "end": 1892,
        "className": "syntax-keyword"
      },
      {
        "start": 1894,
        "end": 1898,
        "className": "syntax-type"
      },
      {
        "start": 1899,
        "end": 1900,
        "className": "syntax-operator"
      },
      {
        "start": 1902,
        "end": 1904,
        "className": "syntax-variable"
      },
      {
        "start": 1917,
        "end": 1979,
        "className": "syntax-comment"
      },
      {
        "start": 1990,
        "end": 1996,
        "className": "syntax-variable"
      },
      {
        "start": 1997,
        "end": 1998,
        "className": "syntax-operator"
      },
      {
        "start": 2000,
        "end": 2006,
        "className": "syntax-variable"
      },
      {
        "start": 2010,
        "end": 2011,
        "className": "syntax-number"
      },
      {
        "start": 2014,
        "end": 2020,
        "className": "syntax-variable"
      },
      {
        "start": 2023,
        "end": 2025,
        "className": "syntax-variable"
      },
      {
        "start": 2027,
        "end": 2028,
        "className": "syntax-operator"
      },
      {
        "start": 2029,
        "end": 2030,
        "className": "syntax-number"
      },
      {
        "start": 2049,
        "end": 2106,
        "className": "syntax-comment"
      },
      {
        "start": 2113,
        "end": 2115,
        "className": "syntax-variable"
      },
      {
        "start": 2116,
        "end": 2118,
        "className": "syntax-operator"
      },
      {
        "start": 2119,
        "end": 2125,
        "className": "syntax-variable"
      },
      {
        "start": 2135,
        "end": 2141,
        "className": "syntax-keyword"
      },
      {
        "start": 2142,
        "end": 2146,
        "className": "syntax-constant"
      },
      {
        "start": 2150,
        "end": 2165,
        "className": "syntax-variable"
      },
      {
        "start": 2167,
        "end": 2175,
        "className": "syntax-type"
      },
      {
        "start": 2177,
        "end": 2187,
        "className": "syntax-function"
      },
      {
        "start": 2189,
        "end": 2197,
        "className": "syntax-variable"
      },
      {
        "start": 2199,
        "end": 2205,
        "className": "syntax-variable"
      }
    ]
  },
  {
    "language": "c",
    "name": "c/neovim_extmark_details.c",
    "code": "static Array extmark_to_array(MTPair extmark, bool id, bool add_dict, bool hl_name, Arena *arena)\n{\n  MTKey start = extmark.start;\n  Array rv = arena_array(arena, 4);\n  if (id) {\n    ADD_C(rv, INTEGER_OBJ((Integer)start.id));\n  }\n  ADD_C(rv, INTEGER_OBJ(start.pos.row));\n  ADD_C(rv, INTEGER_OBJ(start.pos.col));\n\n  if (add_dict) {\n    // TODO(bfredl): coding the size like this is a bit fragile.\n    // We want ArrayOf(Dict(set_extmark)) as the return type..\n    Dict dict = arena_dict(arena, ARRAY_SIZE(set_extmark_table));\n\n    PUT_C(dict, \"ns_id\", INTEGER_OBJ((Integer)start.ns));\n\n    PUT_C(dict, \"right_gravity\", BOOLEAN_OBJ(mt_right(start)));\n\n    if (mt_paired(start)) {\n      PUT_C(dict, \"end_row\", INTEGER_OBJ(extmark.end_pos.row));\n      PUT_C(dict, \"end_col\", INTEGER_OBJ(extmark.end_pos.col));\n      PUT_C(dict, \"end_right_gravity\", BOOLEAN_OBJ(extmark.end_right_gravity));\n    }\n\n    if (mt_no_undo(start)) {\n      PUT_C(dict, \"undo_restore\", BOOLEAN_OBJ(false));\n    }\n\n    if (mt_invalidate(start)) {\n      PUT_C(dict, \"invalidate\", BOOLEAN_OBJ(true));\n    }\n    if (mt_invalid(start)) {\n      PUT_C(dict, \"invalid\", BOOLEAN_OBJ(true));\n    }\n\n    decor_to_dict_legacy(&dict, mt_decor(start), hl_name, arena);\n\n    ADD_C(rv, DICT_OBJ(dict));\n  }\n\n  return rv;\n}",
    "spans": [
      {
        "start": 0,
        "end": 6,
        "className": "syntax-keyword"
      },
      {
        "start": 7,
        "end": 12,
        "className": "syntax-type"
      },
      {
        "start": 13,
        "end": 29,
        "className": "syntax-function"
      },
      {
        "start": 30,
        "end": 36,
        "className": "syntax-type"
      },
      {
        "start": 37,
        "end": 44,
        "className": "syntax-variable"
      },
      {
        "start": 46,
        "end": 50,
        "className": "syntax-type"
      },
      {
        "start": 51,
        "end": 53,
        "className": "syntax-variable"
      },
      {
        "start": 55,
        "end": 59,
        "className": "syntax-type"
      },
      {
        "start": 60,
        "end": 68,
        "className": "syntax-variable"
      },
      {
        "start": 70,
        "end": 74,
        "className": "syntax-type"
      },
      {
        "start": 75,
        "end": 82,
        "className": "syntax-variable"
      },
      {
        "start": 84,
        "end": 89,
        "className": "syntax-type"
      },
      {
        "start": 90,
        "end": 91,
        "className": "syntax-operator"
      },
      {
        "start": 91,
        "end": 96,
        "className": "syntax-variable"
      },
      {
        "start": 102,
        "end": 107,
        "className": "syntax-type"
      },
      {
        "start": 108,
        "end": 113,
        "className": "syntax-variable"
      },
      {
        "start": 114,
        "end": 115,
        "className": "syntax-operator"
      },
      {
        "start": 116,
        "end": 123,
        "className": "syntax-variable"
      },
      {
        "start": 124,
        "end": 129,
        "className": "syntax-property"
      },
      {
        "start": 133,
        "end": 138,
        "className": "syntax-type"
      },
      {
        "start": 139,
        "end": 141,
        "className": "syntax-variable"
      },
      {
        "start": 142,
        "end": 143,
        "className": "syntax-operator"
      },
      {
        "start": 144,
        "end": 155,
        "className": "syntax-function"
      },
      {
        "start": 156,
        "end": 161,
        "className": "syntax-variable"
      },
      {
        "start": 163,
        "end": 164,
        "className": "syntax-number"
      },
      {
        "start": 169,
        "end": 171,
        "className": "syntax-keyword"
      },
      {
        "start": 173,
        "end": 175,
        "className": "syntax-variable"
      },
      {
        "start": 183,
        "end": 188,
        "className": "syntax-function"
      },
      {
        "start": 189,
        "end": 191,
        "className": "syntax-variable"
      },
      {
        "start": 193,
        "end": 204,
        "className": "syntax-function"
      },
      {
        "start": 206,
        "end": 213,
        "className": "syntax-type"
      },
      {
        "start": 214,
        "end": 219,
        "className": "syntax-variable"
      },
      {
        "start": 220,
        "end": 222,
        "className": "syntax-property"
      },
      {
        "start": 232,
        "end": 237,
        "className": "syntax-function"
      },
      {
        "start": 238,
        "end": 240,
        "className": "syntax-variable"
      },
      {
        "start": 242,
        "end": 253,
        "className": "syntax-function"
      },
      {
        "start": 254,
        "end": 259,
        "className": "syntax-variable"
      },
      {
        "start": 260,
        "end": 263,
        "className": "syntax-property"
      },
      {
        "start": 264,
        "end": 267,
        "className": "syntax-property"
      },
      {
        "start": 273,
        "end": 278,
        "className": "syntax-function"
      },
      {
        "start": 279,
        "end": 281,
        "className": "syntax-variable"
      },
      {
        "start": 283,
        "end": 294,
        "className": "syntax-function"
      },
      {
        "start": 295,
        "end": 300,
        "className": "syntax-variable"
      },
      {
        "start": 301,
        "end": 304,
        "className": "syntax-property"
      },
      {
        "start": 305,
        "end": 308,
        "className": "syntax-property"
      },
      {
        "start": 315,
        "end": 317,
        "className": "syntax-keyword"
      },
      {
        "start": 319,
        "end": 327,
        "className": "syntax-variable"
      },
      {
        "start": 335,
        "end": 395,
        "className": "syntax-comment"
      },
      {
        "start": 400,
        "end": 458,
        "className": "syntax-comment"
      },
      {
        "start": 463,
        "end": 467,
        "className": "syntax-type"
      },
      {
        "start": 468,
        "end": 472,
        "className": "syntax-variable"
      },
      {
        "start": 473,
        "end": 474,
        "className": "syntax-operator"
      },
      {
        "start": 475,
        "end": 485,
        "className": "syntax-function"
      },
      {
        "start": 486,
        "end": 491,
        "className": "syntax-variable"
      },
      {
        "start": 493,
        "end": 503,
        "className": "syntax-function"
      },
      {
        "start": 504,
        "end": 521,
        "className": "syntax-variable"
      },
      {
        "start": 530,
        "end": 535,
        "className": "syntax-function"
      },
      {
        "start": 536,
        "end": 540,
        "className": "syntax-variable"
      },
      {
        "start": 542,
        "end": 549,
        "className": "syntax-string"
      },
      {
        "start": 551,
        "end": 562,
        "className": "syntax-function"
      },
      {
        "start": 564,
        "end": 571,
        "className": "syntax-type"
      },
      {
        "start": 572,
        "end": 577,
        "className": "syntax-variable"
      },
      {
        "start": 578,
        "end": 580,
        "className": "syntax-property"
      },
      {
        "start": 589,
        "end": 594,
        "className": "syntax-function"
      },
      {
        "start": 595,
        "end": 599,
        "className": "syntax-variable"
      },
      {
        "start": 601,
        "end": 616,
        "className": "syntax-string"
      },
      {
        "start": 618,
        "end": 629,
        "className": "syntax-function"
      },
      {
        "start": 630,
        "end": 638,
        "className": "syntax-function"
      },
      {
        "start": 639,
        "end": 644,
        "className": "syntax-variable"
      },
      {
        "start": 654,
        "end": 656,
        "className": "syntax-keyword"
      },
      {
        "start": 658,
        "end": 667,
        "className": "syntax-function"
      },
      {
        "start": 668,
        "end": 673,
        "className": "syntax-variable"
      },
      {
        "start": 684,
        "end": 689,
        "className": "syntax-function"
      },
      {
        "start": 690,
        "end": 694,
        "className": "syntax-variable"
      },
      {
        "start": 696,
        "end": 705,
        "className": "syntax-string"
      },
      {
        "start": 707,
        "end": 718,
        "className": "syntax-function"
      },
      {
        "start": 719,
        "end": 726,
        "className": "syntax-variable"
      },
      {
        "start": 727,
        "end": 734,
        "className": "syntax-property"
      },
      {
        "start": 735,
        "end": 738,
        "className": "syntax-property"
      },
      {
        "start": 748,
        "end": 753,
        "className": "syntax-function"
      },
      {
        "start": 754,
        "end": 758,
        "className": "syntax-variable"
      },
      {
        "start": 760,
        "end": 769,
        "className": "syntax-string"
      },
      {
        "start": 771,
        "end": 782,
        "className": "syntax-function"
      },
      {
        "start": 783,
        "end": 790,
        "className": "syntax-variable"
      },
      {
        "start": 791,
        "end": 798,
        "className": "syntax-property"
      },
      {
        "start": 799,
        "end": 802,
        "className": "syntax-property"
      },
      {
        "start": 812,
        "end": 817,
        "className": "syntax-function"
      },
      {
        "start": 818,
        "end": 822,
        "className": "syntax-variable"
      },
      {
        "start": 824,
        "end": 843,
        "className": "syntax-string"
      },
      {
        "start": 845,
        "end": 856,
        "className": "syntax-function"
      },
      {
        "start": 857,
        "end": 864,
        "className": "syntax-variable"
      },
      {
        "start": 865,
        "end": 882,
        "className": "syntax-property"
      },
      {
        "start": 897,
        "end": 899,
        "className": "syntax-keyword"
      },
      {
        "start": 901,
        "end": 911,
        "className": "syntax-function"
      },
      {
        "start": 912,
        "end": 917,
        "className": "syntax-variable"
      },
      {
        "start": 928,
        "end": 933,
        "className": "syntax-function"
      },
      {
        "start": 934,
        "end": 938,
        "className": "syntax-variable"
      },
      {
        "start": 940,
        "end": 954,
        "className": "syntax-string"
      },
      {
        "start": 956,
        "end": 967,
        "className": "syntax-function"
      },
      {
        "start": 988,
        "end": 990,
        "className": "syntax-keyword"
      },
      {
        "start": 992,
        "end": 1005,
        "className": "syntax-function"
      },
      {
        "start": 1006,
        "end": 1011,
        "className": "syntax-variable"
      },
      {
        "start": 1022,
        "end": 1027,
        "className": "syntax-function"
      },
      {
        "start": 1028,
        "end": 1032,
        "className": "syntax-variable"
      },
      {
        "start": 1034,
        "end": 1046,
        "className": "syntax-string"
      },
      {
        "start": 1048,
        "end": 1059,
        "className": "syntax-function"
      },
      {
        "start": 1078,
        "end": 1080,
        "className": "syntax-keyword"
      },
      {
        "start": 1082,
        "end": 1092,
        "className": "syntax-function"
      },
      {
        "start": 1093,
        "end": 1098,
        "className": "syntax-variable"
      },
      {
        "start": 1109,
        "end": 1114,
        "className": "syntax-function"
      },
      {
        "start": 1115,
        "end": 1119,
        "className": "syntax-variable"
      },
      {
        "start": 1121,
        "end": 1130,
        "className": "syntax-string"
      },
      {
        "start": 1132,
        "end": 1143,
        "className": "syntax-function"
      },
      {
        "start": 1163,
        "end": 1183,
        "className": "syntax-function"
      },
      {
        "start": 1184,
        "end": 1185,
        "className": "syntax-operator"
      },
      {
        "start": 1185,
        "end": 1189,
        "className": "syntax-variable"
      },
      {
        "start": 1191,
        "end": 1199,
        "className": "syntax-function"
      },
      {
        "start": 1200,
        "end": 1205,
        "className": "syntax-variable"
      },
      {
        "start": 1208,
        "end": 1215,
        "className": "syntax-variable"
      },
      {
        "start": 1217,
        "end": 1222,
        "className": "syntax-variable"
      },
      {
        "start": 1230,
        "end": 1235,
        "className": "syntax-function"
      },
      {
        "start": 1236,
        "end": 1238,
        "className": "syntax-variable"
      },
      {
        "start": 1240,
        "end": 1248,
        "className": "syntax-function"
      },
      {
        "start": 1249,
        "end": 1253,
        "className": "syntax-variable"
      },
      {
        "start": 1264,
        "end": 1270,
        "className": "syntax-keyword"
      },
      {
        "start": 1271,
        "end": 1273,
        "className": "syntax-variable"
      }
    ]
  },
  {
    "language": "c",
    "name": "c/neovim_wildmode.c",
    "code": "int check_opt_wim(void)\n{\n  uint8_t new_wim_flags[4];\n  int i;\n  int idx = 0;\n\n  for (i = 0; i < 4; i++) {\n    new_wim_flags[i] = 0;\n  }\n\n  for (char *p = p_wim; *p; p++) {\n    // Note: Keep this in sync with opt_wim_values.\n    for (i = 0; ASCII_ISALPHA(p[i]); i++) {}\n    if (p[i] != NUL && p[i] != ',' && p[i] != ':') {\n      return FAIL;\n    }\n    if (i == 7 && strncmp(p, \"longest\", 7) == 0) {\n      new_wim_flags[idx] |= kOptWimFlagLongest;\n    } else if (i == 4 && strncmp(p, \"full\", 4) == 0) {\n      new_wim_flags[idx] |= kOptWimFlagFull;\n    } else if (i == 4 && strncmp(p, \"list\", 4) == 0) {\n      new_wim_flags[idx] |= kOptWimFlagList;\n    } else if (i == 8 && strncmp(p, \"lastused\", 8) == 0) {\n      new_wim_flags[idx] |= kOptWimFlagLastused;\n    } else if (i == 8 && strncmp(p, \"noselect\", 8) == 0) {\n      new_wim_flags[idx] |= kOptWimFlagNoselect;\n    } else if (i == 8 && strncmp(p, \"noinsert\", 8) == 0) {\n      new_wim_flags[idx] |= kOptWimFlagNoinsert;\n    } else {\n      return FAIL;\n    }\n    p += i;\n    if (*p == NUL) {\n      break;\n    }\n    if (*p == ',') {\n      if (idx == 3) {\n        return FAIL;\n      }\n      idx++;\n    }\n  }\n\n  // fill remaining entries with last flag\n  while (idx < 3) {\n    new_wim_flags[idx + 1] = new_wim_flags[idx];\n    idx++;\n  }\n\n  // only when there are no errors, wim_flags[] is changed\n  for (i = 0; i < 4; i++) {\n    wim_flags[i] = new_wim_flags[i];\n  }\n  return OK;\n}",
    "spans": [
      {
        "start": 0,
        "end": 3,
        "className": "syntax-type"
      },
      {
        "start": 4,
        "end": 17,
        "className": "syntax-function"
      },
      {
        "start": 18,
        "end": 22,
        "className": "syntax-type"
      },
      {
        "start": 28,
        "end": 35,
        "className": "syntax-type"
      },
      {
        "start": 36,
        "end": 49,
        "className": "syntax-variable"
      },
      {
        "start": 50,
        "end": 51,
        "className": "syntax-number"
      },
      {
        "start": 56,
        "end": 59,
        "className": "syntax-type"
      },
      {
        "start": 60,
        "end": 61,
        "className": "syntax-variable"
      },
      {
        "start": 65,
        "end": 68,
        "className": "syntax-type"
      },
      {
        "start": 69,
        "end": 72,
        "className": "syntax-variable"
      },
      {
        "start": 73,
        "end": 74,
        "className": "syntax-operator"
      },
      {
        "start": 75,
        "end": 76,
        "className": "syntax-number"
      },
      {
        "start": 81,
        "end": 84,
        "className": "syntax-keyword"
      },
      {
        "start": 86,
        "end": 87,
        "className": "syntax-variable"
      },
      {
        "start": 88,
        "end": 89,
        "className": "syntax-operator"
      },
      {
        "start": 90,
        "end": 91,
        "className": "syntax-number"
      },
      {
        "start": 93,
        "end": 94,
        "className": "syntax-variable"
      },
      {
        "start": 95,
        "end": 96,
        "className": "syntax-operator"
      },
      {
        "start": 97,
        "end": 98,
        "className": "syntax-number"
      },
      {
        "start": 100,
        "end": 101,
        "className": "syntax-variable"
      },
      {
        "start": 101,
        "end": 103,
        "className": "syntax-operator"
      },
      {
        "start": 111,
        "end": 124,
        "className": "syntax-variable"
      },
      {
        "start": 125,
        "end": 126,
        "className": "syntax-variable"
      },
      {
        "start": 128,
        "end": 129,
        "className": "syntax-operator"
      },
      {
        "start": 130,
        "end": 131,
        "className": "syntax-number"
      },
      {
        "start": 140,
        "end": 143,
        "className": "syntax-keyword"
      },
      {
        "start": 145,
        "end": 149,
        "className": "syntax-type"
      },
      {
        "start": 150,
        "end": 151,
        "className": "syntax-operator"
      },
      {
        "start": 151,
        "end": 152,
        "className": "syntax-variable"
      },
      {
        "start": 153,
        "end": 154,
        "className": "syntax-operator"
      },
      {
        "start": 155,
        "end": 160,
        "className": "syntax-variable"
      },
      {
        "start": 162,
        "end": 163,
        "className": "syntax-operator"
      },
      {
        "start": 163,
        "end": 164,
        "className": "syntax-variable"
      },
      {
        "start": 166,
        "end": 167,
        "className": "syntax-variable"
      },
      {
        "start": 167,
        "end": 169,
        "className": "syntax-operator"
      },
      {
        "start": 177,
        "end": 224,
        "className": "syntax-comment"
      },
      {
        "start": 229,
        "end": 232,
        "className": "syntax-keyword"
      },
      {
        "start": 234,
        "end": 235,
        "className": "syntax-variable"
      },
      {
        "start": 236,
        "end": 237,
        "className": "syntax-operator"
      },
      {
        "start": 238,
        "end": 239,
        "className": "syntax-number"
      },
      {
        "start": 241,
        "end": 254,
        "className": "syntax-function"
      },
      {
        "start": 255,
        "end": 256,
        "className": "syntax-variable"
      },
      {
        "start": 257,
        "end": 258,
        "className": "syntax-variable"
      },
      {
        "start": 262,
        "end": 263,
        "className": "syntax-variable"
      },
      {
        "start": 263,
        "end": 265,
        "className": "syntax-operator"
      },
      {
        "start": 274,
        "end": 276,
        "className": "syntax-keyword"
      },
      {
        "start": 278,
        "end": 279,
        "className": "syntax-variable"
      },
      {
        "start": 280,
        "end": 281,
        "className": "syntax-variable"
      },
      {
        "start": 283,
        "end": 285,
        "className": "syntax-operator"
      },
      {
        "start": 286,
        "end": 289,
        "className": "syntax-constant"
      },
      {
        "start": 290,
        "end": 292,
        "className": "syntax-operator"
      },
      {
        "start": 293,
        "end": 294,
        "className": "syntax-variable"
      },
      {
        "start": 295,
        "end": 296,
        "className": "syntax-variable"
      },
      {
        "start": 298,
        "end": 300,
        "className": "syntax-operator"
      },
      {
        "start": 301,
        "end": 304,
        "className": "syntax-number"
      },
      {
        "start": 305,
        "end": 307,
        "className": "syntax-operator"
      },
      {
        "start": 308,
        "end": 309,
        "className": "syntax-variable"
      },
      {
        "start": 310,
        "end": 311,
        "className": "syntax-variable"
      },
      {
        "start": 313,
        "end": 315,
        "className": "syntax-operator"
      },
      {
        "start": 316,
        "end": 319,
        "className": "syntax-number"
      },
      {
        "start": 329,
        "end": 335,
        "className": "syntax-keyword"
      },
      {
        "start": 336,
        "end": 340,
        "className": "syntax-constant"
      },
      {
        "start": 352,
        "end": 354,
        "className": "syntax-keyword"
      },
      {
        "start": 356,
        "end": 357,
        "className": "syntax-variable"
      },
      {
        "start": 358,
        "end": 360,
        "className": "syntax-operator"
      },
      {
        "start": 361,
        "end": 362,
        "className": "syntax-number"
      },
      {
        "start": 363,
        "end": 365,
        "className": "syntax-operator"
      },
      {
        "start": 366,
        "end": 373,
        "className": "syntax-function"
      },
      {
        "start": 374,
        "end": 375,
        "className": "syntax-variable"
      },
      {
        "start": 377,
        "end": 386,
        "className": "syntax-string"
      },
      {
        "start": 388,
        "end": 389,
        "className": "syntax-number"
      },
      {
        "start": 391,
        "end": 393,
        "className": "syntax-operator"
      },
      {
        "start": 394,
        "end": 395,
        "className": "syntax-number"
      },
      {
        "start": 405,
        "end": 418,
        "className": "syntax-variable"
      },
      {
        "start": 419,
        "end": 422,
        "className": "syntax-variable"
      },
      {
        "start": 427,
        "end": 445,
        "className": "syntax-variable"
      },
      {
        "start": 453,
        "end": 457,
        "className": "syntax-keyword"
      },
      {
        "start": 458,
        "end": 460,
        "className": "syntax-keyword"
      },
      {
        "start": 462,
        "end": 463,
        "className": "syntax-variable"
      },
      {
        "start": 464,
        "end": 466,
        "className": "syntax-operator"
      },
      {
        "start": 467,
        "end": 468,
        "className": "syntax-number"
      },
      {
        "start": 469,
        "end": 471,
        "className": "syntax-operator"
      },
      {
        "start": 472,
        "end": 479,
        "className": "syntax-function"
      },
      {
        "start": 480,
        "end": 481,
        "className": "syntax-variable"
      },
      {
        "start": 483,
        "end": 489,
        "className": "syntax-string"
      },
      {
        "start": 491,
        "end": 492,
        "className": "syntax-number"
      },
      {
        "start": 494,
        "end": 496,
        "className": "syntax-operator"
      },
      {
        "start": 497,
        "end": 498,
        "className": "syntax-number"
      },
      {
        "start": 508,
        "end": 521,
        "className": "syntax-variable"
      },
      {
        "start": 522,
        "end": 525,
        "className": "syntax-variable"
      },
      {
        "start": 530,
        "end": 545,
        "className": "syntax-variable"
      },
      {
        "start": 553,
        "end": 557,
        "className": "syntax-keyword"
      },
      {
        "start": 558,
        "end": 560,
        "className": "syntax-keyword"
      },
      {
        "start": 562,
        "end": 563,
        "className": "syntax-variable"
      },
      {
        "start": 564,
        "end": 566,
        "className": "syntax-operator"
      },
      {
        "start": 567,
        "end": 568,
        "className": "syntax-number"
      },
      {
        "start": 569,
        "end": 571,
        "className": "syntax-operator"
      },
      {
        "start": 572,
        "end": 579,
        "className": "syntax-function"
      },
      {
        "start": 580,
        "end": 581,
        "className": "syntax-variable"
      },
      {
        "start": 583,
        "end": 589,
        "className": "syntax-string"
      },
      {
        "start": 591,
        "end": 592,
        "className": "syntax-number"
      },
      {
        "start": 594,
        "end": 596,
        "className": "syntax-operator"
      },
      {
        "start": 597,
        "end": 598,
        "className": "syntax-number"
      },
      {
        "start": 608,
        "end": 621,
        "className": "syntax-variable"
      },
      {
        "start": 622,
        "end": 625,
        "className": "syntax-variable"
      },
      {
        "start": 630,
        "end": 645,
        "className": "syntax-variable"
      },
      {
        "start": 653,
        "end": 657,
        "className": "syntax-keyword"
      },
      {
        "start": 658,
        "end": 660,
        "className": "syntax-keyword"
      },
      {
        "start": 662,
        "end": 663,
        "className": "syntax-variable"
      },
      {
        "start": 664,
        "end": 666,
        "className": "syntax-operator"
      },
      {
        "start": 667,
        "end": 668,
        "className": "syntax-number"
      },
      {
        "start": 669,
        "end": 671,
        "className": "syntax-operator"
      },
      {
        "start": 672,
        "end": 679,
        "className": "syntax-function"
      },
      {
        "start": 680,
        "end": 681,
        "className": "syntax-variable"
      },
      {
        "start": 683,
        "end": 693,
        "className": "syntax-string"
      },
      {
        "start": 695,
        "end": 696,
        "className": "syntax-number"
      },
      {
        "start": 698,
        "end": 700,
        "className": "syntax-operator"
      },
      {
        "start": 701,
        "end": 702,
        "className": "syntax-number"
      },
      {
        "start": 712,
        "end": 725,
        "className": "syntax-variable"
      },
      {
        "start": 726,
        "end": 729,
        "className": "syntax-variable"
      },
      {
        "start": 734,
        "end": 753,
        "className": "syntax-variable"
      },
      {
        "start": 761,
        "end": 765,
        "className": "syntax-keyword"
      },
      {
        "start": 766,
        "end": 768,
        "className": "syntax-keyword"
      },
      {
        "start": 770,
        "end": 771,
        "className": "syntax-variable"
      },
      {
        "start": 772,
        "end": 774,
        "className": "syntax-operator"
      },
      {
        "start": 775,
        "end": 776,
        "className": "syntax-number"
      },
      {
        "start": 777,
        "end": 779,
        "className": "syntax-operator"
      },
      {
        "start": 780,
        "end": 787,
        "className": "syntax-function"
      },
      {
        "start": 788,
        "end": 789,
        "className": "syntax-variable"
      },
      {
        "start": 791,
        "end": 801,
        "className": "syntax-string"
      },
      {
        "start": 803,
        "end": 804,
        "className": "syntax-number"
      },
      {
        "start": 806,
        "end": 808,
        "className": "syntax-operator"
      },
      {
        "start": 809,
        "end": 810,
        "className": "syntax-number"
      },
      {
        "start": 820,
        "end": 833,
        "className": "syntax-variable"
      },
      {
        "start": 834,
        "end": 837,
        "className": "syntax-variable"
      },
      {
        "start": 842,
        "end": 861,
        "className": "syntax-variable"
      },
      {
        "start": 869,
        "end": 873,
        "className": "syntax-keyword"
      },
      {
        "start": 874,
        "end": 876,
        "className": "syntax-keyword"
      },
      {
        "start": 878,
        "end": 879,
        "className": "syntax-variable"
      },
      {
        "start": 880,
        "end": 882,
        "className": "syntax-operator"
      },
      {
        "start": 883,
        "end": 884,
        "className": "syntax-number"
      },
      {
        "start": 885,
        "end": 887,
        "className": "syntax-operator"
      },
      {
        "start": 888,
        "end": 895,
        "className": "syntax-function"
      },
      {
        "start": 896,
        "end": 897,
        "className": "syntax-variable"
      },
      {
        "start": 899,
        "end": 909,
        "className": "syntax-string"
      },
      {
        "start": 911,
        "end": 912,
        "className": "syntax-number"
      },
      {
        "start": 914,
        "end": 916,
        "className": "syntax-operator"
      },
      {
        "start": 917,
        "end": 918,
        "className": "syntax-number"
      },
      {
        "start": 928,
        "end": 941,
        "className": "syntax-variable"
      },
      {
        "start": 942,
        "end": 945,
        "className": "syntax-variable"
      },
      {
        "start": 950,
        "end": 969,
        "className": "syntax-variable"
      },
      {
        "start": 977,
        "end": 981,
        "className": "syntax-keyword"
      },
      {
        "start": 990,
        "end": 996,
        "className": "syntax-keyword"
      },
      {
        "start": 997,
        "end": 1001,
        "className": "syntax-constant"
      },
      {
        "start": 1013,
        "end": 1014,
        "className": "syntax-variable"
      },
      {
        "start": 1015,
        "end": 1017,
        "className": "syntax-operator"
      },
      {
        "start": 1018,
        "end": 1019,
        "className": "syntax-variable"
      },
      {
        "start": 1025,
        "end": 1027,
        "className": "syntax-keyword"
      },
      {
        "start": 1029,
        "end": 1030,
        "className": "syntax-operator"
      },
      {
        "start": 1030,
        "end": 1031,
        "className": "syntax-variable"
      },
      {
        "start": 1032,
        "end": 1034,
        "className": "syntax-operator"
      },
      {
        "start": 1035,
        "end": 1038,
        "className": "syntax-constant"
      },
      {
        "start": 1048,
        "end": 1053,
        "className": "syntax-keyword"
      },
      {
        "start": 1065,
        "end": 1067,
        "className": "syntax-keyword"
      },
      {
        "start": 1069,
        "end": 1070,
        "className": "syntax-operator"
      },
      {
        "start": 1070,
        "end": 1071,
        "className": "syntax-variable"
      },
      {
        "start": 1072,
        "end": 1074,
        "className": "syntax-operator"
      },
      {
        "start": 1075,
        "end": 1078,
        "className": "syntax-number"
      },
      {
        "start": 1088,
        "end": 1090,
        "className": "syntax-keyword"
      },
      {
        "start": 1092,
        "end": 1095,
        "className": "syntax-variable"
      },
      {
        "start": 1096,
        "end": 1098,
        "className": "syntax-operator"
      },
      {
        "start": 1099,
        "end": 1100,
        "className": "syntax-number"
      },
      {
        "start": 1112,
        "end": 1118,
        "className": "syntax-keyword"
      },
      {
        "start": 1119,
        "end": 1123,
        "className": "syntax-constant"
      },
      {
        "start": 1139,
        "end": 1142,
        "className": "syntax-variable"
      },
      {
        "start": 1142,
        "end": 1144,
        "className": "syntax-operator"
      },
      {
        "start": 1159,
        "end": 1199,
        "className": "syntax-comment"
      },
      {
        "start": 1202,
        "end": 1207,
        "className": "syntax-keyword"
      },
      {
        "start": 1209,
        "end": 1212,
        "className": "syntax-variable"
      },
      {
        "start": 1213,
        "end": 1214,
        "className": "syntax-operator"
      },
      {
        "start": 1215,
        "end": 1216,
        "className": "syntax-number"
      },
      {
        "start": 1224,
        "end": 1237,
        "className": "syntax-variable"
      },
      {
        "start": 1238,
        "end": 1241,
        "className": "syntax-variable"
      },
      {
        "start": 1242,
        "end": 1243,
        "className": "syntax-operator"
      },
      {
        "start": 1244,
        "end": 1245,
        "className": "syntax-number"
      },
      {
        "start": 1247,
        "end": 1248,
        "className": "syntax-operator"
      },
      {
        "start": 1249,
        "end": 1262,
        "className": "syntax-variable"
      },
      {
        "start": 1263,
        "end": 1266,
        "className": "syntax-variable"
      },
      {
        "start": 1273,
        "end": 1276,
        "className": "syntax-variable"
      },
      {
        "start": 1276,
        "end": 1278,
        "className": "syntax-operator"
      },
      {
        "start": 1287,
        "end": 1343,
        "className": "syntax-comment"
      },
      {
        "start": 1346,
        "end": 1349,
        "className": "syntax-keyword"
      },
      {
        "start": 1351,
        "end": 1352,
        "className": "syntax-variable"
      },
      {
        "start": 1353,
        "end": 1354,
        "className": "syntax-operator"
      },
      {
        "start": 1355,
        "end": 1356,
        "className": "syntax-number"
      },
      {
        "start": 1358,
        "end": 1359,
        "className": "syntax-variable"
      },
      {
        "start": 1360,
        "end": 1361,
        "className": "syntax-operator"
      },
      {
        "start": 1362,
        "end": 1363,
        "className": "syntax-number"
      },
      {
        "start": 1365,
        "end": 1366,
        "className": "syntax-variable"
      },
      {
        "start": 1366,
        "end": 1368,
        "className": "syntax-operator"
      },
      {
        "start": 1376,
        "end": 1385,
        "className": "syntax-variable"
      },
      {
        "start": 1386,
        "end": 1387,
        "className": "syntax-variable"
      },
      {
        "start": 1389,
        "end": 1390,
        "className": "syntax-operator"
      },
      {
        "start": 1391,
        "end": 1404,
        "className": "syntax-variable"
      },
      {
        "start": 1405,
        "end": 1406,
        "className": "syntax-variable"
      },
      {
        "start": 1415,
        "end": 1421,
        "className": "syntax-keyword"
      },
      {
        "start": 1422,
        "end": 1424,
        "className": "syntax-constant"
      }
    ]
  },
  {
    "language": "cpp",
    "name": "cpp/llvm_capture_tracking.cpp",
    "code": "UseCaptureKind llvm::DetermineUseCaptureKind(\n    const Use &U,\n    function_ref<bool(Value *, const DataLayout &)> IsDereferenceableOrNull) {\n  Instruction *I = dyn_cast<Instruction>(U.getUser());\n\n  // TODO: Investigate non-instruction uses.\n  if (!I)\n    return UseCaptureKind::MAY_CAPTURE;\n\n  switch (I->getOpcode()) {\n  case Instruction::Call:\n  case Instruction::Invoke: {\n    auto *Call = cast<CallBase>(I);\n    // Not captured if the callee is readonly, doesn't return a copy through\n    // its return value and doesn't unwind (a readonly function can leak bits\n    // by throwing an exception or not depending on the input value).\n    if (Call->onlyReadsMemory() && Call->doesNotThrow() &&\n        Call->getType()->isVoidTy())\n      return UseCaptureKind::NO_CAPTURE;\n\n    // The pointer is not captured if returned pointer is not captured.\n    // NOTE: CaptureTracking users should not assume that only functions\n    // marked with nocapture do not capture. This means that places like\n    // getUnderlyingObject in ValueTracking or DecomposeGEPExpression\n    // in BasicAA also need to know about this property.\n    if (isIntrinsicReturningPointerAliasingArgumentWithoutCapturing(Call, true))\n      return UseCaptureKind::PASSTHROUGH;\n\n    // Volatile operations effectively capture the memory location that they\n    // load and store to.\n    if (auto *MI = dyn_cast<MemIntrinsic>(Call))\n      if (MI->isVolatile())\n        return UseCaptureKind::MAY_CAPTURE;\n\n    // Calling a function pointer does not in itself cause the pointer to\n    // be captured.  This is a subtle point considering that (for example)\n    // the callee might return its own address.  It is analogous to saying\n    // that loading a value from a pointer does not cause the pointer to be\n    // captured, even though the loaded value might be the pointer itself\n    // (think of self-referential objects).\n    if (Call->isCallee(&U))\n      return UseCaptureKind::NO_CAPTURE;\n\n    // Not captured if only passed via 'nocapture' arguments.\n    if (Call->isDataOperand(&U) &&\n        !Call->doesNotCapture(Call->getDataOperandNo(&U))) {\n      // The parameter is not marked 'nocapture' - captured.\n      return UseCaptureKind::MAY_CAPTURE;\n    }\n    return UseCaptureKind::NO_CAPTURE;\n  }\n  case Instruction::Load:\n    // Volatile loads make the address observable.\n    if (cast<LoadInst>(I)->isVolatile())\n      return UseCaptureKind::MAY_CAPTURE;\n    return UseCaptureKind::NO_CAPTURE;\n  case Instruction::VAArg:\n    // \"va-arg\" from a pointer does not cause it to be captured.\n    return UseCaptureKind::NO_CAPTURE;\n  case Instruction::Store:\n    // Stored the pointer - conservatively assume it may be captured.\n    // Volatile stores make the address observable.\n    if (U.getOperandNo() == 0 || cast<StoreInst>(I)->isVolatile())\n      return UseCaptureKind::MAY_CAPTURE;\n    return UseCaptureKind::NO_CAPTURE;\n  case Instruction::AtomicRMW: {\n    // atomicrmw conceptually includes both a load and store from\n    // the same location.\n    // As with a store, the location being accessed is not captured,\n    // but the value being stored is.\n    // Volatile stores make the address observable.\n    auto *ARMWI = cast<AtomicRMWInst>(I);\n    if (U.getOperandNo() == 1 || ARMWI->isVolatile())\n      return UseCaptureKind::MAY_CAPTURE;\n    return UseCaptureKind::NO_CAPTURE;\n  }\n  case Instruction::AtomicCmpXchg: {\n    // cmpxchg conceptually includes both a load and store from\n    // the same location.\n    // As with a store, the location being accessed is not captured,\n    // but the value being stored is.\n    // Volatile stores make the address observable.\n    auto *ACXI = cast<AtomicCmpXchgInst>(I);",
    "spans": [
      {
        "start": 0,
        "end": 14,
        "className": "syntax-type"
      },
      {
        "start": 21,
        "end": 44,
        "className": "syntax-function"
      },
      {
        "start": 50,
        "end": 55,
        "className": "syntax-keyword"
      },
      {
        "start": 56,
        "end": 59,
        "className": "syntax-type"
      },
      {
        "start": 60,
        "end": 61,
        "className": "syntax-operator"
      },
      {
        "start": 61,
        "end": 62,
        "className": "syntax-constant"
      },
      {
        "start": 68,
        "end": 80,
        "className": "syntax-type"
      },
      {
        "start": 80,
        "end": 81,
        "className": "syntax-operator"
      },
      {
        "start": 81,
        "end": 85,
        "className": "syntax-type"
      },
      {
        "start": 86,
        "end": 91,
        "className": "syntax-type"
      },
      {
        "start": 92,
        "end": 93,
        "className": "syntax-operator"
      },
      {
        "start": 95,
        "end": 100,
        "className": "syntax-keyword"
      },
      {
        "start": 101,
        "end": 111,
        "className": "syntax-type"
      },
      {
        "start": 112,
        "end": 113,
        "className": "syntax-operator"
      },
      {
        "start": 114,
        "end": 115,
        "className": "syntax-operator"
      },
      {
        "start": 116,
        "end": 139,
        "className": "syntax-variable"
      },
      {
        "start": 145,
        "end": 156,
        "className": "syntax-type"
      },
      {
        "start": 157,
        "end": 158,
        "className": "syntax-operator"
      },
      {
        "start": 158,
        "end": 159,
        "className": "syntax-constant"
      },
      {
        "start": 160,
        "end": 161,
        "className": "syntax-operator"
      },
      {
        "start": 162,
        "end": 170,
        "className": "syntax-function"
      },
      {
        "start": 170,
        "end": 171,
        "className": "syntax-operator"
      },
      {
        "start": 171,
        "end": 182,
        "className": "syntax-type"
      },
      {
        "start": 182,
        "end": 183,
        "className": "syntax-operator"
      },
      {
        "start": 184,
        "end": 185,
        "className": "syntax-constant"
      },
      {
        "start": 186,
        "end": 193,
        "className": "syntax-function"
      },
      {
        "start": 201,
        "end": 243,
        "className": "syntax-comment"
      },
      {
        "start": 246,
        "end": 248,
        "className": "syntax-keyword"
      },
      {
        "start": 251,
        "end": 252,
        "className": "syntax-constant"
      },
      {
        "start": 258,
        "end": 264,
        "className": "syntax-keyword"
      },
      {
        "start": 265,
        "end": 279,
        "className": "syntax-type"
      },
      {
        "start": 281,
        "end": 292,
        "className": "syntax-constant"
      },
      {
        "start": 297,
        "end": 303,
        "className": "syntax-keyword"
      },
      {
        "start": 305,
        "end": 306,
        "className": "syntax-constant"
      },
      {
        "start": 306,
        "end": 308,
        "className": "syntax-operator"
      },
      {
        "start": 308,
        "end": 317,
        "className": "syntax-function"
      },
      {
        "start": 325,
        "end": 329,
        "className": "syntax-keyword"
      },
      {
        "start": 330,
        "end": 341,
        "className": "syntax-type"
      },
      {
        "start": 343,
        "end": 347,
        "className": "syntax-variable"
      },
      {
        "start": 351,
        "end": 355,
        "className": "syntax-keyword"
      },
      {
        "start": 356,
        "end": 367,
        "className": "syntax-type"
      },
      {
        "start": 369,
        "end": 375,
        "className": "syntax-variable"
      },
      {
        "start": 383,
        "end": 387,
        "className": "syntax-type"
      },
      {
        "start": 388,
        "end": 389,
        "className": "syntax-operator"
      },
      {
        "start": 389,
        "end": 393,
        "className": "syntax-variable"
      },
      {
        "start": 394,
        "end": 395,
        "className": "syntax-operator"
      },
      {
        "start": 396,
        "end": 400,
        "className": "syntax-function"
      },
      {
        "start": 400,
        "end": 401,
        "className": "syntax-operator"
      },
      {
        "start": 401,
        "end": 409,
        "className": "syntax-type"
      },
      {
        "start": 409,
        "end": 410,
        "className": "syntax-operator"
      },
      {
        "start": 411,
        "end": 412,
        "className": "syntax-constant"
      },
      {
        "start": 419,
        "end": 491,
        "className": "syntax-comment"
      },
      {
        "start": 496,
        "end": 569,
        "className": "syntax-comment"
      },
      {
        "start": 574,
        "end": 639,
        "className": "syntax-comment"
      },
      {
        "start": 644,
        "end": 646,
        "className": "syntax-keyword"
      },
      {
        "start": 648,
        "end": 652,
        "className": "syntax-variable"
      },
      {
        "start": 652,
        "end": 654,
        "className": "syntax-operator"
      },
      {
        "start": 654,
        "end": 669,
        "className": "syntax-function"
      },
      {
        "start": 672,
        "end": 674,
        "className": "syntax-operator"
      },
      {
        "start": 675,
        "end": 679,
        "className": "syntax-variable"
      },
      {
        "start": 679,
        "end": 681,
        "className": "syntax-operator"
      },
      {
        "start": 681,
        "end": 693,
        "className": "syntax-function"
      },
      {
        "start": 696,
        "end": 698,
        "className": "syntax-operator"
      },
      {
        "start": 707,
        "end": 711,
        "className": "syntax-variable"
      },
      {
        "start": 711,
        "end": 713,
        "className": "syntax-operator"
      },
      {
        "start": 713,
        "end": 720,
        "className": "syntax-function"
      },
      {
        "start": 722,
        "end": 724,
        "className": "syntax-operator"
      },
      {
        "start": 724,
        "end": 732,
        "className": "syntax-function"
      },
      {
        "start": 742,
        "end": 748,
        "className": "syntax-keyword"
      },
      {
        "start": 749,
        "end": 763,
        "className": "syntax-type"
      },
      {
        "start": 765,
        "end": 775,
        "className": "syntax-constant"
      },
      {
        "start": 782,
        "end": 849,
        "className": "syntax-comment"
      },
      {
        "start": 854,
        "end": 922,
        "className": "syntax-comment"
      },
      {
        "start": 927,
        "end": 995,
        "className": "syntax-comment"
      },
      {
        "start": 1000,
        "end": 1065,
        "className": "syntax-comment"
      },
      {
        "start": 1070,
        "end": 1122,
        "className": "syntax-comment"
      },
      {
        "start": 1127,
        "end": 1129,
        "className": "syntax-keyword"
      },
      {
        "start": 1131,
        "end": 1190,
        "className": "syntax-function"
      },
      {
        "start": 1191,
        "end": 1195,
        "className": "syntax-variable"
      },
      {
        "start": 1210,
        "end": 1216,
        "className": "syntax-keyword"
      },
      {
        "start": 1217,
        "end": 1231,
        "className": "syntax-type"
      },
      {
        "start": 1233,
        "end": 1244,
        "className": "syntax-constant"
      },
      {
        "start": 1251,
        "end": 1323,
        "className": "syntax-comment"
      },
      {
        "start": 1328,
        "end": 1349,
        "className": "syntax-comment"
      },
      {
        "start": 1354,
        "end": 1356,
        "className": "syntax-keyword"
      },
      {
        "start": 1358,
        "end": 1362,
        "className": "syntax-type"
      },
      {
        "start": 1363,
        "end": 1364,
        "className": "syntax-operator"
      },
      {
        "start": 1364,
        "end": 1366,
        "className": "syntax-constant"
      },
      {
        "start": 1367,
        "end": 1368,
        "className": "syntax-operator"
      },
      {
        "start": 1369,
        "end": 1377,
        "className": "syntax-function"
      },
      {
        "start": 1377,
        "end": 1378,
        "className": "syntax-operator"
      },
      {
        "start": 1378,
        "end": 1390,
        "className": "syntax-type"
      },
      {
        "start": 1390,
        "end": 1391,
        "className": "syntax-operator"
      },
      {
        "start": 1392,
        "end": 1396,
        "className": "syntax-variable"
      },
      {
        "start": 1405,
        "end": 1407,
        "className": "syntax-keyword"
      },
      {
        "start": 1409,
        "end": 1411,
        "className": "syntax-constant"
      },
      {
        "start": 1411,
        "end": 1413,
        "className": "syntax-operator"
      },
      {
        "start": 1413,
        "end": 1423,
        "className": "syntax-function"
      },
      {
        "start": 1435,
        "end": 1441,
        "className": "syntax-keyword"
      },
      {
        "start": 1442,
        "end": 1456,
        "className": "syntax-type"
      },
      {
        "start": 1458,
        "end": 1469,
        "className": "syntax-constant"
      },
      {
        "start": 1476,
        "end": 1545,
        "className": "syntax-comment"
      },
      {
        "start": 1550,
        "end": 1620,
        "className": "syntax-comment"
      },
      {
        "start": 1625,
        "end": 1695,
        "className": "syntax-comment"
      },
      {
        "start": 1700,
        "end": 1771,
        "className": "syntax-comment"
      },
      {
        "start": 1776,
        "end": 1845,
        "className": "syntax-comment"
      },
      {
        "start": 1850,
        "end": 1889,
        "className": "syntax-comment"
      },
      {
        "start": 1894,
        "end": 1896,
        "className": "syntax-keyword"
      },
      {
        "start": 1898,
        "end": 1902,
        "className": "syntax-variable"
      },
      {
        "start": 1902,
        "end": 1904,
        "className": "syntax-operator"
      },
      {
        "start": 1904,
        "end": 1912,
        "className": "syntax-function"
      },
      {
        "start": 1913,
        "end": 1914,
        "className": "syntax-operator"
      },
      {
        "start": 1914,
        "end": 1915,
        "className": "syntax-constant"
      },
      {
        "start": 1924,
        "end": 1930,
        "className": "syntax-keyword"
      },
      {
        "start": 1931,
        "end": 1945,
        "className": "syntax-type"
      },
      {
        "start": 1947,
        "end": 1957,
        "className": "syntax-constant"
      },
      {
        "start": 1964,
        "end": 2021,
        "className": "syntax-comment"
      },
      {
        "start": 2026,
        "end": 2028,
        "className": "syntax-keyword"
      },
      {
        "start": 2030,
        "end": 2034,
        "className": "syntax-variable"
      },
      {
        "start": 2034,
        "end": 2036,
        "className": "syntax-operator"
      },
      {
        "start": 2036,
        "end": 2049,
        "className": "syntax-function"
      },
      {
        "start": 2050,
        "end": 2051,
        "className": "syntax-operator"
      },
      {
        "start": 2051,
        "end": 2052,
        "className": "syntax-constant"
      },
      {
        "start": 2054,
        "end": 2056,
        "className": "syntax-operator"
      },
      {
        "start": 2066,
        "end": 2070,
        "className": "syntax-variable"
      },
      {
        "start": 2070,
        "end": 2072,
        "className": "syntax-operator"
      },
      {
        "start": 2072,
        "end": 2086,
        "className": "syntax-function"
      },
      {
        "start": 2087,
        "end": 2091,
        "className": "syntax-variable"
      },
      {
        "start": 2091,
        "end": 2093,
        "className": "syntax-operator"
      },
      {
        "start": 2093,
        "end": 2109,
        "className": "syntax-function"
      },
      {
        "start": 2110,
        "end": 2111,
        "className": "syntax-operator"
      },
      {
        "start": 2111,
        "end": 2112,
        "className": "syntax-constant"
      },
      {
        "start": 2124,
        "end": 2178,
        "className": "syntax-comment"
      },
      {
        "start": 2185,
        "end": 2191,
        "className": "syntax-keyword"
      },
      {
        "start": 2192,
        "end": 2206,
        "className": "syntax-type"
      },
      {
        "start": 2208,
        "end": 2219,
        "className": "syntax-constant"
      },
      {
        "start": 2231,
        "end": 2237,
        "className": "syntax-keyword"
      },
      {
        "start": 2238,
        "end": 2252,
        "className": "syntax-type"
      },
      {
        "start": 2254,
        "end": 2264,
        "className": "syntax-constant"
      },
      {
        "start": 2272,
        "end": 2276,
        "className": "syntax-keyword"
      },
      {
        "start": 2277,
        "end": 2288,
        "className": "syntax-type"
      },
      {
        "start": 2290,
        "end": 2294,
        "className": "syntax-variable"
      },
      {
        "start": 2300,
        "end": 2346,
        "className": "syntax-comment"
      },
      {
        "start": 2351,
        "end": 2353,
        "className": "syntax-keyword"
      },
      {
        "start": 2355,
        "end": 2359,
        "className": "syntax-function"
      },
      {
        "start": 2359,
        "end": 2360,
        "className": "syntax-operator"
      },
      {
        "start": 2360,
        "end": 2368,
        "className": "syntax-type"
      },
      {
        "start": 2368,
        "end": 2369,
        "className": "syntax-operator"
      },
      {
        "start": 2370,
        "end": 2371,
        "className": "syntax-constant"
      },
      {
        "start": 2372,
        "end": 2374,
        "className": "syntax-operator"
      },
      {
        "start": 2374,
        "end": 2384,
        "className": "syntax-function"
      },
      {
        "start": 2394,
        "end": 2400,
        "className": "syntax-keyword"
      },
      {
        "start": 2401,
        "end": 2415,
        "className": "syntax-type"
      },
      {
        "start": 2417,
        "end": 2428,
        "className": "syntax-constant"
      },
      {
        "start": 2434,
        "end": 2440,
        "className": "syntax-keyword"
      },
      {
        "start": 2441,
        "end": 2455,
        "className": "syntax-type"
      },
      {
        "start": 2457,
        "end": 2467,
        "className": "syntax-constant"
      },
      {
        "start": 2471,
        "end": 2475,
        "className": "syntax-keyword"
      },
      {
        "start": 2476,
        "end": 2487,
        "className": "syntax-type"
      },
      {
        "start": 2489,
        "end": 2494,
        "className": "syntax-variable"
      },
      {
        "start": 2500,
        "end": 2560,
        "className": "syntax-comment"
      },
      {
        "start": 2565,
        "end": 2571,
        "className": "syntax-keyword"
      },
      {
        "start": 2572,
        "end": 2586,
        "className": "syntax-type"
      },
      {
        "start": 2588,
        "end": 2598,
        "className": "syntax-constant"
      },
      {
        "start": 2602,
        "end": 2606,
        "className": "syntax-keyword"
      },
      {
        "start": 2607,
        "end": 2618,
        "className": "syntax-type"
      },
      {
        "start": 2620,
        "end": 2625,
        "className": "syntax-variable"
      },
      {
        "start": 2631,
        "end": 2696,
        "className": "syntax-comment"
      },
      {
        "start": 2701,
        "end": 2748,
        "className": "syntax-comment"
      },
      {
        "start": 2753,
        "end": 2755,
        "className": "syntax-keyword"
      },
      {
        "start": 2757,
        "end": 2758,
        "className": "syntax-constant"
      },
      {
        "start": 2759,
        "end": 2771,
        "className": "syntax-function"
      },
      {
        "start": 2774,
        "end": 2776,
        "className": "syntax-operator"
      },
      {
        "start": 2777,
        "end": 2778,
        "className": "syntax-number"
      },
      {
        "start": 2779,
        "end": 2781,
        "className": "syntax-operator"
      },
      {
        "start": 2782,
        "end": 2786,
        "className": "syntax-function"
      },
      {
        "start": 2786,
        "end": 2787,
        "className": "syntax-operator"
      },
      {
        "start": 2787,
        "end": 2796,
        "className": "syntax-type"
      },
      {
        "start": 2796,
        "end": 2797,
        "className": "syntax-operator"
      },
      {
        "start": 2798,
        "end": 2799,
        "className": "syntax-constant"
      },
      {
        "start": 2800,
        "end": 2802,
        "className": "syntax-operator"
      },
      {
        "start": 2802,
        "end": 2812,
        "className": "syntax-function"
      },
      {
        "start": 2822,
        "end": 2828,
        "className": "syntax-keyword"
      },
      {
        "start": 2829,
        "end": 2843,
        "className": "syntax-type"
      },
      {
        "start": 2845,
        "end": 2856,
        "className": "syntax-constant"
      },
      {
        "start": 2862,
        "end": 2868,
        "className": "syntax-keyword"
      },
      {
        "start": 2869,
        "end": 2883,
        "className": "syntax-type"
      },
      {
        "start": 2885,
        "end": 2895,
        "className": "syntax-constant"
      },
      {
        "start": 2899,
        "end": 2903,
        "className": "syntax-keyword"
      },
      {
        "start": 2904,
        "end": 2915,
        "className": "syntax-type"
      },
      {
        "start": 2917,
        "end": 2926,
        "className": "syntax-variable"
      },
      {
        "start": 2934,
        "end": 2995,
        "className": "syntax-comment"
      },
      {
        "start": 3000,
        "end": 3021,
        "className": "syntax-comment"
      },
      {
        "start": 3026,
        "end": 3090,
        "className": "syntax-comment"
      },
      {
        "start": 3095,
        "end": 3128,
        "className": "syntax-comment"
      },
      {
        "start": 3133,
        "end": 3180,
        "className": "syntax-comment"
      },
      {
        "start": 3185,
        "end": 3189,
        "className": "syntax-type"
      },
      {
        "start": 3190,
        "end": 3191,
        "className": "syntax-operator"
      },
      {
        "start": 3191,
        "end": 3196,
        "className": "syntax-constant"
      },
      {
        "start": 3197,
        "end": 3198,
        "className": "syntax-operator"
      },
      {
        "start": 3199,
        "end": 3203,
        "className": "syntax-function"
      },
      {
        "start": 3203,
        "end": 3204,
        "className": "syntax-operator"
      },
      {
        "start": 3204,
        "end": 3217,
        "className": "syntax-type"
      },
      {
        "start": 3217,
        "end": 3218,
        "className": "syntax-operator"
      },
      {
        "start": 3219,
        "end": 3220,
        "className": "syntax-constant"
      },
      {
        "start": 3227,
        "end": 3229,
        "className": "syntax-keyword"
      },
      {
        "start": 3231,
        "end": 3232,
        "className": "syntax-constant"
      },
      {
        "start": 3233,
        "end": 3245,
        "className": "syntax-function"
      },
      {
        "start": 3248,
        "end": 3250,
        "className": "syntax-operator"
      },
      {
        "start": 3251,
        "end": 3252,
        "className": "syntax-number"
      },
      {
        "start": 3253,
        "end": 3255,
        "className": "syntax-operator"
      },
      {
        "start": 3256,
        "end": 3261,
        "className": "syntax-constant"
      },
      {
        "start": 3261,
        "end": 3263,
        "className": "syntax-operator"
      },
      {
        "start": 3263,
        "end": 3273,
        "className": "syntax-function"
      },
      {
        "start": 3283,
        "end": 3289,
        "className": "syntax-keyword"
      },
      {
        "start": 3290,
        "end": 3304,
        "className": "syntax-type"
      },
      {
        "start": 3306,
        "end": 3317,
        "className": "syntax-constant"
      },
      {
        "start": 3323,
        "end": 3329,
        "className": "syntax-keyword"
      },
      {
        "start": 3330,
        "end": 3344,
        "className": "syntax-type"
      },
      {
        "start": 3346,
        "end": 3356,
        "className": "syntax-constant"
      },
      {
        "start": 3364,
        "end": 3368,
        "className": "syntax-keyword"
      },
      {
        "start": 3369,
        "end": 3380,
        "className": "syntax-type"
      },
      {
        "start": 3382,
        "end": 3395,
        "className": "syntax-variable"
      },
      {
        "start": 3403,
        "end": 3462,
        "className": "syntax-comment"
      },
      {
        "start": 3467,
        "end": 3488,
        "className": "syntax-comment"
      },
      {
        "start": 3493,
        "end": 3557,
        "className": "syntax-comment"
      },
      {
        "start": 3562,
        "end": 3595,
        "className": "syntax-comment"
      },
      {
        "start": 3600,
        "end": 3647,
        "className": "syntax-comment"
      },
      {
        "start": 3652,
        "end": 3656,
        "className": "syntax-type"
      },
      {
        "start": 3657,
        "end": 3658,
        "className": "syntax-operator"
      },
      {
        "start": 3658,
        "end": 3662,
        "className": "syntax-constant"
      },
      {
        "start": 3663,
        "end": 3664,
        "className": "syntax-operator"
      },
      {
        "start": 3665,
        "end": 3669,
        "className": "syntax-function"
      },
      {
        "start": 3669,
        "end": 3670,
        "className": "syntax-operator"
      },
      {
        "start": 3670,
        "end": 3687,
        "className": "syntax-type"
      },
      {
        "start": 3687,
        "end": 3688,
        "className": "syntax-operator"
      },
      {
        "start": 3689,
        "end": 3690,
        "className": "syntax-constant"
      }
    ]
  },
  {
    "language": "javascript",
    "name": "javascript/typescript_build.js",
    "code": "export const generateTypesMap = task({\n    name: \"generate-types-map\",\n    run: async () => {\n        await fs.promises.mkdir(\"./built/local\", { recursive: true });\n        const source = \"src/server/typesMap.json\";\n        const target = \"built/local/typesMap.json\";\n        const contents = await fs.promises.readFile(source, \"utf-8\");\n        JSON.parse(contents); // Validates that the JSON parses.\n        await fs.promises.writeFile(target, contents.replace(/\\r\\n/g, \"\\n\"));\n    },\n});\n\n// Drop a copy of diagnosticMessages.generated.json into the built/local folder. This allows\n// it to be synced to the Azure DevOps repo, so that it can get picked up by the build\n// pipeline that generates the localization artifacts that are then fed into the translation process.\nconst builtLocalDiagnosticMessagesGeneratedJson = \"built/local/diagnosticMessages.generated.json\";\nconst copyBuiltLocalDiagnosticMessages = task({\n    name: \"copy-built-local-diagnostic-messages\",\n    dependencies: [generateDiagnostics],\n    run: async () => {\n        const contents = await fs.promises.readFile(diagnosticMessagesGeneratedJson, \"utf-8\");\n        JSON.parse(contents); // Validates that the JSON parses.\n        await fs.promises.writeFile(builtLocalDiagnosticMessagesGeneratedJson, contents);\n    },\n});\n\nexport const otherOutputs = task({\n    name: \"other-outputs\",\n    description: \"Builds miscelaneous scripts and documents distributed with the LKG\",\n    dependencies: [typingsInstaller, watchGuard, generateTypesMap, copyBuiltLocalDiagnosticMessages],\n});\n\nexport const watchOtherOutputs = task({\n    name: \"watch-other-outputs\",\n    description: \"Builds miscelaneous scripts and documents distributed with the LKG\",\n    hiddenFromTaskList: true,\n    dependencies: [watchTypingsInstaller, watchWatchGuard, generateTypesMap, copyBuiltLocalDiagnosticMessages],\n});\n\nexport const local = task({\n    name: \"local\",\n    description: \"Builds the full compiler and services\",\n    dependencies: [localize, tsc, tsserver, services, lssl, otherOutputs, dts],\n});\nexport default local;\n\nexport const watchLocal = task({\n    name: \"watch-local\",\n    description: \"Watches the full compiler and services\",\n    hiddenFromTaskList: true,\n    dependencies: [localize, watchTsc, watchTsserver, watchServices, lssl, watchOtherOutputs, dts, watchSrc],\n});\n\nconst runtestsDeps = [tests, generateLibs].concat(cmdLineOptions.typecheck ? [dts] : []);\n\nexport const runTests = task({\n    name: \"runtests\",\n    description: \"Runs the tests using the built run.js file.\",\n    dependencies: runtestsDeps,\n    run: () => runConsoleTests(testRunner, \"mocha-fivemat-progress-reporter\", /*runInParallel*/ false),\n});",
    "spans": [
      {
        "start": 0,
        "end": 6,
        "className": "syntax-keyword"
      },
      {
        "start": 7,
        "end": 12,
        "className": "syntax-keyword"
      },
      {
        "start": 13,
        "end": 29,
        "className": "syntax-variable"
      },
      {
        "start": 30,
        "end": 31,
        "className": "syntax-operator"
      },
      {
        "start": 32,
        "end": 36,
        "className": "syntax-function"
      },
      {
        "start": 36,
        "end": 38,
        "className": "syntax-punctuation"
      },
      {
        "start": 43,
        "end": 47,
        "className": "syntax-property"
      },
      {
        "start": 49,
        "end": 69,
        "className": "syntax-string"
      },
      {
        "start": 69,
        "end": 70,
        "className": "syntax-punctuation"
      },
      {
        "start": 75,
        "end": 78,
        "className": "syntax-function"
      },
      {
        "start": 80,
        "end": 85,
        "className": "syntax-keyword"
      },
      {
        "start": 86,
        "end": 88,
        "className": "syntax-punctuation"
      },
      {
        "start": 89,
        "end": 91,
        "className": "syntax-operator"
      },
      {
        "start": 92,
        "end": 93,
        "className": "syntax-punctuation"
      },
      {
        "start": 102,
        "end": 107,
        "className": "syntax-keyword"
      },
      {
        "start": 108,
        "end": 110,
        "className": "syntax-variable"
      },
      {
        "start": 110,
        "end": 111,
        "className": "syntax-punctuation"
      },
      {
        "start": 111,
        "end": 119,
        "className": "syntax-property"
      },
      {
        "start": 119,
        "end": 120,
        "className": "syntax-punctuation"
      },
      {
        "start": 120,
        "end": 125,
        "className": "syntax-function"
      },
      {
        "start": 125,
        "end": 126,
        "className": "syntax-punctuation"
      },
      {
        "start": 126,
        "end": 141,
        "className": "syntax-string"
      },
      {
        "start": 141,
        "end": 142,
        "className": "syntax-punctuation"
      },
      {
        "start": 143,
        "end": 144,
        "className": "syntax-punctuation"
      },
      {
        "start": 145,
        "end": 154,
        "className": "syntax-property"
      },
      {
        "start": 156,
        "end": 160,
        "className": "syntax-constant"
      },
      {
        "start": 161,
        "end": 164,
        "className": "syntax-punctuation"
      },
      {
        "start": 173,
        "end": 178,
        "className": "syntax-keyword"
      },
      {
        "start": 179,
        "end": 185,
        "className": "syntax-variable"
      },
      {
        "start": 186,
        "end": 187,
        "className": "syntax-operator"
      },
      {
        "start": 188,
        "end": 214,
        "className": "syntax-string"
      },
      {
        "start": 214,
        "end": 215,
        "className": "syntax-punctuation"
      },
      {
        "start": 224,
        "end": 229,
        "className": "syntax-keyword"
      },
      {
        "start": 230,
        "end": 236,
        "className": "syntax-variable"
      },
      {
        "start": 237,
        "end": 238,
        "className": "syntax-operator"
      },
      {
        "start": 239,
        "end": 266,
        "className": "syntax-string"
      },
      {
        "start": 266,
        "end": 267,
        "className": "syntax-punctuation"
      },
      {
        "start": 276,
        "end": 281,
        "className": "syntax-keyword"
      },
      {
        "start": 282,
        "end": 290,
        "className": "syntax-variable"
      },
      {
        "start": 291,
        "end": 292,
        "className": "syntax-operator"
      },
      {
        "start": 293,
        "end": 298,
        "className": "syntax-keyword"
      },
      {
        "start": 299,
        "end": 301,
        "className": "syntax-variable"
      },
      {
        "start": 301,
        "end": 302,
        "className": "syntax-punctuation"
      },
      {
        "start": 302,
        "end": 310,
        "className": "syntax-property"
      },
      {
        "start": 310,
        "end": 311,
        "className": "syntax-punctuation"
      },
      {
        "start": 311,
        "end": 319,
        "className": "syntax-function"
      },
      {
        "start": 319,
        "end": 320,
        "className": "syntax-punctuation"
      },
      {
        "start": 320,
        "end": 326,
        "className": "syntax-variable"
      },
      {
        "start": 326,
        "end": 327,
        "className": "syntax-punctuation"
      },
      {
        "start": 328,
        "end": 335,
        "className": "syntax-string"
      },
      {
        "start": 335,
        "end": 337,
        "className": "syntax-punctuation"
      },
      {
        "start": 346,
        "end": 350,
        "className": "syntax-constant"
      },
      {
        "start": 350,
        "end": 351,
        "className": "syntax-punctuation"
      },
      {
        "start": 351,
        "end": 356,
        "className": "syntax-function"
      },
      {
        "start": 356,
        "end": 357,
        "className": "syntax-punctuation"
      },
      {
        "start": 357,
        "end": 365,
        "className": "syntax-variable"
      },
      {
        "start": 365,
        "end": 367,
        "className": "syntax-punctuation"
      },
      {
        "start": 368,
        "end": 402,
        "className": "syntax-comment"
      },
      {
        "start": 411,
        "end": 416,
        "className": "syntax-keyword"
      },
      {
        "start": 417,
        "end": 419,
        "className": "syntax-variable"
      },
      {
        "start": 419,
        "end": 420,
        "className": "syntax-punctuation"
      },
      {
        "start": 420,
        "end": 428,
        "className": "syntax-property"
      },
      {
        "start": 428,
        "end": 429,
        "className": "syntax-punctuation"
      },
      {
        "start": 429,
        "end": 438,
        "className": "syntax-function"
      },
      {
        "start": 438,
        "end": 439,
        "className": "syntax-punctuation"
      },
      {
        "start": 439,
        "end": 445,
        "className": "syntax-variable"
      },
      {
        "start": 445,
        "end": 446,
        "className": "syntax-punctuation"
      },
      {
        "start": 447,
        "end": 455,
        "className": "syntax-variable"
      },
      {
        "start": 455,
        "end": 456,
        "className": "syntax-punctuation"
      },
      {
        "start": 456,
        "end": 463,
        "className": "syntax-function"
      },
      {
        "start": 463,
        "end": 464,
        "className": "syntax-punctuation"
      },
      {
        "start": 464,
        "end": 471,
        "className": "syntax-string"
      },
      {
        "start": 471,
        "end": 472,
        "className": "syntax-punctuation"
      },
      {
        "start": 473,
        "end": 477,
        "className": "syntax-string"
      },
      {
        "start": 477,
        "end": 480,
        "className": "syntax-punctuation"
      },
      {
        "start": 485,
        "end": 487,
        "className": "syntax-punctuation"
      },
      {
        "start": 488,
        "end": 491,
        "className": "syntax-punctuation"
      },
      {
        "start": 493,
        "end": 585,
        "className": "syntax-comment"
      },
      {
        "start": 586,
        "end": 672,
        "className": "syntax-comment"
      },
      {
        "start": 673,
        "end": 774,
        "className": "syntax-comment"
      },
      {
        "start": 775,
        "end": 780,
        "className": "syntax-keyword"
      },
      {
        "start": 781,
        "end": 822,
        "className": "syntax-variable"
      },
      {
        "start": 823,
        "end": 824,
        "className": "syntax-operator"
      },
      {
        "start": 825,
        "end": 872,
        "className": "syntax-string"
      },
      {
        "start": 872,
        "end": 873,
        "className": "syntax-punctuation"
      },
      {
        "start": 874,
        "end": 879,
        "className": "syntax-keyword"
      },
      {
        "start": 880,
        "end": 912,
        "className": "syntax-variable"
      },
      {
        "start": 913,
        "end": 914,
        "className": "syntax-operator"
      },
      {
        "start": 915,
        "end": 919,
        "className": "syntax-function"
      },
      {
        "start": 919,
        "end": 921,
        "className": "syntax-punctuation"
      },
      {
        "start": 926,
        "end": 930,
        "className": "syntax-property"
      },
      {
        "start": 932,
        "end": 970,
        "className": "syntax-string"
      },
      {
        "start": 970,
        "end": 971,
        "className": "syntax-punctuation"
      },
      {
        "start": 976,
        "end": 988,
        "className": "syntax-property"
      },
      {
        "start": 990,
        "end": 991,
        "className": "syntax-punctuation"
      },
      {
        "start": 991,
        "end": 1010,
        "className": "syntax-variable"
      },
      {
        "start": 1010,
        "end": 1012,
        "className": "syntax-punctuation"
      },
      {
        "start": 1017,
        "end": 1020,
        "className": "syntax-function"
      },
      {
        "start": 1022,
        "end": 1027,
        "className": "syntax-keyword"
      },
      {
        "start": 1028,
        "end": 1030,
        "className": "syntax-punctuation"
      },
      {
        "start": 1031,
        "end": 1033,
        "className": "syntax-operator"
      },
      {
        "start": 1034,
        "end": 1035,
        "className": "syntax-punctuation"
      },
      {
        "start": 1044,
        "end": 1049,
        "className": "syntax-keyword"
      },
      {
        "start": 1050,
        "end": 1058,
        "className": "syntax-variable"
      },
      {
        "start": 1059,
        "end": 1060,
        "className": "syntax-operator"
      },
      {
        "start": 1061,
        "end": 1066,
        "className": "syntax-keyword"
      },
      {
        "start": 1067,
        "end": 1069,
        "className": "syntax-variable"
      },
      {
        "start": 1069,
        "end": 1070,
        "className": "syntax-punctuation"
      },
      {
        "start": 1070,
        "end": 1078,
        "className": "syntax-property"
      },
      {
        "start": 1078,
        "end": 1079,
        "className": "syntax-punctuation"
      },
      {
        "start": 1079,
        "end": 1087,
        "className": "syntax-function"
      },
      {
        "start": 1087,
        "end": 1088,
        "className": "syntax-punctuation"
      },
      {
        "start": 1088,
        "end": 1119,
        "className": "syntax-variable"
      },
      {
        "start": 1119,
        "end": 1120,
        "className": "syntax-punctuation"
      },
      {
        "start": 1121,
        "end": 1128,
        "className": "syntax-string"
      },
      {
        "start": 1128,
        "end": 1130,
        "className": "syntax-punctuation"
      },
      {
        "start": 1139,
        "end": 1143,
        "className": "syntax-constant"
      },
      {
        "start": 1143,
        "end": 1144,
        "className": "syntax-punctuation"
      },
      {
        "start": 1144,
        "end": 1149,
        "className": "syntax-function"
      },
      {
        "start": 1149,
        "end": 1150,
        "className": "syntax-punctuation"
      },
      {
        "start": 1150,
        "end": 1158,
        "className": "syntax-variable"
      },
      {
        "start": 1158,
        "end": 1160,
        "className": "syntax-punctuation"
      },
      {
        "start": 1161,
        "end": 1195,
        "className": "syntax-comment"
      },
      {
        "start": 1204,
        "end": 1209,
        "className": "syntax-keyword"
      },
      {
        "start": 1210,
        "end": 1212,
        "className": "syntax-variable"
      },
      {
        "start": 1212,
        "end": 1213,
        "className": "syntax-punctuation"
      },
      {
        "start": 1213,
        "end": 1221,
        "className": "syntax-property"
      },
      {
        "start": 1221,
        "end": 1222,
        "className": "syntax-punctuation"
      },
      {
        "start": 1222,
        "end": 1231,
        "className": "syntax-function"
      },
      {
        "start": 1231,
        "end": 1232,
        "className": "syntax-punctuation"
      },
      {
        "start": 1232,
        "end": 1273,
        "className": "syntax-variable"
      },
      {
        "start": 1273,
        "end": 1274,
        "className": "syntax-punctuation"
      },
      {
        "start": 1275,
        "end": 1283,
        "className": "syntax-variable"
      },
      {
        "start": 1283,
        "end": 1285,
        "className": "syntax-punctuation"
      },
      {
        "start": 1290,
        "end": 1292,
        "className": "syntax-punctuation"
      },
      {
        "start": 1293,
        "end": 1296,
        "className": "syntax-punctuation"
      },
      {
        "start": 1298,
        "end": 1304,
        "className": "syntax-keyword"
      },
      {
        "start": 1305,
        "end": 1310,
        "className": "syntax-keyword"
      },
      {
        "start": 1311,
        "end": 1323,
        "className": "syntax-variable"
      },
      {
        "start": 1324,
        "end": 1325,
        "className": "syntax-operator"
      },
      {
        "start": 1326,
        "end": 1330,
        "className": "syntax-function"
      },
      {
        "start": 1330,
        "end": 1332,
        "className": "syntax-punctuation"
      },
      {
        "start": 1337,
        "end": 1341,
        "className": "syntax-property"
      },
      {
        "start": 1343,
        "end": 1358,
        "className": "syntax-string"
      },
      {
        "start": 1358,
        "end": 1359,
        "className": "syntax-punctuation"
      },
      {
        "start": 1364,
        "end": 1375,
        "className": "syntax-property"
      },
      {
        "start": 1377,
        "end": 1445,
        "className": "syntax-string"
      },
      {
        "start": 1445,
        "end": 1446,
        "className": "syntax-punctuation"
      },
      {
        "start": 1451,
        "end": 1463,
        "className": "syntax-property"
      },
      {
        "start": 1465,
        "end": 1466,
        "className": "syntax-punctuation"
      },
      {
        "start": 1466,
        "end": 1482,
        "className": "syntax-variable"
      },
      {
        "start": 1482,
        "end": 1483,
        "className": "syntax-punctuation"
      },
      {
        "start": 1484,
        "end": 1494,
        "className": "syntax-variable"
      },
      {
        "start": 1494,
        "end": 1495,
        "className": "syntax-punctuation"
      },
      {
        "start": 1496,
        "end": 1512,
        "className": "syntax-variable"
      },
      {
        "start": 1512,
        "end": 1513,
        "className": "syntax-punctuation"
      },
      {
        "start": 1514,
        "end": 1546,
        "className": "syntax-variable"
      },
      {
        "start": 1546,
        "end": 1548,
        "className": "syntax-punctuation"
      },
      {
        "start": 1549,
        "end": 1552,
        "className": "syntax-punctuation"
      },
      {
        "start": 1554,
        "end": 1560,
        "className": "syntax-keyword"
      },
      {
        "start": 1561,
        "end": 1566,
        "className": "syntax-keyword"
      },
      {
        "start": 1567,
        "end": 1584,
        "className": "syntax-variable"
      },
      {
        "start": 1585,
        "end": 1586,
        "className": "syntax-operator"
      },
      {
        "start": 1587,
        "end": 1591,
        "className": "syntax-function"
      },
      {
        "start": 1591,
        "end": 1593,
        "className": "syntax-punctuation"
      },
      {
        "start": 1598,
        "end": 1602,
        "className": "syntax-property"
      },
      {
        "start": 1604,
        "end": 1625,
        "className": "syntax-string"
      },
      {
        "start": 1625,
        "end": 1626,
        "className": "syntax-punctuation"
      },
      {
        "start": 1631,
        "end": 1642,
        "className": "syntax-property"
      },
      {
        "start": 1644,
        "end": 1712,
        "className": "syntax-string"
      },
      {
        "start": 1712,
        "end": 1713,
        "className": "syntax-punctuation"
      },
      {
        "start": 1718,
        "end": 1736,
        "className": "syntax-property"
      },
      {
        "start": 1738,
        "end": 1742,
        "className": "syntax-constant"
      },
      {
        "start": 1742,
        "end": 1743,
        "className": "syntax-punctuation"
      },
      {
        "start": 1748,
        "end": 1760,
        "className": "syntax-property"
      },
      {
        "start": 1762,
        "end": 1763,
        "className": "syntax-punctuation"
      },
      {
        "start": 1763,
        "end": 1784,
        "className": "syntax-variable"
      },
      {
        "start": 1784,
        "end": 1785,
        "className": "syntax-punctuation"
      },
      {
        "start": 1786,
        "end": 1801,
        "className": "syntax-variable"
      },
      {
        "start": 1801,
        "end": 1802,
        "className": "syntax-punctuation"
      },
      {
        "start": 1803,
        "end": 1819,
        "className": "syntax-variable"
      },
      {
        "start": 1819,
        "end": 1820,
        "className": "syntax-punctuation"
      },
      {
        "start": 1821,
        "end": 1853,
        "className": "syntax-variable"
      },
      {
        "start": 1853,
        "end": 1855,
        "className": "syntax-punctuation"
      },
      {
        "start": 1856,
        "end": 1859,
        "className": "syntax-punctuation"
      },
      {
        "start": 1861,
        "end": 1867,
        "className": "syntax-keyword"
      },
      {
        "start": 1868,
        "end": 1873,
        "className": "syntax-keyword"
      },
      {
        "start": 1874,
        "end": 1879,
        "className": "syntax-variable"
      },
      {
        "start": 1880,
        "end": 1881,
        "className": "syntax-operator"
      },
      {
        "start": 1882,
        "end": 1886,
        "className": "syntax-function"
      },
      {
        "start": 1886,
        "end": 1888,
        "className": "syntax-punctuation"
      },
      {
        "start": 1893,
        "end": 1897,
        "className": "syntax-property"
      },
      {
        "start": 1899,
        "end": 1906,
        "className": "syntax-string"
      },
      {
        "start": 1906,
        "end": 1907,
        "className": "syntax-punctuation"
      },
      {
        "start": 1912,
        "end": 1923,
        "className": "syntax-property"
      },
      {
        "start": 1925,
        "end": 1964,
        "className": "syntax-string"
      },
      {
        "start": 1964,
        "end": 1965,
        "className": "syntax-punctuation"
      },
      {
        "start": 1970,
        "end": 1982,
        "className": "syntax-property"
      },
      {
        "start": 1984,
        "end": 1985,
        "className": "syntax-punctuation"
      },
      {
        "start": 1985,
        "end": 1993,
        "className": "syntax-variable"
      },
      {
        "start": 1993,
        "end": 1994,
        "className": "syntax-punctuation"
      },
      {
        "start": 1995,
        "end": 1998,
        "className": "syntax-variable"
      },
      {
        "start": 1998,
        "end": 1999,
        "className": "syntax-punctuation"
      },
      {
        "start": 2000,
        "end": 2008,
        "className": "syntax-variable"
      },
      {
        "start": 2008,
        "end": 2009,
        "className": "syntax-punctuation"
      },
      {
        "start": 2010,
        "end": 2018,
        "className": "syntax-variable"
      },
      {
        "start": 2018,
        "end": 2019,
        "className": "syntax-punctuation"
      },
      {
        "start": 2020,
        "end": 2024,
        "className": "syntax-variable"
      },
      {
        "start": 2024,
        "end": 2025,
        "className": "syntax-punctuation"
      },
      {
        "start": 2026,
        "end": 2038,
        "className": "syntax-variable"
      },
      {
        "start": 2038,
        "end": 2039,
        "className": "syntax-punctuation"
      },
      {
        "start": 2040,
        "end": 2043,
        "className": "syntax-variable"
      },
      {
        "start": 2043,
        "end": 2045,
        "className": "syntax-punctuation"
      },
      {
        "start": 2046,
        "end": 2049,
        "className": "syntax-punctuation"
      },
      {
        "start": 2050,
        "end": 2056,
        "className": "syntax-keyword"
      },
      {
        "start": 2057,
        "end": 2064,
        "className": "syntax-keyword"
      },
      {
        "start": 2065,
        "end": 2070,
        "className": "syntax-variable"
      },
      {
        "start": 2070,
        "end": 2071,
        "className": "syntax-punctuation"
      },
      {
        "start": 2073,
        "end": 2079,
        "className": "syntax-keyword"
      },
      {
        "start": 2080,
        "end": 2085,
        "className": "syntax-keyword"
      },
      {
        "start": 2086,
        "end": 2096,
        "className": "syntax-variable"
      },
      {
        "start": 2097,
        "end": 2098,
        "className": "syntax-operator"
      },
      {
        "start": 2099,
        "end": 2103,
        "className": "syntax-function"
      },
      {
        "start": 2103,
        "end": 2105,
        "className": "syntax-punctuation"
      },
      {
        "start": 2110,
        "end": 2114,
        "className": "syntax-property"
      },
      {
        "start": 2116,
        "end": 2129,
        "className": "syntax-string"
      },
      {
        "start": 2129,
        "end": 2130,
        "className": "syntax-punctuation"
      },
      {
        "start": 2135,
        "end": 2146,
        "className": "syntax-property"
      },
      {
        "start": 2148,
        "end": 2188,
        "className": "syntax-string"
      },
      {
        "start": 2188,
        "end": 2189,
        "className": "syntax-punctuation"
      },
      {
        "start": 2194,
        "end": 2212,
        "className": "syntax-property"
      },
      {
        "start": 2214,
        "end": 2218,
        "className": "syntax-constant"
      },
      {
        "start": 2218,
        "end": 2219,
        "className": "syntax-punctuation"
      },
      {
        "start": 2224,
        "end": 2236,
        "className": "syntax-property"
      },
      {
        "start": 2238,
        "end": 2239,
        "className": "syntax-punctuation"
      },
      {
        "start": 2239,
        "end": 2247,
        "className": "syntax-variable"
      },
      {
        "start": 2247,
        "end": 2248,
        "className": "syntax-punctuation"
      },
      {
        "start": 2249,
        "end": 2257,
        "className": "syntax-variable"
      },
      {
        "start": 2257,
        "end": 2258,
        "className": "syntax-punctuation"
      },
      {
        "start": 2259,
        "end": 2272,
        "className": "syntax-variable"
      },
      {
        "start": 2272,
        "end": 2273,
        "className": "syntax-punctuation"
      },
      {
        "start": 2274,
        "end": 2287,
        "className": "syntax-variable"
      },
      {
        "start": 2287,
        "end": 2288,
        "className": "syntax-punctuation"
      },
      {
        "start": 2289,
        "end": 2293,
        "className": "syntax-variable"
      },
      {
        "start": 2293,
        "end": 2294,
        "className": "syntax-punctuation"
      },
      {
        "start": 2295,
        "end": 2312,
        "className": "syntax-variable"
      },
      {
        "start": 2312,
        "end": 2313,
        "className": "syntax-punctuation"
      },
      {
        "start": 2314,
        "end": 2317,
        "className": "syntax-variable"
      },
      {
        "start": 2317,
        "end": 2318,
        "className": "syntax-punctuation"
      },
      {
        "start": 2319,
        "end": 2327,
        "className": "syntax-variable"
      },
      {
        "start": 2327,
        "end": 2329,
        "className": "syntax-punctuation"
      },
      {
        "start": 2330,
        "end": 2333,
        "className": "syntax-punctuation"
      },
      {
        "start": 2335,
        "end": 2340,
        "className": "syntax-keyword"
      },
      {
        "start": 2341,
        "end": 2353,
        "className": "syntax-variable"
      },
      {
        "start": 2354,
        "end": 2355,
        "className": "syntax-operator"
      },
      {
        "start": 2356,
        "end": 2357,
        "className": "syntax-punctuation"
      },
      {
        "start": 2357,
        "end": 2362,
        "className": "syntax-variable"
      },
      {
        "start": 2362,
        "end": 2363,
        "className": "syntax-punctuation"
      },
      {
        "start": 2364,
        "end": 2376,
        "className": "syntax-variable"
      },
      {
        "start": 2376,
        "end": 2378,
        "className": "syntax-punctuation"
      },
      {
        "start": 2378,
        "end": 2384,
        "className": "syntax-function"
      },
      {
        "start": 2384,
        "end": 2385,
        "className": "syntax-punctuation"
      },
      {
        "start": 2385,
        "end": 2399,
        "className": "syntax-variable"
      },
      {
        "start": 2399,
        "end": 2400,
        "className": "syntax-punctuation"
      },
      {
        "start": 2400,
        "end": 2409,
        "className": "syntax-property"
      },
      {
        "start": 2412,
        "end": 2413,
        "className": "syntax-punctuation"
      },
      {
        "start": 2413,
        "end": 2416,
        "className": "syntax-variable"
      },
      {
        "start": 2416,
        "end": 2417,
        "className": "syntax-punctuation"
      },
      {
        "start": 2420,
        "end": 2424,
        "className": "syntax-punctuation"
      },
      {
        "start": 2426,
        "end": 2432,
        "className": "syntax-keyword"
      },
      {
        "start": 2433,
        "end": 2438,
        "className": "syntax-keyword"
      },
      {
        "start": 2439,
        "end": 2447,
        "className": "syntax-variable"
      },
      {
        "start": 2448,
        "end": 2449,
        "className": "syntax-operator"
      },
      {
        "start": 2450,
        "end": 2454,
        "className": "syntax-function"
      },
      {
        "start": 2454,
        "end": 2456,
        "className": "syntax-punctuation"
      },
      {
        "start": 2461,
        "end": 2465,
        "className": "syntax-property"
      },
      {
        "start": 2467,
        "end": 2477,
        "className": "syntax-string"
      },
      {
        "start": 2477,
        "end": 2478,
        "className": "syntax-punctuation"
      },
      {
        "start": 2483,
        "end": 2494,
        "className": "syntax-property"
      },
      {
        "start": 2496,
        "end": 2541,
        "className": "syntax-string"
      },
      {
        "start": 2541,
        "end": 2542,
        "className": "syntax-punctuation"
      },
      {
        "start": 2547,
        "end": 2559,
        "className": "syntax-property"
      },
      {
        "start": 2561,
        "end": 2573,
        "className": "syntax-variable"
      },
      {
        "start": 2573,
        "end": 2574,
        "className": "syntax-punctuation"
      },
      {
        "start": 2579,
        "end": 2582,
        "className": "syntax-function"
      },
      {
        "start": 2584,
        "end": 2586,
        "className": "syntax-punctuation"
      },
      {
        "start": 2587,
        "end": 2589,
        "className": "syntax-operator"
      },
      {
        "start": 2590,
        "end": 2605,
        "className": "syntax-function"
      },
      {
        "start": 2605,
        "end": 2606,
        "className": "syntax-punctuation"
      },
      {
        "start": 2606,
        "end": 2616,
        "className": "syntax-variable"
      },
      {
        "start": 2616,
        "end": 2617,
        "className": "syntax-punctuation"
      },
      {
        "start": 2618,
        "end": 2651,
        "className": "syntax-string"
      },
      {
        "start": 2651,
        "end": 2652,
        "className": "syntax-punctuation"
      },
      {
        "start": 2653,
        "end": 2670,
        "className": "syntax-comment"
      },
      {
        "start": 2671,
        "end": 2676,
        "className": "syntax-constant"
      },
      {
        "start": 2676,
        "end": 2678,
        "className": "syntax-punctuation"
      },
      {
        "start": 2679,
        "end": 2682,
        "className": "syntax-punctuation"
      }
    ]
  },
  {
    "language": "lua",
    "name": "lua/neovim_diagnostic_list.lua",
    "code": "local function set_list(loclist, opts)\n  opts = opts or {}\n  local open = vim.nonnil(opts.open, true)\n  local title = opts.title or 'Diagnostics'\n  local winnr = opts.winnr or 0\n  local bufnr --- @type integer?\n  if loclist then\n    bufnr = api.nvim_win_get_buf(winnr)\n  end\n\n  -- Don't clamp line numbers since the quickfix list can already handle line\n  -- numbers beyond the end of the buffer\n  local diagnostics = M._store.get_diagnostics(bufnr, opts --[[@as vim.diagnostic.GetOpts]], false)\n  if opts.format then\n    diagnostics = require('vim.diagnostic._shared').reformat_diagnostics(opts.format, diagnostics)\n  end\n  local items = M.toqflist(diagnostics)\n  local qf_id = nil\n  if loclist then\n    vim.fn.setloclist(winnr, {}, 'u', { title = title, items = items })\n  else\n    qf_id = get_qf_id_for_title(title)\n    -- If we already have a diagnostics quickfix, update it rather than creating a new one.\n    -- This avoids polluting the finite set of quickfix lists, and preserves the currently selected\n    -- entry.\n    vim.fn.setqflist({}, qf_id and 'u' or ' ', {\n      title = title,\n      items = items,\n      id = qf_id,\n    })\n  end\n\n  if open then\n    if not loclist then\n      -- First navigate to the diagnostics quickfix list.\n      local qflist = vim.fn.getqflist({ id = qf_id, nr = 0 }) --- @type { nr: integer }\n      local nr = qflist.nr\n      api.nvim_command(('silent %dchistory'):format(nr))\n      -- Now open the quickfix list.\n      api.nvim_command('botright cwindow')\n    else\n      api.nvim_command('lwindow')\n    end\n  end\nend",
    "spans": [
      {
        "start": 0,
        "end": 5,
        "className": "syntax-keyword"
      },
      {
        "start": 6,
        "end": 14,
        "className": "syntax-keyword"
      },
      {
        "start": 15,
        "end": 23,
        "className": "syntax-function"
      },
      {
        "start": 23,
        "end": 24,
        "className": "syntax-punctuation"
      },
      {
        "start": 31,
        "end": 32,
        "className": "syntax-punctuation"
      },
      {
        "start": 37,
        "end": 38,
        "className": "syntax-punctuation"
      },
      {
        "start": 41,
        "end": 45,
        "className": "syntax-variable"
      },
      {
        "start": 46,
        "end": 47,
        "className": "syntax-operator"
      },
      {
        "start": 48,
        "end": 52,
        "className": "syntax-variable"
      },
      {
        "start": 53,
        "end": 55,
        "className": "syntax-keyword"
      },
      {
        "start": 56,
        "end": 58,
        "className": "syntax-type"
      },
      {
        "start": 61,
        "end": 66,
        "className": "syntax-keyword"
      },
      {
        "start": 67,
        "end": 71,
        "className": "syntax-variable"
      },
      {
        "start": 72,
        "end": 73,
        "className": "syntax-operator"
      },
      {
        "start": 74,
        "end": 77,
        "className": "syntax-variable"
      },
      {
        "start": 77,
        "end": 78,
        "className": "syntax-punctuation"
      },
      {
        "start": 78,
        "end": 84,
        "className": "syntax-function"
      },
      {
        "start": 84,
        "end": 85,
        "className": "syntax-punctuation"
      },
      {
        "start": 85,
        "end": 89,
        "className": "syntax-variable"
      },
      {
        "start": 89,
        "end": 90,
        "className": "syntax-punctuation"
      },
      {
        "start": 90,
        "end": 94,
        "className": "syntax-variable"
      },
      {
        "start": 94,
        "end": 95,
        "className": "syntax-punctuation"
      },
      {
        "start": 100,
        "end": 101,
        "className": "syntax-punctuation"
      },
      {
        "start": 104,
        "end": 109,
        "className": "syntax-keyword"
      },
      {
        "start": 110,
        "end": 115,
        "className": "syntax-variable"
      },
      {
        "start": 116,
        "end": 117,
        "className": "syntax-operator"
      },
      {
        "start": 118,
        "end": 122,
        "className": "syntax-variable"
      },
      {
        "start": 122,
        "end": 123,
        "className": "syntax-punctuation"
      },
      {
        "start": 123,
        "end": 128,
        "className": "syntax-variable"
      },
      {
        "start": 129,
        "end": 131,
        "className": "syntax-keyword"
      },
      {
        "start": 132,
        "end": 145,
        "className": "syntax-string"
      },
      {
        "start": 148,
        "end": 153,
        "className": "syntax-keyword"
      },
      {
        "start": 154,
        "end": 159,
        "className": "syntax-variable"
      },
      {
        "start": 160,
        "end": 161,
        "className": "syntax-operator"
      },
      {
        "start": 162,
        "end": 166,
        "className": "syntax-variable"
      },
      {
        "start": 166,
        "end": 167,
        "className": "syntax-punctuation"
      },
      {
        "start": 167,
        "end": 172,
        "className": "syntax-variable"
      },
      {
        "start": 173,
        "end": 175,
        "className": "syntax-keyword"
      },
      {
        "start": 176,
        "end": 177,
        "className": "syntax-number"
      },
      {
        "start": 180,
        "end": 185,
        "className": "syntax-keyword"
      },
      {
        "start": 186,
        "end": 191,
        "className": "syntax-variable"
      },
      {
        "start": 192,
        "end": 210,
        "className": "syntax-comment"
      },
      {
        "start": 216,
        "end": 223,
        "className": "syntax-variable"
      },
      {
        "start": 233,
        "end": 238,
        "className": "syntax-variable"
      },
      {
        "start": 239,
        "end": 240,
        "className": "syntax-operator"
      },
      {
        "start": 241,
        "end": 244,
        "className": "syntax-variable"
      },
      {
        "start": 244,
        "end": 245,
        "className": "syntax-punctuation"
      },
      {
        "start": 245,
        "end": 261,
        "className": "syntax-function"
      },
      {
        "start": 261,
        "end": 262,
        "className": "syntax-punctuation"
      },
      {
        "start": 262,
        "end": 267,
        "className": "syntax-variable"
      },
      {
        "start": 267,
        "end": 268,
        "className": "syntax-punctuation"
      },
      {
        "start": 278,
        "end": 353,
        "className": "syntax-comment"
      },
      {
        "start": 356,
        "end": 395,
        "className": "syntax-comment"
      },
      {
        "start": 398,
        "end": 403,
        "className": "syntax-keyword"
      },
      {
        "start": 404,
        "end": 415,
        "className": "syntax-variable"
      },
      {
        "start": 416,
        "end": 417,
        "className": "syntax-operator"
      },
      {
        "start": 418,
        "end": 419,
        "className": "syntax-constant"
      },
      {
        "start": 419,
        "end": 420,
        "className": "syntax-punctuation"
      },
      {
        "start": 426,
        "end": 427,
        "className": "syntax-punctuation"
      },
      {
        "start": 427,
        "end": 442,
        "className": "syntax-function"
      },
      {
        "start": 442,
        "end": 443,
        "className": "syntax-punctuation"
      },
      {
        "start": 443,
        "end": 448,
        "className": "syntax-variable"
      },
      {
        "start": 448,
        "end": 449,
        "className": "syntax-punctuation"
      },
      {
        "start": 450,
        "end": 454,
        "className": "syntax-variable"
      },
      {
        "start": 455,
        "end": 487,
        "className": "syntax-comment"
      },
      {
        "start": 487,
        "end": 488,
        "className": "syntax-punctuation"
      },
      {
        "start": 494,
        "end": 495,
        "className": "syntax-punctuation"
      },
      {
        "start": 501,
        "end": 505,
        "className": "syntax-variable"
      },
      {
        "start": 505,
        "end": 506,
        "className": "syntax-punctuation"
      },
      {
        "start": 522,
        "end": 533,
        "className": "syntax-variable"
      },
      {
        "start": 534,
        "end": 535,
        "className": "syntax-operator"
      },
      {
        "start": 536,
        "end": 543,
        "className": "syntax-function"
      },
      {
        "start": 543,
        "end": 544,
        "className": "syntax-punctuation"
      },
      {
        "start": 544,
        "end": 568,
        "className": "syntax-string"
      },
      {
        "start": 568,
        "end": 570,
        "className": "syntax-punctuation"
      },
      {
        "start": 570,
        "end": 590,
        "className": "syntax-function"
      },
      {
        "start": 590,
        "end": 591,
        "className": "syntax-punctuation"
      },
      {
        "start": 591,
        "end": 595,
        "className": "syntax-variable"
      },
      {
        "start": 595,
        "end": 596,
        "className": "syntax-punctuation"
      },
      {
        "start": 602,
        "end": 603,
        "className": "syntax-punctuation"
      },
      {
        "start": 604,
        "end": 615,
        "className": "syntax-variable"
      },
      {
        "start": 615,
        "end": 616,
        "className": "syntax-punctuation"
      },
      {
        "start": 625,
        "end": 630,
        "className": "syntax-keyword"
      },
      {
        "start": 631,
        "end": 636,
        "className": "syntax-variable"
      },
      {
        "start": 637,
        "end": 638,
        "className": "syntax-operator"
      },
      {
        "start": 639,
        "end": 640,
        "className": "syntax-constant"
      },
      {
        "start": 640,
        "end": 641,
        "className": "syntax-punctuation"
      },
      {
        "start": 641,
        "end": 649,
        "className": "syntax-function"
      },
      {
        "start": 649,
        "end": 650,
        "className": "syntax-punctuation"
      },
      {
        "start": 650,
        "end": 661,
        "className": "syntax-variable"
      },
      {
        "start": 661,
        "end": 662,
        "className": "syntax-punctuation"
      },
      {
        "start": 665,
        "end": 670,
        "className": "syntax-keyword"
      },
      {
        "start": 671,
        "end": 676,
        "className": "syntax-variable"
      },
      {
        "start": 677,
        "end": 678,
        "className": "syntax-operator"
      },
      {
        "start": 679,
        "end": 682,
        "className": "syntax-constant"
      },
      {
        "start": 688,
        "end": 695,
        "className": "syntax-variable"
      },
      {
        "start": 705,
        "end": 708,
        "className": "syntax-variable"
      },
      {
        "start": 708,
        "end": 709,
        "className": "syntax-punctuation"
      },
      {
        "start": 711,
        "end": 712,
        "className": "syntax-punctuation"
      },
      {
        "start": 712,
        "end": 722,
        "className": "syntax-function"
      },
      {
        "start": 722,
        "end": 723,
        "className": "syntax-punctuation"
      },
      {
        "start": 723,
        "end": 728,
        "className": "syntax-variable"
      },
      {
        "start": 728,
        "end": 729,
        "className": "syntax-punctuation"
      },
      {
        "start": 730,
        "end": 732,
        "className": "syntax-type"
      },
      {
        "start": 732,
        "end": 733,
        "className": "syntax-punctuation"
      },
      {
        "start": 734,
        "end": 737,
        "className": "syntax-string"
      },
      {
        "start": 737,
        "end": 738,
        "className": "syntax-punctuation"
      },
      {
        "start": 739,
        "end": 740,
        "className": "syntax-type"
      },
      {
        "start": 741,
        "end": 746,
        "className": "syntax-variable"
      },
      {
        "start": 747,
        "end": 748,
        "className": "syntax-operator"
      },
      {
        "start": 749,
        "end": 754,
        "className": "syntax-variable"
      },
      {
        "start": 754,
        "end": 755,
        "className": "syntax-punctuation"
      },
      {
        "start": 756,
        "end": 761,
        "className": "syntax-variable"
      },
      {
        "start": 762,
        "end": 763,
        "className": "syntax-operator"
      },
      {
        "start": 764,
        "end": 769,
        "className": "syntax-variable"
      },
      {
        "start": 770,
        "end": 771,
        "className": "syntax-type"
      },
      {
        "start": 771,
        "end": 772,
        "className": "syntax-punctuation"
      },
      {
        "start": 784,
        "end": 789,
        "className": "syntax-variable"
      },
      {
        "start": 790,
        "end": 791,
        "className": "syntax-operator"
      },
      {
        "start": 792,
        "end": 811,
        "className": "syntax-function"
      },
      {
        "start": 811,
        "end": 812,
        "className": "syntax-punctuation"
      },
      {
        "start": 812,
        "end": 817,
        "className": "syntax-variable"
      },
      {
        "start": 817,
        "end": 818,
        "className": "syntax-punctuation"
      },
      {
        "start": 823,
        "end": 910,
        "className": "syntax-comment"
      },
      {
        "start": 915,
        "end": 1010,
        "className": "syntax-comment"
      },
      {
        "start": 1015,
        "end": 1024,
        "className": "syntax-comment"
      },
      {
        "start": 1029,
        "end": 1032,
        "className": "syntax-variable"
      },
      {
        "start": 1032,
        "end": 1033,
        "className": "syntax-punctuation"
      },
      {
        "start": 1035,
        "end": 1036,
        "className": "syntax-punctuation"
      },
      {
        "start": 1036,
        "end": 1045,
        "className": "syntax-function"
      },
      {
        "start": 1045,
        "end": 1046,
        "className": "syntax-punctuation"
      },
      {
        "start": 1046,
        "end": 1048,
        "className": "syntax-type"
      },
      {
        "start": 1048,
        "end": 1049,
        "className": "syntax-punctuation"
      },
      {
        "start": 1050,
        "end": 1055,
        "className": "syntax-variable"
      },
      {
        "start": 1056,
        "end": 1059,
        "className": "syntax-keyword"
      },
      {
        "start": 1060,
        "end": 1063,
        "className": "syntax-string"
      },
      {
        "start": 1064,
        "end": 1066,
        "className": "syntax-keyword"
      },
      {
        "start": 1067,
        "end": 1070,
        "className": "syntax-string"
      },
      {
        "start": 1070,
        "end": 1071,
        "className": "syntax-punctuation"
      },
      {
        "start": 1072,
        "end": 1073,
        "className": "syntax-type"
      },
      {
        "start": 1080,
        "end": 1085,
        "className": "syntax-variable"
      },
      {
        "start": 1086,
        "end": 1087,
        "className": "syntax-operator"
      },
      {
        "start": 1088,
        "end": 1093,
        "className": "syntax-variable"
      },
      {
        "start": 1093,
        "end": 1094,
        "className": "syntax-punctuation"
      },
      {
        "start": 1101,
        "end": 1106,
        "className": "syntax-variable"
      },
      {
        "start": 1107,
        "end": 1108,
        "className": "syntax-operator"
      },
      {
        "start": 1109,
        "end": 1114,
        "className": "syntax-variable"
      },
      {
        "start": 1114,
        "end": 1115,
        "className": "syntax-punctuation"
      },
      {
        "start": 1125,
        "end": 1126,
        "className": "syntax-operator"
      },
      {
        "start": 1127,
        "end": 1132,
        "className": "syntax-variable"
      },
      {
        "start": 1132,
        "end": 1133,
        "className": "syntax-punctuation"
      },
      {
        "start": 1138,
        "end": 1139,
        "className": "syntax-type"
      },
      {
        "start": 1139,
        "end": 1140,
        "className": "syntax-punctuation"
      },
      {
        "start": 1153,
        "end": 1157,
        "className": "syntax-variable"
      },
      {
        "start": 1170,
        "end": 1173,
        "className": "syntax-keyword"
      },
      {
        "start": 1174,
        "end": 1181,
        "className": "syntax-variable"
      },
      {
        "start": 1193,
        "end": 1244,
        "className": "syntax-comment"
      },
      {
        "start": 1251,
        "end": 1256,
        "className": "syntax-keyword"
      },
      {
        "start": 1257,
        "end": 1263,
        "className": "syntax-variable"
      },
      {
        "start": 1264,
        "end": 1265,
        "className": "syntax-operator"
      },
      {
        "start": 1266,
        "end": 1269,
        "className": "syntax-variable"
      },
      {
        "start": 1269,
        "end": 1270,
        "className": "syntax-punctuation"
      },
      {
        "start": 1272,
        "end": 1273,
        "className": "syntax-punctuation"
      },
      {
        "start": 1273,
        "end": 1282,
        "className": "syntax-function"
      },
      {
        "start": 1282,
        "end": 1283,
        "className": "syntax-punctuation"
      },
      {
        "start": 1283,
        "end": 1284,
        "className": "syntax-type"
      },
      {
        "start": 1288,
        "end": 1289,
        "className": "syntax-operator"
      },
      {
        "start": 1290,
        "end": 1295,
        "className": "syntax-variable"
      },
      {
        "start": 1295,
        "end": 1296,
        "className": "syntax-punctuation"
      },
      {
        "start": 1300,
        "end": 1301,
        "className": "syntax-operator"
      },
      {
        "start": 1302,
        "end": 1303,
        "className": "syntax-number"
      },
      {
        "start": 1304,
        "end": 1305,
        "className": "syntax-type"
      },
      {
        "start": 1305,
        "end": 1306,
        "className": "syntax-punctuation"
      },
      {
        "start": 1307,
        "end": 1332,
        "className": "syntax-comment"
      },
      {
        "start": 1339,
        "end": 1344,
        "className": "syntax-keyword"
      },
      {
        "start": 1345,
        "end": 1347,
        "className": "syntax-variable"
      },
      {
        "start": 1348,
        "end": 1349,
        "className": "syntax-operator"
      },
      {
        "start": 1350,
        "end": 1356,
        "className": "syntax-variable"
      },
      {
        "start": 1356,
        "end": 1357,
        "className": "syntax-punctuation"
      },
      {
        "start": 1357,
        "end": 1359,
        "className": "syntax-variable"
      },
      {
        "start": 1366,
        "end": 1369,
        "className": "syntax-variable"
      },
      {
        "start": 1369,
        "end": 1370,
        "className": "syntax-punctuation"
      },
      {
        "start": 1370,
        "end": 1382,
        "className": "syntax-function"
      },
      {
        "start": 1382,
        "end": 1384,
        "className": "syntax-punctuation"
      },
      {
        "start": 1384,
        "end": 1403,
        "className": "syntax-string"
      },
      {
        "start": 1403,
        "end": 1405,
        "className": "syntax-punctuation"
      },
      {
        "start": 1411,
        "end": 1412,
        "className": "syntax-punctuation"
      },
      {
        "start": 1412,
        "end": 1414,
        "className": "syntax-variable"
      },
      {
        "start": 1414,
        "end": 1416,
        "className": "syntax-punctuation"
      },
      {
        "start": 1423,
        "end": 1453,
        "className": "syntax-comment"
      },
      {
        "start": 1460,
        "end": 1463,
        "className": "syntax-variable"
      },
      {
        "start": 1463,
        "end": 1464,
        "className": "syntax-punctuation"
      },
      {
        "start": 1464,
        "end": 1476,
        "className": "syntax-function"
      },
      {
        "start": 1476,
        "end": 1477,
        "className": "syntax-punctuation"
      },
      {
        "start": 1477,
        "end": 1495,
        "className": "syntax-string"
      },
      {
        "start": 1495,
        "end": 1496,
        "className": "syntax-punctuation"
      },
      {
        "start": 1512,
        "end": 1515,
        "className": "syntax-variable"
      },
      {
        "start": 1515,
        "end": 1516,
        "className": "syntax-punctuation"
      },
      {
        "start": 1516,
        "end": 1528,
        "className": "syntax-function"
      },
      {
        "start": 1528,
        "end": 1529,
        "className": "syntax-punctuation"
      },
      {
        "start": 1529,
        "end": 1538,
        "className": "syntax-string"
      },
      {
        "start": 1538,
        "end": 1539,
        "className": "syntax-punctuation"
      },
      {
        "start": 1554,
        "end": 1557,
        "className": "syntax-keyword"
      }
    ]
  },
  {
    "language": "lua",
    "name": "lua/neovim_lsp_client.lua",
    "code": "function Client:_process_request(id, req_type, bufnr, method)\n  local pending = req_type == 'pending'\n\n  validate('id', id, 'number')\n  if pending then\n    validate('bufnr', bufnr, 'number')\n    validate('method', method, 'string')\n  end\n\n  local cur_request = self.requests[id]\n\n  if pending and cur_request then\n    log.error(\n      self._log_prefix,\n      ('Cannot create request with id %d as one already exists'):format(id)\n    )\n    return\n  elseif not pending and not cur_request then\n    log.error(\n      self._log_prefix,\n      ('Cannot find request with id %d whilst attempting to %s'):format(id, req_type)\n    )\n    return\n  end\n\n  if cur_request then\n    bufnr = cur_request.bufnr\n    method = cur_request.method\n  end\n\n  assert(bufnr and method)\n\n  local request = { type = req_type, bufnr = bufnr, method = method }\n\n  -- Clear 'complete' requests\n  -- Note 'pending' and 'cancelled' requests are cleared when the server sends a response\n  -- which is processed via the notify_reply_callback argument to rpc.request.\n  self.requests[id] = req_type ~= 'complete' and request or nil\n\n  api.nvim_exec_autocmds('LspRequest', {\n    buf = api.nvim_buf_is_valid(bufnr) and bufnr or nil,\n    modeline = false,\n    data = { client_id = self.id, request_id = id, request = request },\n  })\nend",
    "spans": [
      {
        "start": 0,
        "end": 8,
        "className": "syntax-keyword"
      },
      {
        "start": 9,
        "end": 15,
        "className": "syntax-variable"
      },
      {
        "start": 15,
        "end": 16,
        "className": "syntax-punctuation"
      },
      {
        "start": 32,
        "end": 33,
        "className": "syntax-punctuation"
      },
      {
        "start": 35,
        "end": 36,
        "className": "syntax-punctuation"
      },
      {
        "start": 45,
        "end": 46,
        "className": "syntax-punctuation"
      },
      {
        "start": 52,
        "end": 53,
        "className": "syntax-punctuation"
      },
      {
        "start": 60,
        "end": 61,
        "className": "syntax-punctuation"
      },
      {
        "start": 64,
        "end": 69,
        "className": "syntax-keyword"
      },
      {
        "start": 70,
        "end": 77,
        "className": "syntax-variable"
      },
      {
        "start": 78,
        "end": 79,
        "className": "syntax-operator"
      },
      {
        "start": 80,
        "end": 88,
        "className": "syntax-variable"
      },
      {
        "start": 89,
        "end": 91,
        "className": "syntax-operator"
      },
      {
        "start": 92,
        "end": 101,
        "className": "syntax-string"
      },
      {
        "start": 105,
        "end": 113,
        "className": "syntax-function"
      },
      {
        "start": 113,
        "end": 114,
        "className": "syntax-punctuation"
      },
      {
        "start": 114,
        "end": 118,
        "className": "syntax-string"
      },
      {
        "start": 118,
        "end": 119,
        "className": "syntax-punctuation"
      },
      {
        "start": 120,
        "end": 122,
        "className": "syntax-variable"
      },
      {
        "start": 122,
        "end": 123,
        "className": "syntax-punctuation"
      },
      {
        "start": 124,
        "end": 132,
        "className": "syntax-string"
      },
      {
        "start": 132,
        "end": 133,
        "className": "syntax-punctuation"
      },
      {
        "start": 139,
        "end": 146,
        "className": "syntax-variable"
      },
      {
        "start": 156,
        "end": 164,
        "className": "syntax-function"
      },
      {
        "start": 164,
        "end": 165,
        "className": "syntax-punctuation"
      },
      {
        "start": 165,
        "end": 172,
        "className": "syntax-string"
      },
      {
        "start": 172,
        "end": 173,
        "className": "syntax-punctuation"
      },
      {
        "start": 174,
        "end": 179,
        "className": "syntax-variable"
      },
      {
        "start": 179,
        "end": 180,
        "className": "syntax-punctuation"
      },
      {
        "start": 181,
        "end": 189,
        "className": "syntax-string"
      },
      {
        "start": 189,
        "end": 190,
        "className": "syntax-punctuation"
      },
      {
        "start": 195,
        "end": 203,
        "className": "syntax-function"
      },
      {
        "start": 203,
        "end": 204,
        "className": "syntax-punctuation"
      },
      {
        "start": 204,
        "end": 212,
        "className": "syntax-string"
      },
      {
        "start": 212,
        "end": 213,
        "className": "syntax-punctuation"
      },
      {
        "start": 214,
        "end": 220,
        "className": "syntax-variable"
      },
      {
        "start": 220,
        "end": 221,
        "className": "syntax-punctuation"
      },
      {
        "start": 222,
        "end": 230,
        "className": "syntax-string"
      },
      {
        "start": 230,
        "end": 231,
        "className": "syntax-punctuation"
      },
      {
        "start": 241,
        "end": 246,
        "className": "syntax-keyword"
      },
      {
        "start": 247,
        "end": 258,
        "className": "syntax-variable"
      },
      {
        "start": 259,
        "end": 260,
        "className": "syntax-operator"
      },
      {
        "start": 261,
        "end": 265,
        "className": "syntax-variable"
      },
      {
        "start": 265,
        "end": 266,
        "className": "syntax-punctuation"
      },
      {
        "start": 274,
        "end": 275,
        "className": "syntax-punctuation"
      },
      {
        "start": 275,
        "end": 277,
        "className": "syntax-variable"
      },
      {
        "start": 277,
        "end": 278,
        "className": "syntax-punctuation"
      },
      {
        "start": 285,
        "end": 292,
        "className": "syntax-variable"
      },
      {
        "start": 293,
        "end": 296,
        "className": "syntax-keyword"
      },
      {
        "start": 297,
        "end": 308,
        "className": "syntax-variable"
      },
      {
        "start": 318,
        "end": 321,
        "className": "syntax-variable"
      },
      {
        "start": 321,
        "end": 322,
        "className": "syntax-punctuation"
      },
      {
        "start": 322,
        "end": 327,
        "className": "syntax-function"
      },
      {
        "start": 327,
        "end": 328,
        "className": "syntax-punctuation"
      },
      {
        "start": 335,
        "end": 339,
        "className": "syntax-variable"
      },
      {
        "start": 339,
        "end": 340,
        "className": "syntax-punctuation"
      },
      {
        "start": 351,
        "end": 352,
        "className": "syntax-punctuation"
      },
      {
        "start": 359,
        "end": 360,
        "className": "syntax-punctuation"
      },
      {
        "start": 360,
        "end": 416,
        "className": "syntax-string"
      },
      {
        "start": 416,
        "end": 418,
        "className": "syntax-punctuation"
      },
      {
        "start": 424,
        "end": 425,
        "className": "syntax-punctuation"
      },
      {
        "start": 425,
        "end": 427,
        "className": "syntax-variable"
      },
      {
        "start": 427,
        "end": 428,
        "className": "syntax-punctuation"
      },
      {
        "start": 433,
        "end": 434,
        "className": "syntax-punctuation"
      },
      {
        "start": 439,
        "end": 445,
        "className": "syntax-keyword"
      },
      {
        "start": 455,
        "end": 458,
        "className": "syntax-keyword"
      },
      {
        "start": 459,
        "end": 466,
        "className": "syntax-variable"
      },
      {
        "start": 467,
        "end": 470,
        "className": "syntax-keyword"
      },
      {
        "start": 471,
        "end": 474,
        "className": "syntax-keyword"
      },
      {
        "start": 475,
        "end": 486,
        "className": "syntax-variable"
      },
      {
        "start": 496,
        "end": 499,
        "className": "syntax-variable"
      },
      {
        "start": 499,
        "end": 500,
        "className": "syntax-punctuation"
      },
      {
        "start": 500,
        "end": 505,
        "className": "syntax-function"
      },
      {
        "start": 505,
        "end": 506,
        "className": "syntax-punctuation"
      },
      {
        "start": 513,
        "end": 517,
        "className": "syntax-variable"
      },
      {
        "start": 517,
        "end": 518,
        "className": "syntax-punctuation"
      },
      {
        "start": 529,
        "end": 530,
        "className": "syntax-punctuation"
      },
      {
        "start": 537,
        "end": 538,
        "className": "syntax-punctuation"
      },
      {
        "start": 538,
        "end": 594,
        "className": "syntax-string"
      },
      {
        "start": 594,
        "end": 596,
        "className": "syntax-punctuation"
      },
      {
        "start": 602,
        "end": 603,
        "className": "syntax-punctuation"
      },
      {
        "start": 603,
        "end": 605,
        "className": "syntax-variable"
      },
      {
        "start": 605,
        "end": 606,
        "className": "syntax-punctuation"
      },
      {
        "start": 607,
        "end": 615,
        "className": "syntax-variable"
      },
      {
        "start": 615,
        "end": 616,
        "className": "syntax-punctuation"
      },
      {
        "start": 621,
        "end": 622,
        "className": "syntax-punctuation"
      },
      {
        "start": 627,
        "end": 633,
        "className": "syntax-keyword"
      },
      {
        "start": 646,
        "end": 657,
        "className": "syntax-variable"
      },
      {
        "start": 667,
        "end": 672,
        "className": "syntax-variable"
      },
      {
        "start": 673,
        "end": 674,
        "className": "syntax-operator"
      },
      {
        "start": 675,
        "end": 686,
        "className": "syntax-variable"
      },
      {
        "start": 686,
        "end": 687,
        "className": "syntax-punctuation"
      },
      {
        "start": 687,
        "end": 692,
        "className": "syntax-variable"
      },
      {
        "start": 697,
        "end": 703,
        "className": "syntax-variable"
      },
      {
        "start": 704,
        "end": 705,
        "className": "syntax-operator"
      },
      {
        "start": 706,
        "end": 717,
        "className": "syntax-variable"
      },
      {
        "start": 717,
        "end": 718,
        "className": "syntax-punctuation"
      },
      {
        "start": 718,
        "end": 724,
        "className": "syntax-variable"
      },
      {
        "start": 734,
        "end": 740,
        "className": "syntax-function"
      },
      {
        "start": 740,
        "end": 741,
        "className": "syntax-punctuation"
      },
      {
        "start": 741,
        "end": 746,
        "className": "syntax-variable"
      },
      {
        "start": 747,
        "end": 750,
        "className": "syntax-keyword"
      },
      {
        "start": 751,
        "end": 757,
        "className": "syntax-variable"
      },
      {
        "start": 757,
        "end": 758,
        "className": "syntax-punctuation"
      },
      {
        "start": 762,
        "end": 767,
        "className": "syntax-keyword"
      },
      {
        "start": 768,
        "end": 775,
        "className": "syntax-variable"
      },
      {
        "start": 776,
        "end": 777,
        "className": "syntax-operator"
      },
      {
        "start": 778,
        "end": 779,
        "className": "syntax-type"
      },
      {
        "start": 785,
        "end": 786,
        "className": "syntax-operator"
      },
      {
        "start": 787,
        "end": 795,
        "className": "syntax-variable"
      },
      {
        "start": 795,
        "end": 796,
        "className": "syntax-punctuation"
      },
      {
        "start": 803,
        "end": 804,
        "className": "syntax-operator"
      },
      {
        "start": 805,
        "end": 810,
        "className": "syntax-variable"
      },
      {
        "start": 810,
        "end": 811,
        "className": "syntax-punctuation"
      },
      {
        "start": 819,
        "end": 820,
        "className": "syntax-operator"
      },
      {
        "start": 821,
        "end": 827,
        "className": "syntax-variable"
      },
      {
        "start": 828,
        "end": 829,
        "className": "syntax-type"
      },
      {
        "start": 833,
        "end": 861,
        "className": "syntax-comment"
      },
      {
        "start": 864,
        "end": 951,
        "className": "syntax-comment"
      },
      {
        "start": 954,
        "end": 1030,
        "className": "syntax-comment"
      },
      {
        "start": 1033,
        "end": 1037,
        "className": "syntax-variable"
      },
      {
        "start": 1037,
        "end": 1038,
        "className": "syntax-punctuation"
      },
      {
        "start": 1046,
        "end": 1047,
        "className": "syntax-punctuation"
      },
      {
        "start": 1047,
        "end": 1049,
        "className": "syntax-variable"
      },
      {
        "start": 1049,
        "end": 1050,
        "className": "syntax-punctuation"
      },
      {
        "start": 1051,
        "end": 1052,
        "className": "syntax-operator"
      },
      {
        "start": 1053,
        "end": 1061,
        "className": "syntax-variable"
      },
      {
        "start": 1062,
        "end": 1064,
        "className": "syntax-operator"
      },
      {
        "start": 1065,
        "end": 1075,
        "className": "syntax-string"
      },
      {
        "start": 1076,
        "end": 1079,
        "className": "syntax-keyword"
      },
      {
        "start": 1080,
        "end": 1087,
        "className": "syntax-variable"
      },
      {
        "start": 1088,
        "end": 1090,
        "className": "syntax-keyword"
      },
      {
        "start": 1091,
        "end": 1094,
        "className": "syntax-constant"
      },
      {
        "start": 1098,
        "end": 1101,
        "className": "syntax-variable"
      },
      {
        "start": 1101,
        "end": 1102,
        "className": "syntax-punctuation"
      },
      {
        "start": 1102,
        "end": 1120,
        "className": "syntax-function"
      },
      {
        "start": 1120,
        "end": 1121,
        "className": "syntax-punctuation"
      },
      {
        "start": 1121,
        "end": 1133,
        "className": "syntax-string"
      },
      {
        "start": 1133,
        "end": 1134,
        "className": "syntax-punctuation"
      },
      {
        "start": 1135,
        "end": 1136,
        "className": "syntax-type"
      },
      {
        "start": 1145,
        "end": 1146,
        "className": "syntax-operator"
      },
      {
        "start": 1147,
        "end": 1150,
        "className": "syntax-variable"
      },
      {
        "start": 1150,
        "end": 1151,
        "className": "syntax-punctuation"
      },
      {
        "start": 1151,
        "end": 1168,
        "className": "syntax-function"
      },
      {
        "start": 1168,
        "end": 1169,
        "className": "syntax-punctuation"
      },
      {
        "start": 1169,
        "end": 1174,
        "className": "syntax-variable"
      },
      {
        "start": 1174,
        "end": 1175,
        "className": "syntax-punctuation"
      },
      {
        "start": 1176,
        "end": 1179,
        "className": "syntax-keyword"
      },
      {
        "start": 1180,
        "end": 1185,
        "className": "syntax-variable"
      },
      {
        "start": 1186,
        "end": 1188,
        "className": "syntax-keyword"
      },
      {
        "start": 1189,
        "end": 1192,
        "className": "syntax-constant"
      },
      {
        "start": 1192,
        "end": 1193,
        "className": "syntax-punctuation"
      },
      {
        "start": 1207,
        "end": 1208,
        "className": "syntax-operator"
      },
      {
        "start": 1214,
        "end": 1215,
        "className": "syntax-punctuation"
      },
      {
        "start": 1225,
        "end": 1226,
        "className": "syntax-operator"
      },
      {
        "start": 1227,
        "end": 1228,
        "className": "syntax-type"
      },
      {
        "start": 1239,
        "end": 1240,
        "className": "syntax-operator"
      },
      {
        "start": 1241,
        "end": 1245,
        "className": "syntax-variable"
      },
      {
        "start": 1245,
        "end": 1246,
        "className": "syntax-punctuation"
      },
      {
        "start": 1248,
        "end": 1249,
        "className": "syntax-punctuation"
      },
      {
        "start": 1261,
        "end": 1262,
        "className": "syntax-operator"
      },
      {
        "start": 1263,
        "end": 1265,
        "className": "syntax-variable"
      },
      {
        "start": 1265,
        "end": 1266,
        "className": "syntax-punctuation"
      },
      {
        "start": 1267,
        "end": 1274,
        "className": "syntax-variable"
      },
      {
        "start": 1275,
        "end": 1276,
        "className": "syntax-operator"
      },
      {
        "start": 1277,
        "end": 1284,
        "className": "syntax-variable"
      },
      {
        "start": 1285,
        "end": 1286,
        "className": "syntax-type"
      },
      {
        "start": 1286,
        "end": 1287,
        "className": "syntax-punctuation"
      },
      {
        "start": 1290,
        "end": 1291,
        "className": "syntax-type"
      },
      {
        "start": 1291,
        "end": 1292,
        "className": "syntax-punctuation"
      },
      {
        "start": 1293,
        "end": 1296,
        "className": "syntax-keyword"
      }
    ]
  },
  {
    "language": "nix",
    "name": "nix/nixpkgs_ripgrep.nix",
    "code": "{\n  lib,\n  stdenv,\n  buildPackages,\n  fetchFromGitHub,\n  rustPlatform,\n  installShellFiles,\n  pkg-config,\n  withPCRE2 ? true,\n  pcre2,\n  writableTmpDirAsHomeHook,\n}:\n\nlet\n  canRunRg = stdenv.hostPlatform.emulatorAvailable buildPackages;\n  rg = \"${stdenv.hostPlatform.emulator buildPackages} $out/bin/rg${stdenv.hostPlatform.extensions.executable}\";\nin\nrustPlatform.buildRustPackage (finalAttrs: {\n  pname = \"ripgrep\";\n  version = \"15.1.0\";\n\n  __structuredAttrs = true;\n\n  src = fetchFromGitHub {\n    owner = \"BurntSushi\";\n    repo = \"ripgrep\";\n    tag = finalAttrs.version;\n    hash = \"sha256-0gjwYMUlXYnmIWQS1SVzF1yQw1lpveRLw5qp049lc3I=\";\n  };\n\n  cargoHash = \"sha256-ry3pLuYNwX776Dpj9IE2+uc7eEa5+sQvdNNeG1eJecs=\";\n\n  nativeBuildInputs = [\n    installShellFiles\n    writableTmpDirAsHomeHook # required for wine when cross-compiling to Windows\n  ]\n  ++ lib.optional withPCRE2 pkg-config;\n  buildInputs = lib.optional withPCRE2 pcre2;\n\n  buildFeatures = lib.optional withPCRE2 \"pcre2\";\n\n  postFixup = lib.optionalString canRunRg ''\n    ${rg} --generate man > rg.1\n    installManPage rg.1\n\n    installShellCompletion --cmd rg \\\n      --bash <(${rg} --generate complete-bash) \\\n      --fish <(${rg} --generate complete-fish) \\\n      --zsh <(${rg} --generate complete-zsh)\n  '';\n\n  doInstallCheck = true;\n  installCheckPhase = ''\n    file=\"$(mktemp)\"\n    echo \"abc\\nbcd\\ncde\" > \"$file\"\n    ${rg} -N 'bcd' \"$file\"\n    ${rg} -N 'cd' \"$file\"\n  ''\n  + lib.optionalString withPCRE2 ''\n    echo '(a(aa)aa)' | ${rg} -P '\\((a*|(?R))*\\)'\n  '';\n\n  meta = {\n    description = \"Utility that combines the usability of The Silver Searcher with the raw speed of grep\";\n    homepage = \"https://github.com/BurntSushi/ripgrep\";\n    changelog = \"https://github.com/BurntSushi/ripgrep/releases/tag/${finalAttrs.version}\";\n    license = with lib.licenses; [\n      unlicense # or\n      mit\n    ];\n    maintainers = with lib.maintainers; [\n      globin\n      ma27\n      zowoq\n    ];\n    mainProgram = \"rg\";\n    platforms = lib.platforms.all;\n  };\n})",
    "spans": [
      {
        "start": 0,
        "end": 1,
        "className": "syntax-punctuation"
      },
      {
        "start": 4,
        "end": 7,
        "className": "syntax-variable"
      },
      {
        "start": 7,
        "end": 8,
        "className": "syntax-punctuation"
      },
      {
        "start": 11,
        "end": 17,
        "className": "syntax-variable"
      },
      {
        "start": 17,
        "end": 18,
        "className": "syntax-punctuation"
      },
      {
        "start": 21,
        "end": 34,
        "className": "syntax-variable"
      },
      {
        "start": 34,
        "end": 35,
        "className": "syntax-punctuation"
      },
      {
        "start": 38,
        "end": 53,
        "className": "syntax-variable"
      },
      {
        "start": 53,
        "end": 54,
        "className": "syntax-punctuation"
      },
      {
        "start": 57,
        "end": 69,
        "className": "syntax-variable"
      },
      {
        "start": 69,
        "end": 70,
        "className": "syntax-punctuation"
      },
      {
        "start": 73,
        "end": 90,
        "className": "syntax-variable"
      },
      {
        "start": 90,
        "end": 91,
        "className": "syntax-punctuation"
      },
      {
        "start": 94,
        "end": 104,
        "className": "syntax-variable"
      },
      {
        "start": 104,
        "end": 105,
        "className": "syntax-punctuation"
      },
      {
        "start": 108,
        "end": 117,
        "className": "syntax-variable"
      },
      {
        "start": 120,
        "end": 124,
        "className": "syntax-variable"
      },
      {
        "start": 124,
        "end": 125,
        "className": "syntax-punctuation"
      },
      {
        "start": 128,
        "end": 133,
        "className": "syntax-variable"
      },
      {
        "start": 133,
        "end": 134,
        "className": "syntax-punctuation"
      },
      {
        "start": 137,
        "end": 161,
        "className": "syntax-variable"
      },
      {
        "start": 161,
        "end": 162,
        "className": "syntax-punctuation"
      },
      {
        "start": 163,
        "end": 164,
        "className": "syntax-punctuation"
      },
      {
        "start": 167,
        "end": 170,
        "className": "syntax-keyword"
      },
      {
        "start": 173,
        "end": 181,
        "className": "syntax-property"
      },
      {
        "start": 182,
        "end": 183,
        "className": "syntax-punctuation"
      },
      {
        "start": 184,
        "end": 190,
        "className": "syntax-variable"
      },
      {
        "start": 190,
        "end": 191,
        "className": "syntax-punctuation"
      },
      {
        "start": 191,
        "end": 203,
        "className": "syntax-property"
      },
      {
        "start": 203,
        "end": 204,
        "className": "syntax-punctuation"
      },
      {
        "start": 204,
        "end": 221,
        "className": "syntax-property"
      },
      {
        "start": 222,
        "end": 235,
        "className": "syntax-variable"
      },
      {
        "start": 235,
        "end": 236,
        "className": "syntax-punctuation"
      },
      {
        "start": 239,
        "end": 241,
        "className": "syntax-property"
      },
      {
        "start": 242,
        "end": 243,
        "className": "syntax-punctuation"
      },
      {
        "start": 244,
        "end": 347,
        "className": "syntax-string"
      },
      {
        "start": 347,
        "end": 348,
        "className": "syntax-punctuation"
      },
      {
        "start": 349,
        "end": 351,
        "className": "syntax-keyword"
      },
      {
        "start": 352,
        "end": 364,
        "className": "syntax-variable"
      },
      {
        "start": 364,
        "end": 365,
        "className": "syntax-punctuation"
      },
      {
        "start": 365,
        "end": 381,
        "className": "syntax-property"
      },
      {
        "start": 382,
        "end": 383,
        "className": "syntax-punctuation"
      },
      {
        "start": 383,
        "end": 393,
        "className": "syntax-variable"
      },
      {
        "start": 395,
        "end": 396,
        "className": "syntax-punctuation"
      },
      {
        "start": 399,
        "end": 404,
        "className": "syntax-property"
      },
      {
        "start": 405,
        "end": 406,
        "className": "syntax-punctuation"
      },
      {
        "start": 407,
        "end": 416,
        "className": "syntax-string"
      },
      {
        "start": 416,
        "end": 417,
        "className": "syntax-punctuation"
      },
      {
        "start": 420,
        "end": 427,
        "className": "syntax-property"
      },
      {
        "start": 428,
        "end": 429,
        "className": "syntax-punctuation"
      },
      {
        "start": 430,
        "end": 438,
        "className": "syntax-string"
      },
      {
        "start": 438,
        "end": 439,
        "className": "syntax-punctuation"
      },
      {
        "start": 443,
        "end": 460,
        "className": "syntax-property"
      },
      {
        "start": 461,
        "end": 462,
        "className": "syntax-punctuation"
      },
      {
        "start": 463,
        "end": 467,
        "className": "syntax-variable"
      },
      {
        "start": 467,
        "end": 468,
        "className": "syntax-punctuation"
      },
      {
        "start": 472,
        "end": 475,
        "className": "syntax-property"
      },
      {
        "start": 476,
        "end": 477,
        "className": "syntax-punctuation"
      },
      {
        "start": 478,
        "end": 493,
        "className": "syntax-function"
      },
      {
        "start": 494,
        "end": 495,
        "className": "syntax-punctuation"
      },
      {
        "start": 500,
        "end": 505,
        "className": "syntax-property"
      },
      {
        "start": 506,
        "end": 507,
        "className": "syntax-punctuation"
      },
      {
        "start": 508,
        "end": 520,
        "className": "syntax-string"
      },
      {
        "start": 520,
        "end": 521,
        "className": "syntax-punctuation"
      },
      {
        "start": 526,
        "end": 530,
        "className": "syntax-property"
      },
      {
        "start": 531,
        "end": 532,
        "className": "syntax-punctuation"
      },
      {
        "start": 533,
        "end": 542,
        "className": "syntax-string"
      },
      {
        "start": 542,
        "end": 543,
        "className": "syntax-punctuation"
      },
      {
        "start": 548,
        "end": 551,
        "className": "syntax-property"
      },
      {
        "start": 552,
        "end": 553,
        "className": "syntax-punctuation"
      },
      {
        "start": 554,
        "end": 564,
        "className": "syntax-variable"
      },
      {
        "start": 564,
        "end": 565,
        "className": "syntax-punctuation"
      },
      {
        "start": 565,
        "end": 572,
        "className": "syntax-property"
      },
      {
        "start": 572,
        "end": 573,
        "className": "syntax-punctuation"
      },
      {
        "start": 578,
        "end": 582,
        "className": "syntax-property"
      },
      {
        "start": 583,
        "end": 584,
        "className": "syntax-punctuation"
      },
      {
        "start": 585,
        "end": 638,
        "className": "syntax-string"
      },
      {
        "start": 638,
        "end": 639,
        "className": "syntax-punctuation"
      },
      {
        "start": 642,
        "end": 644,
        "className": "syntax-punctuation"
      },
      {
        "start": 648,
        "end": 657,
        "className": "syntax-property"
      },
      {
        "start": 658,
        "end": 659,
        "className": "syntax-punctuation"
      },
      {
        "start": 660,
        "end": 713,
        "className": "syntax-string"
      },
      {
        "start": 713,
        "end": 714,
        "className": "syntax-punctuation"
      },
      {
        "start": 718,
        "end": 735,
        "className": "syntax-property"
      },
      {
        "start": 736,
        "end": 737,
        "className": "syntax-punctuation"
      },
      {
        "start": 738,
        "end": 739,
        "className": "syntax-punctuation"
      },
      {
        "start": 744,
        "end": 761,
        "className": "syntax-variable"
      },
      {
        "start": 766,
        "end": 790,
        "className": "syntax-variable"
      },
      {
        "start": 791,
        "end": 842,
        "className": "syntax-comment"
      },
      {
        "start": 845,
        "end": 846,
        "className": "syntax-punctuation"
      },
      {
        "start": 849,
        "end": 851,
        "className": "syntax-operator"
      },
      {
        "start": 852,
        "end": 855,
        "className": "syntax-variable"
      },
      {
        "start": 855,
        "end": 856,
        "className": "syntax-punctuation"
      },
      {
        "start": 856,
        "end": 864,
        "className": "syntax-property"
      },
      {
        "start": 865,
        "end": 874,
        "className": "syntax-variable"
      },
      {
        "start": 875,
        "end": 885,
        "className": "syntax-variable"
      },
      {
        "start": 885,
        "end": 886,
        "className": "syntax-punctuation"
      },
      {
        "start": 889,
        "end": 900,
        "className": "syntax-property"
      },
      {
        "start": 901,
        "end": 902,
        "className": "syntax-punctuation"
      },
      {
        "start": 903,
        "end": 906,
        "className": "syntax-variable"
      },
      {
        "start": 906,
        "end": 907,
        "className": "syntax-punctuation"
      },
      {
        "start": 907,
        "end": 915,
        "className": "syntax-property"
      },
      {
        "start": 916,
        "end": 925,
        "className": "syntax-variable"
      },
      {
        "start": 926,
        "end": 931,
        "className": "syntax-variable"
      },
      {
        "start": 931,
        "end": 932,
        "className": "syntax-punctuation"
      },
      {
        "start": 936,
        "end": 949,
        "className": "syntax-property"
      },
      {
        "start": 950,
        "end": 951,
        "className": "syntax-punctuation"
      },
      {
        "start": 952,
        "end": 955,
        "className": "syntax-variable"
      },
      {
        "start": 955,
        "end": 956,
        "className": "syntax-punctuation"
      },
      {
        "start": 956,
        "end": 964,
        "className": "syntax-property"
      },
      {
        "start": 965,
        "end": 974,
        "className": "syntax-variable"
      },
      {
        "start": 975,
        "end": 982,
        "className": "syntax-string"
      },
      {
        "start": 982,
        "end": 983,
        "className": "syntax-punctuation"
      },
      {
        "start": 987,
        "end": 996,
        "className": "syntax-property"
      },
      {
        "start": 997,
        "end": 998,
        "className": "syntax-punctuation"
      },
      {
        "start": 999,
        "end": 1002,
        "className": "syntax-variable"
      },
      {
        "start": 1002,
        "end": 1003,
        "className": "syntax-punctuation"
      },
      {
        "start": 1003,
        "end": 1017,
        "className": "syntax-property"
      },
      {
        "start": 1018,
        "end": 1026,
        "className": "syntax-variable"
      },
      {
        "start": 1027,
        "end": 1029,
        "className": "syntax-string"
      },
      {
        "start": 1030,
        "end": 1061,
        "className": "syntax-string"
      },
      {
        "start": 1062,
        "end": 1085,
        "className": "syntax-string"
      },
      {
        "start": 1087,
        "end": 1124,
        "className": "syntax-string"
      },
      {
        "start": 1125,
        "end": 1173,
        "className": "syntax-string"
      },
      {
        "start": 1174,
        "end": 1222,
        "className": "syntax-string"
      },
      {
        "start": 1223,
        "end": 1267,
        "className": "syntax-string"
      },
      {
        "start": 1268,
        "end": 1272,
        "className": "syntax-string"
      },
      {
        "start": 1272,
        "end": 1273,
        "className": "syntax-punctuation"
      },
      {
        "start": 1277,
        "end": 1291,
        "className": "syntax-property"
      },
      {
        "start": 1292,
        "end": 1293,
        "className": "syntax-punctuation"
      },
      {
        "start": 1294,
        "end": 1298,
        "className": "syntax-variable"
      },
      {
        "start": 1298,
        "end": 1299,
        "className": "syntax-punctuation"
      },
      {
        "start": 1302,
        "end": 1319,
        "className": "syntax-property"
      },
      {
        "start": 1320,
        "end": 1321,
        "className": "syntax-punctuation"
      },
      {
        "start": 1322,
        "end": 1324,
        "className": "syntax-string"
      },
      {
        "start": 1325,
        "end": 1345,
        "className": "syntax-string"
      },
      {
        "start": 1346,
        "end": 1380,
        "className": "syntax-string"
      },
      {
        "start": 1381,
        "end": 1407,
        "className": "syntax-string"
      },
      {
        "start": 1408,
        "end": 1433,
        "className": "syntax-string"
      },
      {
        "start": 1434,
        "end": 1438,
        "className": "syntax-string"
      },
      {
        "start": 1441,
        "end": 1442,
        "className": "syntax-operator"
      },
      {
        "start": 1443,
        "end": 1446,
        "className": "syntax-variable"
      },
      {
        "start": 1446,
        "end": 1447,
        "className": "syntax-punctuation"
      },
      {
        "start": 1447,
        "end": 1461,
        "className": "syntax-property"
      },
      {
        "start": 1462,
        "end": 1471,
        "className": "syntax-variable"
      },
      {
        "start": 1472,
        "end": 1474,
        "className": "syntax-string"
      },
      {
        "start": 1475,
        "end": 1523,
        "className": "syntax-string"
      },
      {
        "start": 1524,
        "end": 1528,
        "className": "syntax-string"
      },
      {
        "start": 1528,
        "end": 1529,
        "className": "syntax-punctuation"
      },
      {
        "start": 1533,
        "end": 1537,
        "className": "syntax-property"
      },
      {
        "start": 1538,
        "end": 1539,
        "className": "syntax-punctuation"
      },
      {
        "start": 1540,
        "end": 1541,
        "className": "syntax-punctuation"
      },
      {
        "start": 1546,
        "end": 1557,
        "className": "syntax-property"
      },
      {
        "start": 1558,
        "end": 1559,
        "className": "syntax-punctuation"
      },
      {
        "start": 1560,
        "end": 1647,
        "className": "syntax-string"
      },
      {
        "start": 1647,
        "end": 1648,
        "className": "syntax-punctuation"
      },
      {
        "start": 1653,
        "end": 1661,
        "className": "syntax-property"
      },
      {
        "start": 1662,
        "end": 1663,
        "className": "syntax-punctuation"
      },
      {
        "start": 1664,
        "end": 1703,
        "className": "syntax-string"
      },
      {
        "start": 1703,
        "end": 1704,
        "className": "syntax-punctuation"
      },
      {
        "start": 1709,
        "end": 1718,
        "className": "syntax-property"
      },
      {
        "start": 1719,
        "end": 1720,
        "className": "syntax-punctuation"
      },
      {
        "start": 1721,
        "end": 1795,
        "className": "syntax-string"
      },
      {
        "start": 1795,
        "end": 1796,
        "className": "syntax-punctuation"
      },
      {
        "start": 1801,
        "end": 1808,
        "className": "syntax-property"
      },
      {
        "start": 1809,
        "end": 1810,
        "className": "syntax-punctuation"
      },
      {
        "start": 1811,
        "end": 1815,
        "className": "syntax-keyword"
      },
      {
        "start": 1816,
        "end": 1819,
        "className": "syntax-variable"
      },
      {
        "start": 1819,
        "end": 1820,
        "className": "syntax-punctuation"
      },
      {
        "start": 1820,
        "end": 1828,
        "className": "syntax-property"
      },
      {
        "start": 1828,
        "end": 1829,
        "className": "syntax-punctuation"
      },
      {
        "start": 1830,
        "end": 1831,
        "className": "syntax-punctuation"
      },
      {
        "start": 1838,
        "end": 1847,
        "className": "syntax-variable"
      },
      {
        "start": 1848,
        "end": 1852,
        "className": "syntax-comment"
      },
      {
        "start": 1859,
        "end": 1862,
        "className": "syntax-variable"
      },
      {
        "start": 1867,
        "end": 1869,
        "className": "syntax-punctuation"
      },
      {
        "start": 1874,
        "end": 1885,
        "className": "syntax-property"
      },
      {
        "start": 1886,
        "end": 1887,
        "className": "syntax-punctuation"
      },
      {
        "start": 1888,
        "end": 1892,
        "className": "syntax-keyword"
      },
      {
        "start": 1893,
        "end": 1896,
        "className": "syntax-variable"
      },
      {
        "start": 1896,
        "end": 1897,
        "className": "syntax-punctuation"
      },
      {
        "start": 1897,
        "end": 1908,
        "className": "syntax-property"
      },
      {
        "start": 1908,
        "end": 1909,
        "className": "syntax-punctuation"
      },
      {
        "start": 1910,
        "end": 1911,
        "className": "syntax-punctuation"
      },
      {
        "start": 1918,
        "end": 1924,
        "className": "syntax-variable"
      },
      {
        "start": 1931,
        "end": 1935,
        "className": "syntax-variable"
      },
      {
        "start": 1942,
        "end": 1947,
        "className": "syntax-variable"
      },
      {
        "start": 1952,
        "end": 1954,
        "className": "syntax-punctuation"
      },
      {
        "start": 1959,
        "end": 1970,
        "className": "syntax-property"
      },
      {
        "start": 1971,
        "end": 1972,
        "className": "syntax-punctuation"
      },
      {
        "start": 1973,
        "end": 1977,
        "className": "syntax-string"
      },
      {
        "start": 1977,
        "end": 1978,
        "className": "syntax-punctuation"
      },
      {
        "start": 1983,
        "end": 1992,
        "className": "syntax-property"
      },
      {
        "start": 1993,
        "end": 1994,
        "className": "syntax-punctuation"
      },
      {
        "start": 1995,
        "end": 1998,
        "className": "syntax-variable"
      },
      {
        "start": 1998,
        "end": 1999,
        "className": "syntax-punctuation"
      },
      {
        "start": 1999,
        "end": 2008,
        "className": "syntax-property"
      },
      {
        "start": 2008,
        "end": 2009,
        "className": "syntax-punctuation"
      },
      {
        "start": 2009,
        "end": 2012,
        "className": "syntax-property"
      },
      {
        "start": 2012,
        "end": 2013,
        "className": "syntax-punctuation"
      },
      {
        "start": 2016,
        "end": 2018,
        "className": "syntax-punctuation"
      },
      {
        "start": 2019,
        "end": 2021,
        "className": "syntax-punctuation"
      }
    ]
  },
  {
    "language": "python",
    "name": "python/cpython_asyncio_tasks.py",
    "code": "    def _done_callback(fut):\n        nonlocal nfinished\n        nfinished += 1\n\n        if outer is None or outer.done():\n            if not fut.cancelled():\n                # Mark exception retrieved.\n                fut.exception()\n            return\n\n        if not return_exceptions:\n            if fut.cancelled():\n                # Check if 'fut' is cancelled first, as\n                # 'fut.exception()' will *raise* a CancelledError\n                # instead of returning it.\n                exc = fut._make_cancelled_error()\n                outer.set_exception(exc)\n                return\n            else:\n                exc = fut.exception()\n                if exc is not None:\n                    outer.set_exception(exc)\n                    return\n\n        if nfinished == nfuts:\n            # All futures are done; create a list of results\n            # and set it to the 'outer' future.\n            results = []\n\n            for fut in children:\n                if fut.cancelled():\n                    # Check if 'fut' is cancelled first, as 'fut.exception()'\n                    # will *raise* a CancelledError instead of returning it.\n                    # Also, since we're adding the exception return value\n                    # to 'results' instead of raising it, don't bother\n                    # setting __context__.  This also lets us preserve\n                    # calling '_make_cancelled_error()' at most once.\n                    res = exceptions.CancelledError(\n                        '' if fut._cancel_message is None else\n                        fut._cancel_message)\n                else:\n                    res = fut.exception()\n                    if res is None:\n                        res = fut.result()\n                results.append(res)\n\n            if outer._cancel_requested:\n                # If gather is being cancelled we must propagate the\n                # cancellation regardless of *return_exceptions* argument.\n                # See issue 32684.\n                exc = fut._make_cancelled_error()\n                outer.set_exception(exc)\n            else:\n                outer.set_result(results)\n\n    arg_to_fut = {}\n    children = []\n    nfuts = 0\n    nfinished = 0\n    done_futs = []\n    loop = None\n    outer = None  # bpo-46672\n    for arg in coros_or_futures:\n        if arg not in arg_to_fut:\n            fut = ensure_future(arg, loop=loop)\n            if loop is None:\n                loop = futures._get_loop(fut)\n            if fut is not arg:\n                # 'arg' was not a Future, therefore, 'fut' is a new\n                # Future created specifically for 'arg'.  Since the caller\n                # can't control it, disable the \"destroy pending task\"\n                # warning.\n                fut._log_destroy_pending = False\n\n            nfuts += 1\n            arg_to_fut[arg] = fut\n            if fut.done():\n                done_futs.append(fut)\n            else:\n                fut.add_done_callback(_done_callback)\n\n        else:\n            # There's a duplicate Future object in coros_or_futures.\n            fut = arg_to_fut[arg]\n\n        children.append(fut)\n\n    outer = _GatheringFuture(children, loop=loop)\n    # Run done callbacks after GatheringFuture created so any post-processing\n    # can be performed at this point\n    # optimization: in the special case that *all* futures finished eagerly,\n    # this will effectively complete the gather eagerly, with the last\n    # callback setting the result (or exception) on outer before returning it\n    for fut in done_futs:\n        _done_callback(fut)\n    return outer",
    "spans": [
      {
        "start": 4,
        "end": 7,
        "className": "syntax-keyword"
      },
      {
        "start": 8,
        "end": 22,
        "className": "syntax-function"
      },
      {
        "start": 23,
        "end": 26,
        "className": "syntax-variable"
      },
      {
        "start": 37,
        "end": 45,
        "className": "syntax-keyword"
      },
      {
        "start": 46,
        "end": 55,
        "className": "syntax-variable"
      },
      {
        "start": 64,
        "end": 73,
        "className": "syntax-variable"
      },
      {
        "start": 74,
        "end": 76,
        "className": "syntax-operator"
      },
      {
        "start": 77,
        "end": 78,
        "className": "syntax-number"
      },
      {
        "start": 88,
        "end": 90,
        "className": "syntax-keyword"
      },
      {
        "start": 91,
        "end": 96,
        "className": "syntax-variable"
      },
      {
        "start": 97,
        "end": 99,
        "className": "syntax-operator"
      },
      {
        "start": 100,
        "end": 104,
        "className": "syntax-constant"
      },
      {
        "start": 105,
        "end": 107,
        "className": "syntax-operator"
      },
      {
        "start": 108,
        "end": 113,
        "className": "syntax-variable"
      },
      {
        "start": 114,
        "end": 118,
        "className": "syntax-property"
      },
      {
        "start": 134,
        "end": 136,
        "className": "syntax-keyword"
      },
      {
        "start": 137,
        "end": 140,
        "className": "syntax-operator"
      },
      {
        "start": 141,
        "end": 144,
        "className": "syntax-variable"
      },
      {
        "start": 145,
        "end": 154,
        "className": "syntax-property"
      },
      {
        "start": 174,
        "end": 201,
        "className": "syntax-comment"
      },
      {
        "start": 218,
        "end": 221,
        "className": "syntax-variable"
      },
      {
        "start": 222,
        "end": 231,
        "className": "syntax-property"
      },
      {
        "start": 246,
        "end": 252,
        "className": "syntax-keyword"
      },
      {
        "start": 262,
        "end": 264,
        "className": "syntax-keyword"
      },
      {
        "start": 265,
        "end": 268,
        "className": "syntax-operator"
      },
      {
        "start": 269,
        "end": 286,
        "className": "syntax-variable"
      },
      {
        "start": 300,
        "end": 302,
        "className": "syntax-keyword"
      },
      {
        "start": 303,
        "end": 306,
        "className": "syntax-variable"
      },
      {
        "start": 307,
        "end": 316,
        "className": "syntax-property"
      },
      {
        "start": 336,
        "end": 375,
        "className": "syntax-comment"
      },
      {
        "start": 392,
        "end": 441,
        "className": "syntax-comment"
      },
      {
        "start": 458,
        "end": 484,
        "className": "syntax-comment"
      },
      {
        "start": 501,
        "end": 504,
        "className": "syntax-variable"
      },
      {
        "start": 505,
        "end": 506,
        "className": "syntax-operator"
      },
      {
        "start": 507,
        "end": 510,
        "className": "syntax-variable"
      },
      {
        "start": 511,
        "end": 532,
        "className": "syntax-property"
      },
      {
        "start": 551,
        "end": 556,
        "className": "syntax-variable"
      },
      {
        "start": 557,
        "end": 570,
        "className": "syntax-property"
      },
      {
        "start": 571,
        "end": 574,
        "className": "syntax-variable"
      },
      {
        "start": 592,
        "end": 598,
        "className": "syntax-keyword"
      },
      {
        "start": 611,
        "end": 615,
        "className": "syntax-keyword"
      },
      {
        "start": 633,
        "end": 636,
        "className": "syntax-variable"
      },
      {
        "start": 637,
        "end": 638,
        "className": "syntax-operator"
      },
      {
        "start": 639,
        "end": 642,
        "className": "syntax-variable"
      },
      {
        "start": 643,
        "end": 652,
        "className": "syntax-property"
      },
      {
        "start": 671,
        "end": 673,
        "className": "syntax-keyword"
      },
      {
        "start": 674,
        "end": 677,
        "className": "syntax-variable"
      },
      {
        "start": 678,
        "end": 684,
        "className": "syntax-operator"
      },
      {
        "start": 685,
        "end": 689,
        "className": "syntax-constant"
      },
      {
        "start": 711,
        "end": 716,
        "className": "syntax-variable"
      },
      {
        "start": 717,
        "end": 730,
        "className": "syntax-property"
      },
      {
        "start": 731,
        "end": 734,
        "className": "syntax-variable"
      },
      {
        "start": 756,
        "end": 762,
        "className": "syntax-keyword"
      },
      {
        "start": 772,
        "end": 774,
        "className": "syntax-keyword"
      },
      {
        "start": 775,
        "end": 784,
        "className": "syntax-variable"
      },
      {
        "start": 785,
        "end": 787,
        "className": "syntax-operator"
      },
      {
        "start": 788,
        "end": 793,
        "className": "syntax-variable"
      },
      {
        "start": 807,
        "end": 855,
        "className": "syntax-comment"
      },
      {
        "start": 868,
        "end": 903,
        "className": "syntax-comment"
      },
      {
        "start": 916,
        "end": 923,
        "className": "syntax-variable"
      },
      {
        "start": 924,
        "end": 925,
        "className": "syntax-operator"
      },
      {
        "start": 942,
        "end": 945,
        "className": "syntax-keyword"
      },
      {
        "start": 946,
        "end": 949,
        "className": "syntax-variable"
      },
      {
        "start": 950,
        "end": 952,
        "className": "syntax-operator"
      },
      {
        "start": 953,
        "end": 961,
        "className": "syntax-variable"
      },
      {
        "start": 979,
        "end": 981,
        "className": "syntax-keyword"
      },
      {
        "start": 982,
        "end": 985,
        "className": "syntax-variable"
      },
      {
        "start": 986,
        "end": 995,
        "className": "syntax-property"
      },
      {
        "start": 1019,
        "end": 1076,
        "className": "syntax-comment"
      },
      {
        "start": 1097,
        "end": 1153,
        "className": "syntax-comment"
      },
      {
        "start": 1174,
        "end": 1227,
        "className": "syntax-comment"
      },
      {
        "start": 1248,
        "end": 1298,
        "className": "syntax-comment"
      },
      {
        "start": 1319,
        "end": 1369,
        "className": "syntax-comment"
      },
      {
        "start": 1390,
        "end": 1439,
        "className": "syntax-comment"
      },
      {
        "start": 1460,
        "end": 1463,
        "className": "syntax-variable"
      },
      {
        "start": 1464,
        "end": 1465,
        "className": "syntax-operator"
      },
      {
        "start": 1466,
        "end": 1476,
        "className": "syntax-variable"
      },
      {
        "start": 1477,
        "end": 1491,
        "className": "syntax-property"
      },
      {
        "start": 1517,
        "end": 1519,
        "className": "syntax-string"
      },
      {
        "start": 1520,
        "end": 1522,
        "className": "syntax-keyword"
      },
      {
        "start": 1523,
        "end": 1526,
        "className": "syntax-variable"
      },
      {
        "start": 1527,
        "end": 1542,
        "className": "syntax-property"
      },
      {
        "start": 1543,
        "end": 1545,
        "className": "syntax-operator"
      },
      {
        "start": 1546,
        "end": 1550,
        "className": "syntax-constant"
      },
      {
        "start": 1551,
        "end": 1555,
        "className": "syntax-keyword"
      },
      {
        "start": 1580,
        "end": 1583,
        "className": "syntax-variable"
      },
      {
        "start": 1584,
        "end": 1599,
        "className": "syntax-property"
      },
      {
        "start": 1617,
        "end": 1621,
        "className": "syntax-keyword"
      },
      {
        "start": 1643,
        "end": 1646,
        "className": "syntax-variable"
      },
      {
        "start": 1647,
        "end": 1648,
        "className": "syntax-operator"
      },
      {
        "start": 1649,
        "end": 1652,
        "className": "syntax-variable"
      },
      {
        "start": 1653,
        "end": 1662,
        "className": "syntax-property"
      },
      {
        "start": 1685,
        "end": 1687,
        "className": "syntax-keyword"
      },
      {
        "start": 1688,
        "end": 1691,
        "className": "syntax-variable"
      },
      {
        "start": 1692,
        "end": 1694,
        "className": "syntax-operator"
      },
      {
        "start": 1695,
        "end": 1699,
        "className": "syntax-constant"
      },
      {
        "start": 1725,
        "end": 1728,
        "className": "syntax-variable"
      },
      {
        "start": 1729,
        "end": 1730,
        "className": "syntax-operator"
      },
      {
        "start": 1731,
        "end": 1734,
        "className": "syntax-variable"
      },
      {
        "start": 1735,
        "end": 1741,
        "className": "syntax-property"
      },
      {
        "start": 1760,
        "end": 1767,
        "className": "syntax-variable"
      },
      {
        "start": 1768,
        "end": 1774,
        "className": "syntax-property"
      },
      {
        "start": 1775,
        "end": 1778,
        "className": "syntax-variable"
      },
      {
        "start": 1793,
        "end": 1795,
        "className": "syntax-keyword"
      },
      {
        "start": 1796,
        "end": 1801,
        "className": "syntax-variable"
      },
      {
        "start": 1802,
        "end": 1819,
        "className": "syntax-property"
      },
      {
        "start": 1837,
        "end": 1889,
        "className": "syntax-comment"
      },
      {
        "start": 1906,
        "end": 1964,
        "className": "syntax-comment"
      },
      {
        "start": 1981,
        "end": 1999,
        "className": "syntax-comment"
      },
      {
        "start": 2016,
        "end": 2019,
        "className": "syntax-variable"
      },
      {
        "start": 2020,
        "end": 2021,
        "className": "syntax-operator"
      },
      {
        "start": 2022,
        "end": 2025,
        "className": "syntax-variable"
      },
      {
        "start": 2026,
        "end": 2047,
        "className": "syntax-property"
      },
      {
        "start": 2066,
        "end": 2071,
        "className": "syntax-variable"
      },
      {
        "start": 2072,
        "end": 2085,
        "className": "syntax-property"
      },
      {
        "start": 2086,
        "end": 2089,
        "className": "syntax-variable"
      },
      {
        "start": 2103,
        "end": 2107,
        "className": "syntax-keyword"
      },
      {
        "start": 2125,
        "end": 2130,
        "className": "syntax-variable"
      },
      {
        "start": 2131,
        "end": 2141,
        "className": "syntax-property"
      },
      {
        "start": 2142,
        "end": 2149,
        "className": "syntax-variable"
      },
      {
        "start": 2156,
        "end": 2166,
        "className": "syntax-variable"
      },
      {
        "start": 2167,
        "end": 2168,
        "className": "syntax-operator"
      },
      {
        "start": 2176,
        "end": 2184,
        "className": "syntax-variable"
      },
      {
        "start": 2185,
        "end": 2186,
        "className": "syntax-operator"
      },
      {
        "start": 2194,
        "end": 2199,
        "className": "syntax-variable"
      },
      {
        "start": 2200,
        "end": 2201,
        "className": "syntax-operator"
      },
      {
        "start": 2202,
        "end": 2203,
        "className": "syntax-number"
      },
      {
        "start": 2208,
        "end": 2217,
        "className": "syntax-variable"
      },
      {
        "start": 2218,
        "end": 2219,
        "className": "syntax-operator"
      },
      {
        "start": 2220,
        "end": 2221,
        "className": "syntax-number"
      },
      {
        "start": 2226,
        "end": 2235,
        "className": "syntax-variable"
      },
      {
        "start": 2236,
        "end": 2237,
        "className": "syntax-operator"
      },
      {
        "start": 2245,
        "end": 2249,
        "className": "syntax-variable"
      },
      {
        "start": 2250,
        "end": 2251,
        "className": "syntax-operator"
      },
      {
        "start": 2252,
        "end": 2256,
        "className": "syntax-constant"
      },
      {
        "start": 2261,
        "end": 2266,
        "className": "syntax-variable"
      },
      {
        "start": 2267,
        "end": 2268,
        "className": "syntax-operator"
      },
      {
        "start": 2269,
        "end": 2273,
        "className": "syntax-constant"
      },
      {
        "start": 2275,
        "end": 2286,
        "className": "syntax-comment"
      },
      {
        "start": 2291,
        "end": 2294,
        "className": "syntax-keyword"
      },
      {
        "start": 2295,
        "end": 2298,
        "className": "syntax-variable"
      },
      {
        "start": 2299,
        "end": 2301,
        "className": "syntax-operator"
      },
      {
        "start": 2302,
        "end": 2318,
        "className": "syntax-variable"
      },
      {
        "start": 2328,
        "end": 2330,
        "className": "syntax-keyword"
      },
      {
        "start": 2331,
        "end": 2334,
        "className": "syntax-variable"
      },
      {
        "start": 2335,
        "end": 2341,
        "className": "syntax-operator"
      },
      {
        "start": 2342,
        "end": 2352,
        "className": "syntax-variable"
      },
      {
        "start": 2366,
        "end": 2369,
        "className": "syntax-variable"
      },
      {
        "start": 2370,
        "end": 2371,
        "className": "syntax-operator"
      },
      {
        "start": 2372,
        "end": 2385,
        "className": "syntax-function"
      },
      {
        "start": 2386,
        "end": 2389,
        "className": "syntax-variable"
      },
      {
        "start": 2391,
        "end": 2395,
        "className": "syntax-variable"
      },
      {
        "start": 2395,
        "end": 2396,
        "className": "syntax-operator"
      },
      {
        "start": 2396,
        "end": 2400,
        "className": "syntax-variable"
      },
      {
        "start": 2414,
        "end": 2416,
        "className": "syntax-keyword"
      },
      {
        "start": 2417,
        "end": 2421,
        "className": "syntax-variable"
      },
      {
        "start": 2422,
        "end": 2424,
        "className": "syntax-operator"
      },
      {
        "start": 2425,
        "end": 2429,
        "className": "syntax-constant"
      },
      {
        "start": 2447,
        "end": 2451,
        "className": "syntax-variable"
      },
      {
        "start": 2452,
        "end": 2453,
        "className": "syntax-operator"
      },
      {
        "start": 2454,
        "end": 2461,
        "className": "syntax-variable"
      },
      {
        "start": 2462,
        "end": 2471,
        "className": "syntax-property"
      },
      {
        "start": 2472,
        "end": 2475,
        "className": "syntax-variable"
      },
      {
        "start": 2489,
        "end": 2491,
        "className": "syntax-keyword"
      },
      {
        "start": 2492,
        "end": 2495,
        "className": "syntax-variable"
      },
      {
        "start": 2496,
        "end": 2502,
        "className": "syntax-operator"
      },
      {
        "start": 2503,
        "end": 2506,
        "className": "syntax-variable"
      },
      {
        "start": 2524,
        "end": 2575,
        "className": "syntax-comment"
      },
      {
        "start": 2592,
        "end": 2650,
        "className": "syntax-comment"
      },
      {
        "start": 2667,
        "end": 2721,
        "className": "syntax-comment"
      },
      {
        "start": 2738,
        "end": 2748,
        "className": "syntax-comment"
      },
      {
        "start": 2765,
        "end": 2768,
        "className": "syntax-variable"
      },
      {
        "start": 2769,
        "end": 2789,
        "className": "syntax-property"
      },
      {
        "start": 2790,
        "end": 2791,
        "className": "syntax-operator"
      },
      {
        "start": 2792,
        "end": 2797,
        "className": "syntax-constant"
      },
      {
        "start": 2811,
        "end": 2816,
        "className": "syntax-variable"
      },
      {
        "start": 2817,
        "end": 2819,
        "className": "syntax-operator"
      },
      {
        "start": 2820,
        "end": 2821,
        "className": "syntax-number"
      },
      {
        "start": 2834,
        "end": 2844,
        "className": "syntax-variable"
      },
      {
        "start": 2845,
        "end": 2848,
        "className": "syntax-variable"
      },
      {
        "start": 2850,
        "end": 2851,
        "className": "syntax-operator"
      },
      {
        "start": 2852,
        "end": 2855,
        "className": "syntax-variable"
      },
      {
        "start": 2868,
        "end": 2870,
        "className": "syntax-keyword"
      },
      {
        "start": 2871,
        "end": 2874,
        "className": "syntax-variable"
      },
      {
        "start": 2875,
        "end": 2879,
        "className": "syntax-property"
      },
      {
        "start": 2899,
        "end": 2908,
        "className": "syntax-variable"
      },
      {
        "start": 2909,
        "end": 2915,
        "className": "syntax-property"
      },
      {
        "start": 2916,
        "end": 2919,
        "className": "syntax-variable"
      },
      {
        "start": 2933,
        "end": 2937,
        "className": "syntax-keyword"
      },
      {
        "start": 2955,
        "end": 2958,
        "className": "syntax-variable"
      },
      {
        "start": 2959,
        "end": 2976,
        "className": "syntax-property"
      },
      {
        "start": 2977,
        "end": 2991,
        "className": "syntax-variable"
      },
      {
        "start": 3002,
        "end": 3006,
        "className": "syntax-keyword"
      },
      {
        "start": 3020,
        "end": 3076,
        "className": "syntax-comment"
      },
      {
        "start": 3089,
        "end": 3092,
        "className": "syntax-variable"
      },
      {
        "start": 3093,
        "end": 3094,
        "className": "syntax-operator"
      },
      {
        "start": 3095,
        "end": 3105,
        "className": "syntax-variable"
      },
      {
        "start": 3106,
        "end": 3109,
        "className": "syntax-variable"
      },
      {
        "start": 3120,
        "end": 3128,
        "className": "syntax-variable"
      },
      {
        "start": 3129,
        "end": 3135,
        "className": "syntax-property"
      },
      {
        "start": 3136,
        "end": 3139,
        "className": "syntax-variable"
      },
      {
        "start": 3146,
        "end": 3151,
        "className": "syntax-variable"
      },
      {
        "start": 3152,
        "end": 3153,
        "className": "syntax-operator"
      },
      {
        "start": 3154,
        "end": 3170,
        "className": "syntax-function"
      },
      {
        "start": 3171,
        "end": 3179,
        "className": "syntax-variable"
      },
      {
        "start": 3181,
        "end": 3185,
        "className": "syntax-variable"
      },
      {
        "start": 3185,
        "end": 3186,
        "className": "syntax-operator"
      },
      {
        "start": 3186,
        "end": 3190,
        "className": "syntax-variable"
      },
      {
        "start": 3196,
        "end": 3269,
        "className": "syntax-comment"
      },
      {
        "start": 3274,
        "end": 3306,
        "className": "syntax-comment"
      },
      {
        "start": 3311,
        "end": 3383,
        "className": "syntax-comment"
      },
      {
        "start": 3388,
        "end": 3454,
        "className": "syntax-comment"
      },
      {
        "start": 3459,
        "end": 3532,
        "className": "syntax-comment"
      },
      {
        "start": 3537,
        "end": 3540,
        "className": "syntax-keyword"
      },
      {
        "start": 3541,
        "end": 3544,
        "className": "syntax-variable"
      },
      {
        "start": 3545,
        "end": 3547,
        "className": "syntax-operator"
      },
      {
        "start": 3548,
        "end": 3557,
        "className": "syntax-variable"
      },
      {
        "start": 3567,
        "end": 3581,
        "className": "syntax-function"
      },
      {
        "start": 3582,
        "end": 3585,
        "className": "syntax-variable"
      },
      {
        "start": 3591,
        "end": 3597,
        "className": "syntax-keyword"
      },
      {
        "start": 3598,
        "end": 3603,
        "className": "syntax-variable"
      }
    ]
  },
  {
    "language": "python",
    "name": "python/neovim_shadacat.py",
    "code": "def strtrans_errors(e):\n    if not isinstance(e, UnicodeDecodeError):\n        raise NotImplementedError('don\u2019t know how to handle {0} error'.format(\n            e.__class__.__name__))\n    return '<{0:x}>'.format(reduce((lambda a, b: a*0x100+b),\n                                   list(e.object[e.start:e.end]))), e.end\n\n\ncodecs.register_error('strtrans', strtrans_errors)\n\n\ndef idfunc(o):\n    return o\n\n\nclass CharInt(int):\n    def __repr__(self):\n        return super(CharInt, self).__repr__() + ' (\\'%s\\')' % chr(self)\n\n\nctable = {\n    bytes: lambda s: s.decode('utf-8', 'strtrans'),\n    dict: lambda d: dict((mnormalize(k), mnormalize(v)) for k, v in d.items()),\n    list: lambda l: list(mnormalize(i) for i in l),\n    int: lambda n: CharInt(n) if 0x20 <= n <= 0x7E else n,\n}\n\n\ndef mnormalize(o):\n    return ctable.get(type(o), idfunc)(o)\n\n\nfname = sys.argv[1]\ntry:\n    filt = sys.argv[2]\nexcept IndexError:\n    def filt(entry): return True\nelse:\n    _filt = filt\n    def filt(entry): return eval(_filt, globals(), {'entry': entry})  # noqa\n\nposwidth = len(str(os.stat(fname).st_size or 1000))\n\n\nclass FullEntry(dict):\n    def __init__(self, val):\n        self.__dict__.update(val)\n\n\nwith open(fname, 'rb') as fp:\n    unpacker = msgpack.Unpacker(file_like=fp, read_size=1)\n    max_type = max(typ.value for typ in EntryTypes)\n    while True:\n        try:\n            pos = fp.tell()\n            typ = unpacker.unpack()\n        except msgpack.OutOfData:\n            break\n        else:\n            timestamp = unpacker.unpack()\n            time = datetime.fromtimestamp(timestamp)\n            length = unpacker.unpack()\n            if typ > max_type:\n                entry = fp.read(length)\n                typ = EntryTypes.Unknown\n            else:\n                entry = unpacker.unpack()\n                typ = EntryTypes(typ)\n            full_entry = FullEntry({\n                'value': entry,\n                'timestamp': timestamp,\n                'time': time,\n                'length': length,\n                'pos': pos,\n                'type': typ,\n            })\n            if not filt(full_entry):\n                continue\n            print('%*u %13s %s %5u %r' % (\n                poswidth, pos, typ.name, time.isoformat(), length, mnormalize(entry)))",
    "spans": [
      {
        "start": 0,
        "end": 3,
        "className": "syntax-keyword"
      },
      {
        "start": 4,
        "end": 19,
        "className": "syntax-function"
      },
      {
        "start": 20,
        "end": 21,
        "className": "syntax-variable"
      },
      {
        "start": 28,
        "end": 30,
        "className": "syntax-keyword"
      },
      {
        "start": 31,
        "end": 34,
        "className": "syntax-operator"
      },
      {
        "start": 35,
        "end": 45,
        "className": "syntax-function"
      },
      {
        "start": 46,
        "end": 47,
        "className": "syntax-variable"
      },
      {
        "start": 49,
        "end": 67,
        "className": "syntax-type"
      },
      {
        "start": 78,
        "end": 83,
        "className": "syntax-keyword"
      },
      {
        "start": 84,
        "end": 103,
        "className": "syntax-function"
      },
      {
        "start": 104,
        "end": 140,
        "className": "syntax-string"
      },
      {
        "start": 141,
        "end": 147,
        "className": "syntax-property"
      },
      {
        "start": 161,
        "end": 162,
        "className": "syntax-variable"
      },
      {
        "start": 163,
        "end": 172,
        "className": "syntax-property"
      },
      {
        "start": 173,
        "end": 181,
        "className": "syntax-property"
      },
      {
        "start": 188,
        "end": 194,
        "className": "syntax-keyword"
      },
      {
        "start": 195,
        "end": 204,
        "className": "syntax-string"
      },
      {
        "start": 205,
        "end": 211,
        "className": "syntax-property"
      },
      {
        "start": 212,
        "end": 218,
        "className": "syntax-function"
      },
      {
        "start": 220,
        "end": 226,
        "className": "syntax-keyword"
      },
      {
        "start": 227,
        "end": 228,
        "className": "syntax-variable"
      },
      {
        "start": 230,
        "end": 231,
        "className": "syntax-variable"
      },
      {
        "start": 233,
        "end": 234,
        "className": "syntax-variable"
      },
      {
        "start": 234,
        "end": 235,
        "className": "syntax-operator"
      },
      {
        "start": 235,
        "end": 240,
        "className": "syntax-number"
      },
      {
        "start": 240,
        "end": 241,
        "className": "syntax-operator"
      },
      {
        "start": 241,
        "end": 242,
        "className": "syntax-variable"
      },
      {
        "start": 280,
        "end": 284,
        "className": "syntax-function"
      },
      {
        "start": 285,
        "end": 286,
        "className": "syntax-variable"
      },
      {
        "start": 287,
        "end": 293,
        "className": "syntax-property"
      },
      {
        "start": 294,
        "end": 295,
        "className": "syntax-variable"
      },
      {
        "start": 296,
        "end": 301,
        "className": "syntax-property"
      },
      {
        "start": 302,
        "end": 303,
        "className": "syntax-variable"
      },
      {
        "start": 304,
        "end": 307,
        "className": "syntax-property"
      },
      {
        "start": 313,
        "end": 314,
        "className": "syntax-variable"
      },
      {
        "start": 315,
        "end": 318,
        "className": "syntax-property"
      },
      {
        "start": 321,
        "end": 327,
        "className": "syntax-variable"
      },
      {
        "start": 328,
        "end": 342,
        "className": "syntax-property"
      },
      {
        "start": 343,
        "end": 353,
        "className": "syntax-string"
      },
      {
        "start": 355,
        "end": 370,
        "className": "syntax-variable"
      },
      {
        "start": 374,
        "end": 377,
        "className": "syntax-keyword"
      },
      {
        "start": 378,
        "end": 384,
        "className": "syntax-function"
      },
      {
        "start": 385,
        "end": 386,
        "className": "syntax-variable"
      },
      {
        "start": 393,
        "end": 399,
        "className": "syntax-keyword"
      },
      {
        "start": 400,
        "end": 401,
        "className": "syntax-variable"
      },
      {
        "start": 404,
        "end": 409,
        "className": "syntax-keyword"
      },
      {
        "start": 410,
        "end": 417,
        "className": "syntax-type"
      },
      {
        "start": 418,
        "end": 421,
        "className": "syntax-variable"
      },
      {
        "start": 428,
        "end": 431,
        "className": "syntax-keyword"
      },
      {
        "start": 432,
        "end": 440,
        "className": "syntax-function"
      },
      {
        "start": 441,
        "end": 445,
        "className": "syntax-variable"
      },
      {
        "start": 456,
        "end": 462,
        "className": "syntax-keyword"
      },
      {
        "start": 463,
        "end": 468,
        "className": "syntax-function"
      },
      {
        "start": 469,
        "end": 476,
        "className": "syntax-type"
      },
      {
        "start": 478,
        "end": 482,
        "className": "syntax-variable"
      },
      {
        "start": 484,
        "end": 492,
        "className": "syntax-property"
      },
      {
        "start": 495,
        "end": 496,
        "className": "syntax-operator"
      },
      {
        "start": 497,
        "end": 508,
        "className": "syntax-string"
      },
      {
        "start": 509,
        "end": 510,
        "className": "syntax-operator"
      },
      {
        "start": 511,
        "end": 514,
        "className": "syntax-function"
      },
      {
        "start": 515,
        "end": 519,
        "className": "syntax-variable"
      },
      {
        "start": 523,
        "end": 529,
        "className": "syntax-variable"
      },
      {
        "start": 530,
        "end": 531,
        "className": "syntax-operator"
      },
      {
        "start": 538,
        "end": 543,
        "className": "syntax-variable"
      },
      {
        "start": 545,
        "end": 551,
        "className": "syntax-keyword"
      },
      {
        "start": 552,
        "end": 553,
        "className": "syntax-variable"
      },
      {
        "start": 555,
        "end": 556,
        "className": "syntax-variable"
      },
      {
        "start": 557,
        "end": 563,
        "className": "syntax-property"
      },
      {
        "start": 564,
        "end": 571,
        "className": "syntax-string"
      },
      {
        "start": 573,
        "end": 583,
        "className": "syntax-string"
      },
      {
        "start": 590,
        "end": 594,
        "className": "syntax-variable"
      },
      {
        "start": 596,
        "end": 602,
        "className": "syntax-keyword"
      },
      {
        "start": 603,
        "end": 604,
        "className": "syntax-variable"
      },
      {
        "start": 606,
        "end": 610,
        "className": "syntax-function"
      },
      {
        "start": 612,
        "end": 622,
        "className": "syntax-function"
      },
      {
        "start": 623,
        "end": 624,
        "className": "syntax-variable"
      },
      {
        "start": 627,
        "end": 637,
        "className": "syntax-function"
      },
      {
        "start": 638,
        "end": 639,
        "className": "syntax-variable"
      },
      {
        "start": 642,
        "end": 645,
        "className": "syntax-keyword"
      },
      {
        "start": 646,
        "end": 647,
        "className": "syntax-variable"
      },
      {
        "start": 649,
        "end": 650,
        "className": "syntax-variable"
      },
      {
        "start": 651,
        "end": 653,
        "className": "syntax-operator"
      },
      {
        "start": 654,
        "end": 655,
        "className": "syntax-variable"
      },
      {
        "start": 656,
        "end": 661,
        "className": "syntax-property"
      },
      {
        "start": 670,
        "end": 674,
        "className": "syntax-variable"
      },
      {
        "start": 676,
        "end": 682,
        "className": "syntax-keyword"
      },
      {
        "start": 683,
        "end": 684,
        "className": "syntax-variable"
      },
      {
        "start": 686,
        "end": 690,
        "className": "syntax-function"
      },
      {
        "start": 691,
        "end": 701,
        "className": "syntax-function"
      },
      {
        "start": 702,
        "end": 703,
        "className": "syntax-variable"
      },
      {
        "start": 705,
        "end": 708,
        "className": "syntax-keyword"
      },
      {
        "start": 709,
        "end": 710,
        "className": "syntax-variable"
      },
      {
        "start": 711,
        "end": 713,
        "className": "syntax-operator"
      },
      {
        "start": 714,
        "end": 715,
        "className": "syntax-variable"
      },
      {
        "start": 722,
        "end": 725,
        "className": "syntax-variable"
      },
      {
        "start": 727,
        "end": 733,
        "className": "syntax-keyword"
      },
      {
        "start": 734,
        "end": 735,
        "className": "syntax-variable"
      },
      {
        "start": 737,
        "end": 744,
        "className": "syntax-function"
      },
      {
        "start": 745,
        "end": 746,
        "className": "syntax-variable"
      },
      {
        "start": 748,
        "end": 750,
        "className": "syntax-keyword"
      },
      {
        "start": 751,
        "end": 755,
        "className": "syntax-number"
      },
      {
        "start": 756,
        "end": 758,
        "className": "syntax-operator"
      },
      {
        "start": 759,
        "end": 760,
        "className": "syntax-variable"
      },
      {
        "start": 761,
        "end": 763,
        "className": "syntax-operator"
      },
      {
        "start": 764,
        "end": 768,
        "className": "syntax-number"
      },
      {
        "start": 769,
        "end": 773,
        "className": "syntax-keyword"
      },
      {
        "start": 774,
        "end": 775,
        "className": "syntax-variable"
      },
      {
        "start": 781,
        "end": 784,
        "className": "syntax-keyword"
      },
      {
        "start": 785,
        "end": 795,
        "className": "syntax-function"
      },
      {
        "start": 796,
        "end": 797,
        "className": "syntax-variable"
      },
      {
        "start": 804,
        "end": 810,
        "className": "syntax-keyword"
      },
      {
        "start": 811,
        "end": 817,
        "className": "syntax-variable"
      },
      {
        "start": 818,
        "end": 821,
        "className": "syntax-property"
      },
      {
        "start": 822,
        "end": 826,
        "className": "syntax-function"
      },
      {
        "start": 827,
        "end": 828,
        "className": "syntax-variable"
      },
      {
        "start": 831,
        "end": 837,
        "className": "syntax-variable"
      },
      {
        "start": 839,
        "end": 840,
        "className": "syntax-variable"
      },
      {
        "start": 844,
        "end": 849,
        "className": "syntax-variable"
      },
      {
        "start": 850,
        "end": 851,
        "className": "syntax-operator"
      },
      {
        "start": 852,
        "end": 855,
        "className": "syntax-variable"
      },
      {
        "start": 856,
        "end": 860,
        "className": "syntax-property"
      },
      {
        "start": 861,
        "end": 862,
        "className": "syntax-number"
      },
      {
        "start": 864,
        "end": 867,
        "className": "syntax-keyword"
      },
      {
        "start": 873,
        "end": 877,
        "className": "syntax-variable"
      },
      {
        "start": 878,
        "end": 879,
        "className": "syntax-operator"
      },
      {
        "start": 880,
        "end": 883,
        "className": "syntax-variable"
      },
      {
        "start": 884,
        "end": 888,
        "className": "syntax-property"
      },
      {
        "start": 889,
        "end": 890,
        "className": "syntax-number"
      },
      {
        "start": 892,
        "end": 898,
        "className": "syntax-keyword"
      },
      {
        "start": 899,
        "end": 909,
        "className": "syntax-type"
      },
      {
        "start": 915,
        "end": 918,
        "className": "syntax-keyword"
      },
      {
        "start": 919,
        "end": 923,
        "className": "syntax-function"
      },
      {
        "start": 924,
        "end": 929,
        "className": "syntax-variable"
      },
      {
        "start": 932,
        "end": 938,
        "className": "syntax-keyword"
      },
      {
        "start": 939,
        "end": 943,
        "className": "syntax-constant"
      },
      {
        "start": 944,
        "end": 948,
        "className": "syntax-keyword"
      },
      {
        "start": 954,
        "end": 959,
        "className": "syntax-variable"
      },
      {
        "start": 960,
        "end": 961,
        "className": "syntax-operator"
      },
      {
        "start": 962,
        "end": 966,
        "className": "syntax-variable"
      },
      {
        "start": 971,
        "end": 974,
        "className": "syntax-keyword"
      },
      {
        "start": 975,
        "end": 979,
        "className": "syntax-function"
      },
      {
        "start": 980,
        "end": 985,
        "className": "syntax-variable"
      },
      {
        "start": 988,
        "end": 994,
        "className": "syntax-keyword"
      },
      {
        "start": 995,
        "end": 999,
        "className": "syntax-function"
      },
      {
        "start": 1000,
        "end": 1005,
        "className": "syntax-variable"
      },
      {
        "start": 1007,
        "end": 1014,
        "className": "syntax-function"
      },
      {
        "start": 1019,
        "end": 1026,
        "className": "syntax-string"
      },
      {
        "start": 1028,
        "end": 1033,
        "className": "syntax-variable"
      },
      {
        "start": 1037,
        "end": 1043,
        "className": "syntax-comment"
      },
      {
        "start": 1045,
        "end": 1053,
        "className": "syntax-variable"
      },
      {
        "start": 1054,
        "end": 1055,
        "className": "syntax-operator"
      },
      {
        "start": 1056,
        "end": 1059,
        "className": "syntax-function"
      },
      {
        "start": 1060,
        "end": 1063,
        "className": "syntax-function"
      },
      {
        "start": 1064,
        "end": 1066,
        "className": "syntax-variable"
      },
      {
        "start": 1067,
        "end": 1071,
        "className": "syntax-property"
      },
      {
        "start": 1072,
        "end": 1077,
        "className": "syntax-variable"
      },
      {
        "start": 1079,
        "end": 1086,
        "className": "syntax-property"
      },
      {
        "start": 1087,
        "end": 1089,
        "className": "syntax-operator"
      },
      {
        "start": 1090,
        "end": 1094,
        "className": "syntax-number"
      },
      {
        "start": 1099,
        "end": 1104,
        "className": "syntax-keyword"
      },
      {
        "start": 1105,
        "end": 1114,
        "className": "syntax-type"
      },
      {
        "start": 1115,
        "end": 1119,
        "className": "syntax-variable"
      },
      {
        "start": 1126,
        "end": 1129,
        "className": "syntax-keyword"
      },
      {
        "start": 1130,
        "end": 1138,
        "className": "syntax-function"
      },
      {
        "start": 1139,
        "end": 1143,
        "className": "syntax-variable"
      },
      {
        "start": 1145,
        "end": 1148,
        "className": "syntax-variable"
      },
      {
        "start": 1159,
        "end": 1163,
        "className": "syntax-variable"
      },
      {
        "start": 1164,
        "end": 1172,
        "className": "syntax-property"
      },
      {
        "start": 1173,
        "end": 1179,
        "className": "syntax-property"
      },
      {
        "start": 1180,
        "end": 1183,
        "className": "syntax-variable"
      },
      {
        "start": 1187,
        "end": 1191,
        "className": "syntax-keyword"
      },
      {
        "start": 1192,
        "end": 1196,
        "className": "syntax-function"
      },
      {
        "start": 1197,
        "end": 1202,
        "className": "syntax-variable"
      },
      {
        "start": 1204,
        "end": 1208,
        "className": "syntax-string"
      },
      {
        "start": 1210,
        "end": 1212,
        "className": "syntax-keyword"
      },
      {
        "start": 1213,
        "end": 1215,
        "className": "syntax-variable"
      },
      {
        "start": 1221,
        "end": 1229,
        "className": "syntax-variable"
      },
      {
        "start": 1230,
        "end": 1231,
        "className": "syntax-operator"
      },
      {
        "start": 1232,
        "end": 1239,
        "className": "syntax-variable"
      },
      {
        "start": 1240,
        "end": 1248,
        "className": "syntax-property"
      },
      {
        "start": 1249,
        "end": 1258,
        "className": "syntax-variable"
      },
      {
        "start": 1258,
        "end": 1259,
        "className": "syntax-operator"
      },
      {
        "start": 1259,
        "end": 1261,
        "className": "syntax-variable"
      },
      {
        "start": 1263,
        "end": 1272,
        "className": "syntax-variable"
      },
      {
        "start": 1272,
        "end": 1273,
        "className": "syntax-operator"
      },
      {
        "start": 1273,
        "end": 1274,
        "className": "syntax-number"
      },
      {
        "start": 1280,
        "end": 1288,
        "className": "syntax-variable"
      },
      {
        "start": 1289,
        "end": 1290,
        "className": "syntax-operator"
      },
      {
        "start": 1291,
        "end": 1294,
        "className": "syntax-function"
      },
      {
        "start": 1295,
        "end": 1298,
        "className": "syntax-variable"
      },
      {
        "start": 1299,
        "end": 1304,
        "className": "syntax-property"
      },
      {
        "start": 1305,
        "end": 1308,
        "className": "syntax-keyword"
      },
      {
        "start": 1309,
        "end": 1312,
        "className": "syntax-variable"
      },
      {
        "start": 1313,
        "end": 1315,
        "className": "syntax-operator"
      },
      {
        "start": 1316,
        "end": 1326,
        "className": "syntax-type"
      },
      {
        "start": 1332,
        "end": 1337,
        "className": "syntax-keyword"
      },
      {
        "start": 1338,
        "end": 1342,
        "className": "syntax-constant"
      },
      {
        "start": 1352,
        "end": 1355,
        "className": "syntax-keyword"
      },
      {
        "start": 1369,
        "end": 1372,
        "className": "syntax-variable"
      },
      {
        "start": 1373,
        "end": 1374,
        "className": "syntax-operator"
      },
      {
        "start": 1375,
        "end": 1377,
        "className": "syntax-variable"
      },
      {
        "start": 1378,
        "end": 1382,
        "className": "syntax-property"
      },
      {
        "start": 1397,
        "end": 1400,
        "className": "syntax-variable"
      },
      {
        "start": 1401,
        "end": 1402,
        "className": "syntax-operator"
      },
      {
        "start": 1403,
        "end": 1411,
        "className": "syntax-variable"
      },
      {
        "start": 1412,
        "end": 1418,
        "className": "syntax-property"
      },
      {
        "start": 1429,
        "end": 1435,
        "className": "syntax-keyword"
      },
      {
        "start": 1436,
        "end": 1443,
        "className": "syntax-variable"
      },
      {
        "start": 1444,
        "end": 1453,
        "className": "syntax-property"
      },
      {
        "start": 1467,
        "end": 1472,
        "className": "syntax-keyword"
      },
      {
        "start": 1481,
        "end": 1485,
        "className": "syntax-keyword"
      },
      {
        "start": 1499,
        "end": 1508,
        "className": "syntax-variable"
      },
      {
        "start": 1509,
        "end": 1510,
        "className": "syntax-operator"
      },
      {
        "start": 1511,
        "end": 1519,
        "className": "syntax-variable"
      },
      {
        "start": 1520,
        "end": 1526,
        "className": "syntax-property"
      },
      {
        "start": 1541,
        "end": 1545,
        "className": "syntax-variable"
      },
      {
        "start": 1546,
        "end": 1547,
        "className": "syntax-operator"
      },
      {
        "start": 1548,
        "end": 1556,
        "className": "syntax-variable"
      },
      {
        "start": 1557,
        "end": 1570,
        "className": "syntax-property"
      },
      {
        "start": 1571,
        "end": 1580,
        "className": "syntax-variable"
      },
      {
        "start": 1594,
        "end": 1600,
        "className": "syntax-variable"
      },
      {
        "start": 1601,
        "end": 1602,
        "className": "syntax-operator"
      },
      {
        "start": 1603,
        "end": 1611,
        "className": "syntax-variable"
      },
      {
        "start": 1612,
        "end": 1618,
        "className": "syntax-property"
      },
      {
        "start": 1633,
        "end": 1635,
        "className": "syntax-keyword"
      },
      {
        "start": 1636,
        "end": 1639,
        "className": "syntax-variable"
      },
      {
        "start": 1640,
        "end": 1641,
        "className": "syntax-operator"
      },
      {
        "start": 1642,
        "end": 1650,
        "className": "syntax-variable"
      },
      {
        "start": 1668,
        "end": 1673,
        "className": "syntax-variable"
      },
      {
        "start": 1674,
        "end": 1675,
        "className": "syntax-operator"
      },
      {
        "start": 1676,
        "end": 1678,
        "className": "syntax-variable"
      },
      {
        "start": 1679,
        "end": 1683,
        "className": "syntax-property"
      },
      {
        "start": 1684,
        "end": 1690,
        "className": "syntax-variable"
      },
      {
        "start": 1708,
        "end": 1711,
        "className": "syntax-variable"
      },
      {
        "start": 1712,
        "end": 1713,
        "className": "syntax-operator"
      },
      {
        "start": 1714,
        "end": 1724,
        "className": "syntax-type"
      },
      {
        "start": 1725,
        "end": 1732,
        "className": "syntax-property"
      },
      {
        "start": 1745,
        "end": 1749,
        "className": "syntax-keyword"
      },
      {
        "start": 1767,
        "end": 1772,
        "className": "syntax-variable"
      },
      {
        "start": 1773,
        "end": 1774,
        "className": "syntax-operator"
      },
      {
        "start": 1775,
        "end": 1783,
        "className": "syntax-variable"
      },
      {
        "start": 1784,
        "end": 1790,
        "className": "syntax-property"
      },
      {
        "start": 1809,
        "end": 1812,
        "className": "syntax-variable"
      },
      {
        "start": 1813,
        "end": 1814,
        "className": "syntax-operator"
      },
      {
        "start": 1815,
        "end": 1825,
        "className": "syntax-function"
      },
      {
        "start": 1826,
        "end": 1829,
        "className": "syntax-variable"
      },
      {
        "start": 1843,
        "end": 1853,
        "className": "syntax-variable"
      },
      {
        "start": 1854,
        "end": 1855,
        "className": "syntax-operator"
      },
      {
        "start": 1856,
        "end": 1865,
        "className": "syntax-function"
      },
      {
        "start": 1884,
        "end": 1891,
        "className": "syntax-string"
      },
      {
        "start": 1893,
        "end": 1898,
        "className": "syntax-variable"
      },
      {
        "start": 1916,
        "end": 1927,
        "className": "syntax-string"
      },
      {
        "start": 1929,
        "end": 1938,
        "className": "syntax-variable"
      },
      {
        "start": 1956,
        "end": 1962,
        "className": "syntax-string"
      },
      {
        "start": 1964,
        "end": 1968,
        "className": "syntax-variable"
      },
      {
        "start": 1986,
        "end": 1994,
        "className": "syntax-string"
      },
      {
        "start": 1996,
        "end": 2002,
        "className": "syntax-variable"
      },
      {
        "start": 2020,
        "end": 2025,
        "className": "syntax-string"
      },
      {
        "start": 2027,
        "end": 2030,
        "className": "syntax-variable"
      },
      {
        "start": 2048,
        "end": 2054,
        "className": "syntax-string"
      },
      {
        "start": 2056,
        "end": 2059,
        "className": "syntax-variable"
      },
      {
        "start": 2088,
        "end": 2090,
        "className": "syntax-keyword"
      },
      {
        "start": 2091,
        "end": 2094,
        "className": "syntax-operator"
      },
      {
        "start": 2095,
        "end": 2099,
        "className": "syntax-function"
      },
      {
        "start": 2100,
        "end": 2110,
        "className": "syntax-variable"
      },
      {
        "start": 2129,
        "end": 2137,
        "className": "syntax-keyword"
      },
      {
        "start": 2150,
        "end": 2155,
        "className": "syntax-function"
      },
      {
        "start": 2156,
        "end": 2176,
        "className": "syntax-string"
      },
      {
        "start": 2177,
        "end": 2178,
        "className": "syntax-operator"
      },
      {
        "start": 2197,
        "end": 2205,
        "className": "syntax-variable"
      },
      {
        "start": 2207,
        "end": 2210,
        "className": "syntax-variable"
      },
      {
        "start": 2212,
        "end": 2215,
        "className": "syntax-variable"
      },
      {
        "start": 2216,
        "end": 2220,
        "className": "syntax-property"
      },
      {
        "start": 2222,
        "end": 2226,
        "className": "syntax-variable"
      },
      {
        "start": 2227,
        "end": 2236,
        "className": "syntax-property"
      },
      {
        "start": 2240,
        "end": 2246,
        "className": "syntax-variable"
      },
      {
        "start": 2248,
        "end": 2258,
        "className": "syntax-function"
      },
      {
        "start": 2259,
        "end": 2264,
        "className": "syntax-variable"
      }
    ]
  },
  {
    "language": "shell",
    "name": "shell/nixpkgs_setup.sh",
    "code": "# All provided arguments are joined with a space, then prefixed by the name of the function which invoked `nixLog` (or\n# the hook name if the caller was an implicit hook), then directed to $NIX_LOG_FD, if it's set.\nnixLog() {\n  # Return a value explicitly instead of the implicit return of the last command (result of the test).\n  # NOTE: By requiring NIX_LOG_FD be set, we avoid dumping logging inside of nix-shell.\n  [[ -z ${NIX_LOG_FD-} ]] && return 0\n\n  # Use the function name of the caller, unless it is _callImplicitHook, in which case use the name of the hook.\n  local callerName=\"${FUNCNAME[1]}\"\n  if [[ $callerName == \"_callImplicitHook\" ]]; then\n    callerName=\"${hookName:?}\"\n  fi\n  printf \"%s: %s\\n\" \"$callerName\" \"$*\" >&\"$NIX_LOG_FD\"\n}\n\n# Identical to nixLog, but additionally prefixed by the logLevel.\n# NOTE: This function is only every meant to be called from the nix*Log family of functions.\n_nixLogWithLevel() {\n  # Return a value explicitly instead of the implicit return of the last command (result of the test).\n  # NOTE: By requiring NIX_LOG_FD be set, we avoid dumping logging inside of nix-shell.\n  [[ -z ${NIX_LOG_FD-} || ${NIX_DEBUG:-0} -lt ${1:?} ]] && return 0\n\n  local logLevel\n  case \"${1:?}\" in\n  0) logLevel=ERROR ;;\n  1) logLevel=WARN ;;\n  2) logLevel=NOTICE ;;\n  3) logLevel=INFO ;;\n  4) logLevel=TALKATIVE ;;\n  5) logLevel=CHATTY ;;\n  6) logLevel=DEBUG ;;\n  7) logLevel=VOMIT ;;\n  *)\n    echo \"_nixLogWithLevel: called with invalid log level: ${1:?}\" >&\"$NIX_LOG_FD\"\n    return 1\n    ;;\n  esac\n\n  # Use the function name of the caller, unless it is _callImplicitHook, in which case use the name of the hook.\n  # NOTE: Our index into FUNCNAME is 2, not 1, because we are only ever to be called from the nix*Log family of\n  # functions, never directly.\n  local callerName=\"${FUNCNAME[2]}\"\n  if [[ $callerName == \"_callImplicitHook\" ]]; then\n    callerName=\"${hookName:?}\"\n  fi\n\n  # Use the function name of the caller's caller, since we should only every be invoked by nix*Log functions.\n  printf \"%s: %s: %s\\n\" \"$logLevel\" \"$callerName\" \"${2:?}\" >&\"$NIX_LOG_FD\"\n}\n\n# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.\n# Corresponds to `Verbosity::lvlError` in the Nix source.\nnixErrorLog() {\n  _nixLogWithLevel 0 \"$*\"\n}\n\n# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.\n# Corresponds to `Verbosity::lvlWarn` in the Nix source.\nnixWarnLog() {\n  _nixLogWithLevel 1 \"$*\"\n}\n\n# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.\n# Corresponds to `Verbosity::lvlNotice` in the Nix source.\nnixNoticeLog() {\n  _nixLogWithLevel 2 \"$*\"\n}\n\n# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.\n# Corresponds to `Verbosity::lvlInfo` in the Nix source.\nnixInfoLog() {\n  _nixLogWithLevel 3 \"$*\"\n}\n\n# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.\n# Corresponds to `Verbosity::lvlTalkative` in the Nix source.\nnixTalkativeLog() {\n  _nixLogWithLevel 4 \"$*\"\n}\n\n# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.\n# Corresponds to `Verbosity::lvlChatty` in the Nix source.\nnixChattyLog() {\n  _nixLogWithLevel 5 \"$*\"\n}\n\n# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.\n# Corresponds to `Verbosity::lvlDebug` in the Nix source.\nnixDebugLog() {\n  _nixLogWithLevel 6 \"$*\"\n}\n\n# All provided arguments are joined with a space then directed to $NIX_LOG_FD, if it's set.\n# Corresponds to `Verbosity::lvlVomit` in the Nix source.\nnixVomitLog() {\n  _nixLogWithLevel 7 \"$*\"\n}",
    "spans": [
      {
        "start": 0,
        "end": 118,
        "className": "syntax-comment"
      },
      {
        "start": 119,
        "end": 214,
        "className": "syntax-comment"
      },
      {
        "start": 215,
        "end": 221,
        "className": "syntax-function"
      },
      {
        "start": 228,
        "end": 328,
        "className": "syntax-comment"
      },
      {
        "start": 331,
        "end": 416,
        "className": "syntax-comment"
      },
      {
        "start": 427,
        "end": 437,
        "className": "syntax-property"
      },
      {
        "start": 443,
        "end": 445,
        "className": "syntax-operator"
      },
      {
        "start": 446,
        "end": 452,
        "className": "syntax-function"
      },
      {
        "start": 458,
        "end": 568,
        "className": "syntax-comment"
      },
      {
        "start": 577,
        "end": 587,
        "className": "syntax-property"
      },
      {
        "start": 588,
        "end": 604,
        "className": "syntax-string"
      },
      {
        "start": 607,
        "end": 609,
        "className": "syntax-keyword"
      },
      {
        "start": 613,
        "end": 614,
        "className": "syntax-operator"
      },
      {
        "start": 614,
        "end": 624,
        "className": "syntax-property"
      },
      {
        "start": 628,
        "end": 647,
        "className": "syntax-string"
      },
      {
        "start": 652,
        "end": 656,
        "className": "syntax-keyword"
      },
      {
        "start": 661,
        "end": 671,
        "className": "syntax-property"
      },
      {
        "start": 672,
        "end": 687,
        "className": "syntax-string"
      },
      {
        "start": 690,
        "end": 692,
        "className": "syntax-keyword"
      },
      {
        "start": 695,
        "end": 701,
        "className": "syntax-function"
      },
      {
        "start": 702,
        "end": 712,
        "className": "syntax-string"
      },
      {
        "start": 713,
        "end": 726,
        "className": "syntax-string"
      },
      {
        "start": 727,
        "end": 731,
        "className": "syntax-string"
      },
      {
        "start": 734,
        "end": 747,
        "className": "syntax-string"
      },
      {
        "start": 751,
        "end": 816,
        "className": "syntax-comment"
      },
      {
        "start": 817,
        "end": 909,
        "className": "syntax-comment"
      },
      {
        "start": 910,
        "end": 926,
        "className": "syntax-function"
      },
      {
        "start": 933,
        "end": 1033,
        "className": "syntax-comment"
      },
      {
        "start": 1036,
        "end": 1121,
        "className": "syntax-comment"
      },
      {
        "start": 1132,
        "end": 1142,
        "className": "syntax-property"
      },
      {
        "start": 1150,
        "end": 1159,
        "className": "syntax-property"
      },
      {
        "start": 1170,
        "end": 1171,
        "className": "syntax-property"
      },
      {
        "start": 1178,
        "end": 1180,
        "className": "syntax-operator"
      },
      {
        "start": 1181,
        "end": 1187,
        "className": "syntax-function"
      },
      {
        "start": 1199,
        "end": 1207,
        "className": "syntax-property"
      },
      {
        "start": 1210,
        "end": 1214,
        "className": "syntax-keyword"
      },
      {
        "start": 1215,
        "end": 1223,
        "className": "syntax-string"
      },
      {
        "start": 1224,
        "end": 1226,
        "className": "syntax-keyword"
      },
      {
        "start": 1232,
        "end": 1240,
        "className": "syntax-property"
      },
      {
        "start": 1255,
        "end": 1263,
        "className": "syntax-property"
      },
      {
        "start": 1277,
        "end": 1285,
        "className": "syntax-property"
      },
      {
        "start": 1301,
        "end": 1309,
        "className": "syntax-property"
      },
      {
        "start": 1323,
        "end": 1331,
        "className": "syntax-property"
      },
      {
        "start": 1350,
        "end": 1358,
        "className": "syntax-property"
      },
      {
        "start": 1374,
        "end": 1382,
        "className": "syntax-property"
      },
      {
        "start": 1397,
        "end": 1405,
        "className": "syntax-property"
      },
      {
        "start": 1424,
        "end": 1428,
        "className": "syntax-function"
      },
      {
        "start": 1429,
        "end": 1486,
        "className": "syntax-string"
      },
      {
        "start": 1489,
        "end": 1502,
        "className": "syntax-string"
      },
      {
        "start": 1507,
        "end": 1513,
        "className": "syntax-function"
      },
      {
        "start": 1525,
        "end": 1529,
        "className": "syntax-keyword"
      },
      {
        "start": 1533,
        "end": 1643,
        "className": "syntax-comment"
      },
      {
        "start": 1646,
        "end": 1755,
        "className": "syntax-comment"
      },
      {
        "start": 1758,
        "end": 1786,
        "className": "syntax-comment"
      },
      {
        "start": 1795,
        "end": 1805,
        "className": "syntax-property"
      },
      {
        "start": 1806,
        "end": 1822,
        "className": "syntax-string"
      },
      {
        "start": 1825,
        "end": 1827,
        "className": "syntax-keyword"
      },
      {
        "start": 1831,
        "end": 1832,
        "className": "syntax-operator"
      },
      {
        "start": 1832,
        "end": 1842,
        "className": "syntax-property"
      },
      {
        "start": 1846,
        "end": 1865,
        "className": "syntax-string"
      },
      {
        "start": 1870,
        "end": 1874,
        "className": "syntax-keyword"
      },
      {
        "start": 1879,
        "end": 1889,
        "className": "syntax-property"
      },
      {
        "start": 1890,
        "end": 1905,
        "className": "syntax-string"
      },
      {
        "start": 1908,
        "end": 1910,
        "className": "syntax-keyword"
      },
      {
        "start": 1914,
        "end": 2021,
        "className": "syntax-comment"
      },
      {
        "start": 2024,
        "end": 2030,
        "className": "syntax-function"
      },
      {
        "start": 2031,
        "end": 2045,
        "className": "syntax-string"
      },
      {
        "start": 2046,
        "end": 2057,
        "className": "syntax-string"
      },
      {
        "start": 2058,
        "end": 2071,
        "className": "syntax-string"
      },
      {
        "start": 2072,
        "end": 2080,
        "className": "syntax-string"
      },
      {
        "start": 2083,
        "end": 2096,
        "className": "syntax-string"
      },
      {
        "start": 2100,
        "end": 2191,
        "className": "syntax-comment"
      },
      {
        "start": 2192,
        "end": 2249,
        "className": "syntax-comment"
      },
      {
        "start": 2250,
        "end": 2261,
        "className": "syntax-function"
      },
      {
        "start": 2268,
        "end": 2284,
        "className": "syntax-function"
      },
      {
        "start": 2287,
        "end": 2291,
        "className": "syntax-string"
      },
      {
        "start": 2295,
        "end": 2386,
        "className": "syntax-comment"
      },
      {
        "start": 2387,
        "end": 2443,
        "className": "syntax-comment"
      },
      {
        "start": 2444,
        "end": 2454,
        "className": "syntax-function"
      },
      {
        "start": 2461,
        "end": 2477,
        "className": "syntax-function"
      },
      {
        "start": 2480,
        "end": 2484,
        "className": "syntax-string"
      },
      {
        "start": 2488,
        "end": 2579,
        "className": "syntax-comment"
      },
      {
        "start": 2580,
        "end": 2638,
        "className": "syntax-comment"
      },
      {
        "start": 2639,
        "end": 2651,
        "className": "syntax-function"
      },
      {
        "start": 2658,
        "end": 2674,
        "className": "syntax-function"
      },
      {
        "start": 2677,
        "end": 2681,
        "className": "syntax-string"
      },
      {
        "start": 2685,
        "end": 2776,
        "className": "syntax-comment"
      },
      {
        "start": 2777,
        "end": 2833,
        "className": "syntax-comment"
      },
      {
        "start": 2834,
        "end": 2844,
        "className": "syntax-function"
      },
      {
        "start": 2851,
        "end": 2867,
        "className": "syntax-function"
      },
      {
        "start": 2870,
        "end": 2874,
        "className": "syntax-string"
      },
      {
        "start": 2878,
        "end": 2969,
        "className": "syntax-comment"
      },
      {
        "start": 2970,
        "end": 3031,
        "className": "syntax-comment"
      },
      {
        "start": 3032,
        "end": 3047,
        "className": "syntax-function"
      },
      {
        "start": 3054,
        "end": 3070,
        "className": "syntax-function"
      },
      {
        "start": 3073,
        "end": 3077,
        "className": "syntax-string"
      },
      {
        "start": 3081,
        "end": 3172,
        "className": "syntax-comment"
      },
      {
        "start": 3173,
        "end": 3231,
        "className": "syntax-comment"
      },
      {
        "start": 3232,
        "end": 3244,
        "className": "syntax-function"
      },
      {
        "start": 3251,
        "end": 3267,
        "className": "syntax-function"
      },
      {
        "start": 3270,
        "end": 3274,
        "className": "syntax-string"
      },
      {
        "start": 3278,
        "end": 3369,
        "className": "syntax-comment"
      },
      {
        "start": 3370,
        "end": 3427,
        "className": "syntax-comment"
      },
      {
        "start": 3428,
        "end": 3439,
        "className": "syntax-function"
      },
      {
        "start": 3446,
        "end": 3462,
        "className": "syntax-function"
      },
      {
        "start": 3465,
        "end": 3469,
        "className": "syntax-string"
      },
      {
        "start": 3473,
        "end": 3564,
        "className": "syntax-comment"
      },
      {
        "start": 3565,
        "end": 3622,
        "className": "syntax-comment"
      },
      {
        "start": 3623,
        "end": 3634,
        "className": "syntax-function"
      },
      {
        "start": 3641,
        "end": 3657,
        "className": "syntax-function"
      },
      {
        "start": 3660,
        "end": 3664,
        "className": "syntax-string"
      }
    ]
  },
  {
    "language": "typescript",
    "name": "typescript/typescript_module_specifiers.ts",
    "code": "export function getLocalModuleSpecifierBetweenFileNames(\n    importingFile: Pick<SourceFile, \"fileName\" | \"impliedNodeFormat\">,\n    targetFileName: string,\n    compilerOptions: CompilerOptions,\n    host: ModuleSpecifierResolutionHost,\n    preferences: UserPreferences,\n    options: ModuleSpecifierOptions = {},\n): string {\n    const info = getInfo(importingFile.fileName, host);\n    const importMode = options.overrideImportMode ?? importingFile.impliedNodeFormat;\n    return getLocalModuleSpecifier(\n        targetFileName,\n        info,\n        compilerOptions,\n        host,\n        importMode,\n        getModuleSpecifierPreferences(preferences, host, compilerOptions, importingFile),\n    );\n}\n\nfunction computeModuleSpecifiers(\n    modulePaths: readonly ModulePath[],\n    compilerOptions: CompilerOptions,\n    importingSourceFile: SourceFile | FutureSourceFile,\n    host: ModuleSpecifierResolutionHost,\n    userPreferences: UserPreferences,\n    options: ModuleSpecifierOptions = {},\n    forAutoImport: boolean,\n): ModuleSpecifierResult {\n    const info = getInfo(importingSourceFile.fileName, host);\n    const preferences = getModuleSpecifierPreferences(userPreferences, host, compilerOptions, importingSourceFile);\n    const existingSpecifier = isFullSourceFile(importingSourceFile) && forEach(modulePaths, modulePath =>\n        forEach(\n            host.getFileIncludeReasons().get(toPath(modulePath.path, host.getCurrentDirectory(), info.getCanonicalFileName)),\n            reason => {\n                if (reason.kind !== FileIncludeKind.Import || reason.file !== importingSourceFile.path) return undefined;\n                // If the candidate import mode doesn't match the mode we're generating for, don't consider it\n                // TODO: maybe useful to keep around as an alternative option for certain contexts where the mode is overridable\n                const existingMode = host.getModeForResolutionAtIndex(importingSourceFile, reason.index);\n                const targetMode = options.overrideImportMode ?? host.getDefaultResolutionModeForFile(importingSourceFile);\n                if (existingMode !== targetMode && existingMode !== undefined && targetMode !== undefined) {\n                    return undefined;\n                }\n                const specifier = getModuleNameStringLiteralAt(importingSourceFile, reason.index).text;\n                // If the preference is for non relative and the module specifier is relative, ignore it\n                return preferences.relativePreference !== RelativePreference.NonRelative || !pathIsRelative(specifier) ?\n                    specifier :\n                    undefined;\n            },\n        ));\n    if (existingSpecifier) {\n        return { kind: undefined, moduleSpecifiers: [existingSpecifier], computedWithoutCache: true };\n    }\n\n    const importedFileIsInNodeModules = some(modulePaths, p => p.isInNodeModules);\n\n    // Module specifier priority:\n    //   1. \"Bare package specifiers\" (e.g. \"@foo/bar\") resulting from a path through node_modules to a package.json's \"types\" entry\n    //   2. Specifiers generated using \"paths\" from tsconfig\n    //   3. Non-relative specfiers resulting from a path through node_modules (e.g. \"@foo/bar/path/to/file\")\n    //   4. Relative paths\n    let nodeModulesSpecifiers: string[] | undefined;\n    let pathsSpecifiers: string[] | undefined;\n    let redirectPathsSpecifiers: string[] | undefined;\n    let relativeSpecifiers: string[] | undefined;\n    for (const modulePath of modulePaths) {\n        const specifier = modulePath.isInNodeModules",
    "spans": [
      {
        "start": 0,
        "end": 6,
        "className": "syntax-keyword"
      },
      {
        "start": 7,
        "end": 15,
        "className": "syntax-keyword"
      },
      {
        "start": 16,
        "end": 55,
        "className": "syntax-function"
      },
      {
        "start": 55,
        "end": 56,
        "className": "syntax-punctuation"
      },
      {
        "start": 61,
        "end": 74,
        "className": "syntax-variable"
      },
      {
        "start": 76,
        "end": 80,
        "className": "syntax-type"
      },
      {
        "start": 80,
        "end": 81,
        "className": "syntax-operator"
      },
      {
        "start": 81,
        "end": 91,
        "className": "syntax-type"
      },
      {
        "start": 91,
        "end": 92,
        "className": "syntax-punctuation"
      },
      {
        "start": 93,
        "end": 103,
        "className": "syntax-string"
      },
      {
        "start": 104,
        "end": 105,
        "className": "syntax-operator"
      },
      {
        "start": 106,
        "end": 125,
        "className": "syntax-string"
      },
      {
        "start": 125,
        "end": 126,
        "className": "syntax-operator"
      },
      {
        "start": 126,
        "end": 127,
        "className": "syntax-punctuation"
      },
      {
        "start": 132,
        "end": 146,
        "className": "syntax-variable"
      },
      {
        "start": 148,
        "end": 154,
        "className": "syntax-type"
      },
      {
        "start": 154,
        "end": 155,
        "className": "syntax-punctuation"
      },
      {
        "start": 160,
        "end": 175,
        "className": "syntax-variable"
      },
      {
        "start": 177,
        "end": 192,
        "className": "syntax-type"
      },
      {
        "start": 192,
        "end": 193,
        "className": "syntax-punctuation"
      },
      {
        "start": 198,
        "end": 202,
        "className": "syntax-variable"
      },
      {
        "start": 204,
        "end": 233,
        "className": "syntax-type"
      },
      {
        "start": 233,
        "end": 234,
        "className": "syntax-punctuation"
      },
      {
        "start": 239,
        "end": 250,
        "className": "syntax-variable"
      },
      {
        "start": 252,
        "end": 267,
        "className": "syntax-type"
      },
      {
        "start": 267,
        "end": 268,
        "className": "syntax-punctuation"
      },
      {
        "start": 273,
        "end": 280,
        "className": "syntax-variable"
      },
      {
        "start": 282,
        "end": 304,
        "className": "syntax-type"
      },
      {
        "start": 305,
        "end": 306,
        "className": "syntax-operator"
      },
      {
        "start": 307,
        "end": 310,
        "className": "syntax-punctuation"
      },
      {
        "start": 311,
        "end": 312,
        "className": "syntax-punctuation"
      },
      {
        "start": 314,
        "end": 320,
        "className": "syntax-type"
      },
      {
        "start": 321,
        "end": 322,
        "className": "syntax-punctuation"
      },
      {
        "start": 327,
        "end": 332,
        "className": "syntax-keyword"
      },
      {
        "start": 333,
        "end": 337,
        "className": "syntax-variable"
      },
      {
        "start": 338,
        "end": 339,
        "className": "syntax-operator"
      },
      {
        "start": 340,
        "end": 347,
        "className": "syntax-function"
      },
      {
        "start": 347,
        "end": 348,
        "className": "syntax-punctuation"
      },
      {
        "start": 348,
        "end": 361,
        "className": "syntax-variable"
      },
      {
        "start": 361,
        "end": 362,
        "className": "syntax-punctuation"
      },
      {
        "start": 362,
        "end": 370,
        "className": "syntax-property"
      },
      {
        "start": 370,
        "end": 371,
        "className": "syntax-punctuation"
      },
      {
        "start": 372,
        "end": 376,
        "className": "syntax-variable"
      },
      {
        "start": 376,
        "end": 378,
        "className": "syntax-punctuation"
      },
      {
        "start": 383,
        "end": 388,
        "className": "syntax-keyword"
      },
      {
        "start": 389,
        "end": 399,
        "className": "syntax-variable"
      },
      {
        "start": 400,
        "end": 401,
        "className": "syntax-operator"
      },
      {
        "start": 402,
        "end": 409,
        "className": "syntax-variable"
      },
      {
        "start": 409,
        "end": 410,
        "className": "syntax-punctuation"
      },
      {
        "start": 410,
        "end": 428,
        "className": "syntax-property"
      },
      {
        "start": 429,
        "end": 431,
        "className": "syntax-operator"
      },
      {
        "start": 432,
        "end": 445,
        "className": "syntax-variable"
      },
      {
        "start": 445,
        "end": 446,
        "className": "syntax-punctuation"
      },
      {
        "start": 446,
        "end": 463,
        "className": "syntax-property"
      },
      {
        "start": 463,
        "end": 464,
        "className": "syntax-punctuation"
      },
      {
        "start": 469,
        "end": 475,
        "className": "syntax-keyword"
      },
      {
        "start": 476,
        "end": 499,
        "className": "syntax-function"
      },
      {
        "start": 499,
        "end": 500,
        "className": "syntax-punctuation"
      },
      {
        "start": 509,
        "end": 523,
        "className": "syntax-variable"
      },
      {
        "start": 523,
        "end": 524,
        "className": "syntax-punctuation"
      },
      {
        "start": 533,
        "end": 537,
        "className": "syntax-variable"
      },
      {
        "start": 537,
        "end": 538,
        "className": "syntax-punctuation"
      },
      {
        "start": 547,
        "end": 562,
        "className": "syntax-variable"
      },
      {
        "start": 562,
        "end": 563,
        "className": "syntax-punctuation"
      },
      {
        "start": 572,
        "end": 576,
        "className": "syntax-variable"
      },
      {
        "start": 576,
        "end": 577,
        "className": "syntax-punctuation"
      },
      {
        "start": 586,
        "end": 596,
        "className": "syntax-variable"
      },
      {
        "start": 596,
        "end": 597,
        "className": "syntax-punctuation"
      },
      {
        "start": 606,
        "end": 635,
        "className": "syntax-function"
      },
      {
        "start": 635,
        "end": 636,
        "className": "syntax-punctuation"
      },
      {
        "start": 636,
        "end": 647,
        "className": "syntax-variable"
      },
      {
        "start": 647,
        "end": 648,
        "className": "syntax-punctuation"
      },
      {
        "start": 649,
        "end": 653,
        "className": "syntax-variable"
      },
      {
        "start": 653,
        "end": 654,
        "className": "syntax-punctuation"
      },
      {
        "start": 655,
        "end": 670,
        "className": "syntax-variable"
      },
      {
        "start": 670,
        "end": 671,
        "className": "syntax-punctuation"
      },
      {
        "start": 672,
        "end": 685,
        "className": "syntax-variable"
      },
      {
        "start": 685,
        "end": 687,
        "className": "syntax-punctuation"
      },
      {
        "start": 692,
        "end": 694,
        "className": "syntax-punctuation"
      },
      {
        "start": 695,
        "end": 696,
        "className": "syntax-punctuation"
      },
      {
        "start": 698,
        "end": 706,
        "className": "syntax-keyword"
      },
      {
        "start": 707,
        "end": 730,
        "className": "syntax-function"
      },
      {
        "start": 730,
        "end": 731,
        "className": "syntax-punctuation"
      },
      {
        "start": 736,
        "end": 747,
        "className": "syntax-variable"
      },
      {
        "start": 749,
        "end": 757,
        "className": "syntax-keyword"
      },
      {
        "start": 758,
        "end": 768,
        "className": "syntax-type"
      },
      {
        "start": 768,
        "end": 771,
        "className": "syntax-punctuation"
      },
      {
        "start": 776,
        "end": 791,
        "className": "syntax-variable"
      },
      {
        "start": 793,
        "end": 808,
        "className": "syntax-type"
      },
      {
        "start": 808,
        "end": 809,
        "className": "syntax-punctuation"
      },
      {
        "start": 814,
        "end": 833,
        "className": "syntax-variable"
      },
      {
        "start": 835,
        "end": 845,
        "className": "syntax-type"
      },
      {
        "start": 846,
        "end": 847,
        "className": "syntax-operator"
      },
      {
        "start": 848,
        "end": 864,
        "className": "syntax-type"
      },
      {
        "start": 864,
        "end": 865,
        "className": "syntax-punctuation"
      },
      {
        "start": 870,
        "end": 874,
        "className": "syntax-variable"
      },
      {
        "start": 876,
        "end": 905,
        "className": "syntax-type"
      },
      {
        "start": 905,
        "end": 906,
        "className": "syntax-punctuation"
      },
      {
        "start": 911,
        "end": 926,
        "className": "syntax-variable"
      },
      {
        "start": 928,
        "end": 943,
        "className": "syntax-type"
      },
      {
        "start": 943,
        "end": 944,
        "className": "syntax-punctuation"
      },
      {
        "start": 949,
        "end": 956,
        "className": "syntax-variable"
      },
      {
        "start": 958,
        "end": 980,
        "className": "syntax-type"
      },
      {
        "start": 981,
        "end": 982,
        "className": "syntax-operator"
      },
      {
        "start": 983,
        "end": 986,
        "className": "syntax-punctuation"
      },
      {
        "start": 991,
        "end": 1004,
        "className": "syntax-variable"
      },
      {
        "start": 1006,
        "end": 1013,
        "className": "syntax-type"
      },
      {
        "start": 1013,
        "end": 1014,
        "className": "syntax-punctuation"
      },
      {
        "start": 1015,
        "end": 1016,
        "className": "syntax-punctuation"
      },
      {
        "start": 1018,
        "end": 1039,
        "className": "syntax-type"
      },
      {
        "start": 1040,
        "end": 1041,
        "className": "syntax-punctuation"
      },
      {
        "start": 1046,
        "end": 1051,
        "className": "syntax-keyword"
      },
      {
        "start": 1052,
        "end": 1056,
        "className": "syntax-variable"
      },
      {
        "start": 1057,
        "end": 1058,
        "className": "syntax-operator"
      },
      {
        "start": 1059,
        "end": 1066,
        "className": "syntax-function"
      },
      {
        "start": 1066,
        "end": 1067,
        "className": "syntax-punctuation"
      },
      {
        "start": 1067,
        "end": 1086,
        "className": "syntax-variable"
      },
      {
        "start": 1086,
        "end": 1087,
        "className": "syntax-punctuation"
      },
      {
        "start": 1087,
        "end": 1095,
        "className": "syntax-property"
      },
      {
        "start": 1095,
        "end": 1096,
        "className": "syntax-punctuation"
      },
      {
        "start": 1097,
        "end": 1101,
        "className": "syntax-variable"
      },
      {
        "start": 1101,
        "end": 1103,
        "className": "syntax-punctuation"
      },
      {
        "start": 1108,
        "end": 1113,
        "className": "syntax-keyword"
      },
      {
        "start": 1114,
        "end": 1125,
        "className": "syntax-variable"
      },
      {
        "start": 1126,
        "end": 1127,
        "className": "syntax-operator"
      },
      {
        "start": 1128,
        "end": 1157,
        "className": "syntax-function"
      },
      {
        "start": 1157,
        "end": 1158,
        "className": "syntax-punctuation"
      },
      {
        "start": 1158,
        "end": 1173,
        "className": "syntax-variable"
      },
      {
        "start": 1173,
        "end": 1174,
        "className": "syntax-punctuation"
      },
      {
        "start": 1175,
        "end": 1179,
        "className": "syntax-variable"
      },
      {
        "start": 1179,
        "end": 1180,
        "className": "syntax-punctuation"
      },
      {
        "start": 1181,
        "end": 1196,
        "className": "syntax-variable"
      },
      {
        "start": 1196,
        "end": 1197,
        "className": "syntax-punctuation"
      },
      {
        "start": 1198,
        "end": 1217,
        "className": "syntax-variable"
      },
      {
        "start": 1217,
        "end": 1219,
        "className": "syntax-punctuation"
      },
      {
        "start": 1224,
        "end": 1229,
        "className": "syntax-keyword"
      },
      {
        "start": 1230,
        "end": 1247,
        "className": "syntax-variable"
      },
      {
        "start": 1248,
        "end": 1249,
        "className": "syntax-operator"
      },
      {
        "start": 1250,
        "end": 1266,
        "className": "syntax-function"
      },
      {
        "start": 1266,
        "end": 1267,
        "className": "syntax-punctuation"
      },
      {
        "start": 1267,
        "end": 1286,
        "className": "syntax-variable"
      },
      {
        "start": 1286,
        "end": 1287,
        "className": "syntax-punctuation"
      },
      {
        "start": 1288,
        "end": 1290,
        "className": "syntax-operator"
      },
      {
        "start": 1291,
        "end": 1298,
        "className": "syntax-function"
      },
      {
        "start": 1298,
        "end": 1299,
        "className": "syntax-punctuation"
      },
      {
        "start": 1299,
        "end": 1310,
        "className": "syntax-variable"
      },
      {
        "start": 1310,
        "end": 1311,
        "className": "syntax-punctuation"
      },
      {
        "start": 1312,
        "end": 1322,
        "className": "syntax-variable"
      },
      {
        "start": 1323,
        "end": 1325,
        "className": "syntax-operator"
      },
      {
        "start": 1334,
        "end": 1341,
        "className": "syntax-function"
      },
      {
        "start": 1341,
        "end": 1342,
        "className": "syntax-punctuation"
      },
      {
        "start": 1355,
        "end": 1359,
        "className": "syntax-variable"
      },
      {
        "start": 1359,
        "end": 1360,
        "className": "syntax-punctuation"
      },
      {
        "start": 1360,
        "end": 1381,
        "className": "syntax-function"
      },
      {
        "start": 1381,
        "end": 1384,
        "className": "syntax-punctuation"
      },
      {
        "start": 1384,
        "end": 1387,
        "className": "syntax-function"
      },
      {
        "start": 1387,
        "end": 1388,
        "className": "syntax-punctuation"
      },
      {
        "start": 1388,
        "end": 1394,
        "className": "syntax-function"
      },
      {
        "start": 1394,
        "end": 1395,
        "className": "syntax-punctuation"
      },
      {
        "start": 1395,
        "end": 1405,
        "className": "syntax-variable"
      },
      {
        "start": 1405,
        "end": 1406,
        "className": "syntax-punctuation"
      },
      {
        "start": 1406,
        "end": 1410,
        "className": "syntax-property"
      },
      {
        "start": 1410,
        "end": 1411,
        "className": "syntax-punctuation"
      },
      {
        "start": 1412,
        "end": 1416,
        "className": "syntax-variable"
      },
      {
        "start": 1416,
        "end": 1417,
        "className": "syntax-punctuation"
      },
      {
        "start": 1417,
        "end": 1436,
        "className": "syntax-function"
      },
      {
        "start": 1436,
        "end": 1439,
        "className": "syntax-punctuation"
      },
      {
        "start": 1440,
        "end": 1444,
        "className": "syntax-variable"
      },
      {
        "start": 1444,
        "end": 1445,
        "className": "syntax-punctuation"
      },
      {
        "start": 1445,
        "end": 1465,
        "className": "syntax-property"
      },
      {
        "start": 1465,
        "end": 1468,
        "className": "syntax-punctuation"
      },
      {
        "start": 1481,
        "end": 1487,
        "className": "syntax-variable"
      },
      {
        "start": 1488,
        "end": 1490,
        "className": "syntax-operator"
      },
      {
        "start": 1491,
        "end": 1492,
        "className": "syntax-punctuation"
      },
      {
        "start": 1509,
        "end": 1511,
        "className": "syntax-keyword"
      },
      {
        "start": 1512,
        "end": 1513,
        "className": "syntax-punctuation"
      },
      {
        "start": 1513,
        "end": 1519,
        "className": "syntax-variable"
      },
      {
        "start": 1519,
        "end": 1520,
        "className": "syntax-punctuation"
      },
      {
        "start": 1520,
        "end": 1524,
        "className": "syntax-property"
      },
      {
        "start": 1525,
        "end": 1528,
        "className": "syntax-operator"
      },
      {
        "start": 1529,
        "end": 1544,
        "className": "syntax-type"
      },
      {
        "start": 1544,
        "end": 1545,
        "className": "syntax-punctuation"
      },
      {
        "start": 1545,
        "end": 1551,
        "className": "syntax-property"
      },
      {
        "start": 1552,
        "end": 1554,
        "className": "syntax-operator"
      },
      {
        "start": 1555,
        "end": 1561,
        "className": "syntax-variable"
      },
      {
        "start": 1561,
        "end": 1562,
        "className": "syntax-punctuation"
      },
      {
        "start": 1562,
        "end": 1566,
        "className": "syntax-property"
      },
      {
        "start": 1567,
        "end": 1570,
        "className": "syntax-operator"
      },
      {
        "start": 1571,
        "end": 1590,
        "className": "syntax-variable"
      },
      {
        "start": 1590,
        "end": 1591,
        "className": "syntax-punctuation"
      },
      {
        "start": 1591,
        "end": 1595,
        "className": "syntax-property"
      },
      {
        "start": 1595,
        "end": 1596,
        "className": "syntax-punctuation"
      },
      {
        "start": 1597,
        "end": 1603,
        "className": "syntax-keyword"
      },
      {
        "start": 1604,
        "end": 1613,
        "className": "syntax-constant"
      },
      {
        "start": 1613,
        "end": 1614,
        "className": "syntax-punctuation"
      },
      {
        "start": 1631,
        "end": 1725,
        "className": "syntax-comment"
      },
      {
        "start": 1742,
        "end": 1854,
        "className": "syntax-comment"
      },
      {
        "start": 1871,
        "end": 1876,
        "className": "syntax-keyword"
      },
      {
        "start": 1877,
        "end": 1889,
        "className": "syntax-variable"
      },
      {
        "start": 1890,
        "end": 1891,
        "className": "syntax-operator"
      },
      {
        "start": 1892,
        "end": 1896,
        "className": "syntax-variable"
      },
      {
        "start": 1896,
        "end": 1897,
        "className": "syntax-punctuation"
      },
      {
        "start": 1897,
        "end": 1924,
        "className": "syntax-function"
      },
      {
        "start": 1924,
        "end": 1925,
        "className": "syntax-punctuation"
      },
      {
        "start": 1925,
        "end": 1944,
        "className": "syntax-variable"
      },
      {
        "start": 1944,
        "end": 1945,
        "className": "syntax-punctuation"
      },
      {
        "start": 1946,
        "end": 1952,
        "className": "syntax-variable"
      },
      {
        "start": 1952,
        "end": 1953,
        "className": "syntax-punctuation"
      },
      {
        "start": 1953,
        "end": 1958,
        "className": "syntax-property"
      },
      {
        "start": 1958,
        "end": 1960,
        "className": "syntax-punctuation"
      },
      {
        "start": 1977,
        "end": 1982,
        "className": "syntax-keyword"
      },
      {
        "start": 1983,
        "end": 1993,
        "className": "syntax-variable"
      },
      {
        "start": 1994,
        "end": 1995,
        "className": "syntax-operator"
      },
      {
        "start": 1996,
        "end": 2003,
        "className": "syntax-variable"
      },
      {
        "start": 2003,
        "end": 2004,
        "className": "syntax-punctuation"
      },
      {
        "start": 2004,
        "end": 2022,
        "className": "syntax-property"
      },
      {
        "start": 2023,
        "end": 2025,
        "className": "syntax-operator"
      },
      {
        "start": 2026,
        "end": 2030,
        "className": "syntax-variable"
      },
      {
        "start": 2030,
        "end": 2031,
        "className": "syntax-punctuation"
      },
      {
        "start": 2031,
        "end": 2062,
        "className": "syntax-function"
      },
      {
        "start": 2062,
        "end": 2063,
        "className": "syntax-punctuation"
      },
      {
        "start": 2063,
        "end": 2082,
        "className": "syntax-variable"
      },
      {
        "start": 2082,
        "end": 2084,
        "className": "syntax-punctuation"
      },
      {
        "start": 2101,
        "end": 2103,
        "className": "syntax-keyword"
      },
      {
        "start": 2104,
        "end": 2105,
        "className": "syntax-punctuation"
      },
      {
        "start": 2105,
        "end": 2117,
        "className": "syntax-variable"
      },
      {
        "start": 2118,
        "end": 2121,
        "className": "syntax-operator"
      },
      {
        "start": 2122,
        "end": 2132,
        "className": "syntax-variable"
      },
      {
        "start": 2133,
        "end": 2135,
        "className": "syntax-operator"
      },
      {
        "start": 2136,
        "end": 2148,
        "className": "syntax-variable"
      },
      {
        "start": 2149,
        "end": 2152,
        "className": "syntax-operator"
      },
      {
        "start": 2153,
        "end": 2162,
        "className": "syntax-constant"
      },
      {
        "start": 2163,
        "end": 2165,
        "className": "syntax-operator"
      },
      {
        "start": 2166,
        "end": 2176,
        "className": "syntax-variable"
      },
      {
        "start": 2177,
        "end": 2180,
        "className": "syntax-operator"
      },
      {
        "start": 2181,
        "end": 2190,
        "className": "syntax-constant"
      },
      {
        "start": 2190,
        "end": 2191,
        "className": "syntax-punctuation"
      },
      {
        "start": 2192,
        "end": 2193,
        "className": "syntax-punctuation"
      },
      {
        "start": 2214,
        "end": 2220,
        "className": "syntax-keyword"
      },
      {
        "start": 2221,
        "end": 2230,
        "className": "syntax-constant"
      },
      {
        "start": 2230,
        "end": 2231,
        "className": "syntax-punctuation"
      },
      {
        "start": 2248,
        "end": 2249,
        "className": "syntax-punctuation"
      },
      {
        "start": 2266,
        "end": 2271,
        "className": "syntax-keyword"
      },
      {
        "start": 2272,
        "end": 2281,
        "className": "syntax-variable"
      },
      {
        "start": 2282,
        "end": 2283,
        "className": "syntax-operator"
      },
      {
        "start": 2284,
        "end": 2312,
        "className": "syntax-function"
      },
      {
        "start": 2312,
        "end": 2313,
        "className": "syntax-punctuation"
      },
      {
        "start": 2313,
        "end": 2332,
        "className": "syntax-variable"
      },
      {
        "start": 2332,
        "end": 2333,
        "className": "syntax-punctuation"
      },
      {
        "start": 2334,
        "end": 2340,
        "className": "syntax-variable"
      },
      {
        "start": 2340,
        "end": 2341,
        "className": "syntax-punctuation"
      },
      {
        "start": 2341,
        "end": 2346,
        "className": "syntax-property"
      },
      {
        "start": 2346,
        "end": 2348,
        "className": "syntax-punctuation"
      },
      {
        "start": 2348,
        "end": 2352,
        "className": "syntax-property"
      },
      {
        "start": 2352,
        "end": 2353,
        "className": "syntax-punctuation"
      },
      {
        "start": 2370,
        "end": 2458,
        "className": "syntax-comment"
      },
      {
        "start": 2475,
        "end": 2481,
        "className": "syntax-keyword"
      },
      {
        "start": 2482,
        "end": 2493,
        "className": "syntax-variable"
      },
      {
        "start": 2493,
        "end": 2494,
        "className": "syntax-punctuation"
      },
      {
        "start": 2494,
        "end": 2512,
        "className": "syntax-property"
      },
      {
        "start": 2513,
        "end": 2516,
        "className": "syntax-operator"
      },
      {
        "start": 2517,
        "end": 2535,
        "className": "syntax-type"
      },
      {
        "start": 2535,
        "end": 2536,
        "className": "syntax-punctuation"
      },
      {
        "start": 2536,
        "end": 2547,
        "className": "syntax-property"
      },
      {
        "start": 2548,
        "end": 2550,
        "className": "syntax-operator"
      },
      {
        "start": 2551,
        "end": 2552,
        "className": "syntax-operator"
      },
      {
        "start": 2552,
        "end": 2566,
        "className": "syntax-function"
      },
      {
        "start": 2566,
        "end": 2567,
        "className": "syntax-punctuation"
      },
      {
        "start": 2567,
        "end": 2576,
        "className": "syntax-variable"
      },
      {
        "start": 2576,
        "end": 2577,
        "className": "syntax-punctuation"
      },
      {
        "start": 2600,
        "end": 2609,
        "className": "syntax-variable"
      },
      {
        "start": 2632,
        "end": 2641,
        "className": "syntax-constant"
      },
      {
        "start": 2641,
        "end": 2642,
        "className": "syntax-punctuation"
      },
      {
        "start": 2655,
        "end": 2657,
        "className": "syntax-punctuation"
      },
      {
        "start": 2666,
        "end": 2669,
        "className": "syntax-punctuation"
      },
      {
        "start": 2674,
        "end": 2676,
        "className": "syntax-keyword"
      },
      {
        "start": 2677,
        "end": 2678,
        "className": "syntax-punctuation"
      },
      {
        "start": 2678,
        "end": 2695,
        "className": "syntax-variable"
      },
      {
        "start": 2695,
        "end": 2696,
        "className": "syntax-punctuation"
      },
      {
        "start": 2697,
        "end": 2698,
        "className": "syntax-punctuation"
      },
      {
        "start": 2707,
        "end": 2713,
        "className": "syntax-keyword"
      },
      {
        "start": 2714,
        "end": 2715,
        "className": "syntax-punctuation"
      },
      {
        "start": 2716,
        "end": 2720,
        "className": "syntax-property"
      },
      {
        "start": 2722,
        "end": 2731,
        "className": "syntax-constant"
      },
      {
        "start": 2731,
        "end": 2732,
        "className": "syntax-punctuation"
      },
      {
        "start": 2733,
        "end": 2749,
        "className": "syntax-property"
      },
      {
        "start": 2751,
        "end": 2752,
        "className": "syntax-punctuation"
      },
      {
        "start": 2752,
        "end": 2769,
        "className": "syntax-variable"
      },
      {
        "start": 2769,
        "end": 2771,
        "className": "syntax-punctuation"
      },
      {
        "start": 2772,
        "end": 2792,
        "className": "syntax-property"
      },
      {
        "start": 2794,
        "end": 2798,
        "className": "syntax-constant"
      },
      {
        "start": 2799,
        "end": 2801,
        "className": "syntax-punctuation"
      },
      {
        "start": 2806,
        "end": 2807,
        "className": "syntax-punctuation"
      },
      {
        "start": 2813,
        "end": 2818,
        "className": "syntax-keyword"
      },
      {
        "start": 2819,
        "end": 2846,
        "className": "syntax-variable"
      },
      {
        "start": 2847,
        "end": 2848,
        "className": "syntax-operator"
      },
      {
        "start": 2849,
        "end": 2853,
        "className": "syntax-function"
      },
      {
        "start": 2853,
        "end": 2854,
        "className": "syntax-punctuation"
      },
      {
        "start": 2854,
        "end": 2865,
        "className": "syntax-variable"
      },
      {
        "start": 2865,
        "end": 2866,
        "className": "syntax-punctuation"
      },
      {
        "start": 2867,
        "end": 2868,
        "className": "syntax-variable"
      },
      {
        "start": 2869,
        "end": 2871,
        "className": "syntax-operator"
      },
      {
        "start": 2872,
        "end": 2873,
        "className": "syntax-variable"
      },
      {
        "start": 2873,
        "end": 2874,
        "className": "syntax-punctuation"
      },
      {
        "start": 2874,
        "end": 2889,
        "className": "syntax-property"
      },
      {
        "start": 2889,
        "end": 2891,
        "className": "syntax-punctuation"
      },
      {
        "start": 2897,
        "end": 2926,
        "className": "syntax-comment"
      },
      {
        "start": 2931,
        "end": 3059,
        "className": "syntax-comment"
      },
      {
        "start": 3064,
        "end": 3120,
        "className": "syntax-comment"
      },
      {
        "start": 3125,
        "end": 3229,
        "className": "syntax-comment"
      },
      {
        "start": 3234,
        "end": 3256,
        "className": "syntax-comment"
      },
      {
        "start": 3261,
        "end": 3264,
        "className": "syntax-keyword"
      },
      {
        "start": 3265,
        "end": 3286,
        "className": "syntax-variable"
      },
      {
        "start": 3288,
        "end": 3294,
        "className": "syntax-type"
      },
      {
        "start": 3294,
        "end": 3296,
        "className": "syntax-punctuation"
      },
      {
        "start": 3297,
        "end": 3298,
        "className": "syntax-operator"
      },
      {
        "start": 3299,
        "end": 3308,
        "className": "syntax-constant"
      },
      {
        "start": 3308,
        "end": 3309,
        "className": "syntax-punctuation"
      },
      {
        "start": 3314,
        "end": 3317,
        "className": "syntax-keyword"
      },
      {
        "start": 3318,
        "end": 3333,
        "className": "syntax-variable"
      },
      {
        "start": 3335,
        "end": 3341,
        "className": "syntax-type"
      },
      {
        "start": 3341,
        "end": 3343,
        "className": "syntax-punctuation"
      },
      {
        "start": 3344,
        "end": 3345,
        "className": "syntax-operator"
      },
      {
        "start": 3346,
        "end": 3355,
        "className": "syntax-constant"
      },
      {
        "start": 3355,
        "end": 3356,
        "className": "syntax-punctuation"
      },
      {
        "start": 3361,
        "end": 3364,
        "className": "syntax-keyword"
      },
      {
        "start": 3365,
        "end": 3388,
        "className": "syntax-variable"
      },
      {
        "start": 3390,
        "end": 3396,
        "className": "syntax-type"
      },
      {
        "start": 3396,
        "end": 3398,
        "className": "syntax-punctuation"
      },
      {
        "start": 3399,
        "end": 3400,
        "className": "syntax-operator"
      },
      {
        "start": 3401,
        "end": 3410,
        "className": "syntax-constant"
      },
      {
        "start": 3410,
        "end": 3411,
        "className": "syntax-punctuation"
      },
      {
        "start": 3416,
        "end": 3419,
        "className": "syntax-keyword"
      },
      {
        "start": 3420,
        "end": 3438,
        "className": "syntax-variable"
      },
      {
        "start": 3440,
        "end": 3446,
        "className": "syntax-type"
      },
      {
        "start": 3446,
        "end": 3448,
        "className": "syntax-punctuation"
      },
      {
        "start": 3449,
        "end": 3450,
        "className": "syntax-operator"
      },
      {
        "start": 3451,
        "end": 3460,
        "className": "syntax-constant"
      },
      {
        "start": 3460,
        "end": 3461,
        "className": "syntax-punctuation"
      },
      {
        "start": 3466,
        "end": 3469,
        "className": "syntax-keyword"
      },
      {
        "start": 3470,
        "end": 3471,
        "className": "syntax-punctuation"
      },
      {
        "start": 3471,
        "end": 3476,
        "className": "syntax-keyword"
      },
      {
        "start": 3477,
        "end": 3487,
        "className": "syntax-variable"
      },
      {
        "start": 3488,
        "end": 3490,
        "className": "syntax-keyword"
      },
      {
        "start": 3491,
        "end": 3502,
        "className": "syntax-variable"
      },
      {
        "start": 3502,
        "end": 3503,
        "className": "syntax-punctuation"
      },
      {
        "start": 3504,
        "end": 3505,
        "className": "syntax-punctuation"
      },
      {
        "start": 3514,
        "end": 3519,
        "className": "syntax-keyword"
      },
      {
        "start": 3520,
        "end": 3529,
        "className": "syntax-variable"
      },
      {
        "start": 3530,
        "end": 3531,
        "className": "syntax-operator"
      },
      {
        "start": 3532,
        "end": 3542,
        "className": "syntax-variable"
      },
      {
        "start": 3542,
        "end": 3543,
        "className": "syntax-punctuation"
      },
      {
        "start": 3543,
        "end": 3558,
        "className": "syntax-property"
      }
    ]
  }
];
