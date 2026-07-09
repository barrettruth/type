export const codeSnippets = [
  {
    "language": "c",
    "name": "c/glibc_malloc_consolidate.c",
    "code": "/*\n  ------------------------- malloc_consolidate -------------------------\n\n  malloc_consolidate is a specialized version of free() that tears\n  down chunks held in fastbins.  Free itself cannot be used for this\n  purpose since, among other things, it might place chunks back onto\n  fastbins.  So, instead, we need to use a minor variant of the same\n  code.\n*/\n\nstatic void malloc_consolidate(mstate av)\n{\n  mfastbinptr*    fb;                 /* current fastbin being consolidated */\n  mfastbinptr*    maxfb;              /* last fastbin (for loop control) */\n  mchunkptr       p;                  /* current chunk being consolidated */\n  mchunkptr       nextp;              /* next chunk to consolidate */\n  mchunkptr       unsorted_bin;       /* bin header */\n  mchunkptr       first_unsorted;     /* chunk to link to */\n\n  /* These have same use as in free() */\n  mchunkptr       nextchunk;\n  INTERNAL_SIZE_T size;\n  INTERNAL_SIZE_T nextsize;\n  INTERNAL_SIZE_T prevsize;\n  int             nextinuse;\n\n  atomic_store_relaxed (&av->have_fastchunks, false);\n\n  unsorted_bin = unsorted_chunks(av);\n\n  /*\n    Remove each chunk from fast bin and consolidate it, placing it\n    then in unsorted bin. Among other reasons for doing this,\n    placing in unsorted bin avoids needing to calculate actual bins\n    until malloc is sure that chunks aren't immediately going to be\n    reused anyway.\n  */\n\n  maxfb = &fastbin (av, NFASTBINS - 1);\n  fb = &fastbin (av, 0);\n  do {\n    p = atomic_exchange_acquire (fb, NULL);\n    if (p != NULL) {\n      do {\n        {\n          if (__glibc_unlikely (misaligned_chunk (p)))\n            malloc_printerr (\"malloc_consolidate(): \"\n                             \"unaligned fastbin chunk detected\");\n\n          unsigned int idx = fastbin_index (chunksize (p));\n          if ((&fastbin (av, idx)) != fb)\n            malloc_printerr (\"malloc_consolidate(): invalid chunk size\");\n        }\n\n        check_inuse_chunk(av, p);\n        nextp = REVEAL_PTR (p->fd);\n\n        /* Slightly streamlined version of consolidation code in free() */\n        size = chunksize (p);\n        nextchunk = chunk_at_offset(p, size);\n        nextsize = chunksize(nextchunk);\n\n        if (!prev_inuse(p)) {\n          prevsize = prev_size (p);\n          size += prevsize;\n          p = chunk_at_offset(p, -((long) prevsize));\n          if (__glibc_unlikely (chunksize(p) != prevsize))\n            malloc_printerr (\"corrupted size vs. prev_size in fastbins\");\n          unlink_chunk (av, p);\n        }\n\n        if (nextchunk != av->top) {\n          nextinuse = inuse_bit_at_offset(nextchunk, nextsize);\n\n          if (!nextinuse) {\n            size += nextsize;\n            unlink_chunk (av, nextchunk);\n          } else\n            clear_inuse_bit_at_offset(nextchunk, 0);\n\n          first_unsorted = unsorted_bin->fd;\n          unsorted_bin->fd = p;\n          first_unsorted->bk = p;\n\n          if (!in_smallbin_range (size)) {\n            p->fd_nextsize = NULL;\n            p->bk_nextsize = NULL;\n          }\n\n          set_head(p, size | PREV_INUSE);\n          p->bk = unsorted_bin;\n          p->fd = first_unsorted;\n          set_foot(p, size);\n        }\n\n        else {\n          size += nextsize;\n          set_head(p, size | PREV_INUSE);\n          av->top = p;\n        }\n\n      } while ( (p = nextp) != NULL);\n\n    }\n  } while (fb++ != maxfb);\n}",
    "spans": [
      {
        "start": 0,
        "end": 2,
        "className": "syntax-comment"
      },
      {
        "start": 3,
        "end": 75,
        "className": "syntax-comment"
      },
      {
        "start": 77,
        "end": 143,
        "className": "syntax-comment"
      },
      {
        "start": 144,
        "end": 212,
        "className": "syntax-comment"
      },
      {
        "start": 213,
        "end": 281,
        "className": "syntax-comment"
      },
      {
        "start": 282,
        "end": 350,
        "className": "syntax-comment"
      },
      {
        "start": 351,
        "end": 358,
        "className": "syntax-comment"
      },
      {
        "start": 359,
        "end": 361,
        "className": "syntax-comment"
      },
      {
        "start": 363,
        "end": 369,
        "className": "syntax-keyword"
      },
      {
        "start": 370,
        "end": 374,
        "className": "syntax-type"
      },
      {
        "start": 375,
        "end": 393,
        "className": "syntax-function"
      },
      {
        "start": 394,
        "end": 400,
        "className": "syntax-type"
      },
      {
        "start": 401,
        "end": 403,
        "className": "syntax-variable"
      },
      {
        "start": 409,
        "end": 420,
        "className": "syntax-type"
      },
      {
        "start": 420,
        "end": 421,
        "className": "syntax-operator"
      },
      {
        "start": 425,
        "end": 427,
        "className": "syntax-variable"
      },
      {
        "start": 445,
        "end": 485,
        "className": "syntax-comment"
      },
      {
        "start": 488,
        "end": 499,
        "className": "syntax-type"
      },
      {
        "start": 499,
        "end": 500,
        "className": "syntax-operator"
      },
      {
        "start": 504,
        "end": 509,
        "className": "syntax-variable"
      },
      {
        "start": 524,
        "end": 561,
        "className": "syntax-comment"
      },
      {
        "start": 564,
        "end": 573,
        "className": "syntax-type"
      },
      {
        "start": 580,
        "end": 581,
        "className": "syntax-variable"
      },
      {
        "start": 600,
        "end": 638,
        "className": "syntax-comment"
      },
      {
        "start": 641,
        "end": 650,
        "className": "syntax-type"
      },
      {
        "start": 657,
        "end": 662,
        "className": "syntax-variable"
      },
      {
        "start": 677,
        "end": 708,
        "className": "syntax-comment"
      },
      {
        "start": 711,
        "end": 720,
        "className": "syntax-type"
      },
      {
        "start": 727,
        "end": 739,
        "className": "syntax-variable"
      },
      {
        "start": 747,
        "end": 763,
        "className": "syntax-comment"
      },
      {
        "start": 766,
        "end": 775,
        "className": "syntax-type"
      },
      {
        "start": 782,
        "end": 796,
        "className": "syntax-variable"
      },
      {
        "start": 802,
        "end": 824,
        "className": "syntax-comment"
      },
      {
        "start": 828,
        "end": 866,
        "className": "syntax-comment"
      },
      {
        "start": 869,
        "end": 878,
        "className": "syntax-type"
      },
      {
        "start": 885,
        "end": 894,
        "className": "syntax-variable"
      },
      {
        "start": 898,
        "end": 913,
        "className": "syntax-type"
      },
      {
        "start": 914,
        "end": 918,
        "className": "syntax-variable"
      },
      {
        "start": 922,
        "end": 937,
        "className": "syntax-type"
      },
      {
        "start": 938,
        "end": 946,
        "className": "syntax-variable"
      },
      {
        "start": 950,
        "end": 965,
        "className": "syntax-type"
      },
      {
        "start": 966,
        "end": 974,
        "className": "syntax-variable"
      },
      {
        "start": 978,
        "end": 981,
        "className": "syntax-type"
      },
      {
        "start": 994,
        "end": 1003,
        "className": "syntax-variable"
      },
      {
        "start": 1008,
        "end": 1028,
        "className": "syntax-function"
      },
      {
        "start": 1030,
        "end": 1031,
        "className": "syntax-operator"
      },
      {
        "start": 1031,
        "end": 1033,
        "className": "syntax-variable"
      },
      {
        "start": 1033,
        "end": 1035,
        "className": "syntax-operator"
      },
      {
        "start": 1035,
        "end": 1050,
        "className": "syntax-property"
      },
      {
        "start": 1063,
        "end": 1075,
        "className": "syntax-variable"
      },
      {
        "start": 1076,
        "end": 1077,
        "className": "syntax-operator"
      },
      {
        "start": 1078,
        "end": 1093,
        "className": "syntax-function"
      },
      {
        "start": 1094,
        "end": 1096,
        "className": "syntax-variable"
      },
      {
        "start": 1102,
        "end": 1104,
        "className": "syntax-comment"
      },
      {
        "start": 1105,
        "end": 1171,
        "className": "syntax-comment"
      },
      {
        "start": 1172,
        "end": 1233,
        "className": "syntax-comment"
      },
      {
        "start": 1234,
        "end": 1301,
        "className": "syntax-comment"
      },
      {
        "start": 1302,
        "end": 1369,
        "className": "syntax-comment"
      },
      {
        "start": 1370,
        "end": 1388,
        "className": "syntax-comment"
      },
      {
        "start": 1389,
        "end": 1393,
        "className": "syntax-comment"
      },
      {
        "start": 1397,
        "end": 1402,
        "className": "syntax-variable"
      },
      {
        "start": 1403,
        "end": 1404,
        "className": "syntax-operator"
      },
      {
        "start": 1405,
        "end": 1406,
        "className": "syntax-operator"
      },
      {
        "start": 1406,
        "end": 1413,
        "className": "syntax-function"
      },
      {
        "start": 1415,
        "end": 1417,
        "className": "syntax-variable"
      },
      {
        "start": 1419,
        "end": 1428,
        "className": "syntax-constant"
      },
      {
        "start": 1429,
        "end": 1430,
        "className": "syntax-operator"
      },
      {
        "start": 1431,
        "end": 1432,
        "className": "syntax-number"
      },
      {
        "start": 1437,
        "end": 1439,
        "className": "syntax-variable"
      },
      {
        "start": 1440,
        "end": 1441,
        "className": "syntax-operator"
      },
      {
        "start": 1442,
        "end": 1443,
        "className": "syntax-operator"
      },
      {
        "start": 1443,
        "end": 1450,
        "className": "syntax-function"
      },
      {
        "start": 1452,
        "end": 1454,
        "className": "syntax-variable"
      },
      {
        "start": 1456,
        "end": 1457,
        "className": "syntax-number"
      },
      {
        "start": 1462,
        "end": 1464,
        "className": "syntax-keyword"
      },
      {
        "start": 1471,
        "end": 1472,
        "className": "syntax-variable"
      },
      {
        "start": 1473,
        "end": 1474,
        "className": "syntax-operator"
      },
      {
        "start": 1475,
        "end": 1498,
        "className": "syntax-function"
      },
      {
        "start": 1500,
        "end": 1502,
        "className": "syntax-variable"
      },
      {
        "start": 1504,
        "end": 1508,
        "className": "syntax-constant"
      },
      {
        "start": 1515,
        "end": 1517,
        "className": "syntax-keyword"
      },
      {
        "start": 1519,
        "end": 1520,
        "className": "syntax-variable"
      },
      {
        "start": 1521,
        "end": 1523,
        "className": "syntax-operator"
      },
      {
        "start": 1524,
        "end": 1528,
        "className": "syntax-constant"
      },
      {
        "start": 1538,
        "end": 1540,
        "className": "syntax-keyword"
      },
      {
        "start": 1563,
        "end": 1565,
        "className": "syntax-keyword"
      },
      {
        "start": 1567,
        "end": 1583,
        "className": "syntax-function"
      },
      {
        "start": 1585,
        "end": 1601,
        "className": "syntax-function"
      },
      {
        "start": 1603,
        "end": 1604,
        "className": "syntax-variable"
      },
      {
        "start": 1620,
        "end": 1635,
        "className": "syntax-function"
      },
      {
        "start": 1637,
        "end": 1661,
        "className": "syntax-string"
      },
      {
        "start": 1691,
        "end": 1725,
        "className": "syntax-string"
      },
      {
        "start": 1739,
        "end": 1751,
        "className": "syntax-type"
      },
      {
        "start": 1752,
        "end": 1755,
        "className": "syntax-variable"
      },
      {
        "start": 1756,
        "end": 1757,
        "className": "syntax-operator"
      },
      {
        "start": 1758,
        "end": 1771,
        "className": "syntax-function"
      },
      {
        "start": 1773,
        "end": 1782,
        "className": "syntax-function"
      },
      {
        "start": 1784,
        "end": 1785,
        "className": "syntax-variable"
      },
      {
        "start": 1799,
        "end": 1801,
        "className": "syntax-keyword"
      },
      {
        "start": 1804,
        "end": 1805,
        "className": "syntax-operator"
      },
      {
        "start": 1805,
        "end": 1812,
        "className": "syntax-function"
      },
      {
        "start": 1814,
        "end": 1816,
        "className": "syntax-variable"
      },
      {
        "start": 1818,
        "end": 1821,
        "className": "syntax-variable"
      },
      {
        "start": 1824,
        "end": 1826,
        "className": "syntax-operator"
      },
      {
        "start": 1827,
        "end": 1829,
        "className": "syntax-variable"
      },
      {
        "start": 1843,
        "end": 1858,
        "className": "syntax-function"
      },
      {
        "start": 1860,
        "end": 1902,
        "className": "syntax-string"
      },
      {
        "start": 1924,
        "end": 1941,
        "className": "syntax-function"
      },
      {
        "start": 1942,
        "end": 1944,
        "className": "syntax-variable"
      },
      {
        "start": 1946,
        "end": 1947,
        "className": "syntax-variable"
      },
      {
        "start": 1958,
        "end": 1963,
        "className": "syntax-variable"
      },
      {
        "start": 1964,
        "end": 1965,
        "className": "syntax-operator"
      },
      {
        "start": 1966,
        "end": 1976,
        "className": "syntax-function"
      },
      {
        "start": 1978,
        "end": 1979,
        "className": "syntax-variable"
      },
      {
        "start": 1979,
        "end": 1981,
        "className": "syntax-operator"
      },
      {
        "start": 1981,
        "end": 1983,
        "className": "syntax-property"
      },
      {
        "start": 1995,
        "end": 2061,
        "className": "syntax-comment"
      },
      {
        "start": 2070,
        "end": 2074,
        "className": "syntax-variable"
      },
      {
        "start": 2075,
        "end": 2076,
        "className": "syntax-operator"
      },
      {
        "start": 2077,
        "end": 2086,
        "className": "syntax-function"
      },
      {
        "start": 2088,
        "end": 2089,
        "className": "syntax-variable"
      },
      {
        "start": 2100,
        "end": 2109,
        "className": "syntax-variable"
      },
      {
        "start": 2110,
        "end": 2111,
        "className": "syntax-operator"
      },
      {
        "start": 2112,
        "end": 2127,
        "className": "syntax-function"
      },
      {
        "start": 2128,
        "end": 2129,
        "className": "syntax-variable"
      },
      {
        "start": 2131,
        "end": 2135,
        "className": "syntax-variable"
      },
      {
        "start": 2146,
        "end": 2154,
        "className": "syntax-variable"
      },
      {
        "start": 2155,
        "end": 2156,
        "className": "syntax-operator"
      },
      {
        "start": 2157,
        "end": 2166,
        "className": "syntax-function"
      },
      {
        "start": 2167,
        "end": 2176,
        "className": "syntax-variable"
      },
      {
        "start": 2188,
        "end": 2190,
        "className": "syntax-keyword"
      },
      {
        "start": 2193,
        "end": 2203,
        "className": "syntax-function"
      },
      {
        "start": 2204,
        "end": 2205,
        "className": "syntax-variable"
      },
      {
        "start": 2220,
        "end": 2228,
        "className": "syntax-variable"
      },
      {
        "start": 2229,
        "end": 2230,
        "className": "syntax-operator"
      },
      {
        "start": 2231,
        "end": 2240,
        "className": "syntax-function"
      },
      {
        "start": 2242,
        "end": 2243,
        "className": "syntax-variable"
      },
      {
        "start": 2256,
        "end": 2260,
        "className": "syntax-variable"
      },
      {
        "start": 2261,
        "end": 2263,
        "className": "syntax-operator"
      },
      {
        "start": 2264,
        "end": 2272,
        "className": "syntax-variable"
      },
      {
        "start": 2284,
        "end": 2285,
        "className": "syntax-variable"
      },
      {
        "start": 2286,
        "end": 2287,
        "className": "syntax-operator"
      },
      {
        "start": 2288,
        "end": 2303,
        "className": "syntax-function"
      },
      {
        "start": 2304,
        "end": 2305,
        "className": "syntax-variable"
      },
      {
        "start": 2307,
        "end": 2308,
        "className": "syntax-operator"
      },
      {
        "start": 2310,
        "end": 2314,
        "className": "syntax-type"
      },
      {
        "start": 2316,
        "end": 2324,
        "className": "syntax-variable"
      },
      {
        "start": 2338,
        "end": 2340,
        "className": "syntax-keyword"
      },
      {
        "start": 2342,
        "end": 2358,
        "className": "syntax-function"
      },
      {
        "start": 2360,
        "end": 2369,
        "className": "syntax-function"
      },
      {
        "start": 2370,
        "end": 2371,
        "className": "syntax-variable"
      },
      {
        "start": 2373,
        "end": 2375,
        "className": "syntax-operator"
      },
      {
        "start": 2376,
        "end": 2384,
        "className": "syntax-variable"
      },
      {
        "start": 2399,
        "end": 2414,
        "className": "syntax-function"
      },
      {
        "start": 2416,
        "end": 2458,
        "className": "syntax-string"
      },
      {
        "start": 2471,
        "end": 2483,
        "className": "syntax-function"
      },
      {
        "start": 2485,
        "end": 2487,
        "className": "syntax-variable"
      },
      {
        "start": 2489,
        "end": 2490,
        "className": "syntax-variable"
      },
      {
        "start": 2512,
        "end": 2514,
        "className": "syntax-keyword"
      },
      {
        "start": 2516,
        "end": 2525,
        "className": "syntax-variable"
      },
      {
        "start": 2526,
        "end": 2528,
        "className": "syntax-operator"
      },
      {
        "start": 2529,
        "end": 2531,
        "className": "syntax-variable"
      },
      {
        "start": 2531,
        "end": 2533,
        "className": "syntax-operator"
      },
      {
        "start": 2533,
        "end": 2536,
        "className": "syntax-property"
      },
      {
        "start": 2550,
        "end": 2559,
        "className": "syntax-variable"
      },
      {
        "start": 2560,
        "end": 2561,
        "className": "syntax-operator"
      },
      {
        "start": 2562,
        "end": 2581,
        "className": "syntax-function"
      },
      {
        "start": 2582,
        "end": 2591,
        "className": "syntax-variable"
      },
      {
        "start": 2593,
        "end": 2601,
        "className": "syntax-variable"
      },
      {
        "start": 2615,
        "end": 2617,
        "className": "syntax-keyword"
      },
      {
        "start": 2620,
        "end": 2629,
        "className": "syntax-variable"
      },
      {
        "start": 2645,
        "end": 2649,
        "className": "syntax-variable"
      },
      {
        "start": 2650,
        "end": 2652,
        "className": "syntax-operator"
      },
      {
        "start": 2653,
        "end": 2661,
        "className": "syntax-variable"
      },
      {
        "start": 2675,
        "end": 2687,
        "className": "syntax-function"
      },
      {
        "start": 2689,
        "end": 2691,
        "className": "syntax-variable"
      },
      {
        "start": 2693,
        "end": 2702,
        "className": "syntax-variable"
      },
      {
        "start": 2717,
        "end": 2721,
        "className": "syntax-keyword"
      },
      {
        "start": 2734,
        "end": 2759,
        "className": "syntax-function"
      },
      {
        "start": 2760,
        "end": 2769,
        "className": "syntax-variable"
      },
      {
        "start": 2771,
        "end": 2772,
        "className": "syntax-number"
      },
      {
        "start": 2786,
        "end": 2800,
        "className": "syntax-variable"
      },
      {
        "start": 2801,
        "end": 2802,
        "className": "syntax-operator"
      },
      {
        "start": 2803,
        "end": 2815,
        "className": "syntax-variable"
      },
      {
        "start": 2815,
        "end": 2817,
        "className": "syntax-operator"
      },
      {
        "start": 2817,
        "end": 2819,
        "className": "syntax-property"
      },
      {
        "start": 2831,
        "end": 2843,
        "className": "syntax-variable"
      },
      {
        "start": 2843,
        "end": 2845,
        "className": "syntax-operator"
      },
      {
        "start": 2845,
        "end": 2847,
        "className": "syntax-property"
      },
      {
        "start": 2848,
        "end": 2849,
        "className": "syntax-operator"
      },
      {
        "start": 2850,
        "end": 2851,
        "className": "syntax-variable"
      },
      {
        "start": 2863,
        "end": 2877,
        "className": "syntax-variable"
      },
      {
        "start": 2877,
        "end": 2879,
        "className": "syntax-operator"
      },
      {
        "start": 2879,
        "end": 2881,
        "className": "syntax-property"
      },
      {
        "start": 2882,
        "end": 2883,
        "className": "syntax-operator"
      },
      {
        "start": 2884,
        "end": 2885,
        "className": "syntax-variable"
      },
      {
        "start": 2898,
        "end": 2900,
        "className": "syntax-keyword"
      },
      {
        "start": 2903,
        "end": 2920,
        "className": "syntax-function"
      },
      {
        "start": 2922,
        "end": 2926,
        "className": "syntax-variable"
      },
      {
        "start": 2943,
        "end": 2944,
        "className": "syntax-variable"
      },
      {
        "start": 2944,
        "end": 2946,
        "className": "syntax-operator"
      },
      {
        "start": 2946,
        "end": 2957,
        "className": "syntax-property"
      },
      {
        "start": 2958,
        "end": 2959,
        "className": "syntax-operator"
      },
      {
        "start": 2960,
        "end": 2964,
        "className": "syntax-constant"
      },
      {
        "start": 2978,
        "end": 2979,
        "className": "syntax-variable"
      },
      {
        "start": 2979,
        "end": 2981,
        "className": "syntax-operator"
      },
      {
        "start": 2981,
        "end": 2992,
        "className": "syntax-property"
      },
      {
        "start": 2993,
        "end": 2994,
        "className": "syntax-operator"
      },
      {
        "start": 2995,
        "end": 2999,
        "className": "syntax-constant"
      },
      {
        "start": 3024,
        "end": 3032,
        "className": "syntax-function"
      },
      {
        "start": 3033,
        "end": 3034,
        "className": "syntax-variable"
      },
      {
        "start": 3036,
        "end": 3040,
        "className": "syntax-variable"
      },
      {
        "start": 3043,
        "end": 3053,
        "className": "syntax-constant"
      },
      {
        "start": 3066,
        "end": 3067,
        "className": "syntax-variable"
      },
      {
        "start": 3067,
        "end": 3069,
        "className": "syntax-operator"
      },
      {
        "start": 3069,
        "end": 3071,
        "className": "syntax-property"
      },
      {
        "start": 3072,
        "end": 3073,
        "className": "syntax-operator"
      },
      {
        "start": 3074,
        "end": 3086,
        "className": "syntax-variable"
      },
      {
        "start": 3098,
        "end": 3099,
        "className": "syntax-variable"
      },
      {
        "start": 3099,
        "end": 3101,
        "className": "syntax-operator"
      },
      {
        "start": 3101,
        "end": 3103,
        "className": "syntax-property"
      },
      {
        "start": 3104,
        "end": 3105,
        "className": "syntax-operator"
      },
      {
        "start": 3106,
        "end": 3120,
        "className": "syntax-variable"
      },
      {
        "start": 3132,
        "end": 3140,
        "className": "syntax-function"
      },
      {
        "start": 3141,
        "end": 3142,
        "className": "syntax-variable"
      },
      {
        "start": 3144,
        "end": 3148,
        "className": "syntax-variable"
      },
      {
        "start": 3170,
        "end": 3174,
        "className": "syntax-keyword"
      },
      {
        "start": 3187,
        "end": 3191,
        "className": "syntax-variable"
      },
      {
        "start": 3192,
        "end": 3194,
        "className": "syntax-operator"
      },
      {
        "start": 3195,
        "end": 3203,
        "className": "syntax-variable"
      },
      {
        "start": 3215,
        "end": 3223,
        "className": "syntax-function"
      },
      {
        "start": 3224,
        "end": 3225,
        "className": "syntax-variable"
      },
      {
        "start": 3227,
        "end": 3231,
        "className": "syntax-variable"
      },
      {
        "start": 3234,
        "end": 3244,
        "className": "syntax-constant"
      },
      {
        "start": 3257,
        "end": 3259,
        "className": "syntax-variable"
      },
      {
        "start": 3259,
        "end": 3261,
        "className": "syntax-operator"
      },
      {
        "start": 3261,
        "end": 3264,
        "className": "syntax-property"
      },
      {
        "start": 3265,
        "end": 3266,
        "className": "syntax-operator"
      },
      {
        "start": 3267,
        "end": 3268,
        "className": "syntax-variable"
      },
      {
        "start": 3289,
        "end": 3294,
        "className": "syntax-keyword"
      },
      {
        "start": 3298,
        "end": 3299,
        "className": "syntax-variable"
      },
      {
        "start": 3300,
        "end": 3301,
        "className": "syntax-operator"
      },
      {
        "start": 3302,
        "end": 3307,
        "className": "syntax-variable"
      },
      {
        "start": 3309,
        "end": 3311,
        "className": "syntax-operator"
      },
      {
        "start": 3312,
        "end": 3316,
        "className": "syntax-constant"
      },
      {
        "start": 3330,
        "end": 3335,
        "className": "syntax-keyword"
      },
      {
        "start": 3337,
        "end": 3339,
        "className": "syntax-variable"
      },
      {
        "start": 3339,
        "end": 3341,
        "className": "syntax-operator"
      },
      {
        "start": 3342,
        "end": 3344,
        "className": "syntax-operator"
      },
      {
        "start": 3345,
        "end": 3350,
        "className": "syntax-variable"
      }
    ]
  },
  {
    "language": "c",
    "name": "c/glibc_memmem.c",
    "code": "/* Fast memmem algorithm with guaranteed linear-time performance.\n   Small needles up to size 2 use a dedicated linear search.  Longer needles\n   up to size 256 use a novel modified Horspool algorithm.  It hashes pairs\n   of characters to quickly skip past mismatches.  The main search loop only\n   exits if the last 2 characters match, avoiding unnecessary calls to memcmp\n   and allowing for a larger skip if there is no match.  A self-adapting\n   filtering check is used to quickly detect mismatches in long needles.\n   By limiting the needle length to 256, the shift table can be reduced to 8\n   bits per entry, lowering preprocessing overhead and minimizing cache effects.\n   The limit also implies worst-case performance is linear.\n   Needles larger than 256 characters use the linear-time Two-Way algorithm.  */\nvoid *\n__memmem (const void *haystack, size_t hs_len,\n          const void *needle, size_t ne_len)\n{\n  const unsigned char *hs = (const unsigned char *) haystack;\n  const unsigned char *ne = (const unsigned char *) needle;\n\n  if (ne_len == 0)\n    return (void *) hs;\n  if (ne_len == 1)\n    return (void *) memchr (hs, ne[0], hs_len);\n\n  /* Ensure haystack length is >= needle length.  */\n  if (hs_len < ne_len)\n    return NULL;\n\n  const unsigned char *end = hs + hs_len - ne_len;\n\n  if (ne_len == 2)\n    {\n      uint32_t nw = ne[0] << 16 | ne[1], hw = hs[0] << 16 | hs[1];\n      for (hs++; hs <= end && hw != nw; )\n        hw = hw << 16 | *++hs;\n      return hw == nw ? (void *)hs - 1 : NULL;\n    }\n\n  /* Use Two-Way algorithm for very long needles.  */\n  if (__builtin_expect (ne_len > 256, 0))\n    return two_way_long_needle (hs, hs_len, ne, ne_len);\n\n  uint8_t shift[256];\n  size_t tmp, shift1;\n  size_t m1 = ne_len - 1;\n  size_t offset = 0;\n\n  memset (shift, 0, sizeof (shift));\n  for (int i = 1; i < m1; i++)\n    shift[hash2 (ne + i)] = i;\n  /* Shift1 is the amount we can skip after matching the hash of the\n     needle end but not the full needle.  */\n  shift1 = m1 - shift[hash2 (ne + m1)];\n  shift[hash2 (ne + m1)] = m1;\n\n  for ( ; hs <= end; )\n    {\n      /* Skip past character pairs not in the needle.  */\n      do\n        {\n          hs += m1;\n          tmp = shift[hash2 (hs)];\n        }\n      while (tmp == 0 && hs <= end);\n\n      /* If the match is not at the end of the needle, shift to the end\n         and continue until we match the hash of the needle end.  */\n      hs -= tmp;\n      if (tmp < m1)\n        continue;\n\n      /* Hash of the last 2 characters matches.  If the needle is long,\n         try to quickly filter out mismatches.  */\n      if (m1 < 15 || memcmp (hs + offset, ne + offset, 8) == 0)\n        {\n          if (memcmp (hs, ne, m1) == 0)\n            return (void *) hs;\n\n          /* Adjust filter offset when it doesn't find the mismatch.  */\n          offset = (offset >= 8 ? offset : m1) - 8;\n        }\n\n      /* Skip based on matching the hash of the needle end.  */\n      hs += shift1;\n    }\n  return NULL;\n}\nlibc_hidden_def (__memmem)\nweak_alias (__memmem, memmem)",
    "spans": [
      {
        "start": 0,
        "end": 65,
        "className": "syntax-comment"
      },
      {
        "start": 66,
        "end": 142,
        "className": "syntax-comment"
      },
      {
        "start": 143,
        "end": 218,
        "className": "syntax-comment"
      },
      {
        "start": 219,
        "end": 295,
        "className": "syntax-comment"
      },
      {
        "start": 296,
        "end": 373,
        "className": "syntax-comment"
      },
      {
        "start": 374,
        "end": 446,
        "className": "syntax-comment"
      },
      {
        "start": 447,
        "end": 519,
        "className": "syntax-comment"
      },
      {
        "start": 520,
        "end": 596,
        "className": "syntax-comment"
      },
      {
        "start": 597,
        "end": 677,
        "className": "syntax-comment"
      },
      {
        "start": 678,
        "end": 737,
        "className": "syntax-comment"
      },
      {
        "start": 738,
        "end": 818,
        "className": "syntax-comment"
      },
      {
        "start": 819,
        "end": 823,
        "className": "syntax-type"
      },
      {
        "start": 824,
        "end": 825,
        "className": "syntax-operator"
      },
      {
        "start": 826,
        "end": 834,
        "className": "syntax-function"
      },
      {
        "start": 836,
        "end": 841,
        "className": "syntax-keyword"
      },
      {
        "start": 842,
        "end": 846,
        "className": "syntax-type"
      },
      {
        "start": 847,
        "end": 848,
        "className": "syntax-operator"
      },
      {
        "start": 848,
        "end": 856,
        "className": "syntax-variable"
      },
      {
        "start": 858,
        "end": 864,
        "className": "syntax-type"
      },
      {
        "start": 865,
        "end": 871,
        "className": "syntax-variable"
      },
      {
        "start": 883,
        "end": 888,
        "className": "syntax-keyword"
      },
      {
        "start": 889,
        "end": 893,
        "className": "syntax-type"
      },
      {
        "start": 894,
        "end": 895,
        "className": "syntax-operator"
      },
      {
        "start": 895,
        "end": 901,
        "className": "syntax-variable"
      },
      {
        "start": 903,
        "end": 909,
        "className": "syntax-type"
      },
      {
        "start": 910,
        "end": 916,
        "className": "syntax-variable"
      },
      {
        "start": 922,
        "end": 927,
        "className": "syntax-keyword"
      },
      {
        "start": 928,
        "end": 941,
        "className": "syntax-type"
      },
      {
        "start": 942,
        "end": 943,
        "className": "syntax-operator"
      },
      {
        "start": 943,
        "end": 945,
        "className": "syntax-variable"
      },
      {
        "start": 946,
        "end": 947,
        "className": "syntax-operator"
      },
      {
        "start": 949,
        "end": 954,
        "className": "syntax-keyword"
      },
      {
        "start": 955,
        "end": 968,
        "className": "syntax-type"
      },
      {
        "start": 969,
        "end": 970,
        "className": "syntax-operator"
      },
      {
        "start": 972,
        "end": 980,
        "className": "syntax-variable"
      },
      {
        "start": 984,
        "end": 989,
        "className": "syntax-keyword"
      },
      {
        "start": 990,
        "end": 1003,
        "className": "syntax-type"
      },
      {
        "start": 1004,
        "end": 1005,
        "className": "syntax-operator"
      },
      {
        "start": 1005,
        "end": 1007,
        "className": "syntax-variable"
      },
      {
        "start": 1008,
        "end": 1009,
        "className": "syntax-operator"
      },
      {
        "start": 1011,
        "end": 1016,
        "className": "syntax-keyword"
      },
      {
        "start": 1017,
        "end": 1030,
        "className": "syntax-type"
      },
      {
        "start": 1031,
        "end": 1032,
        "className": "syntax-operator"
      },
      {
        "start": 1034,
        "end": 1040,
        "className": "syntax-variable"
      },
      {
        "start": 1045,
        "end": 1047,
        "className": "syntax-keyword"
      },
      {
        "start": 1049,
        "end": 1055,
        "className": "syntax-variable"
      },
      {
        "start": 1056,
        "end": 1058,
        "className": "syntax-operator"
      },
      {
        "start": 1059,
        "end": 1060,
        "className": "syntax-number"
      },
      {
        "start": 1066,
        "end": 1072,
        "className": "syntax-keyword"
      },
      {
        "start": 1074,
        "end": 1078,
        "className": "syntax-type"
      },
      {
        "start": 1079,
        "end": 1080,
        "className": "syntax-operator"
      },
      {
        "start": 1082,
        "end": 1084,
        "className": "syntax-variable"
      },
      {
        "start": 1088,
        "end": 1090,
        "className": "syntax-keyword"
      },
      {
        "start": 1092,
        "end": 1098,
        "className": "syntax-variable"
      },
      {
        "start": 1099,
        "end": 1101,
        "className": "syntax-operator"
      },
      {
        "start": 1102,
        "end": 1103,
        "className": "syntax-number"
      },
      {
        "start": 1109,
        "end": 1115,
        "className": "syntax-keyword"
      },
      {
        "start": 1117,
        "end": 1121,
        "className": "syntax-type"
      },
      {
        "start": 1122,
        "end": 1123,
        "className": "syntax-operator"
      },
      {
        "start": 1125,
        "end": 1131,
        "className": "syntax-function"
      },
      {
        "start": 1133,
        "end": 1135,
        "className": "syntax-variable"
      },
      {
        "start": 1137,
        "end": 1139,
        "className": "syntax-variable"
      },
      {
        "start": 1140,
        "end": 1141,
        "className": "syntax-number"
      },
      {
        "start": 1144,
        "end": 1150,
        "className": "syntax-variable"
      },
      {
        "start": 1156,
        "end": 1206,
        "className": "syntax-comment"
      },
      {
        "start": 1209,
        "end": 1211,
        "className": "syntax-keyword"
      },
      {
        "start": 1213,
        "end": 1219,
        "className": "syntax-variable"
      },
      {
        "start": 1220,
        "end": 1221,
        "className": "syntax-operator"
      },
      {
        "start": 1222,
        "end": 1228,
        "className": "syntax-variable"
      },
      {
        "start": 1234,
        "end": 1240,
        "className": "syntax-keyword"
      },
      {
        "start": 1241,
        "end": 1245,
        "className": "syntax-constant"
      },
      {
        "start": 1250,
        "end": 1255,
        "className": "syntax-keyword"
      },
      {
        "start": 1256,
        "end": 1269,
        "className": "syntax-type"
      },
      {
        "start": 1270,
        "end": 1271,
        "className": "syntax-operator"
      },
      {
        "start": 1271,
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
        "end": 1279,
        "className": "syntax-variable"
      },
      {
        "start": 1280,
        "end": 1281,
        "className": "syntax-operator"
      },
      {
        "start": 1282,
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
        "end": 1297,
        "className": "syntax-variable"
      },
      {
        "start": 1302,
        "end": 1304,
        "className": "syntax-keyword"
      },
      {
        "start": 1306,
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
        "end": 1317,
        "className": "syntax-number"
      },
      {
        "start": 1331,
        "end": 1339,
        "className": "syntax-type"
      },
      {
        "start": 1340,
        "end": 1342,
        "className": "syntax-variable"
      },
      {
        "start": 1343,
        "end": 1344,
        "className": "syntax-operator"
      },
      {
        "start": 1345,
        "end": 1347,
        "className": "syntax-variable"
      },
      {
        "start": 1348,
        "end": 1349,
        "className": "syntax-number"
      },
      {
        "start": 1354,
        "end": 1356,
        "className": "syntax-number"
      },
      {
        "start": 1359,
        "end": 1361,
        "className": "syntax-variable"
      },
      {
        "start": 1362,
        "end": 1363,
        "className": "syntax-number"
      },
      {
        "start": 1366,
        "end": 1368,
        "className": "syntax-variable"
      },
      {
        "start": 1369,
        "end": 1370,
        "className": "syntax-operator"
      },
      {
        "start": 1371,
        "end": 1373,
        "className": "syntax-variable"
      },
      {
        "start": 1374,
        "end": 1375,
        "className": "syntax-number"
      },
      {
        "start": 1380,
        "end": 1382,
        "className": "syntax-number"
      },
      {
        "start": 1385,
        "end": 1387,
        "className": "syntax-variable"
      },
      {
        "start": 1388,
        "end": 1389,
        "className": "syntax-number"
      },
      {
        "start": 1398,
        "end": 1401,
        "className": "syntax-keyword"
      },
      {
        "start": 1403,
        "end": 1405,
        "className": "syntax-variable"
      },
      {
        "start": 1405,
        "end": 1407,
        "className": "syntax-operator"
      },
      {
        "start": 1409,
        "end": 1411,
        "className": "syntax-variable"
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
        "end": 1424,
        "className": "syntax-variable"
      },
      {
        "start": 1425,
        "end": 1427,
        "className": "syntax-operator"
      },
      {
        "start": 1428,
        "end": 1430,
        "className": "syntax-variable"
      },
      {
        "start": 1442,
        "end": 1444,
        "className": "syntax-variable"
      },
      {
        "start": 1445,
        "end": 1446,
        "className": "syntax-operator"
      },
      {
        "start": 1447,
        "end": 1449,
        "className": "syntax-variable"
      },
      {
        "start": 1453,
        "end": 1455,
        "className": "syntax-number"
      },
      {
        "start": 1458,
        "end": 1461,
        "className": "syntax-operator"
      },
      {
        "start": 1461,
        "end": 1463,
        "className": "syntax-variable"
      },
      {
        "start": 1471,
        "end": 1477,
        "className": "syntax-keyword"
      },
      {
        "start": 1478,
        "end": 1480,
        "className": "syntax-variable"
      },
      {
        "start": 1481,
        "end": 1483,
        "className": "syntax-operator"
      },
      {
        "start": 1484,
        "end": 1486,
        "className": "syntax-variable"
      },
      {
        "start": 1490,
        "end": 1494,
        "className": "syntax-type"
      },
      {
        "start": 1495,
        "end": 1496,
        "className": "syntax-operator"
      },
      {
        "start": 1497,
        "end": 1499,
        "className": "syntax-variable"
      },
      {
        "start": 1500,
        "end": 1501,
        "className": "syntax-operator"
      },
      {
        "start": 1502,
        "end": 1503,
        "className": "syntax-number"
      },
      {
        "start": 1506,
        "end": 1510,
        "className": "syntax-constant"
      },
      {
        "start": 1521,
        "end": 1572,
        "className": "syntax-comment"
      },
      {
        "start": 1575,
        "end": 1577,
        "className": "syntax-keyword"
      },
      {
        "start": 1579,
        "end": 1595,
        "className": "syntax-function"
      },
      {
        "start": 1597,
        "end": 1603,
        "className": "syntax-variable"
      },
      {
        "start": 1604,
        "end": 1605,
        "className": "syntax-operator"
      },
      {
        "start": 1606,
        "end": 1609,
        "className": "syntax-number"
      },
      {
        "start": 1611,
        "end": 1612,
        "className": "syntax-number"
      },
      {
        "start": 1619,
        "end": 1625,
        "className": "syntax-keyword"
      },
      {
        "start": 1626,
        "end": 1645,
        "className": "syntax-function"
      },
      {
        "start": 1647,
        "end": 1649,
        "className": "syntax-variable"
      },
      {
        "start": 1651,
        "end": 1657,
        "className": "syntax-variable"
      },
      {
        "start": 1659,
        "end": 1661,
        "className": "syntax-variable"
      },
      {
        "start": 1663,
        "end": 1669,
        "className": "syntax-variable"
      },
      {
        "start": 1675,
        "end": 1682,
        "className": "syntax-type"
      },
      {
        "start": 1683,
        "end": 1688,
        "className": "syntax-variable"
      },
      {
        "start": 1689,
        "end": 1692,
        "className": "syntax-number"
      },
      {
        "start": 1697,
        "end": 1703,
        "className": "syntax-type"
      },
      {
        "start": 1704,
        "end": 1707,
        "className": "syntax-variable"
      },
      {
        "start": 1709,
        "end": 1715,
        "className": "syntax-variable"
      },
      {
        "start": 1719,
        "end": 1725,
        "className": "syntax-type"
      },
      {
        "start": 1726,
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
        "end": 1737,
        "className": "syntax-variable"
      },
      {
        "start": 1738,
        "end": 1739,
        "className": "syntax-operator"
      },
      {
        "start": 1740,
        "end": 1741,
        "className": "syntax-number"
      },
      {
        "start": 1745,
        "end": 1751,
        "className": "syntax-type"
      },
      {
        "start": 1752,
        "end": 1758,
        "className": "syntax-variable"
      },
      {
        "start": 1759,
        "end": 1760,
        "className": "syntax-operator"
      },
      {
        "start": 1761,
        "end": 1762,
        "className": "syntax-number"
      },
      {
        "start": 1767,
        "end": 1773,
        "className": "syntax-function"
      },
      {
        "start": 1775,
        "end": 1780,
        "className": "syntax-variable"
      },
      {
        "start": 1782,
        "end": 1783,
        "className": "syntax-number"
      },
      {
        "start": 1785,
        "end": 1791,
        "className": "syntax-keyword"
      },
      {
        "start": 1793,
        "end": 1798,
        "className": "syntax-variable"
      },
      {
        "start": 1804,
        "end": 1807,
        "className": "syntax-keyword"
      },
      {
        "start": 1809,
        "end": 1812,
        "className": "syntax-type"
      },
      {
        "start": 1813,
        "end": 1814,
        "className": "syntax-variable"
      },
      {
        "start": 1815,
        "end": 1816,
        "className": "syntax-operator"
      },
      {
        "start": 1817,
        "end": 1818,
        "className": "syntax-number"
      },
      {
        "start": 1820,
        "end": 1821,
        "className": "syntax-variable"
      },
      {
        "start": 1822,
        "end": 1823,
        "className": "syntax-operator"
      },
      {
        "start": 1824,
        "end": 1826,
        "className": "syntax-variable"
      },
      {
        "start": 1828,
        "end": 1829,
        "className": "syntax-variable"
      },
      {
        "start": 1829,
        "end": 1831,
        "className": "syntax-operator"
      },
      {
        "start": 1837,
        "end": 1842,
        "className": "syntax-variable"
      },
      {
        "start": 1843,
        "end": 1848,
        "className": "syntax-function"
      },
      {
        "start": 1850,
        "end": 1852,
        "className": "syntax-variable"
      },
      {
        "start": 1853,
        "end": 1854,
        "className": "syntax-operator"
      },
      {
        "start": 1855,
        "end": 1856,
        "className": "syntax-variable"
      },
      {
        "start": 1859,
        "end": 1860,
        "className": "syntax-operator"
      },
      {
        "start": 1861,
        "end": 1862,
        "className": "syntax-variable"
      },
      {
        "start": 1866,
        "end": 1932,
        "className": "syntax-comment"
      },
      {
        "start": 1933,
        "end": 1977,
        "className": "syntax-comment"
      },
      {
        "start": 1980,
        "end": 1986,
        "className": "syntax-variable"
      },
      {
        "start": 1987,
        "end": 1988,
        "className": "syntax-operator"
      },
      {
        "start": 1989,
        "end": 1991,
        "className": "syntax-variable"
      },
      {
        "start": 1992,
        "end": 1993,
        "className": "syntax-operator"
      },
      {
        "start": 1994,
        "end": 1999,
        "className": "syntax-variable"
      },
      {
        "start": 2000,
        "end": 2005,
        "className": "syntax-function"
      },
      {
        "start": 2007,
        "end": 2009,
        "className": "syntax-variable"
      },
      {
        "start": 2010,
        "end": 2011,
        "className": "syntax-operator"
      },
      {
        "start": 2012,
        "end": 2014,
        "className": "syntax-variable"
      },
      {
        "start": 2020,
        "end": 2025,
        "className": "syntax-variable"
      },
      {
        "start": 2026,
        "end": 2031,
        "className": "syntax-function"
      },
      {
        "start": 2033,
        "end": 2035,
        "className": "syntax-variable"
      },
      {
        "start": 2036,
        "end": 2037,
        "className": "syntax-operator"
      },
      {
        "start": 2038,
        "end": 2040,
        "className": "syntax-variable"
      },
      {
        "start": 2043,
        "end": 2044,
        "className": "syntax-operator"
      },
      {
        "start": 2045,
        "end": 2047,
        "className": "syntax-variable"
      },
      {
        "start": 2052,
        "end": 2055,
        "className": "syntax-keyword"
      },
      {
        "start": 2060,
        "end": 2062,
        "className": "syntax-variable"
      },
      {
        "start": 2066,
        "end": 2069,
        "className": "syntax-variable"
      },
      {
        "start": 2085,
        "end": 2136,
        "className": "syntax-comment"
      },
      {
        "start": 2143,
        "end": 2145,
        "className": "syntax-keyword"
      },
      {
        "start": 2166,
        "end": 2168,
        "className": "syntax-variable"
      },
      {
        "start": 2169,
        "end": 2171,
        "className": "syntax-operator"
      },
      {
        "start": 2172,
        "end": 2174,
        "className": "syntax-variable"
      },
      {
        "start": 2186,
        "end": 2189,
        "className": "syntax-variable"
      },
      {
        "start": 2190,
        "end": 2191,
        "className": "syntax-operator"
      },
      {
        "start": 2192,
        "end": 2197,
        "className": "syntax-variable"
      },
      {
        "start": 2198,
        "end": 2203,
        "className": "syntax-function"
      },
      {
        "start": 2205,
        "end": 2207,
        "className": "syntax-variable"
      },
      {
        "start": 2227,
        "end": 2232,
        "className": "syntax-keyword"
      },
      {
        "start": 2234,
        "end": 2237,
        "className": "syntax-variable"
      },
      {
        "start": 2238,
        "end": 2240,
        "className": "syntax-operator"
      },
      {
        "start": 2241,
        "end": 2242,
        "className": "syntax-number"
      },
      {
        "start": 2243,
        "end": 2245,
        "className": "syntax-operator"
      },
      {
        "start": 2246,
        "end": 2248,
        "className": "syntax-variable"
      },
      {
        "start": 2252,
        "end": 2255,
        "className": "syntax-variable"
      },
      {
        "start": 2265,
        "end": 2330,
        "className": "syntax-comment"
      },
      {
        "start": 2331,
        "end": 2399,
        "className": "syntax-comment"
      },
      {
        "start": 2406,
        "end": 2408,
        "className": "syntax-variable"
      },
      {
        "start": 2409,
        "end": 2411,
        "className": "syntax-operator"
      },
      {
        "start": 2412,
        "end": 2415,
        "className": "syntax-variable"
      },
      {
        "start": 2423,
        "end": 2425,
        "className": "syntax-keyword"
      },
      {
        "start": 2427,
        "end": 2430,
        "className": "syntax-variable"
      },
      {
        "start": 2431,
        "end": 2432,
        "className": "syntax-operator"
      },
      {
        "start": 2433,
        "end": 2435,
        "className": "syntax-variable"
      },
      {
        "start": 2445,
        "end": 2453,
        "className": "syntax-keyword"
      },
      {
        "start": 2462,
        "end": 2527,
        "className": "syntax-comment"
      },
      {
        "start": 2528,
        "end": 2578,
        "className": "syntax-comment"
      },
      {
        "start": 2585,
        "end": 2587,
        "className": "syntax-keyword"
      },
      {
        "start": 2589,
        "end": 2591,
        "className": "syntax-variable"
      },
      {
        "start": 2592,
        "end": 2593,
        "className": "syntax-operator"
      },
      {
        "start": 2594,
        "end": 2596,
        "className": "syntax-number"
      },
      {
        "start": 2597,
        "end": 2599,
        "className": "syntax-operator"
      },
      {
        "start": 2600,
        "end": 2606,
        "className": "syntax-function"
      },
      {
        "start": 2608,
        "end": 2610,
        "className": "syntax-variable"
      },
      {
        "start": 2611,
        "end": 2612,
        "className": "syntax-operator"
      },
      {
        "start": 2613,
        "end": 2619,
        "className": "syntax-variable"
      },
      {
        "start": 2621,
        "end": 2623,
        "className": "syntax-variable"
      },
      {
        "start": 2624,
        "end": 2625,
        "className": "syntax-operator"
      },
      {
        "start": 2626,
        "end": 2632,
        "className": "syntax-variable"
      },
      {
        "start": 2634,
        "end": 2635,
        "className": "syntax-number"
      },
      {
        "start": 2637,
        "end": 2639,
        "className": "syntax-operator"
      },
      {
        "start": 2640,
        "end": 2641,
        "className": "syntax-number"
      },
      {
        "start": 2663,
        "end": 2665,
        "className": "syntax-keyword"
      },
      {
        "start": 2667,
        "end": 2673,
        "className": "syntax-function"
      },
      {
        "start": 2675,
        "end": 2677,
        "className": "syntax-variable"
      },
      {
        "start": 2679,
        "end": 2681,
        "className": "syntax-variable"
      },
      {
        "start": 2683,
        "end": 2685,
        "className": "syntax-variable"
      },
      {
        "start": 2687,
        "end": 2689,
        "className": "syntax-operator"
      },
      {
        "start": 2690,
        "end": 2691,
        "className": "syntax-number"
      },
      {
        "start": 2705,
        "end": 2711,
        "className": "syntax-keyword"
      },
      {
        "start": 2713,
        "end": 2717,
        "className": "syntax-type"
      },
      {
        "start": 2718,
        "end": 2719,
        "className": "syntax-operator"
      },
      {
        "start": 2721,
        "end": 2723,
        "className": "syntax-variable"
      },
      {
        "start": 2736,
        "end": 2798,
        "className": "syntax-comment"
      },
      {
        "start": 2809,
        "end": 2815,
        "className": "syntax-variable"
      },
      {
        "start": 2816,
        "end": 2817,
        "className": "syntax-operator"
      },
      {
        "start": 2819,
        "end": 2825,
        "className": "syntax-variable"
      },
      {
        "start": 2829,
        "end": 2830,
        "className": "syntax-number"
      },
      {
        "start": 2833,
        "end": 2839,
        "className": "syntax-variable"
      },
      {
        "start": 2842,
        "end": 2844,
        "className": "syntax-variable"
      },
      {
        "start": 2846,
        "end": 2847,
        "className": "syntax-operator"
      },
      {
        "start": 2848,
        "end": 2849,
        "className": "syntax-number"
      },
      {
        "start": 2868,
        "end": 2925,
        "className": "syntax-comment"
      },
      {
        "start": 2932,
        "end": 2934,
        "className": "syntax-variable"
      },
      {
        "start": 2935,
        "end": 2937,
        "className": "syntax-operator"
      },
      {
        "start": 2938,
        "end": 2944,
        "className": "syntax-variable"
      },
      {
        "start": 2954,
        "end": 2960,
        "className": "syntax-keyword"
      },
      {
        "start": 2961,
        "end": 2965,
        "className": "syntax-constant"
      },
      {
        "start": 2969,
        "end": 2984,
        "className": "syntax-variable"
      },
      {
        "start": 2986,
        "end": 2994,
        "className": "syntax-type"
      },
      {
        "start": 2996,
        "end": 3006,
        "className": "syntax-function"
      },
      {
        "start": 3008,
        "end": 3016,
        "className": "syntax-variable"
      },
      {
        "start": 3018,
        "end": 3024,
        "className": "syntax-variable"
      }
    ]
  },
  {
    "language": "c",
    "name": "c/neovim_cmdpreview.c",
    "code": "/// Show 'inccommand' preview if command is previewable. It works like this:\n///    1. Store current undo information so we can revert to current state later.\n///    2. Execute the preview callback with the parsed command, preview buffer number and preview\n///       namespace number as arguments. The preview callback sets the highlight and does the\n///       changes required for the preview if needed.\n///    3. Preview callback returns 0, 1 or 2. 0 means no preview is shown. 1 means preview is shown\n///       but preview window doesn't need to be opened. 2 means preview is shown and preview window\n///       needs to be opened if inccommand=split.\n///    4. Use the return value of the preview callback to determine whether to\n///       open the preview window or not and open preview window if needed.\n///    5. If the return value of the preview callback is not 0, update the screen while the effects\n///       of the preview are still in place.\n///    6. Revert all changes made by the preview callback.\n///\n/// @return whether preview is shown or not.\nstatic bool cmdpreview_may_show(CommandLineState *s)\n{\n  // Parse the command line and return if it fails.\n  exarg_T ea;\n  cmdmod_T cmod;\n  // Copy the command line so we can modify it.\n  int cmdpreview_type = 0;\n  char *cmdline = xstrdup(ccline.cmdbuff);\n  const char *errormsg = NULL;\n  emsg_off++;  // Block errors when parsing the command line, and don't update v:errmsg\n  if (!parse_cmdline(&cmdline, &ea, &cmod, &errormsg)) {\n    emsg_off--;\n    goto end;\n  }\n  emsg_off--;\n\n  // Check if command is previewable, if not, don't attempt to show preview\n  if (!(ea.argt & EX_PREVIEW)) {\n    undo_cmdmod(&cmod);\n    goto end;\n  }\n\n  // Cursor may be at the end of the message grid rather than at cmdspos.\n  // Place it there in case preview callback flushes it. #30696\n  cursorcmd();\n  // Flush now: external cmdline may itself wish to update the screen which is\n  // currently disallowed during cmdpreview (no longer needed in case that changes).\n  cmdline_ui_flush();\n\n  // Swap invalid command range if needed\n  if ((ea.argt & EX_RANGE) && ea.line1 > ea.line2) {\n    linenr_T lnum = ea.line1;\n    ea.line1 = ea.line2;\n    ea.line2 = lnum;\n  }\n\n  CpInfo cpinfo;\n  bool icm_split = *p_icm == 's';  // inccommand=split\n  buf_T *cmdpreview_buf = NULL;\n  win_T *cmdpreview_win = NULL;\n\n  emsg_silent++;                 // Block error reporting as the command may be incomplete,\n                                 // but still update v:errmsg\n  msg_silent++;                  // Block messages, namely ones that prompt\n  block_autocmds();              // Block events\n\n  // Save current state and prepare for command preview.\n  cmdpreview_prepare(&cpinfo);\n\n  // Open preview buffer if inccommand=split.\n  if (icm_split && (cmdpreview_buf = cmdpreview_open_buf()) == NULL) {\n    // Failed to create preview buffer, so disable preview.\n    set_option_direct(kOptInccommand, STATIC_CSTR_AS_OPTVAL(\"nosplit\"), 0, SID_NONE);\n    icm_split = false;\n  }\n  // Setup preview namespace if it's not already set.\n  if (!cmdpreview_ns) {\n    cmdpreview_ns = (int)nvim_create_namespace((String)STRING_INIT);\n  }\n\n  // Set cmdpreview state.\n  cmdpreview = true;\n\n  // Execute the preview callback and use its return value to determine whether to show preview or\n  // open the preview window. The preview callback also handles doing the changes and highlights for\n  // the preview.\n  Error err = ERROR_INIT;",
    "spans": [
      {
        "start": 0,
        "end": 76,
        "className": "syntax-comment"
      },
      {
        "start": 77,
        "end": 158,
        "className": "syntax-comment"
      },
      {
        "start": 159,
        "end": 256,
        "className": "syntax-comment"
      },
      {
        "start": 257,
        "end": 350,
        "className": "syntax-comment"
      },
      {
        "start": 351,
        "end": 404,
        "className": "syntax-comment"
      },
      {
        "start": 405,
        "end": 504,
        "className": "syntax-comment"
      },
      {
        "start": 505,
        "end": 604,
        "className": "syntax-comment"
      },
      {
        "start": 605,
        "end": 654,
        "className": "syntax-comment"
      },
      {
        "start": 655,
        "end": 733,
        "className": "syntax-comment"
      },
      {
        "start": 734,
        "end": 809,
        "className": "syntax-comment"
      },
      {
        "start": 810,
        "end": 909,
        "className": "syntax-comment"
      },
      {
        "start": 910,
        "end": 954,
        "className": "syntax-comment"
      },
      {
        "start": 955,
        "end": 1013,
        "className": "syntax-comment"
      },
      {
        "start": 1014,
        "end": 1017,
        "className": "syntax-comment"
      },
      {
        "start": 1018,
        "end": 1062,
        "className": "syntax-comment"
      },
      {
        "start": 1063,
        "end": 1069,
        "className": "syntax-keyword"
      },
      {
        "start": 1070,
        "end": 1074,
        "className": "syntax-type"
      },
      {
        "start": 1075,
        "end": 1094,
        "className": "syntax-function"
      },
      {
        "start": 1095,
        "end": 1111,
        "className": "syntax-type"
      },
      {
        "start": 1112,
        "end": 1113,
        "className": "syntax-operator"
      },
      {
        "start": 1113,
        "end": 1114,
        "className": "syntax-variable"
      },
      {
        "start": 1120,
        "end": 1169,
        "className": "syntax-comment"
      },
      {
        "start": 1172,
        "end": 1179,
        "className": "syntax-type"
      },
      {
        "start": 1180,
        "end": 1182,
        "className": "syntax-variable"
      },
      {
        "start": 1186,
        "end": 1194,
        "className": "syntax-type"
      },
      {
        "start": 1195,
        "end": 1199,
        "className": "syntax-variable"
      },
      {
        "start": 1203,
        "end": 1248,
        "className": "syntax-comment"
      },
      {
        "start": 1251,
        "end": 1254,
        "className": "syntax-type"
      },
      {
        "start": 1255,
        "end": 1270,
        "className": "syntax-variable"
      },
      {
        "start": 1271,
        "end": 1272,
        "className": "syntax-operator"
      },
      {
        "start": 1273,
        "end": 1274,
        "className": "syntax-number"
      },
      {
        "start": 1278,
        "end": 1282,
        "className": "syntax-type"
      },
      {
        "start": 1283,
        "end": 1284,
        "className": "syntax-operator"
      },
      {
        "start": 1284,
        "end": 1291,
        "className": "syntax-variable"
      },
      {
        "start": 1292,
        "end": 1293,
        "className": "syntax-operator"
      },
      {
        "start": 1294,
        "end": 1301,
        "className": "syntax-function"
      },
      {
        "start": 1302,
        "end": 1308,
        "className": "syntax-variable"
      },
      {
        "start": 1309,
        "end": 1316,
        "className": "syntax-property"
      },
      {
        "start": 1321,
        "end": 1326,
        "className": "syntax-keyword"
      },
      {
        "start": 1327,
        "end": 1331,
        "className": "syntax-type"
      },
      {
        "start": 1332,
        "end": 1333,
        "className": "syntax-operator"
      },
      {
        "start": 1333,
        "end": 1341,
        "className": "syntax-variable"
      },
      {
        "start": 1342,
        "end": 1343,
        "className": "syntax-operator"
      },
      {
        "start": 1344,
        "end": 1348,
        "className": "syntax-constant"
      },
      {
        "start": 1352,
        "end": 1360,
        "className": "syntax-variable"
      },
      {
        "start": 1360,
        "end": 1362,
        "className": "syntax-operator"
      },
      {
        "start": 1365,
        "end": 1437,
        "className": "syntax-comment"
      },
      {
        "start": 1440,
        "end": 1442,
        "className": "syntax-keyword"
      },
      {
        "start": 1445,
        "end": 1458,
        "className": "syntax-function"
      },
      {
        "start": 1459,
        "end": 1460,
        "className": "syntax-operator"
      },
      {
        "start": 1460,
        "end": 1467,
        "className": "syntax-variable"
      },
      {
        "start": 1469,
        "end": 1470,
        "className": "syntax-operator"
      },
      {
        "start": 1470,
        "end": 1472,
        "className": "syntax-variable"
      },
      {
        "start": 1474,
        "end": 1475,
        "className": "syntax-operator"
      },
      {
        "start": 1475,
        "end": 1479,
        "className": "syntax-variable"
      },
      {
        "start": 1481,
        "end": 1482,
        "className": "syntax-operator"
      },
      {
        "start": 1482,
        "end": 1490,
        "className": "syntax-variable"
      },
      {
        "start": 1499,
        "end": 1507,
        "className": "syntax-variable"
      },
      {
        "start": 1507,
        "end": 1509,
        "className": "syntax-operator"
      },
      {
        "start": 1531,
        "end": 1539,
        "className": "syntax-variable"
      },
      {
        "start": 1539,
        "end": 1541,
        "className": "syntax-operator"
      },
      {
        "start": 1546,
        "end": 1619,
        "className": "syntax-comment"
      },
      {
        "start": 1622,
        "end": 1624,
        "className": "syntax-keyword"
      },
      {
        "start": 1628,
        "end": 1630,
        "className": "syntax-variable"
      },
      {
        "start": 1631,
        "end": 1635,
        "className": "syntax-property"
      },
      {
        "start": 1636,
        "end": 1637,
        "className": "syntax-operator"
      },
      {
        "start": 1638,
        "end": 1648,
        "className": "syntax-constant"
      },
      {
        "start": 1657,
        "end": 1668,
        "className": "syntax-function"
      },
      {
        "start": 1669,
        "end": 1670,
        "className": "syntax-operator"
      },
      {
        "start": 1670,
        "end": 1674,
        "className": "syntax-variable"
      },
      {
        "start": 1698,
        "end": 1769,
        "className": "syntax-comment"
      },
      {
        "start": 1772,
        "end": 1833,
        "className": "syntax-comment"
      },
      {
        "start": 1836,
        "end": 1845,
        "className": "syntax-function"
      },
      {
        "start": 1851,
        "end": 1927,
        "className": "syntax-comment"
      },
      {
        "start": 1930,
        "end": 2012,
        "className": "syntax-comment"
      },
      {
        "start": 2015,
        "end": 2031,
        "className": "syntax-function"
      },
      {
        "start": 2038,
        "end": 2077,
        "className": "syntax-comment"
      },
      {
        "start": 2080,
        "end": 2082,
        "className": "syntax-keyword"
      },
      {
        "start": 2085,
        "end": 2087,
        "className": "syntax-variable"
      },
      {
        "start": 2088,
        "end": 2092,
        "className": "syntax-property"
      },
      {
        "start": 2093,
        "end": 2094,
        "className": "syntax-operator"
      },
      {
        "start": 2095,
        "end": 2103,
        "className": "syntax-constant"
      },
      {
        "start": 2105,
        "end": 2107,
        "className": "syntax-operator"
      },
      {
        "start": 2108,
        "end": 2110,
        "className": "syntax-variable"
      },
      {
        "start": 2111,
        "end": 2116,
        "className": "syntax-property"
      },
      {
        "start": 2117,
        "end": 2118,
        "className": "syntax-operator"
      },
      {
        "start": 2119,
        "end": 2121,
        "className": "syntax-variable"
      },
      {
        "start": 2122,
        "end": 2127,
        "className": "syntax-property"
      },
      {
        "start": 2135,
        "end": 2143,
        "className": "syntax-type"
      },
      {
        "start": 2144,
        "end": 2148,
        "className": "syntax-variable"
      },
      {
        "start": 2149,
        "end": 2150,
        "className": "syntax-operator"
      },
      {
        "start": 2151,
        "end": 2153,
        "className": "syntax-variable"
      },
      {
        "start": 2154,
        "end": 2159,
        "className": "syntax-property"
      },
      {
        "start": 2165,
        "end": 2167,
        "className": "syntax-variable"
      },
      {
        "start": 2168,
        "end": 2173,
        "className": "syntax-property"
      },
      {
        "start": 2174,
        "end": 2175,
        "className": "syntax-operator"
      },
      {
        "start": 2176,
        "end": 2178,
        "className": "syntax-variable"
      },
      {
        "start": 2179,
        "end": 2184,
        "className": "syntax-property"
      },
      {
        "start": 2190,
        "end": 2192,
        "className": "syntax-variable"
      },
      {
        "start": 2193,
        "end": 2198,
        "className": "syntax-property"
      },
      {
        "start": 2199,
        "end": 2200,
        "className": "syntax-operator"
      },
      {
        "start": 2201,
        "end": 2205,
        "className": "syntax-variable"
      },
      {
        "start": 2214,
        "end": 2220,
        "className": "syntax-type"
      },
      {
        "start": 2221,
        "end": 2227,
        "className": "syntax-variable"
      },
      {
        "start": 2231,
        "end": 2235,
        "className": "syntax-type"
      },
      {
        "start": 2236,
        "end": 2245,
        "className": "syntax-variable"
      },
      {
        "start": 2246,
        "end": 2247,
        "className": "syntax-operator"
      },
      {
        "start": 2248,
        "end": 2249,
        "className": "syntax-operator"
      },
      {
        "start": 2249,
        "end": 2254,
        "className": "syntax-variable"
      },
      {
        "start": 2255,
        "end": 2257,
        "className": "syntax-operator"
      },
      {
        "start": 2258,
        "end": 2261,
        "className": "syntax-number"
      },
      {
        "start": 2264,
        "end": 2283,
        "className": "syntax-comment"
      },
      {
        "start": 2286,
        "end": 2291,
        "className": "syntax-type"
      },
      {
        "start": 2292,
        "end": 2293,
        "className": "syntax-operator"
      },
      {
        "start": 2293,
        "end": 2307,
        "className": "syntax-variable"
      },
      {
        "start": 2308,
        "end": 2309,
        "className": "syntax-operator"
      },
      {
        "start": 2310,
        "end": 2314,
        "className": "syntax-constant"
      },
      {
        "start": 2318,
        "end": 2323,
        "className": "syntax-type"
      },
      {
        "start": 2324,
        "end": 2325,
        "className": "syntax-operator"
      },
      {
        "start": 2325,
        "end": 2339,
        "className": "syntax-variable"
      },
      {
        "start": 2340,
        "end": 2341,
        "className": "syntax-operator"
      },
      {
        "start": 2342,
        "end": 2346,
        "className": "syntax-constant"
      },
      {
        "start": 2351,
        "end": 2362,
        "className": "syntax-variable"
      },
      {
        "start": 2362,
        "end": 2364,
        "className": "syntax-operator"
      },
      {
        "start": 2382,
        "end": 2440,
        "className": "syntax-comment"
      },
      {
        "start": 2474,
        "end": 2502,
        "className": "syntax-comment"
      },
      {
        "start": 2505,
        "end": 2515,
        "className": "syntax-variable"
      },
      {
        "start": 2515,
        "end": 2517,
        "className": "syntax-operator"
      },
      {
        "start": 2536,
        "end": 2578,
        "className": "syntax-comment"
      },
      {
        "start": 2581,
        "end": 2595,
        "className": "syntax-function"
      },
      {
        "start": 2612,
        "end": 2627,
        "className": "syntax-comment"
      },
      {
        "start": 2631,
        "end": 2685,
        "className": "syntax-comment"
      },
      {
        "start": 2688,
        "end": 2706,
        "className": "syntax-function"
      },
      {
        "start": 2707,
        "end": 2708,
        "className": "syntax-operator"
      },
      {
        "start": 2708,
        "end": 2714,
        "className": "syntax-variable"
      },
      {
        "start": 2720,
        "end": 2763,
        "className": "syntax-comment"
      },
      {
        "start": 2766,
        "end": 2768,
        "className": "syntax-keyword"
      },
      {
        "start": 2770,
        "end": 2779,
        "className": "syntax-variable"
      },
      {
        "start": 2780,
        "end": 2782,
        "className": "syntax-operator"
      },
      {
        "start": 2784,
        "end": 2798,
        "className": "syntax-variable"
      },
      {
        "start": 2799,
        "end": 2800,
        "className": "syntax-operator"
      },
      {
        "start": 2801,
        "end": 2820,
        "className": "syntax-function"
      },
      {
        "start": 2824,
        "end": 2826,
        "className": "syntax-operator"
      },
      {
        "start": 2827,
        "end": 2831,
        "className": "syntax-constant"
      },
      {
        "start": 2839,
        "end": 2894,
        "className": "syntax-comment"
      },
      {
        "start": 2899,
        "end": 2916,
        "className": "syntax-function"
      },
      {
        "start": 2917,
        "end": 2931,
        "className": "syntax-variable"
      },
      {
        "start": 2933,
        "end": 2954,
        "className": "syntax-function"
      },
      {
        "start": 2955,
        "end": 2964,
        "className": "syntax-string"
      },
      {
        "start": 2967,
        "end": 2968,
        "className": "syntax-number"
      },
      {
        "start": 2970,
        "end": 2978,
        "className": "syntax-constant"
      },
      {
        "start": 2985,
        "end": 2994,
        "className": "syntax-variable"
      },
      {
        "start": 2995,
        "end": 2996,
        "className": "syntax-operator"
      },
      {
        "start": 3010,
        "end": 3061,
        "className": "syntax-comment"
      },
      {
        "start": 3064,
        "end": 3066,
        "className": "syntax-keyword"
      },
      {
        "start": 3069,
        "end": 3082,
        "className": "syntax-variable"
      },
      {
        "start": 3090,
        "end": 3103,
        "className": "syntax-variable"
      },
      {
        "start": 3104,
        "end": 3105,
        "className": "syntax-operator"
      },
      {
        "start": 3107,
        "end": 3110,
        "className": "syntax-type"
      },
      {
        "start": 3111,
        "end": 3132,
        "className": "syntax-function"
      },
      {
        "start": 3134,
        "end": 3140,
        "className": "syntax-type"
      },
      {
        "start": 3141,
        "end": 3152,
        "className": "syntax-constant"
      },
      {
        "start": 3162,
        "end": 3186,
        "className": "syntax-comment"
      },
      {
        "start": 3189,
        "end": 3199,
        "className": "syntax-variable"
      },
      {
        "start": 3200,
        "end": 3201,
        "className": "syntax-operator"
      },
      {
        "start": 3211,
        "end": 3307,
        "className": "syntax-comment"
      },
      {
        "start": 3310,
        "end": 3408,
        "className": "syntax-comment"
      },
      {
        "start": 3411,
        "end": 3426,
        "className": "syntax-comment"
      },
      {
        "start": 3429,
        "end": 3434,
        "className": "syntax-type"
      },
      {
        "start": 3435,
        "end": 3438,
        "className": "syntax-variable"
      },
      {
        "start": 3439,
        "end": 3440,
        "className": "syntax-operator"
      },
      {
        "start": 3441,
        "end": 3451,
        "className": "syntax-constant"
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
    "language": "cpp",
    "name": "cpp/llvm_capture_tracking.cpp",
    "code": "/// The default value for MaxUsesToExplore argument. It's relatively small to\n/// keep the cost of analysis reasonable for clients like BasicAliasAnalysis,\n/// where the results can't be cached.\n/// TODO: we should probably introduce a caching CaptureTracking analysis and\n/// use it where possible. The caching version can use much higher limit or\n/// don't have this cap at all.\nstatic cl::opt<unsigned>\n    DefaultMaxUsesToExplore(\"capture-tracking-max-uses-to-explore\", cl::Hidden,\n                            cl::desc(\"Maximal number of uses to explore.\"),\n                            cl::init(100));\n\nunsigned llvm::getDefaultMaxUsesToExploreForCaptureTracking() {\n  return DefaultMaxUsesToExplore;\n}\n\nCaptureTracker::~CaptureTracker() = default;\n\nbool CaptureTracker::shouldExplore(const Use *U) { return true; }\n\nbool CaptureTracker::isDereferenceableOrNull(Value *O, const DataLayout &DL) {\n  // We want comparisons to null pointers to not be considered capturing,\n  // but need to guard against cases like gep(p, -ptrtoint(p2)) == null,\n  // which are equivalent to p == p2 and would capture the pointer.\n  //\n  // A dereferenceable pointer is a case where this is known to be safe,\n  // because the pointer resulting from such a construction would not be\n  // dereferenceable.\n  //\n  // It is not sufficient to check for inbounds GEP here, because GEP with\n  // zero offset is always inbounds.\n  bool CanBeNull, CanBeFreed;\n  return O->getPointerDereferenceableBytes(DL, CanBeNull, CanBeFreed);\n}\n\nnamespace {\nstruct SimpleCaptureTracker : public CaptureTracker {\n  explicit SimpleCaptureTracker(bool ReturnCaptures)\n      : ReturnCaptures(ReturnCaptures) {}\n\n  void tooManyUses() override {\n    LLVM_DEBUG(dbgs() << \"Captured due to too many uses\\n\");\n    Captured = true;\n  }\n\n  bool captured(const Use *U) override {\n    if (isa<ReturnInst>(U->getUser()) && !ReturnCaptures)\n      return false;\n\n    LLVM_DEBUG(dbgs() << \"Captured by: \" << *U->getUser() << \"\\n\");\n\n    Captured = true;\n    return true;\n  }\n\n  bool ReturnCaptures;\n\n  bool Captured = false;\n};\n\n/// Only find pointer captures which happen before the given instruction. Uses\n/// the dominator tree to determine whether one instruction is before another.\n/// Only support the case where the Value is defined in the same basic block\n/// as the given instruction and the use.\nstruct CapturesBefore : public CaptureTracker {\n\n  CapturesBefore(bool ReturnCaptures, const Instruction *I,\n                 const DominatorTree *DT, bool IncludeI, const LoopInfo *LI)\n      : BeforeHere(I), DT(DT), ReturnCaptures(ReturnCaptures),\n        IncludeI(IncludeI), LI(LI) {}\n\n  void tooManyUses() override { Captured = true; }\n\n  bool isSafeToPrune(Instruction *I) {\n    if (BeforeHere == I)\n      return !IncludeI;\n\n    // We explore this usage only if the usage can reach \"BeforeHere\".\n    // If use is not reachable from entry, there is no need to explore.\n    if (!DT->isReachableFromEntry(I->getParent()))\n      return true;\n\n    // Check whether there is a path from I to BeforeHere.\n    return !isPotentiallyReachable(I, BeforeHere, nullptr, DT, LI);\n  }\n\n  bool captured(const Use *U) override {\n    Instruction *I = cast<Instruction>(U->getUser());\n    if (isa<ReturnInst>(I) && !ReturnCaptures)\n      return false;\n\n    // Check isSafeToPrune() here rather than in shouldExplore() to avoid\n    // an expensive reachability query for every instruction we look at.\n    // Instead we only do one for actual capturing candidates.\n    if (isSafeToPrune(I))\n      return false;\n\n    Captured = true;\n    return true;\n  }",
    "spans": [
      {
        "start": 0,
        "end": 77,
        "className": "syntax-comment"
      },
      {
        "start": 78,
        "end": 155,
        "className": "syntax-comment"
      },
      {
        "start": 156,
        "end": 194,
        "className": "syntax-comment"
      },
      {
        "start": 195,
        "end": 272,
        "className": "syntax-comment"
      },
      {
        "start": 273,
        "end": 348,
        "className": "syntax-comment"
      },
      {
        "start": 349,
        "end": 380,
        "className": "syntax-comment"
      },
      {
        "start": 381,
        "end": 387,
        "className": "syntax-keyword"
      },
      {
        "start": 392,
        "end": 395,
        "className": "syntax-type"
      },
      {
        "start": 395,
        "end": 396,
        "className": "syntax-operator"
      },
      {
        "start": 396,
        "end": 404,
        "className": "syntax-type"
      },
      {
        "start": 404,
        "end": 405,
        "className": "syntax-operator"
      },
      {
        "start": 410,
        "end": 433,
        "className": "syntax-variable"
      },
      {
        "start": 434,
        "end": 472,
        "className": "syntax-string"
      },
      {
        "start": 478,
        "end": 484,
        "className": "syntax-variable"
      },
      {
        "start": 518,
        "end": 522,
        "className": "syntax-function"
      },
      {
        "start": 523,
        "end": 559,
        "className": "syntax-string"
      },
      {
        "start": 594,
        "end": 598,
        "className": "syntax-function"
      },
      {
        "start": 599,
        "end": 602,
        "className": "syntax-number"
      },
      {
        "start": 607,
        "end": 615,
        "className": "syntax-type"
      },
      {
        "start": 622,
        "end": 666,
        "className": "syntax-function"
      },
      {
        "start": 673,
        "end": 679,
        "className": "syntax-keyword"
      },
      {
        "start": 680,
        "end": 703,
        "className": "syntax-variable"
      },
      {
        "start": 708,
        "end": 722,
        "className": "syntax-type"
      },
      {
        "start": 725,
        "end": 739,
        "className": "syntax-variable"
      },
      {
        "start": 742,
        "end": 743,
        "className": "syntax-operator"
      },
      {
        "start": 744,
        "end": 751,
        "className": "syntax-keyword"
      },
      {
        "start": 754,
        "end": 758,
        "className": "syntax-type"
      },
      {
        "start": 759,
        "end": 773,
        "className": "syntax-type"
      },
      {
        "start": 775,
        "end": 788,
        "className": "syntax-function"
      },
      {
        "start": 789,
        "end": 794,
        "className": "syntax-keyword"
      },
      {
        "start": 795,
        "end": 798,
        "className": "syntax-type"
      },
      {
        "start": 799,
        "end": 800,
        "className": "syntax-operator"
      },
      {
        "start": 800,
        "end": 801,
        "className": "syntax-constant"
      },
      {
        "start": 805,
        "end": 811,
        "className": "syntax-keyword"
      },
      {
        "start": 821,
        "end": 825,
        "className": "syntax-type"
      },
      {
        "start": 826,
        "end": 840,
        "className": "syntax-type"
      },
      {
        "start": 842,
        "end": 865,
        "className": "syntax-function"
      },
      {
        "start": 866,
        "end": 871,
        "className": "syntax-type"
      },
      {
        "start": 872,
        "end": 873,
        "className": "syntax-operator"
      },
      {
        "start": 873,
        "end": 874,
        "className": "syntax-constant"
      },
      {
        "start": 876,
        "end": 881,
        "className": "syntax-keyword"
      },
      {
        "start": 882,
        "end": 892,
        "className": "syntax-type"
      },
      {
        "start": 893,
        "end": 894,
        "className": "syntax-operator"
      },
      {
        "start": 894,
        "end": 896,
        "className": "syntax-constant"
      },
      {
        "start": 902,
        "end": 973,
        "className": "syntax-comment"
      },
      {
        "start": 976,
        "end": 1046,
        "className": "syntax-comment"
      },
      {
        "start": 1049,
        "end": 1114,
        "className": "syntax-comment"
      },
      {
        "start": 1117,
        "end": 1119,
        "className": "syntax-comment"
      },
      {
        "start": 1122,
        "end": 1192,
        "className": "syntax-comment"
      },
      {
        "start": 1195,
        "end": 1265,
        "className": "syntax-comment"
      },
      {
        "start": 1268,
        "end": 1287,
        "className": "syntax-comment"
      },
      {
        "start": 1290,
        "end": 1292,
        "className": "syntax-comment"
      },
      {
        "start": 1295,
        "end": 1367,
        "className": "syntax-comment"
      },
      {
        "start": 1370,
        "end": 1404,
        "className": "syntax-comment"
      },
      {
        "start": 1407,
        "end": 1411,
        "className": "syntax-type"
      },
      {
        "start": 1412,
        "end": 1421,
        "className": "syntax-variable"
      },
      {
        "start": 1423,
        "end": 1433,
        "className": "syntax-variable"
      },
      {
        "start": 1437,
        "end": 1443,
        "className": "syntax-keyword"
      },
      {
        "start": 1444,
        "end": 1445,
        "className": "syntax-constant"
      },
      {
        "start": 1445,
        "end": 1447,
        "className": "syntax-operator"
      },
      {
        "start": 1447,
        "end": 1477,
        "className": "syntax-function"
      },
      {
        "start": 1478,
        "end": 1480,
        "className": "syntax-constant"
      },
      {
        "start": 1482,
        "end": 1491,
        "className": "syntax-variable"
      },
      {
        "start": 1493,
        "end": 1503,
        "className": "syntax-variable"
      },
      {
        "start": 1509,
        "end": 1518,
        "className": "syntax-keyword"
      },
      {
        "start": 1521,
        "end": 1527,
        "className": "syntax-keyword"
      },
      {
        "start": 1528,
        "end": 1548,
        "className": "syntax-type"
      },
      {
        "start": 1551,
        "end": 1557,
        "className": "syntax-keyword"
      },
      {
        "start": 1558,
        "end": 1572,
        "className": "syntax-type"
      },
      {
        "start": 1577,
        "end": 1585,
        "className": "syntax-keyword"
      },
      {
        "start": 1586,
        "end": 1606,
        "className": "syntax-function"
      },
      {
        "start": 1607,
        "end": 1611,
        "className": "syntax-type"
      },
      {
        "start": 1612,
        "end": 1626,
        "className": "syntax-variable"
      },
      {
        "start": 1636,
        "end": 1650,
        "className": "syntax-property"
      },
      {
        "start": 1651,
        "end": 1665,
        "className": "syntax-variable"
      },
      {
        "start": 1673,
        "end": 1677,
        "className": "syntax-type"
      },
      {
        "start": 1678,
        "end": 1689,
        "className": "syntax-function"
      },
      {
        "start": 1692,
        "end": 1700,
        "className": "syntax-keyword"
      },
      {
        "start": 1707,
        "end": 1717,
        "className": "syntax-function"
      },
      {
        "start": 1718,
        "end": 1722,
        "className": "syntax-function"
      },
      {
        "start": 1728,
        "end": 1761,
        "className": "syntax-string"
      },
      {
        "start": 1768,
        "end": 1776,
        "className": "syntax-variable"
      },
      {
        "start": 1777,
        "end": 1778,
        "className": "syntax-operator"
      },
      {
        "start": 1792,
        "end": 1796,
        "className": "syntax-type"
      },
      {
        "start": 1797,
        "end": 1805,
        "className": "syntax-function"
      },
      {
        "start": 1806,
        "end": 1811,
        "className": "syntax-keyword"
      },
      {
        "start": 1812,
        "end": 1815,
        "className": "syntax-type"
      },
      {
        "start": 1816,
        "end": 1817,
        "className": "syntax-operator"
      },
      {
        "start": 1817,
        "end": 1818,
        "className": "syntax-constant"
      },
      {
        "start": 1820,
        "end": 1828,
        "className": "syntax-keyword"
      },
      {
        "start": 1835,
        "end": 1837,
        "className": "syntax-keyword"
      },
      {
        "start": 1839,
        "end": 1842,
        "className": "syntax-function"
      },
      {
        "start": 1842,
        "end": 1843,
        "className": "syntax-operator"
      },
      {
        "start": 1843,
        "end": 1853,
        "className": "syntax-type"
      },
      {
        "start": 1853,
        "end": 1854,
        "className": "syntax-operator"
      },
      {
        "start": 1855,
        "end": 1856,
        "className": "syntax-constant"
      },
      {
        "start": 1856,
        "end": 1858,
        "className": "syntax-operator"
      },
      {
        "start": 1858,
        "end": 1865,
        "className": "syntax-function"
      },
      {
        "start": 1869,
        "end": 1871,
        "className": "syntax-operator"
      },
      {
        "start": 1873,
        "end": 1887,
        "className": "syntax-variable"
      },
      {
        "start": 1895,
        "end": 1901,
        "className": "syntax-keyword"
      },
      {
        "start": 1914,
        "end": 1924,
        "className": "syntax-function"
      },
      {
        "start": 1925,
        "end": 1929,
        "className": "syntax-function"
      },
      {
        "start": 1935,
        "end": 1950,
        "className": "syntax-string"
      },
      {
        "start": 1954,
        "end": 1955,
        "className": "syntax-operator"
      },
      {
        "start": 1955,
        "end": 1956,
        "className": "syntax-constant"
      },
      {
        "start": 1956,
        "end": 1958,
        "className": "syntax-operator"
      },
      {
        "start": 1958,
        "end": 1965,
        "className": "syntax-function"
      },
      {
        "start": 1971,
        "end": 1975,
        "className": "syntax-string"
      },
      {
        "start": 1983,
        "end": 1991,
        "className": "syntax-variable"
      },
      {
        "start": 1992,
        "end": 1993,
        "className": "syntax-operator"
      },
      {
        "start": 2004,
        "end": 2010,
        "className": "syntax-keyword"
      },
      {
        "start": 2024,
        "end": 2028,
        "className": "syntax-type"
      },
      {
        "start": 2029,
        "end": 2043,
        "className": "syntax-property"
      },
      {
        "start": 2048,
        "end": 2052,
        "className": "syntax-type"
      },
      {
        "start": 2053,
        "end": 2061,
        "className": "syntax-property"
      },
      {
        "start": 2062,
        "end": 2063,
        "className": "syntax-operator"
      },
      {
        "start": 2075,
        "end": 2153,
        "className": "syntax-comment"
      },
      {
        "start": 2154,
        "end": 2232,
        "className": "syntax-comment"
      },
      {
        "start": 2233,
        "end": 2309,
        "className": "syntax-comment"
      },
      {
        "start": 2310,
        "end": 2351,
        "className": "syntax-comment"
      },
      {
        "start": 2352,
        "end": 2358,
        "className": "syntax-keyword"
      },
      {
        "start": 2359,
        "end": 2373,
        "className": "syntax-type"
      },
      {
        "start": 2376,
        "end": 2382,
        "className": "syntax-keyword"
      },
      {
        "start": 2383,
        "end": 2397,
        "className": "syntax-type"
      },
      {
        "start": 2403,
        "end": 2417,
        "className": "syntax-function"
      },
      {
        "start": 2418,
        "end": 2422,
        "className": "syntax-type"
      },
      {
        "start": 2423,
        "end": 2437,
        "className": "syntax-variable"
      },
      {
        "start": 2439,
        "end": 2444,
        "className": "syntax-keyword"
      },
      {
        "start": 2445,
        "end": 2456,
        "className": "syntax-type"
      },
      {
        "start": 2457,
        "end": 2458,
        "className": "syntax-operator"
      },
      {
        "start": 2458,
        "end": 2459,
        "className": "syntax-constant"
      },
      {
        "start": 2478,
        "end": 2483,
        "className": "syntax-keyword"
      },
      {
        "start": 2484,
        "end": 2497,
        "className": "syntax-type"
      },
      {
        "start": 2498,
        "end": 2499,
        "className": "syntax-operator"
      },
      {
        "start": 2499,
        "end": 2501,
        "className": "syntax-constant"
      },
      {
        "start": 2503,
        "end": 2507,
        "className": "syntax-type"
      },
      {
        "start": 2508,
        "end": 2516,
        "className": "syntax-variable"
      },
      {
        "start": 2518,
        "end": 2523,
        "className": "syntax-keyword"
      },
      {
        "start": 2524,
        "end": 2532,
        "className": "syntax-type"
      },
      {
        "start": 2533,
        "end": 2534,
        "className": "syntax-operator"
      },
      {
        "start": 2534,
        "end": 2536,
        "className": "syntax-constant"
      },
      {
        "start": 2546,
        "end": 2556,
        "className": "syntax-property"
      },
      {
        "start": 2557,
        "end": 2558,
        "className": "syntax-constant"
      },
      {
        "start": 2561,
        "end": 2563,
        "className": "syntax-property"
      },
      {
        "start": 2564,
        "end": 2566,
        "className": "syntax-constant"
      },
      {
        "start": 2569,
        "end": 2583,
        "className": "syntax-property"
      },
      {
        "start": 2584,
        "end": 2598,
        "className": "syntax-variable"
      },
      {
        "start": 2609,
        "end": 2617,
        "className": "syntax-property"
      },
      {
        "start": 2618,
        "end": 2626,
        "className": "syntax-variable"
      },
      {
        "start": 2629,
        "end": 2631,
        "className": "syntax-property"
      },
      {
        "start": 2632,
        "end": 2634,
        "className": "syntax-constant"
      },
      {
        "start": 2642,
        "end": 2646,
        "className": "syntax-type"
      },
      {
        "start": 2647,
        "end": 2658,
        "className": "syntax-function"
      },
      {
        "start": 2661,
        "end": 2669,
        "className": "syntax-keyword"
      },
      {
        "start": 2672,
        "end": 2680,
        "className": "syntax-variable"
      },
      {
        "start": 2681,
        "end": 2682,
        "className": "syntax-operator"
      },
      {
        "start": 2694,
        "end": 2698,
        "className": "syntax-type"
      },
      {
        "start": 2699,
        "end": 2712,
        "className": "syntax-function"
      },
      {
        "start": 2713,
        "end": 2724,
        "className": "syntax-type"
      },
      {
        "start": 2725,
        "end": 2726,
        "className": "syntax-operator"
      },
      {
        "start": 2726,
        "end": 2727,
        "className": "syntax-constant"
      },
      {
        "start": 2735,
        "end": 2737,
        "className": "syntax-keyword"
      },
      {
        "start": 2739,
        "end": 2749,
        "className": "syntax-variable"
      },
      {
        "start": 2750,
        "end": 2752,
        "className": "syntax-operator"
      },
      {
        "start": 2753,
        "end": 2754,
        "className": "syntax-constant"
      },
      {
        "start": 2762,
        "end": 2768,
        "className": "syntax-keyword"
      },
      {
        "start": 2770,
        "end": 2778,
        "className": "syntax-variable"
      },
      {
        "start": 2785,
        "end": 2851,
        "className": "syntax-comment"
      },
      {
        "start": 2856,
        "end": 2923,
        "className": "syntax-comment"
      },
      {
        "start": 2928,
        "end": 2930,
        "className": "syntax-keyword"
      },
      {
        "start": 2933,
        "end": 2935,
        "className": "syntax-constant"
      },
      {
        "start": 2935,
        "end": 2937,
        "className": "syntax-operator"
      },
      {
        "start": 2937,
        "end": 2957,
        "className": "syntax-function"
      },
      {
        "start": 2958,
        "end": 2959,
        "className": "syntax-constant"
      },
      {
        "start": 2959,
        "end": 2961,
        "className": "syntax-operator"
      },
      {
        "start": 2961,
        "end": 2970,
        "className": "syntax-function"
      },
      {
        "start": 2981,
        "end": 2987,
        "className": "syntax-keyword"
      },
      {
        "start": 2999,
        "end": 3053,
        "className": "syntax-comment"
      },
      {
        "start": 3058,
        "end": 3064,
        "className": "syntax-keyword"
      },
      {
        "start": 3066,
        "end": 3088,
        "className": "syntax-function"
      },
      {
        "start": 3089,
        "end": 3090,
        "className": "syntax-constant"
      },
      {
        "start": 3092,
        "end": 3102,
        "className": "syntax-variable"
      },
      {
        "start": 3104,
        "end": 3111,
        "className": "syntax-constant"
      },
      {
        "start": 3113,
        "end": 3115,
        "className": "syntax-constant"
      },
      {
        "start": 3117,
        "end": 3119,
        "className": "syntax-constant"
      },
      {
        "start": 3129,
        "end": 3133,
        "className": "syntax-type"
      },
      {
        "start": 3134,
        "end": 3142,
        "className": "syntax-function"
      },
      {
        "start": 3143,
        "end": 3148,
        "className": "syntax-keyword"
      },
      {
        "start": 3149,
        "end": 3152,
        "className": "syntax-type"
      },
      {
        "start": 3153,
        "end": 3154,
        "className": "syntax-operator"
      },
      {
        "start": 3154,
        "end": 3155,
        "className": "syntax-constant"
      },
      {
        "start": 3157,
        "end": 3165,
        "className": "syntax-keyword"
      },
      {
        "start": 3172,
        "end": 3183,
        "className": "syntax-type"
      },
      {
        "start": 3184,
        "end": 3185,
        "className": "syntax-operator"
      },
      {
        "start": 3185,
        "end": 3186,
        "className": "syntax-constant"
      },
      {
        "start": 3187,
        "end": 3188,
        "className": "syntax-operator"
      },
      {
        "start": 3189,
        "end": 3193,
        "className": "syntax-function"
      },
      {
        "start": 3193,
        "end": 3194,
        "className": "syntax-operator"
      },
      {
        "start": 3194,
        "end": 3205,
        "className": "syntax-type"
      },
      {
        "start": 3205,
        "end": 3206,
        "className": "syntax-operator"
      },
      {
        "start": 3207,
        "end": 3208,
        "className": "syntax-constant"
      },
      {
        "start": 3208,
        "end": 3210,
        "className": "syntax-operator"
      },
      {
        "start": 3210,
        "end": 3217,
        "className": "syntax-function"
      },
      {
        "start": 3226,
        "end": 3228,
        "className": "syntax-keyword"
      },
      {
        "start": 3230,
        "end": 3233,
        "className": "syntax-function"
      },
      {
        "start": 3233,
        "end": 3234,
        "className": "syntax-operator"
      },
      {
        "start": 3234,
        "end": 3244,
        "className": "syntax-type"
      },
      {
        "start": 3244,
        "end": 3245,
        "className": "syntax-operator"
      },
      {
        "start": 3246,
        "end": 3247,
        "className": "syntax-constant"
      },
      {
        "start": 3249,
        "end": 3251,
        "className": "syntax-operator"
      },
      {
        "start": 3253,
        "end": 3267,
        "className": "syntax-variable"
      },
      {
        "start": 3275,
        "end": 3281,
        "className": "syntax-keyword"
      },
      {
        "start": 3294,
        "end": 3363,
        "className": "syntax-comment"
      },
      {
        "start": 3368,
        "end": 3436,
        "className": "syntax-comment"
      },
      {
        "start": 3441,
        "end": 3499,
        "className": "syntax-comment"
      },
      {
        "start": 3504,
        "end": 3506,
        "className": "syntax-keyword"
      },
      {
        "start": 3508,
        "end": 3521,
        "className": "syntax-function"
      },
      {
        "start": 3522,
        "end": 3523,
        "className": "syntax-constant"
      },
      {
        "start": 3532,
        "end": 3538,
        "className": "syntax-keyword"
      },
      {
        "start": 3551,
        "end": 3559,
        "className": "syntax-variable"
      },
      {
        "start": 3560,
        "end": 3561,
        "className": "syntax-operator"
      },
      {
        "start": 3572,
        "end": 3578,
        "className": "syntax-keyword"
      }
    ]
  },
  {
    "language": "javascript",
    "name": "javascript/typescript_build.js",
    "code": "            // esbuild converts calls to \"require\" to \"__require\"; this function\n            // calls the real require if it exists, or throws if it does not (rather than\n            // throwing an error like \"require not defined\"). But, since we want typescript\n            // to be consumable by other bundlers, we need to convert these calls back to\n            // require so our imports are visible again.\n            //\n            // To fix this, we redefine \"require\" to a name we're unlikely to use with the\n            // same length as \"require\", then replace it back to \"require\" after bundling,\n            // ensuring that source maps still work.\n            //\n            // See: https://github.com/evanw/esbuild/issues/1905\n            const require = \"require\";\n            const fakeName = \"Q\".repeat(require.length);\n            const fakeNameRegExp = new RegExp(fakeName, \"g\");\n            options.define = { [require]: fakeName };\n\n            // For historical reasons, TypeScript does not set __esModule. Hack esbuild's __toCommonJS to be a noop.\n            // We reference `__copyProps` to ensure the final bundle doesn't have any unreferenced code.\n            const toCommonJsRegExp = /var __toCommonJS .*/;\n            const toCommonJsRegExpReplacement = \"var __toCommonJS = (mod) => (__copyProps, mod); // Modified helper to skip setting __esModule.\";\n\n            options.plugins = options.plugins || [];\n            options.plugins.push(\n                {\n                    name: \"post-process\",\n                    setup: build => {\n                        build.onEnd(async () => {\n                            let contents = await fs.promises.readFile(outfile, \"utf-8\");\n                            contents = contents.replace(fakeNameRegExp, require);\n                            let matches = 0;\n                            contents = contents.replace(toCommonJsRegExp, () => {\n                                matches++;\n                                return toCommonJsRegExpReplacement;\n                            });\n                            assert(matches === 1, \"Expected exactly one match for __toCommonJS\");\n                            await fs.promises.writeFile(outfile, contents);\n                        });\n                    },\n                },\n            );\n        }\n\n        return options;\n    });\n\n    return {\n        build: async () => esbuild.build(await getOptions()),\n        watch: async () => {\n            /** @type {esbuild.BuildOptions} */\n            const options = { ...await getOptions(), logLevel: \"info\" };\n            if (taskOptions.onWatchRebuild) {\n                const onRebuild = taskOptions.onWatchRebuild;\n                options.plugins = (options.plugins?.slice(0) ?? []).concat([{\n                    name: \"watch\",\n                    setup: build => {\n                        let firstBuild = true;\n                        build.onEnd(() => {\n                            if (firstBuild) {\n                                firstBuild = false;\n                            }\n                            else {\n                                onRebuild();\n                            }\n                        });\n                    },\n                }]);\n            }\n\n            const ctx = await esbuild.context(options);\n            ctx.watch();\n        },\n    };\n}",
    "spans": [
      {
        "start": 12,
        "end": 80,
        "className": "syntax-comment"
      },
      {
        "start": 93,
        "end": 170,
        "className": "syntax-comment"
      },
      {
        "start": 183,
        "end": 262,
        "className": "syntax-comment"
      },
      {
        "start": 275,
        "end": 352,
        "className": "syntax-comment"
      },
      {
        "start": 365,
        "end": 409,
        "className": "syntax-comment"
      },
      {
        "start": 422,
        "end": 424,
        "className": "syntax-comment"
      },
      {
        "start": 437,
        "end": 515,
        "className": "syntax-comment"
      },
      {
        "start": 528,
        "end": 606,
        "className": "syntax-comment"
      },
      {
        "start": 619,
        "end": 659,
        "className": "syntax-comment"
      },
      {
        "start": 672,
        "end": 674,
        "className": "syntax-comment"
      },
      {
        "start": 687,
        "end": 739,
        "className": "syntax-comment"
      },
      {
        "start": 752,
        "end": 757,
        "className": "syntax-keyword"
      },
      {
        "start": 758,
        "end": 765,
        "className": "syntax-variable"
      },
      {
        "start": 766,
        "end": 767,
        "className": "syntax-operator"
      },
      {
        "start": 768,
        "end": 777,
        "className": "syntax-string"
      },
      {
        "start": 777,
        "end": 778,
        "className": "syntax-punctuation"
      },
      {
        "start": 791,
        "end": 796,
        "className": "syntax-keyword"
      },
      {
        "start": 797,
        "end": 805,
        "className": "syntax-variable"
      },
      {
        "start": 806,
        "end": 807,
        "className": "syntax-operator"
      },
      {
        "start": 808,
        "end": 811,
        "className": "syntax-string"
      },
      {
        "start": 811,
        "end": 812,
        "className": "syntax-punctuation"
      },
      {
        "start": 812,
        "end": 818,
        "className": "syntax-function"
      },
      {
        "start": 818,
        "end": 819,
        "className": "syntax-punctuation"
      },
      {
        "start": 819,
        "end": 826,
        "className": "syntax-variable"
      },
      {
        "start": 826,
        "end": 827,
        "className": "syntax-punctuation"
      },
      {
        "start": 827,
        "end": 833,
        "className": "syntax-property"
      },
      {
        "start": 833,
        "end": 835,
        "className": "syntax-punctuation"
      },
      {
        "start": 848,
        "end": 853,
        "className": "syntax-keyword"
      },
      {
        "start": 854,
        "end": 868,
        "className": "syntax-variable"
      },
      {
        "start": 869,
        "end": 870,
        "className": "syntax-operator"
      },
      {
        "start": 871,
        "end": 874,
        "className": "syntax-keyword"
      },
      {
        "start": 875,
        "end": 881,
        "className": "syntax-type"
      },
      {
        "start": 881,
        "end": 882,
        "className": "syntax-punctuation"
      },
      {
        "start": 882,
        "end": 890,
        "className": "syntax-variable"
      },
      {
        "start": 890,
        "end": 891,
        "className": "syntax-punctuation"
      },
      {
        "start": 892,
        "end": 895,
        "className": "syntax-string"
      },
      {
        "start": 895,
        "end": 897,
        "className": "syntax-punctuation"
      },
      {
        "start": 910,
        "end": 917,
        "className": "syntax-variable"
      },
      {
        "start": 917,
        "end": 918,
        "className": "syntax-punctuation"
      },
      {
        "start": 918,
        "end": 924,
        "className": "syntax-property"
      },
      {
        "start": 925,
        "end": 926,
        "className": "syntax-operator"
      },
      {
        "start": 927,
        "end": 928,
        "className": "syntax-punctuation"
      },
      {
        "start": 929,
        "end": 930,
        "className": "syntax-punctuation"
      },
      {
        "start": 930,
        "end": 937,
        "className": "syntax-variable"
      },
      {
        "start": 937,
        "end": 938,
        "className": "syntax-punctuation"
      },
      {
        "start": 940,
        "end": 948,
        "className": "syntax-variable"
      },
      {
        "start": 949,
        "end": 951,
        "className": "syntax-punctuation"
      },
      {
        "start": 965,
        "end": 1069,
        "className": "syntax-comment"
      },
      {
        "start": 1082,
        "end": 1174,
        "className": "syntax-comment"
      },
      {
        "start": 1187,
        "end": 1192,
        "className": "syntax-keyword"
      },
      {
        "start": 1193,
        "end": 1209,
        "className": "syntax-variable"
      },
      {
        "start": 1210,
        "end": 1211,
        "className": "syntax-operator"
      },
      {
        "start": 1212,
        "end": 1233,
        "className": "syntax-string"
      },
      {
        "start": 1233,
        "end": 1234,
        "className": "syntax-punctuation"
      },
      {
        "start": 1247,
        "end": 1252,
        "className": "syntax-keyword"
      },
      {
        "start": 1253,
        "end": 1280,
        "className": "syntax-variable"
      },
      {
        "start": 1281,
        "end": 1282,
        "className": "syntax-operator"
      },
      {
        "start": 1283,
        "end": 1379,
        "className": "syntax-string"
      },
      {
        "start": 1379,
        "end": 1380,
        "className": "syntax-punctuation"
      },
      {
        "start": 1394,
        "end": 1401,
        "className": "syntax-variable"
      },
      {
        "start": 1401,
        "end": 1402,
        "className": "syntax-punctuation"
      },
      {
        "start": 1402,
        "end": 1409,
        "className": "syntax-property"
      },
      {
        "start": 1410,
        "end": 1411,
        "className": "syntax-operator"
      },
      {
        "start": 1412,
        "end": 1419,
        "className": "syntax-variable"
      },
      {
        "start": 1419,
        "end": 1420,
        "className": "syntax-punctuation"
      },
      {
        "start": 1420,
        "end": 1427,
        "className": "syntax-property"
      },
      {
        "start": 1428,
        "end": 1430,
        "className": "syntax-operator"
      },
      {
        "start": 1431,
        "end": 1434,
        "className": "syntax-punctuation"
      },
      {
        "start": 1447,
        "end": 1454,
        "className": "syntax-variable"
      },
      {
        "start": 1454,
        "end": 1455,
        "className": "syntax-punctuation"
      },
      {
        "start": 1455,
        "end": 1462,
        "className": "syntax-property"
      },
      {
        "start": 1462,
        "end": 1463,
        "className": "syntax-punctuation"
      },
      {
        "start": 1463,
        "end": 1467,
        "className": "syntax-function"
      },
      {
        "start": 1467,
        "end": 1468,
        "className": "syntax-punctuation"
      },
      {
        "start": 1485,
        "end": 1486,
        "className": "syntax-punctuation"
      },
      {
        "start": 1507,
        "end": 1511,
        "className": "syntax-property"
      },
      {
        "start": 1513,
        "end": 1527,
        "className": "syntax-string"
      },
      {
        "start": 1527,
        "end": 1528,
        "className": "syntax-punctuation"
      },
      {
        "start": 1549,
        "end": 1554,
        "className": "syntax-function"
      },
      {
        "start": 1556,
        "end": 1561,
        "className": "syntax-variable"
      },
      {
        "start": 1562,
        "end": 1564,
        "className": "syntax-operator"
      },
      {
        "start": 1565,
        "end": 1566,
        "className": "syntax-punctuation"
      },
      {
        "start": 1591,
        "end": 1596,
        "className": "syntax-variable"
      },
      {
        "start": 1596,
        "end": 1597,
        "className": "syntax-punctuation"
      },
      {
        "start": 1597,
        "end": 1602,
        "className": "syntax-function"
      },
      {
        "start": 1602,
        "end": 1603,
        "className": "syntax-punctuation"
      },
      {
        "start": 1603,
        "end": 1608,
        "className": "syntax-keyword"
      },
      {
        "start": 1609,
        "end": 1611,
        "className": "syntax-punctuation"
      },
      {
        "start": 1612,
        "end": 1614,
        "className": "syntax-operator"
      },
      {
        "start": 1615,
        "end": 1616,
        "className": "syntax-punctuation"
      },
      {
        "start": 1645,
        "end": 1648,
        "className": "syntax-keyword"
      },
      {
        "start": 1649,
        "end": 1657,
        "className": "syntax-variable"
      },
      {
        "start": 1658,
        "end": 1659,
        "className": "syntax-operator"
      },
      {
        "start": 1660,
        "end": 1665,
        "className": "syntax-keyword"
      },
      {
        "start": 1666,
        "end": 1668,
        "className": "syntax-variable"
      },
      {
        "start": 1668,
        "end": 1669,
        "className": "syntax-punctuation"
      },
      {
        "start": 1669,
        "end": 1677,
        "className": "syntax-property"
      },
      {
        "start": 1677,
        "end": 1678,
        "className": "syntax-punctuation"
      },
      {
        "start": 1678,
        "end": 1686,
        "className": "syntax-function"
      },
      {
        "start": 1686,
        "end": 1687,
        "className": "syntax-punctuation"
      },
      {
        "start": 1687,
        "end": 1694,
        "className": "syntax-variable"
      },
      {
        "start": 1694,
        "end": 1695,
        "className": "syntax-punctuation"
      },
      {
        "start": 1696,
        "end": 1703,
        "className": "syntax-string"
      },
      {
        "start": 1703,
        "end": 1705,
        "className": "syntax-punctuation"
      },
      {
        "start": 1734,
        "end": 1742,
        "className": "syntax-variable"
      },
      {
        "start": 1743,
        "end": 1744,
        "className": "syntax-operator"
      },
      {
        "start": 1745,
        "end": 1753,
        "className": "syntax-variable"
      },
      {
        "start": 1753,
        "end": 1754,
        "className": "syntax-punctuation"
      },
      {
        "start": 1754,
        "end": 1761,
        "className": "syntax-function"
      },
      {
        "start": 1761,
        "end": 1762,
        "className": "syntax-punctuation"
      },
      {
        "start": 1762,
        "end": 1776,
        "className": "syntax-variable"
      },
      {
        "start": 1776,
        "end": 1777,
        "className": "syntax-punctuation"
      },
      {
        "start": 1778,
        "end": 1785,
        "className": "syntax-variable"
      },
      {
        "start": 1785,
        "end": 1787,
        "className": "syntax-punctuation"
      },
      {
        "start": 1816,
        "end": 1819,
        "className": "syntax-keyword"
      },
      {
        "start": 1820,
        "end": 1827,
        "className": "syntax-variable"
      },
      {
        "start": 1828,
        "end": 1829,
        "className": "syntax-operator"
      },
      {
        "start": 1830,
        "end": 1831,
        "className": "syntax-number"
      },
      {
        "start": 1831,
        "end": 1832,
        "className": "syntax-punctuation"
      },
      {
        "start": 1861,
        "end": 1869,
        "className": "syntax-variable"
      },
      {
        "start": 1870,
        "end": 1871,
        "className": "syntax-operator"
      },
      {
        "start": 1872,
        "end": 1880,
        "className": "syntax-variable"
      },
      {
        "start": 1880,
        "end": 1881,
        "className": "syntax-punctuation"
      },
      {
        "start": 1881,
        "end": 1888,
        "className": "syntax-function"
      },
      {
        "start": 1888,
        "end": 1889,
        "className": "syntax-punctuation"
      },
      {
        "start": 1889,
        "end": 1905,
        "className": "syntax-variable"
      },
      {
        "start": 1905,
        "end": 1906,
        "className": "syntax-punctuation"
      },
      {
        "start": 1907,
        "end": 1909,
        "className": "syntax-punctuation"
      },
      {
        "start": 1910,
        "end": 1912,
        "className": "syntax-operator"
      },
      {
        "start": 1913,
        "end": 1914,
        "className": "syntax-punctuation"
      },
      {
        "start": 1947,
        "end": 1954,
        "className": "syntax-variable"
      },
      {
        "start": 1954,
        "end": 1956,
        "className": "syntax-operator"
      },
      {
        "start": 1956,
        "end": 1957,
        "className": "syntax-punctuation"
      },
      {
        "start": 1990,
        "end": 1996,
        "className": "syntax-keyword"
      },
      {
        "start": 1997,
        "end": 2024,
        "className": "syntax-variable"
      },
      {
        "start": 2024,
        "end": 2025,
        "className": "syntax-punctuation"
      },
      {
        "start": 2054,
        "end": 2057,
        "className": "syntax-punctuation"
      },
      {
        "start": 2086,
        "end": 2092,
        "className": "syntax-function"
      },
      {
        "start": 2092,
        "end": 2093,
        "className": "syntax-punctuation"
      },
      {
        "start": 2093,
        "end": 2100,
        "className": "syntax-variable"
      },
      {
        "start": 2101,
        "end": 2104,
        "className": "syntax-operator"
      },
      {
        "start": 2105,
        "end": 2106,
        "className": "syntax-number"
      },
      {
        "start": 2106,
        "end": 2107,
        "className": "syntax-punctuation"
      },
      {
        "start": 2108,
        "end": 2153,
        "className": "syntax-string"
      },
      {
        "start": 2153,
        "end": 2155,
        "className": "syntax-punctuation"
      },
      {
        "start": 2184,
        "end": 2189,
        "className": "syntax-keyword"
      },
      {
        "start": 2190,
        "end": 2192,
        "className": "syntax-variable"
      },
      {
        "start": 2192,
        "end": 2193,
        "className": "syntax-punctuation"
      },
      {
        "start": 2193,
        "end": 2201,
        "className": "syntax-property"
      },
      {
        "start": 2201,
        "end": 2202,
        "className": "syntax-punctuation"
      },
      {
        "start": 2202,
        "end": 2211,
        "className": "syntax-function"
      },
      {
        "start": 2211,
        "end": 2212,
        "className": "syntax-punctuation"
      },
      {
        "start": 2212,
        "end": 2219,
        "className": "syntax-variable"
      },
      {
        "start": 2219,
        "end": 2220,
        "className": "syntax-punctuation"
      },
      {
        "start": 2221,
        "end": 2229,
        "className": "syntax-variable"
      },
      {
        "start": 2229,
        "end": 2231,
        "className": "syntax-punctuation"
      },
      {
        "start": 2256,
        "end": 2259,
        "className": "syntax-punctuation"
      },
      {
        "start": 2280,
        "end": 2282,
        "className": "syntax-punctuation"
      },
      {
        "start": 2299,
        "end": 2301,
        "className": "syntax-punctuation"
      },
      {
        "start": 2314,
        "end": 2316,
        "className": "syntax-punctuation"
      },
      {
        "start": 2325,
        "end": 2326,
        "className": "syntax-punctuation"
      },
      {
        "start": 2336,
        "end": 2342,
        "className": "syntax-keyword"
      },
      {
        "start": 2343,
        "end": 2350,
        "className": "syntax-variable"
      },
      {
        "start": 2350,
        "end": 2351,
        "className": "syntax-punctuation"
      },
      {
        "start": 2356,
        "end": 2359,
        "className": "syntax-punctuation"
      },
      {
        "start": 2365,
        "end": 2371,
        "className": "syntax-keyword"
      },
      {
        "start": 2372,
        "end": 2373,
        "className": "syntax-punctuation"
      },
      {
        "start": 2382,
        "end": 2387,
        "className": "syntax-function"
      },
      {
        "start": 2389,
        "end": 2394,
        "className": "syntax-keyword"
      },
      {
        "start": 2395,
        "end": 2397,
        "className": "syntax-punctuation"
      },
      {
        "start": 2398,
        "end": 2400,
        "className": "syntax-operator"
      },
      {
        "start": 2401,
        "end": 2408,
        "className": "syntax-variable"
      },
      {
        "start": 2408,
        "end": 2409,
        "className": "syntax-punctuation"
      },
      {
        "start": 2409,
        "end": 2414,
        "className": "syntax-function"
      },
      {
        "start": 2414,
        "end": 2415,
        "className": "syntax-punctuation"
      },
      {
        "start": 2415,
        "end": 2420,
        "className": "syntax-keyword"
      },
      {
        "start": 2421,
        "end": 2431,
        "className": "syntax-function"
      },
      {
        "start": 2431,
        "end": 2435,
        "className": "syntax-punctuation"
      },
      {
        "start": 2444,
        "end": 2449,
        "className": "syntax-function"
      },
      {
        "start": 2451,
        "end": 2456,
        "className": "syntax-keyword"
      },
      {
        "start": 2457,
        "end": 2459,
        "className": "syntax-punctuation"
      },
      {
        "start": 2460,
        "end": 2462,
        "className": "syntax-operator"
      },
      {
        "start": 2463,
        "end": 2464,
        "className": "syntax-punctuation"
      },
      {
        "start": 2477,
        "end": 2512,
        "className": "syntax-comment"
      },
      {
        "start": 2525,
        "end": 2530,
        "className": "syntax-keyword"
      },
      {
        "start": 2531,
        "end": 2538,
        "className": "syntax-variable"
      },
      {
        "start": 2539,
        "end": 2540,
        "className": "syntax-operator"
      },
      {
        "start": 2541,
        "end": 2542,
        "className": "syntax-punctuation"
      },
      {
        "start": 2546,
        "end": 2551,
        "className": "syntax-keyword"
      },
      {
        "start": 2552,
        "end": 2562,
        "className": "syntax-function"
      },
      {
        "start": 2562,
        "end": 2565,
        "className": "syntax-punctuation"
      },
      {
        "start": 2566,
        "end": 2574,
        "className": "syntax-property"
      },
      {
        "start": 2576,
        "end": 2582,
        "className": "syntax-string"
      },
      {
        "start": 2583,
        "end": 2585,
        "className": "syntax-punctuation"
      },
      {
        "start": 2598,
        "end": 2600,
        "className": "syntax-keyword"
      },
      {
        "start": 2601,
        "end": 2602,
        "className": "syntax-punctuation"
      },
      {
        "start": 2602,
        "end": 2613,
        "className": "syntax-variable"
      },
      {
        "start": 2613,
        "end": 2614,
        "className": "syntax-punctuation"
      },
      {
        "start": 2614,
        "end": 2628,
        "className": "syntax-property"
      },
      {
        "start": 2628,
        "end": 2629,
        "className": "syntax-punctuation"
      },
      {
        "start": 2630,
        "end": 2631,
        "className": "syntax-punctuation"
      },
      {
        "start": 2648,
        "end": 2653,
        "className": "syntax-keyword"
      },
      {
        "start": 2654,
        "end": 2663,
        "className": "syntax-variable"
      },
      {
        "start": 2664,
        "end": 2665,
        "className": "syntax-operator"
      },
      {
        "start": 2666,
        "end": 2677,
        "className": "syntax-variable"
      },
      {
        "start": 2677,
        "end": 2678,
        "className": "syntax-punctuation"
      },
      {
        "start": 2678,
        "end": 2692,
        "className": "syntax-property"
      },
      {
        "start": 2692,
        "end": 2693,
        "className": "syntax-punctuation"
      },
      {
        "start": 2710,
        "end": 2717,
        "className": "syntax-variable"
      },
      {
        "start": 2717,
        "end": 2718,
        "className": "syntax-punctuation"
      },
      {
        "start": 2718,
        "end": 2725,
        "className": "syntax-property"
      },
      {
        "start": 2726,
        "end": 2727,
        "className": "syntax-operator"
      },
      {
        "start": 2728,
        "end": 2729,
        "className": "syntax-punctuation"
      },
      {
        "start": 2729,
        "end": 2736,
        "className": "syntax-variable"
      },
      {
        "start": 2736,
        "end": 2737,
        "className": "syntax-punctuation"
      },
      {
        "start": 2737,
        "end": 2744,
        "className": "syntax-property"
      },
      {
        "start": 2744,
        "end": 2746,
        "className": "syntax-punctuation"
      },
      {
        "start": 2746,
        "end": 2751,
        "className": "syntax-function"
      },
      {
        "start": 2751,
        "end": 2752,
        "className": "syntax-punctuation"
      },
      {
        "start": 2752,
        "end": 2753,
        "className": "syntax-number"
      },
      {
        "start": 2753,
        "end": 2754,
        "className": "syntax-punctuation"
      },
      {
        "start": 2755,
        "end": 2757,
        "className": "syntax-operator"
      },
      {
        "start": 2758,
        "end": 2762,
        "className": "syntax-punctuation"
      },
      {
        "start": 2762,
        "end": 2768,
        "className": "syntax-function"
      },
      {
        "start": 2768,
        "end": 2771,
        "className": "syntax-punctuation"
      },
      {
        "start": 2792,
        "end": 2796,
        "className": "syntax-property"
      },
      {
        "start": 2798,
        "end": 2805,
        "className": "syntax-string"
      },
      {
        "start": 2805,
        "end": 2806,
        "className": "syntax-punctuation"
      },
      {
        "start": 2827,
        "end": 2832,
        "className": "syntax-function"
      },
      {
        "start": 2834,
        "end": 2839,
        "className": "syntax-variable"
      },
      {
        "start": 2840,
        "end": 2842,
        "className": "syntax-operator"
      },
      {
        "start": 2843,
        "end": 2844,
        "className": "syntax-punctuation"
      },
      {
        "start": 2869,
        "end": 2872,
        "className": "syntax-keyword"
      },
      {
        "start": 2873,
        "end": 2883,
        "className": "syntax-variable"
      },
      {
        "start": 2884,
        "end": 2885,
        "className": "syntax-operator"
      },
      {
        "start": 2886,
        "end": 2890,
        "className": "syntax-constant"
      },
      {
        "start": 2890,
        "end": 2891,
        "className": "syntax-punctuation"
      },
      {
        "start": 2916,
        "end": 2921,
        "className": "syntax-variable"
      },
      {
        "start": 2921,
        "end": 2922,
        "className": "syntax-punctuation"
      },
      {
        "start": 2922,
        "end": 2927,
        "className": "syntax-function"
      },
      {
        "start": 2927,
        "end": 2930,
        "className": "syntax-punctuation"
      },
      {
        "start": 2931,
        "end": 2933,
        "className": "syntax-operator"
      },
      {
        "start": 2934,
        "end": 2935,
        "className": "syntax-punctuation"
      },
      {
        "start": 2964,
        "end": 2966,
        "className": "syntax-keyword"
      },
      {
        "start": 2967,
        "end": 2968,
        "className": "syntax-punctuation"
      },
      {
        "start": 2968,
        "end": 2978,
        "className": "syntax-variable"
      },
      {
        "start": 2978,
        "end": 2979,
        "className": "syntax-punctuation"
      },
      {
        "start": 2980,
        "end": 2981,
        "className": "syntax-punctuation"
      },
      {
        "start": 3014,
        "end": 3024,
        "className": "syntax-variable"
      },
      {
        "start": 3025,
        "end": 3026,
        "className": "syntax-operator"
      },
      {
        "start": 3027,
        "end": 3032,
        "className": "syntax-constant"
      },
      {
        "start": 3032,
        "end": 3033,
        "className": "syntax-punctuation"
      },
      {
        "start": 3062,
        "end": 3063,
        "className": "syntax-punctuation"
      },
      {
        "start": 3092,
        "end": 3096,
        "className": "syntax-keyword"
      },
      {
        "start": 3097,
        "end": 3098,
        "className": "syntax-punctuation"
      },
      {
        "start": 3131,
        "end": 3140,
        "className": "syntax-variable"
      },
      {
        "start": 3140,
        "end": 3143,
        "className": "syntax-punctuation"
      },
      {
        "start": 3172,
        "end": 3173,
        "className": "syntax-punctuation"
      },
      {
        "start": 3198,
        "end": 3201,
        "className": "syntax-punctuation"
      },
      {
        "start": 3222,
        "end": 3224,
        "className": "syntax-punctuation"
      },
      {
        "start": 3241,
        "end": 3245,
        "className": "syntax-punctuation"
      },
      {
        "start": 3258,
        "end": 3259,
        "className": "syntax-punctuation"
      },
      {
        "start": 3273,
        "end": 3278,
        "className": "syntax-keyword"
      },
      {
        "start": 3279,
        "end": 3282,
        "className": "syntax-variable"
      },
      {
        "start": 3283,
        "end": 3284,
        "className": "syntax-operator"
      },
      {
        "start": 3285,
        "end": 3290,
        "className": "syntax-keyword"
      },
      {
        "start": 3291,
        "end": 3298,
        "className": "syntax-variable"
      },
      {
        "start": 3298,
        "end": 3299,
        "className": "syntax-punctuation"
      },
      {
        "start": 3299,
        "end": 3306,
        "className": "syntax-function"
      },
      {
        "start": 3306,
        "end": 3307,
        "className": "syntax-punctuation"
      },
      {
        "start": 3307,
        "end": 3314,
        "className": "syntax-variable"
      },
      {
        "start": 3314,
        "end": 3316,
        "className": "syntax-punctuation"
      },
      {
        "start": 3329,
        "end": 3332,
        "className": "syntax-variable"
      },
      {
        "start": 3332,
        "end": 3333,
        "className": "syntax-punctuation"
      },
      {
        "start": 3333,
        "end": 3338,
        "className": "syntax-function"
      },
      {
        "start": 3338,
        "end": 3341,
        "className": "syntax-punctuation"
      },
      {
        "start": 3350,
        "end": 3352,
        "className": "syntax-punctuation"
      },
      {
        "start": 3357,
        "end": 3359,
        "className": "syntax-punctuation"
      },
      {
        "start": 3360,
        "end": 3361,
        "className": "syntax-punctuation"
      }
    ]
  },
  {
    "language": "lua",
    "name": "lua/neovim_diagnostic_list.lua",
    "code": "--- @param title string\n--- @return integer?\nlocal function get_qf_id_for_title(title)\n  local lastqflist = vim.fn.getqflist({ nr = '$' })\n  for i = 1, lastqflist.nr do\n    local qflist = vim.fn.getqflist({ nr = i, id = 0, title = 0 })\n    if qflist.title == title then\n      return qflist.id\n    end\n  end\n\n  return nil\nend\n\n--- @param loclist boolean\n--- @param opts? vim.diagnostic.setqflist.Opts|vim.diagnostic.setloclist.Opts\nlocal function set_list(loclist, opts)\n  opts = opts or {}\n  local open = vim.nonnil(opts.open, true)\n  local title = opts.title or 'Diagnostics'\n  local winnr = opts.winnr or 0\n  local bufnr --- @type integer?\n  if loclist then\n    bufnr = api.nvim_win_get_buf(winnr)\n  end\n\n  -- Don't clamp line numbers since the quickfix list can already handle line\n  -- numbers beyond the end of the buffer\n  local diagnostics = M._store.get_diagnostics(bufnr, opts --[[@as vim.diagnostic.GetOpts]], false)\n  if opts.format then\n    diagnostics = require('vim.diagnostic._shared').reformat_diagnostics(opts.format, diagnostics)\n  end\n  local items = M.toqflist(diagnostics)\n  local qf_id = nil\n  if loclist then\n    vim.fn.setloclist(winnr, {}, 'u', { title = title, items = items })\n  else\n    qf_id = get_qf_id_for_title(title)\n    -- If we already have a diagnostics quickfix, update it rather than creating a new one.\n    -- This avoids polluting the finite set of quickfix lists, and preserves the currently selected\n    -- entry.\n    vim.fn.setqflist({}, qf_id and 'u' or ' ', {\n      title = title,\n      items = items,\n      id = qf_id,\n    })\n  end\n\n  if open then\n    if not loclist then\n      -- First navigate to the diagnostics quickfix list.\n      local qflist = vim.fn.getqflist({ id = qf_id, nr = 0 }) --- @type { nr: integer }\n      local nr = qflist.nr\n      api.nvim_command(('silent %dchistory'):format(nr))\n      -- Now open the quickfix list.\n      api.nvim_command('botright cwindow')\n    else\n      api.nvim_command('lwindow')\n    end\n  end\nend\n\n--- Configuration table with the following keys:\n--- @class vim.diagnostic.setqflist.Opts\n--- @inlinedoc\n---\n--- Only add diagnostics from the given namespace(s).\n--- @field namespace? integer[]|integer\n---\n--- Open quickfix list after setting.\n--- (default: `true`)\n--- @field open? boolean\n---\n--- Title of quickfix list. Defaults to \"Diagnostics\". If there's already a quickfix list with this\n--- title, it's updated. If not, a new quickfix list is created.\n--- @field title? string\n---\n--- See |diagnostic-severity|.\n--- @field severity? vim.diagnostic.SeverityFilter\n---\n--- A function that takes a diagnostic as input and returns a string or nil.\n--- If the return value is nil, the diagnostic is not displayed in the quickfix list.\n--- Else the output text is used to display the diagnostic.\n--- @field format? fun(diagnostic:vim.Diagnostic): string?\n\n--- Add all diagnostics to the quickfix list.",
    "spans": [
      {
        "start": 0,
        "end": 23,
        "className": "syntax-comment"
      },
      {
        "start": 24,
        "end": 44,
        "className": "syntax-comment"
      },
      {
        "start": 45,
        "end": 50,
        "className": "syntax-keyword"
      },
      {
        "start": 51,
        "end": 59,
        "className": "syntax-keyword"
      },
      {
        "start": 60,
        "end": 79,
        "className": "syntax-function"
      },
      {
        "start": 79,
        "end": 80,
        "className": "syntax-punctuation"
      },
      {
        "start": 85,
        "end": 86,
        "className": "syntax-punctuation"
      },
      {
        "start": 89,
        "end": 94,
        "className": "syntax-keyword"
      },
      {
        "start": 95,
        "end": 105,
        "className": "syntax-variable"
      },
      {
        "start": 106,
        "end": 107,
        "className": "syntax-operator"
      },
      {
        "start": 108,
        "end": 111,
        "className": "syntax-variable"
      },
      {
        "start": 111,
        "end": 112,
        "className": "syntax-punctuation"
      },
      {
        "start": 114,
        "end": 115,
        "className": "syntax-punctuation"
      },
      {
        "start": 115,
        "end": 124,
        "className": "syntax-function"
      },
      {
        "start": 124,
        "end": 125,
        "className": "syntax-punctuation"
      },
      {
        "start": 125,
        "end": 126,
        "className": "syntax-type"
      },
      {
        "start": 130,
        "end": 131,
        "className": "syntax-operator"
      },
      {
        "start": 132,
        "end": 135,
        "className": "syntax-string"
      },
      {
        "start": 136,
        "end": 137,
        "className": "syntax-type"
      },
      {
        "start": 137,
        "end": 138,
        "className": "syntax-punctuation"
      },
      {
        "start": 145,
        "end": 146,
        "className": "syntax-variable"
      },
      {
        "start": 147,
        "end": 148,
        "className": "syntax-operator"
      },
      {
        "start": 149,
        "end": 150,
        "className": "syntax-number"
      },
      {
        "start": 150,
        "end": 151,
        "className": "syntax-punctuation"
      },
      {
        "start": 152,
        "end": 162,
        "className": "syntax-variable"
      },
      {
        "start": 162,
        "end": 163,
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
        "end": 191,
        "className": "syntax-variable"
      },
      {
        "start": 191,
        "end": 192,
        "className": "syntax-punctuation"
      },
      {
        "start": 194,
        "end": 195,
        "className": "syntax-punctuation"
      },
      {
        "start": 195,
        "end": 204,
        "className": "syntax-function"
      },
      {
        "start": 204,
        "end": 205,
        "className": "syntax-punctuation"
      },
      {
        "start": 205,
        "end": 206,
        "className": "syntax-type"
      },
      {
        "start": 210,
        "end": 211,
        "className": "syntax-operator"
      },
      {
        "start": 212,
        "end": 213,
        "className": "syntax-variable"
      },
      {
        "start": 213,
        "end": 214,
        "className": "syntax-punctuation"
      },
      {
        "start": 218,
        "end": 219,
        "className": "syntax-operator"
      },
      {
        "start": 220,
        "end": 221,
        "className": "syntax-number"
      },
      {
        "start": 221,
        "end": 222,
        "className": "syntax-punctuation"
      },
      {
        "start": 229,
        "end": 230,
        "className": "syntax-operator"
      },
      {
        "start": 231,
        "end": 232,
        "className": "syntax-number"
      },
      {
        "start": 233,
        "end": 234,
        "className": "syntax-type"
      },
      {
        "start": 234,
        "end": 235,
        "className": "syntax-punctuation"
      },
      {
        "start": 243,
        "end": 249,
        "className": "syntax-variable"
      },
      {
        "start": 249,
        "end": 250,
        "className": "syntax-punctuation"
      },
      {
        "start": 256,
        "end": 258,
        "className": "syntax-operator"
      },
      {
        "start": 259,
        "end": 264,
        "className": "syntax-variable"
      },
      {
        "start": 276,
        "end": 282,
        "className": "syntax-keyword"
      },
      {
        "start": 283,
        "end": 289,
        "className": "syntax-variable"
      },
      {
        "start": 289,
        "end": 290,
        "className": "syntax-punctuation"
      },
      {
        "start": 310,
        "end": 316,
        "className": "syntax-keyword"
      },
      {
        "start": 317,
        "end": 320,
        "className": "syntax-constant"
      },
      {
        "start": 321,
        "end": 324,
        "className": "syntax-keyword"
      },
      {
        "start": 326,
        "end": 352,
        "className": "syntax-comment"
      },
      {
        "start": 353,
        "end": 430,
        "className": "syntax-comment"
      },
      {
        "start": 431,
        "end": 436,
        "className": "syntax-keyword"
      },
      {
        "start": 437,
        "end": 445,
        "className": "syntax-keyword"
      },
      {
        "start": 446,
        "end": 454,
        "className": "syntax-function"
      },
      {
        "start": 454,
        "end": 455,
        "className": "syntax-punctuation"
      },
      {
        "start": 462,
        "end": 463,
        "className": "syntax-punctuation"
      },
      {
        "start": 468,
        "end": 469,
        "className": "syntax-punctuation"
      },
      {
        "start": 472,
        "end": 476,
        "className": "syntax-variable"
      },
      {
        "start": 477,
        "end": 478,
        "className": "syntax-operator"
      },
      {
        "start": 479,
        "end": 483,
        "className": "syntax-variable"
      },
      {
        "start": 484,
        "end": 486,
        "className": "syntax-keyword"
      },
      {
        "start": 487,
        "end": 489,
        "className": "syntax-type"
      },
      {
        "start": 492,
        "end": 497,
        "className": "syntax-keyword"
      },
      {
        "start": 498,
        "end": 502,
        "className": "syntax-variable"
      },
      {
        "start": 503,
        "end": 504,
        "className": "syntax-operator"
      },
      {
        "start": 505,
        "end": 508,
        "className": "syntax-variable"
      },
      {
        "start": 508,
        "end": 509,
        "className": "syntax-punctuation"
      },
      {
        "start": 509,
        "end": 515,
        "className": "syntax-function"
      },
      {
        "start": 515,
        "end": 516,
        "className": "syntax-punctuation"
      },
      {
        "start": 516,
        "end": 520,
        "className": "syntax-variable"
      },
      {
        "start": 520,
        "end": 521,
        "className": "syntax-punctuation"
      },
      {
        "start": 521,
        "end": 525,
        "className": "syntax-variable"
      },
      {
        "start": 525,
        "end": 526,
        "className": "syntax-punctuation"
      },
      {
        "start": 531,
        "end": 532,
        "className": "syntax-punctuation"
      },
      {
        "start": 535,
        "end": 540,
        "className": "syntax-keyword"
      },
      {
        "start": 541,
        "end": 546,
        "className": "syntax-variable"
      },
      {
        "start": 547,
        "end": 548,
        "className": "syntax-operator"
      },
      {
        "start": 549,
        "end": 553,
        "className": "syntax-variable"
      },
      {
        "start": 553,
        "end": 554,
        "className": "syntax-punctuation"
      },
      {
        "start": 554,
        "end": 559,
        "className": "syntax-variable"
      },
      {
        "start": 560,
        "end": 562,
        "className": "syntax-keyword"
      },
      {
        "start": 563,
        "end": 576,
        "className": "syntax-string"
      },
      {
        "start": 579,
        "end": 584,
        "className": "syntax-keyword"
      },
      {
        "start": 585,
        "end": 590,
        "className": "syntax-variable"
      },
      {
        "start": 591,
        "end": 592,
        "className": "syntax-operator"
      },
      {
        "start": 593,
        "end": 597,
        "className": "syntax-variable"
      },
      {
        "start": 597,
        "end": 598,
        "className": "syntax-punctuation"
      },
      {
        "start": 598,
        "end": 603,
        "className": "syntax-variable"
      },
      {
        "start": 604,
        "end": 606,
        "className": "syntax-keyword"
      },
      {
        "start": 607,
        "end": 608,
        "className": "syntax-number"
      },
      {
        "start": 611,
        "end": 616,
        "className": "syntax-keyword"
      },
      {
        "start": 617,
        "end": 622,
        "className": "syntax-variable"
      },
      {
        "start": 623,
        "end": 641,
        "className": "syntax-comment"
      },
      {
        "start": 647,
        "end": 654,
        "className": "syntax-variable"
      },
      {
        "start": 664,
        "end": 669,
        "className": "syntax-variable"
      },
      {
        "start": 670,
        "end": 671,
        "className": "syntax-operator"
      },
      {
        "start": 672,
        "end": 675,
        "className": "syntax-variable"
      },
      {
        "start": 675,
        "end": 676,
        "className": "syntax-punctuation"
      },
      {
        "start": 676,
        "end": 692,
        "className": "syntax-function"
      },
      {
        "start": 692,
        "end": 693,
        "className": "syntax-punctuation"
      },
      {
        "start": 693,
        "end": 698,
        "className": "syntax-variable"
      },
      {
        "start": 698,
        "end": 699,
        "className": "syntax-punctuation"
      },
      {
        "start": 709,
        "end": 784,
        "className": "syntax-comment"
      },
      {
        "start": 787,
        "end": 826,
        "className": "syntax-comment"
      },
      {
        "start": 829,
        "end": 834,
        "className": "syntax-keyword"
      },
      {
        "start": 835,
        "end": 846,
        "className": "syntax-variable"
      },
      {
        "start": 847,
        "end": 848,
        "className": "syntax-operator"
      },
      {
        "start": 849,
        "end": 850,
        "className": "syntax-constant"
      },
      {
        "start": 850,
        "end": 851,
        "className": "syntax-punctuation"
      },
      {
        "start": 857,
        "end": 858,
        "className": "syntax-punctuation"
      },
      {
        "start": 858,
        "end": 873,
        "className": "syntax-function"
      },
      {
        "start": 873,
        "end": 874,
        "className": "syntax-punctuation"
      },
      {
        "start": 874,
        "end": 879,
        "className": "syntax-variable"
      },
      {
        "start": 879,
        "end": 880,
        "className": "syntax-punctuation"
      },
      {
        "start": 881,
        "end": 885,
        "className": "syntax-variable"
      },
      {
        "start": 886,
        "end": 918,
        "className": "syntax-comment"
      },
      {
        "start": 918,
        "end": 919,
        "className": "syntax-punctuation"
      },
      {
        "start": 925,
        "end": 926,
        "className": "syntax-punctuation"
      },
      {
        "start": 932,
        "end": 936,
        "className": "syntax-variable"
      },
      {
        "start": 936,
        "end": 937,
        "className": "syntax-punctuation"
      },
      {
        "start": 953,
        "end": 964,
        "className": "syntax-variable"
      },
      {
        "start": 965,
        "end": 966,
        "className": "syntax-operator"
      },
      {
        "start": 967,
        "end": 974,
        "className": "syntax-function"
      },
      {
        "start": 974,
        "end": 975,
        "className": "syntax-punctuation"
      },
      {
        "start": 975,
        "end": 999,
        "className": "syntax-string"
      },
      {
        "start": 999,
        "end": 1001,
        "className": "syntax-punctuation"
      },
      {
        "start": 1001,
        "end": 1021,
        "className": "syntax-function"
      },
      {
        "start": 1021,
        "end": 1022,
        "className": "syntax-punctuation"
      },
      {
        "start": 1022,
        "end": 1026,
        "className": "syntax-variable"
      },
      {
        "start": 1026,
        "end": 1027,
        "className": "syntax-punctuation"
      },
      {
        "start": 1033,
        "end": 1034,
        "className": "syntax-punctuation"
      },
      {
        "start": 1035,
        "end": 1046,
        "className": "syntax-variable"
      },
      {
        "start": 1046,
        "end": 1047,
        "className": "syntax-punctuation"
      },
      {
        "start": 1056,
        "end": 1061,
        "className": "syntax-keyword"
      },
      {
        "start": 1062,
        "end": 1067,
        "className": "syntax-variable"
      },
      {
        "start": 1068,
        "end": 1069,
        "className": "syntax-operator"
      },
      {
        "start": 1070,
        "end": 1071,
        "className": "syntax-constant"
      },
      {
        "start": 1071,
        "end": 1072,
        "className": "syntax-punctuation"
      },
      {
        "start": 1072,
        "end": 1080,
        "className": "syntax-function"
      },
      {
        "start": 1080,
        "end": 1081,
        "className": "syntax-punctuation"
      },
      {
        "start": 1081,
        "end": 1092,
        "className": "syntax-variable"
      },
      {
        "start": 1092,
        "end": 1093,
        "className": "syntax-punctuation"
      },
      {
        "start": 1096,
        "end": 1101,
        "className": "syntax-keyword"
      },
      {
        "start": 1102,
        "end": 1107,
        "className": "syntax-variable"
      },
      {
        "start": 1108,
        "end": 1109,
        "className": "syntax-operator"
      },
      {
        "start": 1110,
        "end": 1113,
        "className": "syntax-constant"
      },
      {
        "start": 1119,
        "end": 1126,
        "className": "syntax-variable"
      },
      {
        "start": 1136,
        "end": 1139,
        "className": "syntax-variable"
      },
      {
        "start": 1139,
        "end": 1140,
        "className": "syntax-punctuation"
      },
      {
        "start": 1142,
        "end": 1143,
        "className": "syntax-punctuation"
      },
      {
        "start": 1143,
        "end": 1153,
        "className": "syntax-function"
      },
      {
        "start": 1153,
        "end": 1154,
        "className": "syntax-punctuation"
      },
      {
        "start": 1154,
        "end": 1159,
        "className": "syntax-variable"
      },
      {
        "start": 1159,
        "end": 1160,
        "className": "syntax-punctuation"
      },
      {
        "start": 1161,
        "end": 1163,
        "className": "syntax-type"
      },
      {
        "start": 1163,
        "end": 1164,
        "className": "syntax-punctuation"
      },
      {
        "start": 1165,
        "end": 1168,
        "className": "syntax-string"
      },
      {
        "start": 1168,
        "end": 1169,
        "className": "syntax-punctuation"
      },
      {
        "start": 1170,
        "end": 1171,
        "className": "syntax-type"
      },
      {
        "start": 1172,
        "end": 1177,
        "className": "syntax-variable"
      },
      {
        "start": 1178,
        "end": 1179,
        "className": "syntax-operator"
      },
      {
        "start": 1180,
        "end": 1185,
        "className": "syntax-variable"
      },
      {
        "start": 1185,
        "end": 1186,
        "className": "syntax-punctuation"
      },
      {
        "start": 1187,
        "end": 1192,
        "className": "syntax-variable"
      },
      {
        "start": 1193,
        "end": 1194,
        "className": "syntax-operator"
      },
      {
        "start": 1195,
        "end": 1200,
        "className": "syntax-variable"
      },
      {
        "start": 1201,
        "end": 1202,
        "className": "syntax-type"
      },
      {
        "start": 1202,
        "end": 1203,
        "className": "syntax-punctuation"
      },
      {
        "start": 1215,
        "end": 1220,
        "className": "syntax-variable"
      },
      {
        "start": 1221,
        "end": 1222,
        "className": "syntax-operator"
      },
      {
        "start": 1223,
        "end": 1242,
        "className": "syntax-function"
      },
      {
        "start": 1242,
        "end": 1243,
        "className": "syntax-punctuation"
      },
      {
        "start": 1243,
        "end": 1248,
        "className": "syntax-variable"
      },
      {
        "start": 1248,
        "end": 1249,
        "className": "syntax-punctuation"
      },
      {
        "start": 1254,
        "end": 1341,
        "className": "syntax-comment"
      },
      {
        "start": 1346,
        "end": 1441,
        "className": "syntax-comment"
      },
      {
        "start": 1446,
        "end": 1455,
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
        "start": 1466,
        "end": 1467,
        "className": "syntax-punctuation"
      },
      {
        "start": 1467,
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
        "end": 1479,
        "className": "syntax-type"
      },
      {
        "start": 1479,
        "end": 1480,
        "className": "syntax-punctuation"
      },
      {
        "start": 1481,
        "end": 1486,
        "className": "syntax-variable"
      },
      {
        "start": 1487,
        "end": 1490,
        "className": "syntax-keyword"
      },
      {
        "start": 1491,
        "end": 1494,
        "className": "syntax-string"
      },
      {
        "start": 1495,
        "end": 1497,
        "className": "syntax-keyword"
      },
      {
        "start": 1498,
        "end": 1501,
        "className": "syntax-string"
      },
      {
        "start": 1501,
        "end": 1502,
        "className": "syntax-punctuation"
      },
      {
        "start": 1503,
        "end": 1504,
        "className": "syntax-type"
      },
      {
        "start": 1511,
        "end": 1516,
        "className": "syntax-variable"
      },
      {
        "start": 1517,
        "end": 1518,
        "className": "syntax-operator"
      },
      {
        "start": 1519,
        "end": 1524,
        "className": "syntax-variable"
      },
      {
        "start": 1524,
        "end": 1525,
        "className": "syntax-punctuation"
      },
      {
        "start": 1532,
        "end": 1537,
        "className": "syntax-variable"
      },
      {
        "start": 1538,
        "end": 1539,
        "className": "syntax-operator"
      },
      {
        "start": 1540,
        "end": 1545,
        "className": "syntax-variable"
      },
      {
        "start": 1545,
        "end": 1546,
        "className": "syntax-punctuation"
      },
      {
        "start": 1556,
        "end": 1557,
        "className": "syntax-operator"
      },
      {
        "start": 1558,
        "end": 1563,
        "className": "syntax-variable"
      },
      {
        "start": 1563,
        "end": 1564,
        "className": "syntax-punctuation"
      },
      {
        "start": 1569,
        "end": 1570,
        "className": "syntax-type"
      },
      {
        "start": 1570,
        "end": 1571,
        "className": "syntax-punctuation"
      },
      {
        "start": 1584,
        "end": 1588,
        "className": "syntax-variable"
      },
      {
        "start": 1601,
        "end": 1604,
        "className": "syntax-keyword"
      },
      {
        "start": 1605,
        "end": 1612,
        "className": "syntax-variable"
      },
      {
        "start": 1624,
        "end": 1675,
        "className": "syntax-comment"
      },
      {
        "start": 1682,
        "end": 1687,
        "className": "syntax-keyword"
      },
      {
        "start": 1688,
        "end": 1694,
        "className": "syntax-variable"
      },
      {
        "start": 1695,
        "end": 1696,
        "className": "syntax-operator"
      },
      {
        "start": 1697,
        "end": 1700,
        "className": "syntax-variable"
      },
      {
        "start": 1700,
        "end": 1701,
        "className": "syntax-punctuation"
      },
      {
        "start": 1703,
        "end": 1704,
        "className": "syntax-punctuation"
      },
      {
        "start": 1704,
        "end": 1713,
        "className": "syntax-function"
      },
      {
        "start": 1713,
        "end": 1714,
        "className": "syntax-punctuation"
      },
      {
        "start": 1714,
        "end": 1715,
        "className": "syntax-type"
      },
      {
        "start": 1719,
        "end": 1720,
        "className": "syntax-operator"
      },
      {
        "start": 1721,
        "end": 1726,
        "className": "syntax-variable"
      },
      {
        "start": 1726,
        "end": 1727,
        "className": "syntax-punctuation"
      },
      {
        "start": 1731,
        "end": 1732,
        "className": "syntax-operator"
      },
      {
        "start": 1733,
        "end": 1734,
        "className": "syntax-number"
      },
      {
        "start": 1735,
        "end": 1736,
        "className": "syntax-type"
      },
      {
        "start": 1736,
        "end": 1737,
        "className": "syntax-punctuation"
      },
      {
        "start": 1738,
        "end": 1763,
        "className": "syntax-comment"
      },
      {
        "start": 1770,
        "end": 1775,
        "className": "syntax-keyword"
      },
      {
        "start": 1776,
        "end": 1778,
        "className": "syntax-variable"
      },
      {
        "start": 1779,
        "end": 1780,
        "className": "syntax-operator"
      },
      {
        "start": 1781,
        "end": 1787,
        "className": "syntax-variable"
      },
      {
        "start": 1787,
        "end": 1788,
        "className": "syntax-punctuation"
      },
      {
        "start": 1788,
        "end": 1790,
        "className": "syntax-variable"
      },
      {
        "start": 1797,
        "end": 1800,
        "className": "syntax-variable"
      },
      {
        "start": 1800,
        "end": 1801,
        "className": "syntax-punctuation"
      },
      {
        "start": 1801,
        "end": 1813,
        "className": "syntax-function"
      },
      {
        "start": 1813,
        "end": 1815,
        "className": "syntax-punctuation"
      },
      {
        "start": 1815,
        "end": 1834,
        "className": "syntax-string"
      },
      {
        "start": 1834,
        "end": 1836,
        "className": "syntax-punctuation"
      },
      {
        "start": 1842,
        "end": 1843,
        "className": "syntax-punctuation"
      },
      {
        "start": 1843,
        "end": 1845,
        "className": "syntax-variable"
      },
      {
        "start": 1845,
        "end": 1847,
        "className": "syntax-punctuation"
      },
      {
        "start": 1854,
        "end": 1884,
        "className": "syntax-comment"
      },
      {
        "start": 1891,
        "end": 1894,
        "className": "syntax-variable"
      },
      {
        "start": 1894,
        "end": 1895,
        "className": "syntax-punctuation"
      },
      {
        "start": 1895,
        "end": 1907,
        "className": "syntax-function"
      },
      {
        "start": 1907,
        "end": 1908,
        "className": "syntax-punctuation"
      },
      {
        "start": 1908,
        "end": 1926,
        "className": "syntax-string"
      },
      {
        "start": 1926,
        "end": 1927,
        "className": "syntax-punctuation"
      },
      {
        "start": 1943,
        "end": 1946,
        "className": "syntax-variable"
      },
      {
        "start": 1946,
        "end": 1947,
        "className": "syntax-punctuation"
      },
      {
        "start": 1947,
        "end": 1959,
        "className": "syntax-function"
      },
      {
        "start": 1959,
        "end": 1960,
        "className": "syntax-punctuation"
      },
      {
        "start": 1960,
        "end": 1969,
        "className": "syntax-string"
      },
      {
        "start": 1969,
        "end": 1970,
        "className": "syntax-punctuation"
      },
      {
        "start": 1985,
        "end": 1988,
        "className": "syntax-keyword"
      },
      {
        "start": 1990,
        "end": 2038,
        "className": "syntax-comment"
      },
      {
        "start": 2039,
        "end": 2079,
        "className": "syntax-comment"
      },
      {
        "start": 2080,
        "end": 2094,
        "className": "syntax-comment"
      },
      {
        "start": 2095,
        "end": 2098,
        "className": "syntax-comment"
      },
      {
        "start": 2099,
        "end": 2152,
        "className": "syntax-comment"
      },
      {
        "start": 2153,
        "end": 2192,
        "className": "syntax-comment"
      },
      {
        "start": 2193,
        "end": 2196,
        "className": "syntax-comment"
      },
      {
        "start": 2197,
        "end": 2234,
        "className": "syntax-comment"
      },
      {
        "start": 2235,
        "end": 2256,
        "className": "syntax-comment"
      },
      {
        "start": 2257,
        "end": 2281,
        "className": "syntax-comment"
      },
      {
        "start": 2282,
        "end": 2285,
        "className": "syntax-comment"
      },
      {
        "start": 2286,
        "end": 2385,
        "className": "syntax-comment"
      },
      {
        "start": 2386,
        "end": 2450,
        "className": "syntax-comment"
      },
      {
        "start": 2451,
        "end": 2475,
        "className": "syntax-comment"
      },
      {
        "start": 2476,
        "end": 2479,
        "className": "syntax-comment"
      },
      {
        "start": 2480,
        "end": 2510,
        "className": "syntax-comment"
      },
      {
        "start": 2511,
        "end": 2561,
        "className": "syntax-comment"
      },
      {
        "start": 2562,
        "end": 2565,
        "className": "syntax-comment"
      },
      {
        "start": 2566,
        "end": 2642,
        "className": "syntax-comment"
      },
      {
        "start": 2643,
        "end": 2728,
        "className": "syntax-comment"
      },
      {
        "start": 2729,
        "end": 2788,
        "className": "syntax-comment"
      },
      {
        "start": 2789,
        "end": 2847,
        "className": "syntax-comment"
      },
      {
        "start": 2849,
        "end": 2894,
        "className": "syntax-comment"
      }
    ]
  },
  {
    "language": "lua",
    "name": "lua/neovim_lsp_client.lua",
    "code": "--- Validates a client configuration as given to |vim.lsp.start()|.\n--- @param config vim.lsp.ClientConfig\nlocal function validate_config(config)\n  validate('config', config, 'table')\n  validate('handlers', config.handlers, 'table', true)\n  validate('capabilities', config.capabilities, 'table', true)\n  validate('cmd_cwd', config.cmd_cwd, optional_validator(is_dir), 'directory')\n  validate('cmd_env', config.cmd_env, 'table', true)\n  validate('detached', config.detached, 'boolean', true)\n  validate('exit_timeout', config.exit_timeout, { 'number', 'boolean' }, true)\n  validate('name', config.name, 'string', true)\n  validate('on_error', config.on_error, 'function', true)\n  validate('on_exit', config.on_exit, { 'function', 'table' }, true)\n  validate('on_init', config.on_init, { 'function', 'table' }, true)\n  validate('on_attach', config.on_attach, { 'function', 'table' }, true)\n  validate('settings', config.settings, 'table', true)\n  validate('commands', config.commands, 'table', true)\n  validate('before_init', config.before_init, { 'function', 'table' }, true)\n  validate('offset_encoding', config.offset_encoding, 'string', true)\n  validate('flags', config.flags, 'table', true)\n  validate('get_language_id', config.get_language_id, 'function', true)\n\n  assert(\n    (\n      not config.flags\n      or not config.flags.debounce_text_changes\n      or type(config.flags.debounce_text_changes) == 'number'\n    ),\n    'flags.debounce_text_changes must be a number with the debounce time in milliseconds'\n  )\nend\n\n--- @param trace string\n--- @return 'off'|'messages'|'verbose'\nlocal function get_trace(trace)\n  local valid_traces = {\n    off = 'off',\n    messages = 'messages',\n    verbose = 'verbose',\n  }\n  return trace and valid_traces[trace] or 'off'\nend\n\n--- @param id integer\n--- @param config vim.lsp.ClientConfig\n--- @return string\nlocal function get_name(id, config)\n  local name = config.name\n  if name then\n    return name\n  end\n\n  if type(config.cmd) == 'table' and config.cmd[1] then\n    return assert(vim.fs.basename(config.cmd[1]))\n  end\n\n  return tostring(id)\nend\n\n--- @nodoc\n--- @param config vim.lsp.ClientConfig\n--- @return vim.lsp.Client?\nfunction Client.create(config)\n  validate_config(config)\n\n  client_index = client_index + 1\n  local id = client_index\n  local name = get_name(id, config)\n\n  --- @class vim.lsp.Client\n  local self = {\n    id = id,\n    config = config,\n    handlers = config.handlers or {},\n    offset_encoding = validate_encoding(config.offset_encoding),\n    name = name,\n    _log_prefix = string.format('LSP[%s]', name),\n    requests = {},\n    attached_buffers = {},\n    server_capabilities = {},\n    registrations = {},\n    commands = config.commands or {},\n    settings = config.settings or {},\n    flags = config.flags or {},\n    exit_timeout = config.exit_timeout or false,",
    "spans": [
      {
        "start": 0,
        "end": 67,
        "className": "syntax-comment"
      },
      {
        "start": 68,
        "end": 106,
        "className": "syntax-comment"
      },
      {
        "start": 107,
        "end": 112,
        "className": "syntax-keyword"
      },
      {
        "start": 113,
        "end": 121,
        "className": "syntax-keyword"
      },
      {
        "start": 122,
        "end": 137,
        "className": "syntax-function"
      },
      {
        "start": 137,
        "end": 138,
        "className": "syntax-punctuation"
      },
      {
        "start": 144,
        "end": 145,
        "className": "syntax-punctuation"
      },
      {
        "start": 148,
        "end": 156,
        "className": "syntax-function"
      },
      {
        "start": 156,
        "end": 157,
        "className": "syntax-punctuation"
      },
      {
        "start": 157,
        "end": 165,
        "className": "syntax-string"
      },
      {
        "start": 165,
        "end": 166,
        "className": "syntax-punctuation"
      },
      {
        "start": 167,
        "end": 173,
        "className": "syntax-variable"
      },
      {
        "start": 173,
        "end": 174,
        "className": "syntax-punctuation"
      },
      {
        "start": 175,
        "end": 182,
        "className": "syntax-string"
      },
      {
        "start": 182,
        "end": 183,
        "className": "syntax-punctuation"
      },
      {
        "start": 186,
        "end": 194,
        "className": "syntax-function"
      },
      {
        "start": 194,
        "end": 195,
        "className": "syntax-punctuation"
      },
      {
        "start": 195,
        "end": 205,
        "className": "syntax-string"
      },
      {
        "start": 205,
        "end": 206,
        "className": "syntax-punctuation"
      },
      {
        "start": 207,
        "end": 213,
        "className": "syntax-variable"
      },
      {
        "start": 213,
        "end": 214,
        "className": "syntax-punctuation"
      },
      {
        "start": 222,
        "end": 223,
        "className": "syntax-punctuation"
      },
      {
        "start": 224,
        "end": 231,
        "className": "syntax-string"
      },
      {
        "start": 231,
        "end": 232,
        "className": "syntax-punctuation"
      },
      {
        "start": 237,
        "end": 238,
        "className": "syntax-punctuation"
      },
      {
        "start": 241,
        "end": 249,
        "className": "syntax-function"
      },
      {
        "start": 249,
        "end": 250,
        "className": "syntax-punctuation"
      },
      {
        "start": 250,
        "end": 264,
        "className": "syntax-string"
      },
      {
        "start": 264,
        "end": 265,
        "className": "syntax-punctuation"
      },
      {
        "start": 266,
        "end": 272,
        "className": "syntax-variable"
      },
      {
        "start": 272,
        "end": 273,
        "className": "syntax-punctuation"
      },
      {
        "start": 285,
        "end": 286,
        "className": "syntax-punctuation"
      },
      {
        "start": 287,
        "end": 294,
        "className": "syntax-string"
      },
      {
        "start": 294,
        "end": 295,
        "className": "syntax-punctuation"
      },
      {
        "start": 300,
        "end": 301,
        "className": "syntax-punctuation"
      },
      {
        "start": 304,
        "end": 312,
        "className": "syntax-function"
      },
      {
        "start": 312,
        "end": 313,
        "className": "syntax-punctuation"
      },
      {
        "start": 313,
        "end": 322,
        "className": "syntax-string"
      },
      {
        "start": 322,
        "end": 323,
        "className": "syntax-punctuation"
      },
      {
        "start": 324,
        "end": 330,
        "className": "syntax-variable"
      },
      {
        "start": 330,
        "end": 331,
        "className": "syntax-punctuation"
      },
      {
        "start": 338,
        "end": 339,
        "className": "syntax-punctuation"
      },
      {
        "start": 340,
        "end": 358,
        "className": "syntax-function"
      },
      {
        "start": 358,
        "end": 359,
        "className": "syntax-punctuation"
      },
      {
        "start": 359,
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
        "end": 379,
        "className": "syntax-string"
      },
      {
        "start": 379,
        "end": 380,
        "className": "syntax-punctuation"
      },
      {
        "start": 383,
        "end": 391,
        "className": "syntax-function"
      },
      {
        "start": 391,
        "end": 392,
        "className": "syntax-punctuation"
      },
      {
        "start": 392,
        "end": 401,
        "className": "syntax-string"
      },
      {
        "start": 401,
        "end": 402,
        "className": "syntax-punctuation"
      },
      {
        "start": 403,
        "end": 409,
        "className": "syntax-variable"
      },
      {
        "start": 409,
        "end": 410,
        "className": "syntax-punctuation"
      },
      {
        "start": 417,
        "end": 418,
        "className": "syntax-punctuation"
      },
      {
        "start": 419,
        "end": 426,
        "className": "syntax-string"
      },
      {
        "start": 426,
        "end": 427,
        "className": "syntax-punctuation"
      },
      {
        "start": 432,
        "end": 433,
        "className": "syntax-punctuation"
      },
      {
        "start": 436,
        "end": 444,
        "className": "syntax-function"
      },
      {
        "start": 444,
        "end": 445,
        "className": "syntax-punctuation"
      },
      {
        "start": 445,
        "end": 455,
        "className": "syntax-string"
      },
      {
        "start": 455,
        "end": 456,
        "className": "syntax-punctuation"
      },
      {
        "start": 457,
        "end": 463,
        "className": "syntax-variable"
      },
      {
        "start": 463,
        "end": 464,
        "className": "syntax-punctuation"
      },
      {
        "start": 472,
        "end": 473,
        "className": "syntax-punctuation"
      },
      {
        "start": 474,
        "end": 483,
        "className": "syntax-string"
      },
      {
        "start": 483,
        "end": 484,
        "className": "syntax-punctuation"
      },
      {
        "start": 489,
        "end": 490,
        "className": "syntax-punctuation"
      },
      {
        "start": 493,
        "end": 501,
        "className": "syntax-function"
      },
      {
        "start": 501,
        "end": 502,
        "className": "syntax-punctuation"
      },
      {
        "start": 502,
        "end": 516,
        "className": "syntax-string"
      },
      {
        "start": 516,
        "end": 517,
        "className": "syntax-punctuation"
      },
      {
        "start": 518,
        "end": 524,
        "className": "syntax-variable"
      },
      {
        "start": 524,
        "end": 525,
        "className": "syntax-punctuation"
      },
      {
        "start": 537,
        "end": 538,
        "className": "syntax-punctuation"
      },
      {
        "start": 539,
        "end": 540,
        "className": "syntax-type"
      },
      {
        "start": 541,
        "end": 549,
        "className": "syntax-string"
      },
      {
        "start": 549,
        "end": 550,
        "className": "syntax-punctuation"
      },
      {
        "start": 551,
        "end": 560,
        "className": "syntax-string"
      },
      {
        "start": 561,
        "end": 562,
        "className": "syntax-type"
      },
      {
        "start": 562,
        "end": 563,
        "className": "syntax-punctuation"
      },
      {
        "start": 568,
        "end": 569,
        "className": "syntax-punctuation"
      },
      {
        "start": 572,
        "end": 580,
        "className": "syntax-function"
      },
      {
        "start": 580,
        "end": 581,
        "className": "syntax-punctuation"
      },
      {
        "start": 581,
        "end": 587,
        "className": "syntax-string"
      },
      {
        "start": 587,
        "end": 588,
        "className": "syntax-punctuation"
      },
      {
        "start": 589,
        "end": 595,
        "className": "syntax-variable"
      },
      {
        "start": 595,
        "end": 596,
        "className": "syntax-punctuation"
      },
      {
        "start": 600,
        "end": 601,
        "className": "syntax-punctuation"
      },
      {
        "start": 602,
        "end": 610,
        "className": "syntax-string"
      },
      {
        "start": 610,
        "end": 611,
        "className": "syntax-punctuation"
      },
      {
        "start": 616,
        "end": 617,
        "className": "syntax-punctuation"
      },
      {
        "start": 620,
        "end": 628,
        "className": "syntax-function"
      },
      {
        "start": 628,
        "end": 629,
        "className": "syntax-punctuation"
      },
      {
        "start": 629,
        "end": 639,
        "className": "syntax-string"
      },
      {
        "start": 639,
        "end": 640,
        "className": "syntax-punctuation"
      },
      {
        "start": 641,
        "end": 647,
        "className": "syntax-variable"
      },
      {
        "start": 647,
        "end": 648,
        "className": "syntax-punctuation"
      },
      {
        "start": 656,
        "end": 657,
        "className": "syntax-punctuation"
      },
      {
        "start": 658,
        "end": 668,
        "className": "syntax-string"
      },
      {
        "start": 668,
        "end": 669,
        "className": "syntax-punctuation"
      },
      {
        "start": 674,
        "end": 675,
        "className": "syntax-punctuation"
      },
      {
        "start": 678,
        "end": 686,
        "className": "syntax-function"
      },
      {
        "start": 686,
        "end": 687,
        "className": "syntax-punctuation"
      },
      {
        "start": 687,
        "end": 696,
        "className": "syntax-string"
      },
      {
        "start": 696,
        "end": 697,
        "className": "syntax-punctuation"
      },
      {
        "start": 698,
        "end": 704,
        "className": "syntax-variable"
      },
      {
        "start": 704,
        "end": 705,
        "className": "syntax-punctuation"
      },
      {
        "start": 712,
        "end": 713,
        "className": "syntax-punctuation"
      },
      {
        "start": 714,
        "end": 715,
        "className": "syntax-type"
      },
      {
        "start": 716,
        "end": 726,
        "className": "syntax-string"
      },
      {
        "start": 726,
        "end": 727,
        "className": "syntax-punctuation"
      },
      {
        "start": 728,
        "end": 735,
        "className": "syntax-string"
      },
      {
        "start": 736,
        "end": 737,
        "className": "syntax-type"
      },
      {
        "start": 737,
        "end": 738,
        "className": "syntax-punctuation"
      },
      {
        "start": 743,
        "end": 744,
        "className": "syntax-punctuation"
      },
      {
        "start": 747,
        "end": 755,
        "className": "syntax-function"
      },
      {
        "start": 755,
        "end": 756,
        "className": "syntax-punctuation"
      },
      {
        "start": 756,
        "end": 765,
        "className": "syntax-string"
      },
      {
        "start": 765,
        "end": 766,
        "className": "syntax-punctuation"
      },
      {
        "start": 767,
        "end": 773,
        "className": "syntax-variable"
      },
      {
        "start": 773,
        "end": 774,
        "className": "syntax-punctuation"
      },
      {
        "start": 781,
        "end": 782,
        "className": "syntax-punctuation"
      },
      {
        "start": 783,
        "end": 784,
        "className": "syntax-type"
      },
      {
        "start": 785,
        "end": 795,
        "className": "syntax-string"
      },
      {
        "start": 795,
        "end": 796,
        "className": "syntax-punctuation"
      },
      {
        "start": 797,
        "end": 804,
        "className": "syntax-string"
      },
      {
        "start": 805,
        "end": 806,
        "className": "syntax-type"
      },
      {
        "start": 806,
        "end": 807,
        "className": "syntax-punctuation"
      },
      {
        "start": 812,
        "end": 813,
        "className": "syntax-punctuation"
      },
      {
        "start": 816,
        "end": 824,
        "className": "syntax-function"
      },
      {
        "start": 824,
        "end": 825,
        "className": "syntax-punctuation"
      },
      {
        "start": 825,
        "end": 836,
        "className": "syntax-string"
      },
      {
        "start": 836,
        "end": 837,
        "className": "syntax-punctuation"
      },
      {
        "start": 838,
        "end": 844,
        "className": "syntax-variable"
      },
      {
        "start": 844,
        "end": 845,
        "className": "syntax-punctuation"
      },
      {
        "start": 854,
        "end": 855,
        "className": "syntax-punctuation"
      },
      {
        "start": 856,
        "end": 857,
        "className": "syntax-type"
      },
      {
        "start": 858,
        "end": 868,
        "className": "syntax-string"
      },
      {
        "start": 868,
        "end": 869,
        "className": "syntax-punctuation"
      },
      {
        "start": 870,
        "end": 877,
        "className": "syntax-string"
      },
      {
        "start": 878,
        "end": 879,
        "className": "syntax-type"
      },
      {
        "start": 879,
        "end": 880,
        "className": "syntax-punctuation"
      },
      {
        "start": 885,
        "end": 886,
        "className": "syntax-punctuation"
      },
      {
        "start": 889,
        "end": 897,
        "className": "syntax-function"
      },
      {
        "start": 897,
        "end": 898,
        "className": "syntax-punctuation"
      },
      {
        "start": 898,
        "end": 908,
        "className": "syntax-string"
      },
      {
        "start": 908,
        "end": 909,
        "className": "syntax-punctuation"
      },
      {
        "start": 910,
        "end": 916,
        "className": "syntax-variable"
      },
      {
        "start": 916,
        "end": 917,
        "className": "syntax-punctuation"
      },
      {
        "start": 925,
        "end": 926,
        "className": "syntax-punctuation"
      },
      {
        "start": 927,
        "end": 934,
        "className": "syntax-string"
      },
      {
        "start": 934,
        "end": 935,
        "className": "syntax-punctuation"
      },
      {
        "start": 940,
        "end": 941,
        "className": "syntax-punctuation"
      },
      {
        "start": 944,
        "end": 952,
        "className": "syntax-function"
      },
      {
        "start": 952,
        "end": 953,
        "className": "syntax-punctuation"
      },
      {
        "start": 953,
        "end": 963,
        "className": "syntax-string"
      },
      {
        "start": 963,
        "end": 964,
        "className": "syntax-punctuation"
      },
      {
        "start": 965,
        "end": 971,
        "className": "syntax-variable"
      },
      {
        "start": 971,
        "end": 972,
        "className": "syntax-punctuation"
      },
      {
        "start": 980,
        "end": 981,
        "className": "syntax-punctuation"
      },
      {
        "start": 982,
        "end": 989,
        "className": "syntax-string"
      },
      {
        "start": 989,
        "end": 990,
        "className": "syntax-punctuation"
      },
      {
        "start": 995,
        "end": 996,
        "className": "syntax-punctuation"
      },
      {
        "start": 999,
        "end": 1007,
        "className": "syntax-function"
      },
      {
        "start": 1007,
        "end": 1008,
        "className": "syntax-punctuation"
      },
      {
        "start": 1008,
        "end": 1021,
        "className": "syntax-string"
      },
      {
        "start": 1021,
        "end": 1022,
        "className": "syntax-punctuation"
      },
      {
        "start": 1023,
        "end": 1029,
        "className": "syntax-variable"
      },
      {
        "start": 1029,
        "end": 1030,
        "className": "syntax-punctuation"
      },
      {
        "start": 1041,
        "end": 1042,
        "className": "syntax-punctuation"
      },
      {
        "start": 1043,
        "end": 1044,
        "className": "syntax-type"
      },
      {
        "start": 1045,
        "end": 1055,
        "className": "syntax-string"
      },
      {
        "start": 1055,
        "end": 1056,
        "className": "syntax-punctuation"
      },
      {
        "start": 1057,
        "end": 1064,
        "className": "syntax-string"
      },
      {
        "start": 1065,
        "end": 1066,
        "className": "syntax-type"
      },
      {
        "start": 1066,
        "end": 1067,
        "className": "syntax-punctuation"
      },
      {
        "start": 1072,
        "end": 1073,
        "className": "syntax-punctuation"
      },
      {
        "start": 1076,
        "end": 1084,
        "className": "syntax-function"
      },
      {
        "start": 1084,
        "end": 1085,
        "className": "syntax-punctuation"
      },
      {
        "start": 1085,
        "end": 1102,
        "className": "syntax-string"
      },
      {
        "start": 1102,
        "end": 1103,
        "className": "syntax-punctuation"
      },
      {
        "start": 1104,
        "end": 1110,
        "className": "syntax-variable"
      },
      {
        "start": 1110,
        "end": 1111,
        "className": "syntax-punctuation"
      },
      {
        "start": 1126,
        "end": 1127,
        "className": "syntax-punctuation"
      },
      {
        "start": 1128,
        "end": 1136,
        "className": "syntax-string"
      },
      {
        "start": 1136,
        "end": 1137,
        "className": "syntax-punctuation"
      },
      {
        "start": 1142,
        "end": 1143,
        "className": "syntax-punctuation"
      },
      {
        "start": 1146,
        "end": 1154,
        "className": "syntax-function"
      },
      {
        "start": 1154,
        "end": 1155,
        "className": "syntax-punctuation"
      },
      {
        "start": 1155,
        "end": 1162,
        "className": "syntax-string"
      },
      {
        "start": 1162,
        "end": 1163,
        "className": "syntax-punctuation"
      },
      {
        "start": 1164,
        "end": 1170,
        "className": "syntax-variable"
      },
      {
        "start": 1170,
        "end": 1171,
        "className": "syntax-punctuation"
      },
      {
        "start": 1176,
        "end": 1177,
        "className": "syntax-punctuation"
      },
      {
        "start": 1178,
        "end": 1185,
        "className": "syntax-string"
      },
      {
        "start": 1185,
        "end": 1186,
        "className": "syntax-punctuation"
      },
      {
        "start": 1191,
        "end": 1192,
        "className": "syntax-punctuation"
      },
      {
        "start": 1195,
        "end": 1203,
        "className": "syntax-function"
      },
      {
        "start": 1203,
        "end": 1204,
        "className": "syntax-punctuation"
      },
      {
        "start": 1204,
        "end": 1221,
        "className": "syntax-string"
      },
      {
        "start": 1221,
        "end": 1222,
        "className": "syntax-punctuation"
      },
      {
        "start": 1223,
        "end": 1229,
        "className": "syntax-variable"
      },
      {
        "start": 1229,
        "end": 1230,
        "className": "syntax-punctuation"
      },
      {
        "start": 1245,
        "end": 1246,
        "className": "syntax-punctuation"
      },
      {
        "start": 1247,
        "end": 1257,
        "className": "syntax-string"
      },
      {
        "start": 1257,
        "end": 1258,
        "className": "syntax-punctuation"
      },
      {
        "start": 1263,
        "end": 1264,
        "className": "syntax-punctuation"
      },
      {
        "start": 1268,
        "end": 1274,
        "className": "syntax-function"
      },
      {
        "start": 1274,
        "end": 1275,
        "className": "syntax-punctuation"
      },
      {
        "start": 1280,
        "end": 1281,
        "className": "syntax-punctuation"
      },
      {
        "start": 1288,
        "end": 1291,
        "className": "syntax-keyword"
      },
      {
        "start": 1292,
        "end": 1298,
        "className": "syntax-variable"
      },
      {
        "start": 1298,
        "end": 1299,
        "className": "syntax-punctuation"
      },
      {
        "start": 1311,
        "end": 1313,
        "className": "syntax-keyword"
      },
      {
        "start": 1314,
        "end": 1317,
        "className": "syntax-keyword"
      },
      {
        "start": 1318,
        "end": 1324,
        "className": "syntax-variable"
      },
      {
        "start": 1324,
        "end": 1325,
        "className": "syntax-punctuation"
      },
      {
        "start": 1330,
        "end": 1331,
        "className": "syntax-punctuation"
      },
      {
        "start": 1359,
        "end": 1361,
        "className": "syntax-keyword"
      },
      {
        "start": 1362,
        "end": 1366,
        "className": "syntax-function"
      },
      {
        "start": 1366,
        "end": 1367,
        "className": "syntax-punctuation"
      },
      {
        "start": 1367,
        "end": 1373,
        "className": "syntax-variable"
      },
      {
        "start": 1373,
        "end": 1374,
        "className": "syntax-punctuation"
      },
      {
        "start": 1379,
        "end": 1380,
        "className": "syntax-punctuation"
      },
      {
        "start": 1401,
        "end": 1402,
        "className": "syntax-punctuation"
      },
      {
        "start": 1403,
        "end": 1405,
        "className": "syntax-operator"
      },
      {
        "start": 1406,
        "end": 1414,
        "className": "syntax-string"
      },
      {
        "start": 1419,
        "end": 1421,
        "className": "syntax-punctuation"
      },
      {
        "start": 1426,
        "end": 1511,
        "className": "syntax-string"
      },
      {
        "start": 1514,
        "end": 1515,
        "className": "syntax-punctuation"
      },
      {
        "start": 1516,
        "end": 1519,
        "className": "syntax-keyword"
      },
      {
        "start": 1521,
        "end": 1544,
        "className": "syntax-comment"
      },
      {
        "start": 1545,
        "end": 1583,
        "className": "syntax-comment"
      },
      {
        "start": 1584,
        "end": 1589,
        "className": "syntax-keyword"
      },
      {
        "start": 1590,
        "end": 1598,
        "className": "syntax-keyword"
      },
      {
        "start": 1599,
        "end": 1608,
        "className": "syntax-function"
      },
      {
        "start": 1608,
        "end": 1609,
        "className": "syntax-punctuation"
      },
      {
        "start": 1614,
        "end": 1615,
        "className": "syntax-punctuation"
      },
      {
        "start": 1618,
        "end": 1623,
        "className": "syntax-keyword"
      },
      {
        "start": 1624,
        "end": 1636,
        "className": "syntax-variable"
      },
      {
        "start": 1637,
        "end": 1638,
        "className": "syntax-operator"
      },
      {
        "start": 1639,
        "end": 1640,
        "className": "syntax-type"
      },
      {
        "start": 1649,
        "end": 1650,
        "className": "syntax-operator"
      },
      {
        "start": 1651,
        "end": 1656,
        "className": "syntax-string"
      },
      {
        "start": 1656,
        "end": 1657,
        "className": "syntax-punctuation"
      },
      {
        "start": 1671,
        "end": 1672,
        "className": "syntax-operator"
      },
      {
        "start": 1673,
        "end": 1683,
        "className": "syntax-string"
      },
      {
        "start": 1683,
        "end": 1684,
        "className": "syntax-punctuation"
      },
      {
        "start": 1697,
        "end": 1698,
        "className": "syntax-operator"
      },
      {
        "start": 1699,
        "end": 1708,
        "className": "syntax-string"
      },
      {
        "start": 1708,
        "end": 1709,
        "className": "syntax-punctuation"
      },
      {
        "start": 1712,
        "end": 1713,
        "className": "syntax-type"
      },
      {
        "start": 1716,
        "end": 1722,
        "className": "syntax-keyword"
      },
      {
        "start": 1723,
        "end": 1728,
        "className": "syntax-variable"
      },
      {
        "start": 1729,
        "end": 1732,
        "className": "syntax-keyword"
      },
      {
        "start": 1733,
        "end": 1745,
        "className": "syntax-variable"
      },
      {
        "start": 1745,
        "end": 1746,
        "className": "syntax-punctuation"
      },
      {
        "start": 1746,
        "end": 1751,
        "className": "syntax-variable"
      },
      {
        "start": 1751,
        "end": 1752,
        "className": "syntax-punctuation"
      },
      {
        "start": 1753,
        "end": 1755,
        "className": "syntax-keyword"
      },
      {
        "start": 1756,
        "end": 1761,
        "className": "syntax-string"
      },
      {
        "start": 1762,
        "end": 1765,
        "className": "syntax-keyword"
      },
      {
        "start": 1767,
        "end": 1788,
        "className": "syntax-comment"
      },
      {
        "start": 1789,
        "end": 1827,
        "className": "syntax-comment"
      },
      {
        "start": 1828,
        "end": 1846,
        "className": "syntax-comment"
      },
      {
        "start": 1847,
        "end": 1852,
        "className": "syntax-keyword"
      },
      {
        "start": 1853,
        "end": 1861,
        "className": "syntax-keyword"
      },
      {
        "start": 1862,
        "end": 1870,
        "className": "syntax-function"
      },
      {
        "start": 1870,
        "end": 1871,
        "className": "syntax-punctuation"
      },
      {
        "start": 1873,
        "end": 1874,
        "className": "syntax-punctuation"
      },
      {
        "start": 1881,
        "end": 1882,
        "className": "syntax-punctuation"
      },
      {
        "start": 1885,
        "end": 1890,
        "className": "syntax-keyword"
      },
      {
        "start": 1891,
        "end": 1895,
        "className": "syntax-variable"
      },
      {
        "start": 1896,
        "end": 1897,
        "className": "syntax-operator"
      },
      {
        "start": 1898,
        "end": 1904,
        "className": "syntax-variable"
      },
      {
        "start": 1904,
        "end": 1905,
        "className": "syntax-punctuation"
      },
      {
        "start": 1905,
        "end": 1909,
        "className": "syntax-variable"
      },
      {
        "start": 1915,
        "end": 1919,
        "className": "syntax-variable"
      },
      {
        "start": 1929,
        "end": 1935,
        "className": "syntax-keyword"
      },
      {
        "start": 1936,
        "end": 1940,
        "className": "syntax-variable"
      },
      {
        "start": 1953,
        "end": 1957,
        "className": "syntax-function"
      },
      {
        "start": 1957,
        "end": 1958,
        "className": "syntax-punctuation"
      },
      {
        "start": 1958,
        "end": 1964,
        "className": "syntax-variable"
      },
      {
        "start": 1964,
        "end": 1965,
        "className": "syntax-punctuation"
      },
      {
        "start": 1968,
        "end": 1969,
        "className": "syntax-punctuation"
      },
      {
        "start": 1970,
        "end": 1972,
        "className": "syntax-operator"
      },
      {
        "start": 1973,
        "end": 1980,
        "className": "syntax-string"
      },
      {
        "start": 1981,
        "end": 1984,
        "className": "syntax-keyword"
      },
      {
        "start": 1985,
        "end": 1991,
        "className": "syntax-variable"
      },
      {
        "start": 1991,
        "end": 1992,
        "className": "syntax-punctuation"
      },
      {
        "start": 1995,
        "end": 1996,
        "className": "syntax-punctuation"
      },
      {
        "start": 1996,
        "end": 1997,
        "className": "syntax-number"
      },
      {
        "start": 1997,
        "end": 1998,
        "className": "syntax-punctuation"
      },
      {
        "start": 2008,
        "end": 2014,
        "className": "syntax-keyword"
      },
      {
        "start": 2015,
        "end": 2021,
        "className": "syntax-function"
      },
      {
        "start": 2021,
        "end": 2022,
        "className": "syntax-punctuation"
      },
      {
        "start": 2022,
        "end": 2025,
        "className": "syntax-variable"
      },
      {
        "start": 2025,
        "end": 2026,
        "className": "syntax-punctuation"
      },
      {
        "start": 2028,
        "end": 2029,
        "className": "syntax-punctuation"
      },
      {
        "start": 2029,
        "end": 2037,
        "className": "syntax-function"
      },
      {
        "start": 2037,
        "end": 2038,
        "className": "syntax-punctuation"
      },
      {
        "start": 2038,
        "end": 2044,
        "className": "syntax-variable"
      },
      {
        "start": 2044,
        "end": 2045,
        "className": "syntax-punctuation"
      },
      {
        "start": 2048,
        "end": 2049,
        "className": "syntax-punctuation"
      },
      {
        "start": 2049,
        "end": 2050,
        "className": "syntax-number"
      },
      {
        "start": 2050,
        "end": 2053,
        "className": "syntax-punctuation"
      },
      {
        "start": 2063,
        "end": 2069,
        "className": "syntax-keyword"
      },
      {
        "start": 2070,
        "end": 2078,
        "className": "syntax-function"
      },
      {
        "start": 2078,
        "end": 2079,
        "className": "syntax-punctuation"
      },
      {
        "start": 2079,
        "end": 2081,
        "className": "syntax-variable"
      },
      {
        "start": 2081,
        "end": 2082,
        "className": "syntax-punctuation"
      },
      {
        "start": 2083,
        "end": 2086,
        "className": "syntax-keyword"
      },
      {
        "start": 2088,
        "end": 2098,
        "className": "syntax-comment"
      },
      {
        "start": 2099,
        "end": 2137,
        "className": "syntax-comment"
      },
      {
        "start": 2138,
        "end": 2165,
        "className": "syntax-comment"
      },
      {
        "start": 2175,
        "end": 2181,
        "className": "syntax-variable"
      },
      {
        "start": 2181,
        "end": 2182,
        "className": "syntax-punctuation"
      },
      {
        "start": 2188,
        "end": 2189,
        "className": "syntax-punctuation"
      },
      {
        "start": 2195,
        "end": 2196,
        "className": "syntax-punctuation"
      },
      {
        "start": 2199,
        "end": 2214,
        "className": "syntax-function"
      },
      {
        "start": 2214,
        "end": 2215,
        "className": "syntax-punctuation"
      },
      {
        "start": 2215,
        "end": 2221,
        "className": "syntax-variable"
      },
      {
        "start": 2221,
        "end": 2222,
        "className": "syntax-punctuation"
      },
      {
        "start": 2226,
        "end": 2238,
        "className": "syntax-variable"
      },
      {
        "start": 2239,
        "end": 2240,
        "className": "syntax-operator"
      },
      {
        "start": 2241,
        "end": 2253,
        "className": "syntax-variable"
      },
      {
        "start": 2254,
        "end": 2255,
        "className": "syntax-operator"
      },
      {
        "start": 2256,
        "end": 2257,
        "className": "syntax-number"
      },
      {
        "start": 2260,
        "end": 2265,
        "className": "syntax-keyword"
      },
      {
        "start": 2266,
        "end": 2268,
        "className": "syntax-variable"
      },
      {
        "start": 2269,
        "end": 2270,
        "className": "syntax-operator"
      },
      {
        "start": 2271,
        "end": 2283,
        "className": "syntax-variable"
      },
      {
        "start": 2286,
        "end": 2291,
        "className": "syntax-keyword"
      },
      {
        "start": 2292,
        "end": 2296,
        "className": "syntax-variable"
      },
      {
        "start": 2297,
        "end": 2298,
        "className": "syntax-operator"
      },
      {
        "start": 2299,
        "end": 2307,
        "className": "syntax-function"
      },
      {
        "start": 2307,
        "end": 2308,
        "className": "syntax-punctuation"
      },
      {
        "start": 2308,
        "end": 2310,
        "className": "syntax-variable"
      },
      {
        "start": 2310,
        "end": 2311,
        "className": "syntax-punctuation"
      },
      {
        "start": 2312,
        "end": 2318,
        "className": "syntax-variable"
      },
      {
        "start": 2318,
        "end": 2319,
        "className": "syntax-punctuation"
      },
      {
        "start": 2323,
        "end": 2348,
        "className": "syntax-comment"
      },
      {
        "start": 2351,
        "end": 2356,
        "className": "syntax-keyword"
      },
      {
        "start": 2357,
        "end": 2361,
        "className": "syntax-variable"
      },
      {
        "start": 2362,
        "end": 2363,
        "className": "syntax-operator"
      },
      {
        "start": 2364,
        "end": 2365,
        "className": "syntax-punctuation"
      },
      {
        "start": 2370,
        "end": 2372,
        "className": "syntax-variable"
      },
      {
        "start": 2373,
        "end": 2374,
        "className": "syntax-operator"
      },
      {
        "start": 2375,
        "end": 2377,
        "className": "syntax-variable"
      },
      {
        "start": 2377,
        "end": 2378,
        "className": "syntax-punctuation"
      },
      {
        "start": 2390,
        "end": 2391,
        "className": "syntax-operator"
      },
      {
        "start": 2392,
        "end": 2398,
        "className": "syntax-variable"
      },
      {
        "start": 2398,
        "end": 2399,
        "className": "syntax-punctuation"
      },
      {
        "start": 2413,
        "end": 2414,
        "className": "syntax-operator"
      },
      {
        "start": 2415,
        "end": 2421,
        "className": "syntax-variable"
      },
      {
        "start": 2421,
        "end": 2422,
        "className": "syntax-punctuation"
      },
      {
        "start": 2431,
        "end": 2433,
        "className": "syntax-keyword"
      },
      {
        "start": 2434,
        "end": 2436,
        "className": "syntax-type"
      },
      {
        "start": 2436,
        "end": 2437,
        "className": "syntax-punctuation"
      },
      {
        "start": 2458,
        "end": 2459,
        "className": "syntax-operator"
      },
      {
        "start": 2460,
        "end": 2477,
        "className": "syntax-function"
      },
      {
        "start": 2477,
        "end": 2478,
        "className": "syntax-punctuation"
      },
      {
        "start": 2478,
        "end": 2484,
        "className": "syntax-variable"
      },
      {
        "start": 2484,
        "end": 2485,
        "className": "syntax-punctuation"
      },
      {
        "start": 2500,
        "end": 2502,
        "className": "syntax-punctuation"
      },
      {
        "start": 2507,
        "end": 2511,
        "className": "syntax-variable"
      },
      {
        "start": 2512,
        "end": 2513,
        "className": "syntax-operator"
      },
      {
        "start": 2514,
        "end": 2518,
        "className": "syntax-variable"
      },
      {
        "start": 2518,
        "end": 2519,
        "className": "syntax-punctuation"
      },
      {
        "start": 2536,
        "end": 2537,
        "className": "syntax-operator"
      },
      {
        "start": 2538,
        "end": 2544,
        "className": "syntax-variable"
      },
      {
        "start": 2544,
        "end": 2545,
        "className": "syntax-punctuation"
      },
      {
        "start": 2545,
        "end": 2551,
        "className": "syntax-function"
      },
      {
        "start": 2551,
        "end": 2552,
        "className": "syntax-punctuation"
      },
      {
        "start": 2552,
        "end": 2561,
        "className": "syntax-string"
      },
      {
        "start": 2561,
        "end": 2562,
        "className": "syntax-punctuation"
      },
      {
        "start": 2563,
        "end": 2567,
        "className": "syntax-variable"
      },
      {
        "start": 2567,
        "end": 2569,
        "className": "syntax-punctuation"
      },
      {
        "start": 2583,
        "end": 2584,
        "className": "syntax-operator"
      },
      {
        "start": 2585,
        "end": 2587,
        "className": "syntax-type"
      },
      {
        "start": 2587,
        "end": 2588,
        "className": "syntax-punctuation"
      },
      {
        "start": 2610,
        "end": 2611,
        "className": "syntax-operator"
      },
      {
        "start": 2612,
        "end": 2614,
        "className": "syntax-type"
      },
      {
        "start": 2614,
        "end": 2615,
        "className": "syntax-punctuation"
      },
      {
        "start": 2640,
        "end": 2641,
        "className": "syntax-operator"
      },
      {
        "start": 2642,
        "end": 2644,
        "className": "syntax-type"
      },
      {
        "start": 2644,
        "end": 2645,
        "className": "syntax-punctuation"
      },
      {
        "start": 2664,
        "end": 2665,
        "className": "syntax-operator"
      },
      {
        "start": 2666,
        "end": 2668,
        "className": "syntax-type"
      },
      {
        "start": 2668,
        "end": 2669,
        "className": "syntax-punctuation"
      },
      {
        "start": 2683,
        "end": 2684,
        "className": "syntax-operator"
      },
      {
        "start": 2685,
        "end": 2691,
        "className": "syntax-variable"
      },
      {
        "start": 2691,
        "end": 2692,
        "className": "syntax-punctuation"
      },
      {
        "start": 2701,
        "end": 2703,
        "className": "syntax-keyword"
      },
      {
        "start": 2704,
        "end": 2706,
        "className": "syntax-type"
      },
      {
        "start": 2706,
        "end": 2707,
        "className": "syntax-punctuation"
      },
      {
        "start": 2721,
        "end": 2722,
        "className": "syntax-operator"
      },
      {
        "start": 2723,
        "end": 2729,
        "className": "syntax-variable"
      },
      {
        "start": 2729,
        "end": 2730,
        "className": "syntax-punctuation"
      },
      {
        "start": 2739,
        "end": 2741,
        "className": "syntax-keyword"
      },
      {
        "start": 2742,
        "end": 2744,
        "className": "syntax-type"
      },
      {
        "start": 2744,
        "end": 2745,
        "className": "syntax-punctuation"
      },
      {
        "start": 2756,
        "end": 2757,
        "className": "syntax-operator"
      },
      {
        "start": 2758,
        "end": 2764,
        "className": "syntax-variable"
      },
      {
        "start": 2764,
        "end": 2765,
        "className": "syntax-punctuation"
      },
      {
        "start": 2771,
        "end": 2773,
        "className": "syntax-keyword"
      },
      {
        "start": 2774,
        "end": 2776,
        "className": "syntax-type"
      },
      {
        "start": 2776,
        "end": 2777,
        "className": "syntax-punctuation"
      },
      {
        "start": 2795,
        "end": 2796,
        "className": "syntax-operator"
      },
      {
        "start": 2797,
        "end": 2803,
        "className": "syntax-variable"
      },
      {
        "start": 2803,
        "end": 2804,
        "className": "syntax-punctuation"
      },
      {
        "start": 2817,
        "end": 2819,
        "className": "syntax-keyword"
      },
      {
        "start": 2825,
        "end": 2826,
        "className": "syntax-punctuation"
      }
    ]
  },
  {
    "language": "nix",
    "name": "nix/nixpkgs_nix_module.nix",
    "code": "/*\n  Manages /etc/nix/nix.conf.\n\n  See also\n   - ./nix-channel.nix\n   - ./nix-flakes.nix\n   - ./nix-remote-build.nix\n   - nixos/modules/services/system/nix-daemon.nix\n*/\n{\n  config,\n  lib,\n  pkgs,\n  ...\n}:\n\nlet\n  inherit (lib)\n    literalExpression\n    mapAttrsToList\n    mkAfter\n    mkIf\n    mkOption\n    mkRenamedOptionModuleWith\n    optionals\n    systems\n    types\n    ;\n\n  cfg = config.nix;\n\n  nixPackage = cfg.package.out;\n\n  defaultSystemFeatures = [\n    \"nixos-test\"\n    \"benchmark\"\n    \"big-parallel\"\n    \"kvm\"\n  ]\n  ++ optionals (pkgs.stdenv.hostPlatform ? gcc.arch) (\n    # a builder can run code for `gcc.arch` and inferior architectures\n    [ \"gccarch-${pkgs.stdenv.hostPlatform.gcc.arch}\" ]\n    ++ map (x: \"gccarch-${x}\") (\n      systems.architectures.inferiors.${pkgs.stdenv.hostPlatform.gcc.arch} or [ ]\n    )\n  );\n\n  legacyConfMappings = {\n    useSandbox = \"sandbox\";\n    buildCores = \"cores\";\n    maxJobs = \"max-jobs\";\n    sandboxPaths = \"extra-sandbox-paths\";\n    binaryCaches = \"substituters\";\n    trustedBinaryCaches = \"trusted-substituters\";\n    binaryCachePublicKeys = \"trusted-public-keys\";\n    autoOptimiseStore = \"auto-optimise-store\";\n    requireSignedBinaryCaches = \"require-sigs\";\n    trustedUsers = \"trusted-users\";\n    allowedUsers = \"allowed-users\";\n    systemFeatures = \"system-features\";\n  };\n\n  semanticConfType =\n    with types;\n    let\n      confAtom =\n        nullOr (oneOf [\n          bool\n          int\n          float\n          str\n          path\n          package\n        ])\n        // {\n          description = \"Nix config atom (null, bool, int, float, str, path or package)\";\n        };\n    in\n    attrsOf (either confAtom (listOf confAtom));\n\n  nixConf =\n    (pkgs.formats.nixConf {\n      inherit (cfg)\n        package\n        checkAllErrors\n        checkConfig\n        extraOptions\n        ;\n      inherit (nixPackage) version;\n    }).generate\n      \"nix.conf\"\n      cfg.settings;\n\nin",
    "spans": [
      {
        "start": 0,
        "end": 2,
        "className": "syntax-comment"
      },
      {
        "start": 3,
        "end": 31,
        "className": "syntax-comment"
      },
      {
        "start": 33,
        "end": 43,
        "className": "syntax-comment"
      },
      {
        "start": 44,
        "end": 66,
        "className": "syntax-comment"
      },
      {
        "start": 67,
        "end": 88,
        "className": "syntax-comment"
      },
      {
        "start": 89,
        "end": 116,
        "className": "syntax-comment"
      },
      {
        "start": 117,
        "end": 166,
        "className": "syntax-comment"
      },
      {
        "start": 167,
        "end": 169,
        "className": "syntax-comment"
      },
      {
        "start": 170,
        "end": 171,
        "className": "syntax-punctuation"
      },
      {
        "start": 174,
        "end": 180,
        "className": "syntax-variable"
      },
      {
        "start": 180,
        "end": 181,
        "className": "syntax-punctuation"
      },
      {
        "start": 184,
        "end": 187,
        "className": "syntax-variable"
      },
      {
        "start": 187,
        "end": 188,
        "className": "syntax-punctuation"
      },
      {
        "start": 191,
        "end": 195,
        "className": "syntax-variable"
      },
      {
        "start": 195,
        "end": 196,
        "className": "syntax-punctuation"
      },
      {
        "start": 203,
        "end": 204,
        "className": "syntax-punctuation"
      },
      {
        "start": 207,
        "end": 210,
        "className": "syntax-keyword"
      },
      {
        "start": 213,
        "end": 220,
        "className": "syntax-keyword"
      },
      {
        "start": 221,
        "end": 222,
        "className": "syntax-punctuation"
      },
      {
        "start": 222,
        "end": 225,
        "className": "syntax-variable"
      },
      {
        "start": 225,
        "end": 226,
        "className": "syntax-punctuation"
      },
      {
        "start": 231,
        "end": 248,
        "className": "syntax-variable"
      },
      {
        "start": 253,
        "end": 267,
        "className": "syntax-variable"
      },
      {
        "start": 272,
        "end": 279,
        "className": "syntax-variable"
      },
      {
        "start": 284,
        "end": 288,
        "className": "syntax-variable"
      },
      {
        "start": 293,
        "end": 301,
        "className": "syntax-variable"
      },
      {
        "start": 306,
        "end": 331,
        "className": "syntax-variable"
      },
      {
        "start": 336,
        "end": 345,
        "className": "syntax-variable"
      },
      {
        "start": 350,
        "end": 357,
        "className": "syntax-variable"
      },
      {
        "start": 362,
        "end": 367,
        "className": "syntax-variable"
      },
      {
        "start": 372,
        "end": 373,
        "className": "syntax-punctuation"
      },
      {
        "start": 377,
        "end": 380,
        "className": "syntax-property"
      },
      {
        "start": 381,
        "end": 382,
        "className": "syntax-punctuation"
      },
      {
        "start": 383,
        "end": 389,
        "className": "syntax-variable"
      },
      {
        "start": 389,
        "end": 390,
        "className": "syntax-punctuation"
      },
      {
        "start": 390,
        "end": 393,
        "className": "syntax-property"
      },
      {
        "start": 393,
        "end": 394,
        "className": "syntax-punctuation"
      },
      {
        "start": 398,
        "end": 408,
        "className": "syntax-property"
      },
      {
        "start": 409,
        "end": 410,
        "className": "syntax-punctuation"
      },
      {
        "start": 411,
        "end": 414,
        "className": "syntax-variable"
      },
      {
        "start": 414,
        "end": 415,
        "className": "syntax-punctuation"
      },
      {
        "start": 415,
        "end": 422,
        "className": "syntax-property"
      },
      {
        "start": 422,
        "end": 423,
        "className": "syntax-punctuation"
      },
      {
        "start": 423,
        "end": 426,
        "className": "syntax-property"
      },
      {
        "start": 426,
        "end": 427,
        "className": "syntax-punctuation"
      },
      {
        "start": 431,
        "end": 452,
        "className": "syntax-property"
      },
      {
        "start": 453,
        "end": 454,
        "className": "syntax-punctuation"
      },
      {
        "start": 455,
        "end": 456,
        "className": "syntax-punctuation"
      },
      {
        "start": 461,
        "end": 473,
        "className": "syntax-string"
      },
      {
        "start": 478,
        "end": 489,
        "className": "syntax-string"
      },
      {
        "start": 494,
        "end": 508,
        "className": "syntax-string"
      },
      {
        "start": 513,
        "end": 518,
        "className": "syntax-string"
      },
      {
        "start": 521,
        "end": 522,
        "className": "syntax-punctuation"
      },
      {
        "start": 525,
        "end": 527,
        "className": "syntax-operator"
      },
      {
        "start": 528,
        "end": 537,
        "className": "syntax-function"
      },
      {
        "start": 538,
        "end": 539,
        "className": "syntax-punctuation"
      },
      {
        "start": 539,
        "end": 543,
        "className": "syntax-variable"
      },
      {
        "start": 543,
        "end": 544,
        "className": "syntax-punctuation"
      },
      {
        "start": 544,
        "end": 550,
        "className": "syntax-property"
      },
      {
        "start": 550,
        "end": 551,
        "className": "syntax-punctuation"
      },
      {
        "start": 551,
        "end": 563,
        "className": "syntax-property"
      },
      {
        "start": 566,
        "end": 569,
        "className": "syntax-variable"
      },
      {
        "start": 569,
        "end": 570,
        "className": "syntax-punctuation"
      },
      {
        "start": 570,
        "end": 574,
        "className": "syntax-variable"
      },
      {
        "start": 574,
        "end": 575,
        "className": "syntax-punctuation"
      },
      {
        "start": 576,
        "end": 577,
        "className": "syntax-punctuation"
      },
      {
        "start": 582,
        "end": 648,
        "className": "syntax-comment"
      },
      {
        "start": 653,
        "end": 654,
        "className": "syntax-punctuation"
      },
      {
        "start": 655,
        "end": 701,
        "className": "syntax-string"
      },
      {
        "start": 702,
        "end": 703,
        "className": "syntax-punctuation"
      },
      {
        "start": 708,
        "end": 710,
        "className": "syntax-operator"
      },
      {
        "start": 711,
        "end": 714,
        "className": "syntax-function"
      },
      {
        "start": 715,
        "end": 716,
        "className": "syntax-punctuation"
      },
      {
        "start": 716,
        "end": 717,
        "className": "syntax-variable"
      },
      {
        "start": 719,
        "end": 733,
        "className": "syntax-string"
      },
      {
        "start": 733,
        "end": 734,
        "className": "syntax-punctuation"
      },
      {
        "start": 735,
        "end": 736,
        "className": "syntax-punctuation"
      },
      {
        "start": 743,
        "end": 750,
        "className": "syntax-variable"
      },
      {
        "start": 750,
        "end": 751,
        "className": "syntax-punctuation"
      },
      {
        "start": 751,
        "end": 764,
        "className": "syntax-property"
      },
      {
        "start": 764,
        "end": 765,
        "className": "syntax-punctuation"
      },
      {
        "start": 765,
        "end": 774,
        "className": "syntax-property"
      },
      {
        "start": 774,
        "end": 777,
        "className": "syntax-punctuation"
      },
      {
        "start": 777,
        "end": 781,
        "className": "syntax-property"
      },
      {
        "start": 781,
        "end": 782,
        "className": "syntax-punctuation"
      },
      {
        "start": 782,
        "end": 788,
        "className": "syntax-property"
      },
      {
        "start": 788,
        "end": 789,
        "className": "syntax-punctuation"
      },
      {
        "start": 789,
        "end": 801,
        "className": "syntax-property"
      },
      {
        "start": 801,
        "end": 802,
        "className": "syntax-punctuation"
      },
      {
        "start": 802,
        "end": 805,
        "className": "syntax-property"
      },
      {
        "start": 805,
        "end": 806,
        "className": "syntax-punctuation"
      },
      {
        "start": 806,
        "end": 810,
        "className": "syntax-property"
      },
      {
        "start": 810,
        "end": 811,
        "className": "syntax-punctuation"
      },
      {
        "start": 812,
        "end": 814,
        "className": "syntax-keyword"
      },
      {
        "start": 815,
        "end": 816,
        "className": "syntax-punctuation"
      },
      {
        "start": 817,
        "end": 818,
        "className": "syntax-punctuation"
      },
      {
        "start": 823,
        "end": 824,
        "className": "syntax-punctuation"
      },
      {
        "start": 827,
        "end": 829,
        "className": "syntax-punctuation"
      },
      {
        "start": 833,
        "end": 851,
        "className": "syntax-property"
      },
      {
        "start": 852,
        "end": 853,
        "className": "syntax-punctuation"
      },
      {
        "start": 854,
        "end": 855,
        "className": "syntax-punctuation"
      },
      {
        "start": 860,
        "end": 870,
        "className": "syntax-property"
      },
      {
        "start": 871,
        "end": 872,
        "className": "syntax-punctuation"
      },
      {
        "start": 873,
        "end": 882,
        "className": "syntax-string"
      },
      {
        "start": 882,
        "end": 883,
        "className": "syntax-punctuation"
      },
      {
        "start": 888,
        "end": 898,
        "className": "syntax-property"
      },
      {
        "start": 899,
        "end": 900,
        "className": "syntax-punctuation"
      },
      {
        "start": 901,
        "end": 908,
        "className": "syntax-string"
      },
      {
        "start": 908,
        "end": 909,
        "className": "syntax-punctuation"
      },
      {
        "start": 914,
        "end": 921,
        "className": "syntax-property"
      },
      {
        "start": 922,
        "end": 923,
        "className": "syntax-punctuation"
      },
      {
        "start": 924,
        "end": 934,
        "className": "syntax-string"
      },
      {
        "start": 934,
        "end": 935,
        "className": "syntax-punctuation"
      },
      {
        "start": 940,
        "end": 952,
        "className": "syntax-property"
      },
      {
        "start": 953,
        "end": 954,
        "className": "syntax-punctuation"
      },
      {
        "start": 955,
        "end": 976,
        "className": "syntax-string"
      },
      {
        "start": 976,
        "end": 977,
        "className": "syntax-punctuation"
      },
      {
        "start": 982,
        "end": 994,
        "className": "syntax-property"
      },
      {
        "start": 995,
        "end": 996,
        "className": "syntax-punctuation"
      },
      {
        "start": 997,
        "end": 1011,
        "className": "syntax-string"
      },
      {
        "start": 1011,
        "end": 1012,
        "className": "syntax-punctuation"
      },
      {
        "start": 1017,
        "end": 1036,
        "className": "syntax-property"
      },
      {
        "start": 1037,
        "end": 1038,
        "className": "syntax-punctuation"
      },
      {
        "start": 1039,
        "end": 1061,
        "className": "syntax-string"
      },
      {
        "start": 1061,
        "end": 1062,
        "className": "syntax-punctuation"
      },
      {
        "start": 1067,
        "end": 1088,
        "className": "syntax-property"
      },
      {
        "start": 1089,
        "end": 1090,
        "className": "syntax-punctuation"
      },
      {
        "start": 1091,
        "end": 1112,
        "className": "syntax-string"
      },
      {
        "start": 1112,
        "end": 1113,
        "className": "syntax-punctuation"
      },
      {
        "start": 1118,
        "end": 1135,
        "className": "syntax-property"
      },
      {
        "start": 1136,
        "end": 1137,
        "className": "syntax-punctuation"
      },
      {
        "start": 1138,
        "end": 1159,
        "className": "syntax-string"
      },
      {
        "start": 1159,
        "end": 1160,
        "className": "syntax-punctuation"
      },
      {
        "start": 1165,
        "end": 1190,
        "className": "syntax-property"
      },
      {
        "start": 1191,
        "end": 1192,
        "className": "syntax-punctuation"
      },
      {
        "start": 1193,
        "end": 1207,
        "className": "syntax-string"
      },
      {
        "start": 1207,
        "end": 1208,
        "className": "syntax-punctuation"
      },
      {
        "start": 1213,
        "end": 1225,
        "className": "syntax-property"
      },
      {
        "start": 1226,
        "end": 1227,
        "className": "syntax-punctuation"
      },
      {
        "start": 1228,
        "end": 1243,
        "className": "syntax-string"
      },
      {
        "start": 1243,
        "end": 1244,
        "className": "syntax-punctuation"
      },
      {
        "start": 1249,
        "end": 1261,
        "className": "syntax-property"
      },
      {
        "start": 1262,
        "end": 1263,
        "className": "syntax-punctuation"
      },
      {
        "start": 1264,
        "end": 1279,
        "className": "syntax-string"
      },
      {
        "start": 1279,
        "end": 1280,
        "className": "syntax-punctuation"
      },
      {
        "start": 1285,
        "end": 1299,
        "className": "syntax-property"
      },
      {
        "start": 1300,
        "end": 1301,
        "className": "syntax-punctuation"
      },
      {
        "start": 1302,
        "end": 1319,
        "className": "syntax-string"
      },
      {
        "start": 1319,
        "end": 1320,
        "className": "syntax-punctuation"
      },
      {
        "start": 1323,
        "end": 1325,
        "className": "syntax-punctuation"
      },
      {
        "start": 1329,
        "end": 1345,
        "className": "syntax-property"
      },
      {
        "start": 1346,
        "end": 1347,
        "className": "syntax-punctuation"
      },
      {
        "start": 1352,
        "end": 1356,
        "className": "syntax-keyword"
      },
      {
        "start": 1357,
        "end": 1362,
        "className": "syntax-variable"
      },
      {
        "start": 1362,
        "end": 1363,
        "className": "syntax-punctuation"
      },
      {
        "start": 1368,
        "end": 1371,
        "className": "syntax-keyword"
      },
      {
        "start": 1378,
        "end": 1386,
        "className": "syntax-property"
      },
      {
        "start": 1387,
        "end": 1388,
        "className": "syntax-punctuation"
      },
      {
        "start": 1397,
        "end": 1403,
        "className": "syntax-function"
      },
      {
        "start": 1404,
        "end": 1405,
        "className": "syntax-punctuation"
      },
      {
        "start": 1405,
        "end": 1410,
        "className": "syntax-function"
      },
      {
        "start": 1411,
        "end": 1412,
        "className": "syntax-punctuation"
      },
      {
        "start": 1423,
        "end": 1427,
        "className": "syntax-variable"
      },
      {
        "start": 1438,
        "end": 1441,
        "className": "syntax-variable"
      },
      {
        "start": 1452,
        "end": 1457,
        "className": "syntax-variable"
      },
      {
        "start": 1468,
        "end": 1471,
        "className": "syntax-variable"
      },
      {
        "start": 1482,
        "end": 1486,
        "className": "syntax-variable"
      },
      {
        "start": 1497,
        "end": 1504,
        "className": "syntax-variable"
      },
      {
        "start": 1513,
        "end": 1515,
        "className": "syntax-punctuation"
      },
      {
        "start": 1524,
        "end": 1526,
        "className": "syntax-operator"
      },
      {
        "start": 1527,
        "end": 1528,
        "className": "syntax-punctuation"
      },
      {
        "start": 1539,
        "end": 1550,
        "className": "syntax-property"
      },
      {
        "start": 1551,
        "end": 1552,
        "className": "syntax-punctuation"
      },
      {
        "start": 1553,
        "end": 1617,
        "className": "syntax-string"
      },
      {
        "start": 1617,
        "end": 1618,
        "className": "syntax-punctuation"
      },
      {
        "start": 1627,
        "end": 1629,
        "className": "syntax-punctuation"
      },
      {
        "start": 1634,
        "end": 1636,
        "className": "syntax-keyword"
      },
      {
        "start": 1641,
        "end": 1648,
        "className": "syntax-function"
      },
      {
        "start": 1649,
        "end": 1650,
        "className": "syntax-punctuation"
      },
      {
        "start": 1650,
        "end": 1656,
        "className": "syntax-function"
      },
      {
        "start": 1657,
        "end": 1665,
        "className": "syntax-variable"
      },
      {
        "start": 1666,
        "end": 1667,
        "className": "syntax-punctuation"
      },
      {
        "start": 1667,
        "end": 1673,
        "className": "syntax-function"
      },
      {
        "start": 1674,
        "end": 1682,
        "className": "syntax-variable"
      },
      {
        "start": 1682,
        "end": 1685,
        "className": "syntax-punctuation"
      },
      {
        "start": 1689,
        "end": 1696,
        "className": "syntax-property"
      },
      {
        "start": 1697,
        "end": 1698,
        "className": "syntax-punctuation"
      },
      {
        "start": 1703,
        "end": 1704,
        "className": "syntax-punctuation"
      },
      {
        "start": 1704,
        "end": 1708,
        "className": "syntax-variable"
      },
      {
        "start": 1708,
        "end": 1709,
        "className": "syntax-punctuation"
      },
      {
        "start": 1709,
        "end": 1716,
        "className": "syntax-property"
      },
      {
        "start": 1716,
        "end": 1717,
        "className": "syntax-punctuation"
      },
      {
        "start": 1717,
        "end": 1724,
        "className": "syntax-property"
      },
      {
        "start": 1725,
        "end": 1726,
        "className": "syntax-punctuation"
      },
      {
        "start": 1733,
        "end": 1740,
        "className": "syntax-keyword"
      },
      {
        "start": 1741,
        "end": 1742,
        "className": "syntax-punctuation"
      },
      {
        "start": 1742,
        "end": 1745,
        "className": "syntax-variable"
      },
      {
        "start": 1745,
        "end": 1746,
        "className": "syntax-punctuation"
      },
      {
        "start": 1755,
        "end": 1762,
        "className": "syntax-variable"
      },
      {
        "start": 1771,
        "end": 1785,
        "className": "syntax-variable"
      },
      {
        "start": 1794,
        "end": 1805,
        "className": "syntax-variable"
      },
      {
        "start": 1814,
        "end": 1826,
        "className": "syntax-variable"
      },
      {
        "start": 1835,
        "end": 1836,
        "className": "syntax-punctuation"
      },
      {
        "start": 1843,
        "end": 1850,
        "className": "syntax-keyword"
      },
      {
        "start": 1851,
        "end": 1852,
        "className": "syntax-punctuation"
      },
      {
        "start": 1852,
        "end": 1862,
        "className": "syntax-variable"
      },
      {
        "start": 1862,
        "end": 1863,
        "className": "syntax-punctuation"
      },
      {
        "start": 1864,
        "end": 1871,
        "className": "syntax-variable"
      },
      {
        "start": 1871,
        "end": 1872,
        "className": "syntax-punctuation"
      },
      {
        "start": 1877,
        "end": 1880,
        "className": "syntax-punctuation"
      },
      {
        "start": 1880,
        "end": 1888,
        "className": "syntax-property"
      },
      {
        "start": 1895,
        "end": 1905,
        "className": "syntax-string"
      },
      {
        "start": 1912,
        "end": 1915,
        "className": "syntax-variable"
      },
      {
        "start": 1915,
        "end": 1916,
        "className": "syntax-punctuation"
      },
      {
        "start": 1916,
        "end": 1924,
        "className": "syntax-property"
      },
      {
        "start": 1924,
        "end": 1925,
        "className": "syntax-punctuation"
      },
      {
        "start": 1927,
        "end": 1929,
        "className": "syntax-keyword"
      }
    ]
  },
  {
    "language": "python",
    "name": "python/cpython_asyncio_tasks.py",
    "code": "# Helper to generate new task names\n# This uses itertools.count() instead of a \"+= 1\" operation because the latter\n# is not thread safe. See bpo-11866 for a longer explanation.\n_task_name_counter = itertools.count(1).__next__\n\n\ndef current_task(loop=None):\n    \"\"\"Return a currently executed task.\"\"\"\n    if loop is None:\n        loop = events.get_running_loop()\n    return _current_tasks.get(loop)\n\n\ndef all_tasks(loop=None):\n    \"\"\"Return a set of all tasks for the loop.\"\"\"\n    if loop is None:\n        loop = events.get_running_loop()\n    # capturing the set of eager tasks first, so if an eager task \"graduates\"\n    # to a regular task in another thread, we don't risk missing it.\n    eager_tasks = list(_eager_tasks)\n    # Looping over the WeakSet isn't safe as it can be updated from another\n    # thread, therefore we cast it to list prior to filtering. The list cast\n    # itself requires iteration, so we repeat it several times ignoring\n    # RuntimeErrors (which are not very likely to occur).\n    # See issues 34970 and 36607 for details.\n    scheduled_tasks = None\n    i = 0\n    while True:\n        try:\n            scheduled_tasks = list(_scheduled_tasks)\n        except RuntimeError:\n            i += 1\n            if i >= 1000:\n                raise\n        else:\n            break\n    return {t for t in itertools.chain(scheduled_tasks, eager_tasks)\n            if futures._get_loop(t) is loop and not t.done()}\n\n\nclass Task(futures._PyFuture):  # Inherit Python Task implementation\n                                # from a Python Future implementation.\n\n    \"\"\"A coroutine wrapped in a Future.\"\"\"\n\n    # An important invariant maintained while a Task not done:\n    # _fut_waiter is either None or a Future.  The Future\n    # can be either done() or not done().\n    # The task can be in any of 3 states:\n    #\n    # - 1: _fut_waiter is not None and not _fut_waiter.done():\n    #      __step() is *not* scheduled and the Task is waiting for _fut_waiter.\n    # - 2: (_fut_waiter is None or _fut_waiter.done()) and __step() is scheduled:\n    #       the Task is waiting for __step() to be executed.\n    # - 3:  _fut_waiter is None and __step() is *not* scheduled:\n    #       the Task is currently executing (in __step()).\n    #\n    # * In state 1, one of the callbacks of __fut_waiter must be __wakeup().\n    # * The transition from 1 to 2 happens when _fut_waiter becomes done(),\n    #   as it schedules __wakeup() to be called (which calls __step() so\n    #   we way that __step() is scheduled).\n    # * It transitions from 2 to 3 when __step() is executed, and it clears\n    #   _fut_waiter to None.\n\n    # If False, don't log a message if the task is destroyed while its\n    # status is still pending\n    _log_destroy_pending = True\n\n    def __init__(self, coro, *, loop=None, name=None, context=None,\n                 eager_start=False):\n        super().__init__(loop=loop)\n        if self._source_traceback:\n            del self._source_traceback[-1]\n        if not coroutines.iscoroutine(coro):\n            # raise after Future.__init__(), attrs are required for __del__\n            # prevent logging for pending task in __del__\n            self._log_destroy_pending = False\n            raise TypeError(f\"a coroutine was expected, got {coro!r}\")\n\n        if name is None:\n            self._name = f'Task-{_task_name_counter()}'\n        else:\n            self._name = str(name)\n\n        self._num_cancels_requested = 0\n        self._must_cancel = False\n        self._fut_waiter = None\n        self._coro = coro\n        if context is None:\n            self._context = contextvars.copy_context()\n        else:\n            self._context = context\n\n        if eager_start and self._loop.is_running():",
    "spans": [
      {
        "start": 0,
        "end": 35,
        "className": "syntax-comment"
      },
      {
        "start": 36,
        "end": 114,
        "className": "syntax-comment"
      },
      {
        "start": 115,
        "end": 176,
        "className": "syntax-comment"
      },
      {
        "start": 177,
        "end": 195,
        "className": "syntax-variable"
      },
      {
        "start": 196,
        "end": 197,
        "className": "syntax-operator"
      },
      {
        "start": 198,
        "end": 207,
        "className": "syntax-variable"
      },
      {
        "start": 208,
        "end": 213,
        "className": "syntax-property"
      },
      {
        "start": 214,
        "end": 215,
        "className": "syntax-number"
      },
      {
        "start": 217,
        "end": 225,
        "className": "syntax-property"
      },
      {
        "start": 228,
        "end": 231,
        "className": "syntax-keyword"
      },
      {
        "start": 232,
        "end": 244,
        "className": "syntax-function"
      },
      {
        "start": 245,
        "end": 249,
        "className": "syntax-variable"
      },
      {
        "start": 249,
        "end": 250,
        "className": "syntax-operator"
      },
      {
        "start": 250,
        "end": 254,
        "className": "syntax-constant"
      },
      {
        "start": 261,
        "end": 300,
        "className": "syntax-string"
      },
      {
        "start": 305,
        "end": 307,
        "className": "syntax-keyword"
      },
      {
        "start": 308,
        "end": 312,
        "className": "syntax-variable"
      },
      {
        "start": 313,
        "end": 315,
        "className": "syntax-operator"
      },
      {
        "start": 316,
        "end": 320,
        "className": "syntax-constant"
      },
      {
        "start": 330,
        "end": 334,
        "className": "syntax-variable"
      },
      {
        "start": 335,
        "end": 336,
        "className": "syntax-operator"
      },
      {
        "start": 337,
        "end": 343,
        "className": "syntax-variable"
      },
      {
        "start": 344,
        "end": 360,
        "className": "syntax-property"
      },
      {
        "start": 367,
        "end": 373,
        "className": "syntax-keyword"
      },
      {
        "start": 374,
        "end": 388,
        "className": "syntax-variable"
      },
      {
        "start": 389,
        "end": 392,
        "className": "syntax-property"
      },
      {
        "start": 393,
        "end": 397,
        "className": "syntax-variable"
      },
      {
        "start": 401,
        "end": 404,
        "className": "syntax-keyword"
      },
      {
        "start": 405,
        "end": 414,
        "className": "syntax-function"
      },
      {
        "start": 415,
        "end": 419,
        "className": "syntax-variable"
      },
      {
        "start": 419,
        "end": 420,
        "className": "syntax-operator"
      },
      {
        "start": 420,
        "end": 424,
        "className": "syntax-constant"
      },
      {
        "start": 431,
        "end": 476,
        "className": "syntax-string"
      },
      {
        "start": 481,
        "end": 483,
        "className": "syntax-keyword"
      },
      {
        "start": 484,
        "end": 488,
        "className": "syntax-variable"
      },
      {
        "start": 489,
        "end": 491,
        "className": "syntax-operator"
      },
      {
        "start": 492,
        "end": 496,
        "className": "syntax-constant"
      },
      {
        "start": 506,
        "end": 510,
        "className": "syntax-variable"
      },
      {
        "start": 511,
        "end": 512,
        "className": "syntax-operator"
      },
      {
        "start": 513,
        "end": 519,
        "className": "syntax-variable"
      },
      {
        "start": 520,
        "end": 536,
        "className": "syntax-property"
      },
      {
        "start": 543,
        "end": 616,
        "className": "syntax-comment"
      },
      {
        "start": 621,
        "end": 685,
        "className": "syntax-comment"
      },
      {
        "start": 690,
        "end": 701,
        "className": "syntax-variable"
      },
      {
        "start": 702,
        "end": 703,
        "className": "syntax-operator"
      },
      {
        "start": 704,
        "end": 708,
        "className": "syntax-function"
      },
      {
        "start": 709,
        "end": 721,
        "className": "syntax-variable"
      },
      {
        "start": 727,
        "end": 798,
        "className": "syntax-comment"
      },
      {
        "start": 803,
        "end": 875,
        "className": "syntax-comment"
      },
      {
        "start": 880,
        "end": 947,
        "className": "syntax-comment"
      },
      {
        "start": 952,
        "end": 1005,
        "className": "syntax-comment"
      },
      {
        "start": 1010,
        "end": 1051,
        "className": "syntax-comment"
      },
      {
        "start": 1056,
        "end": 1071,
        "className": "syntax-variable"
      },
      {
        "start": 1072,
        "end": 1073,
        "className": "syntax-operator"
      },
      {
        "start": 1074,
        "end": 1078,
        "className": "syntax-constant"
      },
      {
        "start": 1083,
        "end": 1084,
        "className": "syntax-variable"
      },
      {
        "start": 1085,
        "end": 1086,
        "className": "syntax-operator"
      },
      {
        "start": 1087,
        "end": 1088,
        "className": "syntax-number"
      },
      {
        "start": 1093,
        "end": 1098,
        "className": "syntax-keyword"
      },
      {
        "start": 1099,
        "end": 1103,
        "className": "syntax-constant"
      },
      {
        "start": 1113,
        "end": 1116,
        "className": "syntax-keyword"
      },
      {
        "start": 1130,
        "end": 1145,
        "className": "syntax-variable"
      },
      {
        "start": 1146,
        "end": 1147,
        "className": "syntax-operator"
      },
      {
        "start": 1148,
        "end": 1152,
        "className": "syntax-function"
      },
      {
        "start": 1153,
        "end": 1169,
        "className": "syntax-variable"
      },
      {
        "start": 1179,
        "end": 1185,
        "className": "syntax-keyword"
      },
      {
        "start": 1186,
        "end": 1198,
        "className": "syntax-type"
      },
      {
        "start": 1212,
        "end": 1213,
        "className": "syntax-variable"
      },
      {
        "start": 1214,
        "end": 1216,
        "className": "syntax-operator"
      },
      {
        "start": 1217,
        "end": 1218,
        "className": "syntax-number"
      },
      {
        "start": 1231,
        "end": 1233,
        "className": "syntax-keyword"
      },
      {
        "start": 1234,
        "end": 1235,
        "className": "syntax-variable"
      },
      {
        "start": 1236,
        "end": 1238,
        "className": "syntax-operator"
      },
      {
        "start": 1239,
        "end": 1243,
        "className": "syntax-number"
      },
      {
        "start": 1261,
        "end": 1266,
        "className": "syntax-keyword"
      },
      {
        "start": 1275,
        "end": 1279,
        "className": "syntax-keyword"
      },
      {
        "start": 1293,
        "end": 1298,
        "className": "syntax-keyword"
      },
      {
        "start": 1303,
        "end": 1309,
        "className": "syntax-keyword"
      },
      {
        "start": 1311,
        "end": 1312,
        "className": "syntax-variable"
      },
      {
        "start": 1313,
        "end": 1316,
        "className": "syntax-keyword"
      },
      {
        "start": 1317,
        "end": 1318,
        "className": "syntax-variable"
      },
      {
        "start": 1319,
        "end": 1321,
        "className": "syntax-operator"
      },
      {
        "start": 1322,
        "end": 1331,
        "className": "syntax-variable"
      },
      {
        "start": 1332,
        "end": 1337,
        "className": "syntax-property"
      },
      {
        "start": 1338,
        "end": 1353,
        "className": "syntax-variable"
      },
      {
        "start": 1355,
        "end": 1366,
        "className": "syntax-variable"
      },
      {
        "start": 1380,
        "end": 1382,
        "className": "syntax-keyword"
      },
      {
        "start": 1383,
        "end": 1390,
        "className": "syntax-variable"
      },
      {
        "start": 1391,
        "end": 1400,
        "className": "syntax-property"
      },
      {
        "start": 1401,
        "end": 1402,
        "className": "syntax-variable"
      },
      {
        "start": 1404,
        "end": 1406,
        "className": "syntax-operator"
      },
      {
        "start": 1407,
        "end": 1411,
        "className": "syntax-variable"
      },
      {
        "start": 1412,
        "end": 1415,
        "className": "syntax-operator"
      },
      {
        "start": 1416,
        "end": 1419,
        "className": "syntax-operator"
      },
      {
        "start": 1420,
        "end": 1421,
        "className": "syntax-variable"
      },
      {
        "start": 1422,
        "end": 1426,
        "className": "syntax-property"
      },
      {
        "start": 1432,
        "end": 1437,
        "className": "syntax-keyword"
      },
      {
        "start": 1438,
        "end": 1442,
        "className": "syntax-type"
      },
      {
        "start": 1443,
        "end": 1450,
        "className": "syntax-variable"
      },
      {
        "start": 1451,
        "end": 1460,
        "className": "syntax-property"
      },
      {
        "start": 1464,
        "end": 1500,
        "className": "syntax-comment"
      },
      {
        "start": 1533,
        "end": 1571,
        "className": "syntax-comment"
      },
      {
        "start": 1577,
        "end": 1615,
        "className": "syntax-string"
      },
      {
        "start": 1621,
        "end": 1679,
        "className": "syntax-comment"
      },
      {
        "start": 1684,
        "end": 1737,
        "className": "syntax-comment"
      },
      {
        "start": 1742,
        "end": 1779,
        "className": "syntax-comment"
      },
      {
        "start": 1784,
        "end": 1821,
        "className": "syntax-comment"
      },
      {
        "start": 1826,
        "end": 1827,
        "className": "syntax-comment"
      },
      {
        "start": 1832,
        "end": 1890,
        "className": "syntax-comment"
      },
      {
        "start": 1895,
        "end": 1970,
        "className": "syntax-comment"
      },
      {
        "start": 1975,
        "end": 2052,
        "className": "syntax-comment"
      },
      {
        "start": 2057,
        "end": 2113,
        "className": "syntax-comment"
      },
      {
        "start": 2118,
        "end": 2178,
        "className": "syntax-comment"
      },
      {
        "start": 2183,
        "end": 2237,
        "className": "syntax-comment"
      },
      {
        "start": 2242,
        "end": 2243,
        "className": "syntax-comment"
      },
      {
        "start": 2248,
        "end": 2320,
        "className": "syntax-comment"
      },
      {
        "start": 2325,
        "end": 2396,
        "className": "syntax-comment"
      },
      {
        "start": 2401,
        "end": 2469,
        "className": "syntax-comment"
      },
      {
        "start": 2474,
        "end": 2513,
        "className": "syntax-comment"
      },
      {
        "start": 2518,
        "end": 2589,
        "className": "syntax-comment"
      },
      {
        "start": 2594,
        "end": 2618,
        "className": "syntax-comment"
      },
      {
        "start": 2624,
        "end": 2690,
        "className": "syntax-comment"
      },
      {
        "start": 2695,
        "end": 2720,
        "className": "syntax-comment"
      },
      {
        "start": 2725,
        "end": 2745,
        "className": "syntax-variable"
      },
      {
        "start": 2746,
        "end": 2747,
        "className": "syntax-operator"
      },
      {
        "start": 2748,
        "end": 2752,
        "className": "syntax-constant"
      },
      {
        "start": 2758,
        "end": 2761,
        "className": "syntax-keyword"
      },
      {
        "start": 2762,
        "end": 2770,
        "className": "syntax-function"
      },
      {
        "start": 2771,
        "end": 2775,
        "className": "syntax-variable"
      },
      {
        "start": 2777,
        "end": 2781,
        "className": "syntax-variable"
      },
      {
        "start": 2783,
        "end": 2784,
        "className": "syntax-operator"
      },
      {
        "start": 2786,
        "end": 2790,
        "className": "syntax-variable"
      },
      {
        "start": 2790,
        "end": 2791,
        "className": "syntax-operator"
      },
      {
        "start": 2791,
        "end": 2795,
        "className": "syntax-constant"
      },
      {
        "start": 2797,
        "end": 2801,
        "className": "syntax-variable"
      },
      {
        "start": 2801,
        "end": 2802,
        "className": "syntax-operator"
      },
      {
        "start": 2802,
        "end": 2806,
        "className": "syntax-constant"
      },
      {
        "start": 2808,
        "end": 2815,
        "className": "syntax-variable"
      },
      {
        "start": 2815,
        "end": 2816,
        "className": "syntax-operator"
      },
      {
        "start": 2816,
        "end": 2820,
        "className": "syntax-constant"
      },
      {
        "start": 2839,
        "end": 2850,
        "className": "syntax-variable"
      },
      {
        "start": 2850,
        "end": 2851,
        "className": "syntax-operator"
      },
      {
        "start": 2851,
        "end": 2856,
        "className": "syntax-constant"
      },
      {
        "start": 2867,
        "end": 2872,
        "className": "syntax-function"
      },
      {
        "start": 2875,
        "end": 2883,
        "className": "syntax-property"
      },
      {
        "start": 2884,
        "end": 2888,
        "className": "syntax-variable"
      },
      {
        "start": 2888,
        "end": 2889,
        "className": "syntax-operator"
      },
      {
        "start": 2889,
        "end": 2893,
        "className": "syntax-variable"
      },
      {
        "start": 2903,
        "end": 2905,
        "className": "syntax-keyword"
      },
      {
        "start": 2906,
        "end": 2910,
        "className": "syntax-variable"
      },
      {
        "start": 2911,
        "end": 2928,
        "className": "syntax-property"
      },
      {
        "start": 2942,
        "end": 2945,
        "className": "syntax-keyword"
      },
      {
        "start": 2946,
        "end": 2950,
        "className": "syntax-variable"
      },
      {
        "start": 2951,
        "end": 2968,
        "className": "syntax-property"
      },
      {
        "start": 2969,
        "end": 2970,
        "className": "syntax-operator"
      },
      {
        "start": 2970,
        "end": 2971,
        "className": "syntax-number"
      },
      {
        "start": 2981,
        "end": 2983,
        "className": "syntax-keyword"
      },
      {
        "start": 2984,
        "end": 2987,
        "className": "syntax-operator"
      },
      {
        "start": 2988,
        "end": 2998,
        "className": "syntax-variable"
      },
      {
        "start": 2999,
        "end": 3010,
        "className": "syntax-property"
      },
      {
        "start": 3011,
        "end": 3015,
        "className": "syntax-variable"
      },
      {
        "start": 3030,
        "end": 3093,
        "className": "syntax-comment"
      },
      {
        "start": 3106,
        "end": 3151,
        "className": "syntax-comment"
      },
      {
        "start": 3164,
        "end": 3168,
        "className": "syntax-variable"
      },
      {
        "start": 3169,
        "end": 3189,
        "className": "syntax-property"
      },
      {
        "start": 3190,
        "end": 3191,
        "className": "syntax-operator"
      },
      {
        "start": 3192,
        "end": 3197,
        "className": "syntax-constant"
      },
      {
        "start": 3210,
        "end": 3215,
        "className": "syntax-keyword"
      },
      {
        "start": 3216,
        "end": 3225,
        "className": "syntax-function"
      },
      {
        "start": 3226,
        "end": 3267,
        "className": "syntax-string"
      },
      {
        "start": 3278,
        "end": 3280,
        "className": "syntax-keyword"
      },
      {
        "start": 3281,
        "end": 3285,
        "className": "syntax-variable"
      },
      {
        "start": 3286,
        "end": 3288,
        "className": "syntax-operator"
      },
      {
        "start": 3289,
        "end": 3293,
        "className": "syntax-constant"
      },
      {
        "start": 3307,
        "end": 3311,
        "className": "syntax-variable"
      },
      {
        "start": 3312,
        "end": 3317,
        "className": "syntax-property"
      },
      {
        "start": 3318,
        "end": 3319,
        "className": "syntax-operator"
      },
      {
        "start": 3320,
        "end": 3350,
        "className": "syntax-string"
      },
      {
        "start": 3359,
        "end": 3363,
        "className": "syntax-keyword"
      },
      {
        "start": 3377,
        "end": 3381,
        "className": "syntax-variable"
      },
      {
        "start": 3382,
        "end": 3387,
        "className": "syntax-property"
      },
      {
        "start": 3388,
        "end": 3389,
        "className": "syntax-operator"
      },
      {
        "start": 3390,
        "end": 3393,
        "className": "syntax-function"
      },
      {
        "start": 3394,
        "end": 3398,
        "className": "syntax-variable"
      },
      {
        "start": 3409,
        "end": 3413,
        "className": "syntax-variable"
      },
      {
        "start": 3414,
        "end": 3436,
        "className": "syntax-property"
      },
      {
        "start": 3437,
        "end": 3438,
        "className": "syntax-operator"
      },
      {
        "start": 3439,
        "end": 3440,
        "className": "syntax-number"
      },
      {
        "start": 3449,
        "end": 3453,
        "className": "syntax-variable"
      },
      {
        "start": 3454,
        "end": 3466,
        "className": "syntax-property"
      },
      {
        "start": 3467,
        "end": 3468,
        "className": "syntax-operator"
      },
      {
        "start": 3469,
        "end": 3474,
        "className": "syntax-constant"
      },
      {
        "start": 3483,
        "end": 3487,
        "className": "syntax-variable"
      },
      {
        "start": 3488,
        "end": 3499,
        "className": "syntax-property"
      },
      {
        "start": 3500,
        "end": 3501,
        "className": "syntax-operator"
      },
      {
        "start": 3502,
        "end": 3506,
        "className": "syntax-constant"
      },
      {
        "start": 3515,
        "end": 3519,
        "className": "syntax-variable"
      },
      {
        "start": 3520,
        "end": 3525,
        "className": "syntax-property"
      },
      {
        "start": 3526,
        "end": 3527,
        "className": "syntax-operator"
      },
      {
        "start": 3528,
        "end": 3532,
        "className": "syntax-variable"
      },
      {
        "start": 3541,
        "end": 3543,
        "className": "syntax-keyword"
      },
      {
        "start": 3544,
        "end": 3551,
        "className": "syntax-variable"
      },
      {
        "start": 3552,
        "end": 3554,
        "className": "syntax-operator"
      },
      {
        "start": 3555,
        "end": 3559,
        "className": "syntax-constant"
      },
      {
        "start": 3573,
        "end": 3577,
        "className": "syntax-variable"
      },
      {
        "start": 3578,
        "end": 3586,
        "className": "syntax-property"
      },
      {
        "start": 3587,
        "end": 3588,
        "className": "syntax-operator"
      },
      {
        "start": 3589,
        "end": 3600,
        "className": "syntax-variable"
      },
      {
        "start": 3601,
        "end": 3613,
        "className": "syntax-property"
      },
      {
        "start": 3624,
        "end": 3628,
        "className": "syntax-keyword"
      },
      {
        "start": 3642,
        "end": 3646,
        "className": "syntax-variable"
      },
      {
        "start": 3647,
        "end": 3655,
        "className": "syntax-property"
      },
      {
        "start": 3656,
        "end": 3657,
        "className": "syntax-operator"
      },
      {
        "start": 3658,
        "end": 3665,
        "className": "syntax-variable"
      },
      {
        "start": 3675,
        "end": 3677,
        "className": "syntax-keyword"
      },
      {
        "start": 3678,
        "end": 3689,
        "className": "syntax-variable"
      },
      {
        "start": 3690,
        "end": 3693,
        "className": "syntax-operator"
      },
      {
        "start": 3694,
        "end": 3698,
        "className": "syntax-variable"
      },
      {
        "start": 3699,
        "end": 3704,
        "className": "syntax-property"
      },
      {
        "start": 3705,
        "end": 3715,
        "className": "syntax-property"
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
    "code": "export function getModuleSpecifiers(\n    moduleSymbol: Symbol,\n    checker: TypeChecker,\n    compilerOptions: CompilerOptions,\n    importingSourceFile: SourceFile,\n    host: ModuleSpecifierResolutionHost,\n    userPreferences: UserPreferences,\n    options: ModuleSpecifierOptions = {},\n): readonly string[] {\n    return getModuleSpecifiersWithCacheInfo(\n        moduleSymbol,\n        checker,\n        compilerOptions,\n        importingSourceFile,\n        host,\n        userPreferences,\n        options,\n        /*forAutoImport*/ false,\n    ).moduleSpecifiers;\n}\n\n/** @internal */\nexport interface ModuleSpecifierResult {\n    kind: ResolvedModuleSpecifierInfo[\"kind\"];\n    moduleSpecifiers: readonly string[];\n    computedWithoutCache: boolean;\n}\n\n/** @internal */\nexport function getModuleSpecifiersWithCacheInfo(\n    moduleSymbol: Symbol,\n    checker: TypeChecker,\n    compilerOptions: CompilerOptions,\n    importingSourceFile: SourceFile | FutureSourceFile,\n    host: ModuleSpecifierResolutionHost,\n    userPreferences: UserPreferences,\n    options: ModuleSpecifierOptions | undefined = {},\n    forAutoImport: boolean,\n): ModuleSpecifierResult {\n    let computedWithoutCache = false;\n    const ambient = tryGetModuleNameFromAmbientModule(moduleSymbol, checker);\n    if (ambient) {\n        return {\n            kind: \"ambient\",\n            moduleSpecifiers: !(forAutoImport && isExcludedByRegex(ambient, userPreferences.autoImportSpecifierExcludeRegexes)) ? [ambient] : emptyArray,\n            computedWithoutCache,\n        };\n    }\n\n    // eslint-disable-next-line prefer-const\n    let [kind, specifiers, moduleSourceFile, modulePaths, cache] = tryGetModuleSpecifiersFromCacheWorker(\n        moduleSymbol,\n        importingSourceFile,\n        host,\n        userPreferences,\n        options,\n    );\n    if (specifiers) return { kind, moduleSpecifiers: specifiers, computedWithoutCache };\n    if (!moduleSourceFile) return { kind: undefined, moduleSpecifiers: emptyArray, computedWithoutCache };\n\n    computedWithoutCache = true;\n    modulePaths ||= getAllModulePathsWorker(getInfo(importingSourceFile.fileName, host), moduleSourceFile.originalFileName, host, compilerOptions, options);\n    const result = computeModuleSpecifiers(\n        modulePaths,\n        compilerOptions,\n        importingSourceFile,\n        host,\n        userPreferences,\n        options,\n        forAutoImport,\n    );\n    cache?.set(importingSourceFile.path, moduleSourceFile.path, userPreferences, options, result.kind, modulePaths, result.moduleSpecifiers);\n    return result;\n}",
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
        "end": 35,
        "className": "syntax-function"
      },
      {
        "start": 35,
        "end": 36,
        "className": "syntax-punctuation"
      },
      {
        "start": 41,
        "end": 53,
        "className": "syntax-variable"
      },
      {
        "start": 55,
        "end": 61,
        "className": "syntax-type"
      },
      {
        "start": 61,
        "end": 62,
        "className": "syntax-punctuation"
      },
      {
        "start": 67,
        "end": 74,
        "className": "syntax-variable"
      },
      {
        "start": 76,
        "end": 87,
        "className": "syntax-type"
      },
      {
        "start": 87,
        "end": 88,
        "className": "syntax-punctuation"
      },
      {
        "start": 93,
        "end": 108,
        "className": "syntax-variable"
      },
      {
        "start": 110,
        "end": 125,
        "className": "syntax-type"
      },
      {
        "start": 125,
        "end": 126,
        "className": "syntax-punctuation"
      },
      {
        "start": 131,
        "end": 150,
        "className": "syntax-variable"
      },
      {
        "start": 152,
        "end": 162,
        "className": "syntax-type"
      },
      {
        "start": 162,
        "end": 163,
        "className": "syntax-punctuation"
      },
      {
        "start": 168,
        "end": 172,
        "className": "syntax-variable"
      },
      {
        "start": 174,
        "end": 203,
        "className": "syntax-type"
      },
      {
        "start": 203,
        "end": 204,
        "className": "syntax-punctuation"
      },
      {
        "start": 209,
        "end": 224,
        "className": "syntax-variable"
      },
      {
        "start": 226,
        "end": 241,
        "className": "syntax-type"
      },
      {
        "start": 241,
        "end": 242,
        "className": "syntax-punctuation"
      },
      {
        "start": 247,
        "end": 254,
        "className": "syntax-variable"
      },
      {
        "start": 256,
        "end": 278,
        "className": "syntax-type"
      },
      {
        "start": 279,
        "end": 280,
        "className": "syntax-operator"
      },
      {
        "start": 281,
        "end": 284,
        "className": "syntax-punctuation"
      },
      {
        "start": 285,
        "end": 286,
        "className": "syntax-punctuation"
      },
      {
        "start": 288,
        "end": 296,
        "className": "syntax-keyword"
      },
      {
        "start": 297,
        "end": 303,
        "className": "syntax-type"
      },
      {
        "start": 303,
        "end": 305,
        "className": "syntax-punctuation"
      },
      {
        "start": 306,
        "end": 307,
        "className": "syntax-punctuation"
      },
      {
        "start": 312,
        "end": 318,
        "className": "syntax-keyword"
      },
      {
        "start": 319,
        "end": 351,
        "className": "syntax-function"
      },
      {
        "start": 351,
        "end": 352,
        "className": "syntax-punctuation"
      },
      {
        "start": 361,
        "end": 373,
        "className": "syntax-variable"
      },
      {
        "start": 373,
        "end": 374,
        "className": "syntax-punctuation"
      },
      {
        "start": 383,
        "end": 390,
        "className": "syntax-variable"
      },
      {
        "start": 390,
        "end": 391,
        "className": "syntax-punctuation"
      },
      {
        "start": 400,
        "end": 415,
        "className": "syntax-variable"
      },
      {
        "start": 415,
        "end": 416,
        "className": "syntax-punctuation"
      },
      {
        "start": 425,
        "end": 444,
        "className": "syntax-variable"
      },
      {
        "start": 444,
        "end": 445,
        "className": "syntax-punctuation"
      },
      {
        "start": 454,
        "end": 458,
        "className": "syntax-variable"
      },
      {
        "start": 458,
        "end": 459,
        "className": "syntax-punctuation"
      },
      {
        "start": 468,
        "end": 483,
        "className": "syntax-variable"
      },
      {
        "start": 483,
        "end": 484,
        "className": "syntax-punctuation"
      },
      {
        "start": 493,
        "end": 500,
        "className": "syntax-variable"
      },
      {
        "start": 500,
        "end": 501,
        "className": "syntax-punctuation"
      },
      {
        "start": 510,
        "end": 527,
        "className": "syntax-comment"
      },
      {
        "start": 528,
        "end": 533,
        "className": "syntax-constant"
      },
      {
        "start": 533,
        "end": 534,
        "className": "syntax-punctuation"
      },
      {
        "start": 539,
        "end": 541,
        "className": "syntax-punctuation"
      },
      {
        "start": 541,
        "end": 557,
        "className": "syntax-property"
      },
      {
        "start": 557,
        "end": 558,
        "className": "syntax-punctuation"
      },
      {
        "start": 559,
        "end": 560,
        "className": "syntax-punctuation"
      },
      {
        "start": 562,
        "end": 578,
        "className": "syntax-comment"
      },
      {
        "start": 579,
        "end": 585,
        "className": "syntax-keyword"
      },
      {
        "start": 586,
        "end": 595,
        "className": "syntax-keyword"
      },
      {
        "start": 596,
        "end": 617,
        "className": "syntax-type"
      },
      {
        "start": 618,
        "end": 619,
        "className": "syntax-punctuation"
      },
      {
        "start": 624,
        "end": 628,
        "className": "syntax-property"
      },
      {
        "start": 630,
        "end": 657,
        "className": "syntax-type"
      },
      {
        "start": 657,
        "end": 658,
        "className": "syntax-punctuation"
      },
      {
        "start": 658,
        "end": 664,
        "className": "syntax-string"
      },
      {
        "start": 664,
        "end": 666,
        "className": "syntax-punctuation"
      },
      {
        "start": 671,
        "end": 687,
        "className": "syntax-property"
      },
      {
        "start": 689,
        "end": 697,
        "className": "syntax-keyword"
      },
      {
        "start": 698,
        "end": 704,
        "className": "syntax-type"
      },
      {
        "start": 704,
        "end": 707,
        "className": "syntax-punctuation"
      },
      {
        "start": 712,
        "end": 732,
        "className": "syntax-property"
      },
      {
        "start": 734,
        "end": 741,
        "className": "syntax-type"
      },
      {
        "start": 741,
        "end": 742,
        "className": "syntax-punctuation"
      },
      {
        "start": 743,
        "end": 744,
        "className": "syntax-punctuation"
      },
      {
        "start": 746,
        "end": 762,
        "className": "syntax-comment"
      },
      {
        "start": 763,
        "end": 769,
        "className": "syntax-keyword"
      },
      {
        "start": 770,
        "end": 778,
        "className": "syntax-keyword"
      },
      {
        "start": 779,
        "end": 811,
        "className": "syntax-function"
      },
      {
        "start": 811,
        "end": 812,
        "className": "syntax-punctuation"
      },
      {
        "start": 817,
        "end": 829,
        "className": "syntax-variable"
      },
      {
        "start": 831,
        "end": 837,
        "className": "syntax-type"
      },
      {
        "start": 837,
        "end": 838,
        "className": "syntax-punctuation"
      },
      {
        "start": 843,
        "end": 850,
        "className": "syntax-variable"
      },
      {
        "start": 852,
        "end": 863,
        "className": "syntax-type"
      },
      {
        "start": 863,
        "end": 864,
        "className": "syntax-punctuation"
      },
      {
        "start": 869,
        "end": 884,
        "className": "syntax-variable"
      },
      {
        "start": 886,
        "end": 901,
        "className": "syntax-type"
      },
      {
        "start": 901,
        "end": 902,
        "className": "syntax-punctuation"
      },
      {
        "start": 907,
        "end": 926,
        "className": "syntax-variable"
      },
      {
        "start": 928,
        "end": 938,
        "className": "syntax-type"
      },
      {
        "start": 939,
        "end": 940,
        "className": "syntax-operator"
      },
      {
        "start": 941,
        "end": 957,
        "className": "syntax-type"
      },
      {
        "start": 957,
        "end": 958,
        "className": "syntax-punctuation"
      },
      {
        "start": 963,
        "end": 967,
        "className": "syntax-variable"
      },
      {
        "start": 969,
        "end": 998,
        "className": "syntax-type"
      },
      {
        "start": 998,
        "end": 999,
        "className": "syntax-punctuation"
      },
      {
        "start": 1004,
        "end": 1019,
        "className": "syntax-variable"
      },
      {
        "start": 1021,
        "end": 1036,
        "className": "syntax-type"
      },
      {
        "start": 1036,
        "end": 1037,
        "className": "syntax-punctuation"
      },
      {
        "start": 1042,
        "end": 1049,
        "className": "syntax-variable"
      },
      {
        "start": 1051,
        "end": 1073,
        "className": "syntax-type"
      },
      {
        "start": 1074,
        "end": 1075,
        "className": "syntax-operator"
      },
      {
        "start": 1076,
        "end": 1085,
        "className": "syntax-constant"
      },
      {
        "start": 1086,
        "end": 1087,
        "className": "syntax-operator"
      },
      {
        "start": 1088,
        "end": 1091,
        "className": "syntax-punctuation"
      },
      {
        "start": 1096,
        "end": 1109,
        "className": "syntax-variable"
      },
      {
        "start": 1111,
        "end": 1118,
        "className": "syntax-type"
      },
      {
        "start": 1118,
        "end": 1119,
        "className": "syntax-punctuation"
      },
      {
        "start": 1120,
        "end": 1121,
        "className": "syntax-punctuation"
      },
      {
        "start": 1123,
        "end": 1144,
        "className": "syntax-type"
      },
      {
        "start": 1145,
        "end": 1146,
        "className": "syntax-punctuation"
      },
      {
        "start": 1151,
        "end": 1154,
        "className": "syntax-keyword"
      },
      {
        "start": 1155,
        "end": 1175,
        "className": "syntax-variable"
      },
      {
        "start": 1176,
        "end": 1177,
        "className": "syntax-operator"
      },
      {
        "start": 1178,
        "end": 1183,
        "className": "syntax-constant"
      },
      {
        "start": 1183,
        "end": 1184,
        "className": "syntax-punctuation"
      },
      {
        "start": 1189,
        "end": 1194,
        "className": "syntax-keyword"
      },
      {
        "start": 1195,
        "end": 1202,
        "className": "syntax-variable"
      },
      {
        "start": 1203,
        "end": 1204,
        "className": "syntax-operator"
      },
      {
        "start": 1205,
        "end": 1238,
        "className": "syntax-function"
      },
      {
        "start": 1238,
        "end": 1239,
        "className": "syntax-punctuation"
      },
      {
        "start": 1239,
        "end": 1251,
        "className": "syntax-variable"
      },
      {
        "start": 1251,
        "end": 1252,
        "className": "syntax-punctuation"
      },
      {
        "start": 1253,
        "end": 1260,
        "className": "syntax-variable"
      },
      {
        "start": 1260,
        "end": 1262,
        "className": "syntax-punctuation"
      },
      {
        "start": 1267,
        "end": 1269,
        "className": "syntax-keyword"
      },
      {
        "start": 1270,
        "end": 1271,
        "className": "syntax-punctuation"
      },
      {
        "start": 1271,
        "end": 1278,
        "className": "syntax-variable"
      },
      {
        "start": 1278,
        "end": 1279,
        "className": "syntax-punctuation"
      },
      {
        "start": 1280,
        "end": 1281,
        "className": "syntax-punctuation"
      },
      {
        "start": 1290,
        "end": 1296,
        "className": "syntax-keyword"
      },
      {
        "start": 1297,
        "end": 1298,
        "className": "syntax-punctuation"
      },
      {
        "start": 1311,
        "end": 1315,
        "className": "syntax-property"
      },
      {
        "start": 1317,
        "end": 1326,
        "className": "syntax-string"
      },
      {
        "start": 1326,
        "end": 1327,
        "className": "syntax-punctuation"
      },
      {
        "start": 1340,
        "end": 1356,
        "className": "syntax-property"
      },
      {
        "start": 1358,
        "end": 1359,
        "className": "syntax-operator"
      },
      {
        "start": 1359,
        "end": 1360,
        "className": "syntax-punctuation"
      },
      {
        "start": 1360,
        "end": 1373,
        "className": "syntax-variable"
      },
      {
        "start": 1374,
        "end": 1376,
        "className": "syntax-operator"
      },
      {
        "start": 1377,
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
        "end": 1402,
        "className": "syntax-variable"
      },
      {
        "start": 1402,
        "end": 1403,
        "className": "syntax-punctuation"
      },
      {
        "start": 1404,
        "end": 1419,
        "className": "syntax-variable"
      },
      {
        "start": 1419,
        "end": 1420,
        "className": "syntax-punctuation"
      },
      {
        "start": 1420,
        "end": 1453,
        "className": "syntax-property"
      },
      {
        "start": 1453,
        "end": 1455,
        "className": "syntax-punctuation"
      },
      {
        "start": 1458,
        "end": 1459,
        "className": "syntax-punctuation"
      },
      {
        "start": 1459,
        "end": 1466,
        "className": "syntax-variable"
      },
      {
        "start": 1466,
        "end": 1467,
        "className": "syntax-punctuation"
      },
      {
        "start": 1470,
        "end": 1480,
        "className": "syntax-variable"
      },
      {
        "start": 1480,
        "end": 1481,
        "className": "syntax-punctuation"
      },
      {
        "start": 1514,
        "end": 1515,
        "className": "syntax-punctuation"
      },
      {
        "start": 1524,
        "end": 1526,
        "className": "syntax-punctuation"
      },
      {
        "start": 1531,
        "end": 1532,
        "className": "syntax-punctuation"
      },
      {
        "start": 1538,
        "end": 1578,
        "className": "syntax-comment"
      },
      {
        "start": 1583,
        "end": 1586,
        "className": "syntax-keyword"
      },
      {
        "start": 1587,
        "end": 1588,
        "className": "syntax-punctuation"
      },
      {
        "start": 1588,
        "end": 1592,
        "className": "syntax-variable"
      },
      {
        "start": 1592,
        "end": 1593,
        "className": "syntax-punctuation"
      },
      {
        "start": 1594,
        "end": 1604,
        "className": "syntax-variable"
      },
      {
        "start": 1604,
        "end": 1605,
        "className": "syntax-punctuation"
      },
      {
        "start": 1606,
        "end": 1622,
        "className": "syntax-variable"
      },
      {
        "start": 1622,
        "end": 1623,
        "className": "syntax-punctuation"
      },
      {
        "start": 1624,
        "end": 1635,
        "className": "syntax-variable"
      },
      {
        "start": 1635,
        "end": 1636,
        "className": "syntax-punctuation"
      },
      {
        "start": 1637,
        "end": 1642,
        "className": "syntax-variable"
      },
      {
        "start": 1642,
        "end": 1643,
        "className": "syntax-punctuation"
      },
      {
        "start": 1644,
        "end": 1645,
        "className": "syntax-operator"
      },
      {
        "start": 1646,
        "end": 1683,
        "className": "syntax-function"
      },
      {
        "start": 1683,
        "end": 1684,
        "className": "syntax-punctuation"
      },
      {
        "start": 1693,
        "end": 1705,
        "className": "syntax-variable"
      },
      {
        "start": 1705,
        "end": 1706,
        "className": "syntax-punctuation"
      },
      {
        "start": 1715,
        "end": 1734,
        "className": "syntax-variable"
      },
      {
        "start": 1734,
        "end": 1735,
        "className": "syntax-punctuation"
      },
      {
        "start": 1744,
        "end": 1748,
        "className": "syntax-variable"
      },
      {
        "start": 1748,
        "end": 1749,
        "className": "syntax-punctuation"
      },
      {
        "start": 1758,
        "end": 1773,
        "className": "syntax-variable"
      },
      {
        "start": 1773,
        "end": 1774,
        "className": "syntax-punctuation"
      },
      {
        "start": 1783,
        "end": 1790,
        "className": "syntax-variable"
      },
      {
        "start": 1790,
        "end": 1791,
        "className": "syntax-punctuation"
      },
      {
        "start": 1796,
        "end": 1798,
        "className": "syntax-punctuation"
      },
      {
        "start": 1803,
        "end": 1805,
        "className": "syntax-keyword"
      },
      {
        "start": 1806,
        "end": 1807,
        "className": "syntax-punctuation"
      },
      {
        "start": 1807,
        "end": 1817,
        "className": "syntax-variable"
      },
      {
        "start": 1817,
        "end": 1818,
        "className": "syntax-punctuation"
      },
      {
        "start": 1819,
        "end": 1825,
        "className": "syntax-keyword"
      },
      {
        "start": 1826,
        "end": 1827,
        "className": "syntax-punctuation"
      },
      {
        "start": 1832,
        "end": 1833,
        "className": "syntax-punctuation"
      },
      {
        "start": 1834,
        "end": 1850,
        "className": "syntax-property"
      },
      {
        "start": 1852,
        "end": 1862,
        "className": "syntax-variable"
      },
      {
        "start": 1862,
        "end": 1863,
        "className": "syntax-punctuation"
      },
      {
        "start": 1885,
        "end": 1887,
        "className": "syntax-punctuation"
      },
      {
        "start": 1892,
        "end": 1894,
        "className": "syntax-keyword"
      },
      {
        "start": 1895,
        "end": 1896,
        "className": "syntax-punctuation"
      },
      {
        "start": 1896,
        "end": 1897,
        "className": "syntax-operator"
      },
      {
        "start": 1897,
        "end": 1913,
        "className": "syntax-variable"
      },
      {
        "start": 1913,
        "end": 1914,
        "className": "syntax-punctuation"
      },
      {
        "start": 1915,
        "end": 1921,
        "className": "syntax-keyword"
      },
      {
        "start": 1922,
        "end": 1923,
        "className": "syntax-punctuation"
      },
      {
        "start": 1924,
        "end": 1928,
        "className": "syntax-property"
      },
      {
        "start": 1930,
        "end": 1939,
        "className": "syntax-constant"
      },
      {
        "start": 1939,
        "end": 1940,
        "className": "syntax-punctuation"
      },
      {
        "start": 1941,
        "end": 1957,
        "className": "syntax-property"
      },
      {
        "start": 1959,
        "end": 1969,
        "className": "syntax-variable"
      },
      {
        "start": 1969,
        "end": 1970,
        "className": "syntax-punctuation"
      },
      {
        "start": 1992,
        "end": 1994,
        "className": "syntax-punctuation"
      },
      {
        "start": 2000,
        "end": 2020,
        "className": "syntax-variable"
      },
      {
        "start": 2021,
        "end": 2022,
        "className": "syntax-operator"
      },
      {
        "start": 2023,
        "end": 2027,
        "className": "syntax-constant"
      },
      {
        "start": 2027,
        "end": 2028,
        "className": "syntax-punctuation"
      },
      {
        "start": 2033,
        "end": 2044,
        "className": "syntax-variable"
      },
      {
        "start": 2045,
        "end": 2048,
        "className": "syntax-operator"
      },
      {
        "start": 2049,
        "end": 2072,
        "className": "syntax-function"
      },
      {
        "start": 2072,
        "end": 2073,
        "className": "syntax-punctuation"
      },
      {
        "start": 2073,
        "end": 2080,
        "className": "syntax-function"
      },
      {
        "start": 2080,
        "end": 2081,
        "className": "syntax-punctuation"
      },
      {
        "start": 2081,
        "end": 2100,
        "className": "syntax-variable"
      },
      {
        "start": 2100,
        "end": 2101,
        "className": "syntax-punctuation"
      },
      {
        "start": 2101,
        "end": 2109,
        "className": "syntax-property"
      },
      {
        "start": 2109,
        "end": 2110,
        "className": "syntax-punctuation"
      },
      {
        "start": 2111,
        "end": 2115,
        "className": "syntax-variable"
      },
      {
        "start": 2115,
        "end": 2117,
        "className": "syntax-punctuation"
      },
      {
        "start": 2118,
        "end": 2134,
        "className": "syntax-variable"
      },
      {
        "start": 2134,
        "end": 2135,
        "className": "syntax-punctuation"
      },
      {
        "start": 2135,
        "end": 2151,
        "className": "syntax-property"
      },
      {
        "start": 2151,
        "end": 2152,
        "className": "syntax-punctuation"
      },
      {
        "start": 2153,
        "end": 2157,
        "className": "syntax-variable"
      },
      {
        "start": 2157,
        "end": 2158,
        "className": "syntax-punctuation"
      },
      {
        "start": 2159,
        "end": 2174,
        "className": "syntax-variable"
      },
      {
        "start": 2174,
        "end": 2175,
        "className": "syntax-punctuation"
      },
      {
        "start": 2176,
        "end": 2183,
        "className": "syntax-variable"
      },
      {
        "start": 2183,
        "end": 2185,
        "className": "syntax-punctuation"
      },
      {
        "start": 2190,
        "end": 2195,
        "className": "syntax-keyword"
      },
      {
        "start": 2196,
        "end": 2202,
        "className": "syntax-variable"
      },
      {
        "start": 2203,
        "end": 2204,
        "className": "syntax-operator"
      },
      {
        "start": 2205,
        "end": 2228,
        "className": "syntax-function"
      },
      {
        "start": 2228,
        "end": 2229,
        "className": "syntax-punctuation"
      },
      {
        "start": 2238,
        "end": 2249,
        "className": "syntax-variable"
      },
      {
        "start": 2249,
        "end": 2250,
        "className": "syntax-punctuation"
      },
      {
        "start": 2259,
        "end": 2274,
        "className": "syntax-variable"
      },
      {
        "start": 2274,
        "end": 2275,
        "className": "syntax-punctuation"
      },
      {
        "start": 2284,
        "end": 2303,
        "className": "syntax-variable"
      },
      {
        "start": 2303,
        "end": 2304,
        "className": "syntax-punctuation"
      },
      {
        "start": 2313,
        "end": 2317,
        "className": "syntax-variable"
      },
      {
        "start": 2317,
        "end": 2318,
        "className": "syntax-punctuation"
      },
      {
        "start": 2327,
        "end": 2342,
        "className": "syntax-variable"
      },
      {
        "start": 2342,
        "end": 2343,
        "className": "syntax-punctuation"
      },
      {
        "start": 2352,
        "end": 2359,
        "className": "syntax-variable"
      },
      {
        "start": 2359,
        "end": 2360,
        "className": "syntax-punctuation"
      },
      {
        "start": 2369,
        "end": 2382,
        "className": "syntax-variable"
      },
      {
        "start": 2382,
        "end": 2383,
        "className": "syntax-punctuation"
      },
      {
        "start": 2388,
        "end": 2390,
        "className": "syntax-punctuation"
      },
      {
        "start": 2395,
        "end": 2400,
        "className": "syntax-variable"
      },
      {
        "start": 2400,
        "end": 2402,
        "className": "syntax-punctuation"
      },
      {
        "start": 2402,
        "end": 2405,
        "className": "syntax-function"
      },
      {
        "start": 2405,
        "end": 2406,
        "className": "syntax-punctuation"
      },
      {
        "start": 2406,
        "end": 2425,
        "className": "syntax-variable"
      },
      {
        "start": 2425,
        "end": 2426,
        "className": "syntax-punctuation"
      },
      {
        "start": 2426,
        "end": 2430,
        "className": "syntax-property"
      },
      {
        "start": 2430,
        "end": 2431,
        "className": "syntax-punctuation"
      },
      {
        "start": 2432,
        "end": 2448,
        "className": "syntax-variable"
      },
      {
        "start": 2448,
        "end": 2449,
        "className": "syntax-punctuation"
      },
      {
        "start": 2449,
        "end": 2453,
        "className": "syntax-property"
      },
      {
        "start": 2453,
        "end": 2454,
        "className": "syntax-punctuation"
      },
      {
        "start": 2455,
        "end": 2470,
        "className": "syntax-variable"
      },
      {
        "start": 2470,
        "end": 2471,
        "className": "syntax-punctuation"
      },
      {
        "start": 2472,
        "end": 2479,
        "className": "syntax-variable"
      },
      {
        "start": 2479,
        "end": 2480,
        "className": "syntax-punctuation"
      },
      {
        "start": 2481,
        "end": 2487,
        "className": "syntax-variable"
      },
      {
        "start": 2487,
        "end": 2488,
        "className": "syntax-punctuation"
      },
      {
        "start": 2488,
        "end": 2492,
        "className": "syntax-property"
      },
      {
        "start": 2492,
        "end": 2493,
        "className": "syntax-punctuation"
      },
      {
        "start": 2494,
        "end": 2505,
        "className": "syntax-variable"
      },
      {
        "start": 2505,
        "end": 2506,
        "className": "syntax-punctuation"
      },
      {
        "start": 2507,
        "end": 2513,
        "className": "syntax-variable"
      },
      {
        "start": 2513,
        "end": 2514,
        "className": "syntax-punctuation"
      },
      {
        "start": 2514,
        "end": 2530,
        "className": "syntax-property"
      },
      {
        "start": 2530,
        "end": 2532,
        "className": "syntax-punctuation"
      },
      {
        "start": 2537,
        "end": 2543,
        "className": "syntax-keyword"
      },
      {
        "start": 2544,
        "end": 2550,
        "className": "syntax-variable"
      },
      {
        "start": 2550,
        "end": 2551,
        "className": "syntax-punctuation"
      },
      {
        "start": 2552,
        "end": 2553,
        "className": "syntax-punctuation"
      }
    ]
  }
];
