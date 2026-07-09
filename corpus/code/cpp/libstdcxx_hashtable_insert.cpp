    auto
    _Hashtable<_Key, _Value, _Alloc, _ExtractKey, _Equal,
               _Hash, _RangeHash, _Unused, _RehashPolicy, _Traits>::
    _M_insert_unique_node(size_type __bkt, __hash_code __code,
                          __node_ptr __node, size_type __n_elt)
    -> iterator
    {
      __rehash_guard_t __rehash_guard(_M_rehash_policy);
      std::pair<bool, std::size_t> __do_rehash
        = _M_rehash_policy._M_need_rehash(_M_bucket_count, _M_element_count,
                                          __n_elt);

      if (__do_rehash.first)
        {
          _M_rehash(__do_rehash.second, true_type{});
          __bkt = _M_bucket_index(__code);
        }

      __rehash_guard._M_guarded_obj = nullptr;
      _M_store_code(*__node, __code);

      // Always insert at the beginning of the bucket.
      _M_insert_bucket_begin(__bkt, __node);
      ++_M_element_count;
      return iterator(__node);
    }

  template<typename _Key, typename _Value, typename _Alloc,
           typename _ExtractKey, typename _Equal,
           typename _Hash, typename _RangeHash, typename _Unused,
           typename _RehashPolicy, typename _Traits>
    auto
    _Hashtable<_Key, _Value, _Alloc, _ExtractKey, _Equal,
               _Hash, _RangeHash, _Unused, _RehashPolicy, _Traits>::
    _M_insert_multi_node(__node_ptr __hint,
                         __hash_code __code, __node_ptr __node)
    -> iterator
    {
      __rehash_guard_t __rehash_guard(_M_rehash_policy);
      std::pair<bool, std::size_t> __do_rehash
        = _M_rehash_policy._M_need_rehash(_M_bucket_count, _M_element_count, 1);

      if (__do_rehash.first)
        _M_rehash(__do_rehash.second, false_type{});

      __rehash_guard._M_guarded_obj = nullptr;
      _M_store_code(*__node, __code);
      const key_type& __k = _ExtractKey{}(__node->_M_v());
      size_type __bkt = _M_bucket_index(__code);

      // Find the node before an equivalent one or use hint if it exists and
      // if it is equivalent.
      __node_base_ptr __prev
        = __builtin_expect(__hint != nullptr, false)
          && this->_M_equals(__k, __code, *__hint)
            ? __hint
            : _M_find_before_node(__bkt, __k, __code);

      if (__prev)
        {
          // Insert after the node before the equivalent one.
          __node->_M_nxt = __prev->_M_nxt;
          __prev->_M_nxt = __node;
          if (__builtin_expect(__prev == __hint, false))
            // hint might be the last bucket node, in this case we need to
            // update next bucket.
            if (__node->_M_nxt
                && !this->_M_equals(__k, __code, *__node->_M_next()))
              {
                size_type __next_bkt = _M_bucket_index(*__node->_M_next());
                if (__next_bkt != __bkt)
                  _M_buckets[__next_bkt] = __node;
              }
        }
      else
        // The inserted node has no equivalent in the hashtable. We must
        // insert the new node at the beginning of the bucket to preserve
        // equivalent elements' relative positions.
        _M_insert_bucket_begin(__bkt, __node);
      ++_M_element_count;
