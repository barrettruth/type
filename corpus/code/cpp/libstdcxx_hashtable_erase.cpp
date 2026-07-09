    auto
    _Hashtable<_Key, _Value, _Alloc, _ExtractKey, _Equal,
               _Hash, _RangeHash, _Unused, _RehashPolicy, _Traits>::
    _M_erase(size_type __bkt, __node_base_ptr __prev_n, __node_ptr __n)
    -> iterator
    {
      if (__prev_n == _M_buckets[__bkt])
        _M_remove_bucket_begin(__bkt, __n->_M_next(),
          __n->_M_nxt ? _M_bucket_index(*__n->_M_next()) : 0);
      else if (__n->_M_nxt)
        {
          size_type __next_bkt = _M_bucket_index(*__n->_M_next());
          if (__next_bkt != __bkt)
            _M_buckets[__next_bkt] = __prev_n;
        }

      __prev_n->_M_nxt = __n->_M_nxt;
      iterator __result(__n->_M_next());
      this->_M_deallocate_node(__n);
      --_M_element_count;

      return __result;
    }

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wc++17-extensions" // if constexpr
  template<typename _Key, typename _Value, typename _Alloc,
           typename _ExtractKey, typename _Equal,
           typename _Hash, typename _RangeHash, typename _Unused,
           typename _RehashPolicy, typename _Traits>
    auto
    _Hashtable<_Key, _Value, _Alloc, _ExtractKey, _Equal,
               _Hash, _RangeHash, _Unused, _RehashPolicy, _Traits>::
    erase(const key_type& __k)
    -> size_type
    {
      auto __loc = _M_locate(__k);
      if (!__loc)
        return 0;

      __node_base_ptr __prev_n = __loc._M_before;
      __node_ptr __n = __loc._M_node();
      auto __bkt = __loc._M_bucket_index;
      if (__bkt == size_type(-1))
        __bkt = _M_bucket_index(*__n);

      if constexpr (__unique_keys::value)
        {
          _M_erase(__bkt, __prev_n, __n);
          return 1;
        }
      else
        {
          // _GLIBCXX_RESOLVE_LIB_DEFECTS
          // 526. Is it undefined if a function in the standard changes
          // in parameters?
          // We use one loop to find all matching nodes and another to
          // deallocate them so that the key stays valid during the first loop.
          // It might be invalidated indirectly when destroying nodes.
          __node_ptr __n_last = __n->_M_next();
          while (__n_last && this->_M_node_equals(*__n, *__n_last))
            __n_last = __n_last->_M_next();

          std::size_t __n_last_bkt
            = __n_last ? _M_bucket_index(*__n_last) : __bkt;

          // Deallocate nodes.
          size_type __result = 0;
          do
            {
              __node_ptr __p = __n->_M_next();
              this->_M_deallocate_node(__n);
              __n = __p;
              ++__result;
            }
          while (__n != __n_last);

          _M_element_count -= __result;
          if (__prev_n == _M_buckets[__bkt])
            _M_remove_bucket_begin(__bkt, __n_last, __n_last_bkt);
          else if (__n_last_bkt != __bkt)
            _M_buckets[__n_last_bkt] = __prev_n;
          __prev_n->_M_nxt = __n_last;
          return __result;
        }
    }
#pragma GCC diagnostic pop
